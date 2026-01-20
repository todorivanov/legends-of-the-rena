import type { Skill, CharacterClass } from '../types/game';

/**
 * Skills Database
 * Class-specific abilities with mana costs and cooldowns
 */

export const SKILLS_DATABASE: Record<string, Omit<Skill, 'cooldownRemaining'>> = {
  // BALANCED
  power_slash: {
    id: 'power_slash',
    name: 'Power Slash',
    description: 'A powerful strike dealing 150% damage',
    icon: '⚔️',
    manaCost: 20,
    cooldown: 2,
    type: 'damage',
    effects: [
      { type: 'damage', value: 1.5, target: 'enemy' },
    ],
    classRestriction: ['BALANCED'],
  },
  
  second_wind: {
    id: 'second_wind',
    name: 'Second Wind',
    description: 'Restore 20% HP and 30 mana',
    icon: '💨',
    manaCost: 40,
    cooldown: 4,
    type: 'heal',
    effects: [
      { type: 'heal', value: 0.2, target: 'self' },
    ],
    classRestriction: ['BALANCED'],
  },
  
  // WARRIOR
  whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind',
    description: 'Spin attack dealing 180% damage',
    icon: '🌀',
    manaCost: 25,
    cooldown: 3,
    type: 'damage',
    effects: [
      { type: 'damage', value: 1.8, target: 'enemy' },
    ],
    classRestriction: ['WARRIOR'],
  },
  
  cleave: {
    id: 'cleave',
    name: 'Cleave',
    description: 'Heavy strike dealing 200% damage',
    icon: '⚔️',
    manaCost: 35,
    cooldown: 4,
    type: 'damage',
    effects: [
      { type: 'damage', value: 2.0, target: 'enemy' },
    ],
    classRestriction: ['WARRIOR'],
  },
  
  // TANK
  iron_wall: {
    id: 'iron_wall',
    name: 'Iron Wall',
    description: 'Gain massive defense for 3 turns',
    icon: '🛡️',
    manaCost: 30,
    cooldown: 5,
    type: 'buff',
    effects: [
      { type: 'statusEffect', value: 30, target: 'self', statusEffect: 'fortify', duration: 3 },
    ],
    classRestriction: ['TANK'],
  },
  
  taunt_strike: {
    id: 'taunt_strike',
    name: 'Taunt Strike',
    description: 'Provoke enemy and gain defense',
    icon: '😤',
    manaCost: 20,
    cooldown: 3,
    type: 'buff',
    effects: [
      { type: 'damage', value: 1.2, target: 'enemy' },
      { type: 'statusEffect', value: 15, target: 'self', statusEffect: 'defenseBoost', duration: 2 },
    ],
    classRestriction: ['TANK'],
  },
  
  // MAGE
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    description: 'Hurl a ball of fire dealing 220% damage',
    icon: '🔥',
    manaCost: 40,
    cooldown: 3,
    type: 'damage',
    effects: [
      { type: 'damage', value: 2.2, target: 'enemy' },
      { type: 'statusEffect', value: 12, target: 'enemy', statusEffect: 'burn', duration: 3 },
    ],
    classRestriction: ['MAGE'],
  },
  
  mana_surge: {
    id: 'mana_surge',
    name: 'Mana Surge',
    description: 'Boost strength by 30 for 3 turns',
    icon: '✨',
    manaCost: 25,
    cooldown: 4,
    type: 'buff',
    effects: [
      { type: 'statusEffect', value: 30, target: 'self', statusEffect: 'strengthBoost', duration: 3 },
    ],
    classRestriction: ['MAGE'],
  },
  
  // ROGUE
  backstab: {
    id: 'backstab',
    name: 'Backstab',
    description: 'Strike from shadows, guaranteed crit',
    icon: '🗡️',
    manaCost: 30,
    cooldown: 4,
    type: 'damage',
    effects: [
      { type: 'damage', value: 2.5, target: 'enemy' },
    ],
    classRestriction: ['ROGUE'],
  },
  
  shadow_strike: {
    id: 'shadow_strike',
    name: 'Shadow Strike',
    description: 'Fast attack dealing 160% damage',
    icon: '🌑',
    manaCost: 20,
    cooldown: 2,
    type: 'damage',
    effects: [
      { type: 'damage', value: 1.6, target: 'enemy' },
    ],
    classRestriction: ['ROGUE', 'ASSASSIN'],
  },
  
  // BRAWLER
  haymaker: {
    id: 'haymaker',
    name: 'Haymaker',
    description: 'Devastating punch dealing 250% damage',
    icon: '👊',
    manaCost: 35,
    cooldown: 4,
    type: 'damage',
    effects: [
      { type: 'damage', value: 2.5, target: 'enemy' },
    ],
    classRestriction: ['BRAWLER'],
  },
  
  adrenaline: {
    id: 'adrenaline',
    name: 'Adrenaline',
    description: 'Enter rage mode, +40% damage but -20% defense',
    icon: '😡',
    manaCost: 25,
    cooldown: 5,
    type: 'buff',
    effects: [
      { type: 'statusEffect', value: 40, target: 'self', statusEffect: 'enrage', duration: 3 },
    ],
    classRestriction: ['BRAWLER'],
  },
  
  // PALADIN
  divine_shield: {
    id: 'divine_shield',
    name: 'Divine Shield',
    description: 'Holy protection reducing damage by 40%',
    icon: '✝️',
    manaCost: 35,
    cooldown: 5,
    type: 'buff',
    effects: [
      { type: 'statusEffect', value: 40, target: 'self', statusEffect: 'fortify', duration: 3 },
    ],
    classRestriction: ['PALADIN'],
  },
  
  holy_light: {
    id: 'holy_light',
    name: 'Holy Light',
    description: 'Heal 30% HP',
    icon: '✨',
    manaCost: 30,
    cooldown: 3,
    type: 'heal',
    effects: [
      { type: 'heal', value: 0.3, target: 'self' },
    ],
    classRestriction: ['PALADIN'],
  },
  
  // BRUISER
  ground_slam: {
    id: 'ground_slam',
    name: 'Ground Slam',
    description: 'Slam the ground dealing 180% damage',
    icon: '💥',
    manaCost: 30,
    cooldown: 3,
    type: 'damage',
    effects: [
      { type: 'damage', value: 1.8, target: 'enemy' },
      { type: 'statusEffect', value: 0, target: 'enemy', statusEffect: 'stunned', duration: 1 },
    ],
    classRestriction: ['BRUISER'],
  },
  
  intimidate: {
    id: 'intimidate',
    name: 'Intimidate',
    description: 'Weaken enemy reducing their stats',
    icon: '😈',
    manaCost: 20,
    cooldown: 4,
    type: 'debuff',
    effects: [
      { type: 'statusEffect', value: 15, target: 'enemy', statusEffect: 'weakness', duration: 3 },
    ],
    classRestriction: ['BRUISER'],
  },
  
  // RANGER
  multi_shot: {
    id: 'multi_shot',
    name: 'Multi Shot',
    description: 'Fire multiple arrows dealing 220% damage',
    icon: '🏹',
    manaCost: 35,
    cooldown: 3,
    type: 'damage',
    effects: [
      { type: 'damage', value: 2.2, target: 'enemy' },
    ],
    classRestriction: ['RANGER'],
  },
  
  hunters_mark: {
    id: 'hunters_mark',
    name: "Hunter's Mark",
    description: 'Mark target, making them vulnerable',
    icon: '🎯',
    manaCost: 25,
    cooldown: 4,
    type: 'debuff',
    effects: [
      { type: 'statusEffect', value: 25, target: 'enemy', statusEffect: 'vulnerable', duration: 3 },
    ],
    classRestriction: ['RANGER'],
  },
  
  // ASSASSIN
  assassinate: {
    id: 'assassinate',
    name: 'Assassinate',
    description: 'Lethal strike dealing 300% damage',
    icon: '💀',
    manaCost: 50,
    cooldown: 5,
    type: 'damage',
    effects: [
      { type: 'damage', value: 3.0, target: 'enemy' },
    ],
    classRestriction: ['ASSASSIN'],
  },
  
  vanish: {
    id: 'vanish',
    name: 'Vanish',
    description: 'Disappear and boost next attack by 80%',
    icon: '👻',
    manaCost: 30,
    cooldown: 4,
    type: 'buff',
    effects: [
      { type: 'statusEffect', value: 30, target: 'self', statusEffect: 'strengthBoost', duration: 2 },
    ],
    classRestriction: ['ASSASSIN'],
  },
};

/**
 * Get skill by ID
 */
export function getSkillById(id: string): Omit<Skill, 'cooldownRemaining'> | null {
  return SKILLS_DATABASE[id] || null;
}

/**
 * Get skills for a class
 */
export function getSkillsForClass(characterClass: CharacterClass): Omit<Skill, 'cooldownRemaining'>[] {
  return Object.values(SKILLS_DATABASE).filter(
    skill => skill.classRestriction?.includes(characterClass)
  );
}

/**
 * Create skill instance with cooldown
 */
export function createSkillInstance(skillId: string): Skill {
  const base = SKILLS_DATABASE[skillId];
  if (!base) {
    throw new Error(`Skill ${skillId} not found`);
  }
  
  return {
    ...base,
    cooldownRemaining: 0,
  };
}
