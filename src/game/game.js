import { Referee } from '../entities/referee.js';
import { Helpers } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';
import { getFighters } from '../api/mockFighters.js';
import { GameStateManager } from './GameStateManager.js';
import { EventManager } from './EventManager.js';
import { CombatEngine } from './CombatEngine.js';
import { hudManager } from '../utils/hudManager.js';
import { TurnManager } from './TurnManager.js';
import { soundManager } from '../utils/soundManager.js';
import { SaveManager } from '../utils/saveManager.js';
import { LevelingSystem } from './LevelingSystem.js';
import { EquipmentManager } from './EquipmentManager.js';
import { DifficultyManager } from './DifficultyManager.js';
import { EconomyManager } from './EconomyManager.js';
import { DurabilityManager } from './DurabilityManager.js';
import { StoryMode } from './StoryMode.js';

const ROUND_INTERVAL = 1500;
const AI_TURN_DELAY = 1200;

// Game instance state manager
let gameState = null;
let autoBattleEnabled = false;
let currentStoryMission = null; // Track if we're in a story mission
let currentPlayerFighter = null; // Track player fighter
let currentEnemyFighter = null; // Track enemy fighter

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
  static startGame(firstFighter, secondFighter, missionId = null) {
    // Initialize clean state
    this.stopGame();
    gameState = new GameStateManager();
    const turnManager = new TurnManager();
    
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

    Logger.clearLog();
    Referee.introduceFighters(firstFighter, secondFighter);
    
    // Initialize HUD
    hudManager.initSingleFight(firstFighter, secondFighter);

    let roundCount = 0;

    // Main turn-based game loop
    const processTurn = () => {
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

      // Show turn indicator
      this.showTurnIndicator(turnManager.isPlayerTurn() ? firstFighter.name : secondFighter.name);

      if (turnManager.isPlayerTurn()) {
        // Process status effects at turn start
        firstFighter.processStatusEffects();
        firstFighter.tickSkillCooldowns();
        hudManager.update();

        // Check if auto-battle is enabled
        if (autoBattleEnabled) {
          // Auto-battle: AI chooses action for player
          setTimeout(() => {
            const aiActionData = this.chooseAIAction(firstFighter);
            this.executeAction(firstFighter, secondFighter, aiActionData, turnManager, processTurn);
          }, AI_TURN_DELAY);
        } else {
          // Manual: Player's turn - wait for input using Web Component
          const actionSelection = document.createElement('action-selection');
          actionSelection.fighter = firstFighter;
          actionSelection.addEventListener('action-selected', (e) => {
            this.executeAction(firstFighter, secondFighter, e.detail, turnManager, processTurn);
          });
          document.body.appendChild(actionSelection);
        }
      } else {
        // Process status effects at turn start
        secondFighter.processStatusEffects();
        secondFighter.tickSkillCooldowns();
        hudManager.update();

        // Enemy AI turn
        setTimeout(() => {
          const aiActionData = this.chooseAIAction(secondFighter);
          this.executeAction(secondFighter, firstFighter, aiActionData, turnManager, processTurn);
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
      Logger.log(`<div class="attack-div text-center" style="background: #f8d7da; border-left-color: #ff1744;">🏳️ <strong>${attacker.name}</strong> has surrendered!</div>`);
      
      // Remove action selection
      document.querySelectorAll('action-selection').forEach(el => el.remove());
      
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

    switch(action) {
      case 'attack':
        const attackResult = attacker.normalAttack();
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
          Logger.log(`<div class="attack-div text-center" style="background: #fff3cd;">🔥 <strong>COMBO x${attacker.combo}!</strong> <span class="badge bg-warning">+${bonusDmg} bonus damage</span></div>`);
          
          // Track combo for story mode
          if (currentStoryMission && attacker.isPlayer) {
            StoryMode.trackMissionEvent('combo', { combo: attacker.combo });
          }
        }
        break;
      
      case 'defend':
        attacker.defend();
        attacker.combo = 0; // Reset combo on defend
        
        // Track defend for story mode
        if (currentStoryMission && attacker.isPlayer) {
          StoryMode.trackMissionEvent('defended');
        }
        break;
      
      case 'skill':
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
      
      case 'item':
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
      document.querySelectorAll('action-selection').forEach(el => el.remove());
      
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
   * AI decision making
   */
  static chooseAIAction(fighter) {
    const healthPercent = (fighter.health / fighter.maxHealth) * 100;
    const manaPercent = (fighter.mana / fighter.maxMana) * 100;

    // Low health - heal or defend
    if (healthPercent < 30) {
      if (fighter.health < fighter.maxHealth && Math.random() < 0.6) {
        return { action: 'item' };
      }
      return { action: 'defend' };
    }

    // Try to use a ready skill
    const readySkills = fighter.skills
      .map((skill, index) => ({ skill, index }))
      .filter(({ skill }) => skill.isReady() && fighter.mana >= skill.manaCost);

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
    document.querySelectorAll('turn-indicator').forEach(el => el.remove());

    const indicator = document.createElement('turn-indicator');
    indicator.setAttribute('fighter-name', fighterName);
    document.body.appendChild(indicator);
  }

  /**
   * Show combo counter using Web Component
   */
  static showComboIndicator(comboCount) {
    // Remove existing indicators
    document.querySelectorAll('combo-indicator').forEach(el => el.remove());

    const indicator = document.createElement('combo-indicator');
    indicator.setAttribute('combo-count', comboCount);
    document.body.appendChild(indicator);
  }

  /**
   * Start a team vs team match
   * @param {Team} teamOne - First team
   * @param {Team} teamTwo - Second team
   */
  static startTeamMatch(teamOne, teamTwo) {
    // Initialize clean state
    this.stopGame();
    gameState = new GameStateManager();

    Logger.clearLog();
    
    // Create team summary display
    this.displayTeamSummary(teamOne, teamTwo);
    
    Referee.introduceTeams(teamOne, teamTwo);

    let roundCount = 0;
    const intervalId = setInterval(() => {
      roundCount++;
      
      // Show round number
      const roundMsg = `<div class="round-announcement" style="background: linear-gradient(135deg, #6a42c2, #ffa726); color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 12px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">⚔️ ROUND ${roundCount} ⚔️</div>`;
      Logger.log(roundMsg);
      
      const randomNumber = Helpers.getRandomNumber(0, 1001);

      // Process random events (higher threshold for team matches)
      EventManager.processRoundEvent(
        gameState,
        teamOne.fighters,
        teamTwo.fighters,
        randomNumber,
        { min: 470, max: 530 }
      );

      // Process team combat
      if (randomNumber < 500) {
        CombatEngine.processTeamCombat(teamOne, teamTwo);
      } else {
        CombatEngine.processTeamCombat(teamTwo, teamOne);
      }

      // Display round summary with health bars
      this.displayTeamHealthSummary(teamOne, teamTwo);

      // Check victory condition
      const result = CombatEngine.checkVictoryCondition(teamOne, teamTwo, true);
      if (result) {
        Referee.declareWinningTeam(result.winner);
        gameState.stop();
        
        // Award XP for team victory (more than single fight)
        const xpReward = 150; // Higher XP for team matches
        SaveManager.increment('stats.totalWins');
        SaveManager.increment('stats.totalFightsPlayed');
        SaveManager.increment('stats.winStreak');
        const bestStreak = SaveManager.get('stats.bestStreak') || 0;
        if (SaveManager.get('stats.winStreak') > bestStreak) {
          SaveManager.update('stats.bestStreak', SaveManager.get('stats.winStreak'));
        }
        LevelingSystem.awardXP(xpReward, 'Victory in Team Battle');
        
        // Show victory screen
        setTimeout(() => {
          if (window.showVictoryScreen) {
            // For team match, show first fighter of winning team
            const winningFighter = result.winner.fighters[0];
            window.showVictoryScreen(winningFighter);
          }
        }, 2000);
      }
    }, ROUND_INTERVAL);

    gameState.setIntervalId(intervalId);
  }

  /**
   * Display team summary at start
   */
  static displayTeamSummary(teamOne, teamTwo) {
    const team1List = teamOne.fighters.map(f => `<span style="color: #00e676;">⚔️ ${f.name}</span>`).join(', ');
    const team2List = teamTwo.fighters.map(f => `<span style="color: #ffa726;">⚔️ ${f.name}</span>`).join(', ');
    
    const summaryMsg = `
      <div style="background: linear-gradient(145deg, rgba(42, 26, 71, 0.8), rgba(26, 13, 46, 0.9)); border: 2px solid rgba(106, 66, 194, 0.5); border-radius: 16px; padding: 25px; margin: 20px 0; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
        <h3 style="text-align: center; color: #ffa726; font-size: 28px; margin: 0 0 20px 0; text-transform: uppercase;">⚔️ Team Battle ⚔️</h3>
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center;">
          <div style="text-align: right;">
            <h4 style="color: #00e676; font-size: 20px; margin: 0 0 10px 0;">💚 ${teamOne.name}</h4>
            <div style="color: white; line-height: 1.6;">${team1List}</div>
          </div>
          <div style="font-size: 40px; color: #ffa726;">VS</div>
          <div style="text-align: left;">
            <h4 style="color: #ffa726; font-size: 20px; margin: 0 0 10px 0;">🧡 ${teamTwo.name}</h4>
            <div style="color: white; line-height: 1.6;">${team2List}</div>
          </div>
        </div>
      </div>
    `;
    
    Logger.log(summaryMsg);
  }

  /**
   * Display team health summary
   */
  static displayTeamHealthSummary(teamOne, teamTwo) {
    const team1Fighters = teamOne.fighters.map(f => {
      // Ensure health values are valid numbers
      const currentHealth = isNaN(f.health) ? 0 : Math.max(0, Math.round(f.health));
      const maxHealth = isNaN(f.maxHealth) || f.maxHealth === 0 ? 100 : f.maxHealth;
      const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
      const healthColor = healthPercent > 60 ? '#00e676' : healthPercent > 30 ? '#ffc107' : '#ff1744';
      const status = currentHealth > 0 ? '💚' : '💀';
      
      return `
        <div style="margin: 5px 0;">
          ${status} <strong>${f.name}</strong>: 
          <span style="color: ${healthColor};">${currentHealth} HP</span>
        </div>
      `;
    }).join('');

    const team2Fighters = teamTwo.fighters.map(f => {
      // Ensure health values are valid numbers
      const currentHealth = isNaN(f.health) ? 0 : Math.max(0, Math.round(f.health));
      const maxHealth = isNaN(f.maxHealth) || f.maxHealth === 0 ? 100 : f.maxHealth;
      const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
      const healthColor = healthPercent > 60 ? '#00e676' : healthPercent > 30 ? '#ffc107' : '#ff1744';
      const status = currentHealth > 0 ? '🧡' : '💀';
      
      return `
        <div style="margin: 5px 0;">
          ${status} <strong>${f.name}</strong>: 
          <span style="color: ${healthColor};">${currentHealth} HP</span>
        </div>
      `;
    }).join('');

    const summaryMsg = `
      <div style="background: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 20px; margin: 15px 0; border-left: 4px solid #6a42c2;">
        <h4 style="text-align: center; color: #b39ddb; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px;">📊 Team Status</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h5 style="color: #00e676; margin: 0 0 10px 0;">💚 ${teamOne.name}</h5>
            ${team1Fighters}
          </div>
          <div>
            <h5 style="color: #ffa726; margin: 0 0 10px 0;">🧡 ${teamTwo.name}</h5>
            ${team2Fighters}
          </div>
        </div>
      </div>
    `;
    
    Logger.log(summaryMsg);
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
    
    // Remove any Web Components
    document.querySelectorAll('action-selection').forEach(el => el.remove());
    document.querySelectorAll('turn-indicator').forEach(el => el.remove());
    document.querySelectorAll('combo-indicator').forEach(el => el.remove());
    
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
