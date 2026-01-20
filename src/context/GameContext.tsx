import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, CharacterClass, DifficultyLevel } from '../types/game';
import { getStarterSkills } from '../utils/skills';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: GameState = {
  currentScreen: 'title',
  
  player: {
    characterCreated: false,
    name: '',
    class: 'BALANCED',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gold: 500,
    createdAt: null,
    lastPlayedAt: null,
    baseHealth: 400,
    baseStrength: 50,
    baseDefense: 10,
    baseMana: 100,
    talentPoints: 0,
    learnedTalents: {},
    learnedSkills: [],
  },
  
  inventory: {
    equipment: [],
    maxSlots: 20,
  },
  
  equipped: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  
  allEquipment: {},
  
  combat: {
    isActive: false,
    mode: 'single',
    round: 1,
    turn: 1,
    isPlayerTurn: true,
    player: null,
    opponent: null,
    combatLog: [],
    winner: null,
    currentMissionId: null,
  },
  
  stats: {
    totalWins: 0,
    totalLosses: 0,
    totalFightsPlayed: 0,
    winStreak: 0,
    bestStreak: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    criticalHits: 0,
    skillsUsed: 0,
    itemsUsed: 0,
    itemsSold: 0,
    itemsPurchased: 0,
    itemsRepaired: 0,
    goldFromSales: 0,
    goldSpent: 0,
    legendaryPurchases: 0,
    tournamentsWon: 0,
    tournamentsPlayed: 0,
  },
  
  achievements: {},
  
  story: {
    currentMission: null,
    unlockedRegions: ['training_grounds'],
    unlockedMissions: ['training_01'],
    completedMissions: {},
  },
  
  tournament: {
    isActive: false,
    difficulty: 'normal',
    currentRound: 1,
    opponents: [],
    results: [],
  },
  
  marketplace: {
    shopInventory: [],
    lastRefresh: Date.now(),
    nextRefresh: Date.now() + 86400000, // 24 hours
  },
  
  settings: {
    difficulty: 'normal',
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.7,
    autoBattle: false,
  },
  
  lastSaved: Date.now(),
  version: '1.0.0',
};

// ============================================================================
// ACTION TYPES
// ============================================================================

export type GameAction =
  // Navigation
  | { type: 'CHANGE_SCREEN'; payload: GameState['currentScreen'] }
  
  // Character
  | { type: 'CREATE_CHARACTER'; payload: { name: string; class: CharacterClass } }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_GOLD'; payload: number }
  | { type: 'SPEND_GOLD'; payload: number }
  | { type: 'LEVEL_UP' }
  
  // Equipment
  | { type: 'ADD_EQUIPMENT'; payload: { id: string; durability: number } }
  | { type: 'REMOVE_EQUIPMENT'; payload: string }
  | { type: 'EQUIP_ITEM'; payload: { slot: 'weapon' | 'armor' | 'accessory'; itemId: string } }
  | { type: 'UNEQUIP_ITEM'; payload: 'weapon' | 'armor' | 'accessory' }
  | { type: 'REPAIR_EQUIPMENT'; payload: string }
  
  // Combat
  | { type: 'START_COMBAT'; payload: { opponentName: string; opponentClass: CharacterClass; opponentLevel: number } }
  | { type: 'END_COMBAT'; payload: { winner: 'player' | 'opponent' } }
  | { type: 'COMBAT_ACTION'; payload: { action: string; target?: string } }
  | { type: 'UPDATE_COMBAT_STATE'; payload: Partial<GameState['combat']> }
  
  // Stats
  | { type: 'INCREMENT_STAT'; payload: { stat: keyof GameState['stats']; value?: number } }
  | { type: 'UPDATE_STREAK'; payload: { won: boolean } }
  
  // Achievements
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { id: string; progress: number } }
  
  // Story
  | { type: 'UNLOCK_MISSION'; payload: string }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string; stars: number } }
  | { type: 'UNLOCK_REGION'; payload: string }
  
  // Tournament
  | { type: 'START_TOURNAMENT'; payload: { difficulty: string; opponents: string[] } }
  | { type: 'COMPLETE_TOURNAMENT_ROUND'; payload: { victory: boolean; reward: number } }
  | { type: 'END_TOURNAMENT'; payload: { won: boolean } }
  
  // Marketplace
  | { type: 'REFRESH_SHOP' }
  | { type: 'PURCHASE_ITEM'; payload: { itemId: string; cost: number } }
  | { type: 'SELL_ITEM'; payload: { itemId: string; value: number } }
  
  // Talents
  | { type: 'LEARN_TALENT'; payload: string }
  | { type: 'RESET_TALENT_TREE'; payload: string }
  | { type: 'RESET_ALL_TALENTS' }
  
  // Settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameState['settings']> }
  
  // System
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'RESET_GAME' };

// ============================================================================
// REDUCER
// ============================================================================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // Navigation
    case 'CHANGE_SCREEN':
      return { ...state, currentScreen: action.payload };
    
    // Character
    case 'CREATE_CHARACTER': {
      // Give starter equipment: Wooden Sword, Leather Vest, Bronze Ring
      const starterEquipment = [
        { id: 'wooden_sword', durability: 100 },
        { id: 'leather_vest', durability: 100 },
        { id: 'bronze_ring', durability: 100 }
      ];
      
      // Give starter skills (first 2 skills for the class)
      const starterSkills = getStarterSkills(action.payload.class);
      
      return {
        ...state,
        player: {
          ...state.player,
          characterCreated: true,
          name: action.payload.name,
          class: action.payload.class,
          createdAt: Date.now(),
          lastPlayedAt: Date.now(),
          learnedSkills: starterSkills,
        },
        inventory: {
          ...state.inventory,
          equipment: starterEquipment,
        },
        currentScreen: 'title',
      };
    }
    
    case 'ADD_XP': {
      const newXp = state.player.xp + action.payload;
      const xpToNextLevel = state.player.xpToNextLevel;
      
      if (newXp >= xpToNextLevel) {
        // Level up!
        return gameReducer(state, { type: 'LEVEL_UP' });
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          xp: newXp,
        },
      };
    }
    
    case 'LEVEL_UP': {
      const newLevel = state.player.level + 1;
      const xpToNextLevel = Math.floor(100 * Math.pow(1.5, newLevel - 1));
      
      return {
        ...state,
        player: {
          ...state.player,
          level: newLevel,
          xp: 0,
          xpToNextLevel,
          talentPoints: state.player.talentPoints + 1,
          baseHealth: state.player.baseHealth + 20,
          baseStrength: state.player.baseStrength + 2,
          baseDefense: state.player.baseDefense + 1,
        },
      };
    }
    
    case 'ADD_GOLD':
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold + action.payload,
        },
      };
    
    case 'SPEND_GOLD':
      return {
        ...state,
        player: {
          ...state.player,
          gold: Math.max(0, state.player.gold - action.payload),
        },
        stats: {
          ...state.stats,
          goldSpent: state.stats.goldSpent + action.payload,
        },
      };
    
    // Equipment
    case 'EQUIP_ITEM':
      return {
        ...state,
        equipped: {
          ...state.equipped,
          [action.payload.slot]: action.payload.itemId,
        },
      };
    
    case 'UNEQUIP_ITEM':
      return {
        ...state,
        equipped: {
          ...state.equipped,
          [action.payload]: null,
        },
      };
    
    case 'REPAIR_EQUIPMENT':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          equipment: state.inventory.equipment.map(item =>
            item.id === action.payload
              ? { ...item, durability: 100 }
              : item
          ),
        },
        stats: {
          ...state.stats,
          itemsRepaired: state.stats.itemsRepaired + 1,
        },
      };
    
    case 'ADD_EQUIPMENT':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          equipment: [...state.inventory.equipment, action.payload],
        },
      };
    
    case 'REMOVE_EQUIPMENT':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          equipment: state.inventory.equipment.filter(item => item.id !== action.payload),
        },
      };
    
    // Combat
    case 'START_COMBAT':
      return {
        ...state,
        combat: {
          ...state.combat,
          isActive: true,
          ...action.payload,
        },
        currentScreen: 'combat',
      };
    
    case 'END_COMBAT': {
      const isVictory = action.payload.winner === 'player';
      const newStreak = isVictory ? state.stats.winStreak + 1 : 0;
      
      return {
        ...state,
        combat: {
          ...state.combat,
          isActive: false,
          winner: action.payload.winner,
        },
        stats: {
          ...state.stats,
          totalWins: state.stats.totalWins + (isVictory ? 1 : 0),
          totalLosses: state.stats.totalLosses + (isVictory ? 0 : 1),
          totalFightsPlayed: state.stats.totalFightsPlayed + 1,
          winStreak: newStreak,
          bestStreak: Math.max(state.stats.bestStreak, newStreak),
        },
      };
    }
    
    case 'UPDATE_COMBAT_STATE':
      return {
        ...state,
        combat: {
          ...state.combat,
          ...action.payload,
        },
      };
    
    // Stats
    case 'INCREMENT_STAT':
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.payload.stat]: state.stats[action.payload.stat] + (action.payload.value || 1),
        },
      };
    
    // Achievements
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: {
          ...state.achievements,
          [action.payload]: {
            ...state.achievements[action.payload],
            unlocked: true,
            unlockedAt: Date.now(),
          },
        },
      };
    
    // Story
    case 'UNLOCK_MISSION':
      return {
        ...state,
        story: {
          ...state.story,
          unlockedMissions: [...state.story.unlockedMissions, action.payload],
        },
      };
    
    case 'COMPLETE_MISSION':
      return {
        ...state,
        story: {
          ...state.story,
          completedMissions: {
            ...state.story.completedMissions,
            [action.payload.missionId]: {
              stars: action.payload.stars,
              completedAt: Date.now(),
            },
          },
        },
      };
    
    // Talents
    case 'LEARN_TALENT': {
      const talentId = action.payload;
      const currentRank = state.player.learnedTalents[talentId] || 0;
      
      return {
        ...state,
        player: {
          ...state.player,
          talentPoints: state.player.talentPoints - 1,
          learnedTalents: {
            ...state.player.learnedTalents,
            [talentId]: currentRank + 1,
          },
        },
      };
    }
    
    case 'RESET_TALENT_TREE': {
      const treeId = action.payload;
      const costToReset = 100;
      
      // Find all talents in this tree and remove them
      const newLearnedTalents = { ...state.player.learnedTalents };
      let pointsRefunded = 0;
      
      // Remove talents that belong to this tree
      Object.keys(newLearnedTalents).forEach(talentId => {
        if (talentId.startsWith(treeId.replace('_', '_').split('_').slice(0, 2).join('_'))) {
          pointsRefunded += newLearnedTalents[talentId];
          delete newLearnedTalents[talentId];
        }
      });
      
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - costToReset,
          talentPoints: state.player.talentPoints + pointsRefunded,
          learnedTalents: newLearnedTalents,
        },
      };
    }
    
    case 'RESET_ALL_TALENTS': {
      const costToReset = 500;
      const pointsRefunded = Object.values(state.player.learnedTalents).reduce(
        (sum, ranks) => sum + ranks,
        0
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - costToReset,
          talentPoints: state.player.talentPoints + pointsRefunded,
          learnedTalents: {},
        },
      };
    }
    
    // Settings
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    
    // System
    case 'SAVE_GAME':
      return {
        ...state,
        lastSaved: Date.now(),
      };
    
    case 'LOAD_GAME':
      return action.payload;
    
    case 'START_TOURNAMENT':
      return {
        ...state,
        tournament: {
          isActive: true,
          difficulty: action.payload.difficulty as DifficultyLevel,
          currentRound: 1,
          opponents: action.payload.opponents,
          results: [],
        },
      };
    
    case 'COMPLETE_TOURNAMENT_ROUND':
      return {
        ...state,
        tournament: {
          ...state.tournament,
          currentRound: state.tournament.currentRound + 1,
        },
        stats: {
          ...state.stats,
          totalWins: action.payload.victory ? state.stats.totalWins + 1 : state.stats.totalWins,
          totalLosses: !action.payload.victory ? state.stats.totalLosses + 1 : state.stats.totalLosses,
        },
      };
    
    case 'END_TOURNAMENT':
      return {
        ...state,
        tournament: {
          ...state.tournament,
          isActive: false,
        },
        stats: {
          ...state.stats,
          tournamentsWon: action.payload.won ? state.stats.tournamentsWon + 1 : state.stats.tournamentsWon,
          tournamentsPlayed: state.stats.tournamentsPlayed + 1,
        },
      };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface GameProviderProps {
  children: ReactNode;
}

function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Load game from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('legends-of-arena-save');
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        dispatch({ type: 'LOAD_GAME', payload: parsed });
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);
  
  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('legends-of-arena-save', JSON.stringify(state));
      dispatch({ type: 'SAVE_GAME' });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [state]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Export context for use in custom hooks
export { GameContext, GameProvider };
