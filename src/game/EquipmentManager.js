/**
 * EquipmentManager - Handles equipment logic, equipping/unequipping, and stat calculations
 */

import { gameStore } from '../store/gameStore.js';
import {
  addItem,
  removeItem,
  equipItem as equipItemAction,
  unequipItem as unequipItemAction,
} from '../store/actions.js';
import { getEquipmentById, getRandomEquipmentDrop } from '../data/equipment.js';
import { Logger } from '../utils/logger.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

export class EquipmentManager {
  /**
   * Equip an item to a slot
   * @param {string} equipmentId - ID of equipment to equip
   * @returns {boolean} - Success
   */
  static equipItem(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      ConsoleLogger.error(LogCategory.EQUIPMENT, 'Equipment not found:', equipmentId);
      return false;
    }

    // Check if player meets requirements
    const state = gameStore.getState();
    const playerLevel = state.player.level;
    const playerClass = state.player.class;

    if (equipment.requirements.level > playerLevel) {
      ConsoleLogger.warn(
        LogCategory.EQUIPMENT,
        `❌ Level ${equipment.requirements.level} required (you are ${playerLevel})`
      );
      return false;
    }

    if (equipment.requirements.class && !equipment.requirements.class.includes(playerClass)) {
      ConsoleLogger.warn(
        LogCategory.EQUIPMENT,
        `❌ Class requirement not met: ${equipment.requirements.class.join(', ')}`
      );
      return false;
    }

    // Unequip current item in that slot
    const currentEquipped = state.equipped[equipment.type];
    if (currentEquipped) {
      this.unequipItem(equipment.type);
    }

    // Equip new item
    gameStore.dispatch(equipItemAction(equipmentId, equipment.type));
    ConsoleLogger.info(LogCategory.EQUIPMENT, `⚔️ Equipped: ${equipment.name}`);

    return true;
  }

  /**
   * Unequip an item from a slot
   * @param {string} slot - Slot to unequip (weapon, armor, accessory)
   * @returns {boolean} - Success
   */
  static unequipItem(slot) {
    const state = gameStore.getState();
    const currentEquipped = state.equipped[slot];
    if (!currentEquipped) {
      return false;
    }

    // Remove from equipped slot
    gameStore.dispatch(unequipItemAction(slot));
    ConsoleLogger.info(LogCategory.EQUIPMENT, `🔓 Unequipped ${slot}`);

    return true;
  }

  /**
   * Add equipment to inventory
   * @param {string} equipmentId - ID of equipment to add
   * @returns {boolean} - Success
   */
  static addToInventory(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      return false;
    }

    const state = gameStore.getState();
    const inventory = state.inventory.equipment || [];

    // Check inventory limit (20 items)
    if (inventory.length >= 20) {
      ConsoleLogger.warn(LogCategory.EQUIPMENT, '⚠️ Inventory full! Sell or discard items.');
      return false;
    }

    gameStore.dispatch(addItem(equipmentId));

    ConsoleLogger.info(LogCategory.EQUIPMENT, `📦 Added to inventory: ${equipment.name}`);
    return true;
  }

  /**
   * Remove equipment from inventory
   * @param {string} equipmentId - ID of equipment to remove
   * @returns {boolean} - Success
   */
  static removeFromInventory(equipmentId) {
    gameStore.dispatch(removeItem(equipmentId));
    return true;
  }

  /**
   * Get total stats from all equipped items
   * @returns {Object} - Combined stats
   */
  static getEquippedStats() {
    const state = gameStore.getState();
    const equipped = state.equipped;
    const stats = {
      strength: 0,
      health: 0,
      defense: 0,
      critChance: 0,
      critDamage: 0,
      manaRegen: 0,
      movementBonus: 0,
    };

    // All 8 equipment slots
    const slots = ['weapon', 'head', 'torso', 'arms', 'trousers', 'shoes', 'coat', 'accessory'];

    slots.forEach((slotName) => {
      if (equipped[slotName]) {
        const item = getEquipmentById(equipped[slotName]);
        if (item && item.stats) {
          Object.keys(item.stats).forEach((stat) => {
            stats[stat] = (stats[stat] || 0) + item.stats[stat];
          });
        }
      }
    });

    return stats;
  }

  /**
   * Get movement modifiers from equipped items
   * @returns {Object} - Movement modifiers { bonus: number, specialTypes: string[] }
   */
  static getMovementModifiers() {
    const state = gameStore.getState();
    const equipped = state.equipped;
    const modifiers = {
      bonus: 0,
      specialTypes: [], // e.g., ['phaseThrough', 'ignoreTerrainCost']
    };

    // Check all 8 equipped slots for movement modifiers
    const slots = ['weapon', 'head', 'torso', 'arms', 'trousers', 'shoes', 'coat', 'accessory'];

    slots.forEach((slotName) => {
      const itemId = equipped[slotName];
      if (itemId) {
        const item = getEquipmentById(itemId);
        if (item) {
          // Add movement bonus
          if (item.stats?.movementBonus) {
            modifiers.bonus += item.stats.movementBonus;
          }

          // Add special movement types
          if (item.movementType) {
            if (Array.isArray(item.movementType)) {
              modifiers.specialTypes.push(...item.movementType);
            } else {
              modifiers.specialTypes.push(item.movementType);
            }
          }
        }
      }
    });

    // Remove duplicates from special types
    modifiers.specialTypes = [...new Set(modifiers.specialTypes)];

    return modifiers;
  }

  /**
   * Apply equipment bonuses to a fighter
   * @param {Object} fighter - Fighter object
   * @returns {Object} - Modified fighter with equipment bonuses
   */
  static applyEquipmentBonuses(fighter) {
    const stats = this.getEquippedStats();

    // Apply bonuses directly to the fighter object (mutate in place)
    fighter.health = fighter.health + stats.health;
    fighter.maxHealth = fighter.maxHealth + stats.health;
    fighter.strength = fighter.strength + stats.strength;
    fighter.baseDefense = stats.defense; // Store for damage calculations
    fighter.baseCritChance = stats.critChance;
    fighter.baseCritDamage = stats.critDamage;
    fighter.baseManaRegen = stats.manaRegen;

    // Apply movement modifiers
    const movementMods = this.getMovementModifiers();
    fighter.movementBonus = movementMods.bonus;
    fighter.movementSpecialTypes = movementMods.specialTypes;

    ConsoleLogger.debug(LogCategory.EQUIPMENT, `⚔️ Equipment bonuses applied:`, {
      '+HP': stats.health,
      '+STR': stats.strength,
      '+DEF': stats.defense,
      '+Crit': stats.critChance,
      '+Move': movementMods.bonus,
      Special: movementMods.specialTypes.join(', ') || 'none',
    });

    return fighter;
  }

  /**
   * Award random equipment drop
   * @returns {Object} - Dropped equipment
   */
  static awardRandomDrop() {
    const state = gameStore.getState();
    const playerLevel = state.player.level;
    const drop = getRandomEquipmentDrop(playerLevel);

    if (this.addToInventory(drop.id)) {
      // Track legendary collection achievement
      if (drop.rarity === 'legendary') {
        // Import will be added in game.js to avoid circular dependency
        if (typeof window !== 'undefined' && window.AchievementManager) {
          window.AchievementManager.trackLegendaryCollected(drop.rarity);
        }
      }
      // Show loot notification
      const rarityColors = {
        common: '#9e9e9e',
        rare: '#2196f3',
        epic: '#9c27b0',
        legendary: '#ff9800',
      };

      const message = `
        <div class="loot-drop" style="
          background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(26,13,46,0.9));
          border: 2px solid ${rarityColors[drop.rarity]};
          border-radius: 12px;
          padding: 15px;
          margin: 10px 0;
          text-align: center;
          box-shadow: 0 0 20px ${rarityColors[drop.rarity]}80;
          animation: lootPopIn 0.5s ease;
        ">
          <div style="font-size: 48px; margin-bottom: 5px;">${drop.icon}</div>
          <div style="color: ${rarityColors[drop.rarity]}; font-weight: bold; font-size: 18px; text-transform: uppercase;">
            ${drop.rarity}
          </div>
          <div style="color: white; font-size: 20px; font-weight: bold; margin: 5px 0;">
            ${drop.name}
          </div>
          <div style="color: #b39ddb; font-size: 14px;">
            ${drop.description}
          </div>
          <div style="color: #ffa726; font-size: 12px; margin-top: 8px;">
            📦 Added to Inventory
          </div>
        </div>
      `;

      Logger.log(message);

      // Add CSS animation if not present
      if (!document.getElementById('loot-animations')) {
        const style = document.createElement('style');
        style.id = 'loot-animations';
        style.innerHTML = `
          @keyframes lootPopIn {
            0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      return drop;
    }

    return null;
  }

  /**
   * Get inventory items as equipment objects
   * @returns {Array} - Array of equipment objects
   */
  static getInventoryItems() {
    const state = gameStore.getState();
    const inventory = state.inventory.equipment || [];
    return inventory.map((id) => getEquipmentById(id)).filter((eq) => eq !== null);
  }

  /**
   * Get currently equipped items as equipment objects
   * @returns {Object} - Object with weapon, armor, accessory
   */
  static getEquippedItems() {
    const state = gameStore.getState();
    const equipped = state.equipped;
    return {
      weapon: equipped.weapon ? getEquipmentById(equipped.weapon) : null,
      head: equipped.head ? getEquipmentById(equipped.head) : null,
      torso: equipped.torso ? getEquipmentById(equipped.torso) : null,
      arms: equipped.arms ? getEquipmentById(equipped.arms) : null,
      trousers: equipped.trousers ? getEquipmentById(equipped.trousers) : null,
      shoes: equipped.shoes ? getEquipmentById(equipped.shoes) : null,
      coat: equipped.coat ? getEquipmentById(equipped.coat) : null,
      accessory: equipped.accessory ? getEquipmentById(equipped.accessory) : null,
    };
  }

  /**
   * Check if equipment can be equipped by player
   * @param {string} equipmentId
   * @returns {Object} - { canEquip: boolean, reason: string }
   */
  static canEquip(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      return { canEquip: false, reason: 'Equipment not found' };
    }

    const state = gameStore.getState();
    const playerLevel = state.player.level;
    const playerClass = state.player.class;

    if (equipment.requirements.level > playerLevel) {
      return {
        canEquip: false,
        reason: `Level ${equipment.requirements.level} required (you are ${playerLevel})`,
      };
    }

    if (equipment.requirements.class && !equipment.requirements.class.includes(playerClass)) {
      return {
        canEquip: false,
        reason: `Class requirement: ${equipment.requirements.class.join(', ')}`,
      };
    }

    return { canEquip: true, reason: '' };
  }
}
