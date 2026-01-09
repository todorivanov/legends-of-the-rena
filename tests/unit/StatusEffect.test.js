/**
 * StatusEffect Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StatusEffect, STATUS_EFFECTS } from '../../src/game/StatusEffect.js';
import { createTestFighter } from '../utils/testHelpers.js';

describe('StatusEffect', () => {
  let statusEffect;
  let fighter;

  beforeEach(() => {
    fighter = createTestFighter({ health: 100, maxHealth: 100, strength: 50, defense: 30 });
    statusEffect = new StatusEffect('strength_boost', 'buff', 3, 20, '💪');
  });

  describe('Constructor', () => {
    it('should create a status effect with correct properties', () => {
      expect(statusEffect.name).toBe('strength_boost');
      expect(statusEffect.type).toBe('buff');
      expect(statusEffect.duration).toBe(3);
      expect(statusEffect.value).toBe(20);
      expect(statusEffect.icon).toBe('💪');
    });
  });

  describe('tick()', () => {
    it('should reduce duration by 1', () => {
      const initialDuration = statusEffect.duration;
      statusEffect.tick();
      
      expect(statusEffect.duration).toBe(initialDuration - 1);
    });

    it('should return true if effect is still active', () => {
      statusEffect.duration = 2;
      const isActive = statusEffect.tick();
      
      expect(isActive).toBe(true);
      expect(statusEffect.duration).toBe(1);
    });

    it('should return false if effect has expired', () => {
      statusEffect.duration = 1;
      const isActive = statusEffect.tick();
      
      expect(isActive).toBe(false);
      expect(statusEffect.duration).toBe(0);
    });
  });

  describe('apply()', () => {
    it('should apply strength boost to fighter', () => {
      const initialStrength = fighter.strength;
      statusEffect.apply(fighter);
      
      expect(fighter.strength).toBe(initialStrength + 20);
    });

    it('should apply strength debuff to fighter', () => {
      const debuff = new StatusEffect('strength_debuff', 'debuff', 3, 15, '🥴');
      const initialStrength = fighter.strength;
      debuff.apply(fighter);
      
      expect(fighter.strength).toBe(initialStrength - 15);
    });

    it('should apply defense boost to fighter', () => {
      const defenseBoost = new StatusEffect('defense_boost', 'buff', 3, 25, '🛡️');
      const initialDefense = fighter.defense;
      defenseBoost.apply(fighter);
      
      expect(fighter.defense).toBe(initialDefense + 25);
    });

    it('should apply regeneration without exceeding maxHealth', () => {
      const regen = new StatusEffect('regeneration', 'buff', 5, 10, '💚');
      fighter.health = 95;
      fighter.showFloatingDamage = () => {}; // Mock method
      
      regen.apply(fighter);
      
      expect(fighter.health).toBe(100);
      expect(fighter.health).toBeLessThanOrEqual(fighter.maxHealth);
    });

    it('should apply poison damage', () => {
      const poison = new StatusEffect('poison', 'debuff', 3, 5, '☠️');
      const initialHealth = fighter.health;
      fighter.showFloatingDamage = () => {}; // Mock method
      
      poison.apply(fighter);
      
      expect(fighter.health).toBe(initialHealth - 5);
    });

    it('should apply burn damage', () => {
      const burn = new StatusEffect('burn', 'debuff', 4, 8, '🔥');
      const initialHealth = fighter.health;
      fighter.showFloatingDamage = () => {}; // Mock method
      
      burn.apply(fighter);
      
      expect(fighter.health).toBe(initialHealth - 8);
    });

    it('should apply mana regeneration', () => {
      const manaRegen = new StatusEffect('mana_regen', 'buff', 3, 15, '✨');
      fighter.mana = 20;
      fighter.maxMana = 100;
      
      manaRegen.apply(fighter);
      
      expect(fighter.mana).toBe(35);
    });

    it('should not exceed maxMana when regenerating mana', () => {
      const manaRegen = new StatusEffect('mana_regen', 'buff', 3, 30, '✨');
      fighter.mana = 80;
      fighter.maxMana = 100;
      
      manaRegen.apply(fighter);
      
      expect(fighter.mana).toBe(100);
      expect(fighter.mana).toBeLessThanOrEqual(fighter.maxMana);
    });

    it('should handle stun effect (no immediate action)', () => {
      const stun = new StatusEffect('stun', 'debuff', 1, 0, '💫');
      const initialStrength = fighter.strength;
      const initialHealth = fighter.health;
      
      stun.apply(fighter);
      
      // Stun doesn't modify stats directly
      expect(fighter.strength).toBe(initialStrength);
      expect(fighter.health).toBe(initialHealth);
    });
  });

  describe('remove()', () => {
    it('should remove strength boost from fighter', () => {
      statusEffect.apply(fighter);
      const boostedStrength = fighter.strength;
      
      statusEffect.remove(fighter);
      
      expect(fighter.strength).toBe(boostedStrength - 20);
    });

    it('should remove strength debuff from fighter', () => {
      const debuff = new StatusEffect('strength_debuff', 'debuff', 3, 15, '🥴');
      debuff.apply(fighter);
      const debuffedStrength = fighter.strength;
      
      debuff.remove(fighter);
      
      expect(fighter.strength).toBe(debuffedStrength + 15);
    });

    it('should remove defense boost from fighter', () => {
      const defenseBoost = new StatusEffect('defense_boost', 'buff', 3, 25, '🛡️');
      defenseBoost.apply(fighter);
      const boostedDefense = fighter.defense;
      
      defenseBoost.remove(fighter);
      
      expect(fighter.defense).toBe(boostedDefense - 25);
    });

    it('should restore original stats after buff expires', () => {
      const originalStrength = fighter.strength;
      statusEffect.apply(fighter);
      statusEffect.remove(fighter);
      
      expect(fighter.strength).toBe(originalStrength);
    });
  });

  describe('STATUS_EFFECTS constants', () => {
    it('should have STRENGTH_BOOST defined', () => {
      expect(STATUS_EFFECTS.STRENGTH_BOOST).toBeDefined();
      expect(STATUS_EFFECTS.STRENGTH_BOOST.name).toBe('strength_boost');
      expect(STATUS_EFFECTS.STRENGTH_BOOST.type).toBe('buff');
    });

    it('should have STRENGTH_DEBUFF defined', () => {
      expect(STATUS_EFFECTS.STRENGTH_DEBUFF).toBeDefined();
      expect(STATUS_EFFECTS.STRENGTH_DEBUFF.name).toBe('strength_debuff');
      expect(STATUS_EFFECTS.STRENGTH_DEBUFF.type).toBe('debuff');
    });

    it('should have REGENERATION defined', () => {
      expect(STATUS_EFFECTS.REGENERATION).toBeDefined();
      expect(STATUS_EFFECTS.REGENERATION.name).toBe('regeneration');
      expect(STATUS_EFFECTS.REGENERATION.type).toBe('buff');
    });

    it('should have all effects with required properties', () => {
      Object.values(STATUS_EFFECTS).forEach((effect) => {
        expect(effect.name).toBeDefined();
        expect(effect.type).toBeDefined();
        expect(effect.duration).toBeDefined();
        expect(effect.icon).toBeDefined();
        expect(effect.description).toBeDefined();
      });
    });
  });
});
