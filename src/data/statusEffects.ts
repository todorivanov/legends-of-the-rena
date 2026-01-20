import type { StatusEffectType } from '../types/game';

/**
 * Status Effects Database
 * All 17 status effects with descriptions and mechanics
 */

export interface StatusEffectDefinition {
  type: StatusEffectType;
  name: string;
  icon: string;
  description: string;
  category: 'dot' | 'hot' | 'buff' | 'debuff' | 'control';
  defaultDuration: number;
  defaultValue: number;
  maxStacks: number;
  color: string;
}

export const STATUS_EFFECTS: Record<StatusEffectType, StatusEffectDefinition> = {
  // Damage Over Time
  poison: {
    type: 'poison',
    name: 'Poison',
    icon: '☠️',
    description: 'Takes damage over time',
    category: 'dot',
    defaultDuration: 4,
    defaultValue: 10,
    maxStacks: 5,
    color: '#52c41a',
  },
  
  burn: {
    type: 'burn',
    name: 'Burn',
    icon: '🔥',
    description: 'Fire damage over time',
    category: 'dot',
    defaultDuration: 3,
    defaultValue: 12,
    maxStacks: 3,
    color: '#fa541c',
  },
  
  bleed: {
    type: 'bleed',
    name: 'Bleed',
    icon: '🩸',
    description: 'Bleeding wound dealing damage',
    category: 'dot',
    defaultDuration: 4,
    defaultValue: 8,
    maxStacks: 5,
    color: '#cf1322',
  },
  
  shock: {
    type: 'shock',
    name: 'Shock',
    icon: '⚡',
    description: 'Lightning damage',
    category: 'dot',
    defaultDuration: 2,
    defaultValue: 15,
    maxStacks: 1,
    color: '#fadb14',
  },
  
  // Healing Over Time
  regeneration: {
    type: 'regeneration',
    name: 'Regeneration',
    icon: '💚',
    description: 'Healing over time',
    category: 'hot',
    defaultDuration: 5,
    defaultValue: 15,
    maxStacks: 3,
    color: '#52c41a',
  },
  
  // Buffs
  strengthBoost: {
    type: 'strengthBoost',
    name: 'Strength Boost',
    icon: '💪',
    description: 'Increased strength',
    category: 'buff',
    defaultDuration: 3,
    defaultValue: 20,
    maxStacks: 1,
    color: '#fa8c16',
  },
  
  defenseBoost: {
    type: 'defenseBoost',
    name: 'Defense Boost',
    icon: '🛡️',
    description: 'Increased defense',
    category: 'buff',
    defaultDuration: 3,
    defaultValue: 15,
    maxStacks: 1,
    color: '#1890ff',
  },
  
  bless: {
    type: 'bless',
    name: 'Bless',
    icon: '✨',
    description: '+25% damage dealt',
    category: 'buff',
    defaultDuration: 3,
    defaultValue: 25,
    maxStacks: 1,
    color: '#fadb14',
  },
  
  haste: {
    type: 'haste',
    name: 'Haste',
    icon: '💨',
    description: '+40% action speed',
    category: 'buff',
    defaultDuration: 3,
    defaultValue: 40,
    maxStacks: 1,
    color: '#13c2c2',
  },
  
  fortify: {
    type: 'fortify',
    name: 'Fortify',
    icon: '⛰️',
    description: '-30% damage taken',
    category: 'buff',
    defaultDuration: 3,
    defaultValue: 30,
    maxStacks: 2,
    color: '#8c8c8c',
  },
  
  enrage: {
    type: 'enrage',
    name: 'Enrage',
    icon: '😡',
    description: '+40% damage, -20% defense',
    category: 'buff',
    defaultDuration: 2,
    defaultValue: 40,
    maxStacks: 1,
    color: '#f5222d',
  },
  
  // Debuffs
  weakness: {
    type: 'weakness',
    name: 'Weakness',
    icon: '😰',
    description: '-15 to all stats',
    category: 'debuff',
    defaultDuration: 3,
    defaultValue: 15,
    maxStacks: 1,
    color: '#8c8c8c',
  },
  
  curse: {
    type: 'curse',
    name: 'Curse',
    icon: '🌑',
    description: '-25% healing received',
    category: 'debuff',
    defaultDuration: 4,
    defaultValue: 25,
    maxStacks: 1,
    color: '#722ed1',
  },
  
  slow: {
    type: 'slow',
    name: 'Slow',
    icon: '🐌',
    description: '-40% action speed',
    category: 'debuff',
    defaultDuration: 3,
    defaultValue: 40,
    maxStacks: 1,
    color: '#597ef7',
  },
  
  vulnerable: {
    type: 'vulnerable',
    name: 'Vulnerable',
    icon: '🎯',
    description: '+25% damage taken',
    category: 'debuff',
    defaultDuration: 3,
    defaultValue: 25,
    maxStacks: 1,
    color: '#ff4d4f',
  },
  
  // Control
  frozen: {
    type: 'frozen',
    name: 'Frozen',
    icon: '❄️',
    description: 'Cannot act',
    category: 'control',
    defaultDuration: 1,
    defaultValue: 0,
    maxStacks: 1,
    color: '#40a9ff',
  },
  
  stunned: {
    type: 'stunned',
    name: 'Stunned',
    icon: '😵',
    description: 'Cannot act',
    category: 'control',
    defaultDuration: 1,
    defaultValue: 0,
    maxStacks: 1,
    color: '#faad14',
  },
};

/**
 * Get status effect definition
 */
export function getStatusEffectDef(type: StatusEffectType): StatusEffectDefinition {
  return STATUS_EFFECTS[type];
}

/**
 * Get all status effects
 */
export function getAllStatusEffects(): StatusEffectDefinition[] {
  return Object.values(STATUS_EFFECTS);
}

/**
 * Get status effects by category
 */
export function getStatusEffectsByCategory(category: string): StatusEffectDefinition[] {
  return Object.values(STATUS_EFFECTS).filter(e => e.category === category);
}
