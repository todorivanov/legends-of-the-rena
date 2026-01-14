/**
 * TalentManager Unit Tests
 * Tests for talent tree system, point allocation, and effects
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TalentManager } from '../../src/game/TalentManager.js';

// Mock gameStore
let mockState = {
  player: {
    level: 10,
    gold: 1000,
    character: {
      class: 'WARRIOR',
    },
    talents: {
      tree1: {},
      tree2: {},
      tree3: {},
    },
  },
};

vi.mock('../../src/store/gameStore.js', () => ({
  gameStore: {
    getState: vi.fn(() => mockState),
    dispatch: vi.fn((action) => {
      if (action.type === 'LEARN_TALENT') {
        const { treeId, talentId } = action.payload;
        const currentRank = mockState.player.talents[treeId]?.[talentId] || 0;
        mockState.player.talents[treeId][talentId] = currentRank + 1;
      } else if (action.type === 'UNLEARN_TALENT') {
        const { treeId, talentId } = action.payload;
        const currentRank = mockState.player.talents[treeId]?.[talentId] || 0;
        if (currentRank > 1) {
          mockState.player.talents[treeId][talentId] = currentRank - 1;
        } else {
          delete mockState.player.talents[treeId][talentId];
        }
      } else if (action.type === 'RESET_TALENTS') {
        mockState.player.talents = {
          tree1: {},
          tree2: {},
          tree3: {},
        };
        mockState.player.gold -= action.payload.cost;
      }
    }),
  },
}));

// Mock ConsoleLogger
vi.mock('../../src/utils/ConsoleLogger.js', () => ({
  ConsoleLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  LogCategory: {
    SYSTEM: 'SYSTEM',
  },
}));

// Mock talent trees
vi.mock('../../src/data/talents.js', () => ({
  TALENT_TREES: {
    WARRIOR: {
      tree1: {
        name: 'Arms',
        description: 'Weapon mastery',
        icon: '⚔️',
        talents: [
          {
            id: 'war_arms_dmg_1',
            name: 'Weapon Mastery',
            description: 'Increase strength',
            icon: '💪',
            maxRank: 5,
            row: 0,
            column: 1,
            requires: [],
            requiresPoints: 0,
            effects: {
              stats: { strength: 2 },
            },
          },
          {
            id: 'war_arms_crit_1',
            name: 'Precise Strikes',
            description: 'Increase crit',
            icon: '🎯',
            maxRank: 3,
            row: 1,
            column: 0,
            requires: [],
            requiresPoints: 5,
            effects: {
              stats: { critChance: 2 },
            },
          },
          {
            id: 'war_arms_execute',
            name: 'Execute',
            description: 'Deal more damage to low HP enemies',
            icon: '⚡',
            maxRank: 1,
            row: 2,
            column: 1,
            requires: ['war_arms_dmg_1'],
            requiresPoints: 10,
            effects: {
              passive: {
                type: 'execute',
                damageBonus: 0.5,
                threshold: 0.2,
              },
            },
          },
        ],
      },
      tree2: {
        name: 'Fury',
        description: 'Rage and speed',
        icon: '😤',
        talents: [],
      },
      tree3: {
        name: 'Protection',
        description: 'Defense and survival',
        icon: '🛡️',
        talents: [],
      },
    },
  },
}));

describe('TalentManager', () => {
  beforeEach(() => {
    mockState = {
      player: {
        level: 10,
        gold: 1000,
        character: {
          class: 'WARRIOR',
        },
        talents: {
          tree1: {},
          tree2: {},
          tree3: {},
        },
      },
    };
  });

  describe('getTalentTrees', () => {
    it('should return talent trees for a class', () => {
      const trees = TalentManager.getTalentTrees('WARRIOR');
      
      expect(trees).toBeDefined();
      expect(trees.tree1).toBeDefined();
      expect(trees.tree1.name).toBe('Arms');
    });

    it('should return null for invalid class', () => {
      const trees = TalentManager.getTalentTrees('INVALID_CLASS');
      
      expect(trees).toBeNull();
    });
  });

  describe('getTalentNode', () => {
    it('should return specific talent node', () => {
      const talent = TalentManager.getTalentNode('WARRIOR', 'tree1', 'war_arms_dmg_1');
      
      expect(talent).toBeDefined();
      expect(talent.name).toBe('Weapon Mastery');
      expect(talent.maxRank).toBe(5);
    });

    it('should return null for non-existent talent', () => {
      const talent = TalentManager.getTalentNode('WARRIOR', 'tree1', 'fake_talent');
      
      expect(talent).toBeNull();
    });
  });

  describe('Talent Points', () => {
    it('should calculate total talent points based on level', () => {
      mockState.player.level = 10;
      const points = TalentManager.getTotalTalentPoints();
      
      expect(points).toBe(9); // Level 10 = 9 points (level - 1)
    });

    it('should return 0 points at level 1', () => {
      mockState.player.level = 1;
      const points = TalentManager.getTotalTalentPoints();
      
      expect(points).toBe(0);
    });

    it('should calculate spent talent points', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5,
          war_arms_crit_1: 3,
        },
        tree2: {},
        tree3: {},
      };

      const spent = TalentManager.getSpentTalentPoints();
      
      expect(spent).toBe(8);
    });

    it('should calculate available talent points', () => {
      mockState.player.level = 10;
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 3,
        },
        tree2: {},
        tree3: {},
      };

      const available = TalentManager.getAvailableTalentPoints();
      
      expect(available).toBe(6); // 9 total - 3 spent = 6 available
    });

    it('should calculate points in specific tree', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5,
          war_arms_crit_1: 3,
        },
        tree2: {},
        tree3: {},
      };

      const treePoints = TalentManager.getTreePoints('tree1');
      
      expect(treePoints).toBe(8);
    });
  });

  describe('canLearnTalent', () => {
    it('should allow learning basic talent', () => {
      mockState.player.level = 10;
      
      const canLearn = TalentManager.canLearnTalent('WARRIOR', 'tree1', 'war_arms_dmg_1');
      
      expect(canLearn.canLearn).toBe(true);
    });

    it('should prevent learning without available points', () => {
      mockState.player.level = 1;
      
      const canLearn = TalentManager.canLearnTalent('WARRIOR', 'tree1', 'war_arms_dmg_1');
      
      expect(canLearn.canLearn).toBe(false);
      expect(canLearn.reason).toBe('No talent points available');
    });

    it('should prevent learning maxed talent', () => {
      mockState.player.level = 10;
      mockState.player.talents.tree1 = {
        war_arms_dmg_1: 5, // Max rank
      };
      
      const canLearn = TalentManager.canLearnTalent('WARRIOR', 'tree1', 'war_arms_dmg_1');
      
      expect(canLearn.canLearn).toBe(false);
      expect(canLearn.reason).toBe('Maximum rank reached');
    });

    it('should enforce point requirements', () => {
      mockState.player.level = 10;
      mockState.player.talents.tree1 = {}; // 0 points in tree
      
      const canLearn = TalentManager.canLearnTalent('WARRIOR', 'tree1', 'war_arms_crit_1');
      
      expect(canLearn.canLearn).toBe(false);
      expect(canLearn.reason).toContain('Requires 5 points');
    });

    it('should enforce prerequisite talents', () => {
      mockState.player.level = 15;
      mockState.player.talents.tree1 = {
        war_arms_dmg_1: 3, // Not maxed
      };
      
      const canLearn = TalentManager.canLearnTalent('WARRIOR', 'tree1', 'war_arms_execute');
      
      expect(canLearn.canLearn).toBe(false);
      expect(canLearn.reason).toContain('Requires');
    });

    it('should allow learning with prerequisites met', () => {
      mockState.player.level = 15;
      mockState.player.talents.tree1 = {
        war_arms_dmg_1: 5, // Maxed (prerequisite)
        war_arms_crit_1: 3, // Another 3 points
        // Total: 8 points, need 10 for war_arms_execute
      };
      
      // Add 2 more points to reach 10
      mockState.player.talents.tree1.war_arms_hp_1 = 2;

      const canLearn = TalentManager.canLearnTalent('WARRIOR', 'tree1', 'war_arms_execute');

      expect(canLearn.canLearn).toBe(true);
    });
  });

  describe('learnTalent', () => {
    it('should successfully learn a talent', () => {
      mockState.player.level = 10;
      
      const result = TalentManager.learnTalent('tree1', 'war_arms_dmg_1');
      
      expect(result).toBe(true);
    });

    it('should fail to learn invalid talent', () => {
      mockState.player.level = 10;
      
      const result = TalentManager.learnTalent('tree1', 'fake_talent');
      
      expect(result).toBe(false);
    });
  });

  describe('unlearnTalent', () => {
    it('should successfully unlearn a talent', () => {
      mockState.player.talents.tree1 = {
        war_arms_dmg_1: 3,
      };
      
      const result = TalentManager.unlearnTalent('tree1', 'war_arms_dmg_1');
      
      expect(result).toBe(true);
    });

    it('should fail to unlearn talent with 0 ranks', () => {
      mockState.player.talents.tree1 = {};
      
      const result = TalentManager.unlearnTalent('tree1', 'war_arms_dmg_1');
      
      expect(result).toBe(false);
    });

    it('should prevent unlearning if other talents depend on it', () => {
      mockState.player.talents.tree1 = {
        war_arms_dmg_1: 5,
        war_arms_execute: 1, // Depends on dmg_1
      };
      
      const result = TalentManager.unlearnTalent('tree1', 'war_arms_dmg_1');
      
      expect(result).toBe(false);
    });
  });

  describe('resetAllTalents', () => {
    it('should reset all talents', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5,
        },
        tree2: {},
        tree3: {},
      };
      
      const result = TalentManager.resetAllTalents(0);
      
      expect(result).toBe(true);
    });

    it('should deduct gold cost', () => {
      mockState.player.gold = 500;
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 3,
        },
        tree2: {},
        tree3: {},
      };
      
      const result = TalentManager.resetAllTalents(100);
      
      expect(result).toBe(true);
    });

    it('should fail if cannot afford', () => {
      mockState.player.gold = 50;
      
      const result = TalentManager.resetAllTalents(100);
      
      expect(result).toBe(false);
    });
  });

  describe('getActiveTalentEffects', () => {
    it('should aggregate stat modifiers', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5, // +2 STR per rank = +10 STR
          war_arms_crit_1: 3, // +2% crit per rank = +6% crit
        },
        tree2: {},
        tree3: {},
      };

      const effects = TalentManager.getActiveTalentEffects();
      
      expect(effects.stats.strength).toBe(10);
      expect(effects.stats.critChance).toBe(6);
    });

    it('should return passive effects', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5,
          war_arms_execute: 1,
        },
        tree2: {},
        tree3: {},
      };

      const effects = TalentManager.getActiveTalentEffects();
      
      expect(effects.passives).toHaveLength(1);
      expect(effects.passives[0].type).toBe('execute');
    });

    it('should return empty effects with no talents', () => {
      mockState.player.talents = {
        tree1: {},
        tree2: {},
        tree3: {},
      };

      const effects = TalentManager.getActiveTalentEffects();
      
      expect(effects.stats.strength).toBe(0);
      expect(effects.passives).toHaveLength(0);
    });
  });

  describe('applyTalentsToFighter', () => {
    it('should apply stat bonuses to fighter', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5, // +10 STR
        },
        tree2: {},
        tree3: {},
      };

      const fighter = {
        strength: 50,
        health: 100,
      };

      const modified = TalentManager.applyTalentsToFighter(fighter);
      
      expect(modified.strength).toBe(60); // 50 + 10
    });

    it('should attach passive effects to fighter', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5,
          war_arms_execute: 1,
        },
        tree2: {},
        tree3: {},
      };

      const fighter = {
        strength: 50,
      };

      const modified = TalentManager.applyTalentsToFighter(fighter);
      
      expect(modified.talentPassives).toBeDefined();
      expect(modified.talentPassives.length).toBeGreaterThan(0);
    });
  });

  describe('getTreeSummary', () => {
    it('should return tree summary', () => {
      mockState.player.talents = {
        tree1: {
          war_arms_dmg_1: 5,
          war_arms_crit_1: 3,
        },
        tree2: {},
        tree3: {},
      };

      const summary = TalentManager.getTreeSummary('WARRIOR', 'tree1');
      
      expect(summary).toBeDefined();
      expect(summary.name).toBe('Arms');
      expect(summary.pointsSpent).toBe(8);
      expect(summary.learnedTalents).toBe(2);
    });
  });
});
