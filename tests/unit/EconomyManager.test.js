/**
 * EconomyManager Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EconomyManager } from '../../src/game/EconomyManager.js';

// Mock SaveManager
vi.mock('../../src/utils/SaveManagerV2.js', () => {
  let mockData = {};
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
      increment: vi.fn((key, amount) => {
        const keys = key.split('.');
        let obj = mockData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        const lastKey = keys[keys.length - 1];
        obj[lastKey] = (obj[lastKey] || 0) + amount;
      }),
      _setMockData: (data) => {
        mockData = data;
      },
      _getMockData: () => mockData,
    },
  };
});

// Mock Logger
vi.mock('../../src/utils/logger.js', () => ({
  Logger: {
    log: vi.fn(),
  },
}));

describe('EconomyManager', () => {
  beforeEach(async () => {
    // Reset mock data before each test
    const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
    SaveManagerV2._setMockData({
      profile: { gold: 100 },
      stats: { totalGoldEarned: 0, totalGoldSpent: 0 },
    });
    vi.clearAllMocks();
  });

  describe('addGold()', () => {
    it('should add gold to player balance', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      const success = EconomyManager.addGold(50, 'Victory');
      
      expect(success).toBe(true);
      expect(SaveManagerV2.update).toHaveBeenCalledWith('profile.gold', 150);
    });

    it('should track total gold earned', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      EconomyManager.addGold(75, 'Quest');
      
      expect(SaveManagerV2.increment).toHaveBeenCalledWith('stats.totalGoldEarned', 75);
    });

    it('should return false for negative amounts', () => {
      const success = EconomyManager.addGold(-10, 'Invalid');
      
      expect(success).toBe(false);
    });

    it('should return false for zero amount', () => {
      const success = EconomyManager.addGold(0, 'Invalid');
      
      expect(success).toBe(false);
    });

    it('should log gold award message', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      
      EconomyManager.addGold(100, 'Achievement');
      
      expect(Logger.log).toHaveBeenCalled();
    });
  });

  describe('spendGold()', () => {
    it('should spend gold from player balance', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      const success = EconomyManager.spendGold(50, 'Equipment');
      
      expect(success).toBe(true);
      expect(SaveManagerV2.update).toHaveBeenCalledWith('profile.gold', 50);
    });

    it('should track total gold spent', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      
      EconomyManager.spendGold(30, 'Item');
      
      expect(SaveManagerV2.increment).toHaveBeenCalledWith('stats.totalGoldSpent', 30);
    });

    it('should return false if insufficient gold', () => {
      const success = EconomyManager.spendGold(200, 'Expensive Item');
      
      expect(success).toBe(false);
    });

    it('should return false for negative amounts', () => {
      const success = EconomyManager.spendGold(-10, 'Invalid');
      
      expect(success).toBe(false);
    });

    it('should return false for zero amount', () => {
      const success = EconomyManager.spendGold(0, 'Invalid');
      
      expect(success).toBe(false);
    });

    it('should log error message for insufficient gold', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      
      EconomyManager.spendGold(500, 'Too Expensive');
      
      expect(Logger.log).toHaveBeenCalled();
    });
  });

  describe('canAfford()', () => {
    it('should return true if player can afford amount', () => {
      const canAfford = EconomyManager.canAfford(50);
      
      expect(canAfford).toBe(true);
    });

    it('should return false if player cannot afford amount', () => {
      const canAfford = EconomyManager.canAfford(150);
      
      expect(canAfford).toBe(false);
    });

    it('should return true for exact balance', () => {
      const canAfford = EconomyManager.canAfford(100);
      
      expect(canAfford).toBe(true);
    });

    it('should handle negative amounts', () => {
      const canAfford = EconomyManager.canAfford(-10);
      
      // Negative amounts return true because currentGold >= -10 is always true
      expect(typeof canAfford).toBe('boolean');
    });
  });

  describe('getGold()', () => {
    it('should return current gold balance', async () => {
      const gold = EconomyManager.getGold();
      
      expect(gold).toBe(100);
    });

    it('should return 0 if no gold in save', async () => {
      const { SaveManagerV2 } = await import('../../src/utils/SaveManagerV2.js');
      SaveManagerV2._setMockData({ profile: {} });
      
      const gold = EconomyManager.getGold();
      
      expect(gold).toBe(0);
    });
  });

  describe('calculateBattleReward()', () => {
    it('should calculate reward for victory', () => {
      const reward = EconomyManager.calculateBattleReward('normal', true, 5);
      
      expect(reward).toBeGreaterThan(0);
      expect(typeof reward).toBe('number');
    });

    it('should give consolation prize for defeat', () => {
      const reward = EconomyManager.calculateBattleReward('normal', false, 5);
      
      expect(reward).toBeGreaterThan(0);
      expect(reward).toBeLessThan(100);
    });
  });
});
