import { BaseComponent } from './BaseComponent.js';
import './StatusEffectIcon.js';

/**
 * FighterHUD Web Component
 * Displays fighter stats during combat
 * 
 * Properties:
 * - fighter1: First fighter data
 * - fighter2: Second fighter data
 * - round: Current round number
 */
export class FighterHUD extends BaseComponent {
  constructor() {
    super();
    this._fighter1 = null;
    this._fighter2 = null;
    this._fighter1MaxHealth = 0;
    this._fighter2MaxHealth = 0;
    this._round = 0;
  }

  set fighter1(data) {
    this._fighter1 = data;
    if (data && !this._fighter1MaxHealth) {
      this._fighter1MaxHealth = data.maxHealth || data.health;
    }
    this.render();
  }

  set fighter2(data) {
    this._fighter2 = data;
    if (data && !this._fighter2MaxHealth) {
      this._fighter2MaxHealth = data.maxHealth || data.health;
    }
    this.render();
  }

  set round(num) {
    this._round = num;
    this.render();
  }

  styles() {
    return `
      :host {
        display: block;
        width: 100%;
      }

      .fighter-stats-hud {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        padding: 20px;
        background: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .fighter-stat-card {
        flex: 1;
        display: flex;
        gap: 15px;
        align-items: center;
        padding: 15px;
        background: var(--bg-color);
        border-radius: 8px;
        border: 2px solid var(--border-color);
        min-width: 300px;
      }

      .fighter-stat-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--primary-color);
      }

      .fighter-stat-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .fighter-stat-name {
        font-size: 18px;
        font-weight: bold;
        color: var(--text-color);
      }

      .fighter-stat-class {
        font-size: 12px;
        color: var(--info-color);
        font-weight: 600;
      }

      .status-effects-container {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        min-height: 24px;
      }

      .fighter-stat-bars {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .stat-bar {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .stat-bar-label {
        font-size: 12px;
        font-weight: 600;
        min-width: 40px;
      }

      .stat-bar-container {
        flex: 1;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }

      .stat-bar-fill {
        height: 100%;
        transition: width 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      }

      .stat-bar-fill.health {
        background: linear-gradient(90deg, #28a745, #20c997);
      }

      .stat-bar-fill.health.medium {
        background: linear-gradient(90deg, #ffc107, #fd7e14);
      }

      .stat-bar-fill.health.low {
        background: linear-gradient(90deg, #dc3545, #c82333);
        animation: pulse 0.5s infinite;
      }

      .stat-bar-fill.mana {
        background: linear-gradient(90deg, #3b82f6, #2563eb);
      }

      .stat-bar-fill.strength {
        background: linear-gradient(90deg, #667eea, #764ba2);
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .stat-value {
        font-size: 11px;
        font-weight: 600;
        min-width: 60px;
        text-align: right;
        color: var(--text-color);
      }

      .round-indicator {
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        min-width: 200px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .round-indicator.victory {
        animation: zoomIn 0.6s ease, pulse 1s infinite;
      }

      @keyframes zoomIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
    `;
  }

  template() {
    if (!this._fighter1 || !this._fighter2) {
      return '<div class="fighter-stats-hud"><p>Loading...</p></div>';
    }

    return `
      <div class="fighter-stats-hud">
        ${this.renderFighterCard(this._fighter1, this._fighter1MaxHealth, 'left')}
        
        <div class="round-indicator" id="round-indicator">
          ${this._round > 0 ? `⚔️ ROUND ${this._round} ⚔️` : '⚔️ BATTLE ARENA ⚔️'}
        </div>
        
        ${this.renderFighterCard(this._fighter2, this._fighter2MaxHealth, 'right')}
      </div>
    `;
  }

  renderFighterCard(fighter, maxHealth, side) {
    const currentHealth = Math.max(0, fighter.health);
    const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
    const currentMana = Math.max(0, fighter.mana || 0);
    const maxMana = fighter.maxMana || 100;
    const manaPercent = Math.max(0, Math.min(100, (currentMana / maxMana) * 100));
    
    let healthClass = '';
    if (healthPercent < 30) healthClass = 'low';
    else if (healthPercent < 60) healthClass = 'medium';

    const statusEffects = fighter.statusEffects || [];
    const statusEffectsHTML = statusEffects.map(effect => 
      `<status-effect-icon
        effect-name="${effect.name}"
        effect-icon="${effect.icon}"
        effect-type="${effect.type}"
        effect-duration="${effect.duration}"
      ></status-effect-icon>`
    ).join('');

    return `
      <div class="fighter-stat-card ${side}">
        <img class="fighter-stat-avatar" src="${fighter.image}" alt="${fighter.name}" />
        <div class="fighter-stat-info">
          <div class="fighter-stat-name">${fighter.name}</div>
          <div class="fighter-stat-class">${fighter.class || 'Fighter'}</div>
          <div class="status-effects-container">${statusEffectsHTML}</div>
          <div class="fighter-stat-bars">
            <div class="stat-bar">
              <span class="stat-bar-label">❤️ HP</span>
              <div class="stat-bar-container">
                <div class="stat-bar-fill health ${healthClass}" style="width: ${healthPercent}%">
                  <span>${Math.round(healthPercent)}%</span>
                </div>
              </div>
              <span class="stat-value">${currentHealth} / ${maxHealth}</span>
            </div>
            <div class="stat-bar">
              <span class="stat-bar-label">💧 MP</span>
              <div class="stat-bar-container">
                <div class="stat-bar-fill mana" style="width: ${manaPercent}%">
                  <span>${Math.round(manaPercent)}%</span>
                </div>
              </div>
              <span class="stat-value">${currentMana} / ${maxMana}</span>
            </div>
            <div class="stat-bar">
              <span class="stat-bar-label">⚔️ STR</span>
              <div class="stat-bar-container">
                <div class="stat-bar-fill strength" style="width: 100%"></div>
              </div>
              <span class="stat-value">${fighter.strength}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showWinner(winner) {
    const roundIndicator = this.shadowRoot.querySelector('#round-indicator');
    if (roundIndicator) {
      roundIndicator.textContent = `🏆 ${winner.name.toUpperCase()} WINS! 🏆`;
      roundIndicator.classList.add('victory');
    }
  }
}

// Register the component
customElements.define('fighter-hud', FighterHUD);
