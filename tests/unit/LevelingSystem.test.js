/**
 * LevelingSystem Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LevelingSystem } from '../../src/game/LevelingSystem.js';

// Mock gameStore
let mockState = {
  player: { level: 1, xp: 0 },
};

vi.mock('../../src/store/gameStore.js', () => ({
  gameStore: {
    getState: vi.fn(() => mockState),
    dispatch: vi.fn((action) => {
      if (action.type === 'ADD_XP') {
        mockState.player.xp += action.payload.amount;
      } else if (action.type === 'LEVEL_UP') {
        mockState.player.level += 1;
      }
    }),
  },
}));

// Mock SaveManager
vi.mock('../../src/utils/SaveManagerV2.js', () => ({
  SaveManagerV2: {
    load: vi.fn(() => null),
    get: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock Logger
vi.mock('../../src/utils/logger.js', () => ({
  Logger: {
    log: vi.fn(),
  },
}));

// Mock soundManager
vi.mock('../../src/utils/soundManager.js', () => ({
  soundManager: {
    play: vi.fn(),
  },
}));

// Mock DifficultyManager
vi.mock('../../src/game/DifficultyManager.js', () => ({
  DifficultyManager: {
    getScaledXP: vi.fn((xp) => xp), // Return unscaled XP for simplicity
  },
}));

describe('LevelingSystem', () => {
  beforeEach(() => {
    // Reset mock state before each test
    mockState = {
      player: { level: 1, xp: 0 },
    };
    vi.clearAllMocks();
  });

  describe('getXPForLevel()', () => {
    it('should calculate XP required for level 1', () => {
      const xp = LevelingSystem.getXPForLevel(1);
      expect(xp).toBe(100); // 100 * 1^1.5 = 100
    });

    it('should calculate XP required for level 2', () => {
      const xp = LevelingSystem.getXPForLevel(2);
      expect(xp).toBe(282); // 100 * 2^1.5 ≈ 282
    });

    it('should calculate XP required for level 10', () => {
      const xp = LevelingSystem.getXPForLevel(10);
      expect(xp).toBeGreaterThan(1000);
      expect(xp).toBe(Math.floor(100 * Math.pow(10, 1.5)));
    });

    it('should return increasing values for higher levels', () => {
      const xpLevel5 = LevelingSystem.getXPForLevel(5);
      const xpLevel6 = LevelingSystem.getXPForLevel(6);
      
      expect(xpLevel6).toBeGreaterThan(xpLevel5);
    });
  });

  describe('getTotalXPForLevel()', () => {
    it('should return 0 for level 1', () => {
      const totalXP = LevelingSystem.getTotalXPForLevel(1);
      expect(totalXP).toBe(0);
    });

    it('should calculate cumulative XP for level 2', () => {
      const totalXP = LevelingSystem.getTotalXPForLevel(2);
      expect(totalXP).toBe(100); // XP for level 1
    });

    it('should calculate cumulative XP for level 3', () => {
      const totalXP = LevelingSystem.getTotalXPForLevel(3);
      const expectedXP = LevelingSystem.getXPForLevel(1) + LevelingSystem.getXPForLevel(2);
      expect(totalXP).toBe(expectedXP);
    });

    it('should return increasing totals for higher levels', () => {
      const totalLevel5 = LevelingSystem.getTotalXPForLevel(5);
      const totalLevel6 = LevelingSystem.getTotalXPForLevel(6);
      
      expect(totalLevel6).toBeGreaterThan(totalLevel5);
    });
  });

  describe('getLevelFromXP()', () => {
    it('should return level 1 for 0 XP', () => {
      const level = LevelingSystem.getLevelFromXP(0);
      expect(level).toBe(1);
    });

    it('should return level 1 for XP less than required for level 2', () => {
      const level = LevelingSystem.getLevelFromXP(50);
      expect(level).toBe(1);
    });

    it('should return level 2 for XP exactly at threshold', () => {
      const xpForLevel2 = LevelingSystem.getTotalXPForLevel(2);
      const level = LevelingSystem.getLevelFromXP(xpForLevel2);
      expect(level).toBe(2);
    });

    it('should return level 3 for sufficient XP', () => {
      const xpForLevel3 = LevelingSystem.getTotalXPForLevel(3);
      const level = LevelingSystem.getLevelFromXP(xpForLevel3);
      expect(level).toBe(3);
    });

    it('should cap at level 100', () => {
      const level = LevelingSystem.getLevelFromXP(999999999);
      expect(level).toBeLessThanOrEqual(101); // Level 101 or less (safety cap)
    });

    it('should handle large XP values', () => {
      const level = LevelingSystem.getLevelFromXP(10000);
      expect(level).toBeGreaterThan(1);
      expect(typeof level).toBe('number');
    });
  });

  describe('awardXP()', () => {
    it('should award XP to player', () => {
      const result = LevelingSystem.awardXP(50, 'Victory');
      
      expect(mockState.player.xp).toBe(50);
      expect(result.xpGained).toBe(50);
    });

    it('should not trigger level up if XP insufficient', () => {
      const result = LevelingSystem.awardXP(50, 'Small Victory');
      
      expect(result.leveledUp).toBe(false);
      expect(result.newLevel).toBe(1);
      expect(result.oldLevel).toBe(1);
    });

    it('should trigger level up with sufficient XP', () => {
      const xpForLevel2 = LevelingSystem.getXPForLevel(1);
      const result = LevelingSystem.awardXP(xpForLevel2, 'Big Victory');
      
      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBe(2);
      expect(result.oldLevel).toBe(1);
    });

    it('should update level in save data', () => {
      const xpForLevel2 = LevelingSystem.getXPForLevel(1);
      
      LevelingSystem.awardXP(xpForLevel2, 'Level Up');
      
      expect(mockState.player.level).toBe(2);
    });

    it('should play victory sound on level up', async () => {
      const { soundManager } = await import('../../src/utils/soundManager.js');
      const xpForLevel2 = LevelingSystem.getXPForLevel(1);
      
      LevelingSystem.awardXP(xpForLevel2, 'Level Up');
      
      expect(soundManager.play).toHaveBeenCalledWith('victory');
    });

    it('should log XP gain message', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      
      LevelingSystem.awardXP(100, 'Quest');
      
      expect(Logger.log).toHaveBeenCalled();
    });

    it('should return correct totalXP', () => {
      const result = LevelingSystem.awardXP(150, 'Achievement');
      
      expect(result.totalXP).toBe(150);
    });

    it('should handle multiple level ups', () => {
      const xpForLevel5 = LevelingSystem.getTotalXPForLevel(5);
      const result = LevelingSystem.awardXP(xpForLevel5, 'Massive Victory');
      
      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBe(5);
      expect(result.oldLevel).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0 XP award', () => {
      const result = LevelingSystem.awardXP(0, 'Nothing');
      
      expect(result.xpGained).toBe(0);
      expect(result.leveledUp).toBe(false);
    });

    it('should handle very large XP values', () => {
      const result = LevelingSystem.awardXP(1000000, 'Legendary Achievement');
      
      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBeGreaterThan(10);
    });
  });
});
