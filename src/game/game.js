import { Referee } from '../entities/referee.js';
import { Helpers } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';
import { getFighters } from '../api/mockFighters.js';
import { GameStateManager } from './GameStateManager.js';
import { EventManager } from './EventManager.js';
import { CombatEngine } from './CombatEngine.js';
import { hudManager } from '../utils/hudManager.js';
import { TurnManager } from './TurnManager.js';

const ROUND_INTERVAL = 1500;
const AI_TURN_DELAY = 1200;

// Game instance state manager
let gameState = null;

export default class Game {
  /**
   * Start a 1v1 fighter match with turn-based combat
   * @param {Object} firstFighter - First fighter (player)
   * @param {Object} secondFighter - Second fighter (enemy)
   */
  static startGame(firstFighter, secondFighter) {
    // Initialize clean state
    this.stopGame();
    gameState = new GameStateManager();
    const turnManager = new TurnManager();

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

        // Player's turn - wait for input using Web Component
        const actionSelection = document.createElement('action-selection');
        actionSelection.fighter = firstFighter;
        actionSelection.addEventListener('action-selected', (e) => {
          this.executeAction(firstFighter, secondFighter, e.detail, turnManager, processTurn);
        });
        document.body.appendChild(actionSelection);
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

    switch(action) {
      case 'attack':
        const attackResult = attacker.normalAttack();
        const actualDmg = defender.takeDamage(attackResult.damage);
        
        // Increase combo on successful attack
        attacker.combo++;
        if (attacker.combo >= 3) {
          this.showComboIndicator(attacker.combo);
          const bonusDmg = Math.ceil(actualDmg * 0.2);
          defender.health -= bonusDmg;
          Logger.log(`<div class="attack-div text-center" style="background: #fff3cd;">🔥 <strong>COMBO x${attacker.combo}!</strong> <span class="badge bg-warning">+${bonusDmg} bonus damage</span></div>`);
        }
        break;
      
      case 'defend':
        attacker.defend();
        attacker.combo = 0; // Reset combo on defend
        break;
      
      case 'skill':
        const skillIndex = actionData.skillIndex;
        if (skillIndex !== undefined && attacker.skills[skillIndex]) {
          const skill = attacker.skills[skillIndex];
          const success = skill.use(attacker, defender);
          if (success) {
            attacker.combo = 0; // Reset combo on skill use
          }
        }
        break;
      
      case 'item':
        attacker.useItem();
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

    // Show combat view and hide fighter selection
    const selectionView = document.querySelector('.fighter-selection-view');
    const combatView = document.querySelector('.combat-view');
    
    if (selectionView) {
      selectionView.style.display = 'none';
    }
    if (combatView) {
      combatView.style.display = 'block';
    }

    Logger.clearLog();
    Referee.introduceTeams(teamOne, teamTwo);

    // Attach reset button for combat view
    const resetBtn = document.querySelector('.reset-game-combat');
    if (resetBtn && !resetBtn.hasAttribute('data-listener-attached')) {
      resetBtn.addEventListener('click', function() {
        Game.stopGame();
        window.location.reload();
      });
      resetBtn.setAttribute('data-listener-attached', 'true');
    }

    const intervalId = setInterval(() => {
      Referee.showRoundNumber();
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

      // Display round summary
      Referee.matchRoundSummary(teamOne, teamTwo);

      // Check victory condition
      const result = CombatEngine.checkVictoryCondition(teamOne, teamTwo, true);
      if (result) {
        Referee.declareWinningTeam(result.winner);
        gameState.stop();
      }
    }, ROUND_INTERVAL);

    gameState.setIntervalId(intervalId);
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
