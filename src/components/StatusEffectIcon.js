import { BaseComponent } from './BaseComponent.js';

/**
 * StatusEffectIcon Web Component
 * Displays a status effect icon with tooltip
 * 
 * Attributes:
 * - effect-name: Name of the effect
 * - effect-icon: Emoji icon
 * - effect-type: 'buff' or 'debuff'
 * - effect-duration: Turns remaining
 */
export class StatusEffectIcon extends BaseComponent {
  static get observedAttributes() {
    return ['effect-name', 'effect-icon', 'effect-type', 'effect-duration'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return `
      :host {
        display: inline-block;
      }

      .status-effect {
        font-size: 20px;
        line-height: 1;
        padding: 2px 5px;
        border-radius: 4px;
        animation: statusEffectPop 0.3s ease;
        cursor: help;
        position: relative;
      }

      .status-effect.buff {
        background: rgba(40, 167, 69, 0.2);
        border: 1px solid #28a745;
      }

      .status-effect.debuff {
        background: rgba(220, 53, 69, 0.2);
        border: 1px solid #dc3545;
      }

      @keyframes statusEffectPop {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .status-effect:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 12px;
        margin-bottom: 5px;
        z-index: 1000;
      }
    `;
  }

  template() {
    const name = this.getAttribute('effect-name') || 'Unknown';
    const icon = this.getAttribute('effect-icon') || '❓';
    const type = this.getAttribute('effect-type') || 'buff';
    const duration = this.getAttribute('effect-duration') || '0';

    const tooltip = `${name} (${duration} turns)`;

    return `
      <span 
        class="status-effect ${type}" 
        data-tooltip="${tooltip}"
      >
        ${icon}
      </span>
    `;
  }
}

// Register the component
customElements.define('status-effect-icon', StatusEffectIcon);
