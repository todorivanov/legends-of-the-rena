/**
 * SoundToggle - Sound on/off toggle button
 */

import { BaseComponent } from './BaseComponent.js';
import { soundManager } from '../utils/soundManager.js';

export class SoundToggle extends BaseComponent {
  constructor() {
    super();
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const button = this.shadowRoot.querySelector('#sound-toggle-btn');
    button.addEventListener('click', () => this.toggleSound());
  }

  toggleSound() {
    this.soundEnabled = soundManager.toggle();

    // Update button icon
    const button = this.shadowRoot.querySelector('#sound-toggle-btn');
    button.textContent = this.soundEnabled ? '🔊' : '🔇';
    button.title = `Turn Sound ${this.soundEnabled ? 'Off' : 'On'}`;
  }

  render() {
    const styles = `
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
        }

        .sound-toggle-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(26, 13, 46, 0.8);
          color: white;
          font-size: 24px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sound-toggle-btn:hover {
          transform: translateY(-2px) scale(1.1);
          border-color: #4caf50;
          background: rgba(76, 175, 80, 0.3);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        @media (max-width: 768px) {
          :host {
            top: 10px;
            right: 10px;
          }

          .sound-toggle-btn {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <button 
        id="sound-toggle-btn" 
        class="sound-toggle-btn"
        title="Turn Sound ${this.soundEnabled ? 'Off' : 'On'}"
      >
        ${this.soundEnabled ? '🔊' : '🔇'}
      </button>
    `;
  }
}

customElements.define('sound-toggle', SoundToggle);
