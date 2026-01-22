import { BaseComponent } from './BaseComponent.js';
import campaignStyles from '../styles/components/CampaignMap.scss?inline';
import { StoryMode } from '../game/StoryMode.js';
import { gameStore } from '../store/gameStore.js';

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
    return campaignStyles;
  }

  template() {
    const state = gameStore.getState();
    const currentPath = state.player.storyPath;
    const completedMissions = Object.keys(state.story.completedMissions || {}).length;
    const totalStars = StoryMode.getTotalStars();
    const selectedAct = this.selectedRegion || 1; // Use selectedRegion as selectedAct

    if (!currentPath) {
      return `
        <div class="overlay"></div>
        <div class="campaign-container">
          <div class="header">
            <h1 class="title">📖 Campaign</h1>
            <button class="close-btn" id="close-btn">✕ Close</button>
          </div>
          <div class="empty-state">
            <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
            <div style="font-size: 24px; margin-bottom: 10px;">No Story Path Selected</div>
            <div style="font-size: 16px;">Please select a story path first</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="overlay"></div>
      <div class="campaign-container">
        <div class="header">
          <div>
            <h1 class="title">${this.getPathIcon(currentPath)} ${this.getPathName(currentPath)}</h1>
            <div class="progress-info">
              Missions: ${completedMissions} | Stars: ${totalStars.earned}/${totalStars.total}
            </div>
          </div>
          <button class="close-btn" id="close-btn">✕ Close</button>
        </div>

        <div class="content">
          <div class="regions-list">
            ${this.renderPathProgress(currentPath, state)}
            ${this.renderActButtons()}
          </div>

          <div class="missions-area" id="missions-area">
            ${this.renderMissionsForAct(selectedAct, state)}
          </div>
        </div>
      </div>
    `;
  }

  renderPathProgress(pathId, state) {
    const progress = state.story.pathProgress;

    switch (pathId) {
      case 'slave_gladiator':
        return `
          <div class="path-progress">
            <div class="progress-label">Freedom Meter</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress.freedomMeter || 0}%"></div>
            </div>
            <div class="progress-text">${progress.freedomMeter || 0}/100</div>
          </div>
        `;
      case 'roman_legionnaire':
        return `
          <div class="path-progress">
            <div class="progress-label">⚔️ Rank: ${this.getRankName(progress.currentRank)}</div>
            <div class="progress-label">🗺️ Territories: ${(progress.controlledTerritories || []).length}</div>
          </div>
        `;
      case 'lanista':
        return `
          <div class="path-progress">
            <div class="progress-label">⚔️ Gladiators: ${(progress.gladiatorRoster || []).length}</div>
            <div class="progress-label">⭐ Reputation: ${progress.reputation || 0}/100</div>
          </div>
        `;
      case 'barbarian_traveller':
        return `
          <div class="path-progress">
            <div class="progress-label">🗺️ Locations: ${(progress.discoveredLocations || []).length}/8</div>
            <div class="progress-label">🤝 Alliances: ${(progress.alliancesMade || []).length}/4</div>
          </div>
        `;
      case 'desert_nomad':
        return `
          <div class="path-progress">
            <div class="progress-label">💧 Water: ${progress.waterCurrent || 100}/100</div>
            <div class="progress-label">🏝️ Oases: ${(progress.oasesDiscovered || []).length}/6</div>
          </div>
        `;
      default:
        return '';
    }
  }

  renderActButtons() {
    const selectedAct = this.selectedRegion || 1;
    return `
      <div class="act-buttons">
        ${[1, 2, 3]
          .map(
            (act) => `
          <div class="region-card ${selectedAct === act ? 'active' : ''}" data-act="${act}">
            <div class="region-icon">${act === 1 ? '📖' : act === 2 ? '⚔️' : '👑'}</div>
            <div class="region-name">Act ${act}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  renderMissionsForAct(act, state) {
    const missions = StoryMode.getMissionsByAct(act);

    if (missions.length === 0) {
      return `
        <div class="empty-state">
          <div style="font-size: 48px; margin-bottom: 20px;">📖</div>
          <div style="font-size: 20px;">No missions in Act ${act}</div>
        </div>
      `;
    }

    return `
      <div class="missions-grid">
        ${missions.map((mission) => this.renderMission(mission, state)).join('')}
      </div>
    `;
  }

  renderMission(mission, _state) {
    const completed = StoryMode.isMissionCompleted(mission.id);
    const stars = StoryMode.getMissionStars(mission.id);

    let difficultyClass = 'easy';
    if (mission.difficulty > 11) difficultyClass = 'extreme';
    else if (mission.difficulty > 7) difficultyClass = 'hard';
    else if (mission.difficulty > 3) difficultyClass = 'normal';

    const typeIcons = { standard: '⚔️', survival: '🛡️', boss: '👑' };

    return `
      <div class="mission-card ${completed ? 'completed' : ''}" data-mission="${mission.id}">
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

  getPathIcon(pathId) {
    const icons = {
      slave_gladiator: '⛓️',
      roman_legionnaire: '🏛️',
      lanista: '🎭',
      barbarian_traveller: '🗡️',
      desert_nomad: '🏜️',
    };
    return icons[pathId] || '📖';
  }

  getPathName(pathId) {
    const names = {
      slave_gladiator: 'Slave Gladiator',
      roman_legionnaire: 'Roman Legionnaire',
      lanista: 'Lanista',
      barbarian_traveller: 'Barbarian Traveller',
      desert_nomad: 'Desert Nomad',
    };
    return names[pathId] || 'Story Campaign';
  }

  getRankName(rank) {
    const ranks = {
      legionnaire: 'Legionnaire',
      optio: 'Optio',
      centurion: 'Centurion',
      primus_pilus: 'Primus Pilus',
      prefect: 'Prefect',
      general: 'General',
    };
    return ranks[rank] || 'Legionnaire';
  }

  attachEventListeners() {
    // Close button
    this.shadowRoot.querySelector('#close-btn').addEventListener('click', () => {
      this.emit('close');
    });

    // Act selection (using region-card class for styling compatibility)
    this.shadowRoot.querySelectorAll('[data-act]').forEach((card) => {
      card.addEventListener('click', () => {
        const act = parseInt(card.dataset.act);
        this.selectedRegion = act; // Reuse selectedRegion as selectedAct
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
