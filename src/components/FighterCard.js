import { BaseComponent } from './BaseComponent.js';

/**
 * FighterCard Web Component
 * Displays a fighter's information in a card format
 * 
 * Attributes:
 * - fighter-id: Unique ID of the fighter
 * - fighter-name: Name of the fighter
 * - fighter-image: URL to fighter image
 * - fighter-health: Current health
 * - fighter-strength: Strength value
 * - fighter-class: Fighter class
 * - fighter-description: Bio/description
 * - draggable: Whether card is draggable
 * - selectable: Whether card is selectable
 */
export class FighterCard extends BaseComponent {
  static get observedAttributes() {
    return [
      'fighter-id', 'fighter-name', 'fighter-image', 
      'fighter-health', 'fighter-strength', 'fighter-class',
      'fighter-description', 'draggable', 'selectable'
    ];
  }

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

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return `
      :host {
        display: block;
        animation: fadeInUp 0.6s ease both;
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

      .fighter-card {
        background: linear-gradient(145deg, rgba(42, 26, 71, 0.6) 0%, rgba(26, 13, 46, 0.8) 100%);
        border: 2px solid rgba(106, 66, 194, 0.4);
        border-radius: 16px;
        padding: 0;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
        height: 100%;
      }

      .fighter-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent 30%,
          rgba(255, 167, 38, 0.1) 50%,
          transparent 70%
        );
        transform: rotate(45deg);
        transition: all 0.6s;
      }

      .fighter-card:hover::before {
        left: 100%;
      }

      .fighter-card:hover {
        transform: translateY(-10px) scale(1.02);
        border-color: #ffa726;
        box-shadow: 
          0 15px 40px rgba(0, 0, 0, 0.5),
          0 0 30px rgba(255, 167, 38, 0.3),
          inset 0 0 20px rgba(255, 167, 38, 0.05);
      }

      :host(.selected) .fighter-card {
        border-color: #00e676;
        box-shadow: 
          0 10px 30px rgba(0, 0, 0, 0.4),
          0 0 40px rgba(0, 230, 118, 0.6),
          inset 0 0 30px rgba(0, 230, 118, 0.1);
        position: relative;
      }

      :host(.selected) .fighter-card::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        color: #00e676;
        text-shadow: 0 0 20px #00e676, 0 0 40px #00e676;
        opacity: 0.3;
        pointer-events: none;
        z-index: 10;
      }

      .fighter-card.draggable {
        cursor: grab;
      }

      .fighter-card.draggable:active {
        cursor: grabbing;
      }

      .fighter-image-container {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius: 14px 14px 0 0;
      }

      .fighter-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .fighter-card:hover .fighter-image {
        transform: scale(1.1);
      }

      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: linear-gradient(to top, rgba(10, 6, 18, 0.95) 0%, transparent 100%);
        pointer-events: none;
      }

      .fighter-content {
        padding: 20px;
        position: relative;
      }

      .fighter-name {
        font-size: 22px;
        font-weight: 700;
        color: #ffa726;
        margin: 0 0 8px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .fighter-class {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        color: white;
        background: linear-gradient(135deg, #6a42c2 0%, #2d1b69 100%);
        padding: 4px 12px;
        border-radius: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(106, 66, 194, 0.4);
      }

      .fighter-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 15px;
      }

      .stat {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .stat-label {
        font-size: 13px;
        font-weight: 600;
        color: #b39ddb;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .stat-icon {
        font-size: 16px;
      }

      .stat-value {
        font-size: 16px;
        color: #00e676;
        font-weight: 700;
      }

      .class-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        background: rgba(10, 6, 18, 0.9);
        color: #ffa726;
        border: 2px solid rgba(255, 167, 38, 0.5);
        text-transform: uppercase;
        letter-spacing: 1px;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .level-indicator {
        position: absolute;
        top: 15px;
        left: 15px;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        color: white;
        box-shadow: 0 4px 12px rgba(255, 167, 38, 0.5);
        border: 3px solid rgba(10, 6, 18, 0.9);
      }
    `;
  }

  template() {
    const id = this.getAttribute('fighter-id') || this._fighter?.id || '';
    const name = this.getAttribute('fighter-name') || this._fighter?.name || 'Unknown Fighter';
    const image = this.getAttribute('fighter-image') || this._fighter?.image || '';
    const health = this.getAttribute('fighter-health') || this._fighter?.health || 0;
    const strength = this.getAttribute('fighter-strength') || this._fighter?.strength || 0;
    const fighterClass = this.getAttribute('fighter-class') || this._fighter?.class || 'BALANCED';
    const isDraggable = this.hasAttribute('draggable');
    const level = Math.floor(strength / 10) + 1; // Calculate level from strength

    return `
      <div class="fighter-card ${isDraggable ? 'draggable' : ''}" data-fighter-id="${id}">
        <div class="fighter-image-container">
          <img class="fighter-image" src="${image}" alt="${name}" />
          <div class="image-overlay"></div>
          <div class="level-indicator">
            ${level}
          </div>
          <div class="class-badge">${fighterClass}</div>
        </div>
        
        <div class="fighter-content">
          <h3 class="fighter-name">${name}</h3>
          <span class="fighter-class">${fighterClass}</span>
          
          <div class="fighter-stats">
            <div class="stat">
              <span class="stat-label">
                <span class="stat-icon">❤️</span>
                Health
              </span>
              <span class="stat-value">${health}</span>
            </div>
            <div class="stat">
              <span class="stat-label">
                <span class="stat-icon">⚔️</span>
                Power
              </span>
              <span class="stat-value">${strength}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const card = this.shadowRoot.querySelector('.fighter-card');
    
    if (this.hasAttribute('selectable')) {
      card.addEventListener('click', () => {
        this.emit('fighter-selected', { 
          fighterId: this.getAttribute('fighter-id'),
          fighter: this._fighter
        });
      });
    }

    if (this.hasAttribute('draggable')) {
      card.draggable = true;
      
      card.addEventListener('dragstart', (_e) => {
        this.emit('fighter-dragstart', { 
          fighterId: this.getAttribute('fighter-id'),
          fighter: this._fighter
        });
      });
    }
  }
}

// Register the component
customElements.define('fighter-card', FighterCard);
