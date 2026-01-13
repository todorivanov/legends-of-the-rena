/**
 * Unit tests for SaveManagerV2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SaveManagerV2 } from '../../src/utils/SaveManagerV2.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
  };
})();

// Mock compression module
vi.mock('../../src/utils/compression.js', () => ({
  compress: (data) => `COMPRESSED:${data}`,
  decompress: (data) => data.replace('COMPRESSED:', ''),
  getSizeKB: (data) => (data.length / 1024).toFixed(2),
}));

describe('SaveManagerV2', () => {
  beforeEach(() => {
    // Replace global localStorage with our mock
    global.localStorage = localStorageMock;
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('getDefaultProfile', () => {
    it('should return a valid default profile structure', () => {
      const profile = SaveManagerV2.getDefaultProfile();

      expect(profile).toBeDefined();
      expect(profile.version).toBe('4.10.0');
      expect(profile.profile).toBeDefined();
      expect(profile.stats).toBeDefined();
      expect(profile.equipped).toBeDefined();
      expect(profile.inventory).toBeDefined();
      expect(profile.story).toBeDefined();
      expect(profile.storyProgress).toBeDefined();
    });

    it('should initialize character as not created', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      expect(profile.profile.characterCreated).toBe(false);
    });

    it('should initialize with starting resources', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      expect(profile.profile.gold).toBe(100);
      expect(profile.profile.level).toBe(1);
      expect(profile.profile.xp).toBe(0);
    });

    it('should initialize with health potions', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      expect(profile.inventory.consumables.health_potion).toBe(3);
      expect(profile.inventory.consumables.mana_potion).toBe(3);
    });

    it('should have tutorial region unlocked', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      expect(profile.story.unlockedRegions).toContain('tutorial');
      expect(profile.story.unlockedMissions).toContain('tutorial_1');
    });
  });

  describe('save', () => {
    it('should save data to localStorage', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      const result = SaveManagerV2.save(profile, 1, false);

      expect(result).toBe(true);
      expect(localStorage.getItem('legends_arena_save_slot1')).toBeDefined();
    });

    it('should update lastSavedAt timestamp', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      const beforeTime = Date.now();
      SaveManagerV2.save(profile, 1, false);

      const saved = JSON.parse(localStorage.getItem('legends_arena_save_slot1'));
      expect(saved.lastSavedAt).toBeGreaterThanOrEqual(beforeTime);
    });

    it('should preserve profile data', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.name = 'TestPlayer';
      profile.profile.level = 5;
      profile.profile.gold = 500;

      SaveManagerV2.save(profile, 1, false);
      const loaded = SaveManagerV2.load(1);

      expect(loaded.profile.name).toBe('TestPlayer');
      expect(loaded.profile.level).toBe(5);
      expect(loaded.profile.gold).toBe(500);
    });

    it('should save with compression when enabled', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, true);

      const data = localStorage.getItem('legends_arena_save_slot1');
      expect(data).toContain('COMPRESSED:');
    });

    it('should save without compression when disabled', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, false);

      const data = localStorage.getItem('legends_arena_save_slot1');
      expect(data).not.toContain('COMPRESSED:');
    });

    it('should create backup before saving', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      
      // First save
      SaveManagerV2.save(profile, 1, false);
      
      // Modify and save again
      profile.profile.level = 10;
      SaveManagerV2.save(profile, 1, false);

      const backups = SaveManagerV2.listBackups(1);
      expect(backups.length).toBeGreaterThan(0);
    });
  });

  describe('load', () => {
    it('should return null when no save exists', () => {
      const profile = SaveManagerV2.load(1);
      expect(profile).toBeNull();
    });

    it('should load saved data', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.name = 'LoadTest';
      profile.profile.level = 15;

      SaveManagerV2.save(profile, 1, false);
      const loaded = SaveManagerV2.load(1);

      expect(loaded.profile.name).toBe('LoadTest');
      expect(loaded.profile.level).toBe(15);
    });

    it('should load compressed data', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.gold = 999;

      SaveManagerV2.save(profile, 1, true);
      const loaded = SaveManagerV2.load(1);

      expect(loaded.profile.gold).toBe(999);
    });

    it('should migrate old save data', () => {
      const oldSave = {
        version: '3.0.0',
        profile: { name: 'OldPlayer', level: 5, characterCreated: true },
        stats: { totalWins: 10 },
        storyProgress: {
          unlockedRegions: ['tutorial'],
          completedMissions: { mission1: true, mission2: true },
        },
      };

      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(oldSave));
      const loaded = SaveManagerV2.load(1);

      expect(loaded.version).toBe('4.2.0');
      expect(loaded.story).toBeDefined();
      expect(Array.isArray(loaded.story.completedMissions)).toBe(true);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('legends_arena_save_slot1', 'corrupted{invalid}json');
      const loaded = SaveManagerV2.load(1);

      expect(loaded).toBeNull();
    });
  });

  describe('deleteSave', () => {
    it('should delete save data', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, false);

      expect(localStorage.getItem('legends_arena_save_slot1')).toBeDefined();

      SaveManagerV2.deleteSave(1);

      expect(localStorage.getItem('legends_arena_save_slot1')).toBeNull();
    });

    it('should delete all backups', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      
      // Create multiple saves to generate backups
      SaveManagerV2.save(profile, 1, false);
      profile.profile.level = 2;
      SaveManagerV2.save(profile, 1, false);
      profile.profile.level = 3;
      SaveManagerV2.save(profile, 1, false);

      const backupsBefore = SaveManagerV2.listBackups(1);
      expect(backupsBefore.length).toBeGreaterThan(0);

      SaveManagerV2.deleteSave(1);

      const backupsAfter = SaveManagerV2.listBackups(1);
      expect(backupsAfter.length).toBe(0);
    });

    it('should not delete saves from other slots', () => {
      const profile1 = SaveManagerV2.getDefaultProfile();
      const profile2 = SaveManagerV2.getDefaultProfile();
      profile2.profile.name = 'Player2';

      SaveManagerV2.save(profile1, 1, false);
      SaveManagerV2.save(profile2, 2, false);

      SaveManagerV2.deleteSave(1);

      expect(localStorage.getItem('legends_arena_save_slot1')).toBeNull();
      expect(localStorage.getItem('legends_arena_save_slot2')).toBeDefined();
    });
  });

  describe('backup and restore', () => {
    it('should create backups', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, false);
      
      profile.profile.level = 5;
      SaveManagerV2.save(profile, 1, false);

      const backups = SaveManagerV2.listBackups(1);
      expect(backups.length).toBeGreaterThan(0);
    });

    it('should list backups in chronological order', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      
      SaveManagerV2.save(profile, 1, false);
      profile.profile.level = 2;
      SaveManagerV2.save(profile, 1, false);
      profile.profile.level = 3;
      SaveManagerV2.save(profile, 1, false);

      const backups = SaveManagerV2.listBackups(1);
      
      for (let i = 0; i < backups.length - 1; i++) {
        expect(backups[i].timestamp).toBeGreaterThan(backups[i + 1].timestamp);
      }
    });

    it('should restore from latest backup', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.level = 10;
      SaveManagerV2.save(profile, 1, false);

      // Make another save
      profile.profile.level = 20;
      SaveManagerV2.save(profile, 1, false);

      // Restore from backup (should be level 10)
      SaveManagerV2.restoreBackup(1, 0);
      const restored = SaveManagerV2.load(1);

      expect(restored.profile.level).toBe(10);
    });

    it('should limit backups to MAX_BACKUPS', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      
      // Create many saves to generate many backups
      for (let i = 0; i < 10; i++) {
        profile.profile.level = i;
        SaveManagerV2.save(profile, 1, false);
      }

      const backups = SaveManagerV2.listBackups(1);
      expect(backups.length).toBeLessThanOrEqual(5); // MAX_BACKUPS = 5
    });
  });

  describe('get and set', () => {
    it('should get nested values', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.level = 25;
      SaveManagerV2.save(profile, 1, false);

      const level = SaveManagerV2.get('profile.level');
      expect(level).toBe(25);
    });

    it('should set nested values', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);
      
      SaveManagerV2.set('profile.name', 'SetTestPlayer');
      const name = SaveManagerV2.get('profile.name');
      
      expect(name).toBe('SetTestPlayer');
    });

    it('should create intermediate objects when setting nested values', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);
      
      SaveManagerV2.set('customData.nested.value', 42);
      const value = SaveManagerV2.get('customData.nested.value');
      
      expect(value).toBe(42);
    });

    it('should increment numeric values', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);
      
      SaveManagerV2.set('stats.totalWins', 10);
      SaveManagerV2.increment('stats.totalWins', 5);
      
      expect(SaveManagerV2.get('stats.totalWins')).toBe(15);
    });

    it('should increment from zero if value does not exist', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);
      
      SaveManagerV2.increment('stats.newStat', 10);
      
      expect(SaveManagerV2.get('stats.newStat')).toBe(10);
    });
  });

  describe('copySave', () => {
    it('should copy save to another slot', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.name = 'OriginalPlayer';
      profile.profile.level = 20;

      SaveManagerV2.save(profile, 1, false);
      SaveManagerV2.copySave(1, 2);

      const copied = SaveManagerV2.load(2);
      expect(copied.profile.name).toBe('OriginalPlayer');
      expect(copied.profile.level).toBe(20);
    });

    it('should update slot metadata in copied save', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, false);
      SaveManagerV2.copySave(1, 3);

      const copied = SaveManagerV2.load(3);
      expect(copied.saveMetadata.slot).toBe(3);
    });
  });

  describe('validateSaveData', () => {
    it('should validate correct save data', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      expect(SaveManagerV2.validateSaveData(profile)).toBe(true);
    });

    it('should reject null data', () => {
      expect(SaveManagerV2.validateSaveData(null)).toBe(false);
    });

    it('should reject data without profile', () => {
      const invalid = { stats: {}, version: '4.1.0' };
      expect(SaveManagerV2.validateSaveData(invalid)).toBe(false);
    });

    it('should reject data without stats', () => {
      const invalid = { profile: {}, version: '4.1.0' };
      expect(SaveManagerV2.validateSaveData(invalid)).toBe(false);
    });

    it('should reject data without version', () => {
      const invalid = { profile: {}, stats: {} };
      expect(SaveManagerV2.validateSaveData(invalid)).toBe(false);
    });
  });

  describe('migration', () => {
    it('should migrate completedMissions from object to array', () => {
      const oldSave = {
        version: '3.0.0',
        profile: { name: 'Test', characterCreated: true },
        stats: {},
        storyProgress: {
          completedMissions: {
            mission1: true,
            mission2: true,
            mission3: false,
          },
        },
      };

      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(oldSave));
      const loaded = SaveManagerV2.load(1);

      expect(Array.isArray(loaded.story.completedMissions)).toBe(true);
      expect(loaded.story.completedMissions).toContain('mission1');
      expect(loaded.story.completedMissions).toContain('mission2');
      expect(loaded.story.completedMissions).not.toContain('mission3');
    });

    it('should preserve existing array format for completedMissions', () => {
      const newSave = SaveManagerV2.getDefaultProfile();
      newSave.story.completedMissions = ['mission1', 'mission2'];

      SaveManagerV2.save(newSave, 1, false);
      const loaded = SaveManagerV2.load(1);

      expect(Array.isArray(loaded.story.completedMissions)).toBe(true);
      expect(loaded.story.completedMissions.length).toBe(2);
    });

    it('should add missing fields with defaults', () => {
      const incompleteSave = {
        version: '3.0.0',
        profile: { name: 'Test', level: 5 },
        stats: { totalWins: 10 },
      };

      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(incompleteSave));
      const loaded = SaveManagerV2.load(1);

      expect(loaded.inventory).toBeDefined();
      expect(loaded.equipped).toBeDefined();
      expect(loaded.settings).toBeDefined();
      expect(loaded.story).toBeDefined();
    });
  });

  describe('listSaveSlots', () => {
    it('should list empty slots', () => {
      const slots = SaveManagerV2.listSaveSlots();
      
      expect(slots.length).toBe(3); // MAX_SAVE_SLOTS
      expect(slots.every(slot => !slot.exists)).toBe(true);
    });

    it('should list existing saves', () => {
      const profile1 = SaveManagerV2.getDefaultProfile();
      profile1.profile.name = 'Player1';
      const profile2 = SaveManagerV2.getDefaultProfile();
      profile2.profile.name = 'Player2';

      SaveManagerV2.save(profile1, 1, false);
      SaveManagerV2.save(profile2, 2, false);

      const slots = SaveManagerV2.listSaveSlots();
      
      expect(slots[0].exists).toBe(true);
      expect(slots[0].playerName).toBe('Player1');
      expect(slots[1].exists).toBe(true);
      expect(slots[1].playerName).toBe('Player2');
      expect(slots[2].exists).toBe(false);
    });

    it('should include save metadata', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.level = 10;
      profile.profile.gold = 500;

      SaveManagerV2.save(profile, 1, false);
      const slots = SaveManagerV2.listSaveSlots();

      expect(slots[0].level).toBe(10);
      expect(slots[0].gold).toBe(500);
      expect(slots[0].version).toBe('4.10.0');
    });
  });

  describe('compareVersions', () => {
    it('should correctly compare versions', () => {
      expect(SaveManagerV2.compareVersions('4.1.0', '4.0.0')).toBe(1);
      expect(SaveManagerV2.compareVersions('4.0.0', '4.1.0')).toBe(-1);
      expect(SaveManagerV2.compareVersions('4.1.0', '4.1.0')).toBe(0);
    });

    it('should compare major versions', () => {
      expect(SaveManagerV2.compareVersions('5.0.0', '4.9.9')).toBe(1);
      expect(SaveManagerV2.compareVersions('3.0.0', '4.0.0')).toBe(-1);
    });

    it('should compare minor versions', () => {
      expect(SaveManagerV2.compareVersions('4.2.0', '4.1.9')).toBe(1);
      expect(SaveManagerV2.compareVersions('4.1.0', '4.2.0')).toBe(-1);
    });

    it('should compare patch versions', () => {
      expect(SaveManagerV2.compareVersions('4.1.2', '4.1.1')).toBe(1);
      expect(SaveManagerV2.compareVersions('4.1.1', '4.1.2')).toBe(-1);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty localStorage gracefully', () => {
      localStorageMock.clear();
      const profile = SaveManagerV2.load(1);
      
      expect(profile).toBeNull();
    });

    it('should handle loading non-existent slot', () => {
      const profile = SaveManagerV2.load(99);
      
      expect(profile).toBeNull();
    });

    it('should handle deleting non-existent save', () => {
      const result = SaveManagerV2.deleteSave(99);
      expect(result).toBe(true); // Should succeed even if nothing to delete
    });

    it('should handle restoring when no backups exist', () => {
      const result = SaveManagerV2.restoreBackup(1, 0);
      expect(result).toBe(false);
    });

    it('should prevent data loss on partial save failure', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.level = 10;
      SaveManagerV2.save(profile, 1, false);

      // Even if next save would fail, backup should exist
      const backups = SaveManagerV2.listBackups(1);
      const hasBackup = backups.length > 0 || localStorage.getItem('legends_arena_save_slot1') !== null;
      
      expect(hasBackup).toBe(true);
    });
  });
});
