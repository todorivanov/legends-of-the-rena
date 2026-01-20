import type { Equipment, Rarity, CharacterClass } from '../types/game';

/**
 * Equipment Database - All 24 items
 * 10 Weapons, 8 Armor, 6 Accessories
 */

export const EQUIPMENT_DATABASE: Record<string, Omit<Equipment, 'durability' | 'maxDurability'>> = {
  // ============================================================================
  // WEAPONS (10)
  // ============================================================================
  
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    type: 'weapon',
    rarity: 'common',
    level: 1,
    price: 100,
    description: 'A basic training sword',
    stats: {
      strength: 5,
    },
  },
  
  iron_blade: {
    id: 'iron_blade',
    name: 'Iron Blade',
    type: 'weapon',
    rarity: 'common',
    level: 3,
    price: 250,
    description: 'A sturdy iron blade',
    stats: {
      strength: 10,
      critChance: 0.03,
    },
  },
  
  steel_longsword: {
    id: 'steel_longsword',
    name: 'Steel Longsword',
    type: 'weapon',
    rarity: 'rare',
    level: 5,
    price: 500,
    description: 'Finely crafted steel blade',
    stats: {
      strength: 15,
      critChance: 0.05,
    },
  },
  
  enchanted_staff: {
    id: 'enchanted_staff',
    name: 'Enchanted Staff',
    type: 'weapon',
    rarity: 'rare',
    level: 5,
    price: 600,
    description: 'A staff imbued with magical energy',
    stats: {
      strength: 12,
      manaRegen: 5,
    },
    requirements: {
      class: ['MAGE'],
    },
  },
  
  hunters_bow: {
    id: 'hunters_bow',
    name: "Hunter's Bow",
    type: 'weapon',
    rarity: 'rare',
    level: 6,
    price: 550,
    description: 'Precision ranged weapon',
    stats: {
      strength: 13,
      critChance: 0.08,
    },
    requirements: {
      class: ['RANGER'],
    },
  },
  
  warhammer: {
    id: 'warhammer',
    name: 'Warhammer',
    type: 'weapon',
    rarity: 'epic',
    level: 8,
    price: 1200,
    description: 'Devastating two-handed weapon',
    stats: {
      strength: 22,
      critChance: 0.08,
    },
    requirements: {
      class: ['WARRIOR', 'PALADIN'],
    },
  },
  
  arcane_scepter: {
    id: 'arcane_scepter',
    name: 'Arcane Scepter',
    type: 'weapon',
    rarity: 'epic',
    level: 10,
    price: 1500,
    description: 'Channel devastating magical power',
    stats: {
      strength: 18,
      manaRegen: 10,
    },
    requirements: {
      class: ['MAGE'],
    },
  },
  
  shadow_daggers: {
    id: 'shadow_daggers',
    name: 'Shadow Daggers',
    type: 'weapon',
    rarity: 'epic',
    level: 10,
    price: 1400,
    description: 'Strike from the shadows',
    stats: {
      strength: 16,
      critChance: 0.15,
      critDamage: 0.10,
    },
    requirements: {
      class: ['ROGUE', 'ASSASSIN'],
    },
  },
  
  excalibur: {
    id: 'excalibur',
    name: 'Excalibur',
    type: 'weapon',
    rarity: 'legendary',
    level: 15,
    price: 3000,
    description: 'The legendary blade of kings',
    stats: {
      strength: 35,
      critChance: 0.15,
      critDamage: 0.20,
    },
  },
  
  dragon_slayer: {
    id: 'dragon_slayer',
    name: 'Dragon Slayer',
    type: 'weapon',
    rarity: 'legendary',
    level: 15,
    price: 3500,
    description: 'Forged to slay the mightiest beasts',
    stats: {
      strength: 40,
      critChance: 0.10,
      critDamage: 0.15,
    },
    requirements: {
      class: ['WARRIOR', 'PALADIN'],
    },
  },
  
  // ============================================================================
  // ARMOR (8)
  // ============================================================================
  
  leather_vest: {
    id: 'leather_vest',
    name: 'Leather Vest',
    type: 'armor',
    rarity: 'common',
    level: 1,
    price: 120,
    description: 'Basic leather protection',
    stats: {
      health: 20,
    },
  },
  
  chainmail: {
    id: 'chainmail',
    name: 'Chainmail',
    type: 'armor',
    rarity: 'common',
    level: 3,
    price: 300,
    description: 'Interlocking metal rings',
    stats: {
      health: 30,
      defense: 5,
    },
  },
  
  knights_plate: {
    id: 'knights_plate',
    name: "Knight's Plate",
    type: 'armor',
    rarity: 'rare',
    level: 5,
    price: 600,
    description: 'Heavy plate armor',
    stats: {
      health: 50,
      defense: 10,
    },
    requirements: {
      class: ['WARRIOR', 'PALADIN', 'TANK'],
    },
  },
  
  mage_robes: {
    id: 'mage_robes',
    name: 'Mage Robes',
    type: 'armor',
    rarity: 'rare',
    level: 5,
    price: 550,
    description: 'Enchanted magical robes',
    stats: {
      health: 35,
      manaRegen: 8,
    },
    requirements: {
      class: ['MAGE'],
    },
  },
  
  rangers_leather: {
    id: 'rangers_leather',
    name: "Ranger's Leather",
    type: 'armor',
    rarity: 'rare',
    level: 5,
    price: 580,
    description: 'Lightweight and flexible',
    stats: {
      health: 40,
      defense: 5,
      critChance: 0.03,
    },
    requirements: {
      class: ['RANGER', 'ROGUE'],
    },
  },
  
  dragon_scale_armor: {
    id: 'dragon_scale_armor',
    name: 'Dragon Scale Armor',
    type: 'armor',
    rarity: 'epic',
    level: 10,
    price: 1800,
    description: 'Crafted from dragon scales',
    stats: {
      health: 80,
      defense: 15,
    },
  },
  
  titans_fortress: {
    id: 'titans_fortress',
    name: "Titan's Fortress",
    type: 'armor',
    rarity: 'legendary',
    level: 15,
    price: 3200,
    description: 'Impenetrable armor of legends',
    stats: {
      health: 120,
      defense: 25,
    },
    requirements: {
      class: ['WARRIOR', 'TANK', 'PALADIN'],
    },
  },
  
  aegis_of_legends: {
    id: 'aegis_of_legends',
    name: 'Aegis of Legends',
    type: 'armor',
    rarity: 'legendary',
    level: 15,
    price: 3500,
    description: 'The ultimate protection',
    stats: {
      health: 100,
      defense: 20,
      critChance: 0.10,
    },
  },
  
  // ============================================================================
  // ACCESSORIES (6)
  // ============================================================================
  
  bronze_ring: {
    id: 'bronze_ring',
    name: 'Bronze Ring',
    type: 'accessory',
    rarity: 'common',
    level: 1,
    price: 80,
    description: 'Simple bronze band',
    stats: {
      strength: 5,
    },
  },
  
  silver_amulet: {
    id: 'silver_amulet',
    name: 'Silver Amulet',
    type: 'accessory',
    rarity: 'rare',
    level: 5,
    price: 400,
    description: 'Blessed silver pendant',
    stats: {
      health: 10,
      critChance: 0.05,
    },
  },
  
  ruby_pendant: {
    id: 'ruby_pendant',
    name: 'Ruby Pendant',
    type: 'accessory',
    rarity: 'rare',
    level: 7,
    price: 700,
    description: 'Glowing red gemstone',
    stats: {
      strength: 15,
      critChance: 0.05,
    },
  },
  
  emerald_bracelet: {
    id: 'emerald_bracelet',
    name: 'Emerald Bracelet',
    type: 'accessory',
    rarity: 'epic',
    level: 10,
    price: 1300,
    description: 'Nature-infused jewelry',
    stats: {
      health: 20,
      strength: 10,
      manaRegen: 5,
    },
  },
  
  diamond_ring: {
    id: 'diamond_ring',
    name: 'Diamond Ring',
    type: 'accessory',
    rarity: 'epic',
    level: 12,
    price: 1600,
    description: 'Perfectly cut diamond',
    stats: {
      critChance: 0.15,
      critDamage: 0.15,
    },
  },
  
  crown_of_champions: {
    id: 'crown_of_champions',
    name: 'Crown of Champions',
    type: 'accessory',
    rarity: 'legendary',
    level: 15,
    price: 2800,
    description: 'Worn by arena champions',
    stats: {
      health: 30,
      strength: 20,
      defense: 10,
      critChance: 0.10,
    },
  },
};

/**
 * Create a new equipment instance with full durability
 */
export function createEquipment(equipmentId: string): Equipment {
  const base = EQUIPMENT_DATABASE[equipmentId];
  if (!base) {
    throw new Error(`Equipment ${equipmentId} not found`);
  }
  
  return {
    ...base,
    durability: 100,
    maxDurability: 100,
  };
}

/**
 * Get equipment by ID
 */
export function getEquipmentById(id: string) {
  return EQUIPMENT_DATABASE[id];
}

/**
 * Get all equipment
 */
export function getAllEquipment() {
  return Object.values(EQUIPMENT_DATABASE);
}

/**
 * Get equipment by type
 */
export function getEquipmentByType(type: string) {
  return Object.values(EQUIPMENT_DATABASE).filter(e => e.type === type);
}

/**
 * Get equipment by rarity
 */
export function getEquipmentByRarity(rarity: Rarity) {
  return Object.values(EQUIPMENT_DATABASE).filter(e => e.rarity === rarity);
}

/**
 * Check if player can equip item
 */
export function canEquip(item: Equipment, playerLevel: number, playerClass: CharacterClass): boolean {
  if (item.requirements?.level && playerLevel < item.requirements.level) {
    return false;
  }
  
  if (item.requirements?.class && !item.requirements.class.includes(playerClass)) {
    return false;
  }
  
  return true;
}

/**
 * Get durability status
 */
export function getDurabilityStatus(durability: number): {
  percentage: number;
  status: string;
  color: string;
} {
  const percentage = durability;
  
  if (percentage === 0) {
    return { percentage, status: 'Broken', color: '#000000' };
  } else if (percentage < 25) {
    return { percentage, status: 'Critical', color: '#f5222d' };
  } else if (percentage < 50) {
    return { percentage, status: 'Damaged', color: '#fa8c16' };
  } else if (percentage < 75) {
    return { percentage, status: 'Worn', color: '#faad14' };
  } else {
    return { percentage, status: 'Good', color: '#52c41a' };
  }
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: Rarity): string {
  const colors = {
    common: '#8c8c8c',
    rare: '#1890ff',
    epic: '#722ed1',
    legendary: '#fa8c16',
  };
  return colors[rarity];
}
