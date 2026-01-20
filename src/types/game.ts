// ============================================================================
// CORE TYPES
// ============================================================================

export type GameScreen = 
  | 'title'
  | 'character-creation'
  | 'combat'
  | 'profile'
  | 'equipment'
  | 'marketplace'
  | 'achievements'
  | 'tournament'
  | 'story'
  | 'talents';

export type GameMode = 'single' | 'tournament' | 'story';
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'nightmare';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// ============================================================================
// CHARACTER & CLASSES
// ============================================================================

export type CharacterClass = 
  | 'BALANCED'
  | 'WARRIOR'
  | 'TANK'
  | 'MAGE'
  | 'ROGUE'
  | 'BRAWLER'
  | 'PALADIN'
  | 'BRUISER'
  | 'RANGER'
  | 'ASSASSIN';

export interface ClassData {
  id: CharacterClass;
  name: string;
  icon: string;
  description: string;
  lore: string;
  difficulty: number; // 1-3 stars
  stats: {
    healthMod: number;
    strengthMod: number;
    defenseMod: number;
    manaRegen: number;
    critChance: number;
    critDamage: number;
    attackRange: number;
  };
  passive: {
    name: string;
    description: string;
    icon: string;
  };
  mechanics: {
    skillCostReduction: number;
    defendBonus: number;
    comboBonus: number;
    healingBonus: number;
  };
  skills: string[]; // Skill IDs
  talentTrees: string[]; // Talent tree IDs
}

export interface PlayerCharacter {
  characterCreated: boolean;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  createdAt: number | null;
  lastPlayedAt: number | null;
  
  // Combat stats
  baseHealth: number;
  baseStrength: number;
  baseDefense: number;
  baseMana: number;
  
  // Talents
  talentPoints: number;
  learnedTalents: Record<string, number>; // talentId -> rank
  
  // Skills
  learnedSkills: string[]; // Array of skill IDs
}

// ============================================================================
// EQUIPMENT
// ============================================================================

export type EquipmentType = 'weapon' | 'armor' | 'accessory';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: Rarity;
  level: number;
  price: number;
  description: string;
  stats: {
    strength?: number;
    health?: number;
    defense?: number;
    critChance?: number;
    critDamage?: number;
    manaRegen?: number;
    attackRange?: number;
  };
  requirements?: {
    level?: number;
    class?: CharacterClass[];
  };
  durability: number;
  maxDurability: number;
}

export interface EquippedItems {
  weapon: string | null;
  armor: string | null;
  accessory: string | null;
}

export interface InventoryItem {
  id: string; // Equipment ID
  durability: number; // 0-100
}

export interface Inventory {
  equipment: InventoryItem[]; // Equipment items with durability
  maxSlots: number;
}

// ============================================================================
// SKILLS & TALENTS
// ============================================================================

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  manaCost: number;
  cooldown: number;
  cooldownRemaining: number;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'utility';
  effects: SkillEffect[];
  classRestriction?: CharacterClass[];
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'statusEffect' | 'statModifier';
  value: number;
  target: 'self' | 'enemy';
  statusEffect?: string;
  duration?: number;
}

export interface TalentTree {
  id: string;
  name: string;
  class: CharacterClass;
  icon: string;
  description: string;
  talents: Talent[];
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxRank: number;
  row: number;
  column: number;
  requiredPoints: number;
  prerequisites?: string[];
  effects: TalentEffect[];
}

export interface TalentEffect {
  type: 'stat' | 'passive';
  stat?: string;
  value: number;
  passive?: string;
}

// ============================================================================
// STATUS EFFECTS
// ============================================================================

export type StatusEffectType =
  | 'poison'
  | 'burn'
  | 'bleed'
  | 'shock'
  | 'frozen'
  | 'stunned'
  | 'regeneration'
  | 'strengthBoost'
  | 'defenseBoost'
  | 'weakness'
  | 'curse'
  | 'bless'
  | 'haste'
  | 'slow'
  | 'vulnerable'
  | 'fortify'
  | 'enrage';

export interface StatusEffect {
  type: StatusEffectType;
  duration: number;
  value: number;
  stacks: number;
  icon: string;
  description: string;
}

// ============================================================================
// COMBAT
// ============================================================================

export interface CombatState {
  isActive: boolean;
  mode: GameMode;
  round: number;
  turn: number;
  isPlayerTurn: boolean;
  player: FighterState | null;
  opponent: FighterState | null;
  combatLog: CombatLogEntry[];
  winner: 'player' | 'opponent' | null;
  currentMissionId?: string | null;
}

export interface FighterState {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  
  // Current stats
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  defense: number;
  
  // Combat state
  isDefending: boolean;
  statusEffects: StatusEffect[];
  skills: Skill[];
  combo: number;
  damageDealt: number;
  damageTaken: number;
  
  // Equipment
  equipment: Equipment[];
}

// Combat-specific fighter interface with current/max properties for combat engine
export interface Fighter {
  name: string;
  class: CharacterClass;
  level: number;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  currentStrength: number;
  currentDefense: number;
  critChance: number;
  critDamage: number;
  manaRegen: number;
  attackRange: number;
  statusEffects: StatusEffect[];
  skills: Skill[];
  position: { x: number; y: number };
}

export interface CombatLogEntry {
  id: string;
  timestamp: number;
  type: 'attack' | 'skill' | 'defend' | 'item' | 'status' | 'combo' | 'system';
  actor: string;
  target?: string;
  message: string;
  damage?: number;
  healing?: number;
  isCritical?: boolean;
  comboName?: string;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface GameStats {
  totalWins: number;
  totalLosses: number;
  totalFightsPlayed: number;
  winStreak: number;
  bestStreak: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  criticalHits: number;
  skillsUsed: number;
  itemsUsed: number;
  itemsSold: number;
  itemsPurchased: number;
  itemsRepaired: number;
  goldFromSales: number;
  goldSpent: number;
  legendaryPurchases: number;
  tournamentsWon: number;
  tournamentsPlayed: number;
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export type AchievementCategory = 'combat' | 'strategic' | 'special' | 'progression';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  xpReward: number;
  requirement: {
    type: string;
    value: number;
  };
  progress: number;
  unlocked: boolean;
  unlockedAt?: number;
}

// ============================================================================
// STORY MODE
// ============================================================================

export interface StoryRegion {
  id: string;
  name: string;
  icon: string;
  description: string;
  missions: string[];
  unlockRequirement?: string;
  isUnlocked: boolean;
}

export interface StoryMission {
  id: string;
  regionId: string;
  name: string;
  description: string;
  difficulty: number;
  type: 'standard' | 'survival' | 'boss';
  
  opponent: {
    name: string;
    class: CharacterClass;
    level: number;
    healthMod?: number;
    strengthMod?: number;
  };
  
  objectives: {
    required: MissionObjective[];
    optional: MissionObjective[];
  };
  
  rewards: {
    gold: number;
    xp: number;
    equipment?: string;
  };
  
  stars: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: number;
}

export interface MissionObjective {
  id: string;
  description: string;
  type: string;
  value: number;
  completed: boolean;
}

// ============================================================================
// TOURNAMENT
// ============================================================================

export interface TournamentState {
  isActive: boolean;
  difficulty: DifficultyLevel;
  currentRound: number; // 1-3
  opponents: string[]; // Fighter IDs
  results: TournamentRoundResult[];
}

export interface TournamentRoundResult {
  round: number;
  opponentId: string;
  won: boolean;
  damageDealt: number;
  damageTaken: number;
}

// ============================================================================
// MARKETPLACE
// ============================================================================

export interface MarketplaceState {
  shopInventory: string[]; // Equipment IDs available for purchase
  lastRefresh: number;
  nextRefresh: number;
}

// ============================================================================
// GLOBAL GAME STATE
// ============================================================================

export interface GameState {
  // Navigation
  currentScreen: GameScreen;
  
  // Player
  player: PlayerCharacter;
  
  // Equipment & Inventory
  inventory: Inventory;
  equipped: EquippedItems;
  allEquipment: Record<string, Equipment>; // All equipment instances
  
  // Combat
  combat: CombatState;
  
  // Statistics
  stats: GameStats;
  
  // Achievements
  achievements: Record<string, Achievement>;
  
  // Story Mode
  story: {
    currentMission: string | null;
    unlockedRegions: string[];
    unlockedMissions: string[];
    completedMissions: Record<string, { stars: number; completedAt: number }>;
  };
  
  // Tournament
  tournament: TournamentState;
  
  // Marketplace
  marketplace: MarketplaceState;
  
  // Settings
  settings: {
    difficulty: DifficultyLevel;
    soundEnabled: boolean;
    musicEnabled: boolean;
    volume: number;
    autoBattle: boolean;
  };
  
  // Meta
  lastSaved: number;
  version: string;
}

