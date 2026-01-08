// Import Bootstrap 5 CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

// Import custom styles
import './index.css';

// Import Web Components
import './components/index.js';

// Import game modules
import Game from './game/game.js';
import { Logger } from './utils/logger.js';
import { Team } from './entities/team.js';
import { soundManager } from './utils/soundManager.js';
import { hudManager } from './utils/hudManager.js';

// Make bootstrap available globally if needed
window.bootstrap = bootstrap;

/**
 * Application State
 * Centralized state management for the UI
 */
const appState = {
  chosenFighters: 0,
  firstFighter: null,
  secondFighter: null,
  fighters: [],
  hasStartButton: false,

  reset() {
    this.chosenFighters = 0;
    this.firstFighter = null;
    this.secondFighter = null;
    this.hasStartButton = false;
  },
};

/**
 * Display game mode selection screen
 */
function chooseGame() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="choose-game-mode text-center mt-5">
      <h1 class="mb-4">Object Fighter - Battle Arena</h1>
      <button class="btn btn-primary btn-lg me-3" data-action="single-fight">Single Fight</button>
      <button class="btn btn-primary btn-lg" data-action="team-match">Team Match</button>
    </div>
  `;

  // Use event delegation to avoid memory leaks
  container.addEventListener(
    'click',
    (event) => {
      const action = event.target.dataset.action;
      if (action === 'single-fight') {
        container.innerHTML = '';
        initGame(false);
      } else if (action === 'team-match') {
        container.innerHTML = '';
        initGame(true);
      }
    },
    { once: true }
  );
}

function appendHolders(isTeamMatch) {
  const container = document.querySelector('.container');
  
  container.innerHTML = `
    <div class="game-content">
      <div class="fighter-selection-view">
        <div class="selection-header">
          <h2>Choose Your Fighters</h2>
          <button class="btn btn-danger reset-game">Reset</button>
        </div>
        
        <div id="choose-fighter" class="fighter-grid">
        </div>
        
        <div class="selection-footer">
          <div id="selected-fighters" class="selected-fighters-display">
            ${isTeamMatch ? `
              <div class="row">
                <div class="col-6">
                  <h5>Team One</h5>
                  <div class="team-one team-drop-zone"></div>
                </div>
                <div class="col-6">
                  <h5>Team Two</h5>
                  <div class="team-two team-drop-zone"></div>
                </div>
              </div>
            ` : `
              <h5>Selected Fighters</h5>
              <div class="selected-fighters-container"></div>
            `}
          </div>
        </div>
      </div>
      
      <div class="combat-view" style="display: none;">
        <button class="btn btn-danger reset-game-combat" style="position: absolute; top: 15px; right: 15px; z-index: 10000;">
          Reset Game
        </button>
        <div class="combat-log-wrapper">
          <div id="log"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attach start button and handle game start
 * @param {boolean} isMatchGame - True if team match, false if single fight
 */
function attachStartButton(isMatchGame) {
  const selectedFighters = document.querySelector('#selected-fighters');
  const startBtn = document.createElement('button');
  startBtn.className = 'btn btn-success start-btn mt-3';
  startBtn.textContent = 'Start Fight';
  startBtn.dataset.action = 'start-fight';

  startBtn.addEventListener(
    'click',
    function () {
      // Initialize sound system on first interaction
      soundManager.init();
      
      Logger.setLogHolder('#log');

      if (isMatchGame) {
        const teamOne = new Team('Team One', []);
        const teamTwo = new Team('Team Two', []);

        document.querySelectorAll('.team-one fighter-card').forEach((card) => {
          const fighterId = parseInt(card.getAttribute('fighter-id'));
          teamOne.fighters.push(appState.fighters.find((f) => f.id === fighterId));
        });

        document.querySelectorAll('.team-two fighter-card').forEach((card) => {
          const fighterId = parseInt(card.getAttribute('fighter-id'));
          teamTwo.fighters.push(appState.fighters.find((f) => f.id === fighterId));
        });

        Game.startTeamMatch(teamOne, teamTwo);
      } else {
        Game.startGame(appState.firstFighter, appState.secondFighter);
      }
    },
    { once: true }
  );

  selectedFighters.appendChild(startBtn);
}

/**
 * Attach reset button handler
 */
function attachResetButton() {
  const resetBtn = document.querySelector('.reset-game');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', handleReset);
}

/**
 * Attach reset button in combat view
 */
function attachCombatResetButton() {
  const resetBtn = document.querySelector('.reset-game-combat');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', handleReset);
}

/**
 * Handle game reset
 */
function handleReset() {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  // Reset application state
  appState.reset();

  // Stop any running game
  Game.stopGame();
  
  // Remove HUD
  hudManager.remove();

  // Return to game mode selection
  chooseGame();
}

// Removed - now handled by handleFighterSelection function

/**
 * Attach drag and drop handlers for team selection
 * Works with Web Components
 */
function attachDragAndDropHandlers() {
  const container = document.querySelector('.container');

  // Handle dragover
  container.addEventListener('dragover', function (event) {
    const dropZone = event.target.closest('.team-one, .team-two');
    if (dropZone) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }
  });

  // Handle drop
  container.addEventListener('drop', function (event) {
    const dropZone = event.target.closest('.team-one, .team-two');
    if (dropZone && draggedFighter) {
      event.preventDefault();
      
      // Create a new fighter card for the team zone
      const card = document.createElement('fighter-card');
      card.fighter = draggedFighter;
      card.setAttribute('fighter-id', draggedFighter.id);
      card.setAttribute('fighter-name', draggedFighter.name);
      card.setAttribute('fighter-image', draggedFighter.image);
      card.setAttribute('fighter-health', draggedFighter.health);
      card.setAttribute('fighter-strength', draggedFighter.strength);
      card.setAttribute('fighter-class', draggedFighter.class);
      
      dropZone.appendChild(card);
      draggedFighter = null;

      // Check if both teams have fighters and show start button
      const teamOneHas = document.querySelector('.team-one').children.length > 0;
      const teamTwoHas = document.querySelector('.team-two').children.length > 0;

      if (teamOneHas && teamTwoHas && !appState.hasStartButton) {
        appState.hasStartButton = true;
        attachStartButton(true);
      }
    }
  });
}

/**
 * Initialize game with selected mode
 * @param {boolean} isMatchFight - True for team match, false for single fight
 */
function initGame(isMatchFight) {
  appendHolders(isMatchFight);
  attachResetButton();

  Game.logFighters().then((apiFighters) => {
    appState.fighters = apiFighters;

    // Render fighter cards using Web Components
    const chooseFighter = document.querySelector('#choose-fighter');
    if (chooseFighter) {
      apiFighters.forEach(fighter => {
        const card = document.createElement('fighter-card');
        card.fighter = fighter;
        card.setAttribute('fighter-id', fighter.id);
        card.setAttribute('fighter-name', fighter.name);
        card.setAttribute('fighter-image', fighter.image);
        card.setAttribute('fighter-health', fighter.health);
        card.setAttribute('fighter-strength', fighter.strength);
        card.setAttribute('fighter-class', fighter.class);
        card.setAttribute('fighter-description', fighter.description);
        
        if (isMatchFight) {
          card.setAttribute('draggable', 'true');
          card.addEventListener('fighter-dragstart', (e) => {
            handleFighterDragStart(e.detail);
          });
        } else {
          card.setAttribute('selectable', 'true');
          card.addEventListener('fighter-selected', (e) => {
            handleFighterSelection(e.detail);
          });
        }
        
        chooseFighter.appendChild(card);
      });
    }

    if (isMatchFight) {
      attachDragAndDropHandlers();
    }
  });
}

/**
 * Handle fighter selection (single fight mode)
 */
function handleFighterSelection(detail) {
  if (!appState.firstFighter) {
    appState.firstFighter = detail.fighter;
    appState.chosenFighters++;
  } else if (!appState.secondFighter) {
    appState.secondFighter = detail.fighter;
    appState.chosenFighters++;
  }

  if (appState.chosenFighters === 2) {
    appState.chosenFighters = 0;
    attachStartButton(false);
  }
}

/**
 * Handle fighter drag start (team mode)
 */
let draggedFighter = null;
function handleFighterDragStart(detail) {
  draggedFighter = detail.fighter;
}

/**
 * Initialize dark mode from localStorage
 */
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
}

/**
 * Create and attach dark mode toggle button
 */
function createDarkModeToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'dark-mode-toggle';
  toggle.innerHTML = `
    <span class="toggle-icon">${document.body.classList.contains('dark-mode') ? '☀️' : '🌙'}</span>
    <span class="toggle-text">${document.body.classList.contains('dark-mode') ? 'Light' : 'Dark'}</span>
  `;

  toggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    // Update button text and icon
    toggle.querySelector('.toggle-icon').textContent = isDark ? '☀️' : '🌙';
    toggle.querySelector('.toggle-text').textContent = isDark ? 'Light' : 'Dark';

    // Play sound effect
    soundManager.play('heal');
  });

  document.body.appendChild(toggle);
}

/**
 * Create sound toggle button
 */
function createSoundToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'dark-mode-toggle';
  toggle.style.right = '180px';
  toggle.innerHTML = `
    <span class="toggle-icon">${soundManager.enabled ? '🔊' : '🔇'}</span>
    <span class="toggle-text">Sound</span>
  `;

  toggle.addEventListener('click', function () {
    const enabled = soundManager.toggle();
    toggle.querySelector('.toggle-icon').textContent = enabled ? '🔊' : '🔇';
    if (enabled) {
      // Test sound to confirm it works
      soundManager.init();
      soundManager.play('heal');
    }
  });

  document.body.appendChild(toggle);
}

// Start the game when DOM is ready
window.addEventListener('load', function () {
  initDarkMode();
  createDarkModeToggle();
  createSoundToggle();
  chooseGame();
});
