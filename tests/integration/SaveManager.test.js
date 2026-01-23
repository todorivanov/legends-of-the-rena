/**
 * SaveManager Integration Tests
 * Tests SaveManager integration with game systems and real localStorage
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SaveManagerV2 } from '../../src/utils/SaveManagerV2.js';
import { LevelingSystem } from '../../src/game/LevelingSystem.js';
import { EquipmentManager } from '../../src/game/EquipmentManager.js';
import { AchievementManager } from '../../src/game/AchievementManager.js';

// Mock localStorage for integration tests
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

describe('SaveManager Integration Tests', () => {
  beforeEach(() => {
    global.localStorage = localStorageMock;
    localStorageMock.clear();
    
    // Reset managers
    LevelingSystem.reset?.();
    EquipmentManager.reset?.();
    AchievementManager.reset?.();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('Game Progression Integration', () => {
    it('should persist player progression through save/load cycle', () => {
      // Initialize save
      const initialSave = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(initialSave, 1, false);

      // Simulate player progression
      SaveManagerV2.set('profile.level', 5);
      SaveManagerV2.set('profile.xp', 250);
      SaveManagerV2.set('profile.gold', 500);
      SaveManagerV2.increment('stats.totalWins', 10);
      SaveManagerV2.increment('stats.totalFightsPlayed', 15);

      // Load and verify
      const loaded = SaveManagerV2.load(1);
      expect(loaded.profile.level).toBe(5);
      expect(loaded.profile.xp).toBe(250);
      expect(loaded.profile.gold).toBe(500);
      expect(loaded.stats.totalWins).toBe(10);
      expect(loaded.stats.totalFightsPlayed).toBe(15);
    });

    it('should track win/loss ratio correctly', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Simulate combat results
      SaveManagerV2.increment('stats.totalWins', 7);
      SaveManagerV2.increment('stats.totalLosses', 3);
      SaveManagerV2.increment('stats.totalFightsPlayed', 10);

      const loaded = SaveManagerV2.load(1);
      const winRate = (loaded.stats.totalWins / loaded.stats.totalFightsPlayed) * 100;

      expect(loaded.stats.totalWins).toBe(7);
      expect(loaded.stats.totalLosses).toBe(3);
      expect(winRate).toBe(70);
    });

    it('should track win streaks', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      SaveManagerV2.set('stats.winStreak', 5);
      SaveManagerV2.set('stats.bestStreak', 5);

      // Win one more to increase streak
      SaveManagerV2.increment('stats.winStreak');
      const currentStreak = SaveManagerV2.get('stats.winStreak');
      
      // Update best streak if current is higher
      if (currentStreak > SaveManagerV2.get('stats.bestStreak')) {
        SaveManagerV2.set('stats.bestStreak', currentStreak);
      }

      const loaded = SaveManagerV2.load(1);
      expect(loaded.stats.winStreak).toBe(6);
      expect(loaded.stats.bestStreak).toBe(6);
    });
  });

  describe('Equipment System Integration', () => {
    it('should persist equipped items', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Equip items
      SaveManagerV2.set('equipped.weapon', 'bronze_sword');
      SaveManagerV2.set('equipped.armor', 'leather_armor');
      SaveManagerV2.set('equipped.accessory', 'health_ring');

      const loaded = SaveManagerV2.load(1);
      expect(loaded.equipped.weapon).toBe('bronze_sword');
      expect(loaded.equipped.armor).toBe('leather_armor');
      expect(loaded.equipped.accessory).toBe('health_ring');
    });

    it('should persist inventory with multiple items', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Add items to inventory
      const equipment = ['iron_sword', 'steel_armor', 'speed_boots'];
      SaveManagerV2.set('inventory.equipment', equipment);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.inventory.equipment).toHaveLength(3);
      expect(loaded.inventory.equipment).toContain('iron_sword');
    });

    it('should track equipment durability', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Set durability for equipped items
      SaveManagerV2.set('equipmentDurability.bronze_sword', 85);
      SaveManagerV2.set('equipmentDurability.leather_armor', 70);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.equipmentDurability.bronze_sword).toBe(85);
      expect(loaded.equipmentDurability.leather_armor).toBe(70);
    });

    it('should handle consumables correctly', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Use and restock consumables
      SaveManagerV2.set('inventory.consumables.health_potion', 2);
      SaveManagerV2.increment('inventory.consumables.mana_potion', 2);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.inventory.consumables.health_potion).toBe(2);
      expect(loaded.inventory.consumables.mana_potion).toBe(5); // 3 initial + 2
    });
  });

  describe('Story Mode Integration', () => {
    it('should persist story progression', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Progress through story
      const currentRegions = SaveManagerV2.get('story.unlockedRegions');
      currentRegions.push('grasslands', 'forest');
      SaveManagerV2.set('story.unlockedRegions', currentRegions);

      const currentMissions = SaveManagerV2.get('story.unlockedMissions');
      currentMissions.push('grasslands_1', 'grasslands_2');
      SaveManagerV2.set('story.unlockedMissions', currentMissions);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.story.unlockedRegions).toContain('grasslands');
      expect(loaded.story.unlockedRegions).toContain('forest');
      expect(loaded.story.unlockedMissions).toContain('grasslands_1');
    });

    it('should track completed missions', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Complete missions
      const completed = SaveManagerV2.get('story.completedMissions');
      completed.push('tutorial_1', 'tutorial_2', 'grasslands_1');
      SaveManagerV2.set('story.completedMissions', completed);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.story.completedMissions).toHaveLength(3);
      expect(loaded.story.completedMissions).toContain('tutorial_1');
    });

    it('should track mission stars', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Award stars for missions
      SaveManagerV2.set('story.missionStars.tutorial_1', 3);
      SaveManagerV2.set('story.missionStars.grasslands_1', 2);
      SaveManagerV2.set('story.missionStars.forest_1', 1);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.story.missionStars.tutorial_1).toBe(3);
      expect(loaded.story.missionStars.grasslands_1).toBe(2);
      expect(loaded.story.missionStars.forest_1).toBe(1);
    });

    it('should maintain backward compatibility with storyProgress', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Update using story
      SaveManagerV2.set('story.completedMissions', ['mission1', 'mission2']);

      const loaded = SaveManagerV2.load(1);
      
      // Both story and storyProgress should be synced
      expect(loaded.story.completedMissions).toEqual(loaded.storyProgress.completedMissions);
    });
  });

  describe('Marketplace Integration', () => {
    it('should persist marketplace state', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      const timestamp = Date.now();
      SaveManagerV2.set('marketplace.lastRefresh', timestamp);
      SaveManagerV2.set('marketplace.currentInventory', [
        { id: 'iron_sword', price: 150 },
        { id: 'health_potion', price: 25 },
      ]);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.marketplace.lastRefresh).toBe(timestamp);
      expect(loaded.marketplace.currentInventory).toHaveLength(2);
    });

    it('should track purchase history', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      const purchases = SaveManagerV2.get('marketplace.purchaseHistory');
      purchases.push({
        itemId: 'iron_sword',
        price: 150,
        timestamp: Date.now(),
      });
      SaveManagerV2.set('marketplace.purchaseHistory', purchases);
      SaveManagerV2.increment('stats.marketplacePurchases');

      const loaded = SaveManagerV2.load(1);
      expect(loaded.marketplace.purchaseHistory).toHaveLength(1);
      expect(loaded.stats.marketplacePurchases).toBe(1);
    });
  });

  describe('Economy Tracking', () => {
    it('should track gold earned and spent', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Earn gold
      SaveManagerV2.increment('profile.gold', 300);
      SaveManagerV2.increment('stats.totalGoldEarned', 300);

      // Spend gold
      SaveManagerV2.increment('profile.gold', -150);
      SaveManagerV2.increment('stats.totalGoldSpent', 150);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.profile.gold).toBe(250); // 100 initial + 300 - 150
      expect(loaded.stats.totalGoldEarned).toBe(300);
      expect(loaded.stats.totalGoldSpent).toBe(150);
    });

    it('should prevent negative gold', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      const currentGold = SaveManagerV2.get('profile.gold');
      const purchaseCost = 200;

      if (currentGold >= purchaseCost) {
        SaveManagerV2.increment('profile.gold', -purchaseCost);
      }

      const loaded = SaveManagerV2.load(1);
      expect(loaded.profile.gold).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Multi-Slot Operations', () => {
    it('should manage multiple save slots independently', () => {
      // Create different characters in different slots
      const profile1 = SaveManagerV2.getDefaultProfile();
      profile1.profile.name = 'Warrior';
      profile1.profile.level = 10;
      profile1.profile.class = 'WARRIOR';

      const profile2 = SaveManagerV2.getDefaultProfile();
      profile2.profile.name = 'Mage';
      profile2.profile.level = 8;
      profile2.profile.class = 'MAGE';

      SaveManagerV2.save(profile1, 1, false);
      SaveManagerV2.save(profile2, 2, false);

      const loaded1 = SaveManagerV2.load(1);
      const loaded2 = SaveManagerV2.load(2);

      expect(loaded1.profile.name).toBe('Warrior');
      expect(loaded1.profile.level).toBe(10);
      expect(loaded2.profile.name).toBe('Mage');
      expect(loaded2.profile.level).toBe(8);
    });

    it('should list all save slots with correct metadata', () => {
      const profile1 = SaveManagerV2.getDefaultProfile();
      profile1.profile.name = 'Player1';
      profile1.profile.level = 15;
      profile1.profile.gold = 1000;

      SaveManagerV2.save(profile1, 1, false);

      const slots = SaveManagerV2.listSaveSlots();

      expect(slots[0].exists).toBe(true);
      expect(slots[0].playerName).toBe('Player1');
      expect(slots[0].level).toBe(15);
      expect(slots[0].gold).toBe(1000);
      expect(slots[1].exists).toBe(false);
      expect(slots[2].exists).toBe(false);
    });

    it('should copy saves between slots correctly', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.name = 'OriginalPlayer';
      profile.profile.level = 20;
      profile.stats.totalWins = 50;

      SaveManagerV2.save(profile, 1, false);
      SaveManagerV2.copySave(1, 2);
      
      const slot2 = SaveManagerV2.load(2);

      expect(slot2.profile.name).toBe('OriginalPlayer');
      expect(slot2.profile.level).toBe(20);
      expect(slot2.stats.totalWins).toBe(50);
      expect(slot2.saveMetadata.slot).toBe(2);
    });
  });

  describe('Backup and Recovery Integration', () => {
    it('should create automatic backups during gameplay', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, false);

      // Simulate multiple saves during gameplay
      for (let i = 1; i <= 5; i++) {
        profile.profile.level = i;
        SaveManagerV2.save(profile, 1, false);
      }

      const backups = SaveManagerV2.listBackups(1);
      expect(backups.length).toBeGreaterThan(0);
      expect(backups.length).toBeLessThanOrEqual(5); // MAX_BACKUPS
    });

    it('should recover from save corruption', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      // First save to establish initial save file
      SaveManagerV2.save(profile, 1, false);
      
      // Modify and save again to create a backup (backup will have level 1)
      profile.profile.level = 10;
      SaveManagerV2.save(profile, 1, false);

      // Simulate corruption
      localStorage.setItem('legends_arena_save_slot1', 'corrupted{invalid}json');

      // Load should return null on corruption
      const loaded = SaveManagerV2.load(1);
      expect(loaded).toBeNull();

      // Restore from backup (should get the previous save with level 1)
      SaveManagerV2.restoreBackup(1, 0);
      const restored = SaveManagerV2.load(1);
      expect(restored.profile.level).toBe(1); // Backup contains previous state
    });

    it('should maintain backup history chronologically', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      SaveManagerV2.save(profile, 1, false);

      // Create multiple saves with progression
      profile.profile.level = 5;
      SaveManagerV2.save(profile, 1, false);
      
      profile.profile.level = 10;
      SaveManagerV2.save(profile, 1, false);

      const backups = SaveManagerV2.listBackups(1);
      
      // Verify backups are in chronological order (newest first)
      for (let i = 0; i < backups.length - 1; i++) {
        expect(backups[i].timestamp).toBeGreaterThan(backups[i + 1].timestamp);
      }
    });
  });

  describe('Settings Persistence', () => {
    it('should persist game settings', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      SaveManagerV2.set('settings.difficulty', 'hard');
      SaveManagerV2.set('settings.soundEnabled', false);
      SaveManagerV2.set('settings.soundVolume', 0.7);
      SaveManagerV2.set('settings.autoBattle', true);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.settings.difficulty).toBe('hard');
      expect(loaded.settings.soundEnabled).toBe(false);
      expect(loaded.settings.soundVolume).toBe(0.7);
      expect(loaded.settings.autoBattle).toBe(true);
    });

    it('should preserve default settings for new fields', () => {
      const oldSave = {
        version: '3.0.0',
        profile: { name: 'Test', characterCreated: true },
        stats: {},
        settings: {
          difficulty: 'hard',
        },
      };

      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(oldSave));
      const loaded = SaveManagerV2.load(1);

      // Should have default values for new settings
      expect(loaded.settings.autoScroll).toBe(true);
      expect(loaded.settings.showPerformanceMonitor).toBe(false);
      // Should preserve existing custom settings
      expect(loaded.settings.difficulty).toBe('hard');
    });
  });

  describe('Character Creation Integration', () => {
    it('should properly initialize new character', () => {
      const profile = SaveManagerV2.getDefaultProfile();
      
      // Simulate character creation
      profile.profile.characterCreated = true;
      profile.profile.name = 'TestHero';
      profile.profile.class = 'WARRIOR';
      profile.profile.character = {
        name: 'TestHero',
        class: 'WARRIOR',
        appearance: {},
      };

      SaveManagerV2.save(profile, 1, false);
      const loaded = SaveManagerV2.load(1);

      expect(loaded.profile.characterCreated).toBe(true);
      expect(loaded.profile.name).toBe('TestHero');
      expect(loaded.profile.class).toBe('WARRIOR');
      expect(loaded.profile.character.name).toBe('TestHero');
    });
  });

  describe('Tournament Mode Integration', () => {
    it('should track tournament progress', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Complete tournaments
      SaveManagerV2.increment('stats.tournamentsPlayed', 5);
      SaveManagerV2.increment('stats.tournamentsWon', 3);

      const loaded = SaveManagerV2.load(1);
      const winRate = (loaded.stats.tournamentsWon / loaded.stats.tournamentsPlayed) * 100;

      expect(loaded.stats.tournamentsPlayed).toBe(5);
      expect(loaded.stats.tournamentsWon).toBe(3);
      expect(winRate).toBe(60);
    });
  });

  describe('Complete Game Session Simulation', () => {
    it('should handle a complete game session', () => {
      // 1. Start new game
      const profile = SaveManagerV2.getDefaultProfile();
      profile.profile.characterCreated = true;
      profile.profile.name = 'TestHero';
      SaveManagerV2.save(profile, 1, false);

      // 2. Play some fights
      SaveManagerV2.increment('stats.totalFightsPlayed', 10);
      SaveManagerV2.increment('stats.totalWins', 7);
      SaveManagerV2.increment('stats.totalLosses', 3);
      SaveManagerV2.increment('profile.gold', 500);

      // 3. Buy equipment
      SaveManagerV2.increment('profile.gold', -200);
      SaveManagerV2.increment('stats.totalGoldSpent', 200);
      SaveManagerV2.set('equipped.weapon', 'iron_sword');

      // 4. Complete story mission
      const completed = SaveManagerV2.get('story.completedMissions');
      completed.push('tutorial_1');
      SaveManagerV2.set('story.completedMissions', completed);
      SaveManagerV2.set('story.missionStars.tutorial_1', 3);

      // 5. Level up
      SaveManagerV2.set('profile.level', 3);
      SaveManagerV2.set('profile.xp', 50);

      // 6. Final verification
      const final = SaveManagerV2.load(1);

      expect(final.profile.characterCreated).toBe(true);
      expect(final.stats.totalFightsPlayed).toBe(10);
      expect(final.stats.totalWins).toBe(7);
      expect(final.profile.gold).toBe(400); // 100 + 500 - 200
      expect(final.equipped.weapon).toBe('iron_sword');
      expect(final.story.completedMissions).toContain('tutorial_1');
      expect(final.story.missionStars.tutorial_1).toBe(3);
      expect(final.profile.level).toBe(3);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data consistency across multiple operations', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Perform many operations
      for (let i = 0; i < 20; i++) {
        SaveManagerV2.increment('stats.totalFightsPlayed');
        if (i % 2 === 0) {
          SaveManagerV2.increment('stats.totalWins');
        }
        SaveManagerV2.increment('profile.gold', 50);
      }

      const loaded = SaveManagerV2.load(1);

      expect(loaded.stats.totalFightsPlayed).toBe(20);
      expect(loaded.stats.totalWins).toBe(10);
      expect(loaded.profile.gold).toBe(1100); // 100 + (20 * 50)
    });

    it('should handle nested property updates safely', () => {
      SaveManagerV2.save(SaveManagerV2.getDefaultProfile(), 1, false);

      // Create nested structure
      SaveManagerV2.set('customData.player.stats.strength', 50);
      SaveManagerV2.set('customData.player.stats.agility', 30);

      const loaded = SaveManagerV2.load(1);
      expect(loaded.customData.player.stats.strength).toBe(50);
      expect(loaded.customData.player.stats.agility).toBe(30);
    });
  });
});
