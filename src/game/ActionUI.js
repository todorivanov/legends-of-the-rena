import { soundManager } from '../utils/soundManager.js';

/**
 * ActionUI - Manages the action selection interface
 */
export class ActionUI {
  constructor() {
    this.actionContainer = null;
    this.onActionSelected = null;
  }

  /**
   * Create and show action selection UI
   */
  show(fighter, onActionCallback) {
    this.onActionSelected = onActionCallback;
    this.remove(); // Remove existing UI if any

    const combatView = document.querySelector('.combat-view');
    if (!combatView) return;

    // Generate skill buttons HTML
    const skillButtonsHTML = fighter.skills.map((skill, index) => {
      const isDisabled = !skill.isReady() || fighter.mana < skill.manaCost;
      const disabledAttr = isDisabled ? 'disabled' : '';
      const cooldownText = !skill.isReady() ? `⏱️ ${skill.currentCooldown}` : `💧 ${skill.manaCost}`;
      
      return `
        <button class="action-btn skill-btn" data-action="skill" data-skill-index="${index}" ${disabledAttr}>
          <span class="action-icon">💫</span>
          <span class="action-name">${skill.name}</span>
          <span class="action-desc">${cooldownText}</span>
        </button>
      `;
    }).join('');

    const actionHTML = `
      <div class="action-selection-ui">
        <div class="action-prompt">
          <h3>⚔️ ${fighter.name}'s Turn!</h3>
          <p class="text-muted">Choose your action</p>
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
          
          <button class="action-btn item-btn" data-action="item" ${fighter.health >= fighter.maxHealth ? 'disabled' : ''}>
            <span class="action-icon">🧪</span>
            <span class="action-name">Heal</span>
            <span class="action-desc">+50 HP</span>
          </button>
        </div>
      </div>
    `;

    combatView.insertAdjacentHTML('afterbegin', actionHTML);
    this.actionContainer = combatView.querySelector('.action-selection-ui');

    // Attach click handlers
    this.actionContainer.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!e.currentTarget.disabled) {
          soundManager.play('hit');
          const action = e.currentTarget.dataset.action;
          const skillIndex = e.currentTarget.dataset.skillIndex;
          
          if (action === 'skill' && skillIndex !== undefined) {
            this.selectAction({ action: 'skill', skillIndex: parseInt(skillIndex) });
          } else {
            this.selectAction({ action });
          }
        }
      });
    });
  }

  /**
   * Handle action selection
   */
  selectAction(actionData) {
    // Add visual feedback
    let btn;
    if (actionData.action === 'skill') {
      btn = this.actionContainer.querySelector(`[data-skill-index="${actionData.skillIndex}"]`);
    } else {
      btn = this.actionContainer.querySelector(`[data-action="${actionData.action}"]`);
    }
    
    if (btn) {
      btn.classList.add('selected');
      setTimeout(() => {
        this.remove();
        if (this.onActionSelected) {
          this.onActionSelected(actionData);
        }
      }, 300);
    }
  }

  /**
   * Remove action UI
   */
  remove() {
    if (this.actionContainer) {
      this.actionContainer.remove();
      this.actionContainer = null;
    }
  }

  /**
   * Disable all buttons
   */
  disable() {
    if (this.actionContainer) {
      this.actionContainer.querySelectorAll('.action-btn').forEach(btn => {
        btn.disabled = true;
      });
    }
  }
}

export const actionUI = new ActionUI();
