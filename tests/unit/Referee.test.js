/**
 * Referee Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Referee } from '../../src/entities/referee.js';

// Mock Logger
vi.mock('../../src/utils/logger.js', () => ({
  Logger: {
    log: vi.fn(),
    logFighter: vi.fn(),
  },
}));

// Mock soundManager
vi.mock('../../src/utils/soundManager.js', () => ({
  soundManager: {
    play: vi.fn(),
  },
}));

describe('Referee', () => {
  let fighter1;
  let fighter2;

  beforeEach(() => {
    fighter1 = {
      id: 1,
      name: 'Fighter One',
      health: 100,
      maxHealth: 100,
      strength: 50,
    };

    fighter2 = {
      id: 2,
      name: 'Fighter Two',
      health: 80,
      maxHealth: 100,
      strength: 45,
    };

    vi.clearAllMocks();
  });

  describe('introduceFighters()', () => {
    it('should log introduction message', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.introduceFighters(fighter1, fighter2);

      expect(Logger.log).toHaveBeenCalled();
      expect(Logger.logFighter).toHaveBeenCalledWith(fighter1);
      expect(Logger.logFighter).toHaveBeenCalledWith(fighter2);
    });

    it('should introduce both fighters', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.introduceFighters(fighter1, fighter2);

      expect(Logger.logFighter).toHaveBeenCalledTimes(2);
    });
  });

  describe('showRoundNumber()', () => {
    it('should display round number', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.showRoundNumber();

      expect(Logger.log).toHaveBeenCalled();
      const call = Logger.log.mock.calls[0][0];
      expect(call).toContain('Round');
    });

    it('should increment round counter', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.clearRoundNumber();
      Referee.showRoundNumber();
      const firstCall = Logger.log.mock.calls[0][0];

      Referee.showRoundNumber();
      const secondCall = Logger.log.mock.calls[1][0];

      expect(firstCall).toContain('Round 1');
      expect(secondCall).toContain('Round 2');
    });
  });

  describe('clearRoundNumber()', () => {
    it('should reset round counter', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.showRoundNumber();
      Referee.showRoundNumber();
      Referee.clearRoundNumber();
      Referee.showRoundNumber();

      const call = Logger.log.mock.calls[Logger.log.mock.calls.length - 1][0];
      expect(call).toContain('Round 1');
    });
  });

  describe('roundSummary()', () => {
    it('should display health status for both fighters', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.roundSummary(fighter1, fighter2);

      expect(Logger.log).toHaveBeenCalled();
      const call = Logger.log.mock.calls[0][0];
      expect(call).toContain(fighter1.name);
      expect(call).toContain(fighter2.name);
    });

    it('should show current HP values', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.roundSummary(fighter1, fighter2);

      const call = Logger.log.mock.calls[0][0];
      expect(call).toContain('100 HP');
      expect(call).toContain('80 HP');
    });

    it('should handle negative health gracefully', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      fighter1.health = -10;

      Referee.roundSummary(fighter1, fighter2);

      const call = Logger.log.mock.calls[0][0];
      expect(call).toContain('0 HP');
    });
  });

  describe('declareWinner()', () => {
    it('should announce the winner', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.declareWinner(fighter1);

      expect(Logger.log).toHaveBeenCalled();
      const call = Logger.log.mock.calls[0][0];
      expect(call).toContain('VICTORY');
      expect(call).toContain(fighter1.name);
    });

    it('should log winner fighter details', async () => {
      const { Logger } = await import('../../src/utils/logger.js');

      Referee.declareWinner(fighter1);

      expect(Logger.logFighter).toHaveBeenCalledWith(fighter1);
    });

    it('should play victory sound', async () => {
      const { soundManager } = await import('../../src/utils/soundManager.js');

      Referee.declareWinner(fighter1);

      expect(soundManager.play).toHaveBeenCalledWith('victory');
    });
  });

  describe('getHealthBar()', () => {
    it('should generate health bar HTML', () => {
      const healthBar = Referee.getHealthBar(50, 100);

      expect(healthBar).toContain('progress-bar');
      expect(healthBar).toContain('50%');
    });

    it('should show green bar for high health', () => {
      const healthBar = Referee.getHealthBar(80, 100);

      expect(healthBar).toContain('bg-success');
    });

    it('should show yellow bar for medium health', () => {
      const healthBar = Referee.getHealthBar(50, 100);

      expect(healthBar).toContain('bg-warning');
    });

    it('should show red bar for low health', () => {
      const healthBar = Referee.getHealthBar(20, 100);

      expect(healthBar).toContain('bg-danger');
    });

    it('should handle zero health', () => {
      const healthBar = Referee.getHealthBar(0, 100);

      expect(healthBar).toContain('0%');
    });

    it('should not exceed 100%', () => {
      const healthBar = Referee.getHealthBar(150, 100);

      expect(healthBar).toContain('100%');
    });

    it('should not go below 0%', () => {
      const healthBar = Referee.getHealthBar(-10, 100);

      expect(healthBar).toContain('0%');
    });
  });
});
