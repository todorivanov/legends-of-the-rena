import { BaseComponent } from './BaseComponent.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { LevelingSystem } from '../game/LevelingSystem.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import { AchievementManager } from '../game/AchievementManager.js';
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
    this.profileData = SaveManager.load();

    // Ensure storyProgress exists for backward compatibility
    if (!this.profileData.storyProgress && this.profileData.story) {
      this.profileData.storyProgress = this.profileData.story;
    }

    this.currentTab = 'profile'; // 'profile' or 'equipment'
  }

  getTotalStars() {
    const missionStars = this.profileData.storyProgress?.missionStars || {};
    return Object.values(missionStars).reduce((sum, stars) => sum + stars, 0);
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
    return `
      @import url('./styles/theme.css'); /* Import global theme */

      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        overflow-y: auto;
      }

      .profile-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      .profile-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .profile-title {
        font-family: 'Orbitron', monospace;
        font-size: 48px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
      }

      .back-btn {
        position: fixed;
        top: 30px;
        left: 30px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: rgba(42, 26, 71, 0.7);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        z-index: 100;
      }

      .back-btn:hover {
        background: rgba(255, 23, 68, 0.7);
        border-color: #ff1744;
        box-shadow: 0 0 20px rgba(255, 23, 68, 0.5);
      }

      .tab-navigation {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 40px;
        animation: fadeIn 0.6s ease;
      }

      .tab-btn {
        padding: 15px 40px;
        font-size: 18px;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 200px;
      }

      .tab-btn:hover {
        border-color: #ffa726;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 167, 38, 0.3);
      }

      .tab-btn.active {
        background: linear-gradient(135deg, rgba(255, 167, 38, 0.3), rgba(255, 111, 0, 0.3));
        border-color: #ffa726;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.4);
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
        animation: fadeIn 0.4s ease;
      }

      .profile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 25px;
        animation: fadeInUp 0.8s ease;
      }

      @media (min-width: 1400px) {
        .profile-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .profile-grid {
          grid-template-columns: 1fr;
        }
      }

      .profile-card {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
      }

      .profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      }

      .card-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffa726;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .card-icon {
        font-size: 32px;
      }

      .level-section {
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.3), rgba(255, 167, 38, 0.3));
        border-radius: 12px;
        margin-bottom: 20px;
      }

      .level-number {
        font-size: 64px;
        font-weight: 900;
        color: gold;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        line-height: 1;
        margin-bottom: 10px;
      }

      .level-label {
        font-size: 18px;
        color: #b39ddb;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .xp-bar-container {
        margin-top: 15px;
      }

      .xp-bar-label {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #b39ddb;
        margin-bottom: 8px;
      }

      .xp-bar {
        width: 100%;
        height: 30px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        overflow: hidden;
        border: 2px solid rgba(255, 215, 0, 0.3);
      }

      .xp-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffa726, #ffd600);
        border-radius: 15px;
        transition: width 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #1a0d2e;
        font-size: 14px;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
      }

      .stat-row:last-child {
        border-bottom: none;
      }

      .stat-label {
        font-weight: 600;
        color: #b39ddb;
      }

      .stat-value {
        font-weight: 700;
        color: #ffa726;
      }

      .stat-value.highlight {
        color: #00e676;
      }

      .reset-section {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
      }

      .reset-btn {
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        background: rgba(255, 23, 68, 0.3);
        border: 2px solid rgba(255, 23, 68, 0.5);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .reset-btn:hover {
        background: rgba(255, 23, 68, 0.5);
        box-shadow: 0 0 15px rgba(255, 23, 68, 0.6);
      }

      .equip-btn, .unequip-btn {
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
      }

      .equip-btn {
        background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
      }

      .equip-btn:hover:not(:disabled) {
        box-shadow: 0 0 15px rgba(0, 230, 118, 0.6);
        transform: translateY(-2px);
      }

      .equip-btn:disabled {
        background: rgba(0, 0, 0, 0.3);
        opacity: 0.5;
        cursor: not-allowed;
      }

      .unequip-btn {
        background: linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%);
      }

      .unequip-btn:hover {
        box-shadow: 0 0 15px rgba(255, 111, 0, 0.6);
        transform: translateY(-2px);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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
    `;
  }

  template() {
    const { profile, stats } = this.profileData;
    const xpProgress = LevelingSystem.getXPProgress();
    const xpForNext = LevelingSystem.getXPForNextLevel();
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
              <div class="level-number">${profile.level}</div>
              <div class="level-label">Level</div>
              <div class="xp-bar-container">
                <div class="xp-bar-label">
                  <span>${profile.xp.toLocaleString()} XP</span>
                  <span>${xpForNext.toLocaleString()} XP to next level</span>
                </div>
                <div class="xp-bar">
                  <div class="xp-bar-fill" style="width: ${xpProgress}%">
                    ${xpProgress.toFixed(0)}%
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
                ${Math.floor(((this.profileData.storyProgress?.completedMissions?.length || 0) / 25) * 100)}%
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Missions Completed</span>
              <span class="stat-value highlight">${this.profileData.storyProgress?.completedMissions?.length || 0}/25</span>
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
              <span class="stat-value">${new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Last Played</span>
              <span class="stat-value">${new Date(profile.lastPlayedAt).toLocaleDateString()}</span>
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
              <button class="reset-btn">🗑️ Reset Progress</button>
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
        </div>
      `
          : ''
      }

      <div class="profile-grid">
        ${this.renderEquipmentSlot('weapon', '⚔️', equipped.weapon)}
        ${this.renderEquipmentSlot('armor', '🛡️', equipped.armor)}
        ${this.renderEquipmentSlot('accessory', '💍', equipped.accessory)}
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
    if (!item) {
      return `
        <div class="profile-card">
          <h2 class="card-title">
            <span class="card-icon">${icon}</span>
            ${slotType.charAt(0).toUpperCase() + slotType.slice(1)}
          </h2>
          <div style="text-align: center; padding: 40px 20px; color: #7e57c2; font-style: italic;">
            No ${slotType} equipped
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
        };
        return `<span style="background: rgba(255, 167, 38, 0.2); border: 1px solid #ffa726; border-radius: 8px; padding: 4px 10px; font-size: 12px; color: #ffa726; font-weight: 600; display: inline-block; margin: 4px;">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="profile-card" style="border: 2px solid ${RARITY_COLORS[item.rarity]};">
        <h2 class="card-title">
          <span class="card-icon">${icon}</span>
          ${slotType.charAt(0).toUpperCase() + slotType.slice(1)}
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
    const playerLevel = SaveManager.get('profile.level');
    const playerClass = SaveManager.get('profile.character.class');

    const meetsLevel = item.requirements.level <= playerLevel;
    const meetsClass = !item.requirements.class || item.requirements.class.includes(playerClass);
    const canEquip = meetsLevel && meetsClass;

    const statsHtml = Object.entries(item.stats)
      .map(([stat, value]) => {
        const statNames = {
          strength: 'STR',
          health: 'HP',
          defense: 'DEF',
          critChance: 'Crit%',
          critDamage: 'Crit Dmg',
          manaRegen: 'Mana+',
        };
        return `<span style="background: rgba(255, 167, 38, 0.2); border: 1px solid #ffa726; border-radius: 8px; padding: 4px 10px; font-size: 12px; color: #ffa726; font-weight: 600; display: inline-block; margin: 4px;">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="profile-card" style="border: 2px solid ${RARITY_COLORS[item.rarity]}; cursor: pointer;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-size: 18px; font-weight: 700; color: white;">${item.name}</div>
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

    // Reset progress button (only the one WITHOUT data attributes)
    const resetBtn = this.shadowRoot.querySelector('.reset-btn:not([data-unequip]):not([data-equip])');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('⚠️ Are you sure you want to reset ALL progress? This cannot be undone!')) {
          if (
            confirm(
              'This will delete your level, XP, stats, and equipment. Are you ABSOLUTELY sure?'
            )
          ) {
            SaveManager.deleteSave();
            alert('✅ Progress reset! Reloading page...');
            window.location.reload();
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
