/**
 * HUD Manager - Manages the fighter stats display
 */
export class HUDManager {
  constructor() {
    this.hudElement = null;
    this.fighter1 = null;
    this.fighter2 = null;
    this.fighter1MaxHealth = 0;
    this.fighter2MaxHealth = 0;
    this.roundNumber = 0;
  }

  /**
   * Initialize HUD for single fight
   */
  initSingleFight(fighter1, fighter2) {
    this.fighter1 = fighter1;
    this.fighter2 = fighter2;
    this.fighter1MaxHealth = fighter1.health;
    this.fighter2MaxHealth = fighter2.health;
    this.roundNumber = 0;

    this.createHUD();
    this.update();
  }

  /**
   * Create HUD HTML structure
   */
  createHUD() {
    // Remove existing HUD if any
    const existingHUD = document.querySelector('.fighter-stats-hud');
    if (existingHUD) {
      existingHUD.remove();
    }

    // Hide fighter selection view and show combat view
    const selectionView = document.querySelector('.fighter-selection-view');
    const combatView = document.querySelector('.combat-view');
    
    if (selectionView) {
      selectionView.style.display = 'none';
    }
    if (combatView) {
      combatView.style.display = 'flex';
    }

    const gameContent = document.querySelector('.game-content');
    if (!gameContent) return;

    const hudHTML = `
      <div class="fighter-stats-hud">
        <div class="fighter-stat-card left" id="fighter1-card">
          <img class="fighter-stat-avatar" id="fighter1-avatar" src="" alt="Fighter 1">
          <div class="fighter-stat-info">
            <div class="fighter-stat-name" id="fighter1-name"></div>
            <div class="fighter-stat-class" id="fighter1-class"></div>
            <div class="status-effects-container" id="fighter1-status"></div>
            <div class="fighter-stat-bars">
              <div class="stat-bar">
                <span class="stat-bar-label">❤️ HP</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill health" id="fighter1-health-bar">
                    <span id="fighter1-health-percent"></span>
                  </div>
                </div>
                <span class="stat-value" id="fighter1-health-value"></span>
              </div>
              <div class="stat-bar">
                <span class="stat-bar-label">💧 MP</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill mana" id="fighter1-mana-bar">
                    <span id="fighter1-mana-percent"></span>
                  </div>
                </div>
                <span class="stat-value" id="fighter1-mana-value"></span>
              </div>
              <div class="stat-bar">
                <span class="stat-bar-label">⚔️ STR</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill strength" id="fighter1-str-bar"></div>
                </div>
                <span class="stat-value" id="fighter1-str-value"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="round-indicator" id="round-indicator">
          ⚔️ BATTLE ARENA ⚔️
        </div>

        <div class="fighter-stat-card right" id="fighter2-card">
          <img class="fighter-stat-avatar" id="fighter2-avatar" src="" alt="Fighter 2">
          <div class="fighter-stat-info">
            <div class="fighter-stat-name" id="fighter2-name"></div>
            <div class="fighter-stat-class" id="fighter2-class"></div>
            <div class="status-effects-container" id="fighter2-status"></div>
            <div class="fighter-stat-bars">
              <div class="stat-bar">
                <span class="stat-bar-label">❤️ HP</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill health" id="fighter2-health-bar">
                    <span id="fighter2-health-percent"></span>
                  </div>
                </div>
                <span class="stat-value" id="fighter2-health-value"></span>
              </div>
              <div class="stat-bar">
                <span class="stat-bar-label">💧 MP</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill mana" id="fighter2-mana-bar">
                    <span id="fighter2-mana-percent"></span>
                  </div>
                </div>
                <span class="stat-value" id="fighter2-mana-value"></span>
              </div>
              <div class="stat-bar">
                <span class="stat-bar-label">⚔️ STR</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill strength" id="fighter2-str-bar"></div>
                </div>
                <span class="stat-value" id="fighter2-str-value"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    gameContent.insertAdjacentHTML('afterbegin', hudHTML);
    this.hudElement = gameContent.querySelector('.fighter-stats-hud');
  }

  /**
   * Update HUD with current fighter stats
   */
  update() {
    if (!this.fighter1 || !this.fighter2) return;

    // Fighter 1
    this.updateFighter('fighter1', this.fighter1, this.fighter1MaxHealth);
    // Fighter 2
    this.updateFighter('fighter2', this.fighter2, this.fighter2MaxHealth);
  }

  /**
   * Update individual fighter display
   */
  updateFighter(prefix, fighter, maxHealth) {
    // Update avatar
    const avatar = document.getElementById(`${prefix}-avatar`);
    if (avatar) avatar.src = fighter.image;

    // Update name
    const name = document.getElementById(`${prefix}-name`);
    if (name) name.textContent = fighter.name;

    // Update class
    const classEl = document.getElementById(`${prefix}-class`);
    if (classEl) classEl.textContent = fighter.class || 'Fighter';

    // Update health
    const currentHealth = Math.max(0, fighter.health);
    const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
    
    const healthBar = document.getElementById(`${prefix}-health-bar`);
    const healthPercentText = document.getElementById(`${prefix}-health-percent`);
    const healthValue = document.getElementById(`${prefix}-health-value`);

    if (healthBar) {
      healthBar.style.width = `${healthPercent}%`;
      
      // Update health bar color based on percentage
      healthBar.classList.remove('medium', 'low');
      if (healthPercent < 30) {
        healthBar.classList.add('low');
      } else if (healthPercent < 60) {
        healthBar.classList.add('medium');
      }
    }

    if (healthPercentText) {
      healthPercentText.textContent = `${Math.round(healthPercent)}%`;
    }

    if (healthValue) {
      healthValue.textContent = `${currentHealth} / ${maxHealth}`;
    }

    // Update mana
    const currentMana = Math.max(0, fighter.mana || 0);
    const maxMana = fighter.maxMana || 100;
    const manaPercent = Math.max(0, Math.min(100, (currentMana / maxMana) * 100));
    
    const manaBar = document.getElementById(`${prefix}-mana-bar`);
    const manaPercentText = document.getElementById(`${prefix}-mana-percent`);
    const manaValue = document.getElementById(`${prefix}-mana-value`);

    if (manaBar) {
      manaBar.style.width = `${manaPercent}%`;
    }

    if (manaPercentText) {
      manaPercentText.textContent = `${Math.round(manaPercent)}%`;
    }

    if (manaValue) {
      manaValue.textContent = `${currentMana} / ${maxMana}`;
    }

    // Update strength
    const strBar = document.getElementById(`${prefix}-str-bar`);
    const strValue = document.getElementById(`${prefix}-str-value`);
    
    if (strBar) {
      strBar.style.width = '100%';
    }
    
    if (strValue) {
      strValue.textContent = fighter.strength;
    }

    // Update status effects
    this.updateStatusEffects(prefix, fighter);
  }

  /**
   * Update status effects display
   */
  updateStatusEffects(prefix, fighter) {
    const statusContainer = document.getElementById(`${prefix}-status`);
    if (!statusContainer) return;

    if (fighter.statusEffects && fighter.statusEffects.length > 0) {
      const effectsHTML = fighter.statusEffects.map(effect => 
        `<span class="status-effect ${effect.type}" title="${effect.name} (${effect.duration} turns)">${effect.icon}</span>`
      ).join('');
      statusContainer.innerHTML = effectsHTML;
    } else {
      statusContainer.innerHTML = '';
    }
  }

  /**
   * Update round number
   */
  setRound(round) {
    this.roundNumber = round;
    const roundIndicator = document.getElementById('round-indicator');
    if (roundIndicator && round > 0) {
      roundIndicator.textContent = `⚔️ ROUND ${round} ⚔️`;
    }
  }

  /**
   * Show winner
   */
  showWinner(winner) {
    const roundIndicator = document.getElementById('round-indicator');
    if (roundIndicator) {
      roundIndicator.textContent = `🏆 ${winner.name.toUpperCase()} WINS! 🏆`;
      roundIndicator.style.animation = 'zoomIn 0.6s ease, pulse 1s infinite';
    }
  }

  /**
   * Remove HUD
   */
  remove() {
    if (this.hudElement) {
      this.hudElement.remove();
      this.hudElement = null;
    }
    
    // Show fighter selection view and hide combat view
    const selectionView = document.querySelector('.fighter-selection-view');
    const combatView = document.querySelector('.combat-view');
    
    if (selectionView) {
      selectionView.style.display = 'flex';
    }
    if (combatView) {
      combatView.style.display = 'none';
    }
    
    this.fighter1 = null;
    this.fighter2 = null;
  }
}

// Export singleton instance
export const hudManager = new HUDManager();
