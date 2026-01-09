/**
 * EventManager Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventManager } from '../../src/game/EventManager.js';

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

// Mock Helpers
vi.mock('../../src/utils/helpers.js', () => ({
  Helpers: {
    getRandomNumber: vi.fn((min, max) => Math.floor((min + max) / 2)),
  },
}));

describe('EventManager', () => {
  describe('shouldTriggerEvent()', () => {
    it('should return true when random is within range', () => {
      const result = EventManager.shouldTriggerEvent(50, 10, 90);
      expect(result).toBe(true);
    });

    it('should return false when random is below min', () => {
      const result = EventManager.shouldTriggerEvent(5, 10, 90);
      expect(result).toBe(false);
    });

    it('should return false when random is above max', () => {
      const result = EventManager.shouldTriggerEvent(95, 10, 90);
      expect(result).toBe(false);
    });

    it('should return false when random equals min', () => {
      const result = EventManager.shouldTriggerEvent(10, 10, 90);
      expect(result).toBe(false);
    });

    it('should return false when random equals max', () => {
      const result = EventManager.shouldTriggerEvent(90, 10, 90);
      expect(result).toBe(false);
    });
  });

  describe('processRoundEvent()', () => {
    let mockState;
    let team1;
    let team2;

    beforeEach(() => {
      mockState = {
        hasActiveEvent: vi.fn(() => false),
        setEvent: vi.fn(),
        decrementEventRounds: vi.fn(),
        currentEvent: null,
        selectedTeam: null,
        setSelectedTeam: vi.fn(),
      };

      team1 = [
        { name: 'Fighter1', health: 100 },
        { name: 'Fighter2', health: 100 },
      ];

      team2 = [
        { name: 'Fighter3', health: 100 },
        { name: 'Fighter4', health: 100 },
      ];

      vi.clearAllMocks();
    });

    it('should trigger new event when conditions met', () => {
      const eventConfig = { min: 10, max: 90 };
      
      EventManager.processRoundEvent(mockState, team1, team2, 50, eventConfig);

      expect(mockState.setEvent).toHaveBeenCalled();
      expect(mockState.decrementEventRounds).toHaveBeenCalled();
    });

    it('should not trigger event when random outside range', () => {
      const eventConfig = { min: 10, max: 90 };
      
      EventManager.processRoundEvent(mockState, team1, team2, 5, eventConfig);

      expect(mockState.setEvent).not.toHaveBeenCalled();
    });

    it('should not trigger new event when one is active', () => {
      mockState.hasActiveEvent = vi.fn(() => true);
      mockState.currentEvent = { type: 'earthquake', roundsLeft: 2 };
      const eventConfig = { min: 10, max: 90 };
      
      EventManager.processRoundEvent(mockState, team1, team2, 50, eventConfig);

      expect(mockState.setEvent).not.toHaveBeenCalled();
    });

    it('should continue existing event', () => {
      mockState.hasActiveEvent = vi.fn(() => true);
      mockState.currentEvent = {
        roundsLeft: 2,
        isGlobal: true,
        effect: vi.fn(),
      };
      const eventConfig = { min: 10, max: 90 };
      
      EventManager.processRoundEvent(mockState, team1, team2, 5, eventConfig);

      expect(mockState.decrementEventRounds).toHaveBeenCalled();
    });
  });

  describe('applyEventEffect()', () => {
    let mockState;
    let team1;
    let team2;
    let globalEvent;
    let teamEvent;

    beforeEach(() => {
      mockState = {
        selectedTeam: null,
        setSelectedTeam: vi.fn(),
      };

      team1 = [{ name: 'Fighter1', health: 100 }];
      team2 = [{ name: 'Fighter2', health: 100 }];

      globalEvent = {
        isGlobal: true,
        isTeamEvent: false,
        effect: vi.fn(),
      };

      teamEvent = {
        isGlobal: false,
        isTeamEvent: true,
        effect: vi.fn(),
      };
    });

    it('should apply global event to all teams', () => {
      EventManager.applyEventEffect(mockState, globalEvent, team1, team2);

      expect(globalEvent.effect).toHaveBeenCalledWith(team1);
      expect(globalEvent.effect).toHaveBeenCalledWith(team2);
    });

    it('should apply team event to selected team', () => {
      mockState.selectedTeam = 1;

      EventManager.applyEventEffect(mockState, teamEvent, team1, team2);

      expect(teamEvent.effect).toHaveBeenCalledWith(team1);
      expect(teamEvent.effect).not.toHaveBeenCalledWith(team2);
    });

    it('should select random team if none selected', () => {
      EventManager.applyEventEffect(mockState, teamEvent, team1, team2);

      expect(mockState.setSelectedTeam).toHaveBeenCalled();
    });

    it('should apply to team 2 when selected', () => {
      mockState.selectedTeam = 2;

      EventManager.applyEventEffect(mockState, teamEvent, team1, team2);

      expect(teamEvent.effect).toHaveBeenCalledWith(team2);
      expect(teamEvent.effect).not.toHaveBeenCalledWith(team1);
    });
  });
});
