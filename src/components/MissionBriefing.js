import { BaseComponent } from './BaseComponent.js';
import briefingStyles from '../styles/components/MissionBriefing.scss?inline';
import { StoryMode } from '../game/StoryMode.js';

// Helper to get mission by ID from current path
function getMissionById(missionId) {
  // Use StoryMode's path-aware getMissionById
  const allMissions = StoryMode.getAvailablePathMissions();
  const mission = allMissions.find((m) => m.id === missionId);
  if (mission) return mission;

  // Also check completed missions
  const completedMissions = [1, 2, 3].flatMap((act) => StoryMode.getMissionsByAct(act));
  return completedMissions.find((m) => m.id === missionId);
}

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
    return briefingStyles;
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
          ${
            mission.dialogue?.before
              ? `
            <div class="dialogue-box">
              ${mission.dialogue.before}
            </div>
          `
              : ''
          }

          <div class="description">${mission.description}</div>

          <div class="section-title">📋 Objectives</div>
          <ul class="objectives-list">
            ${mission.objectives
              .map(
                (obj) => `
              <li class="objective-item ${obj.required ? 'required' : ''} ${obj.star ? 'star' : ''}">
                <span class="objective-icon">${obj.required ? '❗' : '⭐'}</span>
                <span class="objective-text">${obj.description}</span>
              </li>
            `
              )
              .join('')}
          </ul>

          <div class="section-title">🎁 Rewards</div>
          <div class="rewards-grid">
            ${
              mission.rewards.gold
                ? `
              <div class="reward-item">
                <div class="reward-icon">💰</div>
                <div class="reward-value">${mission.rewards.gold}</div>
                <div class="reward-label">Gold</div>
              </div>
            `
                : ''
            }
            ${
              mission.rewards.xp
                ? `
              <div class="reward-item">
                <div class="reward-icon">✨</div>
                <div class="reward-value">${mission.rewards.xp}</div>
                <div class="reward-label">XP</div>
              </div>
            `
                : ''
            }
            ${
              mission.rewards.equipment && mission.rewards.equipment.length > 0
                ? `
              <div class="reward-item">
                <div class="reward-icon">🎁</div>
                <div class="reward-value">${mission.rewards.equipment.length}</div>
                <div class="reward-label">Equipment</div>
              </div>
            `
                : ''
            }
          </div>

          ${
            mission.type === 'boss'
              ? `
            <div style="background: rgba(244, 67, 54, 0.2); border: 2px solid rgba(244, 67, 54, 0.4); border-radius: 10px; padding: 15px; text-align: center; color: #ef5350; font-weight: 700;">
              ⚠️ BOSS BATTLE - Extreme Challenge Ahead!
            </div>
          `
              : ''
          }

          ${
            mission.type === 'survival'
              ? `
            <div style="background: rgba(255, 152, 0, 0.2); border: 2px solid rgba(255, 152, 0, 0.4); border-radius: 10px; padding: 15px; text-align: center; color: #ffa726; font-weight: 700;">
              🛡️ SURVIVAL MODE - Face ${mission.waves ? mission.waves.length : 3} Waves
            </div>
          `
              : ''
          }
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
