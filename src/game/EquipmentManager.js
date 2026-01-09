/**
 * EquipmentManager - Handles equipment logic, equipping/unequipping, and stat calculations
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { getEquipmentById, getRandomEquipmentDrop } from '../data/equipment.js';
import { Logger } from '../utils/logger.js';

export class EquipmentManager {
  /**
   * Equip an item to a slot
   * @param {string} equipmentId - ID of equipment to equip
   * @returns {boolean} - Success
   */
  static equipItem(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      console.error('Equipment not found:', equipmentId);
      return false;
    }

    // Check if player meets requirements
    const playerLevel = SaveManager.get('profile.level');
    const playerClass = SaveManager.get('profile.character.class');

    if (equipment.requirements.level > playerLevel) {
      console.log(`❌ Level ${equipment.requirements.level} required (you are ${playerLevel})`);
      return false;
    }

    if (equipment.requirements.class && !equipment.requirements.class.includes(playerClass)) {
      console.log(`❌ Class requirement not met: ${equipment.requirements.class.join(', ')}`);
      return false;
    }

    // Unequip current item in that slot
    const currentEquipped = SaveManager.get(`equipped.${equipment.type}`);
    if (currentEquipped) {
      this.unequipItem(equipment.type);
    }

    // Equip new item
    SaveManager.update(`equipped.${equipment.type}`, equipmentId);
    console.log(`⚔️ Equipped: ${equipment.name}`);

    return true;
  }

  /**
   * Unequip an item from a slot
   * @param {string} slot - Slot to unequip (weapon, armor, accessory)
   * @returns {boolean} - Success
   */
  static unequipItem(slot) {
    const currentEquipped = SaveManager.get(`equipped.${slot}`);
    if (!currentEquipped) {
      return false;
    }

    // Remove from equipped slot
    SaveManager.update(`equipped.${slot}`, null);
    console.log(`🔓 Unequipped ${slot}`);

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

    const inventory = SaveManager.get('inventory.equipment') || [];

    // Check inventory limit (20 items)
    if (inventory.length >= 20) {
      console.log('⚠️ Inventory full! Sell or discard items.');
      return false;
    }

    inventory.push(equipmentId);
    SaveManager.update('inventory.equipment', inventory);

    console.log(`📦 Added to inventory: ${equipment.name}`);
    return true;
  }

  /**
   * Remove equipment from inventory
   * @param {string} equipmentId - ID of equipment to remove
   * @returns {boolean} - Success
   */
  static removeFromInventory(equipmentId) {
    const inventory = SaveManager.get('inventory.equipment') || [];
    const index = inventory.indexOf(equipmentId);

    if (index === -1) {
      return false;
    }

    inventory.splice(index, 1);
    SaveManager.update('inventory.equipment', inventory);

    return true;
  }

  /**
   * Get total stats from all equipped items
   * @returns {Object} - Combined stats
   */
  static getEquippedStats() {
    const equipped = SaveManager.get('equipped');
    const stats = {
      strength: 0,
      health: 0,
      defense: 0,
      critChance: 0,
      critDamage: 0,
      manaRegen: 0,
    };

    // Weapon
    if (equipped.weapon) {
      const weapon = getEquipmentById(equipped.weapon);
      if (weapon) {
        Object.keys(weapon.stats).forEach((stat) => {
          stats[stat] = (stats[stat] || 0) + weapon.stats[stat];
        });
      }
    }

    // Armor
    if (equipped.armor) {
      const armor = getEquipmentById(equipped.armor);
      if (armor) {
        Object.keys(armor.stats).forEach((stat) => {
          stats[stat] = (stats[stat] || 0) + armor.stats[stat];
        });
      }
    }

    // Accessory
    if (equipped.accessory) {
      const accessory = getEquipmentById(equipped.accessory);
      if (accessory) {
        Object.keys(accessory.stats).forEach((stat) => {
          stats[stat] = (stats[stat] || 0) + accessory.stats[stat];
        });
      }
    }

    return stats;
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

    console.log(`⚔️ Equipment bonuses applied:`, {
      '+HP': stats.health,
      '+STR': stats.strength,
      '+DEF': stats.defense,
      '+Crit': stats.critChance,
    });

    return fighter;
  }

  /**
   * Award random equipment drop
   * @returns {Object} - Dropped equipment
   */
  static awardRandomDrop() {
    const playerLevel = SaveManager.get('profile.level');
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
    const inventory = SaveManager.get('inventory.equipment') || [];
    return inventory.map((id) => getEquipmentById(id)).filter((eq) => eq !== null);
  }

  /**
   * Get currently equipped items as equipment objects
   * @returns {Object} - Object with weapon, armor, accessory
   */
  static getEquippedItems() {
    const equipped = SaveManager.get('equipped');
    return {
      weapon: equipped.weapon ? getEquipmentById(equipped.weapon) : null,
      armor: equipped.armor ? getEquipmentById(equipped.armor) : null,
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

    const playerLevel = SaveManager.get('profile.level');
    const playerClass = SaveManager.get('profile.character.class');

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
