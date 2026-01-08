/**
 * SaveManager - Handles persistent game data storage
 * Uses localStorage for profile, progress, and settings
 */

const SAVE_KEY = 'legends_arena_save';
const SAVE_VERSION = '4.0.0';

export class SaveManager {
  /**
   * Get default profile structure
   */
  static getDefaultProfile() {
    return {
      version: SAVE_VERSION,
      profile: {
        id: this.generateId(),
        name: 'Player',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        gold: 100, // Starting gold
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
        characterCreated: false,
        character: null, // Player's custom character
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
        // Story Mode stats
        bossesDefeated: 0,
        survivalMissionsCompleted: 0,
        fastMissions: 0,
        flawlessMissions: 0,
        perfectMissions: 0,
        perfectRegions: 0,
        // Marketplace stats
        marketplacePurchases: 0,
        itemsSold: 0,
        itemsRepaired: 0,
        legendaryPurchases: 0,
        goldFromSales: 0,
      },
      equipped: {
        weapon: null,
        armor: null,
        accessory: null,
      },
      inventory: {
        equipment: [], // Array of equipment IDs with durability
        consumables: {
          'health_potion': 3,
          'mana_potion': 3,
        },
      },
      equipmentDurability: {}, // Map of equipmentId -> current durability
      unlocks: {
        fighters: [], // Array of unlocked fighter IDs (all unlocked by default)
        skills: [], // Array of unlocked skill IDs
        achievements: [], // Array of unlocked achievement IDs
      },
      settings: {
        difficulty: 'normal', // easy, normal, hard, nightmare
        autoScroll: true,
        soundEnabled: true,
        darkMode: false,
      },
      achievements: [], // Achievement progress tracking
      storyProgress: {
        unlockedRegions: ['tutorial'], // Start with tutorial unlocked
        completedMissions: [],
        currentMission: null,
        missionStars: {}, // missionId: stars (1-3)
      },
      marketplace: {
        lastRefresh: null,
        currentInventory: [], // Array of equipment IDs in shop
        purchaseHistory: [],
      },
    };
  }

  /**
   * Generate unique ID
   */
  static generateId() {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save game data to localStorage
   */
  static save(data) {
    try {
      const saveData = {
        ...data,
        version: SAVE_VERSION,
        profile: {
          ...data.profile,
          lastPlayedAt: Date.now(),
        },
      };
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      console.log('💾 Game saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load game data from localStorage
   */
  static load() {
    try {
      const savedData = localStorage.getItem(SAVE_KEY);
      
      if (!savedData) {
        console.log('📂 No save file found, creating new profile');
        return this.getDefaultProfile();
      }

      const data = JSON.parse(savedData);
      
      // Version migration if needed
      if (data.version !== SAVE_VERSION) {
        console.log('🔄 Migrating save data to new version');
        return this.migrateSaveData(data);
      }

      console.log('✅ Game loaded successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to load game:', error);
      return this.getDefaultProfile();
    }
  }

  /**
   * Migrate old save data to new version
   */
  static migrateSaveData(oldData) {
    const newData = this.getDefaultProfile();
    
    // Merge old data with new structure, preserving important fields
    return {
      ...newData,
      profile: {
        ...newData.profile,
        ...oldData.profile,
        gold: oldData.profile?.gold || 100, // Add gold if missing
        lastPlayedAt: Date.now(),
      },
      stats: {
        ...newData.stats,
        ...oldData.stats,
        totalGoldEarned: oldData.stats?.totalGoldEarned || 0,
        totalGoldSpent: oldData.stats?.totalGoldSpent || 0,
      },
      settings: {
        ...newData.settings,
        ...oldData.settings,
      },
      equipped: oldData.equipped || newData.equipped,
      inventory: oldData.inventory || newData.inventory,
      unlocks: oldData.unlocks || newData.unlocks,
      equipmentDurability: oldData.equipmentDurability || {},
      storyProgress: oldData.storyProgress || newData.storyProgress,
      marketplace: oldData.marketplace || newData.marketplace,
    };
  }

  /**
   * Validate save data structure
   * @param {Object} data - Save data to validate
   * @returns {Object} - Validated and fixed save data
   */
  static validateSaveData(data) {
    const defaultData = this.getDefaultProfile();
    
    // Deep merge ensuring all required fields exist
    const validated = {
      version: data.version || defaultData.version,
      profile: { ...defaultData.profile, ...(data.profile || {}) },
      stats: { ...defaultData.stats, ...(data.stats || {}) },
      equipped: { ...defaultData.equipped, ...(data.equipped || {}) },
      inventory: { 
        ...defaultData.inventory, 
        ...(data.inventory || {}),
        equipment: Array.isArray(data.inventory?.equipment) ? data.inventory.equipment : [],
      },
      equipmentDurability: data.equipmentDurability || {},
      unlocks: { ...defaultData.unlocks, ...(data.unlocks || {}) },
      settings: { ...defaultData.settings, ...(data.settings || {}) },
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
      storyProgress: { ...defaultData.storyProgress, ...(data.storyProgress || {}) },
      marketplace: { ...defaultData.marketplace, ...(data.marketplace || {}) },
    };

    return validated;
  }

  /**
   * Delete save data
   */
  static deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
      console.log('🗑️ Save data deleted');
      return true;
    } catch (error) {
      console.error('❌ Failed to delete save:', error);
      return false;
    }
  }

  /**
   * Export save data as JSON string
   */
  static exportSave() {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import save data from JSON string
   */
  static importSave(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.save(data);
      console.log('📥 Save data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import save:', error);
      return false;
    }
  }

  /**
   * Update specific field in save data
   */
  static update(path, value) {
    const data = this.load();
    const keys = path.split('.');
    let current = data;
    
    // Navigate to the nested property
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    // Set the value
    current[keys[keys.length - 1]] = value;
    
    return this.save(data);
  }

  /**
   * Get specific field from save data
   */
  static get(path) {
    const data = this.load();
    const keys = path.split('.');
    let current = data;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return null;
      }
      current = current[key];
    }
    
    return current;
  }

  /**
   * Increment a numeric field
   */
  static increment(path, amount = 1) {
    const currentValue = this.get(path) || 0;
    return this.update(path, currentValue + amount);
  }
}
