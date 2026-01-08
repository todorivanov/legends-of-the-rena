import { BaseComponent } from './BaseComponent.js';

/**
 * TurnIndicator Web Component
 * Shows whose turn it is with animation
 * 
 * Attributes:
 * - fighter-name: Name to display
 */
export class TurnIndicator extends BaseComponent {
  static get observedAttributes() {
    return ['fighter-name'];
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2000;
        pointer-events: none;
      }

      .turn-indicator {
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        color: white;
        padding: 30px 60px;
        border-radius: 20px;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: turnIndicatorPulse 0.6s ease;
      }

      @keyframes turnIndicatorPulse {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
  }

  template() {
    const fighterName = this.getAttribute('fighter-name') || 'Unknown';
    return `<div class="turn-indicator">${fighterName}'s Turn!</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Auto-remove after 1 second
    setTimeout(() => {
      this.remove();
    }, 1000);
  }
}

// Register the component
customElements.define('turn-indicator', TurnIndicator);
