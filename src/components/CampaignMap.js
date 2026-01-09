import { BaseComponent } from './BaseComponent.js';
import {
  STORY_REGIONS,
  getRegionsInOrder,
  isRegionUnlocked,
  getRegionCompletion,
} from '../data/storyRegions.js';
import { getMissionsByRegion, getMissionById } from '../data/storyMissions.js';
import { StoryMode } from '../game/StoryMode.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';

/**
 * CampaignMap Web Component
 * Displays story regions and missions with progression
 *
 * Events:
 * - mission-selected: { missionId } - User selected a mission
 * - close: User wants to exit campaign map
 */
export class CampaignMap extends BaseComponent {
  constructor() {
    super();
    this.selectedRegion = null;
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

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
      }

      .campaign-container {
        position: relative;
        width: 90%;
        max-width: 1400px;
        height: 85vh;
        max-height: 900px;
        margin: 7.5vh auto 0;
        background: linear-gradient(135deg, #1a0d2e 0%, #2d1b69 50%, #1a0d2e 100%);
        border-radius: 20px;
        border: 2px solid rgba(106, 66, 194, 0.5);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .header {
        padding: 25px 30px;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.3), rgba(42, 26, 71, 0.5));
        border-bottom: 2px solid rgba(106, 66, 194, 0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .title {
        font-size: 32px;
        font-weight: 900;
        color: #ffa726;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .progress-info {
        font-size: 16px;
        color: #b39ddb;
      }

      .close-btn {
        padding: 12px 24px;
        font-size: 18px;
        font-weight: 700;
        color: white;
        background: rgba(244, 67, 54, 0.3);
        border: 2px solid rgba(244, 67, 54, 0.5);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .close-btn:hover {
        background: rgba(244, 67, 54, 0.5);
      }

      .content {
        flex: 1;
        display: flex;
        overflow: hidden;
      }

      .regions-list {
        width: 300px;
        padding: 20px;
        border-right: 2px solid rgba(106, 66, 194, 0.3);
        overflow-y: auto;
      }

      .region-card {
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.2), rgba(42, 26, 71, 0.3));
        border: 2px solid rgba(106, 66, 194, 0.3);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .region-card:hover {
        transform: translateX(5px);
        border-color: #ffa726;
      }

      .region-card.active {
        border-color: #ffa726;
        background: linear-gradient(135deg, rgba(255, 167, 38, 0.2), rgba(106, 66, 194, 0.3));
      }

      .region-card.locked {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .region-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .region-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        margin-bottom: 5px;
      }

      .region-completion {
        font-size: 13px;
        color: #4caf50;
      }

      .missions-area {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
      }

      .missions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .mission-card {
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.2), rgba(42, 26, 71, 0.3));
        border: 2px solid rgba(106, 66, 194, 0.3);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .mission-card:hover {
        transform: translateY(-5px);
        border-color: #ffa726;
        box-shadow: 0 8px 20px rgba(255, 167, 38, 0.3);
      }

      .mission-card.completed {
        border-color: #4caf50;
      }

      .mission-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 10px;
      }

      .mission-type {
        font-size: 24px;
      }

      .mission-stars {
        font-size: 16px;
      }

      .mission-name {
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
      }

      .mission-description {
        font-size: 14px;
        color: #b39ddb;
        margin-bottom: 10px;
        min-height: 40px;
      }

      .mission-difficulty {
        display: inline-block;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 700;
        border-radius: 6px;
        margin-bottom: 10px;
      }

      .difficulty-easy { background: rgba(76, 175, 80, 0.3); color: #66bb6a; }
      .difficulty-normal { background: rgba(33, 150, 243, 0.3); color: #42a5f5; }
      .difficulty-hard { background: rgba(255, 152, 0, 0.3); color: #ffa726; }
      .difficulty-extreme { background: rgba(244, 67, 54, 0.3); color: #ef5350; }

      .mission-rewards {
        font-size: 13px;
        color: #ffc107;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(106, 66, 194, 0.3);
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #b39ddb;
      }

      @media (max-width: 768px) {
        .content {
          flex-direction: column;
        }
        .regions-list {
          width: 100%;
          border-right: none;
          border-bottom: 2px solid rgba(106, 66, 194, 0.3);
        }
      }
    `;
  }

  template() {
    const storyProgress = SaveManager.get('storyProgress') || SaveManager.get('story') || {};
    const regions = getRegionsInOrder();
    const completedMissions = storyProgress.completedMissions?.length || 0;
    const totalStars = StoryMode.getTotalStars();

    return `
      <div class="overlay"></div>
      <div class="campaign-container">
        <div class="header">
          <div>
            <h1 class="title">📖 Campaign</h1>
            <div class="progress-info">
              Missions: ${completedMissions}/25 | Stars: ${totalStars.earned}/${totalStars.total}
            </div>
          </div>
          <button class="close-btn" id="close-btn">✕ Close</button>
        </div>

        <div class="content">
          <div class="regions-list">
            ${regions.map((regionId) => this.renderRegion(regionId, storyProgress)).join('')}
          </div>

          <div class="missions-area" id="missions-area">
            ${this.selectedRegion ? this.renderMissions(this.selectedRegion, storyProgress) : this.renderWelcome()}
          </div>
        </div>
      </div>
    `;
  }

  renderRegion(regionId, storyProgress) {
    const region = STORY_REGIONS[regionId];
    const unlocked = isRegionUnlocked(regionId, storyProgress);
    const completion = getRegionCompletion(regionId, storyProgress);
    const isActive = this.selectedRegion === regionId;

    return `
      <div 
        class="region-card ${isActive ? 'active' : ''} ${!unlocked ? 'locked' : ''}" 
        data-region="${regionId}"
        ${!unlocked ? 'style="pointer-events: none;"' : ''}
      >
        <div class="region-icon">${region.icon}${!unlocked ? '🔒' : ''}</div>
        <div class="region-name">${region.name}</div>
        <div class="region-completion">${completion}% Complete</div>
      </div>
    `;
  }

  renderMissions(regionId, storyProgress) {
    const missions = getMissionsByRegion(regionId);

    if (missions.length === 0) {
      return `
        <div class="empty-state">
          <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
          <div style="font-size: 20px;">Region Complete!</div>
        </div>
      `;
    }

    return `
      <div class="missions-grid">
        ${missions.map((missionId) => this.renderMission(missionId, storyProgress)).join('')}
      </div>
    `;
  }

  renderMission(missionId, _storyProgress) {
    const mission = getMissionById(missionId);
    const completed = StoryMode.isMissionCompleted(missionId);
    const stars = StoryMode.getMissionStars(missionId);

    let difficultyClass = 'easy';
    if (mission.difficulty > 7) difficultyClass = 'hard';
    else if (mission.difficulty > 11) difficultyClass = 'extreme';
    else if (mission.difficulty > 3) difficultyClass = 'normal';

    const typeIcons = { standard: '⚔️', survival: '🛡️', boss: '👑' };

    return `
      <div class="mission-card ${completed ? 'completed' : ''}" data-mission="${missionId}">
        <div class="mission-header">
          <div class="mission-type">${typeIcons[mission.type]}</div>
          <div class="mission-stars">
            ${completed ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆'}
          </div>
        </div>
        <div class="mission-name">${mission.name}</div>
        <div class="mission-description">${mission.description}</div>
        <div class="mission-difficulty difficulty-${difficultyClass}">
          Difficulty: ${mission.difficulty}
        </div>
        <div class="mission-rewards">
          💰 ${mission.rewards.gold} Gold | ✨ ${mission.rewards.xp} XP
        </div>
      </div>
    `;
  }

  renderWelcome() {
    return `
      <div class="empty-state">
        <div style="font-size: 64px; margin-bottom: 20px;">🗺️</div>
        <div style="font-size: 24px; margin-bottom: 10px;">Welcome to the Campaign</div>
        <div style="font-size: 16px;">Select a region to view missions</div>
      </div>
    `;
  }

  attachEventListeners() {
    // Close button
    this.shadowRoot.querySelector('#close-btn').addEventListener('click', () => {
      this.emit('close');
    });

    // Region selection
    this.shadowRoot.querySelectorAll('.region-card').forEach((card) => {
      card.addEventListener('click', () => {
        const regionId = card.dataset.region;
        this.selectedRegion = regionId;
        this.render();
      });
    });

    // Mission selection
    this.shadowRoot.querySelectorAll('.mission-card').forEach((card) => {
      card.addEventListener('click', () => {
        const missionId = card.dataset.mission;
        this.emit('mission-selected', { missionId });
      });
    });

    // Close on overlay
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => {
      this.emit('close');
    });
  }
}

customElements.define('campaign-map', CampaignMap);
