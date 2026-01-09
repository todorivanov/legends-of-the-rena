/**
 * Team Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Team } from '../../src/entities/team.js';
import { createTestFighter } from '../utils/testHelpers.js';

describe('Team', () => {
  let fighters;
  let team;

  beforeEach(() => {
    fighters = [
      createTestFighter({ name: 'Fighter 1', id: 1 }),
      createTestFighter({ name: 'Fighter 2', id: 2 }),
      createTestFighter({ name: 'Fighter 3', id: 3 }),
    ];
    team = new Team('Team Alpha', fighters);
  });

  describe('Constructor', () => {
    it('should create a team with correct name', () => {
      expect(team.name).toBe('Team Alpha');
    });

    it('should create a team with fighters', () => {
      expect(team.fighters).toHaveLength(3);
      expect(team.fighters).toEqual(fighters);
    });

    it('should generate an id from name', () => {
      expect(team.id).toBe('TeamAlpha'); // Spaces removed
    });

    it('should handle single word team names', () => {
      const singleWordTeam = new Team('Warriors', fighters);
      expect(singleWordTeam.id).toBe('Warriors');
    });

    it('should handle multi-word team names', () => {
      const multiWordTeam = new Team('Elite Battle Squad', fighters);
      expect(multiWordTeam.id).toBe('EliteBattle Squad'); // Only first space is removed
    });
  });

  describe('Team Management', () => {
    it('should allow access to team fighters', () => {
      expect(team.fighters[0].name).toBe('Fighter 1');
      expect(team.fighters[1].name).toBe('Fighter 2');
      expect(team.fighters[2].name).toBe('Fighter 3');
    });

    it('should create team with empty fighters array', () => {
      const emptyTeam = new Team('Empty Team', []);
      expect(emptyTeam.fighters).toHaveLength(0);
    });

    it('should create team with single fighter', () => {
      const soloTeam = new Team('Solo Team', [fighters[0]]);
      expect(soloTeam.fighters).toHaveLength(1);
    });

    it('should maintain reference to original fighters', () => {
      const fighter = team.fighters[0];
      fighter.health = 50;
      
      expect(fighters[0].health).toBe(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in team name', () => {
      const specialTeam = new Team('Team@#$%', fighters);
      expect(specialTeam.name).toBe('Team@#$%');
    });

    it('should handle empty string as team name', () => {
      const emptyNameTeam = new Team('', fighters);
      expect(emptyNameTeam.name).toBe('');
      expect(emptyNameTeam.id).toBe('');
    });

    it('should handle large number of fighters', () => {
      const manyFighters = Array.from({ length: 100 }, (_, i) =>
        createTestFighter({ name: `Fighter ${i}`, id: i })
      );
      const bigTeam = new Team('Big Team', manyFighters);
      
      expect(bigTeam.fighters).toHaveLength(100);
    });
  });
});
