import { BaseComponent } from './BaseComponent.js';

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
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .arena-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        position: relative;
        overflow: hidden;
      }

      /* Animated background */
      .arena-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.15;
        z-index: 0;
        pointer-events: none;
      }

      .energy-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        height: 800px;
        border: 2px solid rgba(255, 167, 38, 0.3);
        border-radius: 50%;
        animation: pulse-ring 4s ease-in-out infinite;
      }

      .energy-ring:nth-child(2) {
        width: 600px;
        height: 600px;
        animation-delay: 1s;
      }

      .energy-ring:nth-child(3) {
        width: 400px;
        height: 400px;
        animation-delay: 2s;
      }

      @keyframes pulse-ring {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.3;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.6;
        }
      }

      /* HUD Area */
      .hud-area {
        position: relative;
        z-index: 10;
        padding: 20px;
        animation: fadeInDown 0.8s ease;
      }

      /* Main Content Area - Side by Side Layout */
      .combat-content {
        flex: 1;
        display: flex;
        gap: 20px;
        padding: 20px;
        min-height: 0;
        position: relative;
        z-index: 5;
      }

      /* Combat Log - Left Side */
      .combat-log-container {
        width: 400px;
        min-width: 350px;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        background: linear-gradient(145deg, rgba(42, 26, 71, 0.7) 0%, rgba(26, 13, 46, 0.85) 100%);
        border: 2px solid rgba(106, 66, 194, 0.4);
        border-radius: 20px;
        padding: 25px;
        overflow-y: auto;
        overflow-x: hidden;
        backdrop-filter: blur(15px);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.5),
          inset 0 0 40px rgba(255, 167, 38, 0.05);
        position: relative;
        animation: slideInLeft 0.8s ease;
      }

      @keyframes slideInLeft {
        from {
          transform: translateX(-50px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Grid Combat Area - Right Side */
      .grid-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        animation: fadeIn 0.8s ease;
      }

      .combat-log-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100px;
        background: linear-gradient(to bottom, rgba(26, 13, 46, 0.9), transparent);
        pointer-events: none;
        border-radius: 20px 20px 0 0;
      }

      .combat-log-header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        padding-top: 5px;
        border-bottom: 2px solid rgba(255, 167, 38, 0.3);
        position: relative;
      }

      .combat-log-title {
        font-family: 'Orbitron', monospace;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin: 0;
      }

      #log {
        position: relative;
        z-index: 1;
        font-size: 14px;
        line-height: 1.6;
        color: #ffffff;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      /* Hide any images in log */
      #log img {
        display: none !important;
      }

      /* Style log messages */
      #log > div {
        margin: 8px 0;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        border-left: 4px solid rgba(255, 167, 38, 0.7);
        color: #ffffff !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      /* Force all text in log to be white */
      #log * {
        color: #ffffff !important;
      }

      /* Style badges in log */
      #log .badge {
        background: linear-gradient(135deg, #ffa726, #ff6f00) !important;
        color: white !important;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: bold;
      }

      /* Scrollbar styling */
      .combat-log-container::-webkit-scrollbar {
        width: 12px;
      }

      .combat-log-container::-webkit-scrollbar-track {
        background: rgba(10, 6, 18, 0.5);
        border-radius: 10px;
      }

      .combat-log-container::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #6a42c2 0%, #ffa726 100%);
        border-radius: 10px;
        border: 2px solid rgba(10, 6, 18, 0.5);
      }

      .combat-log-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        box-shadow: 0 0 10px rgba(255, 167, 38, 0.5);
      }

      /* Auto-scroll toggle */
      .auto-scroll-toggle {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        background: rgba(26, 13, 46, 0.8);
        border: 2px solid rgba(255, 167, 38, 0.4);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        z-index: 5;
      }

      .auto-scroll-toggle.active {
        background: rgba(0, 230, 118, 0.3);
        border-color: #00e676;
        box-shadow: 0 0 15px rgba(0, 230, 118, 0.4);
      }

      .auto-scroll-toggle:hover {
        background: rgba(255, 167, 38, 0.3);
        border-color: #ffa726;
        transform: translateY(-2px);
      }

      .auto-scroll-toggle.active:hover {
        background: rgba(0, 230, 118, 0.4);
        border-color: #00e676;
      }

      /* Action Area */
      .action-area {
        position: relative;
        z-index: 20;
        padding: 20px;
        animation: fadeInUp 0.8s ease;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Corner UI Elements */
      .corner-ui {
        position: absolute;
        z-index: 15;
      }

      .corner-ui.top-left {
        top: 20px;
        left: 20px;
      }

      .corner-ui.top-right {
        top: 20px;
        right: 20px;
      }

      .menu-btn {
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: white;
        background: rgba(26, 13, 46, 0.8);
        border: 2px solid rgba(255, 167, 38, 0.4);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }

      .menu-btn:hover {
        background: rgba(255, 167, 38, 0.2);
        border-color: #ffa726;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.5);
        transform: translateY(-2px);
      }

      .menu-btn:active {
        transform: translateY(0);
      }

      .auto-battle-toggle {
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: white;
        background: rgba(26, 13, 46, 0.8);
        border: 2px solid rgba(255, 167, 38, 0.4);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        margin-left: 10px;
      }

      .auto-battle-toggle.active {
        background: rgba(0, 230, 118, 0.3);
        border-color: #00e676;
        box-shadow: 0 0 20px rgba(0, 230, 118, 0.5);
      }

      .auto-battle-toggle:hover {
        background: rgba(255, 167, 38, 0.2);
        border-color: #ffa726;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.5);
        transform: translateY(-2px);
      }

      .auto-battle-toggle.active:hover {
        background: rgba(0, 230, 118, 0.4);
        border-color: #00e676;
      }

      .auto-battle-toggle:active {
        transform: translateY(0);
      }

      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Round transition overlay */
      .round-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 167, 38, 0.2) 0%, transparent 70%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 100;
      }

      .round-transition.active {
        opacity: 1;
      }
    `;
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

        console.log('Auto Battle:', this.autoBattle ? 'ON' : 'OFF');
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

        console.log('Auto-Scroll:', this.autoScroll ? 'ON' : 'OFF');

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
