import { BaseComponent } from './BaseComponent.js';

/**
 * TitleScreen Web Component
 * Epic game title screen with animated background
 *
 * Events:
 * - mode-selected: { mode: 'single' | 'team' }
 * - tournament-selected: User wants to start tournament
 */
export class TitleScreen extends BaseComponent {
  styles() {
    return `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }

      .title-screen {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a0d2e 0%, #2d1b69 25%, #0a0612 75%, #000 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        animation: fadeIn 1s ease;
      }

      /* Animated Background */
      .bg-particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.3;
        z-index: 0;
      }

      .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 167, 38, 0.8);
        border-radius: 50%;
        animation: float-particle 20s infinite linear;
      }

      @keyframes float-particle {
        0% {
          transform: translateY(100vh) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) translateX(100px);
          opacity: 0;
        }
      }

      .content {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 700px;
        padding: 20px;
        max-height: 100vh;
        overflow-y: auto;
      }

      .logo {
        margin-bottom: 30px;
        animation: fadeInDown 1s ease 0.2s both;
      }

      .game-title {
        font-family: 'Orbitron', monospace;
        font-size: 56px;
        font-weight: 900;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 50%, #ffa726 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-transform: uppercase;
        letter-spacing: 6px;
        margin: 0;
        animation: shimmer 3s infinite linear;
        text-shadow: 0 0 40px rgba(255, 167, 38, 0.5);
        filter: drop-shadow(0 4px 20px rgba(255, 167, 38, 0.7));
      }

      @keyframes shimmer {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }

      .subtitle {
        font-size: 18px;
        color: #b39ddb;
        margin-top: 8px;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-weight: 300;
      }

      .menu-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 40px;
        animation: fadeInUp 1s ease 0.4s both;
      }

      .menu-btn {
        position: relative;
        padding: 16px 40px;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: white;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.3) 0%, rgba(42, 26, 71, 0.5) 100%);
        border: 2px solid rgba(106, 66, 194, 0.5);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        overflow: hidden;
      }

      .menu-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }

      .menu-btn:hover::before {
        left: 100%;
      }

      .menu-btn:hover {
        transform: translateY(-5px) scale(1.05);
        border-color: #ffa726;
        box-shadow: 
          0 10px 40px rgba(255, 167, 38, 0.4),
          inset 0 0 20px rgba(255, 167, 38, 0.1);
        background: linear-gradient(135deg, rgba(255, 167, 38, 0.2) 0%, rgba(106, 66, 194, 0.3) 100%);
      }

      .menu-btn:active {
        transform: translateY(-2px) scale(1.02);
      }

      .btn-icon {
        margin-right: 12px;
        font-size: 24px;
        vertical-align: middle;
      }

      .version {
        position: absolute;
        bottom: 20px;
        right: 30px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
        letter-spacing: 2px;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .game-title {
          font-size: 36px;
          letter-spacing: 3px;
        }

        .subtitle {
          font-size: 14px;
        }

        .menu-btn {
          padding: 14px 30px;
          font-size: 16px;
          letter-spacing: 1px;
        }

        .btn-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        .logo {
          margin-bottom: 20px;
        }

        .menu-options {
          margin-top: 30px;
          gap: 10px;
        }
      }
    `;
  }

  template() {
    return `
      <div class="title-screen">
        <div class="bg-particles" id="particles"></div>
        
        <div class="content">
          <div class="logo">
            <h1 class="game-title">Legends of the Arena</h1>
            <p class="subtitle">Rise to Glory</p>
          </div>

          <div class="menu-options">
            <button class="menu-btn" id="story-btn">
              <span class="btn-icon">📖</span>
              Story Mode
            </button>
            <button class="menu-btn" data-mode="single">
              <span class="btn-icon">⚔️</span>
              Single Combat
            </button>
            <button class="menu-btn" id="tournament-btn">
              <span class="btn-icon">🏆</span>
              Tournament
            </button>
            <button class="menu-btn" id="marketplace-btn">
              <span class="btn-icon">🏪</span>
              Marketplace
            </button>
            <button class="menu-btn" id="wiki-btn">
              <span class="btn-icon">📚</span>
              Game Wiki
            </button>
          </div>
        </div>

        <div class="version">v4.0.0</div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.menu-btn[data-mode]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.emit('mode-selected', { mode });
      });
    });

    // Tournament button
    const tournamentBtn = this.shadowRoot.querySelector('#tournament-btn');
    if (tournamentBtn) {
      tournamentBtn.addEventListener('click', () => {
        this.emit('tournament-selected');
      });
    }

    // Story button
    const storyBtn = this.shadowRoot.querySelector('#story-btn');
    if (storyBtn) {
      storyBtn.addEventListener('click', () => {
        this.emit('story-selected');
      });
    }

    // Marketplace button
    const marketplaceBtn = this.shadowRoot.querySelector('#marketplace-btn');
    if (marketplaceBtn) {
      marketplaceBtn.addEventListener('click', () => {
        this.emit('marketplace-selected');
      });
    }

    // Wiki button
    const wikiBtn = this.shadowRoot.querySelector('#wiki-btn');
    if (wikiBtn) {
      wikiBtn.addEventListener('click', () => {
        this.emit('wiki-selected');
      });
    }

    // Create floating particles
    this.createParticles();
  }

  createParticles() {
    const container = this.shadowRoot.querySelector('.bg-particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      container.appendChild(particle);
    }
  }
}

// Register the component
customElements.define('title-screen', TitleScreen);
