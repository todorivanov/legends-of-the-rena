/**
 * DurabilityManager - Handles equipment durability system
 * Manages wear and tear, repairs, and effectiveness calculations
 */

import { gameStore } from '../store/gameStore.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import { updateDurability, unequipItem, incrementStat } from '../store/actions.js';
import { getEquipmentById } from '../data/equipment.js';
import { Logger } from '../utils/logger.js';
import { EconomyManager } from './EconomyManager.js';

export class DurabilityManager {
  /**
   * Apply battle wear to equipped items
   * @param {Object} equippedItems - Currently equipped items
   * @returns {Array} - Items that broke during battle
   */
  static applyBattleWear(equippedItems = null) {
    const state = gameStore.getState();
    const equipped = equippedItems || state.equipped;
    const durabilityMap = state.equipmentDurability || {};
    const brokenItems = [];

    ['weapon', 'armor', 'accessory'].forEach((slot) => {
      const equipmentId = equipped[slot];
      if (!equipmentId) return;

      const equipment = getEquipmentById(equipmentId);
      if (!equipment || !equipment.durability) return;

      // Get current durability or initialize
      const currentDurability =
        durabilityMap[equipmentId] !== undefined
          ? durabilityMap[equipmentId]
          : equipment.durability.max;

      // Calculate degradation (random within range)
      const degradation = Math.floor(
        equipment.durability.degradationRate * (0.8 + Math.random() * 0.4)
      );

      const newDurability = Math.max(0, currentDurability - degradation);

      // Update durability
      gameStore.dispatch(updateDurability(equipmentId, newDurability));

      // Check if item broke
      if (newDurability === 0) {
        brokenItems.push({ slot, equipment });
        // Unequip broken item
        gameStore.dispatch(unequipItem(slot));
        ConsoleLogger.info(LogCategory.DURABILITY, `💔 ${equipment.name} broke!`);

        const message = `
          <div class="item-broken" style="
            background: linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(211, 47, 47, 0.4));
            border-left: 4px solid #f44336;
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            text-align: center;
          ">
            <div style="font-size: 32px; margin-bottom: 8px;">💔</div>
            <strong style="color: #ef5350; font-size: 18px;">Item Broken!</strong>
            <div style="color: #ffcdd2; margin-top: 5px;">${equipment.name} has broken and been unequipped.</div>
            <div style="color: #ffab91; font-size: 12px; margin-top: 8px;">Repair it at the marketplace to use it again.</div>
          </div>
        `;
        Logger.log(message);
      } else if (newDurability <= equipment.durability.max * 0.25) {
        // Warn when durability is low
        ConsoleLogger.info(
          LogCategory.DURABILITY,
          `⚠️ ${equipment.name} durability: ${newDurability}%`
        );
      }
    });

    return brokenItems;
  }

  /**
   * Calculate stat effectiveness based on durability
   * @param {number} durability - Current durability (0-100)
   * @param {number} maxDurability - Maximum durability
   * @returns {number} - Effectiveness multiplier (0-1)
   */
  static calculateEffectiveness(durability, maxDurability = 100) {
    const percentage = (durability / maxDurability) * 100;

    if (percentage <= 0) return 0; // Broken
    if (percentage <= 25) return 0.75; // -25% effectiveness
    if (percentage <= 50) return 0.9; // -10% effectiveness
    return 1.0; // Full effectiveness
  }

  /**
   * Get durability for an equipment item
   * @param {string} equipmentId - Equipment ID
   * @returns {number} - Current durability
   */
  static getDurability(equipmentId) {
    const state = gameStore.getState();
    const durabilityMap = state.equipmentDurability || {};
    const equipment = getEquipmentById(equipmentId);

    if (!equipment || !equipment.durability) return 100;

    // Return stored durability or max if not found
    return durabilityMap[equipmentId] !== undefined
      ? durabilityMap[equipmentId]
      : equipment.durability.max;
  }

  /**
   * Set durability for an equipment item
   * @param {string} equipmentId - Equipment ID
   * @param {number} durability - New durability value
   */
  static setDurability(equipmentId, durability) {
    gameStore.dispatch(updateDurability(equipmentId, Math.max(0, durability)));
  }

  /**
   * Repair an equipment item
   * @param {string} equipmentId - Equipment ID to repair
   * @param {number} targetDurability - Target durability (default: max)
   * @returns {boolean} - Success status
   */
  static repairItem(equipmentId, targetDurability = null) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment || !equipment.durability) {
      ConsoleLogger.error(LogCategory.DURABILITY, 'Equipment not found or has no durability');
      return false;
    }

    const maxDurability = equipment.durability.max;
    const finalTarget = targetDurability || maxDurability;

    // Calculate repair cost
    const repairCost = this.getRepairCost(equipmentId, finalTarget);

    // Check if player can afford
    if (!EconomyManager.canAfford(repairCost)) {
      ConsoleLogger.info(
        LogCategory.DURABILITY,
        `❌ Cannot afford repair. Need ${repairCost} gold.`
      );
      return false;
    }

    // Spend gold
    if (!EconomyManager.spendGold(repairCost, `Repair ${equipment.name}`)) {
      return false;
    }

    // Restore durability
    this.setDurability(equipmentId, finalTarget);

    // Track repair statistics
    gameStore.dispatch(incrementStat('itemsRepaired'));

    ConsoleLogger.info(
      LogCategory.DURABILITY,
      `🔧 Repaired ${equipment.name} to ${finalTarget}/${maxDurability}`
    );

    const message = `
      <div class="item-repaired" style="
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.3));
        border-left: 4px solid #4caf50;
        padding: 15px;
        margin: 10px 0;
        border-radius: 10px;
        text-align: center;
      ">
        <div style="font-size: 32px; margin-bottom: 8px;">🔧</div>
        <strong style="color: #66bb6a; font-size: 18px;">Item Repaired!</strong>
        <div style="color: #a5d6a7; margin-top: 5px;">${equipment.name} restored to ${finalTarget}/${maxDurability} durability</div>
        <div style="color: #ffecb3; font-size: 14px; margin-top: 8px;">Cost: ${repairCost} 💰</div>
      </div>
    `;
    Logger.log(message);

    return true;
  }

  /**
   * Calculate repair cost for an item
   * @param {string} equipmentId - Equipment ID
   * @param {number} targetDurability - Target durability (default: max)
   * @returns {number} - Repair cost in gold
   */
  static getRepairCost(equipmentId, targetDurability = null) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment || !equipment.durability) return 0;

    const currentDurability = this.getDurability(equipmentId);
    const maxDurability = equipment.durability.max;
    const finalTarget = targetDurability || maxDurability;

    const durabilityToRestore = finalTarget - currentDurability;
    if (durabilityToRestore <= 0) return 0;

    // Base cost per durability point
    const costPerPoint = equipment.durability.repairCostBase / maxDurability;

    // Total cost (rounded up)
    const totalCost = Math.ceil(costPerPoint * durabilityToRestore);

    return Math.max(1, totalCost); // Minimum 1 gold
  }

  /**
   * Check all equipped items for durability warnings
   * @returns {Array} - Array of items needing attention
   */
  static checkEquippedItemDurability() {
    const state = gameStore.getState();
    const equipped = state.equipped;
    const warnings = [];

    ['weapon', 'armor', 'accessory'].forEach((slot) => {
      const equipmentId = equipped[slot];
      if (!equipmentId) return;

      const equipment = getEquipmentById(equipmentId);
      if (!equipment || !equipment.durability) return;

      const durability = this.getDurability(equipmentId);
      const maxDurability = equipment.durability.max;
      const percentage = (durability / maxDurability) * 100;

      if (percentage <= 25) {
        warnings.push({
          slot,
          equipment,
          durability,
          maxDurability,
          percentage,
          severity: percentage === 0 ? 'broken' : 'critical',
        });
      } else if (percentage <= 50) {
        warnings.push({
          slot,
          equipment,
          durability,
          maxDurability,
          percentage,
          severity: 'warning',
        });
      }
    });

    return warnings;
  }

  /**
   * Get durability status color
   * @param {number} durability - Current durability
   * @param {number} maxDurability - Maximum durability
   * @returns {string} - Color code
   */
  static getDurabilityColor(durability, maxDurability = 100) {
    const percentage = (durability / maxDurability) * 100;

    if (percentage <= 0) return '#f44336'; // Red - Broken
    if (percentage <= 25) return '#ff5722'; // Deep Orange - Critical
    if (percentage <= 50) return '#ff9800'; // Orange - Warning
    if (percentage <= 75) return '#ffc107'; // Amber - Caution
    return '#4caf50'; // Green - Good
  }

  /**
   * Get durability status text
   * @param {number} durability - Current durability
   * @param {number} maxDurability - Maximum durability
   * @returns {string} - Status text
   */
  static getDurabilityStatus(durability, maxDurability = 100) {
    const percentage = (durability / maxDurability) * 100;

    if (percentage <= 0) return 'Broken';
    if (percentage <= 25) return 'Critical';
    if (percentage <= 50) return 'Damaged';
    if (percentage <= 75) return 'Worn';
    return 'Good';
  }

  /**
   * Initialize durability for newly acquired equipment
   * @param {string} equipmentId - Equipment ID
   */
  static initializeItemDurability(equipmentId) {
    const equipment = getEquipmentById(equipmentId);
    if (!equipment || !equipment.durability) return;

    const state = gameStore.getState();
    const durabilityMap = state.equipmentDurability || {};

    // Only initialize if not already set
    if (durabilityMap[equipmentId] === undefined) {
      gameStore.dispatch(updateDurability(equipmentId, equipment.durability.max));
    }
  }

  /**
   * Get all equipment durability info
   * @returns {Object} - Map of equipmentId -> durability info
   */
  static getAllDurability() {
    const state = gameStore.getState();
    const inventory = state.inventory.equipment || [];
    const result = {};

    inventory.forEach((equipmentId) => {
      const equipment = getEquipmentById(equipmentId);
      if (equipment && equipment.durability) {
        const current = this.getDurability(equipmentId);
        const max = equipment.durability.max;

        result[equipmentId] = {
          current,
          max,
          percentage: (current / max) * 100,
          status: this.getDurabilityStatus(current, max),
          color: this.getDurabilityColor(current, max),
          repairCost: this.getRepairCost(equipmentId),
        };
      }
    });

    return result;
  }
}
