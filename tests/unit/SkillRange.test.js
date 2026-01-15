/**
 * Skill Range Validation Unit Tests
 * Tests for ensuring skills respect their defined range limits
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Skill } from '../../src/game/SkillSystem.js';
import { GridManager } from '../../src/game/GridManager.js';

describe('Skill Range Validation', () => {
  describe('Skill Class', () => {
    it('should have range property', () => {
      const skill = new Skill('Test Skill', 25, 2, 'damage', 50, null, 1);
      expect(skill).toHaveProperty('range');
      expect(skill.range).toBe(1);
    });

    it('should default range to null when not specified', () => {
      const skill = new Skill('Test Skill', 25, 2, 'damage', 50, null);
      expect(skill).toHaveProperty('range');
      expect(skill.range).toBeNull();
    });

    it('should allow different range values', () => {
      const meleeSkill = new Skill('Melee Skill', 25, 2, 'damage', 50, null, 1);
      const rangedSkill = new Skill('Ranged Skill', 35, 2, 'damage', 70, null, 4);

      expect(meleeSkill.range).toBe(1);
      expect(rangedSkill.range).toBe(4);
    });
  });

  describe('Power Slash Skill', () => {
    it('should have range of 1 (melee)', () => {
      const powerSlash = new Skill('Power Slash', 25, 2, 'damage', 50, null, 1);
      expect(powerSlash.range).toBe(1);
      expect(powerSlash.type).toBe('damage');
    });
  });

  describe('GridManager Range Checking', () => {
    let testGridManager;

    beforeEach(() => {
      // Create a new GridManager instance for each test
      testGridManager = new GridManager(5, 5);
    });

    it('should correctly calculate Manhattan distance', () => {
      // Adjacent cells (range 1)
      expect(testGridManager.getDistance(0, 0, 1, 0)).toBe(1);
      expect(testGridManager.getDistance(0, 0, 0, 1)).toBe(1);

      // 2 cells away
      expect(testGridManager.getDistance(0, 0, 2, 0)).toBe(2);
      expect(testGridManager.getDistance(0, 0, 1, 1)).toBe(2);

      // Diagonal distance
      expect(testGridManager.getDistance(0, 0, 2, 2)).toBe(4);

      // Opposite corners of 5x5 grid
      expect(testGridManager.getDistance(0, 0, 4, 4)).toBe(8);
    });

    it('should validate if target is in attack range', () => {
      // Create mock fighters with IDs
      const fighter1 = {
        id: 'fighter1',
        name: 'Fighter 1',
        gridPosition: { x: 0, y: 0 },
      };
      const fighter2 = {
        id: 'fighter2',
        name: 'Fighter 2',
        gridPosition: { x: 1, y: 0 },
      };
      const fighter3 = {
        id: 'fighter3',
        name: 'Fighter 3',
        gridPosition: { x: 4, y: 4 },
      };

      // Manually place fighters in grid
      testGridManager.placeFighter(fighter1, 0, 0);
      testGridManager.placeFighter(fighter2, 1, 0);
      testGridManager.placeFighter(fighter3, 4, 4);

      // Fighter 1 and 2 are adjacent (range 1)
      expect(testGridManager.isInAttackRange('fighter1', 'fighter2', 1)).toBe(true);

      // Fighter 1 and 3 are far apart (need range 8)
      expect(testGridManager.isInAttackRange('fighter1', 'fighter3', 1)).toBe(false);
      expect(testGridManager.isInAttackRange('fighter1', 'fighter3', 8)).toBe(true);

      // Range 4 skills (like Fireball)
      expect(testGridManager.isInAttackRange('fighter1', 'fighter2', 4)).toBe(true);
      expect(testGridManager.isInAttackRange('fighter1', 'fighter3', 4)).toBe(false);
    });
  });

  describe('Melee Skills Range', () => {
    it('should only work at range 1', () => {
      const meleeSkills = [
        new Skill('Power Slash', 25, 2, 'damage', 50, null, 1),
        new Skill('Swift Strike', 20, 1, 'damage', 35, null, 1),
        new Skill('Haymaker', 30, 2, 'damage', 65, null, 1),
        new Skill('Shadow Strike', 40, 3, 'damage', 90, null, 1),
      ];

      meleeSkills.forEach((skill) => {
        expect(skill.range).toBe(1);
      });
    });
  });

  describe('Ranged Skills Range', () => {
    it('should have appropriate range values', () => {
      const fireball = new Skill('Fireball', 35, 2, 'damage', 70, null, 4);
      const poisonDart = new Skill('Poison Dart', 25, 3, 'debuff', 0, 'POISON', 3);

      expect(fireball.range).toBe(4);
      expect(poisonDart.range).toBe(3);
    });
  });

  describe('Skills without range requirement', () => {
    it('should have null range for self-target and non-combat skills', () => {
      // Test examples of skills that don't need range validation
      const buffSkill = new Skill('Test Buff', 30, 3, 'buff', 0, 'STRENGTH_BOOST', null);
      const healSkill = new Skill('Test Heal', 30, 4, 'heal', 60, null, null);
      const movementSkill = new Skill('Test Movement', 10, 1, 'movement', 0, null, null);

      expect(buffSkill.range).toBeNull();
      expect(healSkill.range).toBeNull();
      expect(movementSkill.range).toBeNull();
    });
  });
});
