import { BaseComponent } from './BaseComponent.js';
import settingsStyles from '../styles/components/SettingsScreen.scss?inline';
import { DifficultyManager, DIFFICULTY_CONFIG } from '../game/DifficultyManager.js';
import { router } from '../utils/Router.js';
import { RoutePaths } from '../config/routes.js';
import { gameStore } from '../store/gameStore.js';
import { togglePerformanceMonitor } from '../store/actions.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

/**
 * SettingsScreen Web Component
 * Displays game settings including difficulty selection
 *
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class SettingsScreen extends BaseComponent {
  constructor() {
    super();
  }

  styles() {
    return settingsStyles;
  }

  template() {
    const currentDifficulty = DifficultyManager.getCurrentDifficulty();
    const difficulties = DifficultyManager.getAllDifficultiesInfo();
    const state = gameStore.getState();
    const showPerformanceMonitor = state.settings.showPerformanceMonitor;

    return `
      <div class="settings-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="settings-header">
          <h1 class="settings-title">⚙️ Settings</h1>
        </div>

        <!-- Current Settings -->
        <div class="current-settings">
          <div class="current-settings-title">📊 Current Configuration</div>
          <div class="current-setting">
            <span class="setting-label">Difficulty</span>
            <span class="setting-value">${DifficultyManager.formatDifficultyDisplay()}</span>
          </div>
          <div class="current-setting">
            <span class="setting-label">XP Multiplier</span>
            <span class="setting-value">${(DifficultyManager.getXPMultiplier() * 100).toFixed(0)}%</span>
          </div>
          <div class="current-setting">
            <span class="setting-label">Equipment Drop Rate</span>
            <span class="setting-value">${(DifficultyManager.getEquipmentDropRate() * 100).toFixed(0)}%</span>
          </div>
          <button class="save-management-btn">
            💾 Manage Save Files
          </button>
        </div>

        <!-- Toggle Settings -->
        <div class="toggle-settings">
          <div class="toggle-option">
            <div class="toggle-info">
              <div class="toggle-title">⚡ Performance Monitor</div>
              <div class="toggle-desc">Show FPS, frame time, and memory usage</div>
            </div>
            <div class="toggle-switch ${showPerformanceMonitor ? 'active' : ''}" data-toggle="performance-monitor"></div>
          </div>
        </div>

        <!-- Logger Settings -->
        <div class="settings-section logger-settings">
          <div class="section-title">
            <span>📋</span>
            Console Logger
          </div>
          <div class="section-description">
            Control what gets logged to the browser console. Disable noisy systems to focus on specific debugging tasks.
          </div>

          ${this.renderLoggerSettings()}
        </div>

        <!-- Difficulty Selection -->
        <div class="settings-section">
          <div class="section-title">
            <span>🎮</span>
            Difficulty Level
          </div>
          <div class="section-description">
            Choose your challenge level. Higher difficulties provide better rewards but tougher enemies.
            <strong>Changes take effect in the next battle.</strong>
          </div>

          <div class="difficulty-grid">
            ${difficulties.map((diff) => this.renderDifficultyCard(diff, currentDifficulty)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderDifficultyCard(difficulty, currentDifficulty) {
    const isSelected = difficulty.id === currentDifficulty;

    return `
      <div 
        class="difficulty-card ${difficulty.id} ${isSelected ? 'selected' : ''}" 
        data-difficulty="${difficulty.id}"
        style="border-color: ${difficulty.color};"
      >
        <div class="difficulty-icon">${difficulty.icon}</div>
        <div class="difficulty-name">${difficulty.name}</div>
        <div class="difficulty-description">${difficulty.description}</div>
        <ul class="difficulty-tips">
          ${difficulty.tips
            .map(
              (tip) => `
            <li class="difficulty-tip" style="color: ${difficulty.color};">${tip}</li>
          `
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  renderLoggerSettings() {
    const loggerSettings = ConsoleLogger.getSettings();
    const categoryStates = ConsoleLogger.getAllCategoryStates();

    return `
      <div class="logger-controls">
        <!-- Master Toggle -->
        <div class="logger-master-toggle">
          <div class="toggle-option">
            <div class="toggle-info">
              <div class="toggle-title">🔧 Enable Console Logging</div>
              <div class="toggle-desc">Master switch for all console output</div>
            </div>
            <div class="toggle-switch ${loggerSettings.enabled ? 'active' : ''}" data-logger-toggle="master"></div>
          </div>
        </div>

        ${
          loggerSettings.enabled
            ? `
          <!-- Log Levels -->
          <div class="logger-levels">
            <h3 class="logger-subsection-title">Log Levels</h3>
            <div class="logger-level-grid">
              <div class="logger-level-item">
                <span class="logger-level-label">🔍 Debug</span>
                <div class="toggle-switch ${loggerSettings.levels.DEBUG ? 'active' : ''}" data-logger-level="DEBUG"></div>
              </div>
              <div class="logger-level-item">
                <span class="logger-level-label">ℹ️ Info</span>
                <div class="toggle-switch ${loggerSettings.levels.INFO ? 'active' : ''}" data-logger-level="INFO"></div>
              </div>
              <div class="logger-level-item">
                <span class="logger-level-label">⚠️ Warn</span>
                <div class="toggle-switch ${loggerSettings.levels.WARN ? 'active' : ''}" data-logger-level="WARN"></div>
              </div>
              <div class="logger-level-item">
                <span class="logger-level-label">❌ Error</span>
                <div class="toggle-switch ${loggerSettings.levels.ERROR ? 'active' : ''}" data-logger-level="ERROR"></div>
              </div>
            </div>
          </div>

          <!-- Categories -->
          <div class="logger-categories">
            <h3 class="logger-subsection-title">System Categories</h3>
            <div class="logger-categories-note">
              Disable specific systems to reduce console noise
            </div>
            <div class="logger-category-grid">
              ${Object.entries(categoryStates)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(
                  ([category, enabled]) => `
                  <div class="logger-category-item">
                    <span class="logger-category-label">${this.getCategoryIcon(category)} ${category}</span>
                    <div class="toggle-switch ${enabled ? 'active' : ''}" data-logger-category="${category}"></div>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="logger-actions">
            <button class="logger-action-btn" data-logger-action="enable-all">✅ Enable All</button>
            <button class="logger-action-btn" data-logger-action="disable-all">❌ Disable All</button>
            <button class="logger-action-btn" data-logger-action="reset">🔄 Reset to Defaults</button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  getCategoryIcon(category) {
    const icons = {
      Combat: '⚔️',
      Economy: '💰',
      ActionQueue: '📥',
      AI: '🤖',
      Equipment: '🛡️',
      SaveSystem: '💾',
      UI: '🖼️',
      Performance: '⚡',
      Story: '📖',
      Tournament: '🏆',
      Achievement: '🎖️',
      Grid: '🎯',
      StatusEffect: '✨',
      Skill: '🎓',
      Leveling: '📈',
      Marketplace: '🏪',
      Durability: '🔧',
      Terrain: '🗺️',
      Sound: '🔊',
      Router: '🧭',
      Store: '🗄️',
      General: '📝',
    };
    return icons[category] || '📌';
  }

  attachEventListeners() {
    // Back button
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    // Save management button
    const saveManagementBtn = this.shadowRoot.querySelector('.save-management-btn');
    if (saveManagementBtn) {
      saveManagementBtn.addEventListener('click', () => {
        router.navigate(RoutePaths.SAVE_MANAGEMENT);
      });
    }

    // Performance monitor toggle
    const perfMonitorToggle = this.shadowRoot.querySelector('[data-toggle="performance-monitor"]');
    if (perfMonitorToggle) {
      perfMonitorToggle.addEventListener('click', () => {
        gameStore.dispatch(togglePerformanceMonitor());
        this.render();

        // Update the UI immediately
        const state = gameStore.getState();
        const perfMonitor = document.querySelector('performance-monitor-ui');
        if (state.settings.showPerformanceMonitor) {
          if (!perfMonitor) {
            const newPerfMonitor = document.createElement('performance-monitor-ui');
            document.body.appendChild(newPerfMonitor);
          }
        } else {
          if (perfMonitor) {
            perfMonitor.remove();
          }
        }
      });
    }

    // Difficulty cards
    const difficultyCards = this.shadowRoot.querySelectorAll('.difficulty-card');
    difficultyCards.forEach((card) => {
      card.addEventListener('click', () => {
        const difficulty = card.dataset.difficulty;
        if (DifficultyManager.setDifficulty(difficulty)) {
          this.render();

          // Show confirmation
          const config = DIFFICULTY_CONFIG[difficulty];
          alert(
            `✅ Difficulty set to ${config.icon} ${config.name}\n\nChanges will take effect in your next battle!`
          );
        }
      });
    });

    // Logger master toggle
    const loggerMasterToggle = this.shadowRoot.querySelector('[data-logger-toggle="master"]');
    if (loggerMasterToggle) {
      loggerMasterToggle.addEventListener('click', () => {
        const currentState = ConsoleLogger.isEnabled();
        ConsoleLogger.setEnabled(!currentState);
        this.render();
      });
    }

    // Logger level toggles
    const levelToggles = this.shadowRoot.querySelectorAll('[data-logger-level]');
    levelToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const level = toggle.dataset.loggerLevel;
        const currentState = ConsoleLogger.isLevelEnabled(level);
        ConsoleLogger.setLevelEnabled(level, !currentState);
        this.render();
      });
    });

    // Logger category toggles
    const categoryToggles = this.shadowRoot.querySelectorAll('[data-logger-category]');
    categoryToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const category = toggle.dataset.loggerCategory;
        const currentState = ConsoleLogger.isCategoryEnabled(category);
        ConsoleLogger.setCategoryEnabled(category, !currentState);
        this.render();
      });
    });

    // Logger action buttons
    const enableAllBtn = this.shadowRoot.querySelector('[data-logger-action="enable-all"]');
    if (enableAllBtn) {
      enableAllBtn.addEventListener('click', () => {
        Object.values(LogCategory).forEach((category) => {
          ConsoleLogger.setCategoryEnabled(category, true);
        });
        this.render();
      });
    }

    const disableAllBtn = this.shadowRoot.querySelector('[data-logger-action="disable-all"]');
    if (disableAllBtn) {
      disableAllBtn.addEventListener('click', () => {
        Object.values(LogCategory).forEach((category) => {
          ConsoleLogger.setCategoryEnabled(category, false);
        });
        this.render();
      });
    }

    const resetBtn = this.shadowRoot.querySelector('[data-logger-action="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset logger settings to defaults?')) {
          ConsoleLogger.resetSettings();
          this.render();
        }
      });
    }
  }
}

customElements.define('settings-screen', SettingsScreen);
