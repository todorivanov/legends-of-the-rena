/**
 * ComboHint - Shows available combo suggestions to the player
 */

import { BaseComponent } from './BaseComponent.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import comboHintStyles from '../styles/components/ComboHint.scss?inline';

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
        ConsoleLogger.error(LogCategory.UI, 'Failed to parse combo suggestions:', e);
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
    return comboHintStyles;
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
