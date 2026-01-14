// Import Bootstrap 5 CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

// Import custom styles
import './styles/theme.css';
import './index.css';

// Import Web Components
import './components/index.js';

// Import game modules
import Game from './game/game.js';
import { ConsoleLogger, LogCategory } from './utils/ConsoleLogger.js';
// Team Battle removed - keeping only Story, Single Combat, and Tournament modes
import { Fighter } from './entities/fighter.js';
import { soundManager } from './utils/soundManager.js';
import { getFighters } from './api/mockFighters.js';
import { Logger } from './utils/logger.js';
import { SaveManagerV2 as SaveManager } from './utils/SaveManagerV2.js';
import { LevelingSystem } from './game/LevelingSystem.js';
import { EquipmentManager } from './game/EquipmentManager.js';
import { tournamentMode } from './game/TournamentMode.js';
import { AchievementManager } from './game/AchievementManager.js';
import { DifficultyManager } from './game/DifficultyManager.js';
import { getMissionById } from './data/storyMissions.js';
import { router } from './utils/Router.js';
import { getRouteConfig, RouteGuards, RoutePaths } from './config/routes.js';
import {
  gameStore,
  setGameMode,
  setScreen,
  startAutoSave,
  stopAutoSave,
  saveGameState,
} from './store/index.js';
import { incrementStat } from './store/actions.js';

// Make bootstrap available globally if needed
window.bootstrap = bootstrap;

/**
 * Application State (Legacy - migrating to Store)
 * TODO: Gradually migrate all state to gameStore
 */
const appState = {
  currentScreen: 'title', // 'title' | 'gallery' | 'combat' | 'tournament'
  gameMode: null, // 'single' | 'team' | 'tournament'
  fighters: [],
  selectedFighters: [],
  tournamentActive: false,

  reset() {
    this.currentScreen = 'title';
    this.gameMode = null;
    this.selectedFighters = [];
    this.tournamentActive = false;
    // Also reset store state
    gameStore.dispatch(setGameMode(null));
    gameStore.dispatch(setScreen('title'));
  },
};

/**
 * Initialize the application
 */
function initApp() {
  ConsoleLogger.info(LogCategory.UI, '🎮 Legends of the Arena v4.0.0 - Initializing...');

  // Initialize store
  ConsoleLogger.info(LogCategory.UI, '📦 Store initialized with state:', gameStore.inspect());

  // Start auto-save only if character is already created
  const state = gameStore.getState();
  if (state.player.characterCreated) {
    startAutoSave();
  } else {
    ConsoleLogger.info(LogCategory.UI, '⏰ Auto-save deferred until character creation');
  }

  // Initialize router
  initializeRouter();

  ConsoleLogger.info(LogCategory.UI, `💾 Save data loaded. Player Level: ${state.player.level}`);
  ConsoleLogger.info(LogCategory.UI, `👤 Character created: ${state.player.characterCreated}`);

  // Load fighters data
  getFighters().then((fighters) => {
    appState.fighters = fighters;
    ConsoleLogger.info(LogCategory.UI, `✅ Loaded ${fighters.length} fighters`);

    // Navigate to initial route
    const initialPath = state.player.characterCreated
      ? RoutePaths.HOME
      : RoutePaths.CHARACTER_CREATION;
    router.navigate(initialPath, {}, true); // true = replace (don't add to history)
  });

  // Initialize navigation components (declarative)
  initNavigationComponents();
}

/**
 * Initialize router with all routes and guards
 */
function initializeRouter() {
  // Initialize router
  router.init();

  // Register route guards
  Object.entries(RouteGuards).forEach(([name, guard]) => {
    router.registerGuard(name, guard);
  });

  // Create route handlers object
  const handlers = {
    showTitleScreen,
    showCharacterCreation,
    showProfileScreen,
    showAchievementsScreen,
    showTalentTreeScreen,
    showSettingsScreen,
    showWikiScreen,
    showOpponentSelection,
    showCombat: () => {
      // Combat is handled separately as it needs more context
      ConsoleLogger.info(LogCategory.UI, 'Combat route accessed - needs battle setup first');
    },
    showTournamentBracketScreen,
    showCampaignMapScreen,
    showMissionBriefing: (data) => {
      if (data.missionId) {
        showMissionBriefing(data.missionId);
      }
    },
    showMarketplaceScreen,
    showEquipmentScreen: () => {
      // Equipment screen to be implemented
      ConsoleLogger.info(LogCategory.UI, 'Equipment screen - to be implemented');
    },
    showSaveManagementScreen,
  };

  // Register all routes
  const routes = getRouteConfig(handlers);
  routes.forEach((route) => {
    router.register(route.path, route.handler, {
      title: route.title,
      guard: route.guard,
    });
  });

  ConsoleLogger.info(LogCategory.UI, '🧭 Router initialized with', routes.length, 'routes');
}

/**
 * Initialize navigation components (declarative Web Components)
 */
function initNavigationComponents() {
  // Remove any existing navigation components
  const existingNav = document.querySelector('navigation-bar');
  const existingSound = document.querySelector('sound-toggle');
  const existingPerfMonitor = document.querySelector('performance-monitor-ui');

  if (existingNav) existingNav.remove();
  if (existingSound) existingSound.remove();
  if (existingPerfMonitor) existingPerfMonitor.remove();

  // Add new declarative components
  const navBar = document.createElement('navigation-bar');
  const soundToggle = document.createElement('sound-toggle');

  document.body.appendChild(navBar);
  document.body.appendChild(soundToggle);

  // Conditionally add performance monitor based on settings
  const state = gameStore.getState();
  if (state.settings.showPerformanceMonitor) {
    const perfMonitor = document.createElement('performance-monitor-ui');
    document.body.appendChild(perfMonitor);
    ConsoleLogger.info(LogCategory.UI, '⚡ Performance monitoring active');
  }

  ConsoleLogger.info(LogCategory.UI, '✅ Navigation components initialized');
}

/**
 * Show character creation screen
 */
function showCharacterCreation() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const charCreation = document.createElement('character-creation');
  charCreation.addEventListener('character-created', (e) => {
    ConsoleLogger.info(LogCategory.UI, '✅ Character created:', e.detail);
    soundManager.init();

    // Start auto-save now that character is created
    startAutoSave();

    // Reload app after character creation
    getFighters().then((fighters) => {
      appState.fighters = fighters;
      router.navigate(RoutePaths.HOME);
    });
  });

  root.appendChild(charCreation);
  appState.currentScreen = 'character-creation';
}

/**
 * Show title screen
 */
function showTitleScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const titleScreen = document.createElement('title-screen');
  titleScreen.addEventListener('mode-selected', (e) => {
    soundManager.init();
    appState.gameMode = e.detail.mode;
    appState.currentScreen = 'gallery';
    router.navigate(RoutePaths.OPPONENT_SELECTION);
  });

  titleScreen.addEventListener('tournament-selected', () => {
    soundManager.init();
    soundManager.play('event');
    router.navigate(RoutePaths.TOURNAMENT_BRACKET);
  });

  titleScreen.addEventListener('wiki-selected', () => {
    soundManager.init();
    soundManager.play('event');
    router.navigate(RoutePaths.WIKI);
  });

  titleScreen.addEventListener('story-selected', () => {
    soundManager.init();
    soundManager.play('event');
    router.navigate(RoutePaths.STORY_MODE);
  });

  titleScreen.addEventListener('marketplace-selected', () => {
    soundManager.init();
    soundManager.play('event');
    router.navigate(RoutePaths.MARKETPLACE);
  });

  root.appendChild(titleScreen);
  appState.currentScreen = 'title';

  // Navigation bar is now persistent across all screens (declarative components)
}

/**
 * Show profile screen
 */
function showProfileScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const profileScreen = document.createElement('profile-screen');
  profileScreen.addEventListener('back-to-menu', () => {
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(profileScreen);
  appState.currentScreen = 'profile';
}

/**
 * Show tournament bracket screen
 */
function showTournamentBracketScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const bracket = document.createElement('tournament-bracket');
  bracket.fighters = appState.fighters;

  bracket.addEventListener('tournament-start', (e) => {
    const { opponents, difficulty } = e.detail;
    startTournament(opponents, difficulty);
  });

  bracket.addEventListener('back-to-menu', () => {
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(bracket);
  appState.currentScreen = 'tournament';
}

/**
 * Show wiki screen
 */
function showWikiScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const wiki = document.createElement('wiki-screen');

  wiki.addEventListener('back', () => {
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(wiki);
  appState.currentScreen = 'wiki';
}

/**
 * Show campaign map screen
 */
function showCampaignMapScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const campaignMap = document.createElement('campaign-map');

  campaignMap.addEventListener('close', () => {
    router.navigate(RoutePaths.HOME);
  });

  campaignMap.addEventListener('mission-selected', (e) => {
    const { missionId } = e.detail;
    router.navigate(RoutePaths.STORY_MISSION, { missionId });
  });

  root.appendChild(campaignMap);
  appState.currentScreen = 'campaign';
}

/**
 * Show mission briefing screen
 */
function showMissionBriefing(missionId) {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const briefing = document.createElement('mission-briefing');
  briefing.mission = missionId;

  briefing.addEventListener('cancel', () => {
    router.navigate(RoutePaths.STORY_MODE);
  });

  briefing.addEventListener('start-mission', (e) => {
    const missionId = e.detail.missionId;
    ConsoleLogger.info(LogCategory.UI, 'Starting mission:', missionId);
    soundManager.play('event');
    startStoryMission(missionId);
  });

  root.appendChild(briefing);
}

/**
 * Start a story mission with combat
 */
function startStoryMission(missionId) {
  const mission = getMissionById(missionId);
  if (!mission) {
    ConsoleLogger.error(LogCategory.UI, 'Mission not found:', missionId);
    return;
  }

  // Create the player fighter
  const state = gameStore.getState();
  const playerFighter = new Fighter({
    id: 'player',
    name: state.player.name,
    class: state.player.class,
    level: state.player.level,
    health: state.player.maxHealth,
    isPlayer: true,
  });

  // Apply player's equipped items
  EquipmentManager.applyEquipmentBonuses(playerFighter);

  // Create the enemy fighter from mission data
  let enemyFighter;

  if (mission.type === 'survival' && mission.waves) {
    // For survival missions, start with the first wave
    const firstWave = mission.waves[0];
    enemyFighter = new Fighter({
      id: `enemy_${firstWave.name}`,
      name: firstWave.name,
      class: firstWave.class,
      level: firstWave.level,
      health: firstWave.health,
      strength: firstWave.strength,
      isPlayer: false,
    });
  } else if (mission.enemy) {
    // Standard or boss mission
    enemyFighter = new Fighter({
      id: `enemy_${mission.enemy.name}`,
      name: mission.enemy.name,
      class: mission.enemy.class,
      level: mission.enemy.level,
      health: mission.enemy.health,
      strength: mission.enemy.strength,
      isPlayer: false,
    });
  } else {
    ConsoleLogger.error(LogCategory.UI, 'No enemy configuration found for mission:', missionId);
    return;
  }

  // Prepare battle setup
  const root = document.getElementById('root');
  root.innerHTML = '';

  // Create combat arena component
  const arena = document.createElement('combat-arena');

  arena.addEventListener('return-to-menu', () => {
    Game.stopGame();
    appState.reset();
    showTitleScreen();
  });

  arena.addEventListener('auto-battle-toggle', (e) => {
    Game.setAutoBattle(e.detail.enabled);
  });

  arena.addEventListener('auto-scroll-toggle', (e) => {
    Logger.setAutoScroll(e.detail.enabled);
  });

  root.appendChild(arena);
  appState.currentScreen = 'combat';

  // Wait for arena to be fully rendered, then start game
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Initialize Logger with the combat arena's log element
      const logElement = arena.shadowRoot?.querySelector('#log');
      if (logElement) {
        Logger.setLogHolder(logElement);
        Logger.setAutoScroll(arena.autoScroll);
        ConsoleLogger.info(LogCategory.UI, '✅ Logger initialized for story mission combat');

        // Log mission start message
        if (mission.dialogue?.before) {
          const message = `
            <div class="mission-dialogue" style="
              background: linear-gradient(135deg, rgba(106, 66, 194, 0.3), rgba(42, 26, 71, 0.4));
              border: 3px solid #b39ddb;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            ">
              <div style="font-size: 24px; font-weight: bold; color: #ffa726; margin-bottom: 10px;">
                📖 ${mission.name}
              </div>
              <div style="font-size: 16px; color: #e1bee7; font-style: italic;">
                ${mission.dialogue.before}
              </div>
            </div>
          `;
          Logger.log(message);
        }

        // Start the game with the mission ID
        Game.startGame(playerFighter, enemyFighter, missionId);
      } else {
        ConsoleLogger.error(LogCategory.UI, '❌ Could not find log element in combat arena');
      }
    });
  });
}

/**
 * Show mission results screen
 */
function showMissionResults(missionResult) {
  if (!missionResult || !missionResult.success) {
    // Mission failed - show failure screen
    Logger.log(`
      <div class="mission-failed" style="
        background: linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(211, 47, 47, 0.4));
        border: 3px solid #f44336;
        border-radius: 15px;
        padding: 30px;
        margin: 20px 0;
        text-align: center;
      ">
        <div style="font-size: 64px; margin-bottom: 15px;">💔</div>
        <div style="font-size: 32px; font-weight: 900; color: #ef5350; margin-bottom: 15px;">MISSION FAILED</div>
        <div style="color: #ffcdd2; font-size: 18px; margin-bottom: 15px;">
          ${missionResult ? missionResult.mission.name : 'Unknown Mission'}
        </div>
        <div style="color: #ffcdd2; font-size: 16px;">
          Don't give up! Try again with better equipment or skills.
        </div>
      </div>
    `);

    // Add a button to return to campaign map (instead of auto-redirect)
    Logger.log(`
      <div style="margin-top: 20px; text-align: center;">
        <button id="return-to-map-btn-failed" style="
          padding: 15px 40px;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
          color: white;
          border: 2px solid #f44336;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        ">
        🗺️ Return to Campaign Map
        </button>
        <div style="margin-top: 10px; font-size: 14px; color: rgba(255, 255, 255, 0.6); font-style: italic;">
          Review the combat logs to see what went wrong
        </div>
      </div>
    `);

    // Add event listener to the button
    setTimeout(() => {
      // Find the combat arena to access its shadow root
      const arena = document.querySelector('combat-arena');
      const returnBtn = arena?.shadowRoot?.querySelector('#return-to-map-btn-failed');
      if (returnBtn) {
        returnBtn.addEventListener('click', () => {
          router.navigate(RoutePaths.STORY_MODE);
        });
        returnBtn.addEventListener('mouseover', () => {
          returnBtn.style.transform = 'translateY(-3px)';
          returnBtn.style.boxShadow = '0 10px 30px rgba(244, 67, 54, 0.5)';
        });
        returnBtn.addEventListener('mouseout', () => {
          returnBtn.style.transform = 'translateY(0)';
          returnBtn.style.boxShadow = 'none';
        });
      }
    }, 100);
    return;
  }

  // Mission succeeded - show results in logger (already done in StoryMode.completeMission)
  // Show detailed rewards breakdown
  const rewards = missionResult.rewards;
  if (rewards) {
    let rewardsHTML =
      '<div style="margin-top: 20px; padding: 15px; background: rgba(76, 175, 80, 0.2); border-radius: 10px; border: 2px solid #4caf50;">';
    rewardsHTML +=
      '<div style="font-size: 20px; font-weight: 700; color: #66bb6a; margin-bottom: 10px;">🎁 Rewards Earned:</div>';

    if (rewards.gold) {
      rewardsHTML += `<div style="color: #ffc107; font-size: 18px; margin: 5px 0;">💰 ${rewards.gold} Gold</div>`;
    }
    if (rewards.xp) {
      rewardsHTML += `<div style="color: #42a5f5; font-size: 18px; margin: 5px 0;">✨ ${rewards.xp} XP</div>`;
    }
    if (rewards.equipment && rewards.equipment.length > 0) {
      rewardsHTML += `<div style="color: #ba68c8; font-size: 18px; margin: 5px 0;">🎁 ${rewards.equipment.length} Equipment Item(s)</div>`;
    }

    rewardsHTML += '</div>';
    Logger.log(rewardsHTML);
  }

  // Show objectives completion
  if (missionResult.objectives) {
    let objectivesHTML =
      '<div style="margin-top: 15px; padding: 15px; background: rgba(106, 66, 194, 0.2); border-radius: 10px; border: 2px solid #6a42c2;">';
    objectivesHTML +=
      '<div style="font-size: 18px; font-weight: 700; color: #b39ddb; margin-bottom: 10px;">📋 Objectives:</div>';

    Object.values(missionResult.objectives).forEach((obj) => {
      const icon = obj.completed ? '✅' : '❌';
      const color = obj.completed ? '#66bb6a' : '#ef5350';
      objectivesHTML += `<div style="color: ${color}; font-size: 14px; margin: 5px 0;">${icon} ${obj.description}</div>`;
    });

    objectivesHTML += '</div>';
    Logger.log(objectivesHTML);
  }

  // Add a button to return to campaign map (instead of auto-redirect)
  Logger.log(`
    <div style="margin-top: 20px; text-align: center;">
      <button id="return-to-map-btn" style="
        padding: 15px 40px;
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(135deg, #6a42c2 0%, #2d1b69 100%);
        color: white;
        border: 2px solid #6a42c2;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        🗺️ Return to Campaign Map
      </button>
      <div style="margin-top: 10px; font-size: 14px; color: rgba(255, 255, 255, 0.6); font-style: italic;">
        Take your time to review the combat logs above
      </div>
    </div>
  `);

  // Add event listener to the button
  setTimeout(() => {
    // Find the combat arena to access its shadow root
    const arena = document.querySelector('combat-arena');
    const returnBtn = arena?.shadowRoot?.querySelector('#return-to-map-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        router.navigate(RoutePaths.STORY_MODE);
      });
      returnBtn.addEventListener('mouseover', () => {
        returnBtn.style.transform = 'translateY(-3px)';
        returnBtn.style.boxShadow = '0 10px 30px rgba(106, 66, 194, 0.5)';
      });
      returnBtn.addEventListener('mouseout', () => {
        returnBtn.style.transform = 'translateY(0)';
        returnBtn.style.boxShadow = 'none';
      });
    }
  }, 100);
}

/**
 * Show marketplace screen
 */
function showMarketplaceScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const marketplace = document.createElement('marketplace-screen');

  marketplace.addEventListener('close', () => {
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(marketplace);
  appState.currentScreen = 'marketplace';
}

/**
 * Show achievements screen
 */
function showAchievementsScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const achievementsScreen = document.createElement('achievements-screen');
  achievementsScreen.addEventListener('back-to-menu', () => {
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(achievementsScreen);
  appState.currentScreen = 'achievements';
}

/**
 * Show talent tree screen
 */
function showTalentTreeScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const talentTreeScreen = document.createElement('talent-tree-screen');
  talentTreeScreen.addEventListener('navigate', (e) => {
    const { screen } = e.detail;
    if (screen === 'profile') {
      router.navigate(RoutePaths.PROFILE);
    }
  });
  talentTreeScreen.addEventListener('back-to-menu', () => {
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(talentTreeScreen);
  appState.currentScreen = 'talents';
}

/**
 * Show settings screen
 */
function showSettingsScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const settingsScreen = document.createElement('settings-screen');
  settingsScreen.addEventListener('back-to-menu', () => {
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(settingsScreen);
  appState.currentScreen = 'settings';
}

/**
 * Show save management screen
 */
function showSaveManagementScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const saveManagementScreen = document.createElement('save-management-screen');
  saveManagementScreen.addEventListener('back', () => {
    router.navigate(RoutePaths.SETTINGS);
  });

  root.appendChild(saveManagementScreen);
  appState.currentScreen = 'save-management';
}

/**
 * Start tournament mode
 */
function startTournament(opponents, difficulty) {
  // Initialize tournament
  if (!tournamentMode.startTournament(opponents, difficulty)) {
    ConsoleLogger.error(LogCategory.UI, '❌ Failed to start tournament');
    return;
  }

  appState.tournamentActive = true;
  appState.gameMode = 'tournament';
  gameStore.dispatch(incrementStat('tournamentsPlayed'));

  // Start first battle
  startTournamentBattle();
}

/**
 * Start a tournament battle
 */
function startTournamentBattle() {
  const opponent = tournamentMode.getCurrentOpponent();
  if (!opponent) {
    ConsoleLogger.error(LogCategory.UI, '❌ No opponent available');
    return;
  }

  // Get player's character
  const state = gameStore.getState();
  const playerCharacter = createPlayerFighter(state.player.character);

  // Store tournament round info to log after arena is created
  const tournamentInfo = {
    roundName: tournamentMode.getCurrentRoundName(),
    roundNumber: tournamentMode.getCurrentRoundNumber(),
    playerName: playerCharacter.name,
    opponentName: opponent.name,
  };

  // Start battle with tournament info
  startBattle([playerCharacter, opponent], tournamentInfo);
}

/**
 * Handle tournament victory
 */
export function handleTournamentVictory(_winner) {
  if (!appState.tournamentActive) {
    return false;
  }

  const result = tournamentMode.recordVictory();

  if (result.tournamentComplete) {
    // Tournament won!
    appState.tournamentActive = false;
    return true;
  } else {
    // Continue to next round
    setTimeout(() => {
      startTournamentBattle();
    }, 3000);
    return false;
  }
}

/**
 * Handle tournament defeat
 */
export function handleTournamentDefeat() {
  if (!appState.tournamentActive) {
    return;
  }

  tournamentMode.recordDefeat();
  appState.tournamentActive = false;
}

/**
 * Show opponent selection (player character is already determined)
 */
function showOpponentSelection() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const gallery = document.createElement('fighter-gallery');
  gallery.fighters = appState.fighters;
  gallery.mode = 'opponent'; // Special mode for opponent selection
  gallery.playerMode = true; // Flag to show it's opponent selection

  gallery.addEventListener('fighter-selected', (e) => {
    ConsoleLogger.info(LogCategory.UI, 'Opponent selected:', e.detail.fighter.name);
    appState.selectedFighters.push(e.detail.fighter);
  });

  gallery.addEventListener('selection-complete', (e) => {
    ConsoleLogger.info(LogCategory.UI, 'Opponent chosen:', e.detail);
    // Get player's character
    const state = gameStore.getState();
    const playerCharacter = createPlayerFighter(state.player.character);

    // Get opponent and apply difficulty modifiers
    const opponent = e.detail.fighters[0];
    DifficultyManager.applyDifficultyModifiers(opponent, false); // false = isEnemy

    // Start battle: Player vs Opponent
    startBattle([playerCharacter, opponent]);
  });

  gallery.addEventListener('back-to-menu', () => {
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  root.appendChild(gallery);
  appState.currentScreen = 'opponent-selection';
}

/**
 * Create player fighter from character data with level bonuses and equipment
 */
function createPlayerFighter(characterData) {
  // Create base fighter
  const fighter = new Fighter({
    id: 'player', // Player ID
    name: characterData.name,
    health: characterData.health,
    strength: characterData.strength,
    image: characterData.image,
    description: characterData.description,
    class: characterData.class,
  });

  // Mark as player character
  fighter.isPlayer = true;

  // Apply level bonuses (modifies fighter in place)
  LevelingSystem.applyLevelBonuses(fighter);

  // Apply equipment bonuses (modifies fighter in place)
  EquipmentManager.applyEquipmentBonuses(fighter);

  // Apply difficulty modifiers (modifies fighter in place)
  DifficultyManager.applyDifficultyModifiers(fighter, true); // true = isPlayer

  ConsoleLogger.info(
    LogCategory.UI,
    `⚔️ Player Character: ${fighter.name} (Lvl ${SaveManager.get('profile.level')}, ${DifficultyManager.formatDifficultyDisplay()}) - HP: ${fighter.health}, STR: ${fighter.strength}`
  );

  return fighter;
}

/**
 * Start the battle
 * @param {Array} fighters - Array of fighters
 * @param {Object} tournamentInfo - Optional tournament round info
 */
function startBattle(fighters, tournamentInfo = null) {
  const root = document.getElementById('root');
  root.innerHTML = '';

  // Create combat arena component
  const arena = document.createElement('combat-arena');

  arena.addEventListener('return-to-menu', () => {
    Game.stopGame();
    appState.reset();
    showTitleScreen();
  });

  arena.addEventListener('auto-battle-toggle', (e) => {
    Game.setAutoBattle(e.detail.enabled);
  });

  arena.addEventListener('auto-scroll-toggle', (e) => {
    Logger.setAutoScroll(e.detail.enabled);
  });

  root.appendChild(arena);
  appState.currentScreen = 'combat';

  // Wait for arena to be fully rendered, then start game
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Initialize Logger with the combat arena's log element
      const logElement = arena.shadowRoot?.querySelector('#log');
      if (logElement) {
        Logger.setLogHolder(logElement);
        // Initialize Logger with arena's auto-scroll state
        Logger.setAutoScroll(arena.autoScroll);
        ConsoleLogger.info(LogCategory.UI, '✅ Logger initialized for combat arena');
        ConsoleLogger.info(
          LogCategory.UI,
          '📜 Auto-scroll:',
          arena.autoScroll ? 'ENABLED' : 'DISABLED'
        );
        ConsoleLogger.info(LogCategory.UI, 'Log element:', logElement);

        // Log tournament round info if this is a tournament battle
        if (tournamentInfo) {
          const message = `
            <div class="tournament-round-start" style="
              background: linear-gradient(135deg, rgba(33, 150, 243, 0.3), rgba(156, 39, 176, 0.3));
              border: 3px solid #2196f3;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
              box-shadow: 0 0 30px rgba(33, 150, 243, 0.5);
            ">
              <div style="font-size: 32px; font-weight: bold; color: #2196f3; margin-bottom: 10px;">
                ${tournamentInfo.roundName}
              </div>
              <div style="font-size: 24px; color: white; margin: 10px 0;">
                ${tournamentInfo.playerName} vs ${tournamentInfo.opponentName}
              </div>
              <div style="font-size: 14px; color: #b3d4fc; margin-top: 10px;">
                Round ${tournamentInfo.roundNumber}/3
              </div>
            </div>
          `;
          Logger.log(message);
        }
      } else {
        ConsoleLogger.error(LogCategory.UI, '❌ Could not find log element in combat arena');
        ConsoleLogger.error(LogCategory.UI, 'Arena shadowRoot:', arena.shadowRoot);
      }

      // Start game based on mode
      if (
        (appState.gameMode === 'single' || appState.gameMode === 'tournament') &&
        fighters.length >= 2
      ) {
        ConsoleLogger.info(
          LogCategory.UI,
          '🎮 Starting single fight:',
          fighters[0].name,
          'vs',
          fighters[1].name
        );
        Game.startGame(fighters[0], fighters[1]);
      }
    });
  });
}

/**
 * Show victory screen
 */
export function showVictoryScreen(winner) {
  // Check achievements after every battle
  setTimeout(() => {
    AchievementManager.checkAchievements();
  }, 1000);

  // Check if this is a tournament battle
  if (appState.tournamentActive) {
    // Check if the player won
    if (winner.isPlayer) {
      const result = tournamentMode.recordVictory();

      if (result.tournamentComplete) {
        // Tournament complete! Show victory screen
        setTimeout(() => {
          showTournamentVictoryScreen();
        }, 2000);
      } else {
        // Continue to next round
        setTimeout(() => {
          startTournamentBattle();
        }, 3000);
      }
    } else {
      // Player lost - tournament over
      tournamentMode.recordDefeat();
      appState.tournamentActive = false;

      // Show regular victory screen for opponent
      setTimeout(() => {
        showRegularVictoryScreen(winner);
      }, 2000);
    }
    return;
  }

  // Regular battle - show victory screen
  showRegularVictoryScreen(winner);
}

/**
 * Show regular victory screen (non-tournament)
 */
function showRegularVictoryScreen(winner) {
  const victoryScreen = document.createElement('victory-screen');
  victoryScreen.setAttribute('winner-name', winner.name);
  victoryScreen.setAttribute('winner-image', winner.image);
  victoryScreen.setAttribute('winner-class', winner.class);

  victoryScreen.addEventListener('play-again', () => {
    victoryScreen.remove();
    appState.selectedFighters = [];

    if (appState.gameMode === 'tournament') {
      showTournamentBracketScreen();
    } else {
      showOpponentSelection();
    }
  });

  victoryScreen.addEventListener('main-menu', () => {
    victoryScreen.remove();
    Game.stopGame();
    appState.reset();
    showTitleScreen();
  });

  victoryScreen.addEventListener('close', () => {
    // Just remove the victory screen overlay without navigating away
    // This allows the user to view combat logs and final stats
    victoryScreen.remove();
  });

  document.body.appendChild(victoryScreen);
}

/**
 * Show tournament victory screen
 */
function showTournamentVictoryScreen() {
  const victoryScreen = document.createElement('victory-screen');
  victoryScreen.setAttribute('winner-name', '🏆 CHAMPION');
  victoryScreen.setAttribute('winner-image', SaveManager.get('profile.character.image'));
  victoryScreen.setAttribute('winner-class', 'Tournament Champion');

  victoryScreen.addEventListener('play-again', () => {
    victoryScreen.remove();
    appState.reset();
    router.navigate(RoutePaths.TOURNAMENT_BRACKET);
  });

  victoryScreen.addEventListener('main-menu', () => {
    victoryScreen.remove();
    Game.stopGame();
    appState.reset();
    router.navigate(RoutePaths.HOME);
  });

  victoryScreen.addEventListener('close', () => {
    // Just remove the victory screen overlay without navigating away
    // This allows the user to view combat logs and final stats
    victoryScreen.remove();
  });

  document.body.appendChild(victoryScreen);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for game to show victory screen
window.showVictoryScreen = showVictoryScreen;

// Export for game to show mission results
window.showMissionResults = showMissionResults;

// Export AchievementManager globally for equipment tracking
window.AchievementManager = AchievementManager;
