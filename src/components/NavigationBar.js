/**
 * NavigationBar - Top navigation with Profile, Achievements, Settings, Theme, Sound
 */

import { BaseComponent } from './BaseComponent.js';
import { router } from '../utils/Router.js';
import { RoutePaths } from '../config/routes.js';
import { soundManager } from '../utils/soundManager.js';

export class NavigationBar extends BaseComponent {
  constructor() {
    super();
    this.buttons = [
      {
        id: 'profile',
        label: '👤 Profile',
        icon: '👤',
        path: RoutePaths.PROFILE,
        requiresCharacter: true,
      },
      {
        id: 'achievements',
        label: '🏅 Achievements',
        icon: '🏅',
        path: RoutePaths.ACHIEVEMENTS,
        requiresCharacter: true,
      },
      {
        id: 'settings',
        label: '⚙️',
        icon: '⚙️',
        path: RoutePaths.SETTINGS,
        requiresCharacter: false,
        iconOnly: true,
      },
    ];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const styles = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
        }

        .nav-container {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .nav-btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(26, 13, 46, 0.8);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          font-family: 'Press Start 2P', cursive;
          white-space: nowrap;
        }

        .nav-btn.icon-only {
          width: 50px;
          height: 50px;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .nav-btn:hover {
          transform: translateY(-2px);
          border-color: #ffa726;
          background: rgba(255, 167, 38, 0.3);
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
        }

        .nav-btn.settings:hover {
          transform: translateY(-2px) rotate(90deg);
        }

        .nav-btn.achievements:hover {
          border-color: gold;
          background: rgba(255, 215, 0, 0.3);
        }

        @media (max-width: 768px) {
          :host {
            top: 10px;
            right: 10px;
          }

          .nav-container {
            gap: 8px;
          }

          .nav-btn {
            padding: 10px 16px;
            font-size: 14px;
          }

          .nav-btn.icon-only {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          /* Hide text labels on mobile, show icons only */
          .nav-btn-text {
            display: none;
          }
        }
      </style>
    `;

    const buttonsHTML = this.buttons
      .map(
        (button) => `
      <button 
        id="${button.id}-btn" 
        class="nav-btn ${button.iconOnly ? 'icon-only' : ''} ${button.id}"
        title="${button.label}"
      >
        ${button.iconOnly ? button.icon : button.label}
      </button>
    `
      )
      .join('');

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="nav-container">
        ${buttonsHTML}
      </div>
    `;

    // Attach event listeners after rendering
    this.buttons.forEach((button) => {
      const btn = this.shadowRoot.querySelector(`#${button.id}-btn`);
      if (btn) {
        btn.addEventListener('click', () => {
          soundManager.play('event');
          router.navigate(button.path);
        });
      }
    });
  }
}

customElements.define('navigation-bar', NavigationBar);
