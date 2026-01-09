import { BaseComponent } from './BaseComponent.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import { RARITY_COLORS, RARITY_NAMES } from '../data/equipment.js';

/**
 * EquipmentScreen Web Component
 * Displays equipped items and inventory management
 *
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class EquipmentScreen extends BaseComponent {
  constructor() {
    super();
    this.selectedTab = 'all'; // all, weapon, armor, accessory
  }

  styles() {
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        overflow-y: auto;
      }

      .equipment-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
      }

      .equipment-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .equipment-title {
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

      .equipped-section {
        margin-bottom: 40px;
        animation: fadeInUp 0.8s ease;
      }

      .section-title {
        font-size: 28px;
        font-weight: 700;
        color: #ffa726;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .equipped-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .equipment-slot {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .equipment-slot:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .slot-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .slot-name {
        font-size: 18px;
        font-weight: 700;
        color: #b39ddb;
        text-transform: uppercase;
      }

      .slot-icon {
        font-size: 32px;
      }

      .equipped-item {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        padding: 15px;
        border: 2px solid;
      }

      .equipped-item.common { border-color: #9e9e9e; }
      .equipped-item.rare { border-color: #2196f3; }
      .equipped-item.epic { border-color: #9c27b0; }
      .equipped-item.legendary { border-color: #ff9800; }

      .item-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        margin-bottom: 5px;
      }

      .item-rarity {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 10px;
      }

      .item-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }

      .stat-badge {
        background: rgba(255, 167, 38, 0.2);
        border: 1px solid #ffa726;
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 12px;
        color: #ffa726;
        font-weight: 600;
      }

      .unequip-btn {
        margin-top: 10px;
        width: 100%;
        padding: 8px;
        background: rgba(255, 23, 68, 0.3);
        border: 2px solid rgba(255, 23, 68, 0.5);
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .unequip-btn:hover {
        background: rgba(255, 23, 68, 0.5);
        box-shadow: 0 0 15px rgba(255, 23, 68, 0.6);
      }

      .empty-slot {
        text-align: center;
        padding: 40px 20px;
        color: #7e57c2;
        font-style: italic;
      }

      .inventory-section {
        animation: fadeInUp 1s ease;
      }

      .tab-filters {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
      }

      .tab-btn {
        padding: 12px 24px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .tab-btn:hover {
        border-color: #ffa726;
        transform: translateY(-2px);
      }

      .tab-btn.active {
        background: rgba(255, 167, 38, 0.3);
        border-color: #ffa726;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.3);
      }

      .inventory-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
      }

      .inventory-item {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 2px solid;
        border-radius: 15px;
        padding: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .inventory-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .inventory-item.common { border-color: #9e9e9e; }
      .inventory-item.rare { border-color: #2196f3; }
      .inventory-item.epic { border-color: #9c27b0; }
      .inventory-item.legendary { border-color: #ff9800; }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
      }

      .item-icon-large {
        font-size: 48px;
      }

      .item-description {
        color: #b39ddb;
        font-size: 13px;
        margin: 10px 0;
        line-height: 1.4;
      }

      .item-requirements {
        font-size: 12px;
        color: #7e57c2;
        margin-bottom: 10px;
      }

      .requirement-met {
        color: #00e676;
      }

      .requirement-not-met {
        color: #ff1744;
      }

      .equip-btn {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
      }

      .equip-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 230, 118, 0.4);
      }

      .equip-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .empty-inventory {
        text-align: center;
        padding: 60px 20px;
        color: #7e57c2;
      }

      .empty-inventory-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      .stats-summary {
        background: rgba(0, 230, 118, 0.1);
        border: 2px solid #00e676;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 40px;
        animation: fadeIn 1s ease;
      }

      .stats-summary-title {
        font-size: 20px;
        font-weight: 700;
        color: #00e676;
        margin-bottom: 15px;
        text-align: center;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .stat-display {
        text-align: center;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #ffa726;
      }

      .stat-label {
        font-size: 12px;
        color: #b39ddb;
        text-transform: uppercase;
        margin-top: 5px;
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
    const equipped = EquipmentManager.getEquippedItems();
    const inventory = EquipmentManager.getInventoryItems();
    const totalStats = EquipmentManager.getEquippedStats();

    // Filter inventory by selected tab
    let filteredInventory = inventory;
    if (this.selectedTab !== 'all') {
      filteredInventory = inventory.filter((item) => item.type === this.selectedTab);
    }

    return `
      <div class="equipment-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="equipment-header">
          <h1 class="equipment-title">⚔️ Equipment ⚔️</h1>
        </div>

        <!-- Total Stats Summary -->
        ${
          Object.values(totalStats).some((v) => v > 0)
            ? `
          <div class="stats-summary">
            <div class="stats-summary-title">💪 Total Equipment Bonuses</div>
            <div class="stats-grid">
              ${
                totalStats.strength > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.strength}</div>
                  <div class="stat-label">Strength</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.health > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.health}</div>
                  <div class="stat-label">Health</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.defense > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.defense}</div>
                  <div class="stat-label">Defense</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.critChance > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.critChance}%</div>
                  <div class="stat-label">Crit Chance</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.critDamage > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.critDamage}%</div>
                  <div class="stat-label">Crit Damage</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.manaRegen > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.manaRegen}</div>
                  <div class="stat-label">Mana Regen</div>
                </div>
              `
                  : ''
              }
            </div>
          </div>
        `
            : ''
        }

        <!-- Equipped Items -->
        <div class="equipped-section">
          <div class="section-title">
            <span>⚡</span>
            Currently Equipped
          </div>
          <div class="equipped-grid">
            ${this.renderEquippedSlot('weapon', '⚔️', equipped.weapon)}
            ${this.renderEquippedSlot('armor', '🛡️', equipped.armor)}
            ${this.renderEquippedSlot('accessory', '💍', equipped.accessory)}
          </div>
        </div>

        <!-- Inventory -->
        <div class="inventory-section">
          <div class="section-title">
            <span>📦</span>
            Inventory (${inventory.length}/20)
          </div>

          <div class="tab-filters">
            <button class="tab-btn ${this.selectedTab === 'all' ? 'active' : ''}" data-tab="all">
              All Items
            </button>
            <button class="tab-btn ${this.selectedTab === 'weapon' ? 'active' : ''}" data-tab="weapon">
              ⚔️ Weapons
            </button>
            <button class="tab-btn ${this.selectedTab === 'armor' ? 'active' : ''}" data-tab="armor">
              🛡️ Armor
            </button>
            <button class="tab-btn ${this.selectedTab === 'accessory' ? 'active' : ''}" data-tab="accessory">
              💍 Accessories
            </button>
          </div>

          ${
            filteredInventory.length > 0
              ? `
            <div class="inventory-grid">
              ${filteredInventory.map((item) => this.renderInventoryItem(item)).join('')}
            </div>
          `
              : `
            <div class="empty-inventory">
              <div class="empty-inventory-icon">📦</div>
              <div>No ${this.selectedTab === 'all' ? '' : this.selectedTab} items in inventory</div>
              <div style="margin-top: 10px; font-size: 14px;">Win battles to earn equipment!</div>
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  renderEquippedSlot(slotType, icon, item) {
    if (!item) {
      return `
        <div class="equipment-slot">
          <div class="slot-header">
            <div class="slot-name">${slotType}</div>
            <div class="slot-icon">${icon}</div>
          </div>
          <div class="empty-slot">
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
        return `<span class="stat-badge">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="equipment-slot">
        <div class="slot-header">
          <div class="slot-name">${slotType}</div>
          <div class="slot-icon">${item.icon}</div>
        </div>
        <div class="equipped-item ${item.rarity}">
          <div class="item-name">${item.name}</div>
          <div class="item-rarity" style="color: ${RARITY_COLORS[item.rarity]}">
            ${RARITY_NAMES[item.rarity]}
          </div>
          <div class="item-stats">${statsHtml}</div>
          <button class="unequip-btn" data-slot="${slotType}">Unequip</button>
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
        return `<span class="stat-badge">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="inventory-item ${item.rarity}" data-item-id="${item.id}">
        <div class="item-header">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-rarity" style="color: ${RARITY_COLORS[item.rarity]}">
              ${RARITY_NAMES[item.rarity]}
            </div>
          </div>
          <div class="item-icon-large">${item.icon}</div>
        </div>
        <div class="item-description">${item.description}</div>
        <div class="item-stats">${statsHtml}</div>
        <div class="item-requirements">
          <div class="${meetsLevel ? 'requirement-met' : 'requirement-not-met'}">
            Level ${item.requirements.level} ${meetsLevel ? '✓' : '✗'}
          </div>
          ${
            item.requirements.class
              ? `
            <div class="${meetsClass ? 'requirement-met' : 'requirement-not-met'}">
              ${item.requirements.class.join(', ')} ${meetsClass ? '✓' : '✗'}
            </div>
          `
              : ''
          }
        </div>
        <button class="equip-btn" data-equip-id="${item.id}" ${!canEquip ? 'disabled' : ''}>
          Equip
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    // Back button
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    // Tab filters
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedTab = btn.dataset.tab;
        this.render();
      });
    });

    // Unequip buttons
    const unequipBtns = this.shadowRoot.querySelectorAll('.unequip-btn');
    unequipBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = btn.dataset.slot;
        EquipmentManager.unequipItem(slot);
        this.render();
      });
    });

    // Equip buttons
    const equipBtns = this.shadowRoot.querySelectorAll('.equip-btn');
    equipBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const equipmentId = btn.dataset.equipId;
        if (EquipmentManager.equipItem(equipmentId)) {
          this.render();
        }
      });
    });
  }
}

customElements.define('equipment-screen', EquipmentScreen);
