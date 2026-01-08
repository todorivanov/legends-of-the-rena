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
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      .action-selection-ui {
        background: var(--card-bg);
        border-top: 3px solid var(--primary-color);
        padding: 25px;
        box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
        animation: slideInFromBottom 0.4s ease;
      }

      @keyframes slideInFromBottom {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .action-prompt {
        text-align: center;
        margin-bottom: 20px;
      }

      .action-prompt h3 {
        margin: 0 0 5px 0;
        color: var(--text-color);
        font-size: 24px;
      }

      .action-prompt p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 900px;
        margin: 0 auto;
      }

      .action-btn {
        flex: 1;
        min-width: 180px;
        max-width: 220px;
        padding: 20px;
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
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
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        border-color: var(--primary-color);
      }

      .action-btn:active:not(:disabled) {
        transform: translateY(-2px);
      }

      .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-btn.selected {
        background: var(--primary-color);
        color: white;
        transform: scale(0.95);
      }

      .action-icon {
        font-size: 36px;
        line-height: 1;
      }

      .action-name {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
      }

      .action-btn.selected .action-name {
        color: white;
      }

      .action-desc {
        font-size: 12px;
        color: #666;
        text-align: center;
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
    `;
  }

  template() {
    if (!this._fighter) {
      return '<div class="action-selection-ui"><p>Loading...</p></div>';
    }

    const skillButtonsHTML = this._fighter.skills.map((skill, index) => {
      const isDisabled = !skill.isReady() || this._fighter.mana < skill.manaCost;
      const cooldownText = !skill.isReady() ? `⏱️ ${skill.currentCooldown}` : `💧 ${skill.manaCost}`;
      
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
    }).join('');

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
            <span class="action-desc">+50 HP</span>
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.action-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!e.currentTarget.disabled) {
          const action = e.currentTarget.dataset.action;
          const skillIndex = e.currentTarget.dataset.skillIndex;
          
          e.currentTarget.classList.add('selected');
          
          setTimeout(() => {
            const actionData = action === 'skill' && skillIndex !== undefined
              ? { action: 'skill', skillIndex: parseInt(skillIndex) }
              : { action };
            
            this.emit('action-selected', actionData);
            this.remove();
          }, 300);
        }
      });
    });
  }
}

// Register the component
customElements.define('action-selection', ActionSelection);
