import type { CharacterClass } from '../types/game';

/**
 * Action types that can be tracked in combos
 */
export type ComboActionType = 'attack' | 'defend' | 'skill' | 'item';

export interface ComboAction {
  type: ComboActionType;
  skill?: string; // Skill ID if type is 'skill'
  timestamp: number;
}

export interface ComboBonus {
  damageMultiplier?: number;
  extraDamage?: number;
  heal?: number;
  manaRestore?: number;
  statusEffect?: string;
  cooldownReduce?: number;
}

export interface ComboDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  sequence: Array<{ type: ComboActionType; skill?: string }>;
  requiredClass?: CharacterClass;
  bonus: ComboBonus;
}

/**
 * Combo Definitions Database
 */
export const COMBO_DEFINITIONS: ComboDefinition[] = [
  // ===== UNIVERSAL COMBOS (Any Class) =====
  {
    id: 'offensive_surge',
    name: 'Offensive Surge',
    description: 'Two consecutive attacks build momentum',
    icon: '⚔️',
    sequence: [{ type: 'attack' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.3,
      extraDamage: 10,
    },
  },

  {
    id: 'berserker_rush',
    name: 'Berserker Rush',
    description: 'Three attacks in a row unleash fury',
    icon: '🔥',
    sequence: [{ type: 'attack' }, { type: 'attack' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.5,
      extraDamage: 25,
      statusEffect: 'strengthBoost',
    },
  },

  {
    id: 'tactical_retreat',
    name: 'Tactical Retreat',
    description: 'Defend then strike for calculated damage',
    icon: '🛡️',
    sequence: [{ type: 'defend' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.4,
      heal: 15,
    },
  },

  {
    id: 'double_defense',
    name: 'Double Defense',
    description: 'Consecutive defenses build resilience',
    icon: '🏰',
    sequence: [{ type: 'defend' }, { type: 'defend' }],
    bonus: {
      heal: 30,
      statusEffect: 'defenseBoost',
    },
  },

  // ===== TANK COMBOS =====
  {
    id: 'iron_fortress',
    name: 'Iron Fortress',
    description: 'Iron Wall followed by devastating counter',
    icon: '🛡️⚔️',
    requiredClass: 'TANK',
    sequence: [{ type: 'skill', skill: 'iron_wall' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.6,
      extraDamage: 30,
      heal: 20,
    },
  },

  {
    id: 'unstoppable_force',
    name: 'Unstoppable Force',
    description: 'Taunt followed by powerful strike',
    icon: '💪',
    requiredClass: 'TANK',
    sequence: [{ type: 'skill', skill: 'taunt_strike' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.5,
      cooldownReduce: 1,
    },
  },

  // ===== BALANCED COMBOS =====
  {
    id: 'perfect_balance',
    name: 'Perfect Balance',
    description: 'Power Slash then Second Wind',
    icon: '⚖️',
    requiredClass: 'BALANCED',
    sequence: [
      { type: 'skill', skill: 'power_slash' },
      { type: 'skill', skill: 'second_wind' },
    ],
    bonus: {
      heal: 40,
      manaRestore: 20,
      cooldownReduce: 1,
    },
  },

  {
    id: 'warriors_resolve',
    name: "Warrior's Resolve",
    description: 'Heal then strike with renewed vigor',
    icon: '💨',
    requiredClass: 'BALANCED',
    sequence: [{ type: 'skill', skill: 'second_wind' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.4,
      extraDamage: 20,
    },
  },

  // ===== WARRIOR COMBOS =====
  {
    id: 'devastation',
    name: 'Devastation',
    description: 'Whirlwind into massive Cleave',
    icon: '⚔️🌀',
    requiredClass: 'WARRIOR',
    sequence: [
      { type: 'skill', skill: 'whirlwind' },
      { type: 'skill', skill: 'cleave' },
    ],
    bonus: {
      damageMultiplier: 2.0,
      extraDamage: 50,
    },
  },

  {
    id: 'relentless_assault',
    name: 'Relentless Assault',
    description: 'Cleave followed by attacks',
    icon: '⚔️⚔️',
    requiredClass: 'WARRIOR',
    sequence: [{ type: 'skill', skill: 'cleave' }, { type: 'attack' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.7,
      extraDamage: 35,
      heal: 25,
    },
  },

  // ===== MAGE COMBOS =====
  {
    id: 'arcane_inferno',
    name: 'Arcane Inferno',
    description: 'Mana Surge into devastating Fireball',
    icon: '✨🔥',
    requiredClass: 'MAGE',
    sequence: [
      { type: 'skill', skill: 'mana_surge' },
      { type: 'skill', skill: 'fireball' },
    ],
    bonus: {
      damageMultiplier: 2.0,
      extraDamage: 50,
      manaRestore: 25,
    },
  },

  {
    id: 'elemental_barrage',
    name: 'Elemental Barrage',
    description: 'Fireball then attack for burn synergy',
    icon: '🔥⚔️',
    requiredClass: 'MAGE',
    sequence: [{ type: 'skill', skill: 'fireball' }, { type: 'attack' }],
    bonus: {
      damageMultiplier: 1.5,
      statusEffect: 'burn',
    },
  },

  // ===== ROGUE COMBOS =====
  {
    id: 'silent_death',
    name: 'Silent Death',
    description: 'Shadow Strike from defensive position',
    icon: '🌑💀',
    requiredClass: 'ROGUE',
    sequence: [{ type: 'defend' }, { type: 'skill', skill: 'shadow_strike' }],
    bonus: {
      damageMultiplier: 1.8,
      extraDamage: 40,
      cooldownReduce: 1,
    },
  },

  {
    id: 'assassination',
    name: 'Assassination',
    description: 'Backstab into Shadow Strike',
    icon: '🗡️🌑',
    requiredClass: 'ROGUE',
    sequence: [
      { type: 'skill', skill: 'backstab' },
      { type: 'skill', skill: 'shadow_strike' },
    ],
    bonus: {
      damageMultiplier: 2.5,
      extraDamage: 60,
    },
  },
];

/**
 * Check if a sequence of actions matches any combo
 */
export function checkForCombo(
  actionHistory: ComboAction[],
  playerClass: CharacterClass
): ComboDefinition | null {
  // Get last 5 actions
  const recentActions = actionHistory.slice(-5);
  
  // Check each combo definition
  for (const combo of COMBO_DEFINITIONS) {
    // Skip if class doesn't match
    if (combo.requiredClass && combo.requiredClass !== playerClass) {
      continue;
    }
    
    // Check if sequence matches (from end of history)
    if (matchesSequence(recentActions, combo.sequence)) {
      return combo;
    }
  }
  
  return null;
}

/**
 * Check if action history matches a combo sequence
 */
function matchesSequence(
  history: ComboAction[],
  sequence: Array<{ type: ComboActionType; skill?: string }>
): boolean {
  if (history.length < sequence.length) {
    return false;
  }
  
  // Check from the end of history
  const startIndex = history.length - sequence.length;
  
  for (let i = 0; i < sequence.length; i++) {
    const historyAction = history[startIndex + i];
    const sequenceAction = sequence[i];
    
    // Type must match
    if (historyAction.type !== sequenceAction.type) {
      return false;
    }
    
    // If skill is specified, it must match
    if (sequenceAction.skill && historyAction.skill !== sequenceAction.skill) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all combos available for a class
 */
export function getCombosForClass(characterClass: CharacterClass): ComboDefinition[] {
  return COMBO_DEFINITIONS.filter(
    combo => !combo.requiredClass || combo.requiredClass === characterClass
  );
}
