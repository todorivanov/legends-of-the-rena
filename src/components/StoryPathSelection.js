/**
 * StoryPathSelection Component - v5.0.0
 * Choose your narrative path and starting conditions
 */

import { BaseComponent } from './BaseComponent.js';
import { getAllPaths, getPathStartingBonus } from '../data/storyPaths.js';
import { gameStore } from '../store/gameStore.js';
import { router } from '../utils/Router.js';

export class StoryPathSelection extends BaseComponent {
  constructor() {
    super();
    this.setState({
      paths: getAllPaths(),
      selectedPath: null,
      playerClass: null,
      hoveredPath: null,
      confirmationMode: false,
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // Get player's combat class from store
    const state = gameStore.getState();
    this.setState({
      playerClass: state.player.class,
    });

    // Subscribe to store changes
    this.unsubscribe = gameStore.subscribe((newState) => {
      this.setState({
        playerClass: newState.player.class,
      });
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  styles() {
    return `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        overflow-y: auto;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: var(--text-color, #f1f1f1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
      }

      .header {
        text-align: center;
        margin-bottom: 60px;
      }

      .header h1 {
        font-size: 3.5rem;
        margin: 0 0 20px 0;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        animation: titleGlow 3s ease-in-out infinite;
      }

      @keyframes titleGlow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2); }
      }

      .header p {
        font-size: 1.3rem;
        color: #b0b0b0;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
      }

      .class-badge {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 1rem;
        font-weight: 600;
        margin-top: 20px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      .paths-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin-bottom: 40px;
      }

      .path-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 2px solid transparent;
        border-radius: 16px;
        padding: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .path-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .path-card:hover::before {
        opacity: 1;
      }

      .path-card:hover {
        border-color: rgba(255, 215, 0, 0.5);
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
      }

      .path-card.selected {
        border-color: #ffd700;
        background: rgba(255, 215, 0, 0.1);
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
      }

      .path-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
      }

      .path-icon {
        font-size: 3rem;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
      }

      .path-title {
        flex: 1;
      }

      .path-title h2 {
        margin: 0 0 5px 0;
        font-size: 1.8rem;
        color: #ffd700;
      }

      .path-title .tagline {
        margin: 0;
        color: #a0a0a0;
        font-size: 0.95rem;
        font-style: italic;
      }

      .difficulty-rating {
        display: flex;
        gap: 3px;
      }

      .difficulty-star {
        color: #ffd700;
        font-size: 1rem;
      }

      .difficulty-star.empty {
        color: #555;
      }

      .path-lore {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #d0d0d0;
        margin: 20px 0;
        max-height: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
      }

      .path-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin: 20px 0;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
      }

      .stat-icon {
        font-size: 1.2rem;
      }

      .stat-label {
        color: #a0a0a0;
        margin-right: 5px;
      }

      .stat-value {
        color: #ffd700;
        font-weight: 600;
      }

      .starting-bonus {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-top: 20px;
      }

      .starting-bonus h4 {
        margin: 0 0 10px 0;
        color: #ffd700;
        font-size: 1rem;
      }

      .bonus-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .bonus-item {
        background: rgba(255, 215, 0, 0.15);
        border: 1px solid rgba(255, 215, 0, 0.3);
        padding: 5px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        color: #ffd700;
      }

      .path-mechanics {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .path-mechanics h4 {
        margin: 0 0 10px 0;
        color: #ffd700;
        font-size: 0.95rem;
      }

      .mechanic-tag {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 10px;
        border-radius: 10px;
        font-size: 0.8rem;
        margin-right: 8px;
        margin-bottom: 8px;
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 40px;
      }

      .btn {
        padding: 15px 40px;
        font-size: 1.2rem;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-primary {
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        color: #1a1a2e;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
      }

      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }

      .confirmation-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
      }

      .modal-content {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #ffd700;
        border-radius: 16px;
        padding: 40px;
        max-width: 600px;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
      }

      .modal-content h2 {
        margin: 0 0 20px 0;
        color: #ffd700;
        font-size: 2rem;
        text-align: center;
      }

      .modal-content p {
        color: #d0d0d0;
        line-height: 1.6;
        margin-bottom: 30px;
        text-align: center;
      }

      .modal-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
      }

      .warning-note {
        background: rgba(255, 193, 7, 0.1);
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin-top: 20px;
        border-radius: 4px;
      }

      .warning-note p {
        margin: 0;
        color: #ffc107;
        font-size: 0.9rem;
      }

      @media (max-width: 768px) {
        .header h1 {
          font-size: 2.5rem;
        }

        .paths-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `;
  }

  template() {
    const { paths, selectedPath, playerClass, confirmationMode } = this.state;

    return `
      <div class="container">
        <div class="header">
          <h1>⚔️ Choose Your Destiny ⚔️</h1>
          <p>
            Every legend begins with a choice. Select the path that calls to your spirit, 
            and embark on a journey that will define your legacy in the arena.
          </p>
          ${playerClass ? `<div class="class-badge">Playing as: ${this.formatClassName(playerClass)}</div>` : ''}
        </div>

        <div class="paths-grid">
          ${paths.map((path) => this.renderPathCard(path)).join('')}
        </div>

        <div class="action-buttons">
          <button class="btn btn-secondary" id="backBtn">
            ← Back to Character Creation
          </button>
          <button 
            class="btn btn-primary" 
            id="confirmBtn"
            ${!selectedPath ? 'disabled' : ''}
          >
            Begin Journey →
          </button>
        </div>

        ${confirmationMode ? this.renderConfirmationModal() : ''}
      </div>
    `;
  }

  renderPathCard(path) {
    const { selectedPath, playerClass } = this.state;
    const isSelected = selectedPath === path.id;
    const startingBonus = playerClass ? getPathStartingBonus(path.id, playerClass) : null;

    // Generate difficulty stars
    const stars = Array.from({ length: 5 }, (_, i) =>
      i < path.difficultyRating
        ? '<span class="difficulty-star">★</span>'
        : '<span class="difficulty-star empty">★</span>'
    ).join('');

    // Format mechanics as tags
    const mechanics = Object.keys(path.pathMechanics).map((key) => {
      const mechanic = path.pathMechanics[key];
      return mechanic.description || key.replace(/([A-Z])/g, ' $1').trim();
    });

    return `
      <div 
        class="path-card ${isSelected ? 'selected' : ''}"
        data-path-id="${path.id}"
      >
        <div class="path-header">
          <div class="path-icon">${path.icon}</div>
          <div class="path-title">
            <h2>${path.name}</h2>
            <p class="tagline">${path.description}</p>
          </div>
        </div>

        <div class="difficulty-rating" title="Difficulty: ${path.difficultyRating}/5">
          ${stars}
        </div>

        <div class="path-lore">${this.formatLore(path.lore)}</div>

        <div class="path-stats">
          <div class="stat-item">
            <span class="stat-icon">🎯</span>
            <span class="stat-label">Missions:</span>
            <span class="stat-value">${path.missionCount}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span class="stat-label">Playtime:</span>
            <span class="stat-value">${path.estimatedPlaytime}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">💰</span>
            <span class="stat-label">Starting Gold:</span>
            <span class="stat-value">${path.startingBonus.gold}g</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">👑</span>
            <span class="stat-label">Final Boss:</span>
            <span class="stat-value">${this.formatBossName(path.finalBoss)}</span>
          </div>
        </div>

        ${
          startingBonus
            ? `
          <div class="starting-bonus">
            <h4>🎁 Your Starting Bonus (${this.formatClassName(playerClass)})</h4>
            <div class="bonus-list">
              <div class="bonus-item">💰 ${startingBonus.gold} Gold</div>
              ${startingBonus.equipment.map((eq) => `<div class="bonus-item">⚔️ ${this.formatEquipmentName(eq)}</div>`).join('')}
              ${Object.entries(startingBonus.stats)
                .filter(([_, val]) => val !== 0)
                .map(
                  ([stat, val]) =>
                    `<div class="bonus-item">${this.getStatIcon(stat)} +${val} ${this.formatStatName(stat)}</div>`
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <div class="path-mechanics">
          <h4>✨ Exclusive Mechanics</h4>
          ${mechanics
            .slice(0, 3)
            .map((m) => `<span class="mechanic-tag">${m}</span>`)
            .join('')}
        </div>
      </div>
    `;
  }

  renderConfirmationModal() {
    const { selectedPath } = this.state;
    const path = getAllPaths().find((p) => p.id === selectedPath);

    if (!path) return '';

    return `
      <div class="confirmation-modal">
        <div class="modal-content">
          <h2>⚔️ Confirm Your Path ⚔️</h2>
          <p>
            You have chosen the path of the <strong>${path.name}</strong>. 
            This decision will shape your entire journey through the arena. 
            Are you ready to begin?
          </p>
          <div class="warning-note">
            <p>⚠️ <strong>Note:</strong> Once you begin, you cannot change your story path. Choose wisely!</p>
          </div>
          <div class="modal-buttons">
            <button class="btn btn-secondary" id="cancelBtn">
              Cancel
            </button>
            <button class="btn btn-primary" id="startJourneyBtn">
              Start My Journey!
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Path card selection
    const pathCards = this.shadowRoot.querySelectorAll('.path-card');
    pathCards.forEach((card) => {
      card.addEventListener('click', () => {
        const pathId = card.dataset.pathId;
        this.selectPath(pathId);
      });
    });

    // Back button
    const backBtn = this.shadowRoot.querySelector('#backBtn');
    backBtn?.addEventListener('click', () => {
      router.navigate('/character-creation');
    });

    // Confirm button
    const confirmBtn = this.shadowRoot.querySelector('#confirmBtn');
    confirmBtn?.addEventListener('click', () => {
      if (this.state.selectedPath) {
        this.setState({ confirmationMode: true });
      }
    });

    // Modal buttons
    const cancelBtn = this.shadowRoot.querySelector('#cancelBtn');
    cancelBtn?.addEventListener('click', () => {
      this.setState({ confirmationMode: false });
    });

    const startJourneyBtn = this.shadowRoot.querySelector('#startJourneyBtn');
    startJourneyBtn?.addEventListener('click', () => {
      this.startJourney();
    });
  }

  selectPath(pathId) {
    this.setState({ selectedPath: pathId });
    this.emit('path-selected', { pathId });
  }

  async startJourney() {
    const { selectedPath, playerClass } = this.state;

    if (!selectedPath || !playerClass) {
      console.error('Missing required data for journey start');
      return;
    }

    // Get starting bonus
    const startingBonus = getPathStartingBonus(selectedPath, playerClass);

    // Dispatch action to update game state with path selection
    // This will be handled in the next step (state management extension)
    this.emit('journey-started', {
      pathId: selectedPath,
      startingBonus,
    });

    // Navigate to campaign map (will be path-specific)
    router.navigate('/story');
  }

  // Utility formatting methods
  formatClassName(className) {
    return className.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  formatBossName(bossId) {
    return bossId
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  formatEquipmentName(equipId) {
    return equipId
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  formatStatName(stat) {
    const statNames = {
      health: 'HP',
      strength: 'STR',
      defense: 'DEF',
      manaRegen: 'Mana/Turn',
      critChance: 'Crit%',
      critDamage: 'Crit Dmg%',
      gold: 'Gold',
    };
    return statNames[stat] || stat;
  }

  getStatIcon(stat) {
    const icons = {
      health: '❤️',
      strength: '⚔️',
      defense: '🛡️',
      manaRegen: '💙',
      critChance: '🎯',
      critDamage: '💥',
      gold: '💰',
    };
    return icons[stat] || '📊';
  }

  formatLore(lore) {
    // Take first paragraph only for card view
    return lore.split('\n\n')[0].trim();
  }
}

// Register component
customElements.define('story-path-selection', StoryPathSelection);
