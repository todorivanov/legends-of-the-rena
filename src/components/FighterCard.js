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
      }

      .fighter-card {
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .fighter-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        border-color: var(--primary-color);
      }

      .fighter-card.draggable {
        cursor: grab;
      }

      .fighter-card.draggable:active {
        cursor: grabbing;
      }

      .fighter-content {
        display: flex;
        gap: 15px;
      }

      .fighter-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        border: 2px solid var(--border-color);
      }

      .fighter-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .fighter-name {
        font-size: 18px;
        font-weight: bold;
        color: var(--text-color);
        margin: 0;
      }

      .fighter-class {
        font-size: 12px;
        color: var(--info-color);
        font-weight: 600;
        text-transform: uppercase;
      }

      .fighter-stats {
        display: flex;
        gap: 15px;
        margin-top: 5px;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
      }

      .stat-label {
        font-weight: 600;
        color: var(--text-color);
      }

      .stat-value {
        color: var(--success-color);
        font-weight: bold;
      }

      .fighter-description {
        font-size: 12px;
        color: #666;
        margin-top: 8px;
        line-height: 1.4;
        max-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .class-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        background: var(--primary-color);
        color: white;
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
    const description = this.getAttribute('fighter-description') || this._fighter?.description || '';
    const isDraggable = this.hasAttribute('draggable');

    return `
      <div class="fighter-card ${isDraggable ? 'draggable' : ''}" data-fighter-id="${id}">
        <div class="class-badge">${fighterClass}</div>
        <div class="fighter-content">
          <img class="fighter-image" src="${image}" alt="${name}" />
          <div class="fighter-info">
            <h3 class="fighter-name">${name}</h3>
            <div class="fighter-class">${fighterClass}</div>
            <div class="fighter-stats">
              <div class="stat">
                <span class="stat-label">❤️</span>
                <span class="stat-value">${health}</span>
              </div>
              <div class="stat">
                <span class="stat-label">⚔️</span>
                <span class="stat-value">${strength}</span>
              </div>
            </div>
            ${description ? `<div class="fighter-description">${description}</div>` : ''}
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
      
      card.addEventListener('dragstart', (e) => {
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
