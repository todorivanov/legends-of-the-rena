/**
 * Weapon Range Configuration
 * Defines attack ranges for all weapon types
 */

export const WEAPON_TYPES = {
  // Melee weapons (range 1)
  SWORD: { range: 1, type: 'melee' },
  AXE: { range: 1, type: 'melee' },
  DAGGER: { range: 1, type: 'melee' },
  MACE: { range: 1, type: 'melee' },
  FIST: { range: 1, type: 'melee' },

  // Medium range (range 2)
  SPEAR: { range: 2, type: 'reach' },
  POLEARM: { range: 2, type: 'reach' },

  // Ranged weapons (range 3-4)
  BOW: { range: 4, type: 'ranged' },
  CROSSBOW: { range: 3, type: 'ranged' },

  // Magic weapons (range 3)
  STAFF: { range: 3, type: 'magic' },
  WAND: { range: 3, type: 'magic' },
};

/**
 * Equipment range mappings
 */
export const EQUIPMENT_RANGES = {
  // Swords - Melee (1)
  wooden_sword: { range: 1, weaponType: 'sword' },
  iron_sword: { range: 1, weaponType: 'sword' },
  steel_sword: { range: 1, weaponType: 'sword' },
  flame_blade: { range: 1, weaponType: 'sword' },
  frost_sword: { range: 1, weaponType: 'sword' },
  shadow_blade: { range: 1, weaponType: 'sword' },
  dragons_fang: { range: 1, weaponType: 'sword' },

  // Axes - Melee (1)
  steel_axe: { range: 1, weaponType: 'axe' },
  thunder_axe: { range: 1, weaponType: 'axe' },

  // Daggers - Melee (1)
  shadow_dagger: { range: 1, weaponType: 'dagger' },
  poison_dagger: { range: 1, weaponType: 'dagger' },

  // Staves - Magic (3)
  arcane_staff: { range: 3, weaponType: 'staff' },
  mystic_staff: { range: 3, weaponType: 'staff' },

  // Special/Legendary - Varied
  excalibur: { range: 2, weaponType: 'legendary_sword' }, // Extended reach
  infinity_blade: { range: 2, weaponType: 'legendary_sword' },
};

/**
 * Get weapon range from equipment item
 */
export function getWeaponRange(equipmentId) {
  const config = EQUIPMENT_RANGES[equipmentId];
  return config ? config.range : 1; // Default to melee
}

/**
 * Get weapon type
 */
export function getWeaponType(equipmentId) {
  const config = EQUIPMENT_RANGES[equipmentId];
  return config ? config.weaponType : 'sword'; // Default to sword
}
