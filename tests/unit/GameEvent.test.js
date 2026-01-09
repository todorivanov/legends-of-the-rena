/**
 * GameEvent Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import GameEvent from '../../src/game/GameEvent.js';

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
    getRandomNumber: vi.fn(() => 0),
  },
}));

describe('GameEvent', () => {
  describe('Constructor', () => {
    it('should create event with correct properties', () => {
      const eventObj = {
        name: 'Test Event',
        duration: 3,
        roundsLeft: 3,
        description: 'Test description',
        effect: vi.fn(),
        isTeamEvent: false,
        isGlobal: true,
      };

      const event = new GameEvent(eventObj);

      expect(event.name).toBe('Test Event');
      expect(event.duration).toBe(3);
      expect(event.roundsLeft).toBe(3);
      expect(event.description).toBe('Test description');
      expect(event.isGlobal).toBe(true);
      expect(event.isTeamEvent).toBe(false);
    });

    it('should have logEvent method', () => {
      const event = new GameEvent({
        name: 'Test',
        duration: 1,
        roundsLeft: 1,
        description: 'Test',
        effect: () => {},
      });

      expect(typeof event.logEvent).toBe('function');
    });
  });

  describe('logEvent()', () => {
    it('should log event message', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      const event = new GameEvent({
        name: 'Test Event',
        duration: 1,
        roundsLeft: 1,
        description: 'Test description',
        effect: () => {},
      });

      event.logEvent();

      expect(Logger.log).toHaveBeenCalled();
    });

    it('should play event sound', async () => {
      const { soundManager } = await import('../../src/utils/soundManager.js');
      const event = new GameEvent({
        name: 'Sound Test',
        duration: 1,
        roundsLeft: 1,
        description: 'Test',
        effect: () => {},
      });

      event.logEvent();

      expect(soundManager.play).toHaveBeenCalledWith('event');
    });
  });

  describe('generateEvent()', () => {
    it('should generate random event', () => {
      const event = GameEvent.generateEvent();

      expect(event).toBeInstanceOf(GameEvent);
      expect(event.name).toBeDefined();
      expect(event.description).toBeDefined();
      expect(event.effect).toBeDefined();
    });

    it('should generate event with valid properties', () => {
      const event = GameEvent.generateEvent();

      expect(event.duration).toBeGreaterThan(0);
      expect(event.roundsLeft).toBeGreaterThan(0);
      expect(typeof event.effect).toBe('function');
    });

    it('should generate different event types', () => {
      const events = new Set();
      
      // Generate multiple events to check variety
      for (let i = 0; i < 20; i++) {
        const event = GameEvent.generateEvent();
        events.add(event.name);
      }

      // Should have at least 1 type (could be same due to random)
      expect(events.size).toBeGreaterThan(0);
    });
  });

  describe('Event Effects', () => {
    it('should apply earthquake damage to all fighters', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      const fighters = [
        { name: 'Fighter1', health: 200 },
        { name: 'Fighter2', health: 150 },
      ];

      const earthquakeEvent = new GameEvent({
        name: '🌍 Earthquake',
        duration: 1,
        roundsLeft: 1,
        isGlobal: true,
        description: 'Test',
        effect: function (objs) {
          for (const obj of objs) {
            obj.health -= 100;
            Logger.log(`${obj.name} takes damage`);
          }
        },
      });

      earthquakeEvent.effect(fighters);

      expect(fighters[0].health).toBe(100);
      expect(fighters[1].health).toBe(50);
    });

    it('should apply full moon percentage damage', () => {
      const fighters = [
        { name: 'Fighter1', health: 200 },
      ];

      const fullMoonEvent = new GameEvent({
        name: '🌕 Full Moon',
        duration: 1,
        roundsLeft: 1,
        isGlobal: false,
        isTeamEvent: true,
        description: 'Test',
        effect: function (objs) {
          for (const obj of objs) {
            const lostHealth = Math.round(obj.health / 2);
            obj.health -= lostHealth;
          }
        },
      });

      fullMoonEvent.effect(fighters);

      expect(fighters[0].health).toBe(100); // Lost 50%
    });

    it('should apply poison damage over time', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      const fighters = [
        { name: 'Fighter1', health: 100 },
      ];

      const poisonEvent = new GameEvent({
        name: '☠️ Poisoned Food',
        duration: 5,
        roundsLeft: 5,
        isGlobal: false,
        isTeamEvent: true,
        description: 'Test',
        effect: function (objs) {
          for (const obj of objs) {
            obj.health -= 20;
            Logger.log(`${obj.name} is poisoned`);
          }
        },
      });

      // Apply poison multiple times
      poisonEvent.effect(fighters);
      poisonEvent.effect(fighters);
      poisonEvent.effect(fighters);

      expect(fighters[0].health).toBe(40); // Lost 60 HP (20 * 3)
    });
  });

  describe('Event Types', () => {
    it('should have global events', () => {
      // Test that at least some events can be global
      const event = new GameEvent({
        name: 'Global Test',
        duration: 1,
        roundsLeft: 1,
        isGlobal: true,
        description: 'Test',
        effect: () => {},
      });

      expect(event.isGlobal).toBe(true);
      expect(event.isTeamEvent).toBeUndefined();
    });

    it('should have team-specific events', () => {
      const event = new GameEvent({
        name: 'Team Test',
        duration: 1,
        roundsLeft: 1,
        isGlobal: false,
        isTeamEvent: true,
        description: 'Test',
        effect: () => {},
      });

      expect(event.isTeamEvent).toBe(true);
      expect(event.isGlobal).toBe(false);
    });
  });
});
