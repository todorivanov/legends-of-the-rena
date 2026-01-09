/**
 * AppLayout - Main application layout with navigation
 */

import { BaseComponent } from './BaseComponent.js';
import './NavigationBar.js';
import './ThemeToggle.js';
import './SoundToggle.js';

export class AppLayout extends BaseComponent {
  connectedCallback() {
    this.render();
  }

  render() {
    const styles = `
      <style>
        :host {
          display: block;
        }

        .layout-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
        }

        .content-area {
          width: 100%;
          min-height: 100vh;
        }

        .nav-overlay {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 9999;
          pointer-events: none;
        }

        .nav-overlay > * {
          pointer-events: auto;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="layout-container">
        <div class="nav-overlay">
          <navigation-bar></navigation-bar>
          <theme-toggle></theme-toggle>
          <sound-toggle></sound-toggle>
        </div>
        <div class="content-area">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('app-layout', AppLayout);
