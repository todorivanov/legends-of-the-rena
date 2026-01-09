import { BaseComponent } from './BaseComponent.js';
import { DifficultyManager, DIFFICULTY_CONFIG } from '../game/DifficultyManager.js';
import { router } from '../utils/Router.js';
import { RoutePaths } from '../config/routes.js';

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
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        overflow-y: auto;
      }

      .settings-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
      }

      .settings-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .settings-title {
        font-family: 'Orbitron', monospace;
        font-size: 48px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
      }

      .back-btn {
        position: fixed;
        top: 30px;
        left: 30px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: rgba(42, 26, 71, 0.7);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        z-index: 100;
      }

      .back-btn:hover {
        background: rgba(255, 23, 68, 0.7);
        border-color: #ff1744;
        box-shadow: 0 0 20px rgba(255, 23, 68, 0.5);
      }

      .settings-section {
        margin-bottom: 50px;
        animation: fadeInUp 0.8s ease;
      }

      .section-title {
        font-size: 28px;
        font-weight: 700;
        color: #ffa726;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .section-description {
        color: #b39ddb;
        font-size: 16px;
        margin-bottom: 30px;
        line-height: 1.6;
      }

      .difficulty-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
      }

      .difficulty-card {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 3px solid;
        border-radius: 15px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .difficulty-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .difficulty-card.easy { border-color: #4caf50; }
      .difficulty-card.normal { border-color: #2196f3; }
      .difficulty-card.hard { border-color: #ff9800; }
      .difficulty-card.nightmare { border-color: #f44336; }

      .difficulty-card.selected {
        box-shadow: 0 0 30px currentColor;
        transform: scale(1.05);
      }

      .difficulty-card.selected::after {
        content: '✓ SELECTED';
        position: absolute;
        top: 15px;
        right: 15px;
        background: currentColor;
        color: white;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .difficulty-icon {
        font-size: 48px;
        text-align: center;
        margin-bottom: 15px;
      }

      .difficulty-name {
        font-size: 24px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 10px;
      }

      .difficulty-card.easy .difficulty-name { color: #4caf50; }
      .difficulty-card.normal .difficulty-name { color: #2196f3; }
      .difficulty-card.hard .difficulty-name { color: #ff9800; }
      .difficulty-card.nightmare .difficulty-name { color: #f44336; }

      .difficulty-description {
        font-size: 14px;
        color: #b39ddb;
        text-align: center;
        margin-bottom: 20px;
        line-height: 1.5;
      }

      .difficulty-tips {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .difficulty-tip {
        font-size: 13px;
        color: #e0e0e0;
        padding: 8px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .difficulty-tip::before {
        content: '•';
        color: currentColor;
        font-weight: bold;
      }

      .current-settings {
        background: linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(156, 39, 176, 0.2));
        border: 2px solid #2196f3;
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 40px;
        animation: fadeIn 1s ease;
      }

      .current-settings-title {
        font-size: 22px;
        font-weight: 700;
        color: #2196f3;
        margin-bottom: 15px;
        text-align: center;
      }

      .current-setting {
        display: flex;
        justify-content: space-between;
        padding: 12px 20px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        margin-bottom: 10px;
      }

      .setting-label {
        color: #b39ddb;
        font-size: 16px;
      }

      .setting-value {
        color: white;
        font-weight: 600;
        font-size: 16px;
      }

      .save-management-btn {
        width: 100%;
        padding: 20px;
        font-size: 18px;
        font-weight: 700;
        color: white;
        background: linear-gradient(135deg, #6a42c2 0%, #2d1b69 100%);
        border: 3px solid #b39ddb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .save-management-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(106, 66, 194, 0.5);
        border-color: #6a42c2;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
  }

  template() {
    const currentDifficulty = DifficultyManager.getCurrentDifficulty();
    const difficulties = DifficultyManager.getAllDifficultiesInfo();

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
  }
}

customElements.define('settings-screen', SettingsScreen);
