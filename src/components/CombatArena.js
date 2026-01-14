import { BaseComponent } from './BaseComponent.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import styles from '../styles/components/CombatArena.scss?inline';

/**
 * CombatArena Web Component
 * Modern combat arena with cinematic styling
 *
 * Properties:
 * - autoBattle: boolean - Whether auto-battle mode is enabled
 *
 * Events:
 * - return-to-menu: User wants to return to main menu
 * - auto-battle-toggle: { enabled: boolean } - Auto battle mode toggled
 */
export class CombatArena extends BaseComponent {
  constructor() {
    super();
    this.autoBattle = false;
    this.autoScroll = localStorage.getItem('autoScrollEnabled') !== 'false'; // Default to true
  }

  styles() {
    return styles;
  }

  template() {
    return `
      <div class="arena-container">
        <!-- Animated Background -->
        <div class="arena-bg">
          <div class="energy-ring"></div>
          <div class="energy-ring"></div>
          <div class="energy-ring"></div>
        </div>

        <!-- Corner UI: Menu Button -->
        <div class="corner-ui top-left">
          <button class="menu-btn" id="menu-btn">
            ☰ Menu
          </button>
          <button class="auto-battle-toggle" id="auto-battle-toggle">
            🤖 Auto Battle: OFF
          </button>
        </div>

        <!-- HUD Area (fighter-hud will be inserted here by game) -->
        <div class="hud-area" id="hud-area"></div>

        <!-- Main Content - Side by Side Layout -->
        <div class="combat-content">
          <!-- Combat Log - Left Side -->
          <div class="combat-log-container">
            <button class="auto-scroll-toggle ${this.autoScroll ? 'active' : ''}" id="auto-scroll-toggle" title="Toggle auto-scroll">
              ${this.autoScroll ? '📜 Auto-Scroll: ON' : '📜 Auto-Scroll: OFF'}
            </button>
            <div class="combat-log-header">
              <h3 class="combat-log-title">⚔️ Battle Log ⚔️</h3>
            </div>
            <div id="log"></div>
          </div>

          <!-- Grid Combat Area - Right Side -->
          <div class="grid-area" id="grid-area"></div>
        </div>

        <!-- Action Area (action-selection will appear here) -->
        <div class="action-area" id="action-area"></div>

        <!-- Round transition effect -->
        <div class="round-transition" id="round-transition"></div>
      </div>
    `;
  }

  attachEventListeners() {
    const menuBtn = this.shadowRoot.querySelector('#menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        if (confirm('Return to main menu? (Current battle will be lost)')) {
          this.emit('return-to-menu');
        }
      });
    }

    const autoBattleToggle = this.shadowRoot.querySelector('#auto-battle-toggle');
    if (autoBattleToggle) {
      autoBattleToggle.addEventListener('click', () => {
        this.autoBattle = !this.autoBattle;
        autoBattleToggle.classList.toggle('active', this.autoBattle);
        autoBattleToggle.innerHTML = this.autoBattle ? '🤖 Auto Battle: ON' : '🤖 Auto Battle: OFF';

        // Emit event for game to listen to
        this.emit('auto-battle-toggle', { enabled: this.autoBattle });

        ConsoleLogger.info(LogCategory.UI, 'Auto Battle:', this.autoBattle ? 'ON' : 'OFF');
      });
    }

    const autoScrollToggle = this.shadowRoot.querySelector('#auto-scroll-toggle');
    if (autoScrollToggle) {
      autoScrollToggle.addEventListener('click', () => {
        this.autoScroll = !this.autoScroll;
        autoScrollToggle.classList.toggle('active', this.autoScroll);
        autoScrollToggle.innerHTML = this.autoScroll ? '📜 Auto-Scroll: ON' : '📜 Auto-Scroll: OFF';

        // Save preference
        localStorage.setItem('autoScrollEnabled', this.autoScroll);

        // Emit event for Logger to listen to
        this.emit('auto-scroll-toggle', { enabled: this.autoScroll });

        ConsoleLogger.info(LogCategory.UI, 'Auto-Scroll:', this.autoScroll ? 'ON' : 'OFF');

        // If enabled, scroll to bottom immediately
        if (this.autoScroll) {
          const logContainer = this.shadowRoot.querySelector('.combat-log-container');
          if (logContainer) {
            logContainer.scrollTop = logContainer.scrollHeight;
          }
        }
      });
    }
  }

  /**
   * Trigger round transition effect
   */
  triggerRoundTransition() {
    const transition = this.shadowRoot.querySelector('#round-transition');
    if (transition) {
      transition.classList.add('active');
      setTimeout(() => {
        transition.classList.remove('active');
      }, 500);
    }
  }

  /**
   * Get the log element for Logger
   */
  getLogElement() {
    return this.shadowRoot.querySelector('#log');
  }

  /**
   * Get the HUD area for HUD manager
   */
  getHudArea() {
    return this.shadowRoot.querySelector('#hud-area');
  }
}

// Register the component
customElements.define('combat-arena', CombatArena);
