/**
 * Equipment Database
 * All available equipment items with stats and requirements
 */

export const EQUIPMENT_DATABASE = {
  // ========== WEAPONS ==========
  
  // Common Weapons
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    type: 'weapon',
    rarity: 'common',
    stats: {
      strength: 5,
    },
    requirements: {
      level: 1,
      class: ['WARRIOR', 'BALANCED'],
    },
    durability: {
      max: 100,
      degradationRate: 10, // Durability lost per battle
      repairCostBase: 8, // Base repair cost
    },
    description: 'A simple training sword. Better than nothing.',
    icon: '🗡️',
  },
  
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: 'weapon',
    rarity: 'common',
    stats: {
      strength: 8,
      critChance: 2,
    },
    requirements: {
      level: 3,
      class: ['WARRIOR', 'BALANCED'],
    },
    durability: {
      max: 100,
      degradationRate: 8,
      repairCostBase: 12,
    },
    description: 'A sturdy iron blade. Reliable in combat.',
    icon: '⚔️',
  },
  
  steel_axe: {
    id: 'steel_axe',
    name: 'Steel Axe',
    type: 'weapon',
    rarity: 'common',
    stats: {
      strength: 10,
    },
    requirements: {
      level: 4,
      class: ['WARRIOR', 'BRUISER'],
    },
    durability: {
      max: 100,
      degradationRate: 9,
      repairCostBase: 15,
    },
    description: 'Heavy but devastating. Cleaves through armor.',
    icon: '🪓',
  },
  
  // Rare Weapons
  flame_blade: {
    id: 'flame_blade',
    name: 'Flame Blade',
    type: 'weapon',
    rarity: 'rare',
    stats: {
      strength: 15,
      critChance: 5,
    },
    requirements: {
      level: 6,
      class: ['WARRIOR', 'GLASS_CANNON'],
    },
    durability: {
      max: 100,
      degradationRate: 7,
      repairCostBase: 25,
    },
    description: 'Enchanted with fire magic. Burns enemies on hit.',
    icon: '🔥',
  },
  
  shadow_dagger: {
    id: 'shadow_dagger',
    name: 'Shadow Dagger',
    type: 'weapon',
    rarity: 'rare',
    stats: {
      strength: 12,
      critChance: 10,
    },
    requirements: {
      level: 5,
      class: ['GLASS_CANNON', 'BALANCED'],
    },
    durability: {
      max: 100,
      degradationRate: 7,
      repairCostBase: 22,
    },
    description: 'Strike from the shadows. High critical chance.',
    icon: '🗡️',
  },
  
  arcane_staff: {
    id: 'arcane_staff',
    name: 'Arcane Staff',
    type: 'weapon',
    rarity: 'rare',
    stats: {
      strength: 10,
      manaRegen: 5,
    },
    requirements: {
      level: 5,
      class: ['BALANCED'],
    },
    durability: {
      max: 100,
      degradationRate: 6,
      repairCostBase: 28,
    },
    description: 'Channel magical energy. Increases mana regeneration.',
    icon: '🪄',
  },
  
  // Epic Weapons
  dragons_fang: {
    id: 'dragons_fang',
    name: "Dragon's Fang",
    type: 'weapon',
    rarity: 'epic',
    stats: {
      strength: 20,
      critChance: 8,
      critDamage: 20,
    },
    requirements: {
      level: 10,
      class: ['WARRIOR', 'GLASS_CANNON'],
    },
    durability: {
      max: 100,
      degradationRate: 5,
      repairCostBase: 60,
    },
    description: 'Forged from a dragon tooth. Legendary power.',
    icon: '🐉',
  },
  
  thunderstrike: {
    id: 'thunderstrike',
    name: 'Thunderstrike',
    type: 'weapon',
    rarity: 'epic',
    stats: {
      strength: 18,
      manaRegen: 10,
    },
    requirements: {
      level: 9,
      class: ['BALANCED', 'GLASS_CANNON'],
    },
    durability: {
      max: 100,
      degradationRate: 5,
      repairCostBase: 55,
    },
    description: 'Crackles with lightning. Devastating special attacks.',
    icon: '⚡',
  },
  
  // Legendary Weapon
  excalibur: {
    id: 'excalibur',
    name: 'Excalibur',
    type: 'weapon',
    rarity: 'legendary',
    stats: {
      strength: 25,
      health: 50,
      critChance: 10,
      critDamage: 30,
    },
    requirements: {
      level: 15,
      class: ['WARRIOR', 'BALANCED'],
    },
    durability: {
      max: 100,
      degradationRate: 3,
      repairCostBase: 150,
    },
    description: 'The legendary blade of heroes. Unmatched power.',
    icon: '🗡️',
  },
  
  // ========== ARMOR ==========
  
  // Common Armor
  leather_vest: {
    id: 'leather_vest',
    name: 'Leather Vest',
    type: 'armor',
    rarity: 'common',
    stats: {
      health: 30,
      defense: 5,
    },
    requirements: {
      level: 1,
    },
    durability: {
      max: 100,
      degradationRate: 9,
      repairCostBase: 8,
    },
    description: 'Light armor for beginners. Better than nothing.',
    icon: '🦺',
  },
  
  chainmail: {
    id: 'chainmail',
    name: 'Chainmail Armor',
    type: 'armor',
    rarity: 'common',
    stats: {
      health: 50,
      defense: 8,
    },
    requirements: {
      level: 3,
    },
    durability: {
      max: 100,
      degradationRate: 8,
      repairCostBase: 12,
    },
    description: 'Interlocked metal rings. Decent protection.',
    icon: '🛡️',
  },
  
  // Rare Armor
  steel_plate: {
    id: 'steel_plate',
    name: 'Steel Plate Armor',
    type: 'armor',
    rarity: 'rare',
    stats: {
      health: 80,
      defense: 15,
    },
    requirements: {
      level: 6,
      class: ['TANK', 'WARRIOR', 'BRUISER'],
    },
    durability: {
      max: 100,
      degradationRate: 6,
      repairCostBase: 25,
    },
    description: 'Heavy plate armor. Excellent defense.',
    icon: '🛡️',
  },
  
  mystic_robes: {
    id: 'mystic_robes',
    name: 'Mystic Robes',
    type: 'armor',
    rarity: 'rare',
    stats: {
      health: 40,
      manaRegen: 8,
      defense: 5,
    },
    requirements: {
      level: 5,
      class: ['BALANCED', 'GLASS_CANNON'],
    },
    durability: {
      max: 100,
      degradationRate: 7,
      repairCostBase: 22,
    },
    description: 'Enchanted robes. Light but magical.',
    icon: '👘',
  },
  
  // Epic Armor
  titans_guard: {
    id: 'titans_guard',
    name: "Titan's Guard",
    type: 'armor',
    rarity: 'epic',
    stats: {
      health: 120,
      defense: 20,
      strength: 5,
    },
    requirements: {
      level: 10,
      class: ['TANK', 'BRUISER'],
    },
    durability: {
      max: 100,
      degradationRate: 5,
      repairCostBase: 55,
    },
    description: 'Armor of ancient titans. Impenetrable defense.',
    icon: '🛡️',
  },
  
  phoenix_armor: {
    id: 'phoenix_armor',
    name: 'Phoenix Armor',
    type: 'armor',
    rarity: 'epic',
    stats: {
      health: 100,
      defense: 15,
      manaRegen: 10,
    },
    requirements: {
      level: 9,
    },
    durability: {
      max: 100,
      degradationRate: 5,
      repairCostBase: 60,
    },
    description: 'Born from phoenix flames. Grants resilience.',
    icon: '🔥',
  },
  
  // Legendary Armor
  aegis_of_legends: {
    id: 'aegis_of_legends',
    name: 'Aegis of Legends',
    type: 'armor',
    rarity: 'legendary',
    stats: {
      health: 150,
      defense: 30,
      strength: 10,
    },
    requirements: {
      level: 15,
    },
    durability: {
      max: 100,
      degradationRate: 3,
      repairCostBase: 140,
    },
    description: 'The ultimate shield. Protects against all harm.',
    icon: '🛡️',
  },
  
  // ========== ACCESSORIES ==========
  
  // Common Accessories
  bronze_ring: {
    id: 'bronze_ring',
    name: 'Bronze Ring',
    type: 'accessory',
    rarity: 'common',
    stats: {
      strength: 3,
      health: 10,
    },
    requirements: {
      level: 1,
    },
    durability: {
      max: 100,
      degradationRate: 6,
      repairCostBase: 7,
    },
    description: 'A simple ring. Provides minor bonuses.',
    icon: '💍',
  },
  
  // Rare Accessories
  amulet_of_power: {
    id: 'amulet_of_power',
    name: 'Amulet of Power',
    type: 'accessory',
    rarity: 'rare',
    stats: {
      strength: 10,
      critChance: 5,
    },
    requirements: {
      level: 5,
    },
    durability: {
      max: 100,
      degradationRate: 5,
      repairCostBase: 20,
    },
    description: 'Amplifies your strength. Feel the power!',
    icon: '📿',
  },
  
  mana_crystal: {
    id: 'mana_crystal',
    name: 'Mana Crystal',
    type: 'accessory',
    rarity: 'rare',
    stats: {
      manaRegen: 10,
      health: 20,
    },
    requirements: {
      level: 4,
    },
    durability: {
      max: 100,
      degradationRate: 5,
      repairCostBase: 18,
    },
    description: 'Pure crystallized mana. Endless energy.',
    icon: '💎',
  },
  
  // Epic Accessories
  ring_of_fury: {
    id: 'ring_of_fury',
    name: 'Ring of Fury',
    type: 'accessory',
    rarity: 'epic',
    stats: {
      strength: 15,
      critChance: 10,
      critDamage: 20,
    },
    requirements: {
      level: 8,
    },
    durability: {
      max: 100,
      degradationRate: 4,
      repairCostBase: 50,
    },
    description: 'Unleash devastating criticals. Pure rage!',
    icon: '💍',
  },
  
  void_pendant: {
    id: 'void_pendant',
    name: 'Void Pendant',
    type: 'accessory',
    rarity: 'epic',
    stats: {
      health: 80,
      defense: 10,
      manaRegen: 8,
    },
    requirements: {
      level: 9,
    },
    durability: {
      max: 100,
      degradationRate: 4,
      repairCostBase: 55,
    },
    description: 'Touched by the void. Balanced power.',
    icon: '🌀',
  },
  
  // Legendary Accessory
  crown_of_champions: {
    id: 'crown_of_champions',
    name: 'Crown of Champions',
    type: 'accessory',
    rarity: 'legendary',
    stats: {
      strength: 20,
      health: 100,
      critChance: 15,
      defense: 15,
      manaRegen: 15,
    },
    requirements: {
      level: 15,
    },
    durability: {
      max: 100,
      degradationRate: 2,
      repairCostBase: 160,
    },
    description: 'Worn by legends. The ultimate accessory.',
    icon: '👑',
  },
};

/**
 * Get equipment by ID
 */
export function getEquipmentById(id) {
  return EQUIPMENT_DATABASE[id] || null;
}

/**
 * Get all equipment of a specific type
 */
export function getEquipmentByType(type) {
  return Object.values(EQUIPMENT_DATABASE).filter(eq => eq.type === type);
}

/**
 * Get all equipment of a specific rarity
 */
export function getEquipmentByRarity(rarity) {
  return Object.values(EQUIPMENT_DATABASE).filter(eq => eq.rarity === rarity);
}

/**
 * Get equipment suitable for player level and class
 */
export function getAvailableEquipment(level, playerClass) {
  return Object.values(EQUIPMENT_DATABASE).filter(eq => {
    const meetsLevel = eq.requirements.level <= level;
    const meetsClass = !eq.requirements.class || eq.requirements.class.includes(playerClass);
    return meetsLevel && meetsClass;
  });
}

/**
 * Get random equipment drop based on level
 */
export function getRandomEquipmentDrop(playerLevel) {
  // Determine rarity chances based on level
  const roll = Math.random() * 100;
  let rarity;
  
  if (playerLevel >= 15 && roll < 2) {
    rarity = 'legendary'; // 2% at level 15+
  } else if (playerLevel >= 10 && roll < 10) {
    rarity = 'epic'; // 8% at level 10+
  } else if (playerLevel >= 5 && roll < 30) {
    rarity = 'rare'; // 20% at level 5+
  } else {
    rarity = 'common'; // 70% base
  }
  
  // Get equipment of that rarity that player can use
  const availableByRarity = Object.values(EQUIPMENT_DATABASE).filter(eq => 
    eq.rarity === rarity && eq.requirements.level <= playerLevel
  );
  
  if (availableByRarity.length === 0) {
    // Fallback to common if no equipment available
    const commonItems = getEquipmentByRarity('common');
    return commonItems[Math.floor(Math.random() * commonItems.length)];
  }
  
  return availableByRarity[Math.floor(Math.random() * availableByRarity.length)];
}

/**
 * Rarity color mapping
 */
export const RARITY_COLORS = {
  common: '#9e9e9e',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

/**
 * Rarity display names
 */
export const RARITY_NAMES = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};
