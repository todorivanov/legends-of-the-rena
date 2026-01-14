/**
 * TerrainSystem - Defines terrain types, effects, and visual properties
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

/**
 * Terrain type definitions
 */
export const TERRAIN_TYPES = {
  NORMAL: {
    id: 'normal',
    name: 'Normal Ground',
    icon: '◻️',
    color: '#e0e0e0',
    movementCost: 1,
    defenseBonus: 0,
    attackBonus: 0,
    description: 'Standard battlefield terrain',
    passable: true,
    blocksLOS: false,
  },

  GRASS: {
    id: 'grass',
    name: 'Grassland',
    icon: '🌱',
    color: '#81c784',
    movementCost: 1,
    defenseBonus: 0,
    attackBonus: 0,
    description: 'Open grassland, easy to traverse',
    passable: true,
    blocksLOS: false,
  },

  FOREST: {
    id: 'forest',
    name: 'Dense Forest',
    icon: '🌳',
    color: '#43a047',
    movementCost: 2,
    defenseBonus: 0.15,
    attackBonus: -0.1,
    description: 'Provides cover but hinders movement and attacks',
    passable: true,
    blocksLOS: true, // Blocks line of sight
  },

  WATER: {
    id: 'water',
    name: 'Shallow Water',
    icon: '💧',
    color: '#4fc3f7',
    movementCost: 3,
    defenseBonus: -0.1,
    attackBonus: -0.15,
    description: 'Difficult to move through, reduces combat effectiveness',
    passable: true,
    blocksLOS: false,
  },

  MUD: {
    id: 'mud',
    name: 'Muddy Ground',
    icon: '🟤',
    color: '#8d6e63',
    movementCost: 2,
    defenseBonus: -0.05,
    attackBonus: -0.1,
    description: 'Slows movement and reduces stability',
    passable: true,
    blocksLOS: false,
  },

  ROCK: {
    id: 'rock',
    name: 'Rocky Terrain',
    icon: '⬜',
    color: '#9e9e9e',
    movementCost: 1,
    defenseBonus: 0.1,
    attackBonus: 0.05,
    description: 'Stable ground provides slight defensive advantage',
    passable: true,
    blocksLOS: false,
  },

  HIGH_GROUND: {
    id: 'high_ground',
    name: 'High Ground',
    icon: '🏔️',
    color: '#bcaaa4',
    movementCost: 1,
    defenseBonus: 0.2,
    attackBonus: 0.25,
    description: 'Elevated position grants significant combat advantage',
    passable: true,
    blocksLOS: false,
  },

  LOW_GROUND: {
    id: 'low_ground',
    name: 'Low Ground',
    icon: '⬛',
    color: '#6d4c41',
    movementCost: 1,
    defenseBonus: -0.15,
    attackBonus: -0.1,
    description: 'Depression in terrain, disadvantageous position',
    passable: true,
    blocksLOS: false,
  },

  WALL: {
    id: 'wall',
    name: 'Stone Wall',
    icon: '🧱',
    color: '#757575',
    movementCost: Infinity,
    defenseBonus: 0,
    attackBonus: 0,
    description: 'Impassable obstacle',
    passable: false,
    blocksLOS: true,
  },

  PIT: {
    id: 'pit',
    name: 'Deep Pit',
    icon: '⚫',
    color: '#424242',
    movementCost: Infinity,
    defenseBonus: 0,
    attackBonus: 0,
    description: 'Dangerous pit, cannot be crossed',
    passable: false,
    blocksLOS: false,
  },
};

/**
 * Predefined battlefield layouts
 */
export const BATTLEFIELD_LAYOUTS = {
  OPEN_FIELD: {
    name: 'Open Field',
    description: 'Wide open battlefield with minimal cover',
    generate: () => {
      const layout = Array(5)
        .fill()
        .map(() => Array(5).fill('normal'));

      // Add some grass patches
      layout[1][2] = 'grass';
      layout[2][1] = 'grass';
      layout[2][3] = 'grass';
      layout[3][2] = 'grass';

      return layout;
    },
  },

  FOREST_CLEARING: {
    name: 'Forest Clearing',
    description: 'Dense forest with a central clearing',
    generate: () => {
      const layout = Array(5)
        .fill()
        .map(() => Array(5).fill('forest'));

      // Clear center area
      layout[1][1] = 'grass';
      layout[1][2] = 'grass';
      layout[1][3] = 'grass';
      layout[2][1] = 'grass';
      layout[2][2] = 'grass';
      layout[2][3] = 'grass';
      layout[3][1] = 'grass';
      layout[3][2] = 'grass';
      layout[3][3] = 'grass';

      return layout;
    },
  },

  RUINS: {
    name: 'Ancient Ruins',
    description: 'Crumbling walls and rocky terrain',
    generate: () => {
      const layout = Array(5)
        .fill()
        .map(() => Array(5).fill('rock'));

      // Add walls
      layout[1][2] = 'wall';
      layout[2][1] = 'wall';
      layout[2][3] = 'wall';
      layout[3][2] = 'wall';

      // Add some normal passages
      layout[0][1] = 'normal';
      layout[1][0] = 'normal';
      layout[3][4] = 'normal';
      layout[4][3] = 'normal';

      return layout;
    },
  },

  SWAMP: {
    name: 'Treacherous Swamp',
    description: 'Muddy and water-logged terrain',
    generate: () => {
      const layout = Array(5)
        .fill()
        .map(() => Array(5).fill('mud'));

      // Add water patches
      layout[1][1] = 'water';
      layout[1][3] = 'water';
      layout[3][1] = 'water';
      layout[3][3] = 'water';

      // Add some solid ground
      layout[0][0] = 'normal';
      layout[0][4] = 'normal';
      layout[4][0] = 'normal';
      layout[4][4] = 'normal';
      layout[2][2] = 'rock';

      return layout;
    },
  },

  MOUNTAIN_PASS: {
    name: 'Mountain Pass',
    description: 'Elevated terrain with strategic high ground',
    generate: () => {
      const layout = Array(5)
        .fill()
        .map(() => Array(5).fill('rock'));

      // Add high ground in center and corners
      layout[1][1] = 'high_ground';
      layout[1][3] = 'high_ground';
      layout[2][2] = 'high_ground';
      layout[3][1] = 'high_ground';
      layout[3][3] = 'high_ground';

      // Add low ground
      layout[0][2] = 'low_ground';
      layout[2][0] = 'low_ground';
      layout[2][4] = 'low_ground';
      layout[4][2] = 'low_ground';

      return layout;
    },
  },

  ARENA: {
    name: 'Combat Arena',
    description: 'Traditional fighting arena with walls',
    generate: () => {
      const layout = Array(5)
        .fill()
        .map(() => Array(5).fill('normal'));

      // Add walls around perimeter
      for (let i = 0; i < 5; i++) {
        if (i !== 2) {
          // Leave openings
          layout[0][i] = 'wall';
          layout[4][i] = 'wall';
          layout[i][0] = 'wall';
          layout[i][4] = 'wall';
        }
      }

      // Add some rocks for cover
      layout[1][2] = 'rock';
      layout[3][2] = 'rock';

      return layout;
    },
  },
};

/**
 * Terrain effect processor
 */
export class TerrainEffectProcessor {
  /**
   * Apply terrain bonuses to combat stats
   */
  static applyTerrainBonuses(fighter, cell) {
    if (!cell) return { defenseBonus: 0, attackBonus: 0 };

    return {
      defenseBonus: cell.getDefenseBonus(),
      attackBonus: cell.getAttackBonus(),
    };
  }

  /**
   * Calculate modified damage based on terrain
   */
  static calculateTerrainModifiedDamage(baseDamage, attackerCell, defenderCell) {
    let damage = baseDamage;

    // Attacker terrain bonus
    if (attackerCell) {
      const attackBonus = attackerCell.getAttackBonus();
      damage *= 1 + attackBonus;
    }

    // Defender terrain bonus
    if (defenderCell) {
      const defenseBonus = defenderCell.getDefenseBonus();
      // Defense bonus reduces incoming damage
      damage *= 1 - defenseBonus * 0.5; // 50% effectiveness on damage reduction
    }

    return Math.round(damage);
  }

  /**
   * Get terrain description for UI
   */
  static getTerrainDescription(terrain) {
    const terrainType = Object.values(TERRAIN_TYPES).find((t) => t.id === terrain);
    if (!terrainType) return 'Unknown terrain';

    let desc = `${terrainType.icon} ${terrainType.name}\n${terrainType.description}\n`;

    if (terrainType.movementCost > 1 && terrainType.movementCost !== Infinity) {
      desc += `\n⚠️ Movement: ${terrainType.movementCost} points`;
    } else if (terrainType.movementCost === Infinity) {
      desc += '\n🚫 Impassable';
    }

    if (terrainType.defenseBonus !== 0) {
      const sign = terrainType.defenseBonus > 0 ? '+' : '';
      desc += `\n🛡️ Defense: ${sign}${Math.round(terrainType.defenseBonus * 100)}%`;
    }

    if (terrainType.attackBonus !== 0) {
      const sign = terrainType.attackBonus > 0 ? '+' : '';
      desc += `\n⚔️ Attack: ${sign}${Math.round(terrainType.attackBonus * 100)}%`;
    }

    if (terrainType.blocksLOS) {
      desc += '\n👁️ Blocks line of sight';
    }

    return desc;
  }

  /**
   * Get terrain color for UI
   */
  static getTerrainColor(terrain) {
    const terrainType = Object.values(TERRAIN_TYPES).find((t) => t.id === terrain);
    return terrainType ? terrainType.color : '#e0e0e0';
  }

  /**
   * Get terrain icon for UI
   */
  static getTerrainIcon(terrain) {
    const terrainType = Object.values(TERRAIN_TYPES).find((t) => t.id === terrain);
    return terrainType ? terrainType.icon : '⬜';
  }
}

/**
 * Random terrain generator
 */
export class TerrainGenerator {
  /**
   * Generate random battlefield
   */
  static generateRandom(_difficulty = 'normal') {
    const layouts = Object.values(BATTLEFIELD_LAYOUTS);
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    return randomLayout.generate();
  }

  /**
   * Generate terrain by name
   */
  static generateByName(name) {
    const layout = BATTLEFIELD_LAYOUTS[name];
    if (!layout) {
      ConsoleLogger.warn(LogCategory.TERRAIN, `Unknown battlefield layout: ${name}`);
      return BATTLEFIELD_LAYOUTS.OPEN_FIELD.generate();
    }
    return layout.generate();
  }

  /**
   * Get random layout name
   */
  static getRandomLayoutName() {
    const names = Object.keys(BATTLEFIELD_LAYOUTS);
    return names[Math.floor(Math.random() * names.length)];
  }
}
