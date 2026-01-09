/**
 * MarketplaceManager - Handles marketplace operations and rotating inventory
 * Manages buying, selling, and shop inventory refreshes
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { getEquipmentById, EQUIPMENT_DATABASE } from '../data/equipment.js';
import { EconomyManager } from './EconomyManager.js';
import { EquipmentManager } from './EquipmentManager.js';
import { DurabilityManager } from './DurabilityManager.js';
import { Logger } from '../utils/logger.js';
import { AchievementManager } from './AchievementManager.js';

export class MarketplaceManager {
  // Refresh interval: 24 hours in milliseconds
  static REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

  /**
   * Get pricing structure based on rarity
   * @param {string} rarity - Equipment rarity
   * @returns {Object} - Min and max price range
   */
  static getPriceRange(rarity) {
    const ranges = {
      common: { min: 50, max: 150 },
      rare: { min: 200, max: 500 },
      epic: { min: 600, max: 1200 },
      legendary: { min: 1500, max: 3000 },
    };
    return ranges[rarity] || ranges.common;
  }

  /**
   * Calculate item price
   * @param {Object} equipment - Equipment object
   * @returns {number} - Price in gold
   */
  static getItemPrice(equipment) {
    if (!equipment) return 0;

    const range = this.getPriceRange(equipment.rarity);
    const basePrice = (range.min + range.max) / 2;

    // Add variation based on stats
    const statBonus = Object.values(equipment.stats || {}).reduce((sum, val) => sum + val, 0);
    const variation = statBonus * 2;

    return Math.floor(basePrice + variation);
  }

  /**
   * Calculate sell price (50% of purchase price)
   * @param {Object} equipment - Equipment object
   * @returns {number} - Sell price in gold
   */
  static getSellPrice(equipment) {
    return Math.floor(this.getItemPrice(equipment) * 0.5);
  }

  /**
   * Check if shop needs refresh
   * @returns {boolean} - True if refresh needed
   */
  static needsRefresh() {
    const marketplace = SaveManager.get('marketplace');
    const lastRefresh = marketplace?.lastRefresh;

    if (!lastRefresh) return true;

    const timeSinceRefresh = Date.now() - lastRefresh;
    return timeSinceRefresh >= this.REFRESH_INTERVAL;
  }

  /**
   * Get time until next refresh
   * @returns {number} - Milliseconds until refresh
   */
  static getTimeUntilRefresh() {
    const marketplace = SaveManager.get('marketplace');
    const lastRefresh = marketplace?.lastRefresh || 0;

    const timeSinceRefresh = Date.now() - lastRefresh;
    const timeRemaining = this.REFRESH_INTERVAL - timeSinceRefresh;

    return Math.max(0, timeRemaining);
  }

  /**
   * Format time remaining as string
   * @returns {string} - Formatted time (e.g., "5h 23m")
   */
  static getRefreshTimeFormatted() {
    const ms = this.getTimeUntilRefresh();
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Generate rotating inventory based on player level
   * @param {number} playerLevel - Player's current level
   * @param {boolean} forceRefresh - Force refresh even if not due
   * @returns {Array} - Array of equipment IDs in shop
   */
  static generateRotatingInventory(playerLevel = 1, forceRefresh = false) {
    // Check if refresh needed
    if (!forceRefresh && !this.needsRefresh()) {
      const current = SaveManager.get('marketplace.currentInventory');
      if (current && current.length > 0) {
        return current;
      }
    }

    const inventory = [];
    const availableEquipment = Object.values(EQUIPMENT_DATABASE).filter(
      (eq) => eq.requirements.level <= playerLevel + 2 // Show items slightly above level
    );

    // Determine number of items (6-8)
    const itemCount = 6 + Math.floor(Math.random() * 3);

    // Rarity chances based on player level
    const getLegendaryChance = () => (playerLevel >= 15 ? 0.05 : 0);
    const getEpicChance = () => (playerLevel >= 10 ? 0.15 : 0);
    const getRareChance = () => (playerLevel >= 5 ? 0.3 : 0.2);

    // Generate items
    for (let i = 0; i < itemCount; i++) {
      const roll = Math.random();
      let targetRarity;

      if (roll < getLegendaryChance()) {
        targetRarity = 'legendary';
      } else if (roll < getLegendaryChance() + getEpicChance()) {
        targetRarity = 'epic';
      } else if (roll < getLegendaryChance() + getEpicChance() + getRareChance()) {
        targetRarity = 'rare';
      } else {
        targetRarity = 'common';
      }

      // Get random item of target rarity
      const rarityItems = availableEquipment.filter((eq) => eq.rarity === targetRarity);
      if (rarityItems.length > 0) {
        const randomItem = rarityItems[Math.floor(Math.random() * rarityItems.length)];
        // Avoid duplicates
        if (!inventory.includes(randomItem.id)) {
          inventory.push(randomItem.id);
        }
      }
    }

    // Ensure we have at least common items if nothing was added
    while (inventory.length < 4) {
      const commonItems = availableEquipment.filter(
        (eq) => eq.rarity === 'common' && !inventory.includes(eq.id)
      );
      if (commonItems.length === 0) break;

      const randomItem = commonItems[Math.floor(Math.random() * commonItems.length)];
      inventory.push(randomItem.id);
    }

    // Save inventory and refresh time
    SaveManager.update('marketplace.currentInventory', inventory);
    SaveManager.update('marketplace.lastRefresh', Date.now());

    console.log(`🏪 Shop inventory refreshed! ${inventory.length} items available.`);

    return inventory;
  }

  /**
   * Get current shop inventory
   * @returns {Array} - Array of equipment objects
   */
  static getCurrentInventory() {
    const playerLevel = SaveManager.get('profile.level') || 1;
    const inventoryIds = this.generateRotatingInventory(playerLevel);

    return inventoryIds.map((id) => getEquipmentById(id)).filter((eq) => eq !== null);
  }

  /**
   * Purchase an item from the shop
   * @param {string} equipmentId - Equipment ID to purchase
   * @returns {boolean} - Success status
   */
  static purchaseItem(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      console.error('Equipment not found');
      return false;
    }

    // Check if item is in shop
    const currentInventory = SaveManager.get('marketplace.currentInventory') || [];
    if (!currentInventory.includes(equipmentId)) {
      console.log('❌ Item not available in shop');
      return false;
    }

    // Calculate price
    const price = this.getItemPrice(equipment);

    // Check if player can afford
    if (!EconomyManager.canAfford(price)) {
      console.log(`❌ Cannot afford ${equipment.name}. Need ${price} gold.`);
      return false;
    }

    // Check inventory space
    const inventory = SaveManager.get('inventory.equipment') || [];
    if (inventory.length >= 20) {
      console.log('❌ Inventory full! Sell items to make space.');

      const message = `
        <div class="inventory-full" style="
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(245, 124, 0, 0.3));
          border-left: 4px solid #ff9800;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          text-align: center;
        ">
          <span style="font-size: 24px; margin-right: 8px;">⚠️</span>
          <strong style="color: #ffb74d;">Inventory Full!</strong>
          <span style="color: #ffe0b2; margin-left: 8px;">Sell items to make space.</span>
        </div>
      `;
      Logger.log(message);

      return false;
    }

    // Purchase item
    if (!EconomyManager.spendGold(price, `Purchase ${equipment.name}`)) {
      return false;
    }

    // Add to inventory
    if (!EquipmentManager.addToInventory(equipmentId)) {
      // Refund if failed to add
      EconomyManager.addGold(price, 'Purchase refund');
      return false;
    }

    // Initialize durability
    DurabilityManager.initializeItemDurability(equipmentId);

    // Track purchase
    const purchaseHistory = SaveManager.get('marketplace.purchaseHistory') || [];
    purchaseHistory.push({
      equipmentId,
      price,
      timestamp: Date.now(),
    });
    SaveManager.update('marketplace.purchaseHistory', purchaseHistory);

    console.log(`✅ Purchased ${equipment.name} for ${price} gold`);

    const rarityColors = {
      common: '#9e9e9e',
      rare: '#2196f3',
      epic: '#9c27b0',
      legendary: '#ff9800',
    };

    const message = `
      <div class="item-purchased" style="
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.3));
        border: 2px solid ${rarityColors[equipment.rarity]};
        border-radius: 12px;
        padding: 15px;
        margin: 10px 0;
        text-align: center;
      ">
        <div style="font-size: 48px; margin-bottom: 5px;">${equipment.icon}</div>
        <div style="color: ${rarityColors[equipment.rarity]}; font-weight: bold; font-size: 16px; text-transform: uppercase;">
          ${equipment.rarity}
        </div>
        <div style="color: white; font-size: 18px; font-weight: bold; margin: 5px 0;">
          ${equipment.name}
        </div>
        <div style="color: #ffecb3; font-size: 14px; margin-top: 8px;">
          💰 Purchased for ${price} gold
        </div>
      </div>
    `;
    Logger.log(message);

    // Track achievements
    AchievementManager.trackMarketplacePurchase(equipment);

    return true;
  }

  /**
   * Sell an item from inventory
   * @param {string} equipmentId - Equipment ID to sell
   * @returns {boolean} - Success status
   */
  static sellItem(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      console.error('Equipment not found');
      return false;
    }

    // Check if item is in inventory
    const inventory = SaveManager.get('inventory.equipment') || [];
    if (!inventory.includes(equipmentId)) {
      console.log('❌ Item not in inventory');
      return false;
    }

    // Check if item is equipped AND if it's the only copy
    const equipped = SaveManager.get('equipped');
    const isEquipped = Object.values(equipped).includes(equipmentId);

    // Count how many copies of this item we have
    const itemCount = inventory.filter((id) => id === equipmentId).length;

    // Only block the sale if:
    // 1. The item is equipped AND
    // 2. This is the only copy (no duplicates)
    // If there are duplicates, we allow selling the non-equipped copy
    if (isEquipped && itemCount === 1) {
      console.log('❌ Cannot sell equipped items. Unequip first.');

      const message = `
        <div class="cannot-sell" style="
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.3));
          border-left: 4px solid #f44336;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          text-align: center;
        ">
          <span style="font-size: 24px; margin-right: 8px;">❌</span>
          <strong style="color: #ef5350;">Cannot Sell Equipped Items</strong>
          <span style="color: #ffcdd2; margin-left: 8px;">Unequip first.</span>
        </div>
      `;
      Logger.log(message);

      return false;
    }

    // Calculate sell price
    const sellPrice = this.getSellPrice(equipment);

    // Remove from inventory
    if (!EquipmentManager.removeFromInventory(equipmentId)) {
      return false;
    }

    // Award gold
    EconomyManager.addGold(sellPrice, `Sold ${equipment.name}`);

    console.log(`✅ Sold ${equipment.name} for ${sellPrice} gold`);

    const message = `
      <div class="item-sold" style="
        background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.3));
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        text-align: center;
      ">
        <div style="font-size: 32px; margin-bottom: 8px;">💰</div>
        <strong style="color: #ffd54f; font-size: 18px;">Item Sold!</strong>
        <div style="color: #fff9c4; margin-top: 5px;">${equipment.name}</div>
        <div style="color: #ffe082; font-size: 16px; margin-top: 8px;">+${sellPrice} gold</div>
      </div>
    `;
    Logger.log(message);

    // Track achievements
    AchievementManager.trackItemSold(sellPrice);

    return true;
  }

  /**
   * Force refresh shop inventory (free, no cost)
   */
  static forceRefresh() {
    const playerLevel = SaveManager.get('profile.level') || 1;
    this.generateRotatingInventory(playerLevel, true);

    const message = `
      <div class="shop-refresh" style="
        background: linear-gradient(135deg, rgba(103, 58, 183, 0.2), rgba(81, 45, 168, 0.3));
        border-left: 4px solid #673ab7;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        text-align: center;
      ">
        <div style="font-size: 32px; margin-bottom: 8px;">🔄</div>
        <strong style="color: #b39ddb; font-size: 18px;">Shop Inventory Refreshed!</strong>
        <div style="color: #d1c4e9; margin-top: 5px;">New items available for purchase</div>
      </div>
    `;
    Logger.log(message);
  }

  /**
   * Force refresh shop inventory for a gold cost
   * @param {number} cost - Gold cost for refresh
   * @returns {boolean} - Success status
   */
  static forceRefreshWithCost(cost = 100) {
    // Check if player can afford
    if (!EconomyManager.canAfford(cost)) {
      const message = `
        <div class="cannot-refresh" style="
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.3));
          border-left: 4px solid #f44336;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          text-align: center;
        ">
          <span style="font-size: 24px; margin-right: 8px;">❌</span>
          <strong style="color: #ef5350;">Cannot Afford Refresh</strong>
          <span style="color: #ffcdd2; margin-left: 8px;">Need ${cost} gold.</span>
        </div>
      `;
      Logger.log(message);
      console.log(`❌ Cannot afford shop refresh. Need ${cost} gold.`);
      return false;
    }

    // Spend gold
    if (!EconomyManager.spendGold(cost, 'Shop Refresh')) {
      return false;
    }

    // Refresh inventory
    const playerLevel = SaveManager.get('profile.level') || 1;
    this.generateRotatingInventory(playerLevel, true);

    const message = `
      <div class="shop-refresh" style="
        background: linear-gradient(135deg, rgba(103, 58, 183, 0.2), rgba(81, 45, 168, 0.3));
        border: 2px solid #673ab7;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        text-align: center;
      ">
        <div style="font-size: 48px; margin-bottom: 8px;">✨</div>
        <strong style="color: #b39ddb; font-size: 20px;">Shop Inventory Refreshed!</strong>
        <div style="color: #d1c4e9; margin-top: 5px;">New items available for purchase</div>
        <div style="color: #ffc107; margin-top: 8px; font-size: 14px;">-${cost} 💰</div>
      </div>
    `;
    Logger.log(message);

    console.log(`✅ Shop refreshed for ${cost} gold`);
    return true;
  }

  /**
   * Get consumable prices
   * @returns {Object} - Map of consumable type to price
   */
  static getConsumablePrices() {
    return {
      health_potion: 30,
      mana_potion: 25,
    };
  }

  /**
   * Purchase consumable
   * @param {string} type - Consumable type
   * @param {number} quantity - Quantity to purchase
   * @returns {boolean} - Success status
   */
  static purchaseConsumable(type, quantity = 1) {
    const prices = this.getConsumablePrices();
    const price = prices[type];

    if (!price) {
      console.error('Invalid consumable type');
      return false;
    }

    const totalCost = price * quantity;

    if (!EconomyManager.canAfford(totalCost)) {
      console.log(`❌ Cannot afford ${quantity}x ${type}. Need ${totalCost} gold.`);
      return false;
    }

    if (!EconomyManager.spendGold(totalCost, `Purchase ${quantity}x ${type}`)) {
      return false;
    }

    // Add consumables
    const current = SaveManager.get(`inventory.consumables.${type}`) || 0;
    SaveManager.update(`inventory.consumables.${type}`, current + quantity);

    console.log(`✅ Purchased ${quantity}x ${type} for ${totalCost} gold`);

    const message = `
      <div class="consumable-purchased" style="
        background: linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(21, 101, 192, 0.3));
        border-left: 4px solid #2196f3;
        padding: 12px;
        margin: 8px 0;
        border-radius: 8px;
        text-align: center;
      ">
        <strong style="color: #64b5f6; font-size: 16px;">Purchased ${quantity}x ${type}</strong>
        <span style="color: #bbdefb; margin-left: 8px;">-${totalCost} 💰</span>
      </div>
    `;
    Logger.log(message);

    return true;
  }
}
