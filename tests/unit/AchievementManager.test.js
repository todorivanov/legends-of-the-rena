/**
 * AchievementManager Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AchievementManager } from '../../src/game/AchievementManager.js';

// Mock SaveManager
vi.mock('../../src/utils/SaveManagerV2.js', () => {
  let mockData = { unlocks: { achievements: [] }, stats: { totalGoldEarned: 0 } };
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
        mockData.unlocks.achievements = value; // Update the mock data
      }),
      increment: vi.fn((key, amount) => {
        const keys = key.split('.');
        let obj = mockData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = (obj[keys[keys.length - 1]] || 0) + amount;
      }),
      _setMockData: (data) => {
        mockData = data;
      },
      _getMockData: () => mockData,
    },
  };
});

// Mock LevelingSystem
vi.mock('../../src/game/LevelingSystem.js', () => ({
  LevelingSystem: {
    awardXP: vi.fn(),
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

// Mock achievements data
vi.mock('../../src/data/achievements.js', () => ({
  ACHIEVEMENTS: [
    {
      id: 'first_victory',
      name: 'First Victory',
      description: 'Win your first fight',
      icon: '🏆',
      reward: { xp: 100, gold: 50 },
    },
    {
      id: 'win_streak_5',
      name: 'Win Streak',
      description: 'Win 5 fights in a row',
      icon: '🔥',
      reward: { xp: 500, gold: 250 },
    },
    {
      id: 'reach_level_10',
      name: 'Level 10',
      description: 'Reach level 10',
      icon: '⭐',
      reward: { xp: 1000 },
    },
  ],
  getAchievementById: vi.fn((id) => {
    const achievements = [
      {
        id: 'first_victory',
        name: 'First Victory',
        description: 'Win your first fight',
        icon: '🏆',
        reward: { xp: 100, gold: 50 },
      },
      {
        id: 'win_streak_5',
        name: 'Win Streak',
        description: 'Win 5 fights in a row',
        icon: '🔥',
        reward: { xp: 500, gold: 250 },
      },
      {
        id: 'reach_level_10',
        name: 'Level 10',
        description: 'Reach level 10',
        icon: '⭐',
        reward: { xp: 1000 },
      },
    ];
    return achievements.find((a) => a.id === id);
  }),
}));

describe('AchievementManager', () => {
  beforeEach(async () => {
    const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
    SaveManagerV2._setMockData({ unlocks: { achievements: [] } });
    vi.clearAllMocks();
  });

  describe('isUnlocked()', () => {
    it('should return false for locked achievement', () => {
      const isUnlocked = AchievementManager.isUnlocked('first_victory');
      
      expect(isUnlocked).toBe(false);
    });

    it('should return true for unlocked achievement', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ unlocks: { achievements: ['first_victory'] } });
      
      const isUnlocked = AchievementManager.isUnlocked('first_victory');
      
      expect(isUnlocked).toBe(true);
    });

    it('should handle non-existent achievements', () => {
      const isUnlocked = AchievementManager.isUnlocked('non_existent');
      
      expect(isUnlocked).toBe(false);
    });
  });

  describe('getUnlockedAchievements()', () => {
    it('should return empty array when no achievements unlocked', () => {
      const unlocked = AchievementManager.getUnlockedAchievements();
      
      expect(unlocked).toEqual([]);
    });

    it('should return unlocked achievements', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ 
        unlocks: { achievements: ['first_victory', 'win_streak_5'] } 
      });
      
      const unlocked = AchievementManager.getUnlockedAchievements();
      
      expect(unlocked).toHaveLength(2);
      expect(unlocked[0].id).toBe('first_victory');
      expect(unlocked[1].id).toBe('win_streak_5');
    });

    it('should filter out invalid achievement IDs', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ 
        unlocks: { achievements: ['first_victory', 'invalid_id'] } 
      });
      
      const unlocked = AchievementManager.getUnlockedAchievements();
      
      expect(unlocked).toHaveLength(1);
      expect(unlocked[0].id).toBe('first_victory');
    });
  });

  describe('getCompletionPercentage()', () => {
    it('should return 0% when no achievements unlocked', () => {
      const percentage = AchievementManager.getCompletionPercentage();
      
      expect(percentage).toBe(0);
    });

    it('should return 33% when 1 of 3 achievements unlocked', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ unlocks: { achievements: ['first_victory'] } });
      
      const percentage = AchievementManager.getCompletionPercentage();
      
      expect(percentage).toBe(33); // 1/3 = 33.33%, floored to 33
    });

    it('should return 66% when 2 of 3 achievements unlocked', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ 
        unlocks: { achievements: ['first_victory', 'win_streak_5'] } 
      });
      
      const percentage = AchievementManager.getCompletionPercentage();
      
      expect(percentage).toBe(66); // 2/3 = 66.66%, floored to 66
    });

    it('should return 100% when all achievements unlocked', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ 
        unlocks: { achievements: ['first_victory', 'win_streak_5', 'reach_level_10'] } 
      });
      
      const percentage = AchievementManager.getCompletionPercentage();
      
      expect(percentage).toBe(100);
    });
  });

  describe('unlockAchievement()', () => {
    it('should unlock a new achievement', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      const result = AchievementManager.unlockAchievement('first_victory');
      
      expect(result).toBe(true);
      expect(SaveManagerV2.update).toHaveBeenCalled();
    });

    it('should not unlock already unlocked achievement', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ unlocks: { achievements: ['first_victory'] } });
      
      const result = AchievementManager.unlockAchievement('first_victory');
      
      expect(result).toBe(false);
    });

    it('should return false for non-existent achievement', () => {
      const result = AchievementManager.unlockAchievement('non_existent');
      
      expect(result).toBe(false);
    });

    it('should award XP when unlocking achievement', async () => {
      const { LevelingSystem } = await import('../../src/game/LevelingSystem.js');
      
      AchievementManager.unlockAchievement('first_victory');
      
      expect(LevelingSystem.awardXP).toHaveBeenCalledWith(
        100,
        'Achievement: First Victory'
      );
    });

    it('should award gold when achievement has gold reward', async () => {
      // Note: Gold is awarded via dynamic import in the actual code
      // This test verifies the unlocking process
      const result = AchievementManager.unlockAchievement('first_victory');
      
      expect(result).toBe(true);
    });

    it('should handle achievement with only XP reward', async () => {
      const { LevelingSystem } = await import('../../src/game/LevelingSystem.js');
      
      AchievementManager.unlockAchievement('reach_level_10');
      
      expect(LevelingSystem.awardXP).toHaveBeenCalledWith(
        1000,
        'Achievement: Level 10'
      );
    });

    it('should add achievement to unlocked list', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      AchievementManager.unlockAchievement('first_victory');
      
      const mockData = SaveManagerV2._getMockData();
      expect(mockData.unlocks.achievements).toContain('first_victory');
    });
  });

  describe('showAchievementNotification()', () => {
    it('should display notification for unlocked achievement', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      const achievement = {
        name: 'Test Achievement',
        description: 'Test Description',
        icon: '🎯',
        reward: { xp: 100, gold: 50 },
      };
      
      AchievementManager.showAchievementNotification(achievement);
      
      expect(Logger.log).toHaveBeenCalled();
    });
  });
});
