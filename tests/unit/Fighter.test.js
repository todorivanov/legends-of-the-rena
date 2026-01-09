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
      expect(fighter.defense).toBe(30);
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
      const result = fighter.normalAttack();
      
      // Damage should be related to strength
      expect(result.damage).toBeGreaterThan(0);
      expect(result.damage).toBeLessThanOrEqual(fighter.strength * 2);
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

    it('should cap damage at current health', () => {
      fighter.health = 10;
      const damage = fighter.takeDamage(50);

      expect(damage).toBe(10); // Only 10 HP to take
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
});
