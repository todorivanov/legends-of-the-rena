/**
 * GridManager - Manages the 5x5 tactical grid for combat
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

/**
 * Grid cell representing a position on the battlefield
 */
export class GridCell {
  constructor(x, y, terrain = 'normal') {
    this.x = x;
    this.y = y;
    this.terrain = terrain;
    this.occupant = null; // Fighter occupying this cell
    this.effects = []; // Temporary effects on this cell (fire, poison cloud, etc.)
  }

  /**
   * Check if cell is occupied
   */
  isOccupied() {
    return this.occupant !== null;
  }

  /**
   * Check if cell is passable
   */
  isPassable() {
    return this.terrain !== 'wall' && this.terrain !== 'pit' && !this.isOccupied();
  }

  /**
   * Get movement cost for this terrain
   */
  getMovementCost() {
    const costs = {
      normal: 1,
      grass: 1,
      forest: 2,
      water: 3,
      mud: 2,
      rock: 1,
      high_ground: 1,
      low_ground: 1,
      wall: Infinity,
      pit: Infinity,
    };
    return costs[this.terrain] || 1;
  }

  /**
   * Get defensive bonus for this terrain
   */
  getDefenseBonus() {
    const bonuses = {
      normal: 0,
      grass: 0,
      forest: 0.15, // +15% defense
      water: -0.1, // -10% defense (hard to move)
      mud: -0.05, // -5% defense
      rock: 0.1, // +10% defense
      high_ground: 0.2, // +20% defense
      low_ground: -0.15, // -15% defense
      wall: 0, // Can't stand on walls
      pit: 0, // Can't stand on pits
    };
    return bonuses[this.terrain] || 0;
  }

  /**
   * Get attack bonus for this terrain
   */
  getAttackBonus() {
    const bonuses = {
      normal: 0,
      grass: 0,
      forest: -0.1, // -10% attack (obstructed)
      water: -0.15, // -15% attack (unstable)
      mud: -0.1, // -10% attack
      rock: 0.05, // +5% attack (stable)
      high_ground: 0.25, // +25% attack (advantage)
      low_ground: -0.1, // -10% attack (disadvantage)
      wall: 0,
      pit: 0,
    };
    return bonuses[this.terrain] || 0;
  }
}

/**
 * GridManager - Main grid management system
 */
export class GridManager {
  constructor(width = 5, height = 5) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.initializeGrid();
  }

  /**
   * Initialize empty grid
   */
  initializeGrid() {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new GridCell(x, y));
      }
      this.grid.push(row);
    }
  }

  /**
   * Get cell at position
   */
  getCell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  /**
   * Set terrain at position
   */
  setTerrain(x, y, terrain) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.terrain = terrain;
    }
  }

  /**
   * Place fighter at position
   */
  placeFighter(fighter, x, y) {
    const cell = this.getCell(x, y);
    if (!cell || cell.isOccupied()) {
      ConsoleLogger.warn(
        LogCategory.GRID,
        `Cannot place fighter at (${x}, ${y}): cell occupied or invalid`
      );
      return false;
    }

    // Validate terrain is passable (prevent spawning on walls/pits)
    if (!cell.isPassable()) {
      ConsoleLogger.warn(
        LogCategory.GRID,
        `Cannot place fighter at (${x}, ${y}): terrain '${cell.terrain}' is impassable`
      );
      return false;
    }

    // Remove from old position
    this.removeFighter(fighter);

    // Place at new position
    cell.occupant = fighter;
    fighter.gridPosition = { x, y };
    return true;
  }

  /**
   * Remove fighter from grid
   */
  removeFighter(fighter) {
    if (!fighter.gridPosition) return;

    const { x, y } = fighter.gridPosition;
    const cell = this.getCell(x, y);
    if (cell && cell.occupant === fighter) {
      cell.occupant = null;
    }
    fighter.gridPosition = null;
  }

  /**
   * Get valid spawn zones for a side (player or enemy)
   * @param {string} side - 'player' or 'enemy'
   * @returns {Array} Array of {x, y} positions
   */
  getValidSpawnZones(side = 'player') {
    const validPositions = [];

    // Define spawn zones
    // Player spawn zone: bottom 2 rows (y=3,4)
    // Enemy spawn zone: top 2 rows (y=0,1)
    const rows = side === 'player' ? [3, 4] : [0, 1];

    for (const y of rows) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y);
        if (cell && cell.isPassable() && !cell.isOccupied()) {
          validPositions.push({ x, y });
        }
      }
    }

    return validPositions;
  }

  /**
   * Get fighter by ID
   */
  getFighterById(fighterId) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y);
        if (cell && cell.occupant && cell.occupant.id === fighterId) {
          return cell.occupant;
        }
      }
    }
    return null;
  }

  /**
   * Calculate grid distance between two positions (Manhattan distance)
   */
  getDistance(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }

  /**
   * Check if target is within attack range
   */
  isInAttackRange(attackerId, targetId, attackRange) {
    const attacker = this.getFighterById(attackerId);
    const target = this.getFighterById(targetId);

    if (!attacker || !target || !attacker.gridPosition || !target.gridPosition) {
      return false;
    }

    const distance = this.getDistance(
      attacker.gridPosition.x,
      attacker.gridPosition.y,
      target.gridPosition.x,
      target.gridPosition.y
    );

    return distance <= attackRange;
  }

  /**
   * Get all cells within attack range of a fighter
   */
  getCellsInRange(fighter, range) {
    if (!fighter || !fighter.gridPosition) return [];

    const cells = [];
    const { x: centerX, y: centerY } = fighter.gridPosition;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const distance = this.getDistance(centerX, centerY, x, y);
        if (distance <= range && distance > 0) {
          // Don't include own cell
          cells.push({ x, y, distance });
        }
      }
    }

    return cells;
  }

  /**
   * Get fighter at position
   */
  getFighterAt(x, y) {
    const cell = this.getCell(x, y);
    return cell ? cell.occupant : null;
  }

  /**
   * Calculate Euclidean distance between two points
   */
  getEuclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /**
   * Get all valid moves for a fighter (within movement range)
   */
  getValidMoves(fighter, maxDistance) {
    if (!fighter.gridPosition) return [];

    const { x, y } = fighter.gridPosition;
    const validMoves = [];

    // Check for special movement types from equipment
    const canPhaseThrough = fighter.movementSpecialTypes?.includes('phaseThrough');
    const ignoreTerrainCost = fighter.movementSpecialTypes?.includes('ignoreTerrainCost');

    // Use breadth-first search to find all reachable cells
    const queue = [{ x, y, cost: 0 }];
    const visited = new Set();
    visited.add(`${x},${y}`);

    while (queue.length > 0) {
      const current = queue.shift();

      // Check all adjacent cells
      const directions = [
        { dx: 0, dy: -1 }, // Up
        { dx: 1, dy: 0 }, // Right
        { dx: 0, dy: 1 }, // Down
        { dx: -1, dy: 0 }, // Left
      ];

      for (const dir of directions) {
        const newX = current.x + dir.dx;
        const newY = current.y + dir.dy;
        const key = `${newX},${newY}`;

        if (visited.has(key)) continue;

        const cell = this.getCell(newX, newY);
        if (!cell) continue;

        // Check passability (phaseThrough allows moving through occupied cells)
        const isOccupied = cell.occupant !== null;
        if (!canPhaseThrough && !cell.isPassable()) continue;
        if (canPhaseThrough && !cell.isPassable() && !isOccupied) continue; // Still can't move through walls/pits

        // Calculate movement cost
        let moveCost = ignoreTerrainCost ? 1 : cell.getMovementCost();
        const totalCost = current.cost + moveCost;

        if (totalCost <= maxDistance) {
          visited.add(key);
          // Don't allow ending movement on an occupied cell (even with phaseThrough)
          if (!isOccupied) {
            validMoves.push({ x: newX, y: newY, cost: totalCost });
          }
          // But can pass through it to reach other cells
          queue.push({ x: newX, y: newY, cost: totalCost });
        }
      }
    }

    // Remove starting position
    return validMoves.filter((move) => move.x !== x || move.y !== y);
  }

  /**
   * Check if there's line of sight between two positions
   */
  hasLineOfSight(x1, y1, x2, y2) {
    // Use Bresenham's line algorithm
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    while (true) {
      // Check current cell
      if (x !== x1 || y !== y1) {
        // Don't check starting position
        if (x !== x2 || y !== y2) {
          // Don't check ending position
          const cell = this.getCell(x, y);
          if (!cell) return false;

          // Walls and forests block line of sight
          if (cell.terrain === 'wall' || cell.terrain === 'forest') {
            return false;
          }
        }
      }

      // Reached target
      if (x === x2 && y === y2) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    return true;
  }

  /**
   * Get all enemies within attack range
   */
  getEnemiesInRange(attacker, range) {
    if (!attacker.gridPosition) return [];

    const { x, y } = attacker.gridPosition;
    const enemies = [];

    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const targetX = x + dx;
        const targetY = y + dy;

        const cell = this.getCell(targetX, targetY);
        if (!cell || !cell.occupant) continue;

        const target = cell.occupant;
        if (target === attacker) continue;

        // Check if enemy (different isPlayer flag)
        if (target.isPlayer !== attacker.isPlayer) {
          const distance = this.getDistance(x, y, targetX, targetY);
          if (distance <= range && this.hasLineOfSight(x, y, targetX, targetY)) {
            enemies.push({
              fighter: target,
              distance,
              x: targetX,
              y: targetY,
            });
          }
        }
      }
    }

    return enemies;
  }

  /**
   * Get neighbors of a cell (4-directional)
   */
  getNeighbors(x, y) {
    const neighbors = [];
    const directions = [
      { dx: 0, dy: -1 }, // Up
      { dx: 1, dy: 0 }, // Right
      { dx: 0, dy: 1 }, // Down
      { dx: -1, dy: 0 }, // Left
    ];

    for (const dir of directions) {
      const cell = this.getCell(x + dir.dx, y + dir.dy);
      if (cell) {
        neighbors.push(cell);
      }
    }

    return neighbors;
  }

  /**
   * Check if position is flanked (has enemies on opposite sides)
   */
  isFlanked(fighter) {
    if (!fighter.gridPosition) return false;

    const { x, y } = fighter.gridPosition;

    // Check for enemies on opposite sides
    const hasTopEnemy = this.hasEnemyAt(fighter, x, y - 1);
    const hasBottomEnemy = this.hasEnemyAt(fighter, x, y + 1);
    const hasLeftEnemy = this.hasEnemyAt(fighter, x - 1, y);
    const hasRightEnemy = this.hasEnemyAt(fighter, x + 1, y);

    return (
      (hasTopEnemy && hasBottomEnemy) ||
      (hasLeftEnemy && hasRightEnemy) ||
      (hasTopEnemy && hasLeftEnemy) ||
      (hasTopEnemy && hasRightEnemy) ||
      (hasBottomEnemy && hasLeftEnemy) ||
      (hasBottomEnemy && hasRightEnemy)
    );
  }

  /**
   * Check if there's an enemy at position
   */
  hasEnemyAt(fighter, x, y) {
    const target = this.getFighterAt(x, y);
    return target && target.isPlayer !== fighter.isPlayer;
  }

  /**
   * Generate random terrain layout
   */
  generateRandomTerrain(difficulty = 'normal') {
    this.initializeGrid();

    const terrainDistribution = {
      easy: { obstacles: 0.1, special: 0.15 },
      normal: { obstacles: 0.15, special: 0.2 },
      hard: { obstacles: 0.2, special: 0.25 },
    };

    const config = terrainDistribution[difficulty] || terrainDistribution.normal;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const rand = Math.random();

        if (rand < config.obstacles) {
          // Place obstacles
          const obstacles = ['forest', 'rock', 'water'];
          this.setTerrain(x, y, obstacles[Math.floor(Math.random() * obstacles.length)]);
        } else if (rand < config.obstacles + config.special) {
          // Place special terrain
          const special = ['high_ground', 'low_ground', 'mud'];
          this.setTerrain(x, y, special[Math.floor(Math.random() * special.length)]);
        }
      }
    }

    // Ensure starting positions are clear (corners)
    this.setTerrain(0, 0, 'normal');
    this.setTerrain(4, 0, 'normal');
    this.setTerrain(0, 4, 'normal');
    this.setTerrain(4, 4, 'normal');
    this.setTerrain(2, 2, 'normal'); // Center
  }

  /**
   * Reset grid to normal terrain
   */
  resetTerrain() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.setTerrain(x, y, 'normal');
      }
    }
  }

  /**
   * Get grid state for serialization
   */
  getState() {
    return {
      width: this.width,
      height: this.height,
      cells: this.grid.map((row) =>
        row.map((cell) => ({
          x: cell.x,
          y: cell.y,
          terrain: cell.terrain,
          occupant: cell.occupant ? cell.occupant.id : null,
        }))
      ),
    };
  }

  /**
   * Clear all fighters from grid
   */
  clear() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y);
        if (cell) {
          cell.occupant = null;
        }
      }
    }
  }
}

// Singleton instance
export const gridManager = new GridManager(5, 5);
