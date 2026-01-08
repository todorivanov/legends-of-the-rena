import { BaseComponent } from './BaseComponent.js';
import { getMissionById } from '../data/storyMissions.js';

/**
 * MissionBriefing Web Component
 * Shows mission details, objectives, and dialogue before starting
 * 
 * Events:
 * - start-mission: User confirmed mission start
 * - cancel: User cancelled
 */
export class MissionBriefing extends BaseComponent {
  constructor() {
    super();
    this.missionId = null;
  }

  set mission(id) {
    this.missionId = id;
    this.render();
  }

  styles() {
    return `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
      }

      .briefing-container {
        position: relative;
        width: 90%;
        max-width: 800px;
        max-height: 85vh;
        background: linear-gradient(135deg, #1a0d2e 0%, #2d1b69 50%, #1a0d2e 100%);
        border-radius: 20px;
        border: 3px solid rgba(255, 167, 38, 0.6);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
        animation: slideIn 0.4s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .header {
        padding: 30px;
        background: linear-gradient(135deg, rgba(255, 167, 38, 0.2), rgba(106, 66, 194, 0.3));
        border-bottom: 2px solid rgba(255, 167, 38, 0.5);
        text-align: center;
      }

      .mission-type {
        font-size: 48px;
        margin-bottom: 10px;
      }

      .mission-name {
        font-size: 32px;
        font-weight: 900;
        color: #ffa726;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .mission-difficulty {
        display: inline-block;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 700;
        border-radius: 8px;
        text-transform: uppercase;
      }

      .difficulty-easy { background: rgba(76, 175, 80, 0.4); color: #66bb6a; }
      .difficulty-normal { background: rgba(33, 150, 243, 0.4); color: #42a5f5; }
      .difficulty-hard { background: rgba(255, 152, 0, 0.4); color: #ffa726; }
      .difficulty-extreme { background: rgba(244, 67, 54, 0.4); color: #ef5350; }

      .content {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
      }

      .dialogue-box {
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.2), rgba(42, 26, 71, 0.4));
        border-left: 4px solid #b39ddb;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 25px;
        font-style: italic;
        color: #e1bee7;
        font-size: 16px;
        line-height: 1.6;
      }

      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #ffa726;
        margin: 25px 0 15px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .description {
        font-size: 16px;
        color: #b39ddb;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .objectives-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .objective-item {
        background: rgba(106, 66, 194, 0.2);
        border-left: 3px solid rgba(106, 66, 194, 0.5);
        padding: 12px 15px;
        margin-bottom: 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .objective-item.required {
        border-left-color: #ef5350;
      }

      .objective-item.star {
        border-left-color: #ffc107;
      }

      .objective-icon {
        font-size: 20px;
      }

      .objective-text {
        flex: 1;
        color: white;
        font-size: 14px;
      }

      .rewards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }

      .reward-item {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.3));
        border: 2px solid rgba(76, 175, 80, 0.4);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
      }

      .reward-icon {
        font-size: 32px;
        margin-bottom: 5px;
      }

      .reward-value {
        font-size: 18px;
        font-weight: 700;
        color: #66bb6a;
      }

      .reward-label {
        font-size: 12px;
        color: #a5d6a7;
      }

      .actions {
        padding: 20px 30px;
        background: rgba(0, 0, 0, 0.3);
        border-top: 2px solid rgba(106, 66, 194, 0.3);
        display: flex;
        gap: 15px;
        justify-content: center;
      }

      .action-btn {
        flex: 1;
        max-width: 200px;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: 700;
        color: white;
        border: 2px solid;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .start-btn {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(56, 142, 60, 0.6));
        border-color: #4caf50;
      }

      .start-btn:hover {
        background: linear-gradient(135deg, #4caf50, #388e3c);
        transform: scale(1.05);
      }

      .cancel-btn {
        background: linear-gradient(135deg, rgba(158, 158, 158, 0.4), rgba(97, 97, 97, 0.6));
        border-color: #9e9e9e;
      }

      .cancel-btn:hover {
        background: linear-gradient(135deg, #9e9e9e, #616161);
        transform: scale(1.05);
      }
    `;
  }

  template() {
    if (!this.missionId) return '<div>Loading...</div>';
    
    const mission = getMissionById(this.missionId);
    if (!mission) return '<div>Mission not found</div>';

    let difficultyClass = 'easy';
    if (mission.difficulty > 7) difficultyClass = 'hard';
    else if (mission.difficulty > 11) difficultyClass = 'extreme';
    else if (mission.difficulty > 3) difficultyClass = 'normal';

    const typeIcons = { standard: '⚔️', survival: '🛡️', boss: '👑' };

    return `
      <div class="overlay"></div>
      <div class="briefing-container">
        <div class="header">
          <div class="mission-type">${typeIcons[mission.type]}</div>
          <h1 class="mission-name">${mission.name}</h1>
          <div class="mission-difficulty difficulty-${difficultyClass}">
            Difficulty: ${mission.difficulty}
          </div>
        </div>

        <div class="content">
          ${mission.dialogue?.before ? `
            <div class="dialogue-box">
              ${mission.dialogue.before}
            </div>
          ` : ''}

          <div class="description">${mission.description}</div>

          <div class="section-title">📋 Objectives</div>
          <ul class="objectives-list">
            ${mission.objectives.map(obj => `
              <li class="objective-item ${obj.required ? 'required' : ''} ${obj.star ? 'star' : ''}">
                <span class="objective-icon">${obj.required ? '❗' : '⭐'}</span>
                <span class="objective-text">${obj.description}</span>
              </li>
            `).join('')}
          </ul>

          <div class="section-title">🎁 Rewards</div>
          <div class="rewards-grid">
            ${mission.rewards.gold ? `
              <div class="reward-item">
                <div class="reward-icon">💰</div>
                <div class="reward-value">${mission.rewards.gold}</div>
                <div class="reward-label">Gold</div>
              </div>
            ` : ''}
            ${mission.rewards.xp ? `
              <div class="reward-item">
                <div class="reward-icon">✨</div>
                <div class="reward-value">${mission.rewards.xp}</div>
                <div class="reward-label">XP</div>
              </div>
            ` : ''}
            ${mission.rewards.equipment && mission.rewards.equipment.length > 0 ? `
              <div class="reward-item">
                <div class="reward-icon">🎁</div>
                <div class="reward-value">${mission.rewards.equipment.length}</div>
                <div class="reward-label">Equipment</div>
              </div>
            ` : ''}
          </div>

          ${mission.type === 'boss' ? `
            <div style="background: rgba(244, 67, 54, 0.2); border: 2px solid rgba(244, 67, 54, 0.4); border-radius: 10px; padding: 15px; text-align: center; color: #ef5350; font-weight: 700;">
              ⚠️ BOSS BATTLE - Extreme Challenge Ahead!
            </div>
          ` : ''}

          ${mission.type === 'survival' ? `
            <div style="background: rgba(255, 152, 0, 0.2); border: 2px solid rgba(255, 152, 0, 0.4); border-radius: 10px; padding: 15px; text-align: center; color: #ffa726; font-weight: 700;">
              🛡️ SURVIVAL MODE - Face ${mission.waves ? mission.waves.length : 3} Waves
            </div>
          ` : ''}
        </div>

        <div class="actions">
          <button class="action-btn cancel-btn" id="cancel-btn">Cancel</button>
          <button class="action-btn start-btn" id="start-btn">Start Mission</button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Start button
    this.shadowRoot.querySelector('#start-btn').addEventListener('click', () => {
      this.emit('start-mission', { missionId: this.missionId });
    });

    // Cancel button
    this.shadowRoot.querySelector('#cancel-btn').addEventListener('click', () => {
      this.emit('cancel');
    });

    // Overlay click
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => {
      this.emit('cancel');
    });
  }
}

customElements.define('mission-briefing', MissionBriefing);
