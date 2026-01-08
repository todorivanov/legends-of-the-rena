import { BaseComponent } from './BaseComponent.js';

/**
 * ComboIndicator Web Component
 * Shows combo counter with animation
 * 
 * Attributes:
 * - combo-count: Number to display
 */
export class ComboIndicator extends BaseComponent {
  static get observedAttributes() {
    return ['combo-count'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return `
      :host {
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        z-index: 2000;
        pointer-events: none;
      }

      .combo-indicator {
        font-size: 48px;
        font-weight: bold;
        color: #ffc107;
        text-shadow: 
          2px 2px 0 #000,
          -2px -2px 0 #000,
          2px -2px 0 #000,
          -2px 2px 0 #000;
        animation: comboPopIn 0.6s ease forwards;
      }

      @keyframes comboPopIn {
        0% {
          transform: translate(-50%, -50%) scale(0) rotate(-10deg);
          opacity: 0;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.3) rotate(5deg);
        }
        100% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
          opacity: 1;
        }
      }
    `;
  }

  template() {
    const comboCount = this.getAttribute('combo-count') || '0';
    return `<div class="combo-indicator">COMBO x${comboCount}!</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Auto-remove after 1.5 seconds
    setTimeout(() => {
      this.remove();
    }, 1500);
  }
}

// Register the component
customElements.define('combo-indicator', ComboIndicator);
