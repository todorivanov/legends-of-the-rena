import { BaseComponent } from './BaseComponent.js';

/**
 * VictoryScreen Web Component
 * Epic victory/defeat celebration screen
 * 
 * Attributes:
 * - winner-name: Name of the winner
 * - winner-image: Image URL
 * - winner-class: Fighter class
 * 
 * Events:
 * - play-again: User wants to play again
 * - main-menu: User wants to return to main menu
 * - close: User wants to close overlay and view logs
 */
export class VictoryScreen extends BaseComponent {
  static get observedAttributes() {
    return ['winner-name', 'winner-image', 'winner-class'];
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
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
      }

      .victory-overlay {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.5s ease;
        backdrop-filter: blur(10px);
      }

      .victory-content {
        text-align: center;
        max-width: 800px;
        padding: 60px;
        background: linear-gradient(145deg, rgba(42, 26, 71, 0.95) 0%, rgba(26, 13, 46, 0.98) 100%);
        border: 3px solid;
        border-image: linear-gradient(135deg, #ffa726, #6a42c2, #00e676) 1;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 167, 38, 0.3);
        animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      }

      .victory-content::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          rgba(255, 167, 38, 0.1) 60deg,
          transparent 120deg
        );
        animation: rotate360 4s linear infinite;
      }

      .content-inner {
        position: relative;
        z-index: 1;
      }

      .victory-badge {
        width: 150px;
        height: 150px;
        margin: 0 auto 30px;
        animation: float 3s ease-in-out infinite;
      }

      .trophy {
        font-size: 120px;
        display: block;
        filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
        animation: pulse-glow 2s ease-in-out infinite;
      }

      @keyframes pulse-glow {
        0%, 100% {
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
          transform: scale(1);
        }
        50% {
          filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1));
          transform: scale(1.1);
        }
      }

      .victory-title {
        font-family: 'Orbitron', monospace;
        font-size: 64px;
        font-weight: 900;
        background: linear-gradient(135deg, #ffd700 0%, #ffa726 50%, #ffd700 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 20px 0;
        text-transform: uppercase;
        letter-spacing: 6px;
        animation: shimmer 3s infinite linear;
      }

      @keyframes shimmer {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }

      .winner-card {
        margin: 40px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;
        padding: 30px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 16px;
        border: 2px solid rgba(255, 167, 38, 0.3);
      }

      .winner-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #ffa726;
        box-shadow: 0 0 30px rgba(255, 167, 38, 0.6);
        object-fit: cover;
      }

      .winner-info {
        text-align: left;
      }

      .winner-label {
        color: #b39ddb;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 8px;
      }

      .winner-name {
        font-size: 36px;
        font-weight: 700;
        color: #ffa726;
        margin-bottom: 5px;
      }

      .winner-class {
        font-size: 18px;
        color: #00e676;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .victory-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 40px;
      }

      .victory-btn {
        padding: 18px 40px;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: white;
        border: 2px solid;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .victory-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .victory-btn:hover::before {
        width: 300px;
        height: 300px;
      }

      .btn-primary {
        background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
        border-color: #00e676;
      }

      .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 230, 118, 0.5);
      }

      .btn-secondary {
        background: linear-gradient(135deg, #6a42c2 0%, #2d1b69 100%);
        border-color: #6a42c2;
      }

      .btn-secondary:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(106, 66, 194, 0.5);
      }

      .btn-close {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        border-color: rgba(255, 255, 255, 0.3);
        font-size: 16px;
        padding: 12px 30px;
      }

      .btn-close:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
      }

      .close-hint {
        margin-top: 15px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        font-style: italic;
      }

      .sparkles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .sparkle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ffd700;
        border-radius: 50%;
        animation: sparkle-fall 3s infinite;
      }

      @keyframes sparkle-fall {
        0% {
          transform: translateY(-20px);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh);
          opacity: 0;
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes rotate360 {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
  }

  template() {
    const winnerName = this.getAttribute('winner-name') || 'Champion';
    const winnerImage = this.getAttribute('winner-image') || '';
    const winnerClass = this.getAttribute('winner-class') || 'Warrior';

    return `
      <div class="victory-overlay">
        <div class="sparkles" id="sparkles"></div>
        
        <div class="victory-content">
          <div class="content-inner">
            <div class="victory-badge">
              <span class="trophy">🏆</span>
            </div>

            <h1 class="victory-title">Victory!</h1>

            <div class="winner-card">
              <img class="winner-avatar" src="${winnerImage}" alt="${winnerName}" />
              <div class="winner-info">
                <div class="winner-label">Champion</div>
                <div class="winner-name">${winnerName}</div>
                <div class="winner-class">${winnerClass}</div>
              </div>
            </div>

            <div class="victory-buttons">
              <button class="victory-btn btn-primary" data-action="play-again">
                ⚔️ Play Again
              </button>
              <button class="victory-btn btn-secondary" data-action="main-menu">
                🏠 Main Menu
              </button>
            </div>
            
            <button class="victory-btn btn-close" data-action="close">
              👁️ Close & View Logs
            </button>
            <div class="close-hint">
              Close this screen to review combat logs and final stats
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.victory-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.emit(action);
      });
    });

    // Create falling sparkles
    this.createSparkles();
  }

  createSparkles() {
    const container = this.shadowRoot.querySelector('#sparkles');
    const sparkleCount = 30;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 3}s`;
      sparkle.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(sparkle);
    }
  }
}

// Register the component
customElements.define('victory-screen', VictoryScreen);
