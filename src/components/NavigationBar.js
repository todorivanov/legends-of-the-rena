/**
 * NavigationBar - Top navigation with Profile, Achievements, Settings, Theme, Sound
 */

import { BaseComponent } from './BaseComponent.js';
import { router } from '../utils/Router.js';
import { RoutePaths } from '../config/routes.js';
import { soundManager } from '../utils/soundManager.js';
import styles from '../styles/components/NavigationBar.scss?inline';

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
        id: 'talents',
        label: '⭐ Talents',
        icon: '⭐',
        path: RoutePaths.TALENTS,
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

  styles() {
    return styles;
  }

  render() {
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
      <style>${this.styles()}</style>
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
