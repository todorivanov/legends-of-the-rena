import { Referee } from '../entities/referee.js';
// Helpers and EventManager imports removed - no longer needed after Team Battle removal
import { Logger } from '../utils/logger.js';
import { getFighters } from '../api/mockFighters.js';
import { GameStateManager } from './GameStateManager.js';
import { CombatEngine } from './CombatEngine.js';
import { hudManager } from '../utils/hudManager.js';
import { TurnManager } from './TurnManager.js';
import { soundManager } from '../utils/soundManager.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { LevelingSystem } from './LevelingSystem.js';
import { EquipmentManager } from './EquipmentManager.js';
import { DifficultyManager } from './DifficultyManager.js';
import { EconomyManager } from './EconomyManager.js';
import { DurabilityManager } from './DurabilityManager.js';
import { StoryMode } from './StoryMode.js';
import { createAI } from '../ai/AIManager.js';
import { comboSystem } from './ComboSystem.js';
import { combatPhaseManager, CombatPhase } from './CombatPhaseManager.js';
import { gridManager } from './GridManager.js';
import { gridCombatIntegration } from './GridCombatIntegration.js';

// ROUND_INTERVAL removed - no longer needed after Team Battle removal
const AI_TURN_DELAY = 1200;

// Game instance state manager
let gameState = null;
let autoBattleEnabled = false;
let currentStoryMission = null; // Track if we're in a story mission
let currentPlayerFighter = null; // Track player fighter
let currentEnemyFighter = null; // Track enemy fighter
let aiManagers = {}; // Track AI managers for fighters

export default class Game {
  /**
   * Enable or disable auto-battle mode
   * @param {boolean} enabled
   */
  static setAutoBattle(enabled) {
    autoBattleEnabled = enabled;
    console.log('🤖 Auto Battle:', enabled ? 'ENABLED' : 'DISABLED');

    // Log to combat log
    const message = enabled
      ? '<div class="attack-div text-center" style="background: rgba(0, 230, 118, 0.2); border-left-color: #00e676;">🤖 <strong>Auto Battle ENABLED</strong> - AI will control both fighters</div>'
      : '<div class="attack-div text-center" style="background: rgba(255, 167, 38, 0.2); border-left-color: #ffa726;">🎮 <strong>Auto Battle DISABLED</strong> - Manual control resumed</div>';

    Logger.log(message);
    soundManager.play('event');
  }
  /**
   * Start a 1v1 fighter match with turn-based combat
   * @param {Object} firstFighter - First fighter (player)
   * @param {Object} secondFighter - Second fighter (enemy)
   * @param {string} missionId - Optional story mission ID
   */
  static async startGame(firstFighter, secondFighter, missionId = null) {
    // Initialize clean state
    this.stopGame();
    gameState = new GameStateManager();
    comboSystem.reset(); // Reset combo tracking for new battle
    const turnManager = new TurnManager();

    // Initialize combat phase manager
    combatPhaseManager.reset();
    combatPhaseManager.initialize(firstFighter, secondFighter, turnManager);
    this.registerCombatHooks(); // Register phase hooks

    // Store fighter references globally
    currentPlayerFighter = firstFighter;
    currentEnemyFighter = secondFighter;

    // Initialize story mission tracking if provided
    if (missionId) {
      currentStoryMission = StoryMode.startMission(missionId);
      if (!currentStoryMission) {
        Logger.log('<div class="error-message">❌ Failed to start mission</div>');
        return;
      }
    } else {
      currentStoryMission = null;
    }

    // Initialize AI managers for fighters
    const difficulty = SaveManager.get('settings.difficulty') || 'normal';

    // Create AI for player (only used in auto-battle)
    if (!firstFighter.isPlayer || autoBattleEnabled) {
      aiManagers[firstFighter.id] = createAI(firstFighter, difficulty);
    }

    // Create AI for opponent
    if (!secondFighter.isPlayer) {
      aiManagers[secondFighter.id] = createAI(secondFighter, difficulty);
      console.log('🤖 Enemy AI Personality:', aiManagers[secondFighter.id].getPersonalityInfo());
    }

    Logger.clearLog();
    Referee.introduceFighters(firstFighter, secondFighter);

    // Initialize grid combat
    gridCombatIntegration.initializeBattle(firstFighter, secondFighter);
    this.initializeGridUI();

    // Initialize HUD
    hudManager.initSingleFight(firstFighter, secondFighter);

    let roundCount = 0;

    // Start battle with phase system
    await combatPhaseManager.startBattle();

    // Main turn-based game loop using phase system
    const processTurn = async () => {
      if (turnManager.isPaused) {
        setTimeout(processTurn, 100);
        return;
      }

      // Start new round every 2 turns
      if (turnManager.turnNumber % 2 === 0) {
        roundCount++;
        hudManager.setRound(roundCount);
        Referee.showRoundNumber();

        // Track round completion for story mode
        if (currentStoryMission) {
          StoryMode.trackMissionEvent('round_complete');
        }

        // Regenerate mana for both fighters
        firstFighter.regenerateMana();
        secondFighter.regenerateMana();
        hudManager.update();
      }

      turnManager.startTurn();

      // Get active fighter
      const activeFighter = turnManager.isPlayerTurn() ? firstFighter : secondFighter;
      const targetFighter = turnManager.isPlayerTurn() ? secondFighter : firstFighter;

      // Start turn with phase system
      await combatPhaseManager.startTurn(activeFighter);

      // Show turn indicator
      this.showTurnIndicator(activeFighter.name);

      // Process status effects at turn start (handled by phase hooks)
      activeFighter.processStatusEffects();
      activeFighter.tickSkillCooldowns();
      hudManager.update();

      if (turnManager.isPlayerTurn() && !autoBattleEnabled) {
        // Check if opponent is in attack range
        const inRange = gridCombatIntegration.isTargetInRange(firstFighter.id, secondFighter.id);
        const attackRange = gridCombatIntegration.getAttackRangeForFighter(firstFighter);

        if (!inRange) {
          Logger.log(
            `<div class="system-message" style="background: rgba(255, 193, 7, 0.2); border-left: 3px solid #ffc107;">⚠️ <strong>Enemy out of range!</strong> (Need range ${attackRange})</div>`
          );
          Logger.log(
            `<div class="system-message">💡 Use your <strong>movement skill</strong> to get closer before attacking!</div>`
          );
        }

        // Manual: Player's turn - wait for input using Web Component
        const actionSelection = document.createElement('action-selection');
        actionSelection.fighter = firstFighter;
        actionSelection.dataset.opponentId = secondFighter.id;
        actionSelection.dataset.attackRange = attackRange;
        actionSelection.dataset.inRange = inRange;
        actionSelection.addEventListener('action-selected', async (e) => {
          actionSelection.remove();
          // Remove combo hints when action is selected
          document.querySelectorAll('combo-hint').forEach((el) => el.remove());
          await this.executeActionPhased(
            firstFighter,
            secondFighter,
            e.detail,
            turnManager,
            processTurn
          );
        });
        
        // Append to action-area in combat arena if available, otherwise body
        const arena = document.querySelector('combat-arena');
        const actionArea = arena?.shadowRoot?.querySelector('#action-area');
        if (actionArea) {
          actionArea.appendChild(actionSelection);
        } else {
          document.body.appendChild(actionSelection);
        }

        // Show combo hints for player
        const suggestions = comboSystem.getComboSuggestions(firstFighter);
        if (suggestions.length > 0) {
          const comboHint = document.createElement('combo-hint');
          comboHint.suggestions = suggestions;
          document.body.appendChild(comboHint);
        }
      } else {
        // Auto-battle or AI turn
        setTimeout(async () => {
          const aiActionData = this.chooseAIAction(activeFighter, targetFighter);
          await this.executeActionPhased(
            activeFighter,
            targetFighter,
            aiActionData,
            turnManager,
            processTurn
          );
        }, AI_TURN_DELAY);
      }
    };

    // Start first turn
    processTurn();
  }

  /**
   * Execute an action (player or AI)
   */
  static executeAction(attacker, defender, actionData, turnManager, callback) {
    const action = actionData.action || actionData;

    // Handle surrender
    if (action === 'surrender') {
      Logger.log(
        `<div class="attack-div text-center" style="background: #f8d7da; border-left-color: #ff1744;">🏳️ <strong>${attacker.name}</strong> has surrendered!</div>`
      );

      // Remove action selection
      document.querySelectorAll('action-selection').forEach((el) => el.remove());

      // Declare opponent as winner
      setTimeout(() => {
        Referee.declareWinner(defender);
        hudManager.showWinner(defender);

        // Handle story mission failure from surrender
        if (currentStoryMission) {
          const playerState = {
            currentHP: currentPlayerFighter.health,
            maxHP: currentPlayerFighter.maxHealth,
          };
          const missionResult = StoryMode.completeMission(false, playerState);

          setTimeout(() => {
            if (window.showMissionResults) {
              window.showMissionResults(missionResult);
            }
          }, 2000);

          // Clear story mission state
          currentStoryMission = null;
          currentPlayerFighter = null;
          currentEnemyFighter = null;
        } else {
          // Track loss from surrender (normal combat)
          SaveManager.increment('stats.totalLosses');
          SaveManager.increment('stats.totalFightsPlayed');
          SaveManager.update('stats.winStreak', 0); // Reset streak

          // Small XP for attempt
          LevelingSystem.awardXP(25, 'Battle Participation');

          // Show victory screen for opponent
          setTimeout(() => {
            if (window.showVictoryScreen) {
              window.showVictoryScreen(defender);
            }
          }, 2000);
        }
      }, 1000);
      return;
    }

    // Record action for combo tracking
    let skillName = null;
    if (action === 'skill' && actionData.skillIndex !== undefined) {
      skillName = attacker.skills[actionData.skillIndex]?.name;
    }
    comboSystem.recordAction(attacker, action, skillName);

    switch (action) {
      case 'attack': {
        const attackResult = attacker.normalAttack();

        // Apply combo effects to damage
        attackResult.damage = comboSystem.applyComboEffects(
          attacker,
          defender,
          attackResult.damage
        );

        const actualDmg = defender.takeDamage(attackResult.damage);

        // Track player stats
        if (attacker.isPlayer) {
          SaveManager.increment('stats.totalDamageDealt', actualDmg);
          if (attackResult.isCritical) {
            SaveManager.increment('stats.criticalHits');
          }

          // Track story mode events
          if (currentStoryMission) {
            StoryMode.trackMissionEvent('damage_dealt', { amount: actualDmg });
            if (attackResult.isCritical) {
              StoryMode.trackMissionEvent('critical_hit');
            }
          }
        }
        if (defender.isPlayer) {
          SaveManager.increment('stats.totalDamageTaken', actualDmg);

          // Track story mode events
          if (currentStoryMission) {
            StoryMode.trackMissionEvent('damage_taken', { amount: actualDmg });
          }
        }

        // Increase combo on successful attack
        attacker.combo++;
        if (attacker.combo >= 3) {
          this.showComboIndicator(attacker.combo);
          const bonusDmg = Math.ceil(actualDmg * 0.2);
          defender.health -= bonusDmg;
          Logger.log(
            `<div class="attack-div text-center" style="background: #fff3cd;">🔥 <strong>COMBO x${attacker.combo}!</strong> <span class="badge bg-warning">+${bonusDmg} bonus damage</span></div>`
          );

          // Track combo for story mode
          if (currentStoryMission && attacker.isPlayer) {
            StoryMode.trackMissionEvent('combo', { combo: attacker.combo });
          }
        }
        break;
      }

      case 'defend':
        attacker.defend();
        attacker.combo = 0; // Reset combo on defend

        // Track defend for story mode
        if (currentStoryMission && attacker.isPlayer) {
          StoryMode.trackMissionEvent('defended');
        }
        break;

      case 'skill': {
        const skillIndex = actionData.skillIndex;
        if (skillIndex !== undefined && attacker.skills[skillIndex]) {
          const skill = attacker.skills[skillIndex];
          const success = skill.use(attacker, defender);
          if (success) {
            if (attacker.isPlayer) {
              SaveManager.increment('stats.skillsUsed');

              // Track skill use for story mode
              if (currentStoryMission) {
                StoryMode.trackMissionEvent('skill_used');
              }
            }
            attacker.combo = 0; // Reset combo on skill use
          }
        }
        break;
      }

      case 'item': {
        const previousHealth = attacker.health;
        attacker.useItem();
        if (attacker.isPlayer) {
          SaveManager.increment('stats.itemsUsed');

          // Track item use for story mode
          if (currentStoryMission) {
            const isHealing = attacker.health > previousHealth;
            StoryMode.trackMissionEvent('item_used', { isHealing });
          }
        }
        attacker.combo = 0; // Reset combo on item use
        break;
      }
    }

    // Defender's combo resets when taking damage
    if (action === 'attack' || action === 'skill') {
      defender.combo = 0;
    }

    // Update HUD
    hudManager.update();

    // Check victory condition
    const result = CombatEngine.checkVictoryCondition(attacker, defender, false);
    if (result) {
      Referee.declareWinner(result.winner);
      hudManager.showWinner(result.winner);
      // Remove any existing action-selection components
      document.querySelectorAll('action-selection').forEach((el) => el.remove());

      // Award XP and track stats based on winner
      const playerWon = result.winner.isPlayer;

      // Handle story mission completion
      if (currentStoryMission) {
        // Get player's final state (use stored reference)
        const playerState = {
          currentHP: currentPlayerFighter.health,
          maxHP: currentPlayerFighter.maxHealth,
        };

        const missionResult = StoryMode.completeMission(playerWon, playerState);

        // Apply durability loss after story mission
        DurabilityManager.applyBattleWear();

        // Show mission results screen after delay
        setTimeout(() => {
          if (window.showMissionResults) {
            window.showMissionResults(missionResult);
          } else if (window.showVictoryScreen) {
            window.showVictoryScreen(result.winner);
          }
        }, 2000);

        // Clear story mission state
        currentStoryMission = null;
        currentPlayerFighter = null;
        currentEnemyFighter = null;
        return;
      }

      // Normal combat (non-story mode)
      SaveManager.increment('stats.totalFightsPlayed');

      if (playerWon) {
        const xpReward = 100; // Base XP for single fight victory
        SaveManager.increment('stats.totalWins');
        SaveManager.increment('stats.winStreak');
        const bestStreak = SaveManager.get('stats.bestStreak') || 0;
        if (SaveManager.get('stats.winStreak') > bestStreak) {
          SaveManager.update('stats.bestStreak', SaveManager.get('stats.winStreak'));
        }
        LevelingSystem.awardXP(xpReward, 'Victory in Single Combat');

        // Award gold based on difficulty
        const difficulty = SaveManager.get('settings.difficulty') || 'normal';
        const enemyLevel = currentEnemyFighter?.level || 1;
        const goldReward = EconomyManager.calculateBattleReward(difficulty, true, enemyLevel);
        EconomyManager.addGold(goldReward, 'Battle Victory');

        // Apply durability loss to equipped items
        DurabilityManager.applyBattleWear();

        // Award random equipment drop (difficulty-based chance)
        const dropRate = DifficultyManager.getEquipmentDropRate();
        if (Math.random() < dropRate) {
          setTimeout(() => {
            EquipmentManager.awardRandomDrop();
          }, 1000);
        }
      } else {
        // Player lost
        SaveManager.increment('stats.totalLosses');
        SaveManager.update('stats.winStreak', 0); // Reset streak
        LevelingSystem.awardXP(50, 'Battle Participation'); // Consolation XP
      }

      // Show victory screen after delay
      setTimeout(() => {
        if (window.showVictoryScreen) {
          window.showVictoryScreen(result.winner);
        }
        // Clear fighter references
        currentPlayerFighter = null;
        currentEnemyFighter = null;
      }, 2000);
      return;
    }

    // Next turn
    turnManager.nextTurn();
    setTimeout(callback, 800);
  }

  /**
   * Handle grid-based movement
   */
  static async handleGridMovement(attacker, defender, _turnManager) {
    return new Promise((resolve) => {
      Logger.log(
        `<div class="system-message">🏃 ${attacker.name} is choosing where to move...</div>`
      );

      // Get the grid UI
      const arena = document.querySelector('combat-arena');
      if (!arena || !arena.shadowRoot) {
        Logger.log(`<div class="system-message">❌ Grid not available!</div>`);
        resolve();
        return;
      }

      const gridArea = arena.shadowRoot.querySelector('#grid-area');
      const gridUI = gridArea?.querySelector('grid-combat-ui');

      if (!gridUI) {
        Logger.log(`<div class="system-message">❌ Grid UI not found!</div>`);
        resolve();
        return;
      }

      // Get valid moves for the attacker
      const validMoves = gridCombatIntegration.getValidMoves(attacker.id);

      if (validMoves.length === 0) {
        Logger.log(`<div class="system-message">⚠️ ${attacker.name} has no valid moves!</div>`);
        resolve();
        return;
      }

      // AI auto-moves toward opponent
      if (!attacker.isPlayer) {
        // AI chooses move closest to opponent
        const opponentPos = defender.gridPosition;
        if (!opponentPos) {
          resolve();
          return;
        }

        // Find move closest to opponent
        let bestMove = validMoves[0];
        let bestDistance = gridManager.getDistance(
          bestMove.x,
          bestMove.y,
          opponentPos.x,
          opponentPos.y
        );

        for (const move of validMoves) {
          const distance = gridManager.getDistance(move.x, move.y, opponentPos.x, opponentPos.y);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestMove = move;
          }
        }

        // Execute AI movement
        const success = gridCombatIntegration.moveFighter(attacker.id, bestMove.x, bestMove.y);

        if (success) {
          Logger.log(
            `<div class="system-message">✅ ${attacker.name} moved to position (${bestMove.x}, ${bestMove.y})</div>`
          );

          // Apply terrain effects
          const terrainEffects = gridCombatIntegration.applyTerrainEffects(attacker.id);
          if (terrainEffects && terrainEffects.length > 0) {
            terrainEffects.forEach((effect) => {
              Logger.log(`<div class="system-message">🌍 Terrain effect: ${effect}</div>`);
            });
          }

          hudManager.update();
        }

        // Update grid UI
        gridUI.render();
        resolve();
        return;
      }

      // Player movement - wait for click
      gridUI.setMode('move', { validMoves });
      gridUI.highlightCells(validMoves);

      // Wait for the player to click on a valid move
      const handleCellClick = async (e) => {
        const { x, y } = e.detail;

        // Check if it's a valid move
        const isValidMove = validMoves.some((cell) => cell.x === x && cell.y === y);

        if (isValidMove) {
          // Remove event listener
          gridUI.removeEventListener('cell-clicked', handleCellClick);

          // Execute the movement
          const success = gridCombatIntegration.moveFighter(attacker.id, x, y);

          if (success) {
            Logger.log(
              `<div class="system-message">✅ ${attacker.name} moved to position (${x}, ${y})</div>`
            );

            // Update grid UI
            gridUI.setMode('view');
            gridUI.clearHighlights();
            gridUI.render();

            // Apply terrain effects after moving
            const terrainEffects = gridCombatIntegration.applyTerrainEffects(attacker.id);
            if (terrainEffects && terrainEffects.length > 0) {
              terrainEffects.forEach((effect) => {
                Logger.log(`<div class="system-message">🌍 Terrain effect: ${effect}</div>`);
              });
            }

            // Update HUD
            hudManager.update();

            // Resolve promise - turn will be advanced by caller
            resolve();
          } else {
            Logger.log(`<div class="system-message">❌ Movement failed!</div>`);
            gridUI.setMode('view');
            gridUI.clearHighlights();
            resolve();
          }
        } else {
          // Invalid move - show message but keep waiting
          Logger.log(
            `<div class="system-message">⚠️ Invalid move! Choose a highlighted cell.</div>`
          );
        }
      };

      // Add event listener for cell clicks
      gridUI.addEventListener('cell-clicked', handleCellClick);
    });
  }

  /**
   * Execute an action using the phase system
   * @param {Object} attacker - Attacking fighter
   * @param {Object} defender - Defending fighter
   * @param {Object} actionData - Action data
   * @param {Object} turnManager - Turn manager
   * @param {Function} callback - Callback for next turn
   */
  static async executeActionPhased(attacker, defender, actionData, turnManager, callback) {
    const action = actionData.action || actionData;

    // Handle movement skill
    if (action === 'skill' && actionData.skillIndex !== undefined) {
      const skill = attacker.skills[actionData.skillIndex];
      if (skill && skill.type === 'movement') {
        // Check if skill is ready and fighter has mana
        if (!skill.isReady()) {
          Logger.log(
            `<div class="attack-div missed-attack text-center">⏱️ ${skill.name} is on cooldown! (${skill.currentCooldown} turns)</div>`
          );
          turnManager.nextTurn();
          setTimeout(callback, 800);
          return;
        }

        if (attacker.mana < skill.manaCost) {
          Logger.log(
            `<div class="attack-div missed-attack text-center">💧 Not enough mana for ${skill.name}!</div>`
          );
          turnManager.nextTurn();
          setTimeout(callback, 800);
          return;
        }

        // Deduct mana and set cooldown
        attacker.mana -= skill.manaCost;
        skill.currentCooldown = skill.maxCooldown;

        // Execute movement
        await this.handleGridMovement(attacker, defender, turnManager);

        // Update HUD to show mana/cooldown changes
        hudManager.update();

        // After movement completes, advance turn
        turnManager.nextTurn();
        setTimeout(callback, 800);
        return;
      }
    }

    // Handle surrender
    if (action === 'surrender') {
      Logger.log(
        `<div class="attack-div text-center" style="background: #f8d7da; border-left-color: #ff1744;">🏳️ <strong>${attacker.name}</strong> has surrendered!</div>`
      );

      // Remove action selection
      document.querySelectorAll('action-selection').forEach((el) => el.remove());

      // Declare opponent as winner
      setTimeout(async () => {
        await combatPhaseManager.endBattle(defender, attacker);
        Referee.declareWinner(defender);
        hudManager.showWinner(defender);

        // Handle story mission failure from surrender
        if (currentStoryMission) {
          const playerState = {
            currentHP: currentPlayerFighter.health,
            maxHP: currentPlayerFighter.maxHealth,
          };
          const missionResult = StoryMode.completeMission(false, playerState);

          setTimeout(() => {
            if (window.showMissionResults) {
              window.showMissionResults(missionResult);
            }
          }, 2000);

          // Clear story mission state
          currentStoryMission = null;
          currentPlayerFighter = null;
          currentEnemyFighter = null;
        } else {
          // Track loss from surrender (normal combat)
          SaveManager.increment('stats.totalLosses');
          SaveManager.increment('stats.totalFightsPlayed');
          SaveManager.update('stats.winStreak', 0);

          // Small XP for attempt
          LevelingSystem.awardXP(25, 'Battle Participation');

          // Show victory screen for opponent
          setTimeout(() => {
            if (window.showVictoryScreen) {
              window.showVictoryScreen(defender);
            }
          }, 2000);
        }
      }, 1000);
      return;
    }

    // Check attack range before executing attack
    if (action === 'attack') {
      if (!gridCombatIntegration.isTargetInRange(attacker.id, defender.id)) {
        const attackRange = gridCombatIntegration.getAttackRangeForFighter(attacker);
        Logger.log(
          `<div class="attack-div missed-attack text-center">⚠️ <strong>${attacker.name}</strong> is out of range! (Need range ${attackRange})</div>`
        );
        Logger.log(`<div class="system-message">💡 Use your movement skill to get closer!</div>`);
        turnManager.nextTurn();
        setTimeout(callback, 1200);
        return;
      }
    }

    // Queue action in phase manager
    const queuedAction = {
      type: action,
      attacker,
      target: defender,
      actionData,
      skillIndex: actionData.skillIndex,
    };

    combatPhaseManager.queueAction(queuedAction);

    // Execute action through phase system
    await combatPhaseManager.executeNextAction();

    // Update HUD after action
    hudManager.update();

    // Check victory condition
    const victoryResult = CombatEngine.checkVictoryCondition(attacker, defender, false);
    if (victoryResult) {
      await combatPhaseManager.endBattle(
        victoryResult.winner,
        victoryResult.winner === attacker ? defender : attacker
      );

      Referee.declareWinner(victoryResult.winner);
      hudManager.showWinner(victoryResult.winner);
      document.querySelectorAll('action-selection').forEach((el) => el.remove());

      const playerWon = victoryResult.winner.isPlayer;

      // Handle story mission completion
      if (currentStoryMission) {
        const playerState = {
          currentHP: currentPlayerFighter.health,
          maxHP: currentPlayerFighter.maxHealth,
        };

        const missionResult = StoryMode.completeMission(playerWon, playerState);
        DurabilityManager.applyBattleWear();

        setTimeout(() => {
          if (window.showMissionResults) {
            window.showMissionResults(missionResult);
          } else if (window.showVictoryScreen) {
            window.showVictoryScreen(victoryResult.winner);
          }
        }, 2000);

        currentStoryMission = null;
        currentPlayerFighter = null;
        currentEnemyFighter = null;
        return;
      }

      // Normal combat
      SaveManager.increment('stats.totalFightsPlayed');

      if (playerWon) {
        const xpReward = 100;
        SaveManager.increment('stats.totalWins');
        SaveManager.increment('stats.winStreak');
        const bestStreak = SaveManager.get('stats.bestStreak') || 0;
        if (SaveManager.get('stats.winStreak') > bestStreak) {
          SaveManager.update('stats.bestStreak', SaveManager.get('stats.winStreak'));
        }
        LevelingSystem.awardXP(xpReward, 'Victory in Single Combat');

        const difficulty = SaveManager.get('settings.difficulty') || 'normal';
        const enemyLevel = currentEnemyFighter?.level || 1;
        const goldReward = EconomyManager.calculateBattleReward(difficulty, true, enemyLevel);
        EconomyManager.addGold(goldReward, 'Battle Victory');

        DurabilityManager.applyBattleWear();

        const dropRate = DifficultyManager.getEquipmentDropRate();
        if (Math.random() < dropRate) {
          setTimeout(() => {
            EquipmentManager.awardRandomDrop();
          }, 1000);
        }
      } else {
        SaveManager.increment('stats.totalLosses');
        SaveManager.update('stats.winStreak', 0);
        LevelingSystem.awardXP(50, 'Battle Participation');
      }

      setTimeout(() => {
        if (window.showVictoryScreen) {
          window.showVictoryScreen(victoryResult.winner);
        }
        currentPlayerFighter = null;
        currentEnemyFighter = null;
      }, 2000);
      return;
    }

    // End turn with phase system
    await combatPhaseManager.endTurn(attacker);

    // Next turn
    turnManager.nextTurn();
    setTimeout(callback, 800);
  }

  /**
   * Register phase hooks for combat systems
   */
  static registerCombatHooks() {
    // Hook: Combo system integration
    combatPhaseManager.registerPhaseHook(
      CombatPhase.ACTION_EXECUTION,
      (data) => {
        const { action } = data;

        // Record action for combo tracking
        let skillName = null;
        if (action.type === 'skill' && action.skillIndex !== undefined) {
          skillName = action.attacker.skills[action.skillIndex]?.name;
        }
        comboSystem.recordAction(action.attacker, action.type, skillName);

        return { comboRecorded: true };
      },
      5
    );

    // Hook: Apply combo effects to damage
    combatPhaseManager.registerPhaseHook(
      CombatPhase.ACTION_RESOLUTION,
      (data) => {
        const { action, result } = data;

        if (action.type === 'attack' && result.damage) {
          result.damage = comboSystem.applyComboEffects(
            action.attacker,
            action.target,
            result.damage
          );
        }

        return { comboEffectsApplied: true };
      },
      8
    );

    // Hook: Execute actual action logic
    combatPhaseManager.registerPhaseHook(
      CombatPhase.ACTION_EXECUTION,
      (data) => {
        const { action } = data;
        const result = { damage: 0, success: true };

        switch (action.type) {
          case 'attack': {
            const attackResult = action.attacker.normalAttack();
            result.damage = attackResult.damage;
            result.isCritical = attackResult.isCritical;

            const actualDmg = action.target.takeDamage(result.damage);

            // Track player stats
            if (action.attacker.isPlayer) {
              SaveManager.increment('stats.totalDamageDealt', actualDmg);
              if (attackResult.isCritical) {
                SaveManager.increment('stats.criticalHits');
              }

              if (currentStoryMission) {
                StoryMode.trackMissionEvent('damage_dealt', { amount: actualDmg });
                if (attackResult.isCritical) {
                  StoryMode.trackMissionEvent('critical_hit');
                }
              }
            }
            if (action.target.isPlayer) {
              SaveManager.increment('stats.totalDamageTaken', actualDmg);

              if (currentStoryMission) {
                StoryMode.trackMissionEvent('damage_taken', { amount: actualDmg });
              }
            }

            // Combo counter (old system - keep for compatibility)
            action.attacker.combo++;
            if (action.attacker.combo >= 3) {
              this.showComboIndicator(action.attacker.combo);
              const bonusDmg = Math.ceil(actualDmg * 0.2);
              action.target.health -= bonusDmg;
              Logger.log(
                `<div class="attack-div text-center" style="background: #fff3cd;">🔥 <strong>COMBO x${action.attacker.combo}!</strong> <span class="badge bg-warning">+${bonusDmg} bonus damage</span></div>`
              );

              if (currentStoryMission && action.attacker.isPlayer) {
                StoryMode.trackMissionEvent('combo', { combo: action.attacker.combo });
              }
            }
            break;
          }

          case 'defend':
            action.attacker.defend();
            action.attacker.combo = 0;

            if (currentStoryMission && action.attacker.isPlayer) {
              StoryMode.trackMissionEvent('defended');
            }
            break;

          case 'skill': {
            const skillIndex = action.skillIndex;
            if (skillIndex !== undefined && action.attacker.skills[skillIndex]) {
              const skill = action.attacker.skills[skillIndex];
              const success = skill.use(action.attacker, action.target);
              result.success = success;

              if (success) {
                if (action.attacker.isPlayer) {
                  SaveManager.increment('stats.skillsUsed');

                  if (currentStoryMission) {
                    StoryMode.trackMissionEvent('skill_used');
                  }
                }
                action.attacker.combo = 0;
              }
            }
            break;
          }

          case 'item': {
            const previousHealth = action.attacker.health;
            action.attacker.useItem();

            if (action.attacker.isPlayer) {
              SaveManager.increment('stats.itemsUsed');

              if (currentStoryMission) {
                const isHealing = action.attacker.health > previousHealth;
                StoryMode.trackMissionEvent('item_used', { isHealing });
              }
            }
            action.attacker.combo = 0;
            break;
          }
        }

        // Reset defender combo on damage
        if (action.type === 'attack' || action.type === 'skill') {
          action.target.combo = 0;
        }

        return result;
      },
      10
    );

    console.log('✅ Combat phase hooks registered');
  }

  /**
   * AI decision making
   */
  static chooseAIAction(fighter, opponent) {
    const healthPercent = (fighter.health / fighter.maxHealth) * 100;
    const manaPercent = (fighter.mana / fighter.maxMana) * 100;

    // Check if opponent is in attack range
    const inRange = gridCombatIntegration.isTargetInRange(fighter.id, opponent.id);

    // If out of range, prioritize movement
    if (!inRange) {
      // Find movement skill (usually first skill)
      const movementSkill = fighter.skills.find((skill) => skill.type === 'movement');
      if (movementSkill) {
        const movementIndex = fighter.skills.indexOf(movementSkill);
        const canUseMovement = movementSkill.isReady() && fighter.mana >= movementSkill.manaCost;

        if (canUseMovement) {
          // Use movement to get closer
          return { action: 'skill', skillIndex: movementIndex };
        }
      }

      // Can't move (no skill, on cooldown, or no mana)
      // Defend or heal instead
      if (healthPercent < 50 && fighter.health < fighter.maxHealth) {
        return { action: 'item' };
      }
      return { action: 'defend' };
    }

    // In range - make normal combat decisions

    // Low health - heal or defend
    if (healthPercent < 30) {
      if (fighter.health < fighter.maxHealth && Math.random() < 0.6) {
        return { action: 'item' };
      }
      return { action: 'defend' };
    }

    // Try to use a ready skill (excluding movement)
    const readySkills = fighter.skills
      .map((skill, index) => ({ skill, index }))
      .filter(
        ({ skill }) =>
          skill.isReady() && fighter.mana >= skill.manaCost && skill.type !== 'movement' // Don't use movement when already in range
      );

    if (readySkills.length > 0 && manaPercent > 30 && Math.random() < 0.5) {
      const chosen = readySkills[Math.floor(Math.random() * readySkills.length)];
      return { action: 'skill', skillIndex: chosen.index };
    }

    // Medium health - sometimes defend
    if (healthPercent < 60 && Math.random() < 0.3) {
      return { action: 'defend' };
    }

    // Default - attack
    return { action: 'attack' };
  }

  /**
   * Show turn indicator overlay using Web Component
   */
  static showTurnIndicator(fighterName) {
    // Remove existing indicators
    document.querySelectorAll('turn-indicator').forEach((el) => el.remove());

    const indicator = document.createElement('turn-indicator');
    indicator.setAttribute('fighter-name', fighterName);
    document.body.appendChild(indicator);
  }

  /**
   * Show combo counter using Web Component
   */
  static showComboIndicator(comboCount) {
    // Remove existing indicators
    document.querySelectorAll('combo-indicator').forEach((el) => el.remove());

    const indicator = document.createElement('combo-indicator');
    indicator.setAttribute('combo-count', comboCount);
    document.body.appendChild(indicator);
  }

  /**
   * Start a team vs team match
   * @param {Team} teamOne - First team
   * @param {Team} teamTwo - Second team
   */
  // Team Battle mode removed - keeping only Story, Single Combat, and Tournament modes

  /**
   * Initialize grid UI
   */
  static initializeGridUI() {
    const arena = document.querySelector('combat-arena');
    if (!arena || !arena.shadowRoot) {
      console.warn('Combat arena not found for grid UI');
      return;
    }

    const gridArea = arena.shadowRoot.querySelector('#grid-area');
    if (!gridArea) {
      console.warn('Grid area not found in combat arena');
      return;
    }

    // Create grid UI component
    const gridUI = document.createElement('grid-combat-ui');
    gridUI.setGridManager(gridManager);
    gridUI.setMode('view');

    // Clear existing grid UI
    gridArea.innerHTML = '';
    gridArea.appendChild(gridUI);

    console.log('🗺️ Grid UI initialized');
  }

  /**
   * Stop the current game and clean up resources
   */
  static stopGame() {
    if (gameState) {
      gameState.stop();
    }
    Referee.clearRoundNumber();
    hudManager.remove();

    // Clear fighter references
    currentPlayerFighter = null;
    currentEnemyFighter = null;
    currentStoryMission = null;

    // Clear AI managers
    aiManagers = {};

    // Reset phase manager
    combatPhaseManager.reset();

    // Clean up grid combat
    gridCombatIntegration.cleanup();

    // Remove any Web Components
    document.querySelectorAll('action-selection').forEach((el) => el.remove());
    document.querySelectorAll('turn-indicator').forEach((el) => el.remove());
    document.querySelectorAll('combo-indicator').forEach((el) => el.remove());
    document.querySelectorAll('combo-hint').forEach((el) => el.remove());
    document.querySelectorAll('grid-combat-ui').forEach((el) => el.remove());

    // Reset views
    const selectionView = document.querySelector('.fighter-selection-view');
    const combatView = document.querySelector('.combat-view');

    if (selectionView) {
      selectionView.style.display = 'flex';
    }
    if (combatView) {
      combatView.style.display = 'none';
    }
  }

  /**
   * Load and display all available fighters
   * @returns {Promise<Array>} Promise resolving to fighters array
   */
  static logFighters() {
    return new Promise((resolve) => {
      getFighters().then((fighters) => {
        fighters.forEach((fighter) => {
          Logger.logFighter(fighter, '#choose-fighter');
        });

        resolve(fighters);
      });
    });
  }
}
