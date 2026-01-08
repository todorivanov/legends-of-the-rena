// Import Bootstrap 5 CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

// Import custom styles
import './index.css';

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

        document.querySelectorAll('.team-one .details-holder').forEach((el) => {
          const fighterId = parseInt(el.dataset.id);
          teamOne.fighters.push(appState.fighters.find((f) => f.id === fighterId));
        });

        document.querySelectorAll('.team-two .details-holder').forEach((el) => {
          const fighterId = parseInt(el.dataset.id);
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

/**
 * Attach click handlers for fighter selection (single fight mode)
 * Uses event delegation for better performance and no memory leaks
 */
function attachClickEvent() {
  const chooseFighter = document.querySelector('#choose-fighter');
  if (!chooseFighter) return;

  chooseFighter.addEventListener('click', function (event) {
    const holder = event.target.closest('.details-holder');
    if (!holder) return;

    const id = parseInt(holder.dataset.id);

    if (!appState.firstFighter) {
      appState.firstFighter = appState.fighters.find((f) => f.id === id);
      Logger.logFighter(appState.firstFighter, '#selected-fighters');
      appState.chosenFighters++;
    } else if (!appState.secondFighter) {
      appState.secondFighter = appState.fighters.find((f) => f.id === id);
      Logger.logFighter(appState.secondFighter, '#selected-fighters');
      appState.chosenFighters++;
    }

    if (appState.chosenFighters === 2) {
      appState.chosenFighters = 0;
      attachStartButton(false);
    }
  });
}

/**
 * Attach drag and drop handlers for team selection
 * Uses event delegation on container for better performance
 */
function attachDragAndDropHandlers() {
  let draggedElement = null;

  // Make all fighter cards draggable
  document.querySelectorAll('.details-holder').forEach((holder) => {
    holder.draggable = true;
  });

  // Use event delegation on the container
  const container = document.querySelector('.container');

  // Handle dragstart
  container.addEventListener('dragstart', function (event) {
    if (event.target.classList.contains('details-holder')) {
      draggedElement = event.target;
      event.dataTransfer.effectAllowed = 'move';
    }
  });

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
    if (dropZone && draggedElement) {
      event.preventDefault();
      dropZone.appendChild(draggedElement);
      draggedElement = null;

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

    if (isMatchFight) {
      attachDragAndDropHandlers();
    } else {
      attachClickEvent();
    }
  });
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
