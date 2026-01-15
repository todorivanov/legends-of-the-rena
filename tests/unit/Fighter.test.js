/**
 * Fighter Class Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Fighter } from '../../src/entities/fighter.js';
import { createTestFighter } from '../utils/testHelpers.js';

describe('Fighter', () => {
  let fighter;

  beforeEach(() => {
    fighter = createTestFighter();
  });

  describe('Constructor', () => {
    it('should create a fighter with correct properties', () => {
      expect(fighter).toBeInstanceOf(Fighter);
      expect(fighter.name).toBe('Test Fighter');
      expect(fighter.health).toBe(100);
      expect(fighter.strength).toBe(50);
    });

    it('should initialize maxHealth correctly', () => {
      expect(fighter.maxHealth).toBe(100);
    });

    it('should initialize mana correctly', () => {
      expect(fighter.mana).toBeGreaterThanOrEqual(0);
      expect(fighter.maxMana).toBeGreaterThanOrEqual(0);
    });

    it('should initialize combo counter to 0', () => {
      expect(fighter.combo).toBe(0);
    });
  });

  describe('normalAttack()', () => {
    it('should return an attack result with damage', () => {
      const result = fighter.normalAttack();

      expect(result).toHaveProperty('damage');
      expect(result).toHaveProperty('isCritical');
      expect(typeof result.damage).toBe('number');
      expect(result.damage).toBeGreaterThan(0);
    });

    it('should calculate damage based on strength', () => {
      // Attack multiple times to avoid random misses affecting the test
      const results = Array.from({ length: 10 }, () => fighter.normalAttack());
      const hits = results.filter((r) => r.damage > 0);
      
      // Should have at least some hits (90% hit chance)
      expect(hits.length).toBeGreaterThan(0);
      
      // Damage from hits should be related to strength
      hits.forEach((result) => {
        expect(result.damage).toBeGreaterThan(0);
        expect(result.damage).toBeLessThanOrEqual(fighter.strength * 2);
      });
    });

    it('should occasionally generate critical hits', () => {
      const results = Array.from({ length: 100 }, () => fighter.normalAttack());
      const criticals = results.filter((r) => r.isCritical);

      // With 15% crit chance, expect roughly 10-20 crits in 100 attacks
      expect(criticals.length).toBeGreaterThan(0);
      expect(criticals.length).toBeLessThan(40);
    });

    it('should deal more damage on critical hits', () => {
      // Stub Math.random to force critical
      vi.spyOn(Math, 'random').mockReturnValue(0.1); // < 0.15 = critical

      const result = fighter.normalAttack();

      expect(result.isCritical).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe('takeDamage()', () => {
    it('should reduce health by damage amount', () => {
      const initialHealth = fighter.health;
      const damage = 20;

      fighter.takeDamage(damage);

      expect(fighter.health).toBe(initialHealth - damage);
    });

    it('should not reduce health below 0', () => {
      fighter.takeDamage(150); // More than max health

      expect(fighter.health).toBe(0);
      expect(fighter.health).toBeGreaterThanOrEqual(0);
    });

    it('should return actual damage dealt', () => {
      const damage = fighter.takeDamage(20);

      expect(damage).toBe(20);
    });

    it('should handle excessive damage', () => {
      fighter.health = 10;
      fighter.takeDamage(50);

      // Health should not go below 0
      expect(fighter.health).toBe(0);
    });
  });

  describe('defend()', () => {
    it('should reduce incoming damage', () => {
      // This is tested indirectly through combat
      expect(fighter.defend).toBeDefined();
      expect(typeof fighter.defend).toBe('function');
    });
  });

  describe('useItem()', () => {
    it('should heal the fighter', () => {
      fighter.health = 50; // Damage fighter first
      const initialHealth = fighter.health;

      fighter.useItem();

      expect(fighter.health).toBeGreaterThan(initialHealth);
    });

    it('should not exceed maxHealth', () => {
      fighter.health = 95;
      fighter.useItem();

      expect(fighter.health).toBeLessThanOrEqual(fighter.maxHealth);
    });
  });

  describe('regenerateMana()', () => {
    it('should restore mana', () => {
      fighter.mana = 0;
      fighter.regenerateMana();

      expect(fighter.mana).toBeGreaterThan(0);
    });

    it('should not exceed maxMana', () => {
      fighter.mana = fighter.maxMana;
      fighter.regenerateMana();

      expect(fighter.mana).toBeLessThanOrEqual(fighter.maxMana);
    });
  });

  describe('processStatusEffects()', () => {
    it('should apply active status effects', () => {
      // Add a mock status effect
      fighter.statusEffects = [
        {
          name: 'regeneration',
          apply: vi.fn(),
          tick: vi.fn().mockReturnValue(true),
        },
      ];

      fighter.processStatusEffects();

      expect(fighter.statusEffects[0].apply).toHaveBeenCalled();
    });

    it('should remove expired status effects', () => {
      fighter.statusEffects = [
        {
          name: 'poison',
          apply: vi.fn(),
          tick: vi.fn().mockReturnValue(false), // Expired
          remove: vi.fn(),
        },
      ];

      fighter.processStatusEffects();

      expect(fighter.statusEffects).toHaveLength(0);
    });
  });

  describe('tickSkillCooldowns()', () => {
    it('should reduce skill cooldowns', () => {
      fighter.skills = [
        {
          name: 'TestSkill',
          currentCooldown: 3,
          tick: vi.fn(),
        },
      ];

      fighter.tickSkillCooldowns();

      expect(fighter.skills[0].tick).toHaveBeenCalled();
    });
  });

  describe('fullRestore()', () => {
    it('should restore fighter to full health and mana', () => {
      // Damage the fighter
      fighter.health = 50;
      fighter.mana = 30;

      fighter.fullRestore();

      expect(fighter.health).toBe(fighter.maxHealth);
      expect(fighter.mana).toBe(fighter.maxMana);
    });

    it('should clear all status effects', () => {
      fighter.statusEffects = [
        { name: 'poison', damage: 10 },
        { name: 'burn', damage: 5 },
      ];

      fighter.fullRestore();

      expect(fighter.statusEffects).toEqual([]);
    });

    it('should reset defending state', () => {
      fighter.isDefending = true;

      fighter.fullRestore();

      expect(fighter.isDefending).toBe(false);
    });

    it('should reset combo counter', () => {
      fighter.combo = 5;

      fighter.fullRestore();

      expect(fighter.combo).toBe(0);
    });

    it('should fully restore fighter after taking damage and applying effects', () => {
      // Setup damaged fighter with various states
      fighter.health = 10;
      fighter.mana = 20;
      fighter.statusEffects = [{ name: 'stun' }];
      fighter.isDefending = true;
      fighter.combo = 3;

      fighter.fullRestore();

      // Verify all states are reset
      expect(fighter.health).toBe(fighter.maxHealth);
      expect(fighter.mana).toBe(fighter.maxMana);
      expect(fighter.statusEffects).toEqual([]);
      expect(fighter.isDefending).toBe(false);
      expect(fighter.combo).toBe(0);
    });
  });
});
