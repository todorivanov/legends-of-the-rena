import type { DifficultyLevel } from '../types/game';

/**
 * Difficulty System
 * Provides configurable challenge levels with stat modifiers and reward scaling
 */

export interface DifficultyModifiers {
  playerHealthMultiplier: number;
  playerDamageMultiplier: number;
  opponentHealthMultiplier: number;
  opponentDamageMultiplier: number;
  xpMultiplier: number;
  goldMultiplier: number;
  aiMistakeChance: number; // % chance AI makes suboptimal choice
}

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  description: string;
  icon: string;
  color: string;
  modifiers: DifficultyModifiers;
  requiredLevel?: number;
}

/**
 * Difficulty Configurations
 */
export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    description: 'For those new to arena combat. Enemies are weaker and more forgiving.',
    icon: '😊',
    color: '#4caf50',
    modifiers: {
      playerHealthMultiplier: 1.3,
      playerDamageMultiplier: 1.2,
      opponentHealthMultiplier: 0.7,
      opponentDamageMultiplier: 0.7,
      xpMultiplier: 0.8,
      goldMultiplier: 0.8,
      aiMistakeChance: 30,
    },
  },
  normal: {
    id: 'normal',
    name: 'Normal',
    description: 'Balanced combat for most players. A fair challenge.',
    icon: '⚔️',
    color: '#2196f3',
    modifiers: {
      playerHealthMultiplier: 1.0,
      playerDamageMultiplier: 1.0,
      opponentHealthMultiplier: 1.0,
      opponentDamageMultiplier: 1.0,
      xpMultiplier: 1.0,
      goldMultiplier: 1.0,
      aiMistakeChance: 15,
    },
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    description: 'For experienced fighters. Enemies hit harder and have more health.',
    icon: '🔥',
    color: '#ff9800',
    requiredLevel: 5,
    modifiers: {
      playerHealthMultiplier: 0.9,
      playerDamageMultiplier: 0.9,
      opponentHealthMultiplier: 1.3,
      opponentDamageMultiplier: 1.3,
      xpMultiplier: 1.3,
      goldMultiplier: 1.3,
      aiMistakeChance: 5,
    },
  },
  nightmare: {
    id: 'nightmare',
    name: 'Nightmare',
    description: 'Only for true champions. Enemies are relentless and unforgiving.',
    icon: '💀',
    color: '#9c27b0',
    requiredLevel: 10,
    modifiers: {
      playerHealthMultiplier: 0.75,
      playerDamageMultiplier: 0.8,
      opponentHealthMultiplier: 1.6,
      opponentDamageMultiplier: 1.6,
      xpMultiplier: 1.8,
      goldMultiplier: 1.8,
      aiMistakeChance: 0,
    },
  },
};

/**
 * Get difficulty configuration
 */
export function getDifficultyConfig(difficulty: DifficultyLevel): DifficultyConfig {
  return DIFFICULTIES[difficulty];
}

/**
 * Check if difficulty is unlocked
 */
export function isDifficultyUnlocked(difficulty: DifficultyLevel, playerLevel: number): boolean {
  const config = DIFFICULTIES[difficulty];
  return !config.requiredLevel || playerLevel >= config.requiredLevel;
}

/**
 * Apply difficulty modifiers to fighter stats
 */
export function applyDifficultyToFighter(
  baseHealth: number,
  baseDamage: number,
  difficulty: DifficultyLevel,
  isPlayer: boolean
): { health: number; damage: number } {
  const modifiers = DIFFICULTIES[difficulty].modifiers;

  if (isPlayer) {
    return {
      health: Math.floor(baseHealth * modifiers.playerHealthMultiplier),
      damage: Math.floor(baseDamage * modifiers.playerDamageMultiplier),
    };
  } else {
    return {
      health: Math.floor(baseHealth * modifiers.opponentHealthMultiplier),
      damage: Math.floor(baseDamage * modifiers.opponentDamageMultiplier),
    };
  }
}

/**
 * Apply difficulty modifiers to rewards
 */
export function applyDifficultyToRewards(
  baseXp: number,
  baseGold: number,
  difficulty: DifficultyLevel
): { xp: number; gold: number } {
  const modifiers = DIFFICULTIES[difficulty].modifiers;

  return {
    xp: Math.floor(baseXp * modifiers.xpMultiplier),
    gold: Math.floor(baseGold * modifiers.goldMultiplier),
  };
}

/**
 * Get AI mistake chance for difficulty
 */
export function getAIMistakeChance(difficulty: DifficultyLevel): number {
  return DIFFICULTIES[difficulty].modifiers.aiMistakeChance;
}

/**
 * Get all unlocked difficulties for a player
 */
export function getUnlockedDifficulties(playerLevel: number): DifficultyConfig[] {
  return Object.values(DIFFICULTIES).filter(config =>
    isDifficultyUnlocked(config.id, playerLevel)
  );
}
