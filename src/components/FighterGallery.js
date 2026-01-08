import { BaseComponent } from './BaseComponent.js';

/**
 * FighterGallery Web Component
 * Modern fighter selection gallery with filters
 * 
 * Properties:
 * - fighters: Array of fighter data
 * - mode: 'single' | 'team'
 * 
 * Events:
 * - fighter-selected: { fighter, selectedCount }
 * - selection-complete: { fighter1, fighter2 } or { team1: [], team2: [] }
 */
export class FighterGallery extends BaseComponent {
  constructor() {
    super();
    this._fighters = [];
    this._mode = 'single';
    this._selectedFighters = [];
    this._filter = 'ALL';
  }

  set fighters(data) {
    this._fighters = data;
    this.render();
  }

  set mode(value) {
    this._mode = value;
    this.render();
  }

  styles() {
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        animation: fadeIn 0.5s ease;
      }

      .gallery-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 30px;
        overflow: hidden;
      }

      .gallery-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .gallery-title {
        font-family: 'Orbitron', monospace;
        font-size: 42px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
      }

      .gallery-subtitle {
        color: #b39ddb;
        font-size: 18px;
        letter-spacing: 2px;
      }

      .filter-bar {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
        animation: fadeIn 0.8s ease;
      }

      .filter-btn {
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #b39ddb;
        background: rgba(42, 26, 71, 0.5);
        border: 2px solid rgba(106, 66, 194, 0.3);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
      }

      .filter-btn:hover {
        border-color: #ffa726;
        color: #ffa726;
        box-shadow: 0 0 15px rgba(255, 167, 38, 0.3);
      }

      .filter-btn.active {
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        border-color: #ffa726;
        color: white;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.5);
      }

      /* Selected fighters display */
      .selected-fighters-display {
        margin-bottom: 20px;
        padding: 20px;
        background: linear-gradient(145deg, rgba(0, 230, 118, 0.1) 0%, rgba(106, 66, 194, 0.1) 100%);
        border: 2px solid rgba(0, 230, 118, 0.3);
        border-radius: 12px;
        animation: fadeIn 0.5s ease;
      }

      .selected-header h4 {
        margin: 0 0 15px 0;
        color: #00e676;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .selected-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .selected-fighter-chip {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: rgba(26, 13, 46, 0.8);
        border: 2px solid rgba(0, 230, 118, 0.5);
        border-radius: 25px;
        backdrop-filter: blur(10px);
        animation: scaleIn 0.3s ease;
      }

      .selected-fighter-chip img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #00e676;
        object-fit: cover;
      }

      .selected-fighter-chip span {
        color: white;
        font-size: 14px;
        font-weight: 600;
      }

      .remove-btn {
        background: rgba(255, 23, 68, 0.3);
        border: none;
        color: #ff1744;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 1;
        transition: all 0.3s ease;
      }

      .remove-btn:hover {
        background: #ff1744;
        color: white;
        transform: scale(1.2);
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .fighters-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 25px;
        overflow-y: auto;
        padding: 10px;
        animation: fadeInUp 1s ease;
      }

      .selection-status {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(26, 13, 46, 0.95);
        border: 2px solid #6a42c2;
        border-radius: 12px;
        padding: 20px 30px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        z-index: 100;
        animation: fadeInUp 0.5s ease;
      }

      .status-text {
        color: #ffa726;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        text-align: center;
      }

      .start-btn {
        width: 100%;
        padding: 15px 30px;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        color: white;
        background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 230, 118, 0.4);
      }

      .start-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 230, 118, 0.6);
      }

      .start-btn:active {
        transform: translateY(-1px);
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
    const classes = ['ALL', 'TANK', 'BALANCED', 'AGILE', 'MAGE', 'HYBRID', 'ASSASSIN', 'BRAWLER'];
    
    // Determine mode text based on selection type
    let modeText, needsCount;
    if (this._mode === 'opponent') {
      modeText = '⚔️ Choose Your Opponent ⚔️';
      needsCount = 1;
    } else if (this._mode === 'single') {
      modeText = 'Choose 2 Fighters';
      needsCount = 2;
    } else {
      modeText = 'Build Your Teams';
      needsCount = 4;
    }
    
    const selectionCount = this._selectedFighters.length;

    return `
      <div class="gallery-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="gallery-header">
          <h2 class="gallery-title">${modeText}</h2>
          <p class="gallery-subtitle">${this._mode === 'opponent' ? 'Who will you face in battle?' : 'Select your warriors'}</p>
        </div>

        <div class="filter-bar">
          ${classes.map(cls => `
            <button 
              class="filter-btn ${this._filter === cls ? 'active' : ''}" 
              data-class="${cls}"
            >
              ${cls}
            </button>
          `).join('')}
        </div>

        <div class="fighters-grid" id="fighters-grid"></div>

        ${selectionCount >= needsCount ? `
          <div class="selection-status">
            <div class="status-text">✓ Selection Complete!</div>
            <button class="start-btn">Start Battle</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  attachEventListeners() {
    // Filter buttons
    const filterButtons = this.shadowRoot.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this._filter = btn.dataset.class;
        this.render();
        this.renderFighters();
      });
    });

    // Back button
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    // Start button
    const startBtn = this.shadowRoot.querySelector('.start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.emit('selection-complete', { fighters: this._selectedFighters });
      });
    }

    // Render fighters
    this.renderFighters();
  }

  renderFighters() {
    const grid = this.shadowRoot.querySelector('#fighters-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = this._filter === 'ALL' 
      ? this._fighters 
      : this._fighters.filter(f => f.class === this._filter);

    filtered.forEach((fighter, index) => {
      const card = document.createElement('fighter-card');
      card.fighter = fighter;
      card.setAttribute('fighter-id', fighter.id);
      card.setAttribute('selectable', 'true');
      card.style.animationDelay = `${index * 0.05}s`;
      
      // Check if already selected
      const isSelected = this._selectedFighters.find(f => f.id === fighter.id);
      if (isSelected) {
        card.classList.add('selected');
      }
      
      card.addEventListener('fighter-selected', (e) => {
        // Add selected class
        card.classList.add('selected');
        this.handleFighterSelection(e.detail.fighter);
      });

      grid.appendChild(card);
    });
  }

  handleFighterSelection(fighter) {
    // Check if already selected
    const alreadySelected = this._selectedFighters.find(f => f.id === fighter.id);
    if (alreadySelected) {
      return; // Already selected, ignore
    }

    // For opponent mode, only allow one selection
    if (this._mode === 'opponent' && this._selectedFighters.length >= 1) {
      // Remove previous selection
      const previousFighter = this._selectedFighters[0];
      this._selectedFighters = [];
      
      // Remove highlight from previous card
      const cards = this.shadowRoot.querySelectorAll('fighter-card');
      cards.forEach(card => {
        if (parseInt(card.getAttribute('fighter-id')) === previousFighter.id) {
          card.classList.remove('selected');
        }
      });
    }

    this._selectedFighters.push(fighter);
    this.emit('fighter-selected', { 
      fighter, 
      selectedCount: this._selectedFighters.length 
    });
    
    // Just update the status footer, don't re-render everything
    this.updateSelectionStatus();
  }

  /**
   * Update selection status without re-rendering everything
   */
  updateSelectionStatus() {
    // Determine needed count based on mode
    let needsCount;
    if (this._mode === 'opponent') {
      needsCount = 1;
    } else if (this._mode === 'single') {
      needsCount = 2;
    } else {
      needsCount = 4;
    }
    
    const selectionCount = this._selectedFighters.length;

    // Update or create selection status
    const statusEl = this.shadowRoot.querySelector('.selection-status');
    
    if (selectionCount >= needsCount) {
      if (!statusEl) {
        // Create status element
        const statusHTML = `
          <div class="selection-status">
            <div class="status-text">✓ Selection Complete!</div>
            <button class="start-btn">Start Battle</button>
          </div>
        `;
        this.shadowRoot.querySelector('.gallery-container').insertAdjacentHTML('beforeend', statusHTML);
        
        // Attach event listener
        const startBtn = this.shadowRoot.querySelector('.start-btn');
        if (startBtn) {
          startBtn.addEventListener('click', () => {
            this.emit('selection-complete', { fighters: this._selectedFighters });
          });
        }
      }
    } else if (statusEl) {
      statusEl.remove();
    }

    // Update selected fighters display
    this.updateSelectedFightersDisplay();
  }

  /**
   * Update the selected fighters display area
   */
  updateSelectedFightersDisplay() {
    let displayArea = this.shadowRoot.querySelector('.selected-fighters-display');
    
    if (!displayArea) {
      // Create display area
      const gallery = this.shadowRoot.querySelector('.fighters-grid');
      if (gallery && gallery.parentNode) {
        gallery.parentNode.insertBefore(this.createSelectedDisplay(), gallery);
        displayArea = this.shadowRoot.querySelector('.selected-fighters-display');
      }
    }

    if (displayArea) {
      if (this._selectedFighters.length > 0) {
        // Determine needed count for display
        let maxCount;
        if (this._mode === 'opponent') {
          maxCount = '1';
        } else if (this._mode === 'single') {
          maxCount = '2';
        } else {
          maxCount = '4';
        }
        
        displayArea.innerHTML = `
          <div class="selected-header">
            <h4>Selected: ${this._selectedFighters.length}/${maxCount}</h4>
          </div>
          <div class="selected-list">
            ${this._selectedFighters.map(fighter => `
              <div class="selected-fighter-chip">
                <img src="${fighter.image}" alt="${fighter.name}" />
                <span>${fighter.name}</span>
                <button class="remove-btn" data-fighter-id="${fighter.id}">✕</button>
              </div>
            `).join('')}
          </div>
        `;

        // Attach remove buttons
        displayArea.querySelectorAll('.remove-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const fighterId = parseInt(e.target.dataset.fighterId);
            this.removeFighter(fighterId);
            e.stopPropagation();
          });
        });

        displayArea.style.display = 'block';
      } else {
        displayArea.style.display = 'none';
      }
    }
  }

  /**
   * Create selected fighters display element
   */
  createSelectedDisplay() {
    const div = document.createElement('div');
    div.className = 'selected-fighters-display';
    div.style.display = 'none';
    return div;
  }

  /**
   * Remove a fighter from selection
   */
  removeFighter(fighterId) {
    this._selectedFighters = this._selectedFighters.filter(f => f.id !== fighterId);
    
    // Remove highlight from card
    const cards = this.shadowRoot.querySelectorAll('fighter-card');
    cards.forEach(card => {
      if (parseInt(card.getAttribute('fighter-id')) === fighterId) {
        card.classList.remove('selected');
      }
    });

    this.updateSelectionStatus();
  }
}

// Register the component
customElements.define('fighter-gallery', FighterGallery);
