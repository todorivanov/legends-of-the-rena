import { BaseComponent } from './BaseComponent.js';

/**
 * EnemySelector Web Component
 * Displays a grid of enemies to select for targeting
 *
 * Properties:
 * - enemies: Array of Fighter objects
 *
 * Events:
 * - enemy-selected: { enemy: Fighter }
 */
export class EnemySelector extends BaseComponent {
  constructor() {
    super();
    this._enemies = [];
  }

  set enemies(enemyArray) {
    this._enemies = enemyArray || [];
    this.render();
  }

  get enemies() {
    return this._enemies;
  }

  styles() {
    return `
      .enemy-selector {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(30, 30, 50, 0.98), rgba(50, 30, 30, 0.98));
        border: 3px solid var(--danger-color);
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
        z-index: 1000;
        min-width: 400px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        backdrop-filter: blur(10px);
      }

      .selector-title {
        text-align: center;
        margin-bottom: 25px;
        color: var(--danger-color);
        font-size: 24px;
        font-weight: 900;
        text-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
      }

      .enemy-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }

      .enemy-card {
        background: linear-gradient(135deg, rgba(60, 40, 40, 0.8), rgba(40, 40, 60, 0.8));
        border: 2px solid rgba(220, 53, 69, 0.5);
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .enemy-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(220, 53, 69, 0.3), transparent);
        transition: left 0.5s ease;
      }

      .enemy-card:hover {
        border-color: var(--danger-color);
        box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
        transform: translateY(-5px) scale(1.05);
      }

      .enemy-card:hover::before {
        left: 100%;
      }

      .enemy-card.defeated {
        opacity: 0.4;
        cursor: not-allowed;
        filter: grayscale(100%);
      }

      .enemy-card.defeated:hover {
        transform: none;
        box-shadow: none;
      }

      .enemy-name {
        font-size: 18px;
        font-weight: bold;
        color: var(--danger-color);
        margin-bottom: 10px;
        text-align: center;
      }

      .enemy-class {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        margin-bottom: 15px;
      }

      .enemy-health {
        margin-top: 10px;
      }

      .health-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
      }

      .health-bar {
        width: 100%;
        height: 20px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .health-fill {
        height: 100%;
        background: linear-gradient(90deg, #dc3545, #ff6b6b);
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
      }

      .health-fill.low {
        background: linear-gradient(90deg, #ff4444, #ff0000);
        animation: pulse-danger 1s infinite;
      }

      @keyframes pulse-danger {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .cancel-btn {
        width: 100%;
        padding: 12px;
        background: rgba(108, 117, 125, 0.8);
        border: 2px solid rgba(108, 117, 125, 0.5);
        border-radius: 8px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .cancel-btn:hover {
        background: rgba(108, 117, 125, 1);
        border-color: #6c757d;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
      }

      .defeated-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: #dc3545;
        padding: 4px 8px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
      }

      @media (max-width: 768px) {
        .enemy-selector {
          min-width: 90vw;
          padding: 20px;
        }

        .enemy-grid {
          grid-template-columns: 1fr;
        }

        .selector-title {
          font-size: 20px;
        }
      }
    `;
  }

  template() {
    if (!this._enemies || this._enemies.length === 0) {
      return '<div class="enemy-selector"><p>No enemies available</p></div>';
    }

    const enemyCardsHTML = this._enemies
      .map((enemy, index) => {
        const isDefeated = enemy.health <= 0;
        const healthPercent = (enemy.health / enemy.maxHealth) * 100;
        const healthClass = healthPercent < 30 ? 'low' : '';

        return `
          <div 
            class="enemy-card ${isDefeated ? 'defeated' : ''}" 
            data-enemy-index="${index}"
            ${isDefeated ? 'data-defeated="true"' : ''}
          >
            ${isDefeated ? '<div class="defeated-badge">💀 DEFEATED</div>' : ''}
            <div class="enemy-name">${enemy.name}</div>
            <div class="enemy-class">${enemy.class || 'Fighter'}</div>
            <div class="enemy-health">
              <div class="health-label">
                <span>❤️ HP</span>
                <span>${Math.max(0, Math.floor(enemy.health))} / ${Math.floor(enemy.maxHealth)}</span>
              </div>
              <div class="health-bar">
                <div class="health-fill ${healthClass}" style="width: ${Math.max(0, healthPercent)}%"></div>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="enemy-selector">
        <div class="selector-title">🎯 SELECT TARGET</div>
        <div class="enemy-grid">
          ${enemyCardsHTML}
        </div>
        <button class="cancel-btn" id="cancelBtn">
          ← Cancel
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    // Handle enemy card clicks
    const enemyCards = this.shadowRoot.querySelectorAll('.enemy-card');
    enemyCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const isDefeated = e.currentTarget.dataset.defeated === 'true';
        if (isDefeated) {
          return; // Can't select defeated enemies
        }

        const enemyIndex = parseInt(e.currentTarget.dataset.enemyIndex);
        const selectedEnemy = this._enemies[enemyIndex];

        // Visual feedback
        e.currentTarget.style.borderColor = '#28a745';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.8)';

        setTimeout(() => {
          this.emit('enemy-selected', { enemy: selectedEnemy });
          this.remove();
        }, 200);
      });
    });

    // Handle cancel button
    const cancelBtn = this.shadowRoot.querySelector('#cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.emit('enemy-selected', { enemy: null }); // null = cancelled
        this.remove();
      });
    }
  }
}

// Register the component
customElements.define('enemy-selector', EnemySelector);
