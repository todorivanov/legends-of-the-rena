import { BaseComponent } from './BaseComponent.js';

/**
 * TournamentBracket Web Component
 * Displays tournament bracket and opponent selection
 * 
 * Events:
 * - tournament-start: Tournament ready to begin
 * - back-to-menu: User wants to return to main menu
 */
export class TournamentBracket extends BaseComponent {
  constructor() {
    super();
    this._fighters = [];
    this._selectedOpponents = [];
    this._difficulty = 'normal';
  }

  set fighters(value) {
    this._fighters = value;
    this.render();
  }

  get fighters() {
    return this._fighters;
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

      .tournament-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
      }

      .tournament-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .tournament-title {
        font-family: 'Orbitron', monospace;
        font-size: 56px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      }

      .tournament-subtitle {
        font-size: 18px;
        color: #b39ddb;
        margin-top: 10px;
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

      .difficulty-section {
        margin-bottom: 40px;
        animation: fadeInUp 0.8s ease;
      }

      .section-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffa726;
        margin-bottom: 20px;
        text-align: center;
      }

      .difficulty-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .difficulty-btn {
        padding: 15px 30px;
        font-size: 18px;
        font-weight: 700;
        border: 3px solid;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        min-width: 180px;
      }

      .difficulty-btn.normal {
        border-color: #4caf50;
        color: #4caf50;
      }

      .difficulty-btn.hard {
        border-color: #ff9800;
        color: #ff9800;
      }

      .difficulty-btn.nightmare {
        border-color: #f44336;
        color: #f44336;
      }

      .difficulty-btn.active {
        transform: scale(1.05);
        box-shadow: 0 0 30px currentColor;
      }

      .difficulty-btn.normal.active {
        background: rgba(76, 175, 80, 0.3);
      }

      .difficulty-btn.hard.active {
        background: rgba(255, 152, 0, 0.3);
      }

      .difficulty-btn.nightmare.active {
        background: rgba(244, 67, 54, 0.3);
      }

      .difficulty-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
      }

      .difficulty-info {
        margin-top: 15px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        text-align: center;
      }

      .difficulty-desc {
        color: #b39ddb;
        font-size: 14px;
        line-height: 1.6;
      }

      .opponent-selection {
        margin-bottom: 40px;
        animation: fadeInUp 1s ease;
      }

      .selected-count {
        text-align: center;
        font-size: 20px;
        color: #ffa726;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .opponent-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .opponent-card {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .opponent-card:hover {
        transform: translateY(-5px);
        border-color: #ffa726;
        box-shadow: 0 8px 32px rgba(255, 167, 38, 0.3);
      }

      .opponent-card.selected {
        border-color: #00e676;
        background: rgba(0, 230, 118, 0.1);
        box-shadow: 0 0 20px rgba(0, 230, 118, 0.4);
      }

      .opponent-card.selected::after {
        content: '✓';
        position: absolute;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: #00e676;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        font-weight: bold;
        box-shadow: 0 0 15px rgba(0, 230, 118, 0.6);
      }

      .opponent-avatar {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 15px;
      }

      .opponent-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
        text-align: center;
      }

      .opponent-class {
        text-align: center;
        font-size: 14px;
        color: #b39ddb;
        margin-bottom: 10px;
      }

      .opponent-stats {
        display: flex;
        justify-content: space-around;
        gap: 10px;
        margin-top: 10px;
      }

      .stat-item {
        text-align: center;
      }

      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #ffa726;
      }

      .stat-label {
        font-size: 11px;
        color: #7e57c2;
        text-transform: uppercase;
      }

      .start-tournament-btn {
        display: block;
        margin: 30px auto 0;
        padding: 20px 50px;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
        border: 3px solid gold;
        border-radius: 15px;
        color: #000;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
        animation: pulse 2s infinite;
      }

      .start-tournament-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 48px rgba(255, 215, 0, 0.6);
      }

      .start-tournament-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        animation: none;
      }

      .bracket-preview {
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 167, 38, 0.3);
        border-radius: 15px;
        padding: 30px;
        margin-top: 40px;
        animation: fadeIn 1.2s ease;
      }

      .bracket-title {
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        color: #ffa726;
        margin-bottom: 30px;
      }

      .bracket-rounds {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
      }

      .bracket-round {
        flex: 1;
        text-align: center;
      }

      .round-name {
        font-size: 16px;
        font-weight: 700;
        color: #b39ddb;
        margin-bottom: 15px;
        text-transform: uppercase;
      }

      .round-match {
        background: rgba(26, 13, 46, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
      }

      .match-fighter {
        color: white;
        font-size: 14px;
        font-weight: 600;
        margin: 5px 0;
      }

      .bracket-arrow {
        font-size: 32px;
        color: #ffa726;
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

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
  }

  template() {
    const difficultyInfo = {
      normal: {
        icon: '⚔️',
        name: 'Normal',
        desc: 'Standard difficulty. Balanced challenge for most players.',
        rewards: 'Guaranteed Rare equipment',
      },
      hard: {
        icon: '💀',
        name: 'Hard',
        desc: 'Opponents have +30% HP and +20% Strength. Recommended for experienced players.',
        rewards: 'Guaranteed Epic equipment + Bonus XP',
      },
      nightmare: {
        icon: '👹',
        name: 'Nightmare',
        desc: 'Opponents have +50% HP and +50% Strength. Only for true champions!',
        rewards: 'Guaranteed Legendary equipment + Massive XP',
      },
    };

    const currentDifficulty = difficultyInfo[this._difficulty];

    return `
      <div class="tournament-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="tournament-header">
          <h1 class="tournament-title">🏆 Tournament 🏆</h1>
          <p class="tournament-subtitle">Face 4 opponents in a bracket-style championship!</p>
        </div>

        <!-- Difficulty Selection -->
        <div class="difficulty-section">
          <div class="section-title">Choose Difficulty</div>
          <div class="difficulty-buttons">
            <button class="difficulty-btn normal ${this._difficulty === 'normal' ? 'active' : ''}" data-difficulty="normal">
              ⚔️ Normal
            </button>
            <button class="difficulty-btn hard ${this._difficulty === 'hard' ? 'active' : ''}" data-difficulty="hard">
              💀 Hard
            </button>
            <button class="difficulty-btn nightmare ${this._difficulty === 'nightmare' ? 'active' : ''}" data-difficulty="nightmare">
              👹 Nightmare
            </button>
          </div>
          <div class="difficulty-info">
            <div class="difficulty-desc">
              <strong>${currentDifficulty.icon} ${currentDifficulty.name}:</strong> ${currentDifficulty.desc}<br>
              <span style="color: #ffa726;">🎁 Rewards: ${currentDifficulty.rewards}</span>
            </div>
          </div>
        </div>

        <!-- Opponent Selection -->
        <div class="opponent-selection">
          <div class="section-title">Select 4 Opponents</div>
          <div class="selected-count">
            Selected: ${this._selectedOpponents.length}/4
          </div>
          <div class="opponent-grid">
            ${this._fighters.map(fighter => this.renderOpponentCard(fighter)).join('')}
          </div>
        </div>

        <!-- Start Button -->
        <button 
          class="start-tournament-btn" 
          ${this._selectedOpponents.length !== 4 ? 'disabled' : ''}
        >
          🏆 Start Tournament 🏆
        </button>

        <!-- Bracket Preview (if 4 selected) -->
        ${this._selectedOpponents.length === 4 ? this.renderBracketPreview() : ''}
      </div>
    `;
  }

  renderOpponentCard(fighter) {
    const isSelected = this._selectedOpponents.some(f => f.id === fighter.id);

    return `
      <div class="opponent-card ${isSelected ? 'selected' : ''}" data-fighter-id="${fighter.id}">
        <img src="${fighter.image}" alt="${fighter.name}" class="opponent-avatar" />
        <div class="opponent-name">${fighter.name}</div>
        <div class="opponent-class">${fighter.class}</div>
        <div class="opponent-stats">
          <div class="stat-item">
            <div class="stat-value">${fighter.health}</div>
            <div class="stat-label">HP</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${fighter.strength}</div>
            <div class="stat-label">STR</div>
          </div>
        </div>
      </div>
    `;
  }

  renderBracketPreview() {
    const [op1, op2, op3, op4] = this._selectedOpponents;

    return `
      <div class="bracket-preview">
        <div class="bracket-title">Tournament Bracket</div>
        <div class="bracket-rounds">
          <!-- Quarter Finals -->
          <div class="bracket-round">
            <div class="round-name">Quarter Finals</div>
            <div class="round-match">
              <div class="match-fighter">YOU</div>
              <div style="color: #7e57c2;">vs</div>
              <div class="match-fighter">${op1.name}</div>
            </div>
          </div>

          <div class="bracket-arrow">→</div>

          <!-- Semi Final -->
          <div class="bracket-round">
            <div class="round-name">Semi Final</div>
            <div class="round-match">
              <div class="match-fighter">Winner</div>
              <div style="color: #7e57c2;">vs</div>
              <div class="match-fighter">${op2.name}</div>
            </div>
          </div>

          <div class="bracket-arrow">→</div>

          <!-- Final -->
          <div class="bracket-round">
            <div class="round-name">Grand Final</div>
            <div class="round-match">
              <div class="match-fighter">Champion</div>
              <div style="color: #7e57c2;">vs</div>
              <div class="match-fighter">${op3.name}</div>
            </div>
          </div>

          <div class="bracket-arrow">→</div>

          <!-- Trophy -->
          <div class="bracket-round">
            <div class="round-name">Victory</div>
            <div style="font-size: 64px; margin-top: 10px;">🏆</div>
          </div>
        </div>
        <div style="text-align: center; color: #b39ddb; font-size: 14px; margin-top: 20px;">
          Note: You'll face ${op4.name} as a bonus if you reach the championship!
        </div>
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

    // Difficulty buttons
    const difficultyBtns = this.shadowRoot.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this._difficulty = btn.dataset.difficulty;
        this.updateDifficultyUI();
      });
    });

    // Opponent cards
    const opponentCards = this.shadowRoot.querySelectorAll('.opponent-card');
    opponentCards.forEach(card => {
      card.addEventListener('click', () => {
        const fighterId = parseInt(card.dataset.fighterId);
        this.toggleOpponent(fighterId);
      });
    });

    // Start button
    const startBtn = this.shadowRoot.querySelector('.start-tournament-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this._selectedOpponents.length === 4) {
          this.emit('tournament-start', {
            opponents: this._selectedOpponents,
            difficulty: this._difficulty,
          });
        }
      });
    }
  }

  toggleOpponent(fighterId) {
    const fighter = this._fighters.find(f => f.id === fighterId);
    if (!fighter) return;

    const index = this._selectedOpponents.findIndex(f => f.id === fighterId);
    
    if (index !== -1) {
      // Deselect
      this._selectedOpponents.splice(index, 1);
    } else {
      // Select (if not at limit)
      if (this._selectedOpponents.length < 4) {
        this._selectedOpponents.push(fighter);
      } else {
        return; // Can't select more
      }
    }

    // Update UI without full re-render
    this.updateSelectionUI(fighterId);
  }

  updateDifficultyUI() {
    // Update active state on difficulty buttons
    const difficultyBtns = this.shadowRoot.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      if (btn.dataset.difficulty === this._difficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update difficulty info text
    const difficultyInfo = {
      normal: {
        icon: '⚔️',
        name: 'Normal',
        desc: 'Standard difficulty. Balanced challenge for most players.',
        rewards: 'Guaranteed Rare equipment',
      },
      hard: {
        icon: '💀',
        name: 'Hard',
        desc: 'Opponents have +30% HP and +20% Strength. Recommended for experienced players.',
        rewards: 'Guaranteed Epic equipment + Bonus XP',
      },
      nightmare: {
        icon: '👹',
        name: 'Nightmare',
        desc: 'Opponents have +50% HP and +50% Strength. Only for true champions!',
        rewards: 'Guaranteed Legendary equipment + Massive XP',
      },
    };

    const currentDifficulty = difficultyInfo[this._difficulty];
    const difficultyDesc = this.shadowRoot.querySelector('.difficulty-desc');
    if (difficultyDesc) {
      difficultyDesc.innerHTML = `
        <strong>${currentDifficulty.icon} ${currentDifficulty.name}:</strong> ${currentDifficulty.desc}<br>
        <span style="color: #ffa726;">🎁 Rewards: ${currentDifficulty.rewards}</span>
      `;
    }
  }

  updateSelectionUI(toggledFighterId) {
    // Update the card's selected state
    const card = this.shadowRoot.querySelector(`.opponent-card[data-fighter-id="${toggledFighterId}"]`);
    if (card) {
      const isSelected = this._selectedOpponents.some(f => f.id === toggledFighterId);
      if (isSelected) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    }

    // Update selected count
    const countDisplay = this.shadowRoot.querySelector('.selected-count');
    if (countDisplay) {
      countDisplay.textContent = `Selected: ${this._selectedOpponents.length}/4`;
    }

    // Update start button disabled state
    const startBtn = this.shadowRoot.querySelector('.start-tournament-btn');
    if (startBtn) {
      if (this._selectedOpponents.length === 4) {
        startBtn.disabled = false;
      } else {
        startBtn.disabled = true;
      }
    }

    // Update bracket preview
    const bracketPreview = this.shadowRoot.querySelector('.bracket-preview');
    if (this._selectedOpponents.length === 4) {
      // Show bracket preview if we have 4 selected
      if (!bracketPreview) {
        const container = this.shadowRoot.querySelector('.tournament-container');
        if (container) {
          const previewHTML = this.renderBracketPreview();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = previewHTML;
          container.appendChild(tempDiv.firstElementChild);
        }
      } else {
        // Update existing bracket preview
        bracketPreview.innerHTML = this.getBracketPreviewContent();
      }
    } else {
      // Remove bracket preview if less than 4 selected
      if (bracketPreview) {
        bracketPreview.remove();
      }
    }
  }

  getBracketPreviewContent() {
    const [op1, op2, op3, op4] = this._selectedOpponents;
    
    return `
      <div class="bracket-title">Tournament Bracket</div>
      <div class="bracket-rounds">
        <!-- Quarter Finals -->
        <div class="bracket-round">
          <div class="round-name">Quarter Finals</div>
          <div class="round-match">
            <div class="match-fighter">YOU</div>
            <div style="color: #7e57c2;">vs</div>
            <div class="match-fighter">${op1.name}</div>
          </div>
        </div>

        <div class="bracket-arrow">→</div>

        <!-- Semi Final -->
        <div class="bracket-round">
          <div class="round-name">Semi Final</div>
          <div class="round-match">
            <div class="match-fighter">Winner</div>
            <div style="color: #7e57c2;">vs</div>
            <div class="match-fighter">${op2.name}</div>
          </div>
        </div>

        <div class="bracket-arrow">→</div>

        <!-- Final -->
        <div class="bracket-round">
          <div class="round-name">Grand Final</div>
          <div class="round-match">
            <div class="match-fighter">Champion</div>
            <div style="color: #7e57c2;">vs</div>
            <div class="match-fighter">${op3.name}</div>
          </div>
        </div>

        <div class="bracket-arrow">→</div>

        <!-- Trophy -->
        <div class="bracket-round">
          <div class="round-name">Victory</div>
          <div style="font-size: 64px; margin-top: 10px;">🏆</div>
        </div>
      </div>
      <div style="text-align: center; color: #b39ddb; font-size: 14px; margin-top: 20px;">
        Note: You'll face ${op4.name} as a bonus if you reach the championship!
      </div>
    `;
  }
}

customElements.define('tournament-bracket', TournamentBracket);
