/**
 * SaveManagerV2 - Enhanced save system with import/export, versioning, compression, and backups
 */

import { compress, decompress, getSizeKB } from './compression.js';
import { ConsoleLogger, LogCategory } from './ConsoleLogger.js';

// Save keys
const SAVE_KEY_PREFIX = 'legends_arena_save';
const BACKUP_KEY_PREFIX = 'legends_arena_backup';
const CURRENT_VERSION = '4.10.2';
const MAX_BACKUPS = 5;
const MAX_SAVE_SLOTS = 3;

/**
 * Enhanced SaveManager with advanced features
 */
export class SaveManagerV2 {
  /**
   * Get default save data structure
   */
  static getDefaultProfile() {
    return {
      version: CURRENT_VERSION,
      createdAt: Date.now(),
      lastSavedAt: Date.now(),
      saveMetadata: {
        slot: 1,
        compressed: false,
        backupCount: 0,
      },
      profile: {
        id: this.generateId(),
        name: 'Player',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        gold: 100,
        maxHealth: 100,
        characterCreated: false,
        character: null,
        class: 'BALANCED',
      },
      stats: {
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
        winStreak: 0,
        bestStreak: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        totalFightsPlayed: 0,
        tournamentsWon: 0,
        tournamentsPlayed: 0,
        criticalHits: 0,
        skillsUsed: 0,
        itemsUsed: 0,
        totalGoldEarned: 0,
        totalGoldSpent: 0,
        bossesDefeated: 0,
        survivalMissionsCompleted: 0,
        marketplacePurchases: 0,
        itemsSold: 0,
        itemsRepaired: 0,
      },
      equipped: {
        weapon: null,
        armor: null,
        accessory: null,
      },
      inventory: {
        equipment: [],
        consumables: {
          health_potion: 3,
          mana_potion: 3,
        },
      },
      equipmentDurability: {},
      unlocks: {
        fighters: [],
        skills: [],
        achievements: [],
      },
      settings: {
        difficulty: 'normal',
        autoScroll: true,
        showPerformanceMonitor: false,
        soundEnabled: true,
        soundVolume: 0.3,
        darkMode: false,
        autoBattle: false,
      },
      story: {
        unlockedRegions: ['tutorial'],
        unlockedMissions: ['tutorial_1'],
        completedMissions: [],
        currentMission: null,
        missionStars: {},
      },
      // Alias for backward compatibility
      storyProgress: {
        unlockedRegions: ['tutorial'],
        unlockedMissions: ['tutorial_1'],
        completedMissions: [],
        currentMission: null,
        missionStars: {},
      },
      marketplace: {
        lastRefresh: null,
        currentInventory: [],
        purchaseHistory: [],
      },
    };
  }

  /**
   * Save data to localStorage with compression
   * @param {Object} data - Save data
   * @param {number} slot - Save slot (1-3)
   * @param {boolean} useCompression - Enable compression
   * @returns {boolean} Success
   */
  static save(data, slot = 1, useCompression = true) {
    try {
      // Update metadata
      const saveData = {
        ...data,
        version: CURRENT_VERSION,
        lastSavedAt: Date.now(),
        saveMetadata: {
          slot,
          compressed: useCompression,
          backupCount: data.saveMetadata?.backupCount || 0,
        },
      };

      // Create backup before saving
      this.createBackup(slot);

      // Save data
      const saveKey = this.getSaveKey(slot);
      const dataString = JSON.stringify(saveData);

      if (useCompression) {
        const compressed = compress(dataString);
        localStorage.setItem(saveKey, compressed);
        ConsoleLogger.info(
          LogCategory.SAVE_SYSTEM,
          `💾 Save compressed: ${getSizeKB(dataString)}KB → ${getSizeKB(compressed)}KB`
        );
      } else {
        localStorage.setItem(saveKey, dataString);
        ConsoleLogger.info(LogCategory.SAVE_SYSTEM, `💾 Save stored: ${getSizeKB(dataString)}KB`);
      }

      ConsoleLogger.info(LogCategory.SAVE_SYSTEM, `✅ Game saved to slot ${slot}`);
      return true;
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Save failed:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   * @param {number} slot - Save slot
   * @returns {Object} Save data
   */
  static load(slot = 1) {
    try {
      const saveKey = this.getSaveKey(slot);
      const dataString = localStorage.getItem(saveKey);

      if (!dataString) {
        ConsoleLogger.info(LogCategory.SAVE_SYSTEM, '💾 No save found');
        return null;
      }

      // Try to parse directly first
      let saveData;
      try {
        saveData = JSON.parse(dataString);
      } catch {
        // Data is compressed, decompress it
        const decompressed = decompress(dataString);
        saveData = JSON.parse(decompressed);
      }

      // Validate and migrate if needed
      saveData = this.validateAndMigrate(saveData);

      return saveData;
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Load failed:', error);
      return null;
    }
  }

  /**
   * Create backup of current save
   * @param {number} slot - Save slot
   */
  static createBackup(slot = 1) {
    try {
      const saveKey = this.getSaveKey(slot);
      const currentData = localStorage.getItem(saveKey);

      if (!currentData) return;

      // Get existing backups
      const backups = this.listBackups(slot);

      // Remove oldest backup if at limit
      if (backups.length >= MAX_BACKUPS) {
        const oldestBackup = backups[backups.length - 1];
        localStorage.removeItem(oldestBackup.key);
      }

      // Create new backup
      const backupKey = this.getBackupKey(slot, Date.now());
      localStorage.setItem(backupKey, currentData);

      ConsoleLogger.info(LogCategory.SAVE_SYSTEM, `💾 Backup created: ${backupKey}`);
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Backup creation failed:', error);
    }
  }

  /**
   * Restore from backup
   * @param {number} slot - Save slot
   * @param {number} timestamp - Backup timestamp (0 for latest)
   * @returns {boolean} Success
   */
  static restoreBackup(slot = 1, timestamp = 0) {
    try {
      const backups = this.listBackups(slot);

      if (backups.length === 0) {
        ConsoleLogger.warn(LogCategory.SAVE_SYSTEM, '⚠️ No backups found');
        return false;
      }

      // Get backup to restore (latest if timestamp = 0)
      const backup = timestamp === 0 ? backups[0] : backups.find((b) => b.timestamp === timestamp);

      if (!backup) {
        ConsoleLogger.warn(LogCategory.SAVE_SYSTEM, '⚠️ Backup not found');
        return false;
      }

      // Restore backup
      const saveKey = this.getSaveKey(slot);
      const backupData = localStorage.getItem(backup.key);
      localStorage.setItem(saveKey, backupData);

      ConsoleLogger.info(
        LogCategory.SAVE_SYSTEM,
        `✅ Restored backup from ${new Date(backup.timestamp).toLocaleString()}`
      );
      return true;
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Backup restore failed:', error);
      return false;
    }
  }

  /**
   * List all backups for a slot
   * @param {number} slot - Save slot
   * @returns {Array} Array of backup info
   */
  static listBackups(slot = 1) {
    const backups = [];
    const prefix = `${BACKUP_KEY_PREFIX}_slot${slot}_`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const timestamp = parseInt(key.split('_')[4]); // Fixed: was [3], should be [4]
        const data = localStorage.getItem(key);

        try {
          // Try to get save data for metadata
          let saveData;
          try {
            saveData = JSON.parse(data);
          } catch {
            const decompressed = decompress(data);
            saveData = JSON.parse(decompressed);
          }

          backups.push({
            key,
            timestamp,
            date: new Date(timestamp),
            version: saveData.version,
            playerName: saveData.profile?.name || 'Unknown',
            level: saveData.profile?.level || 1,
            size: getSizeKB(data),
          });
        } catch {
          backups.push({
            key,
            timestamp,
            date: new Date(timestamp),
            version: 'Unknown',
            size: getSizeKB(data),
          });
        }
      }
    }

    // Sort by timestamp (newest first)
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Export save data as JSON file
   * @param {number} slot - Save slot
   * @param {string} filename - Optional filename
   */
  static exportSave(slot = 1, filename = null) {
    try {
      const saveData = this.load(slot);
      const json = JSON.stringify(saveData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download =
        filename || `legends_arena_save_slot${slot}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      ConsoleLogger.info(LogCategory.SAVE_SYSTEM, '✅ Save exported successfully');
      return true;
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Export failed:', error);
      return false;
    }
  }

  /**
   * Import save data from JSON file
   * @param {File} file - JSON file
   * @param {number} slot - Save slot to import into
   * @returns {Promise<boolean>} Success
   */
  static async importSave(file, slot = 1) {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const saveData = JSON.parse(e.target.result);

            // Validate save data
            if (!this.validateSaveData(saveData)) {
              ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Invalid save data');
              resolve(false);
              return;
            }

            // Migrate if needed
            const migratedData = this.validateAndMigrate(saveData);

            // Save to slot
            this.save(migratedData, slot, true);

            ConsoleLogger.info(LogCategory.SAVE_SYSTEM, '✅ Save imported successfully');
            resolve(true);
          } catch (error) {
            ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Import parsing failed:', error);
            resolve(false);
          }
        };

        reader.onerror = () => {
          ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ File read failed');
          resolve(false);
        };

        reader.readAsText(file);
      } catch (error) {
        ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Import failed:', error);
        resolve(false);
      }
    });
  }

  /**
   * Copy save between slots
   * @param {number} fromSlot - Source slot
   * @param {number} toSlot - Destination slot
   * @returns {boolean} Success
   */
  static copySave(fromSlot, toSlot) {
    try {
      const saveData = this.load(fromSlot);
      saveData.saveMetadata.slot = toSlot;
      this.save(saveData, toSlot);
      ConsoleLogger.info(
        LogCategory.SAVE_SYSTEM,
        `✅ Save copied from slot ${fromSlot} to slot ${toSlot}`
      );
      return true;
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Copy failed:', error);
      return false;
    }
  }

  /**
   * Delete save slot
   * @param {number} slot - Save slot (defaults to 1)
   * @returns {boolean} Success
   */
  static deleteSave(slot = 1) {
    try {
      const saveKey = this.getSaveKey(slot);
      localStorage.removeItem(saveKey);

      // Also delete backups
      const backups = this.listBackups(slot);
      backups.forEach((backup) => {
        localStorage.removeItem(backup.key);
      });

      ConsoleLogger.info(LogCategory.SAVE_SYSTEM, `✅ Save slot ${slot} deleted`);
      return true;
    } catch (error) {
      ConsoleLogger.error(LogCategory.SAVE_SYSTEM, '❌ Delete failed:', error);
      return false;
    }
  }

  /**
   * List all save slots with metadata
   * @returns {Array} Array of save slot info
   */
  static listSaveSlots() {
    const slots = [];

    for (let slot = 1; slot <= MAX_SAVE_SLOTS; slot++) {
      const saveKey = this.getSaveKey(slot);
      const dataString = localStorage.getItem(saveKey);

      if (dataString) {
        try {
          let saveData;
          try {
            saveData = JSON.parse(dataString);
          } catch {
            const decompressed = decompress(dataString);
            saveData = JSON.parse(decompressed);
          }

          slots.push({
            slot,
            exists: true,
            playerName: saveData.profile?.name || 'Unknown',
            level: saveData.profile?.level || 1,
            gold: saveData.profile?.gold || 0,
            version: saveData.version,
            lastPlayed: new Date(saveData.lastSavedAt || Date.now()),
            compressed: saveData.saveMetadata?.compressed || false,
            size: getSizeKB(dataString),
            backupCount: this.listBackups(slot).length,
          });
        } catch {
          slots.push({
            slot,
            exists: true,
            corrupted: true,
          });
        }
      } else {
        slots.push({
          slot,
          exists: false,
        });
      }
    }

    return slots;
  }

  /**
   * Validate save data structure
   * @param {Object} data - Save data
   * @returns {boolean} Valid
   */
  static validateSaveData(data) {
    if (!data || typeof data !== 'object') return false;
    if (!data.profile || !data.stats) return false;
    if (!data.version) return false;
    return true;
  }

  /**
   * Validate and migrate save data to current version
   * @param {Object} data - Save data
   * @returns {Object} Migrated data
   */
  static validateAndMigrate(data) {
    if (!this.validateSaveData(data)) {
      ConsoleLogger.warn(LogCategory.SAVE_SYSTEM, '⚠️ Invalid save data, using defaults');
      return this.getDefaultProfile();
    }

    const version = data.version || '1.0.0';
    let migratedData = { ...data };

    // Migration chain
    if (this.compareVersions(version, '4.1.0') < 0) {
      migratedData = this.migrateTo410(migratedData);
    }

    if (this.compareVersions(version, '4.2.0') < 0) {
      migratedData = this.migrateTo420(migratedData);
    }

    return migratedData;
  }

  /**
   * Migrate save data to version 4.1.0
   * @param {Object} data - Old save data
   * @returns {Object} Migrated data
   */
  static migrateTo410(data) {
    ConsoleLogger.info(LogCategory.SAVE_SYSTEM, `🔄 Migrating save from ${data.version} to 4.1.0`);

    const defaultData = this.getDefaultProfile();

    // Migrate storyProgress to story if it exists
    const storyData = data.story || data.storyProgress || defaultData.story;

    // Convert completedMissions from object to array if needed
    let completedMissions = storyData.completedMissions || [];
    if (!Array.isArray(completedMissions)) {
      // Old format: completedMissions was an object, convert to array
      // Only include missions where the value is true
      completedMissions = Object.keys(completedMissions).filter(
        (key) => completedMissions[key] === true
      );
      ConsoleLogger.info(
        LogCategory.SAVE_SYSTEM,
        '🔄 Converted completedMissions from object to array'
      );
    }

    // Ensure story has the correct structure
    const migratedStory = {
      unlockedRegions: storyData.unlockedRegions || ['tutorial'],
      unlockedMissions: storyData.unlockedMissions || ['tutorial_1'],
      completedMissions: completedMissions,
      currentMission: storyData.currentMission || null,
      missionStars: storyData.missionStars || {},
    };

    // Handle old format where missionStars might be separate
    if (data.storyProgress?.missionStars) {
      migratedStory.missionStars = data.storyProgress.missionStars;
    }

    return {
      ...defaultData,
      ...data,
      version: '4.1.0',
      saveMetadata: data.saveMetadata || defaultData.saveMetadata,
      settings: {
        ...defaultData.settings,
        ...data.settings,
      },
      story: migratedStory,
      // Keep storyProgress as an alias for backward compatibility
      storyProgress: migratedStory,
    };
  }

  /**
   * Migrate save data to version 4.2.0
   * @param {Object} data - Old save data
   * @returns {Object} Migrated data
   */
  static migrateTo420(data) {
    // Ensure completedMissions is an array
    if (data.story?.completedMissions && !Array.isArray(data.story.completedMissions)) {
      data.story.completedMissions = Object.keys(data.story.completedMissions);
      ConsoleLogger.info(
        LogCategory.SAVE_SYSTEM,
        '🔄 Converted story.completedMissions from object to array'
      );
    }

    if (
      data.storyProgress?.completedMissions &&
      !Array.isArray(data.storyProgress.completedMissions)
    ) {
      data.storyProgress.completedMissions = Object.keys(data.storyProgress.completedMissions);
      ConsoleLogger.info(
        LogCategory.SAVE_SYSTEM,
        '🔄 Converted storyProgress.completedMissions from object to array'
      );
    }

    return {
      ...data,
      version: '4.2.0',
    };
  }

  /**
   * Compare version strings
   * @param {string} v1 - Version 1
   * @param {string} v2 - Version 2
   * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  static compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }

    return 0;
  }

  /**
   * Get save key for slot
   * @param {number} slot - Save slot
   * @returns {string} Storage key
   */
  static getSaveKey(slot) {
    return `${SAVE_KEY_PREFIX}_slot${slot}`;
  }

  /**
   * Get backup key
   * @param {number} slot - Save slot
   * @param {number} timestamp - Timestamp
   * @returns {string} Storage key
   */
  static getBackupKey(slot, timestamp) {
    return `${BACKUP_KEY_PREFIX}_slot${slot}_${timestamp}`;
  }

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get storage usage info
   * @returns {Object} Storage info
   */
  static getStorageInfo() {
    let totalSize = 0;
    let saveSize = 0;
    let backupSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const size = new Blob([value]).size;

      totalSize += size;

      if (key.startsWith(SAVE_KEY_PREFIX)) {
        saveSize += size;
      } else if (key.startsWith(BACKUP_KEY_PREFIX)) {
        backupSize += size;
      }
    }

    return {
      total: (totalSize / 1024).toFixed(2) + ' KB',
      saves: (saveSize / 1024).toFixed(2) + ' KB',
      backups: (backupSize / 1024).toFixed(2) + ' KB',
      available: '5 MB', // localStorage limit (approximate)
    };
  }

  // Legacy compatibility methods
  static get(path) {
    const data = this.load();
    if (!data) return undefined;
    return path.split('.').reduce((obj, key) => obj?.[key], data);
  }

  static set(path, value) {
    let data = this.load();
    // If no save exists, create a new profile
    if (!data) {
      ConsoleLogger.info(LogCategory.SAVE_SYSTEM, '💾 Creating new profile for first save');
      data = this.getDefaultProfile();
    }
    const keys = path.split('.');
    const lastKey = keys.pop();

    // Navigate to nested object, creating intermediate objects if needed
    let target = data;
    for (const key of keys) {
      if (!target[key]) {
        target[key] = {};
      }
      target = target[key];
    }

    target[lastKey] = value;

    // Maintain backward compatibility: sync story <-> storyProgress
    if (path.startsWith('story.')) {
      const storyKey = path.replace('story.', '');
      if (!data.storyProgress) {
        data.storyProgress = {};
      }
      const storyKeys = storyKey.split('.');
      const storyLastKey = storyKeys.pop();
      let storyTarget = data.storyProgress;
      for (const key of storyKeys) {
        if (!storyTarget[key]) {
          storyTarget[key] = {};
        }
        storyTarget = storyTarget[key];
      }
      storyTarget[storyLastKey] = value;
    } else if (path.startsWith('storyProgress.')) {
      const storyKey = path.replace('storyProgress.', '');
      if (!data.story) {
        data.story = {};
      }
      const storyKeys = storyKey.split('.');
      const storyLastKey = storyKeys.pop();
      let storyTarget = data.story;
      for (const key of storyKeys) {
        if (!storyTarget[key]) {
          storyTarget[key] = {};
        }
        storyTarget = storyTarget[key];
      }
      storyTarget[storyLastKey] = value;
    }

    this.save(data);
  }

  static update(path, value) {
    // Alias for set() for backward compatibility
    return this.set(path, value);
  }

  static increment(path, amount = 1) {
    const current = this.get(path) || 0;
    this.set(path, current + amount);
  }
}

// Export for use
export default SaveManagerV2;
