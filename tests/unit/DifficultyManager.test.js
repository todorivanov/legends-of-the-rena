/**
 * DifficultyManager Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DifficultyManager,
  DIFFICULTY_LEVELS,
  DIFFICULTY_CONFIG,
} from '../../src/game/DifficultyManager.js';

// Mock SaveManager
vi.mock('../../src/utils/SaveManagerV2.js', () => {
  let mockData = { settings: { difficulty: 'normal' } };
  return {
    SaveManagerV2: {
      get: vi.fn((key) => {
        const keys = key.split('.');
        let value = mockData;
        for (const k of keys) {
          value = value?.[k];
        }
        return value;
      }),
      update: vi.fn((key, value) => {
        const keys = key.split('.');
        let obj = mockData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
      }),
      _setMockData: (data) => {
        mockData = data;
      },
    },
  };
});

describe('DifficultyManager', () => {
  beforeEach(async () => {
    const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
    SaveManagerV2._setMockData({ settings: { difficulty: 'normal' } });
    vi.clearAllMocks();
  });

  describe('DIFFICULTY_LEVELS', () => {
    it('should have all difficulty levels defined', () => {
      expect(DIFFICULTY_LEVELS.EASY).toBe('easy');
      expect(DIFFICULTY_LEVELS.NORMAL).toBe('normal');
      expect(DIFFICULTY_LEVELS.HARD).toBe('hard');
      expect(DIFFICULTY_LEVELS.NIGHTMARE).toBe('nightmare');
    });
  });

  describe('DIFFICULTY_CONFIG', () => {
    it('should have configuration for all difficulty levels', () => {
      expect(DIFFICULTY_CONFIG.easy).toBeDefined();
      expect(DIFFICULTY_CONFIG.normal).toBeDefined();
      expect(DIFFICULTY_CONFIG.hard).toBeDefined();
      expect(DIFFICULTY_CONFIG.nightmare).toBeDefined();
    });

    it('should have correct modifiers for easy difficulty', () => {
      const easy = DIFFICULTY_CONFIG.easy;
      
      expect(easy.modifiers.playerHealthMultiplier).toBeGreaterThan(1);
      expect(easy.modifiers.playerStrengthMultiplier).toBeGreaterThan(1);
      expect(easy.modifiers.enemyHealthMultiplier).toBeLessThan(1);
      expect(easy.modifiers.enemyStrengthMultiplier).toBeLessThan(1);
      expect(easy.modifiers.xpMultiplier).toBeLessThan(1);
    });

    it('should have neutral modifiers for normal difficulty', () => {
      const normal = DIFFICULTY_CONFIG.normal;
      
      expect(normal.modifiers.playerHealthMultiplier).toBe(1.0);
      expect(normal.modifiers.playerStrengthMultiplier).toBe(1.0);
      expect(normal.modifiers.enemyHealthMultiplier).toBe(1.0);
      expect(normal.modifiers.enemyStrengthMultiplier).toBe(1.0);
      expect(normal.modifiers.xpMultiplier).toBe(1.0);
    });

    it('should have challenging modifiers for hard difficulty', () => {
      const hard = DIFFICULTY_CONFIG.hard;
      
      expect(hard.modifiers.enemyHealthMultiplier).toBeGreaterThan(1);
      expect(hard.modifiers.enemyStrengthMultiplier).toBeGreaterThan(1);
    });

    it('should have all required properties for each difficulty', () => {
      Object.values(DIFFICULTY_CONFIG).forEach((config) => {
        expect(config.name).toBeDefined();
        expect(config.icon).toBeDefined();
        expect(config.description).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.modifiers).toBeDefined();
        expect(config.tips).toBeDefined();
      });
    });
  });

  describe('getCurrentDifficulty()', () => {
    it('should return current difficulty', () => {
      const difficulty = DifficultyManager.getCurrentDifficulty();
      
      expect(difficulty).toBe('normal');
    });

    it('should default to normal if not set', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: {} });
      
      const difficulty = DifficultyManager.getCurrentDifficulty();
      
      expect(difficulty).toBe('normal');
    });
  });

  describe('setDifficulty()', () => {
    it('should update difficulty setting', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      DifficultyManager.setDifficulty('hard');
      
      expect(SaveManagerV2.update).toHaveBeenCalledWith('settings.difficulty', 'hard');
    });

    it('should accept all valid difficulty levels', () => {
      expect(() => DifficultyManager.setDifficulty('easy')).not.toThrow();
      expect(() => DifficultyManager.setDifficulty('normal')).not.toThrow();
      expect(() => DifficultyManager.setDifficulty('hard')).not.toThrow();
      expect(() => DifficultyManager.setDifficulty('nightmare')).not.toThrow();
    });
  });

  describe('getDifficultyConfig()', () => {
    it('should return config for current difficulty', () => {
      const config = DifficultyManager.getDifficultyConfig();
      
      expect(config).toBeDefined();
      expect(config.modifiers.playerHealthMultiplier).toBe(1.0);
      expect(config.modifiers.xpMultiplier).toBe(1.0);
    });

    it('should return easy config when difficulty is easy', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'easy' } });
      
      const config = DifficultyManager.getDifficultyConfig();
      
      expect(config.modifiers.playerHealthMultiplier).toBeGreaterThan(1);
      expect(config.modifiers.xpMultiplier).toBeLessThan(1);
    });
  });

  describe('getScaledXP()', () => {
    it('should scale XP based on difficulty', () => {
      const baseXP = 100;
      const scaledXP = DifficultyManager.getScaledXP(baseXP);
      
      expect(scaledXP).toBe(100); // Normal difficulty = 1.0x multiplier
    });

    it('should reduce XP on easy difficulty', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'easy' } });
      
      const scaledXP = DifficultyManager.getScaledXP(100);
      
      expect(scaledXP).toBeLessThan(100);
    });

    it('should increase XP on hard difficulty', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'hard' } });
      
      const scaledXP = DifficultyManager.getScaledXP(100);
      
      expect(scaledXP).toBeGreaterThan(100);
    });

    it('should return integer values', () => {
      const scaledXP = DifficultyManager.getScaledXP(100);
      
      expect(Number.isInteger(scaledXP)).toBe(true);
    });

    it('should handle zero XP', () => {
      const scaledXP = DifficultyManager.getScaledXP(0);
      
      expect(scaledXP).toBe(0);
    });
  });

  describe('applyDifficultyModifiers()', () => {
    it('should apply player modifiers to player fighter', () => {
      const fighter = {
        health: 100,
        maxHealth: 100,
        strength: 50,
      };
      
      DifficultyManager.applyDifficultyModifiers(fighter, true);
      
      expect(fighter.health).toBe(100); // Normal = 1.0x
      expect(fighter.strength).toBe(50); // Normal = 1.0x
    });

    it('should apply enemy modifiers to enemy fighter', () => {
      const fighter = {
        health: 100,
        maxHealth: 100,
        strength: 50,
      };
      
      DifficultyManager.applyDifficultyModifiers(fighter, false);
      
      // Normal difficulty = 1.0x for enemies
      expect(fighter.health).toBe(100);
      expect(fighter.strength).toBe(50);
    });

    it('should boost player stats on easy difficulty', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'easy' } });
      
      const fighter = {
        health: 100,
        maxHealth: 100,
        strength: 50,
      };
      
      DifficultyManager.applyDifficultyModifiers(fighter, true);
      
      expect(fighter.health).toBeGreaterThan(100);
      expect(fighter.strength).toBeGreaterThan(50);
    });

    it('should update maxHealth along with health', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'easy' } });
      
      const fighter = {
        health: 100,
        maxHealth: 100,
        strength: 50,
      };
      
      DifficultyManager.applyDifficultyModifiers(fighter, true);
      
      expect(fighter.health).toBe(fighter.maxHealth);
    });
  });

  describe('shouldAIMakeMistake()', () => {
    it('should return boolean', () => {
      const result = DifficultyManager.shouldAIMakeMistake();
      
      expect(typeof result).toBe('boolean');
    });

    it('should return true more often on easy difficulty', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'easy' } });
      
      const mistakes = Array.from({ length: 100 }, () =>
        DifficultyManager.shouldAIMakeMistake()
      ).filter(Boolean);
      
      // Easy has 25% mistake chance, expect around 20-30 mistakes in 100 attempts
      expect(mistakes.length).toBeGreaterThan(10);
    });

    it('should return false most of the time on hard difficulty', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ settings: { difficulty: 'hard' } });
      
      const mistakes = Array.from({ length: 100 }, () =>
        DifficultyManager.shouldAIMakeMistake()
      ).filter(Boolean);
      
      // Hard has low mistake chance, expect fewer than 10 mistakes
      expect(mistakes.length).toBeLessThan(15);
    });
  });
});
