/**
 * Unit tests for TournamentMode
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TournamentMode } from '../../src/game/TournamentMode.js';

// Mock dependencies
vi.mock('../../src/utils/SaveManagerV2.js', () => ({
  SaveManagerV2: {
    save: vi.fn(),
    get: vi.fn(() => 'normal'),
  },
}));

vi.mock('../../src/game/LevelingSystem.js', () => ({
  LevelingSystem: {
    awardXP: vi.fn(),
  },
}));

vi.mock('../../src/game/EquipmentManager.js', () => ({
  EquipmentManager: {
    awardItem: vi.fn(),
  },
}));

vi.mock('../../src/utils/logger.js', () => ({
  Logger: {
    log: vi.fn(),
  },
}));

vi.mock('../../src/utils/soundManager.js', () => ({
  soundManager: {
    play: vi.fn(),
  },
}));

vi.mock('../../src/store/gameStore.js', () => ({
  gameStore: {
    dispatch: vi.fn(),
  },
}));

vi.mock('../../src/store/actions.js', () => ({
  incrementStat: vi.fn(),
}));

vi.mock('../../src/utils/ConsoleLogger.js', () => ({
  ConsoleLogger: {
    info: vi.fn(),
  },
  LogCategory: {
    TOURNAMENT: 'TOURNAMENT',
  },
}));

describe('TournamentMode', () => {
  let tournamentMode;

  beforeEach(() => {
    tournamentMode = new TournamentMode();
  });

  describe('getChampionshipRewards', () => {
    it('should show total XP for normal difficulty', () => {
      tournamentMode.difficulty = 'normal';
      const rewards = tournamentMode.getChampionshipRewards();

      // Should show 600 total XP (300 from battles + 300 championship bonus)
      expect(rewards).toContain('600 Total XP');
      expect(rewards).toContain('300 from battles');
      expect(rewards).toContain('300 championship bonus');
    });

    it('should show total XP for hard difficulty', () => {
      tournamentMode.difficulty = 'hard';
      const rewards = tournamentMode.getChampionshipRewards();

      // Should show 750 total XP (300 from battles + 450 championship bonus)
      expect(rewards).toContain('750 Total XP');
      expect(rewards).toContain('300 from battles');
      expect(rewards).toContain('450 championship bonus');
    });

    it('should show total XP for nightmare difficulty', () => {
      tournamentMode.difficulty = 'nightmare';
      const rewards = tournamentMode.getChampionshipRewards();

      // Should show 900 total XP (300 from battles + 600 championship bonus)
      expect(rewards).toContain('900 Total XP');
      expect(rewards).toContain('300 from battles');
      expect(rewards).toContain('600 championship bonus');
    });

    it('should include equipment rewards based on difficulty', () => {
      tournamentMode.difficulty = 'normal';
      let rewards = tournamentMode.getChampionshipRewards();
      expect(rewards).toContain('Guaranteed Rare Equipment');

      tournamentMode.difficulty = 'hard';
      rewards = tournamentMode.getChampionshipRewards();
      expect(rewards).toContain('Guaranteed Epic Equipment');

      tournamentMode.difficulty = 'nightmare';
      rewards = tournamentMode.getChampionshipRewards();
      expect(rewards).toContain('Guaranteed Legendary Equipment');
    });

    it('should include champion title', () => {
      tournamentMode.difficulty = 'normal';
      const rewards = tournamentMode.getChampionshipRewards();
      expect(rewards).toContain('Champion Title');
    });
  });
});
