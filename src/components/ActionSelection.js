import { BaseComponent } from './BaseComponent.js';

/**
 * ActionSelection Web Component
 * Displays action buttons for turn-based combat
 *
 * Properties:
 * - fighter: Fighter object with skills, mana, health data
 *
 * Events:
 * - action-selected: { action, skillIndex }
 */
export class ActionSelection extends BaseComponent {
  constructor() {
    super();
    this._fighter = null;
  }

  set fighter(data) {
    this._fighter = data;
    this.render();
  }

  get fighter() {
    return this._fighter;
  }

  styles() {
    return `
      :host {
        display: block;
        width: 100%;
      }

      .action-selection-ui {
        background: linear-gradient(145deg, rgba(42, 26, 71, 0.98) 0%, rgba(26, 13, 46, 0.98) 100%);
        border: 3px solid rgba(255, 167, 38, 0.8);
        border-radius: 16px;
        padding: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
        animation: slideInFromRight 0.4s ease;
        backdrop-filter: blur(15px);
      }

      @keyframes slideInFromRight {
        from {
          transform: translateX(50px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .action-prompt {
        text-align: center;
        margin-bottom: 8px;
      }

      .action-prompt h3 {
        margin: 0 0 3px 0;
        color: #ffa726;
        font-size: 16px;
        text-shadow: 0 0 10px rgba(255, 167, 38, 0.5);
      }

      .action-prompt p {
        margin: 0;
        font-size: 11px;
        color: #b39ddb;
      }

      .action-buttons {
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 800px;
        margin: 0 auto;
      }

      .action-btn {
        flex: 1;
        min-width: 120px;
        max-width: 160px;
        padding: 10px 12px;
        background: linear-gradient(145deg, rgba(42, 26, 71, 0.6) 0%, rgba(26, 13, 46, 0.8) 100%);
        border: 2px solid rgba(106, 66, 194, 0.5);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }

      .action-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }

      .action-btn:hover:not(:disabled)::before {
        left: 100%;
      }

      .action-btn:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(255, 167, 38, 0.4);
        border-color: #ffa726;
        background: linear-gradient(145deg, rgba(255, 167, 38, 0.2) 0%, rgba(106, 66, 194, 0.3) 100%);
      }

      .action-btn:active:not(:disabled) {
        transform: translateY(-1px);
      }

      .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-btn.selected {
        background: linear-gradient(135deg, #ffa726, #ff6f00);
        color: white;
        transform: scale(0.95);
        border-color: #ffa726;
        box-shadow: 0 0 30px rgba(255, 167, 38, 0.6);
      }

      .action-icon {
        font-size: 24px;
        line-height: 1;
      }

      .action-name {
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
      }

      .action-btn.selected .action-name {
        color: white;
      }

      .action-desc {
        font-size: 10px;
        color: #b39ddb;
        text-align: center;
        line-height: 1.2;
      }

      .action-btn.selected .action-desc {
        color: rgba(255, 255, 255, 0.9);
      }

      /* Specific button colors */
      .attack-btn:hover:not(:disabled) {
        border-color: #ffc107;
      }

      .defend-btn:hover:not(:disabled) {
        border-color: #17a2b8;
      }

      .skill-btn:hover:not(:disabled) {
        border-color: #dc3545;
      }

      .item-btn:hover:not(:disabled) {
        border-color: #28a745;
      }

      /* Surrender Container */
      .surrender-container {
        text-align: center;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .surrender-btn {
        padding: 6px 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: rgba(255, 255, 255, 0.6);
        background: transparent;
        border: 1px solid rgba(255, 23, 68, 0.4);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .surrender-btn:hover {
        background: rgba(255, 23, 68, 0.2);
        border-color: #ff1744;
        color: #ff1744;
        box-shadow: 0 0 15px rgba(255, 23, 68, 0.4);
        transform: translateY(-1px);
      }

      .surrender-btn:active {
        transform: translateY(0);
      }

      .surrender-icon {
        font-size: 14px;
      }

      .surrender-text {
        font-size: 11px;
      }

      @media (max-width: 768px) {
        :host {
          margin: 10px auto;
        }

        .action-selection-ui {
          padding: 10px 12px;
        }

        .action-prompt h3 {
          font-size: 14px;
        }

        .action-prompt p {
          font-size: 10px;
        }

        .action-buttons {
          gap: 6px;
        }

        .action-btn {
          min-width: 100px;
          max-width: 140px;
          padding: 8px 10px;
          font-size: 11px;
        }

        .action-icon {
          font-size: 20px;
        }

        .action-name {
          font-size: 11px;
        }

        .action-cost, .action-cooldown {
          font-size: 9px;
        }
      }

      @media (max-width: 480px) {
        .action-selection-ui {
          padding: 8px 10px;
        }

        .action-buttons {
          gap: 4px;
        }

        .action-btn {
          min-width: 80px;
          max-width: 120px;
          padding: 6px 8px;
        }

        .action-icon {
          font-size: 18px;
        }

        .action-name {
          font-size: 10px;
        }
      }
    `;
  }

  template() {
    if (!this._fighter) {
      return '<div class="action-selection-ui"><p>Loading...</p></div>';
    }

    const skillButtonsHTML = this._fighter.skills
      .map((skill, index) => {
        const isDisabled = !skill.isReady() || this._fighter.mana < skill.manaCost;
        const cooldownText = !skill.isReady()
          ? `⏱️ ${skill.currentCooldown}`
          : `💧 ${skill.manaCost}`;

        return `
        <button 
          class="action-btn skill-btn" 
          data-action="skill" 
          data-skill-index="${index}"
          ${isDisabled ? 'disabled' : ''}
        >
          <span class="action-icon">💫</span>
          <span class="action-name">${skill.name}</span>
          <span class="action-desc">${cooldownText}</span>
        </button>
      `;
      })
      .join('');

    const canHeal = this._fighter.health < this._fighter.maxHealth;

    return `
      <div class="action-selection-ui">
        <div class="action-prompt">
          <h3>⚔️ ${this._fighter.name}'s Turn!</h3>
          <p>Choose your action</p>
        </div>
        
        <div class="action-buttons">
          <button class="action-btn attack-btn" data-action="attack">
            <span class="action-icon">⚔️</span>
            <span class="action-name">Attack</span>
            <span class="action-desc">Basic attack</span>
          </button>
          
          <button class="action-btn defend-btn" data-action="defend">
            <span class="action-icon">🛡️</span>
            <span class="action-name">Defend</span>
            <span class="action-desc">-50% damage</span>
          </button>
          
          ${skillButtonsHTML}
          
          <button class="action-btn item-btn" data-action="item" ${!canHeal ? 'disabled' : ''}>
            <span class="action-icon">🧪</span>
            <span class="action-name">Heal</span>
            <span class="action-desc">+20 HP</span>
          </button>
        </div>

        <div class="surrender-container">
          <button class="surrender-btn" data-action="surrender">
            <span class="surrender-icon">🏳️</span>
            <span class="surrender-text">Surrender</span>
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.action-btn');

    // Check if opponent is out of range and update attack button
    const inRange = this.dataset.inRange === 'true';
    const attackBtn = this.shadowRoot.querySelector('.attack-btn');
    if (attackBtn && !inRange) {
      attackBtn.classList.add('out-of-range');
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (!e.currentTarget.disabled) {
          const action = e.currentTarget.dataset.action;
          const skillIndex = e.currentTarget.dataset.skillIndex;

          e.currentTarget.classList.add('selected');

          setTimeout(() => {
            const actionData =
              action === 'skill' && skillIndex !== undefined
                ? { action: 'skill', skillIndex: parseInt(skillIndex) }
                : { action };

            this.emit('action-selected', actionData);
            this.remove();
          }, 300);
        }
      });
    });

    // Handle surrender button
    const surrenderBtn = this.shadowRoot.querySelector('.surrender-btn');
    if (surrenderBtn) {
      surrenderBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to surrender? You will lose this battle!')) {
          this.emit('action-selected', { action: 'surrender' });
          this.remove();
        }
      });
    }
  }
}

// Register the component
customElements.define('action-selection', ActionSelection);
