/**
 * ComboHint - Shows available combo suggestions to the player
 */

import { BaseComponent } from './BaseComponent.js';

export class ComboHint extends BaseComponent {
  constructor() {
    super();
    this._suggestions = [];
  }

  static get observedAttributes() {
    return ['suggestions'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'suggestions' && newValue) {
      try {
        this._suggestions = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Failed to parse combo suggestions:', e);
      }
    }
  }

  set suggestions(value) {
    this._suggestions = value || [];
    this.render();
  }

  get suggestions() {
    return this._suggestions;
  }

  styles() {
    return `
      :host {
        display: block;
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 4000;
        max-width: 320px;
        width: auto;
      }

      .combo-hints-container {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
        border: 2px solid #ffd700;
        border-radius: 12px;
        padding: 10px 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
      }

      .combo-hints-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }

      .combo-hints-title {
        font-size: 13px;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      }

      .combo-hint-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px;
        margin-bottom: 6px;
        transition: all 0.3s ease;
      }

      .combo-hint-item:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(4px);
      }

      .combo-hint-item:last-child {
        margin-bottom: 0;
      }

      .combo-name {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .combo-icon {
        font-size: 16px;
      }

      .combo-progress {
        font-size: 10px;
        color: #4caf50;
        font-weight: 600;
        background: rgba(76, 175, 80, 0.2);
        padding: 2px 6px;
        border-radius: 8px;
        display: inline-block;
      }

      .combo-next-action {
        font-size: 11px;
        color: #ffeb3b;
        margin-top: 3px;
      }

      .combo-description {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 3px;
        line-height: 1.3;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @media (max-width: 768px) {
        :host {
          top: 60px;
          right: 10px;
          max-width: 280px;
        }

        .combo-hints-container {
          padding: 8px 10px;
        }

        .combo-hints-title {
          font-size: 12px;
        }

        .combo-name {
          font-size: 12px;
        }

        .combo-next-action {
          font-size: 10px;
        }
      }
    `;
  }

  template() {
    if (!this._suggestions || this._suggestions.length === 0) {
      return '';
    }

    return `
      <div class="combo-hints-container">
        <div class="combo-hints-header">
          <span class="combo-icon">⚡</span>
          <span class="combo-hints-title">Combo Opportunities</span>
        </div>
        ${this._suggestions.map((suggestion) => this.renderSuggestion(suggestion)).join('')}
      </div>
    `;
  }

  renderSuggestion(suggestion) {
    const { combo, nextAction, progress } = suggestion;
    const actionText = this.formatNextAction(nextAction);

    return `
      <div class="combo-hint-item">
        <div class="combo-name">
          <span class="combo-icon">${combo.icon || '⚡'}</span>
          <span>${combo.name}</span>
          <span class="combo-progress">${progress}</span>
        </div>
        <div class="combo-next-action">
          Next: ${actionText}
        </div>
        <div class="combo-description">
          ${combo.description}
        </div>
      </div>
    `;
  }

  formatNextAction(action) {
    if (!action) return 'Unknown';

    const typeMap = {
      attack: '⚔️ Attack',
      defend: '🛡️ Defend',
      skill: '💫 Use Skill',
      item: '🧪 Use Item',
    };

    let text = typeMap[action.type] || action.type;

    if (action.skill) {
      text += ` (${action.skill})`;
    }

    return text;
  }
}

customElements.define('combo-hint', ComboHint);
