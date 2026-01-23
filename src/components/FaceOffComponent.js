import { BaseComponent } from './BaseComponent.js';
import { getClassById } from '../data/classes.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import faceOffStyles from '../styles/components/FaceOffComponent.scss?inline';

/**
 * FaceOffComponent Web Component
 * Displays a dramatic "Versus" screen before combat begins
 * Features split-screen player vs opponent comparison
 *
 * Properties:
 * - player: Player fighter data
 * - opponent: Opponent fighter data
 *
 * Events:
 * - start-battle: User confirms to start the battle
 * - edit-loadout: User wants to edit equipment
 * - back: User wants to go back to opponent selection
 */
export class FaceOffComponent extends BaseComponent {
  constructor() {
    super();
    this._player = null;
    this._opponent = null;
    console.log('FaceOffComponent: Constructor called');
  }

  connectedCallback() {
    console.log('FaceOffComponent: Connected to DOM');
    // Render initial state
    this.render();
  }

  set player(data) {
    this._player = data;
    console.log('FaceOffComponent: Player set', data);
    this.render();
  }

  set opponent(data) {
    this._opponent = data;
    console.log('FaceOffComponent: Opponent set', data);
    this.render();
  }

  styles() {
    return faceOffStyles;
  }

  /**
   * Calculate difficulty rating based on stat comparison
   */
  calculateDifficulty() {
    if (!this._player || !this._opponent)
      return { level: 'UNKNOWN', label: 'Unknown', color: '#888' };

    const playerPower = this._player.health + this._player.strength * 10;
    const opponentPower = this._opponent.health + this._opponent.strength * 10;
    const delta = (opponentPower - playerPower) / playerPower;

    if (delta < -0.3) {
      return { level: 'EASY', label: 'Easy Victory', color: '#4caf50', icon: '😎' };
    } else if (delta < -0.1) {
      return { level: 'FAVORABLE', label: 'Favorable', color: '#8bc34a', icon: '💪' };
    } else if (delta < 0.1) {
      return { level: 'FAIR', label: 'Fair Fight', color: '#ffc107', icon: '⚔️' };
    } else if (delta < 0.3) {
      return { level: 'CHALLENGING', label: 'Challenging', color: '#ff9800', icon: '🔥' };
    } else if (delta < 0.5) {
      return { level: 'DANGEROUS', label: 'Dangerous', color: '#f44336', icon: '⚠️' };
    } else {
      return { level: 'LETHAL', label: 'Lethal', color: '#c62828', icon: '💀' };
    }
  }

  /**
   * Get class icon for display
   */
  getClassIcon(className) {
    const classData = getClassById(className);
    return classData?.icon || '⚔️';
  }

  /**
   * Get all equipped items for a fighter
   */
  getEquippedItems(fighter) {
    // For player, get from store
    if (fighter.isPlayer) {
      return EquipmentManager.getEquippedItems();
    }
    // For NPCs, return empty equipment
    return {
      weapon: null,
      head: null,
      torso: null,
      arms: null,
      trousers: null,
      shoes: null,
      coat: null,
      accessory: null,
    };
  }

  /**
   * Get weapon info from fighter
   */
  getWeaponInfo(fighter) {
    const equipped = this.getEquippedItems(fighter);
    if (equipped.weapon) {
      return {
        name: equipped.weapon.name,
        range: equipped.weapon.range || 1,
      };
    }
    return {
      name: 'Unarmed',
      range: 1,
    };
  }

  /**
   * Calculate stat percentage for bar display
   */
  getStatPercentage(playerStat, opponentStat) {
    const total = playerStat + opponentStat;
    if (total === 0) return { player: 50, opponent: 50 };
    return {
      player: Math.round((playerStat / total) * 100),
      opponent: Math.round((opponentStat / total) * 100),
    };
  }

  template() {
    if (!this._player || !this._opponent) {
      return '<div class="face-off-loading">Loading...</div>';
    }

    const difficulty = this.calculateDifficulty();
    const playerClass = getClassById(this._player.class);
    const opponentClass = getClassById(this._opponent.class);
    const playerEquipment = this.getEquippedItems(this._player);
    const opponentEquipment = this.getEquippedItems(this._opponent);
    const playerWeapon = this.getWeaponInfo(this._player);
    const opponentWeapon = this.getWeaponInfo(this._opponent);

    // Get fighter images - use image property or fallback
    const playerImage =
      this._player.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=player';
    const opponentImage =
      this._opponent.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=opponent';

    // Get speed values
    const playerSpeed = this._player.speed || this._player.agility || 50;
    const opponentSpeed = this._opponent.speed || this._opponent.agility || 50;

    // Calculate stat percentages for comparison bars
    const hpPercent = this.getStatPercentage(this._player.health, this._opponent.health);
    const strPercent = this.getStatPercentage(this._player.strength, this._opponent.strength);
    const spdPercent = this.getStatPercentage(playerSpeed, opponentSpeed);
    const rngPercent = this.getStatPercentage(
      this._player.getAttackRange ? this._player.getAttackRange() : playerWeapon.range,
      this._opponent.getAttackRange ? this._opponent.getAttackRange() : opponentWeapon.range
    );

    return `
      <div class="face-off-container">
        <!-- Blurred Background -->
        <div class="face-off-background"></div>
        
        <!-- Back Button -->
        <button class="back-button" id="back-btn">
          <span class="back-icon">←</span>
          <span class="back-text">Back</span>
        </button>

        <!-- Main Content -->
        <div class="face-off-content">
          
          <!-- Player Section (Left) -->
          <div class="fighter-section player-section">
            <div class="fighter-glow player-glow"></div>
            <div class="fighter-display">
              <img src="${playerImage}" alt="${this._player.name}" class="fighter-image" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${this._player.name}'" />
            </div>
            <div class="fighter-info glass-panel">
              <div class="fighter-header">
                <h2 class="fighter-name">${this._player.name}</h2>
                <div class="fighter-class">
                  <span class="class-icon">${playerClass?.icon || '⚔️'}</span>
                  <span class="class-name">${playerClass?.name || this._player.class}</span>
                </div>
              </div>
              <div class="fighter-details">
                <div class="detail-item">
                  <span class="detail-icon">⚔️</span>
                  <span class="detail-text">${playerEquipment.weapon ? playerEquipment.weapon.name : 'Unarmed'}</span>
                </div>
                ${
                  playerEquipment.head
                    ? `
                <div class="detail-item">
                  <span class="detail-icon">🪖</span>
                  <span class="detail-text">${playerEquipment.head.name}</span>
                </div>`
                    : ''
                }
                ${
                  playerEquipment.torso
                    ? `
                <div class="detail-item">
                  <span class="detail-icon">🛡️</span>
                  <span class="detail-text">${playerEquipment.torso.name}</span>
                </div>`
                    : ''
                }
                ${
                  playerEquipment.coat
                    ? `
                <div class="detail-item">
                  <span class="detail-icon">🧥</span>
                  <span class="detail-text">${playerEquipment.coat.name}</span>
                </div>`
                    : ''
                }
              </div>
            </div>
          </div>

          <!-- VS Divider & Stats Comparison -->
          <div class="center-section">
            <!-- Difficulty Rating -->
            <div class="difficulty-badge glass-panel" style="border-color: ${difficulty.color}">
              <div class="difficulty-icon">${difficulty.icon}</div>
              <div class="difficulty-label">${difficulty.label}</div>
            </div>

            <!-- VS Logo -->
            <div class="vs-logo">
              <span class="vs-text">VS</span>
            </div>

            <!-- Stat Comparison Bars -->
            <div class="stats-comparison glass-panel">
              <h3 class="stats-title">⚔️ Combat Stats</h3>
              
              <!-- HP Bar -->
              <div class="stat-comparison">
                <div class="stat-label-row">
                  <span class="stat-value">${this._player.health}</span>
                  <span class="stat-name">❤️ Health</span>
                  <span class="stat-value">${this._opponent.health}</span>
                </div>
                <div class="stat-bars">
                  <div class="stat-bar player-bar">
                    <div class="stat-bar-fill hp-bar" style="width: ${hpPercent.player}%"></div>
                  </div>
                  <div class="stat-bar opponent-bar">
                    <div class="stat-bar-fill hp-bar" style="width: ${hpPercent.opponent}%"></div>
                  </div>
                </div>
              </div>

              <!-- Attack Bar -->
              <div class="stat-comparison">
                <div class="stat-label-row">
                  <span class="stat-value">${this._player.strength}</span>
                  <span class="stat-name">⚔️ Attack</span>
                  <span class="stat-value">${this._opponent.strength}</span>
                </div>
                <div class="stat-bars">
                  <div class="stat-bar player-bar">
                    <div class="stat-bar-fill attack-bar" style="width: ${strPercent.player}%"></div>
                  </div>
                  <div class="stat-bar opponent-bar">
                    <div class="stat-bar-fill attack-bar" style="width: ${strPercent.opponent}%"></div>
                  </div>
                </div>
              </div>

              <!-- Speed Bar -->
              <div class="stat-comparison">
                <div class="stat-label-row">
                  <span class="stat-value">${playerSpeed}</span>
                  <span class="stat-name">⚡ Speed</span>
                  <span class="stat-value">${opponentSpeed}</span>
                </div>
                <div class="stat-bars">
                  <div class="stat-bar player-bar">
                    <div class="stat-bar-fill speed-bar" style="width: ${spdPercent.player}%"></div>
                  </div>
                  <div class="stat-bar opponent-bar">
                    <div class="stat-bar-fill speed-bar" style="width: ${spdPercent.opponent}%"></div>
                  </div>
                </div>
              </div>

              <!-- Range Bar -->
              <div class="stat-comparison">
                <div class="stat-label-row">
                  <span class="stat-value">${this._player.getAttackRange ? this._player.getAttackRange() : playerWeapon.range}</span>
                  <span class="stat-name">📏 Range</span>
                  <span class="stat-value">${this._opponent.getAttackRange ? this._opponent.getAttackRange() : opponentWeapon.range}</span>
                </div>
                <div class="stat-bars">
                  <div class="stat-bar player-bar">
                    <div class="stat-bar-fill range-bar" style="width: ${rngPercent.player}%"></div>
                  </div>
                  <div class="stat-bar opponent-bar">
                    <div class="stat-bar-fill range-bar" style="width: ${rngPercent.opponent}%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="primary-button pulse-animation" id="enter-arena-btn">
                <span class="button-icon">⚔️</span>
                <span class="button-text">ENTER ARENA</span>
              </button>
            </div>
          </div>

          <!-- Opponent Section (Right) -->
          <div class="fighter-section opponent-section">
            <div class="fighter-glow opponent-glow"></div>
            <div class="fighter-display">
              <img src="${opponentImage}" alt="${this._opponent.name}" class="fighter-image" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${this._opponent.name}'" />
            </div>
            <div class="fighter-info glass-panel">
              <div class="fighter-header">
                <h2 class="fighter-name">${this._opponent.name}</h2>
                <div class="fighter-class">
                  <span class="class-icon">${opponentClass?.icon || '⚔️'}</span>
                  <span class="class-name">${opponentClass?.name || this._opponent.class}</span>
                </div>
              </div>
              <div class="fighter-details">
                <div class="detail-item">
                  <span class="detail-icon">⚔️</span>
                  <span class="detail-text">${opponentEquipment.weapon ? opponentEquipment.weapon.name : 'Unarmed'}</span>
                </div>
                ${
                  opponentEquipment.head
                    ? `
                <div class="detail-item">
                  <span class="detail-icon">🪖</span>
                  <span class="detail-text">${opponentEquipment.head.name}</span>
                </div>`
                    : ''
                }
                ${
                  opponentEquipment.torso
                    ? `
                <div class="detail-item">
                  <span class="detail-icon">🛡️</span>
                  <span class="detail-text">${opponentEquipment.torso.name}</span>
                </div>`
                    : ''
                }
                ${
                  opponentEquipment.coat
                    ? `
                <div class="detail-item">
                  <span class="detail-icon">🧥</span>
                  <span class="detail-text">${opponentEquipment.coat.name}</span>
                </div>`
                    : ''
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const backBtn = this.shadowRoot.getElementById('back-btn');
    const enterArenaBtn = this.shadowRoot.getElementById('enter-arena-btn');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back');
      });
    }

    if (enterArenaBtn) {
      enterArenaBtn.addEventListener('click', () => {
        this.emit('start-battle', {
          player: this._player,
          opponent: this._opponent,
        });
      });
    }
  }
}

// Register the component
customElements.define('face-off-component', FaceOffComponent);
