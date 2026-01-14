import { BaseComponent } from './BaseComponent.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import profileStyles from '../styles/components/ProfileScreen.scss?inline';
import { gameStore, setResetting } from '../store/gameStore.js';
import { LevelingSystem } from '../game/LevelingSystem.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import { AchievementManager } from '../game/AchievementManager.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { RARITY_COLORS, RARITY_NAMES } from '../data/equipment.js';

/**
 * ProfileScreen Web Component
 * Displays player profile, stats, level, progress, and equipment
 *
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class ProfileScreen extends BaseComponent {
  constructor() {
    super();

    // Load data from store instead of SaveManager
    const state = gameStore.getState();
    this.profileData = {
      profile: {
        ...state.player,
        character: state.player.character,
        characterCreated: state.player.characterCreated,
      },
      stats: state.stats,
      equipped: state.equipped,
      inventory: state.inventory,
      story: state.story,
      storyProgress: state.story, // Backward compatibility
    };

    this.currentTab = 'profile'; // 'profile' or 'equipment'
  }

  refreshData() {
    // Reload data from store
    const state = gameStore.getState();
    this.profileData = {
      profile: {
        ...state.player,
        character: state.player.character,
        characterCreated: state.player.characterCreated,
      },
      stats: state.stats,
      equipped: state.equipped,
      inventory: state.inventory,
      story: state.story,
      storyProgress: state.story, // Backward compatibility
    };
  }

  getTotalStars() {
    const completedMissions = this.profileData.storyProgress?.completedMissions || {};
    return Object.values(completedMissions).reduce(
      (sum, mission) => sum + (mission?.stars || 0),
      0
    );
  }

  getTotalAchievements() {
    // Import dynamically to get total count
    return 44; // Total achievements (original 22 + new 22)
  }

  getOverallProgress() {
    // Calculate overall game completion percentage
    const { stats, profile, storyProgress } = this.profileData;

    let totalProgress = 0;
    let maxProgress = 0;

    // Level progress (out of 20)
    totalProgress += profile?.level || 1;
    maxProgress += 20;

    // Story missions (out of 25)
    totalProgress += storyProgress?.completedMissions?.length || 0;
    maxProgress += 25;

    // Achievements (out of total)
    totalProgress += AchievementManager.getUnlockedAchievements().length;
    maxProgress += this.getTotalAchievements();

    // Tournaments (out of 10)
    totalProgress += Math.min(10, stats.tournamentsWon || 0);
    maxProgress += 10;

    return Math.floor((totalProgress / maxProgress) * 100);
  }

  styles() {
    return profileStyles;
  }

  template() {
    const { profile, stats } = this.profileData;

    // Calculate correct level based on actual XP (to handle data mismatches)
    const totalXP = profile.xp || 0;
    const correctLevel = LevelingSystem.getLevelFromXP(totalXP);
    const currentLevel = correctLevel; // Use calculated level instead of stored level

    // Calculate XP in current level and progress
    let xpInCurrentLevel = 0;
    let xpForNext = 0;
    let xpProgress = 0;

    try {
      const xpForCurrentLevel = LevelingSystem.getTotalXPForLevel(currentLevel);
      const xpForNextLevel = LevelingSystem.getTotalXPForLevel(currentLevel + 1);
      const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

      xpInCurrentLevel = Math.max(0, totalXP - xpForCurrentLevel);
      xpForNext = Math.max(0, xpForNextLevel - totalXP);
      xpProgress = xpNeededForLevel > 0 ? (xpInCurrentLevel / xpNeededForLevel) * 100 : 0;

      ConsoleLogger.info(LogCategory.UI, 'XP Debug:', {
        storedLevel: profile.level,
        correctLevel,
        totalXP,
        xpForCurrentLevel,
        xpForNextLevel,
        xpNeededForLevel,
        xpInCurrentLevel,
        xpForNext,
        xpProgress,
      });
    } catch (e) {
      ConsoleLogger.error(LogCategory.UI, 'Error calculating XP:', e);
      xpInCurrentLevel = totalXP;
      xpForNext = 100;
      xpProgress = 0;
    }

    // Clamp progress between 0 and 100
    const progressPercent = Math.max(0, Math.min(100, xpProgress));

    const winRate =
      stats.totalFightsPlayed > 0
        ? ((stats.totalWins / stats.totalFightsPlayed) * 100).toFixed(1)
        : 0;

    return `
      <div class="profile-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="profile-header">
          <h1 class="profile-title">👤 Player Profile</h1>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button class="tab-btn ${this.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">
            👤 Stats
          </button>
          <button class="tab-btn ${this.currentTab === 'equipment' ? 'active' : ''}" data-tab="equipment">
            ⚔️ Equipment
          </button>
        </div>

        <!-- Profile Tab Content -->
        <div class="tab-content ${this.currentTab === 'profile' ? 'active' : ''}" id="profile-tab">
        <div class="profile-grid">
          <!-- Level & XP Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">⬆️</span>
              Level & Experience
            </h2>
            <div class="level-section">
              <div class="level-number">${currentLevel}</div>
              <div class="level-label">Level</div>
              <div class="xp-bar-container">
                <div class="xp-bar-label">
                  <span>${xpInCurrentLevel.toLocaleString()} XP</span>
                  <span>${xpForNext.toLocaleString()} XP to next level</span>
                </div>
                <div class="xp-bar">
                  <div class="xp-bar-fill" style="width: ${progressPercent}%">
                    ${progressPercent.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">⚔️</span>
              Combat Statistics
            </h2>
            <div class="stat-row">
              <span class="stat-label">Total Fights</span>
              <span class="stat-value highlight">${stats.totalFightsPlayed}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Wins</span>
              <span class="stat-value highlight">${stats.totalWins}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Losses</span>
              <span class="stat-value">${stats.totalLosses}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Win Rate</span>
              <span class="stat-value highlight">${winRate}%</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Current Streak</span>
              <span class="stat-value">${stats.winStreak}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Best Streak</span>
              <span class="stat-value">${stats.bestStreak}</span>
            </div>
          </div>

          <!-- Damage Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">💥</span>
              Battle Performance
            </h2>
            <div class="stat-row">
              <span class="stat-label">Total Damage Dealt</span>
              <span class="stat-value highlight">${stats.totalDamageDealt.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Damage Taken</span>
              <span class="stat-value">${stats.totalDamageTaken.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Critical Hits</span>
              <span class="stat-value highlight">${stats.criticalHits}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Skills Used</span>
              <span class="stat-value">${stats.skillsUsed}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Items Used</span>
              <span class="stat-value">${stats.itemsUsed}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Avg Damage/Fight</span>
              <span class="stat-value highlight">
                ${stats.totalFightsPlayed > 0 ? Math.round(stats.totalDamageDealt / stats.totalFightsPlayed).toLocaleString() : 0}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Damage Ratio</span>
              <span class="stat-value ${stats.totalDamageDealt > stats.totalDamageTaken ? 'highlight' : ''}">
                ${stats.totalDamageTaken > 0 ? (stats.totalDamageDealt / stats.totalDamageTaken).toFixed(2) : '∞'}:1
              </span>
            </div>
          </div>

          <!-- Tournament Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">🏆</span>
              Tournament Record
            </h2>
            <div class="stat-row">
              <span class="stat-label">Tournaments Played</span>
              <span class="stat-value">${stats.tournamentsPlayed || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Tournaments Won</span>
              <span class="stat-value highlight">${stats.tournamentsWon || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Win Rate</span>
              <span class="stat-value highlight">
                ${stats.tournamentsPlayed > 0 ? ((stats.tournamentsWon / stats.tournamentsPlayed) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>

          <!-- Story Mode Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">📖</span>
              Story Progress
            </h2>
            <div class="stat-row">
              <span class="stat-label">Campaign Progress</span>
              <span class="stat-value highlight">
                ${Math.floor((Object.keys(this.profileData.storyProgress?.completedMissions || {}).length / 25) * 100)}%
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Missions Completed</span>
              <span class="stat-value highlight">${Object.keys(this.profileData.storyProgress?.completedMissions || {}).length}/25</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Stars Earned</span>
              <span class="stat-value highlight">${this.getTotalStars()}/75</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Bosses Defeated</span>
              <span class="stat-value">${stats.bossesDefeated || 0}/6</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Survival Missions</span>
              <span class="stat-value">${stats.survivalMissionsCompleted || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Perfect Missions (3⭐)</span>
              <span class="stat-value highlight">${stats.perfectMissions || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Speed Runs (≤5 rounds)</span>
              <span class="stat-value">${stats.fastMissions || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Flawless Victories</span>
              <span class="stat-value">${stats.flawlessMissions || 0}</span>
            </div>
          </div>

          <!-- Economy Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">💰</span>
              Economy & Wealth
            </h2>
            <div class="stat-row">
              <span class="stat-label">Current Gold</span>
              <span class="stat-value highlight">${profile.gold?.toLocaleString() || 0} 💰</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Gold Earned</span>
              <span class="stat-value">${stats.totalGoldEarned?.toLocaleString() || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Gold Spent</span>
              <span class="stat-value">${stats.totalGoldSpent?.toLocaleString() || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Net Worth</span>
              <span class="stat-value highlight">
                ${((stats.totalGoldEarned || 0) - (stats.totalGoldSpent || 0)).toLocaleString()}
              </span>
            </div>
          </div>

          <!-- Marketplace Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">🛒</span>
              Marketplace Activity
            </h2>
            <div class="stat-row">
              <span class="stat-label">Items Purchased</span>
              <span class="stat-value highlight">${stats.marketplacePurchases || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Items Sold</span>
              <span class="stat-value">${stats.itemsSold || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Gold from Sales</span>
              <span class="stat-value highlight">${(stats.goldFromSales || 0).toLocaleString()} 💰</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Items Repaired</span>
              <span class="stat-value">${stats.itemsRepaired || 0}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Legendary Purchases</span>
              <span class="stat-value highlight">${stats.legendaryPurchases || 0}</span>
            </div>
          </div>

          <!-- General Info Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">ℹ️</span>
              General Info
            </h2>
            <div class="stat-row">
              <span class="stat-label">Character Name</span>
              <span class="stat-value highlight">${profile.name}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Character Class</span>
              <span class="stat-value">${profile.character?.class || 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Account Created</span>
              <span class="stat-value">${profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Last Played</span>
              <span class="stat-value">${profile.lastPlayedAt ? new Date(profile.lastPlayedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Inventory Space</span>
              <span class="stat-value">${this.profileData.inventory.equipment.length}/20</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Achievements Unlocked</span>
              <span class="stat-value highlight">${AchievementManager.getUnlockedAchievements().length}/${this.getTotalAchievements()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Completion Progress</span>
              <span class="stat-value highlight">${this.getOverallProgress()}%</span>
            </div>
            
            <div class="reset-section">
              <button class="reset-btn" id="reset-progress-btn">🗑️ Reset Progress</button>
            </div>
          </div>
        </div>
        </div>
        <!-- End Profile Tab -->

        <!-- Equipment Tab Content -->
        <div class="tab-content ${this.currentTab === 'equipment' ? 'active' : ''}" id="equipment-tab">
          ${this.renderEquipmentTab()}
        </div>
        <!-- End Equipment Tab -->

      </div>
    `;
  }

  renderEquipmentTab() {
    const equipped = EquipmentManager.getEquippedItems();
    const inventory = EquipmentManager.getInventoryItems();
    const totalStats = EquipmentManager.getEquippedStats();

    return `
      ${
        Object.values(totalStats).some((v) => v > 0)
          ? `
        <div class="profile-card">
          <h2 class="card-title">
            <span class="card-icon">💪</span>
            Total Equipment Bonuses
          </h2>
          ${totalStats.strength > 0 ? `<div class="stat-row"><span class="stat-label">Strength</span><span class="stat-value highlight">+${totalStats.strength}</span></div>` : ''}
          ${totalStats.health > 0 ? `<div class="stat-row"><span class="stat-label">Health</span><span class="stat-value highlight">+${totalStats.health}</span></div>` : ''}
          ${totalStats.defense > 0 ? `<div class="stat-row"><span class="stat-label">Defense</span><span class="stat-value highlight">+${totalStats.defense}</span></div>` : ''}
          ${totalStats.critChance > 0 ? `<div class="stat-row"><span class="stat-label">Crit Chance</span><span class="stat-value highlight">+${totalStats.critChance}%</span></div>` : ''}
          ${totalStats.critDamage > 0 ? `<div class="stat-row"><span class="stat-label">Crit Damage</span><span class="stat-value highlight">+${totalStats.critDamage}%</span></div>` : ''}
          ${totalStats.manaRegen > 0 ? `<div class="stat-row"><span class="stat-label">Mana Regen</span><span class="stat-value highlight">+${totalStats.manaRegen}</span></div>` : ''}
          ${totalStats.movementBonus > 0 ? `<div class="stat-row"><span class="stat-label">⚡ Movement</span><span class="stat-value highlight">+${totalStats.movementBonus}</span></div>` : ''}
        </div>
      `
          : ''
      }

      <div class="character-equipment-layout">
        <div class="equipment-slot-head">
          ${this.renderEquipmentSlot('head', '🪖', equipped.head)}
        </div>
        <div class="equipment-slot-weapon">
          ${this.renderEquipmentSlot('weapon', '⚔️', equipped.weapon)}
        </div>
        <div class="equipment-slot-coat">
          ${this.renderEquipmentSlot('coat', '🧥', equipped.coat)}
        </div>
        <div class="equipment-slot-arms">
          ${this.renderEquipmentSlot('arms', '🥊', equipped.arms)}
        </div>
        <div class="equipment-slot-torso">
          ${this.renderEquipmentSlot('torso', '🛡️', equipped.torso)}
        </div>
        <div class="equipment-slot-trousers">
          ${this.renderEquipmentSlot('trousers', '👖', equipped.trousers)}
        </div>
        <div class="equipment-slot-shoes">
          ${this.renderEquipmentSlot('shoes', '👢', equipped.shoes)}
        </div>
        <div class="equipment-slot-accessory">
          ${this.renderEquipmentSlot('accessory', '💍', equipped.accessory)}
        </div>
      </div>

      <h2 style="font-size: 24px; color: #ffa726; margin: 30px 0 20px 0;">📦 Inventory (${inventory.length}/20)</h2>
      ${
        inventory.length > 0
          ? `
        <div class="profile-grid">
          ${inventory.map((item) => this.renderInventoryItem(item)).join('')}
        </div>
      `
          : `
        <div class="profile-card" style="text-align: center; padding: 60px;">
          <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
          <div style="color: #7e57c2;">No items in inventory</div>
          <div style="color: #7e57c2; font-size: 14px; margin-top: 10px;">Win battles to earn equipment!</div>
        </div>
      `
      }
    `;
  }

  renderEquipmentSlot(slotType, icon, item) {
    // Define slot labels for proper display
    const slotLabels = {
      weapon: 'Weapon',
      head: 'Head',
      torso: 'Torso',
      arms: 'Arms',
      trousers: 'Trousers',
      shoes: 'Shoes',
      coat: 'Coat',
      accessory: 'Accessory',
    };
    const slotLabel = slotLabels[slotType] || slotType.charAt(0).toUpperCase() + slotType.slice(1);

    if (!item) {
      return `
        <div class="profile-card">
          <h2 class="card-title">
            <span class="card-icon">${icon}</span>
            ${slotLabel}
          </h2>
          <div style="text-align: center; padding: 40px 20px; color: #7e57c2; font-style: italic;">
            No ${slotLabel.toLowerCase()} equipped
          </div>
        </div>
      `;
    }

    const statsHtml = Object.entries(item.stats)
      .map(([stat, value]) => {
        const statNames = {
          strength: 'STR',
          health: 'HP',
          defense: 'DEF',
          critChance: 'Crit%',
          critDamage: 'Crit Dmg',
          manaRegen: 'Mana+',
          movementBonus: 'Move',
        };
        return `<span style="background: rgba(255, 167, 38, 0.2); border: 1px solid #ffa726; border-radius: 8px; padding: 4px 10px; font-size: 12px; color: #ffa726; font-weight: 600; display: inline-block; margin: 4px;">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="profile-card" style="border: 2px solid ${RARITY_COLORS[item.rarity]};">
        <h2 class="card-title">
          <span class="card-icon">${icon}</span>
          ${slotLabel}
        </h2>
        <div style="background: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 15px; border: 2px solid ${RARITY_COLORS[item.rarity]};">
          <div style="font-size: 18px; font-weight: 700; color: white; margin-bottom: 5px;">${item.name}</div>
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; color: ${RARITY_COLORS[item.rarity]};">
            ${RARITY_NAMES[item.rarity]}
          </div>
          <div style="margin-top: 10px;">${statsHtml}</div>
          <button class="unequip-btn" data-unequip="${slotType}" style="margin-top: 10px; width: 100%;">Unequip</button>
        </div>
      </div>
    `;
  }

  renderInventoryItem(item) {
    const state = gameStore.getState();
    const playerLevel = state.player.level;
    const playerClass = state.player.class;

    const meetsLevel = item.requirements.level <= playerLevel;
    const meetsClass = !item.requirements.class || item.requirements.class.includes(playerClass);
    const canEquip = meetsLevel && meetsClass;

    // Slot type icons and labels
    const slotInfo = {
      weapon: { icon: '⚔️', label: 'Weapon' },
      head: { icon: '🪖', label: 'Head' },
      torso: { icon: '🛡️', label: 'Torso' },
      arms: { icon: '🥊', label: 'Arms' },
      trousers: { icon: '👖', label: 'Trousers' },
      shoes: { icon: '👢', label: 'Shoes' },
      coat: { icon: '🧥', label: 'Coat' },
      accessory: { icon: '💍', label: 'Accessory' },
    };
    const slot = slotInfo[item.type] || { icon: '📦', label: item.type };

    const statsHtml = Object.entries(item.stats)
      .map(([stat, value]) => {
        const statNames = {
          strength: 'STR',
          health: 'HP',
          defense: 'DEF',
          critChance: 'Crit%',
          critDamage: 'Crit Dmg',
          manaRegen: 'Mana+',
          movementBonus: 'Move',
        };
        return `<span style="background: rgba(255, 167, 38, 0.2); border: 1px solid #ffa726; border-radius: 8px; padding: 4px 10px; font-size: 12px; color: #ffa726; font-weight: 600; display: inline-block; margin: 4px;">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="profile-card" style="border: 2px solid ${RARITY_COLORS[item.rarity]}; cursor: pointer;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-size: 18px; font-weight: 700; color: white;">${item.name}</div>
            <div style="color: #90caf9; font-size: 13px; font-weight: 600; margin: 5px 0;">
              ${slot.icon} ${slot.label}
            </div>
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: ${RARITY_COLORS[item.rarity]};">
              ${RARITY_NAMES[item.rarity]}
            </div>
          </div>
          <div style="font-size: 48px;">${item.icon}</div>
        </div>
        <div style="color: #b39ddb; font-size: 13px; margin: 10px 0; line-height: 1.4;">${item.description}</div>
        <div style="margin: 10px 0;">${statsHtml}</div>
        <div style="font-size: 12px; margin-bottom: 10px;">
          <div style="color: ${meetsLevel ? '#00e676' : '#ff1744'};">
            Level ${item.requirements.level} ${meetsLevel ? '✓' : '✗'}
          </div>
          ${
            item.requirements.class
              ? `
            <div style="color: ${meetsClass ? '#00e676' : '#ff1744'};">
              ${item.requirements.class.join(', ')} ${meetsClass ? '✓' : '✗'}
            </div>
          `
              : ''
          }
        </div>
        <button class="equip-btn" data-equip="${item.id}" ${!canEquip ? 'disabled' : ''} style="width: 100%;">
          Equip
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    // Tab switching
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.dataset.tab;
        this.updateTabUI();
      });
    });

    // Reset progress button
    const resetBtn = this.shadowRoot.querySelector('#reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('⚠️ Are you sure you want to reset ALL progress? This cannot be undone!')) {
          if (
            confirm(
              'This will delete your level, XP, stats, and equipment. Are you ABSOLUTELY sure?'
            )
          ) {
            // Set resetting flag to prevent beforeunload save
            setResetting(true);

            // Delete save and all backups
            SaveManager.deleteSave();

            // Clear entire localStorage (removes any remaining data)
            localStorage.clear();

            alert('✅ Progress reset! Reloading page...');
            window.location.href = window.location.href.split('#')[0];
          }
        }
      });
    }

    // Equipment actions
    const unequipBtns = this.shadowRoot.querySelectorAll('[data-unequip]');
    unequipBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slot = btn.dataset.unequip;
        if (slot && slot !== '') {
          // Check if it's not the reset button
          EquipmentManager.unequipItem(slot);
          this.refreshData();
          this.render();
        }
      });
    });

    const equipBtns = this.shadowRoot.querySelectorAll('[data-equip]');
    equipBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const equipmentId = btn.dataset.equip;
        if (EquipmentManager.equipItem(equipmentId)) {
          this.refreshData();
          this.render();
        }
      });
    });
  }

  updateTabUI() {
    // Update tab buttons
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      if (btn.dataset.tab === this.currentTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update tab content
    const tabContents = this.shadowRoot.querySelectorAll('.tab-content');
    tabContents.forEach((content) => {
      if (content.id === `${this.currentTab}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
}

customElements.define('profile-screen', ProfileScreen);
