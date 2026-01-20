import type { Fighter } from '../types/game';

// ============================================================================
// GRID COMBAT SYSTEM
// ============================================================================

export interface GridPosition {
  x: number;
  y: number;
}

export type TerrainType =
  | 'normal'
  | 'high_ground'
  | 'forest'
  | 'water'
  | 'wall'
  | 'lava'
  | 'ice'
  | 'trap'
  | 'healing_shrine'
  | 'mana_well';

export interface TerrainDefinition {
  type: TerrainType;
  name: string;
  description: string;
  walkable: boolean;
  movementCost: number;
  defenseModifier: number;
  damageModifier: number;
  effects?: {
    onEnter?: (fighter: Fighter) => { fighter: Fighter; message: string };
    onStay?: (fighter: Fighter) => { fighter: Fighter; message: string };
  };
}

export interface GridCell {
  position: GridPosition;
  terrain: TerrainType;
  occupant: 'player' | 'opponent' | null;
}

export interface GridState {
  width: number;
  height: number;
  cells: GridCell[][];
}

// ============================================================================
// TERRAIN DEFINITIONS
// ============================================================================

export const TERRAIN_DEFS: Record<TerrainType, TerrainDefinition> = {
  normal: {
    type: 'normal',
    name: 'Normal Ground',
    description: 'Standard terrain with no special effects',
    walkable: true,
    movementCost: 1,
    defenseModifier: 0,
    damageModifier: 0,
  },
  high_ground: {
    type: 'high_ground',
    name: 'High Ground',
    description: '+20% defense, +25% attack damage',
    walkable: true,
    movementCost: 2,
    defenseModifier: 0.2,
    damageModifier: 0.25,
  },
  forest: {
    type: 'forest',
    name: 'Forest',
    description: '+30% defense (concealment), -10% attack damage',
    walkable: true,
    movementCost: 2,
    defenseModifier: 0.3,
    damageModifier: -0.1,
  },
  water: {
    type: 'water',
    name: 'Water',
    description: 'Movement cost doubled, -15% defense',
    walkable: true,
    movementCost: 3,
    defenseModifier: -0.15,
    damageModifier: 0,
  },
  wall: {
    type: 'wall',
    name: 'Wall',
    description: 'Impassable terrain that blocks movement and line of sight',
    walkable: false,
    movementCost: Infinity,
    defenseModifier: 0,
    damageModifier: 0,
  },
  lava: {
    type: 'lava',
    name: 'Lava',
    description: 'Deal 50 damage per turn standing on it',
    walkable: true,
    movementCost: 2,
    defenseModifier: 0,
    damageModifier: 0,
    effects: {
      onStay: (fighter) => ({
        fighter: {
          ...fighter,
          currentHealth: Math.max(0, fighter.currentHealth - 50),
        },
        message: `${fighter.name} burns for 50 damage!`,
      }),
    },
  },
  ice: {
    type: 'ice',
    name: 'Ice',
    description: 'Slippery terrain, movement cost reduced but -20% defense',
    walkable: true,
    movementCost: 0.5,
    defenseModifier: -0.2,
    damageModifier: 0,
  },
  trap: {
    type: 'trap',
    name: 'Trap',
    description: 'Deals 100 damage when first entered',
    walkable: true,
    movementCost: 1,
    defenseModifier: 0,
    damageModifier: 0,
    effects: {
      onEnter: (fighter) => ({
        fighter: {
          ...fighter,
          currentHealth: Math.max(0, fighter.currentHealth - 100),
        },
        message: `${fighter.name} triggered a trap for 100 damage!`,
      }),
    },
  },
  healing_shrine: {
    type: 'healing_shrine',
    name: 'Healing Shrine',
    description: 'Restore 50 HP per turn',
    walkable: true,
    movementCost: 1,
    defenseModifier: 0.1,
    damageModifier: 0,
    effects: {
      onStay: (fighter) => ({
        fighter: {
          ...fighter,
          currentHealth: Math.min(fighter.maxHealth, fighter.currentHealth + 50),
        },
        message: `${fighter.name} restored 50 HP!`,
      }),
    },
  },
  mana_well: {
    type: 'mana_well',
    name: 'Mana Well',
    description: 'Restore 20 mana per turn',
    walkable: true,
    movementCost: 1,
    defenseModifier: 0,
    damageModifier: 0,
    effects: {
      onStay: (fighter) => ({
        fighter: {
          ...fighter,
          currentMana: Math.min(fighter.maxMana, fighter.currentMana + 20),
        },
        message: `${fighter.name} restored 20 mana!`,
      }),
    },
  },
};

// ============================================================================
// GRID GENERATION
// ============================================================================

/**
 * Create a new grid with specified dimensions
 */
export function createGrid(width: number = 5, height: number = 5): GridState {
  const cells: GridCell[][] = [];

  for (let y = 0; y < height; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        position: { x, y },
        terrain: 'normal',
        occupant: null,
      });
    }
    cells.push(row);
  }

  return { width, height, cells };
}

/**
 * Generate a grid with random terrain features
 */
export function generateRandomGrid(
  width: number = 5,
  height: number = 5,
  complexity: number = 0.2
): GridState {
  const grid = createGrid(width, height);

  // Add random terrain features
  const terrainTypes: TerrainType[] = [
    'high_ground',
    'forest',
    'water',
    'wall',
    'lava',
    'ice',
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Skip corners (spawn zones)
      if ((x === 0 && y === 0) || (x === width - 1 && y === height - 1)) {
        continue;
      }

      if (Math.random() < complexity) {
        const terrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
        grid.cells[y][x].terrain = terrain;
      }
    }
  }

  // Occasionally add special tiles
  if (Math.random() < 0.3) {
    const specialTiles: TerrainType[] = ['healing_shrine', 'mana_well', 'trap'];
    const special = specialTiles[Math.floor(Math.random() * specialTiles.length)];
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (grid.cells[y][x].occupant === null) {
      grid.cells[y][x].terrain = special;
    }
  }

  return grid;
}

// ============================================================================
// MOVEMENT & PATHFINDING
// ============================================================================

/**
 * Calculate movement range from a position
 */
export function getMovementRange(
  grid: GridState,
  start: GridPosition,
  moveSpeed: number
): GridPosition[] {
  const reachable: GridPosition[] = [];
  const visited = new Set<string>();
  const queue: Array<{ pos: GridPosition; cost: number }> = [{ pos: start, cost: 0 }];

  while (queue.length > 0) {
    const { pos, cost } = queue.shift()!;
    const key = `${pos.x},${pos.y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    // Add to reachable if not the starting position
    if (pos.x !== start.x || pos.y !== start.y) {
      reachable.push(pos);
    }

    // Explore neighbors
    const neighbors = getNeighbors(grid, pos);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (visited.has(neighborKey)) continue;

      const cell = grid.cells[neighbor.y][neighbor.x];
      const terrain = TERRAIN_DEFS[cell.terrain];

      if (!terrain.walkable) continue;
      if (cell.occupant !== null) continue;

      const moveCost = cost + terrain.movementCost;
      if (moveCost <= moveSpeed) {
        queue.push({ pos: neighbor, cost: moveCost });
      }
    }
  }

  return reachable;
}

/**
 * Find shortest path between two positions using BFS
 */
export function findPath(
  grid: GridState,
  start: GridPosition,
  end: GridPosition,
  moveSpeed: number
): GridPosition[] | null {
  if (start.x === end.x && start.y === end.y) return [];

  const queue: Array<{ pos: GridPosition; path: GridPosition[]; cost: number }> = [
    { pos: start, path: [], cost: 0 },
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { pos, path, cost } = queue.shift()!;
    const key = `${pos.x},${pos.y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (pos.x === end.x && pos.y === end.y) {
      return path;
    }

    const neighbors = getNeighbors(grid, pos);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (visited.has(neighborKey)) continue;

      const cell = grid.cells[neighbor.y][neighbor.x];
      const terrain = TERRAIN_DEFS[cell.terrain];

      if (!terrain.walkable) continue;
      if (cell.occupant !== null && (neighbor.x !== end.x || neighbor.y !== end.y)) continue;

      const moveCost = cost + terrain.movementCost;
      if (moveCost <= moveSpeed) {
        queue.push({
          pos: neighbor,
          path: [...path, neighbor],
          cost: moveCost,
        });
      }
    }
  }

  return null; // No path found
}

/**
 * Get adjacent positions (4-directional)
 */
export function getNeighbors(grid: GridState, pos: GridPosition): GridPosition[] {
  const neighbors: GridPosition[] = [];
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
  ];

  for (const dir of directions) {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;

    if (newX >= 0 && newX < grid.width && newY >= 0 && newY < grid.height) {
      neighbors.push({ x: newX, y: newY });
    }
  }

  return neighbors;
}

// ============================================================================
// DISTANCE & RANGE
// ============================================================================

/**
 * Calculate Manhattan distance between two positions
 */
export function getDistance(pos1: GridPosition, pos2: GridPosition): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

/**
 * Check if target is within attack range
 */
export function isInRange(
  attacker: GridPosition,
  target: GridPosition,
  range: number
): boolean {
  return getDistance(attacker, target) <= range;
}

/**
 * Get all positions within attack range
 */
export function getAttackRange(
  grid: GridState,
  pos: GridPosition,
  range: number
): GridPosition[] {
  const inRange: GridPosition[] = [];

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (x === pos.x && y === pos.y) continue;
      
      const targetPos = { x, y };
      if (isInRange(pos, targetPos, range)) {
        inRange.push(targetPos);
      }
    }
  }

  return inRange;
}

// ============================================================================
// LINE OF SIGHT
// ============================================================================

/**
 * Check if there's a clear line of sight between two positions
 * Uses Bresenham's line algorithm
 */
export function hasLineOfSight(
  grid: GridState,
  start: GridPosition,
  end: GridPosition
): boolean {
  // Use Bresenham's line algorithm
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const sx = start.x < end.x ? 1 : -1;
  const sy = start.y < end.y ? 1 : -1;
  let err = dx - dy;

  let x = start.x;
  let y = start.y;

  while (true) {
    // Skip start and end positions
    if ((x !== start.x || y !== start.y) && (x !== end.x || y !== end.y)) {
      const cell = grid.cells[y][x];
      if (cell.terrain === 'wall') {
        return false;
      }
    }

    if (x === end.x && y === end.y) break;

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

// ============================================================================
// GRID UPDATES
// ============================================================================

/**
 * Move a fighter on the grid
 */
export function moveFighter(
  grid: GridState,
  from: GridPosition,
  to: GridPosition,
  who: 'player' | 'opponent'
): GridState {
  const newGrid = JSON.parse(JSON.stringify(grid)) as GridState;
  
  newGrid.cells[from.y][from.x].occupant = null;
  newGrid.cells[to.y][to.x].occupant = who;
  
  return newGrid;
}

/**
 * Place fighters on the grid
 */
export function placeFighters(
  grid: GridState,
  playerPos: GridPosition,
  opponentPos: GridPosition
): GridState {
  const newGrid = JSON.parse(JSON.stringify(grid)) as GridState;
  
  newGrid.cells[playerPos.y][playerPos.x].occupant = 'player';
  newGrid.cells[opponentPos.y][opponentPos.x].occupant = 'opponent';
  
  return newGrid;
}

/**
 * Get terrain modifiers for a fighter's position
 */
export function getTerrainModifiers(grid: GridState, pos: GridPosition): {
  defense: number;
  damage: number;
} {
  const cell = grid.cells[pos.y][pos.x];
  const terrain = TERRAIN_DEFS[cell.terrain];
  
  return {
    defense: terrain.defenseModifier,
    damage: terrain.damageModifier,
  };
}

/**
 * Apply terrain effects when a fighter enters or stays on a cell
 */
export function applyTerrainEffects(
  grid: GridState,
  pos: GridPosition,
  fighter: Fighter,
  trigger: 'enter' | 'stay'
): { fighter: Fighter; messages: string[] } {
  const cell = grid.cells[pos.y][pos.x];
  const terrain = TERRAIN_DEFS[cell.terrain];
  const messages: string[] = [];

  let updatedFighter = fighter;

  if (trigger === 'enter' && terrain.effects?.onEnter) {
    const result = terrain.effects.onEnter(fighter);
    updatedFighter = result.fighter;
    messages.push(result.message);
  }

  if (trigger === 'stay' && terrain.effects?.onStay) {
    const result = terrain.effects.onStay(fighter);
    updatedFighter = result.fighter;
    messages.push(result.message);
  }

  return { fighter: updatedFighter, messages };
}

/**
 * Get movement speed for a fighter based on class
 */
export function getMovementSpeed(fighter: Fighter): number {
  const baseSpeed = 2;
  
  // Class modifiers
  const classModifiers: Record<string, number> = {
    ROGUE: 1,      // Rogues move +1 (total 3)
    TANK: -1,      // Tanks move -1 (total 1)
    RANGER: 0,     // Rangers normal (total 2)
    WARRIOR: 0,    // Warriors normal (total 2)
    MAGE: 0,       // Mages normal (total 2)
  };

  const modifier = classModifiers[fighter.class] || 0;
  return Math.max(1, baseSpeed + modifier);
}

/**
 * Get attack range for a fighter
 */
export function getFighterAttackRange(fighter: Fighter): number {
  // Melee classes have range 1, ranged classes have range 2-3
  const rangeByClass: Record<string, number> = {
    WARRIOR: 1,
    TANK: 1,
    ROGUE: 1,
    RANGER: 3,
    MAGE: 2,
  };

  return rangeByClass[fighter.class] || fighter.attackRange || 1;
}
