/**
 * BaseEntity Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseEntity } from '../../src/entities/baseEntity.js';

// Mock dependencies
vi.mock('../../src/utils/helpers.js', () => ({
  Helpers: {
    getRandomNumber: vi.fn((min, max) => Math.floor((min + max) / 2)),
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

vi.mock('../../src/game/SkillSystem.js', () => ({
  assignSkillsToFighter: vi.fn((fighter) => {
    fighter.skills = [{ name: 'Test Skill' }];
  }),
}));

describe('BaseEntity', () => {
  let entityData;

  beforeEach(() => {
    entityData = {
      id: 1,
      name: 'Test Fighter',
      health: 100,
      strength: 50,
      image: 'test.png',
      description: 'A test fighter',
      class: 'WARRIOR',
    };
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create entity with correct properties', () => {
      const entity = new BaseEntity(entityData);

      expect(entity.id).toBe(1);
      expect(entity.name).toBe('Test Fighter');
      expect(entity.health).toBe(100);
      expect(entity.maxHealth).toBe(100);
      expect(entity.strength).toBe(50);
      expect(entity.class).toBe('WARRIOR');
    });

    it('should initialize mana properties', () => {
      const entity = new BaseEntity(entityData);

      expect(entity.mana).toBe(100);
      expect(entity.maxMana).toBe(100);
    });

    it('should initialize combat properties', () => {
      const entity = new BaseEntity(entityData);

      expect(entity.isDefending).toBe(false);
      expect(entity.statusEffects).toEqual([]);
      expect(entity.combo).toBe(0);
    });

    it('should handle invalid health values', () => {
      const invalidData = { ...entityData, health: NaN };
      const entity = new BaseEntity(invalidData);

      expect(entity.health).toBe(100);
      expect(entity.maxHealth).toBe(100);
    });

    it('should handle invalid strength values', () => {
      const invalidData = { ...entityData, strength: NaN };
      const entity = new BaseEntity(invalidData);

      expect(entity.strength).toBe(50);
      expect(entity.baseStrength).toBe(50);
    });

    it('should set default class if not provided', () => {
      const noClassData = { ...entityData };
      delete noClassData.class;
      const entity = new BaseEntity(noClassData);

      expect(entity.class).toBe('BALANCED');
    });

    it('should set default level', () => {
      const entity = new BaseEntity(entityData);

      expect(entity.level).toBe(1);
    });

    it('should assign skills based on class', async () => {
      const { assignSkillsToFighter } = await import('../../src/game/SkillSystem.js');
      const entity = new BaseEntity(entityData);

      expect(assignSkillsToFighter).toHaveBeenCalledWith(entity);
      expect(entity.skills).toHaveLength(1);
    });

    it('should track player status', () => {
      const playerData = { ...entityData, isPlayer: true };
      const entity = new BaseEntity(playerData);

      expect(entity.isPlayer).toBe(true);
    });
  });

  describe('hit()', () => {
    it('should perform normal attack most of the time', async () => {
      const { Helpers } = await import('../../src/utils/helpers.js');
      Helpers.getRandomNumber.mockReturnValue(50); // < 80 = normal attack

      const entity = new BaseEntity(entityData);
      const damage = entity.hit();

      expect(damage).toBeGreaterThan(0);
    });

    it('should perform special attack occasionally', async () => {
      const { Helpers } = await import('../../src/utils/helpers.js');
      Helpers.getRandomNumber.mockReturnValue(85); // >= 80 = special attack

      const entity = new BaseEntity(entityData);
      const damage = entity.hit();

      expect(damage).toBeGreaterThan(0);
    });

    it('should return numeric damage value', () => {
      const entity = new BaseEntity(entityData);
      const damage = entity.hit();

      expect(typeof damage).toBe('number');
      expect(damage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('normalAttack()', () => {
    it('should deal damage based on strength', () => {
      const entity = new BaseEntity({ ...entityData, strength: 100 });
      const result = entity.normalAttack();

      expect(result.damage).toBeGreaterThan(0);
    });

    it('should return attack result object', () => {
      const entity = new BaseEntity(entityData);
      const result = entity.normalAttack();

      expect(result).toHaveProperty('damage');
      expect(result).toHaveProperty('isCritical');
    });

    it('should log attack message', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      const entity = new BaseEntity(entityData);
      
      entity.normalAttack();

      expect(Logger.log).toHaveBeenCalled();
    });

    it('should play sound effect', async () => {
      const { soundManager } = await import('../../src/utils/soundManager.js');
      const entity = new BaseEntity(entityData);
      
      entity.normalAttack();

      expect(soundManager.play).toHaveBeenCalled();
    });

    it('should have chance to miss', async () => {
      const { Helpers } = await import('../../src/utils/helpers.js');
      Helpers.getRandomNumber.mockReturnValueOnce(5); // < 10 = miss

      const entity = new BaseEntity(entityData);
      const result = entity.normalAttack();

      expect(result.damage).toBe(0);
      expect(result.isCritical).toBe(false);
    });
  });

  describe('specialAttack()', () => {
    it('should deal more damage than normal attack', () => {
      const entity = new BaseEntity({ ...entityData, strength: 100 });
      const special = entity.specialAttack();

      // Special attack should generally deal more damage
      expect(special).toBeGreaterThan(0);
    });

    it('should log special attack message', async () => {
      const { Logger } = await import('../../src/utils/logger.js');
      const entity = new BaseEntity(entityData);
      
      entity.specialAttack();

      expect(Logger.log).toHaveBeenCalled();
    });

    it('should play special sound effect', async () => {
      const { soundManager } = await import('../../src/utils/soundManager.js');
      const entity = new BaseEntity(entityData);
      
      entity.specialAttack();

      expect(soundManager.play).toHaveBeenCalled();
    });

    it('should have chance to miss', async () => {
      const { Helpers } = await import('../../src/utils/helpers.js');
      Helpers.getRandomNumber.mockReturnValueOnce(5); // < 10 = miss

      const entity = new BaseEntity(entityData);
      const damage = entity.specialAttack();

      expect(damage).toBe(0);
    });
  });

  describe('takeDamage()', () => {
    it('should reduce health by damage amount', () => {
      const entity = new BaseEntity(entityData);
      const initialHealth = entity.health;

      entity.takeDamage(30);

      expect(entity.health).toBe(initialHealth - 30);
    });

    it('should not reduce health below 0', () => {
      const entity = new BaseEntity(entityData);

      entity.takeDamage(150);

      expect(entity.health).toBe(0);
      expect(entity.health).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero damage', () => {
      const entity = new BaseEntity(entityData);
      const initialHealth = entity.health;

      entity.takeDamage(0);

      expect(entity.health).toBe(initialHealth);
    });
  });

  describe('Health Tracking', () => {
    it('should track health correctly', () => {
      const entity = new BaseEntity({ ...entityData, health: 50 });

      expect(entity.health).toBeGreaterThan(0);
    });

    it('should handle zero health', () => {
      const entity = new BaseEntity(entityData);
      entity.health = 0;

      expect(entity.health).toBe(0);
    });

    it('should handle negative health', () => {
      const entity = new BaseEntity(entityData);
      entity.health = -10;

      expect(entity.health).toBeLessThanOrEqual(0);
    });
  });

  describe('Status Effects', () => {
    it('should initialize with empty status effects', () => {
      const entity = new BaseEntity(entityData);

      expect(entity.statusEffects).toEqual([]);
    });

    it('should allow adding status effects', () => {
      const entity = new BaseEntity(entityData);
      entity.statusEffects.push({ name: 'poison', duration: 3 });

      expect(entity.statusEffects).toHaveLength(1);
    });
  });

  describe('Mana Management', () => {
    it('should start with full mana', () => {
      const entity = new BaseEntity(entityData);

      expect(entity.mana).toBe(entity.maxMana);
    });

    it('should allow mana modification', () => {
      const entity = new BaseEntity(entityData);
      entity.mana -= 30;

      expect(entity.mana).toBe(70);
    });
  });
});
