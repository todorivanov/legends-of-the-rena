/**
 * Combo System Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ComboSystem } from '../../src/game/ComboSystem.js';
import { createTestFighter } from '../utils/testHelpers.js';

describe('ComboSystem', () => {
  let comboSystem;
  let fighter;

  beforeEach(() => {
    comboSystem = new ComboSystem();
    fighter = createTestFighter({ class: 'BALANCED' });
  });

  describe('recordAction()', () => {
    it('should record an action', () => {
      comboSystem.recordAction(fighter, 'attack');

      expect(comboSystem.actionHistory).toHaveLength(1);
      expect(comboSystem.actionHistory[0]).toMatchObject({
        fighter: fighter.name,
        fighterId: fighter.id,
        type: 'attack',
      });
    });

    it('should limit history to maxHistory size', () => {
      // Record more than max
      for (let i = 0; i < 10; i++) {
        comboSystem.recordAction(fighter, 'attack');
      }

      expect(comboSystem.actionHistory.length).toBeLessThanOrEqual(comboSystem.maxHistory);
    });

    it('should record skill name for skill actions', () => {
      comboSystem.recordAction(fighter, 'skill', 'Power Slash');

      expect(comboSystem.actionHistory[0].skill).toBe('Power Slash');
    });
  });

  describe('checkForCombo()', () => {
    it('should detect Offensive Surge combo (2 attacks)', () => {
      comboSystem.recordAction(fighter, 'attack');
      comboSystem.recordAction(fighter, 'attack');

      const combo = comboSystem.checkForCombo(fighter);

      expect(combo).toBeDefined();
      expect(combo.name).toBe('Offensive Surge');
    });

    it('should return null if not enough actions', () => {
      comboSystem.recordAction(fighter, 'attack');

      const combo = comboSystem.checkForCombo(fighter);

      expect(combo).toBeNull();
    });

    it('should detect class-specific combos', () => {
      const balancedFighter = createTestFighter({ class: 'BALANCED' });

      comboSystem.recordAction(balancedFighter, 'skill', 'Power Slash');
      comboSystem.recordAction(balancedFighter, 'skill', 'Second Wind');

      const combo = comboSystem.checkForCombo(balancedFighter);

      expect(combo).toBeDefined();
      expect(combo.name).toBe('Perfect Balance');
    });

    it('should not trigger combos for wrong class', () => {
      const tankFighter = createTestFighter({ class: 'TANK' });

      // Try to trigger a BALANCED combo with a TANK
      comboSystem.recordAction(tankFighter, 'skill', 'Power Slash');
      comboSystem.recordAction(tankFighter, 'skill', 'Second Wind');

      const combo = comboSystem.checkForCombo(tankFighter);

      // Should not get Perfect Balance (BALANCED class only)
      expect(combo?.name).not.toBe('Perfect Balance');
    });
  });

  describe('applyComboEffects()', () => {
    beforeEach(() => {
      fighter._pendingCombo = {
        name: 'TestCombo',
        bonus: {
          damageMultiplier: 1.5,
          extraDamage: 20,
        },
      };
    });

    it('should apply damage multiplier', () => {
      const baseDamage = 100;
      const modifiedDamage = comboSystem.applyComboEffects(fighter, createTestFighter(), baseDamage);

      expect(modifiedDamage).toBe(Math.ceil(baseDamage * 1.5 + 20));
    });

    it('should apply healing', () => {
      fighter.health = 50;
      fighter._pendingCombo.bonus.heal = 30;

      comboSystem.applyComboEffects(fighter, createTestFighter(), 100);

      expect(fighter.health).toBe(80);
    });

    it('should not exceed maxHealth when healing', () => {
      fighter.health = 95;
      fighter.maxHealth = 100;
      fighter._pendingCombo.bonus.heal = 20;

      comboSystem.applyComboEffects(fighter, createTestFighter(), 100);

      expect(fighter.health).toBe(100);
      expect(fighter.health).toBeLessThanOrEqual(fighter.maxHealth);
    });

    it('should restore mana', () => {
      fighter.mana = 0;
      fighter._pendingCombo.bonus.manaRestore = 30;

      comboSystem.applyComboEffects(fighter, createTestFighter(), 100);

      expect(fighter.mana).toBe(30);
    });

    it('should clear pending combo after application', () => {
      comboSystem.applyComboEffects(fighter, createTestFighter(), 100);

      expect(fighter._pendingCombo).toBeNull();
    });
  });

  describe('getComboSuggestions()', () => {
    it('should return empty array with no history', () => {
      const suggestions = comboSystem.getComboSuggestions(fighter);

      expect(suggestions).toEqual([]);
    });

    it('should suggest next action for partial combo', () => {
      comboSystem.recordAction(fighter, 'attack');

      const suggestions = comboSystem.getComboSuggestions(fighter);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('combo');
      expect(suggestions[0]).toHaveProperty('nextAction');
      expect(suggestions[0]).toHaveProperty('progress');
    });
  });

  describe('reset()', () => {
    it('should clear all state', () => {
      comboSystem.recordAction(fighter, 'attack');
      comboSystem.activeCombo = { name: 'Test' };

      comboSystem.reset();

      expect(comboSystem.actionHistory).toEqual([]);
      expect(comboSystem.activeCombo).toBeNull();
      expect(comboSystem.comboMultiplier).toBe(1.0);
    });
  });

  describe('getComboStreak()', () => {
    it('should count consecutive actions by same fighter', () => {
      comboSystem.recordAction(fighter, 'attack');
      comboSystem.recordAction(fighter, 'attack');
      comboSystem.recordAction(fighter, 'attack');

      const streak = comboSystem.getComboStreak(fighter.id);

      expect(streak).toBe(3);
    });

    it('should break streak when different fighter acts', () => {
      const otherFighter = createTestFighter({ id: 999 });

      comboSystem.recordAction(fighter, 'attack');
      comboSystem.recordAction(fighter, 'attack');
      comboSystem.recordAction(otherFighter, 'attack');

      const streak = comboSystem.getComboStreak(fighter.id);

      expect(streak).toBe(0);
    });
  });
});
