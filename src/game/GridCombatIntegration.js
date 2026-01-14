/**
 * GridCombatIntegration - Integrates grid-based tactical combat with existing combat system
 */

import { gridManager } from './GridManager.js';
import { TerrainGenerator, TerrainEffectProcessor } from './TerrainSystem.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

/**
 * Grid Combat Actions
 */
export const GridActions = {
  MOVE: 'move',
  ATTACK: 'attack',
  SKILL: 'skill',
  DEFEND: 'defend',
  WAIT: 'wait',
};

/**
 * GridCombat Integration Manager
 */
export class GridCombatIntegration {
  constructor() {
    this.enabled = true; // Enable/disable grid combat
    this.currentFighter = null;
    this.selectedAction = null;
    this.movementRange = 2; // Base movement range
    this.attackRange = 1; // Base attack range (melee)
  }

  /**
   * Initialize grid for a new battle
   */
  initializeBattle(playerFighter, enemyFighter, battlefieldType = null) {
    // Generate terrain
    if (battlefieldType) {
      const layout = TerrainGenerator.generateByName(battlefieldType);
      this.applyLayout(layout);
    } else {
      const layout = TerrainGenerator.generateRandom();
      this.applyLayout(layout);
    }

    // Place fighters
    this.placeFightersInitial(playerFighter, enemyFighter);

    ConsoleLogger.info(LogCategory.GRID, '🗺️ Grid combat initialized');
  }

  /**
   * Apply terrain layout to grid
   */
  applyLayout(layout) {
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        gridManager.setTerrain(x, y, layout[y][x]);
      }
    }
  }

  /**
   * Place fighters at initial positions
   * Uses spawn zones to ensure fighters don't spawn on walls/impassable terrain
   */
  placeFightersInitial(playerFighter, enemyFighter) {
    // Get valid spawn zones
    const playerSpawnZones = gridManager.getValidSpawnZones('player');
    const enemySpawnZones = gridManager.getValidSpawnZones('enemy');

    // Place player fighter
    let playerPlaced = false;
    // Try preferred position (0,4) first if passable
    if (playerSpawnZones.some((pos) => pos.x === 0 && pos.y === 4)) {
      playerPlaced = gridManager.placeFighter(playerFighter, 0, 4);
    }
    // Fallback to any valid position in spawn zone
    if (!playerPlaced && playerSpawnZones.length > 0) {
      const randomPos = playerSpawnZones[Math.floor(Math.random() * playerSpawnZones.length)];
      playerPlaced = gridManager.placeFighter(playerFighter, randomPos.x, randomPos.y);
    }
    // Final fallback: try bottom row
    if (!playerPlaced) {
      for (let x = 0; x < 5; x++) {
        if (gridManager.placeFighter(playerFighter, x, 4)) {
          playerPlaced = true;
          break;
        }
      }
    }

    if (!playerPlaced) {
      ConsoleLogger.error(LogCategory.GRID, '⚠️ Failed to place player fighter on grid!');
    }

    // Place enemy fighter
    let enemyPlaced = false;
    // Try preferred position (4,0) first if passable
    if (enemySpawnZones.some((pos) => pos.x === 4 && pos.y === 0)) {
      enemyPlaced = gridManager.placeFighter(enemyFighter, 4, 0);
    }
    // Fallback to any valid position in spawn zone
    if (!enemyPlaced && enemySpawnZones.length > 0) {
      const randomPos = enemySpawnZones[Math.floor(Math.random() * enemySpawnZones.length)];
      enemyPlaced = gridManager.placeFighter(enemyFighter, randomPos.x, randomPos.y);
    }
    // Final fallback: try top row
    if (!enemyPlaced) {
      for (let x = 4; x >= 0; x--) {
        if (gridManager.placeFighter(enemyFighter, x, 0)) {
          enemyPlaced = true;
          break;
        }
      }
    }

    if (!enemyPlaced) {
      ConsoleLogger.error(LogCategory.GRID, '⚠️ Failed to place enemy fighter on grid!');
    }

    ConsoleLogger.info(
      LogCategory.GRID,
      `🗺️ Fighters placed: Player at (${playerFighter.gridPosition?.x}, ${playerFighter.gridPosition?.y}), Enemy at (${enemyFighter.gridPosition?.x}, ${enemyFighter.gridPosition?.y})`
    );
  }

  /**
   * Get valid spawn zones for a side
   * @param {string} side - 'player' or 'enemy'
   * @returns {Array} Valid spawn positions
   */
  getSpawnZonePositions(side = 'player') {
    return gridManager.getValidSpawnZones(side);
  }

  /**
   * Get available actions for a fighter
   */
  getAvailableActions(fighter) {
    if (!fighter.gridPosition) return [];

    const actions = [];

    // Movement is always available
    const validMoves = gridManager.getValidMoves(fighter, this.getMovementRange(fighter));
    if (validMoves.length > 0) {
      actions.push({
        type: GridActions.MOVE,
        name: 'Move',
        icon: '🏃',
        description: `Move up to ${this.getMovementRange(fighter)} spaces`,
        available: true,
      });
    }

    // Attack if enemies in range
    const enemiesInRange = gridManager.getEnemiesInRange(fighter, this.getAttackRange(fighter));
    if (enemiesInRange.length > 0) {
      actions.push({
        type: GridActions.ATTACK,
        name: 'Attack',
        icon: '⚔️',
        description: `Attack enemy in range (${enemiesInRange.length} targets)`,
        available: true,
      });
    }

    // Skills
    actions.push({
      type: GridActions.SKILL,
      name: 'Use Skill',
      icon: '✨',
      description: 'Use a special ability',
      available: fighter.mana >= 30,
    });

    // Defend
    actions.push({
      type: GridActions.DEFEND,
      name: 'Defend',
      icon: '🛡️',
      description: 'Reduce incoming damage by 50%',
      available: true,
    });

    // Wait (end turn)
    actions.push({
      type: GridActions.WAIT,
      name: 'Wait',
      icon: '⏸️',
      description: 'End turn without acting',
      available: true,
    });

    return actions;
  }

  /**
   * Get movement range for fighter
   */
  getMovementRange(fighter) {
    let range = this.movementRange;

    // Class bonuses
    if (fighter.class === 'ASSASSIN' || fighter.class === 'AGILE') {
      range += 1;
    } else if (fighter.class === 'TANK') {
      range -= 1;
    }

    // Equipment modifiers (e.g., Boots of Haste +1)
    if (fighter.movementBonus) {
      range += fighter.movementBonus;
      ConsoleLogger.debug(
        LogCategory.GRID,
        `⚡ Equipment movement bonus: +${fighter.movementBonus} (total: ${range})`
      );
    }

    // Status effects could modify this
    // TODO: Add status effect modifiers

    return Math.max(1, range);
  }

  /**
   * Get valid moves for a fighter
   * @param {string} fighterId - Fighter ID
   * @returns {Array} Array of {x, y, cost} objects
   */
  getValidMoves(fighterId) {
    const fighter = gridManager.getFighterById(fighterId);
    if (!fighter) {
      ConsoleLogger.warn(LogCategory.GRID, `Fighter with ID ${fighterId} not found on grid`);
      return [];
    }

    const range = this.getMovementRange(fighter);
    return gridManager.getValidMoves(fighter, range);
  }

  /**
   * Move fighter to new position
   * @param {string} fighterId - Fighter ID
   * @param {number} x - Target X coordinate
   * @param {number} y - Target Y coordinate
   * @returns {boolean} Success
   */
  moveFighter(fighterId, x, y) {
    const fighter = gridManager.getFighterById(fighterId);
    if (!fighter) {
      ConsoleLogger.warn(LogCategory.GRID, `Fighter with ID ${fighterId} not found on grid`);
      return false;
    }

    return this.executeMove(fighter, x, y);
  }

  /**
   * Get attack range for fighter
   */
  getAttackRange(fighter) {
    let range = this.attackRange;

    // Class bonuses
    if (fighter.class === 'MAGE') {
      range += 2; // Mages have ranged attacks
    } else if (fighter.class === 'ASSASSIN') {
      range += 1; // Assassins have extended reach
    }

    // Equipment could modify this
    // TODO: Add equipment modifiers

    return range;
  }

  /**
   * Execute movement
   */
  executeMove(fighter, targetX, targetY) {
    const validMoves = gridManager.getValidMoves(fighter, this.getMovementRange(fighter));
    const isValid = validMoves.some((m) => m.x === targetX && m.y === targetY);

    if (!isValid) {
      ConsoleLogger.warn(LogCategory.GRID, 'Invalid move target');
      return false;
    }

    const cell = gridManager.getCell(targetX, targetY);
    if (!cell || !cell.isPassable()) {
      ConsoleLogger.warn(LogCategory.GRID, 'Target cell is not passable');
      return false;
    }

    // Execute movement
    gridManager.placeFighter(fighter, targetX, targetY);
    ConsoleLogger.info(LogCategory.GRID, `🏃 ${fighter.name} moved to (${targetX}, ${targetY})`);

    return true;
  }

  /**
   * Execute attack
   */
  executeAttack(attacker, targetX, targetY) {
    const target = gridManager.getFighterAt(targetX, targetY);
    if (!target) {
      ConsoleLogger.warn(LogCategory.GRID, 'No target at position');
      return null;
    }

    // Check if target in range
    const enemiesInRange = gridManager.getEnemiesInRange(attacker, this.getAttackRange(attacker));
    const targetInRange = enemiesInRange.some((e) => e.x === targetX && e.y === targetY);

    if (!targetInRange) {
      ConsoleLogger.warn(LogCategory.GRID, 'Target not in attack range');
      return null;
    }

    // Calculate damage with terrain modifiers
    const attackerCell = gridManager.getCell(attacker.gridPosition.x, attacker.gridPosition.y);
    const defenderCell = gridManager.getCell(targetX, targetY);

    let baseDamage = attacker.hit();

    // Apply terrain modifiers
    baseDamage = TerrainEffectProcessor.calculateTerrainModifiedDamage(
      baseDamage,
      attackerCell,
      defenderCell
    );

    // Apply flanking bonus
    if (gridManager.isFlanked(target)) {
      baseDamage *= 1.25; // +25% damage when flanked
      ConsoleLogger.info(LogCategory.GRID, '💥 Flanking bonus! +25% damage');
    }

    // Deal damage
    target.takeDamage(baseDamage);

    ConsoleLogger.info(
      LogCategory.GRID,
      `⚔️ ${attacker.name} attacked ${target.name} for ${baseDamage} damage`
    );

    return {
      attacker,
      target,
      damage: baseDamage,
      flanked: gridManager.isFlanked(target),
    };
  }

  /**
   * Get combat info for UI
   */
  getCombatInfo(fighter) {
    if (!fighter.gridPosition) return null;

    const { x, y } = fighter.gridPosition;
    const cell = gridManager.getCell(x, y);

    const terrainBonuses = TerrainEffectProcessor.applyTerrainBonuses(fighter, cell);
    const isFlanked = gridManager.isFlanked(fighter);
    const validMoves = gridManager.getValidMoves(fighter, this.getMovementRange(fighter));
    const enemiesInRange = gridManager.getEnemiesInRange(fighter, this.getAttackRange(fighter));

    return {
      position: { x, y },
      terrain: cell.terrain,
      terrainBonuses,
      isFlanked,
      movementRange: this.getMovementRange(fighter),
      attackRange: this.getAttackRange(fighter),
      validMoves,
      enemiesInRange,
    };
  }

  /**
   * Apply terrain effects to a fighter
   * @param {string} fighterId - Fighter ID
   * @returns {Array} Array of effect descriptions
   */
  applyTerrainEffects(fighterId) {
    const fighter = gridManager.getFighterById(fighterId);
    if (!fighter || !fighter.gridPosition) {
      return [];
    }

    const { x, y } = fighter.gridPosition;
    const cell = gridManager.getCell(x, y);
    if (!cell) {
      return [];
    }

    const effects = [];
    const defenseBonus = cell.getDefenseBonus();
    const attackBonus = cell.getAttackBonus();

    if (defenseBonus !== 0) {
      const percentage = (defenseBonus * 100).toFixed(0);
      effects.push(`${cell.terrain}: ${percentage > 0 ? '+' : ''}${percentage}% defense`);
    }

    if (attackBonus !== 0) {
      const percentage = (attackBonus * 100).toFixed(0);
      effects.push(`${cell.terrain}: ${percentage > 0 ? '+' : ''}${percentage}% attack`);
    }

    if (effects.length === 0 && cell.terrain !== 'normal' && cell.terrain !== 'grass') {
      effects.push(`Standing on ${cell.terrain}`);
    }

    return effects;
  }

  /**
   * Check if an attack can hit the target (range + line of sight)
   */
  canAttack(attacker, target) {
    if (!attacker.gridPosition || !target.gridPosition) return false;

    // Check attack range
    const attackRange = attacker.getAttackRange ? attacker.getAttackRange() : 1;
    const inRange = gridManager.isInAttackRange(attacker.id, target.id, attackRange);

    if (!inRange) {
      return false;
    }

    // Check line of sight
    return gridManager.hasLineOfSight(
      attacker.gridPosition.x,
      attacker.gridPosition.y,
      target.gridPosition.x,
      target.gridPosition.y
    );
  }

  /**
   * Get attack range for a fighter
   */
  getAttackRangeForFighter(fighter) {
    return fighter.getAttackRange ? fighter.getAttackRange() : 1;
  }

  /**
   * Check if target is in attack range (without LOS check)
   */
  isTargetInRange(attackerId, targetId) {
    const attacker = gridManager.getFighterById(attackerId);
    const target = gridManager.getFighterById(targetId);

    if (!attacker || !target) return false;

    const attackRange = this.getAttackRangeForFighter(attacker);
    return gridManager.isInAttackRange(attackerId, targetId, attackRange);
  }

  /**
   * Clean up after battle
   */
  cleanup() {
    gridManager.clear();
    this.currentFighter = null;
    this.selectedAction = null;
  }

  /**
   * Toggle grid combat on/off
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    ConsoleLogger.info(LogCategory.GRID, `Grid combat ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if position is valid for placement
   */
  isValidPlacement(x, y) {
    const cell = gridManager.getCell(x, y);
    return cell && cell.isPassable();
  }

  /**
   * Get grid state for saving
   */
  getState() {
    return {
      enabled: this.enabled,
      gridState: gridManager.getState(),
    };
  }

  /**
   * Restore grid state
   */
  restoreState(state) {
    if (!state) return;

    this.enabled = state.enabled;
    // Grid state restoration would need fighters to be reconstructed
    // This is complex and might be handled differently
  }
}

// Singleton instance
export const gridCombatIntegration = new GridCombatIntegration();
