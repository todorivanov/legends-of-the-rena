# State Management Architecture

## Overview

Legends of the Arena uses a centralized state management system inspired by Redux. All game state lives in a single `gameStore`, and state mutations happen through dispatched actions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Game Components                       │
│  (Combat, Story, Marketplace, Profile, etc.)                │
└────────────────┬─────────────────────────┬──────────────────┘
                 │                         │
                 │ dispatch(action)        │ getState()
                 ▼                         │
┌─────────────────────────────────────────┴──────────────────┐
│                        gameStore                            │
│  • Single source of truth                                   │
│  • Manages all game state                                   │
│  • 30-second auto-save to localStorage                      │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 │ action → reducer → new state
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                        Reducers                              │
│  • Pure functions that create new state                     │
│  • Handle specific action types                             │
│  • Return state updates (not mutations)                     │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 │ persist
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     SaveManagerV2                            │
│  • Handles localStorage persistence                         │
│  • Compression, backups, versioning                         │
│  • Only used for save/load operations                       │
└─────────────────────────────────────────────────────────────┘
```

## State Structure

```javascript
{
  player: {
    characterCreated: false,
    name: '',
    class: '',
    level: 1,
    xp: 0,
    gold: 500,
    createdAt: null,
    lastPlayedAt: null
  },
  
  inventory: {
    equipment: ['item_id_1', 'item_id_2']  // Array of equipment IDs
  },
  
  equipped: {
    weapon: null,
    armor: null,
    accessory: null
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
    legendaryPurchases: 0
  },
  
  story: {
    currentMission: null,
    currentMissionState: null,
    unlockedRegions: ['tutorial'],
    unlockedMissions: ['tutorial_mission_1'],
    completedMissions: {
      'mission_id': {
        stars: 3,
        completedAt: 1234567890
      }
    }
  },
  
  unlocks: {
    achievements: ['achievement_id_1']
  },
  
  settings: {
    difficulty: 'normal',
    soundEnabled: true,
    autoBattleEnabled: false,
    autoScrollEnabled: true,
    performanceMonitorEnabled: false
  }
}
```

## Core Concepts

### 1. Actions

Actions are plain objects that describe what happened. They must have a `type` property.

```javascript
// Action Types (defined in actions.js)
export const ActionTypes = {
  INCREMENT_STAT: 'INCREMENT_STAT',
  ADD_GOLD: 'ADD_GOLD',
  EQUIP_ITEM: 'EQUIP_ITEM',
  // ... more types
};

// Action Creators (functions that create actions)
export const incrementStat = (statName, amount = 1) => ({
  type: ActionTypes.INCREMENT_STAT,
  payload: { statName, amount },
});

export const addGold = (amount) => ({
  type: ActionTypes.ADD_GOLD,
  payload: { amount },
});
```

### 2. Reducers

Reducers are pure functions that take the current state and an action, then return a new state.

```javascript
// Reducer for INCREMENT_STAT action
[ActionTypes.INCREMENT_STAT]: (state, { statName, amount }) => {
  return {
    stats: {
      ...state.stats,
      [statName]: (state.stats[statName] || 0) + amount,
    },
  };
}
```

**Rules:**
- Never mutate state directly
- Always return a new object
- No side effects (API calls, etc.)
- Same input = same output (pure function)

### 3. Dispatching Actions

To change state, dispatch an action through the store:

```javascript
import { gameStore } from '../store/gameStore.js';
import { incrementStat, addGold } from '../store/actions.js';

// Dispatch actions
gameStore.dispatch(incrementStat('totalWins'));
gameStore.dispatch(addGold(100));

// Read current state
const state = gameStore.getState();
console.log(state.player.gold); // 600
```

### 4. Subscribing to Changes

Components can subscribe to state changes:

```javascript
const unsubscribe = gameStore.subscribe((state) => {
  console.log('State updated:', state);
  updateUI(state);
});

// Later, unsubscribe
unsubscribe();
```

## Usage Examples

### Tracking Statistics

```javascript
// Combat Engine (game.js)
import { gameStore } from '../store/gameStore.js';
import { incrementStat, updateStreak } from '../store/actions.js';

function handleCombatEnd(playerWon) {
  // Track fight
  gameStore.dispatch(incrementStat('totalFightsPlayed'));
  
  if (playerWon) {
    gameStore.dispatch(incrementStat('totalWins'));
    gameStore.dispatch(updateStreak(true)); // Increments streak, updates best
  } else {
    gameStore.dispatch(incrementStat('totalLosses'));
    gameStore.dispatch(updateStreak(false)); // Resets streak to 0
  }
}

function dealDamage(amount, isCrit) {
  gameStore.dispatch(incrementStat('totalDamageDealt', amount));
  
  if (isCrit) {
    gameStore.dispatch(incrementStat('criticalHits'));
  }
}
```

### Managing Inventory

```javascript
// Equipment Manager
import { gameStore } from '../store/gameStore.js';
import { addItem, removeItem, equipItem, unequipItem } from '../store/actions.js';

class EquipmentManager {
  static addToInventory(itemId) {
    gameStore.dispatch(addItem(itemId));
    return true;
  }
  
  static removeFromInventory(itemId) {
    gameStore.dispatch(removeItem(itemId));
    return true;
  }
  
  static equipItem(itemId, slot) {
    const state = gameStore.getState();
    const currentEquipped = state.equipped[slot];
    
    // Unequip current item if exists
    if (currentEquipped) {
      gameStore.dispatch(unequipItem(slot));
    }
    
    // Equip new item
    gameStore.dispatch(equipItem(itemId, slot));
    return true;
  }
}
```

### Story Mode Management

```javascript
// Story Mode Manager
import { gameStore } from '../store/gameStore.js';
import { 
  setCurrentMissionState, 
  completeMission, 
  unlockRegion 
} from '../store/actions.js';

class StoryMode {
  static startMission(missionId) {
    const missionState = {
      missionId,
      startTime: Date.now(),
      damageDealt: 0,
      damageTaken: 0,
      // ... more tracking
    };
    
    gameStore.dispatch(setCurrentMissionState(missionState));
  }
  
  static completeMission(missionId, stars) {
    const rewards = { xp: 500, gold: 200 };
    gameStore.dispatch(completeMission(missionId, stars, rewards));
    
    // Check if region should unlock
    if (this.shouldUnlockNextRegion(missionId)) {
      gameStore.dispatch(unlockRegion('next_region_id'));
    }
  }
}
```

### Reading State

```javascript
// Profile Screen Component
import { gameStore } from '../store/gameStore.js';

class ProfileScreen {
  render() {
    const state = gameStore.getState();
    
    return `
      <div class="profile">
        <h2>${state.player.name} - Level ${state.player.level}</h2>
        <p>Gold: ${state.player.gold}</p>
        <p>Win Rate: ${this.calculateWinRate(state.stats)}</p>
        <p>Story Progress: ${this.getStoryProgress(state.story)}%</p>
      </div>
    `;
  }
  
  calculateWinRate(stats) {
    if (stats.totalFightsPlayed === 0) return '0%';
    return ((stats.totalWins / stats.totalFightsPlayed) * 100).toFixed(1) + '%';
  }
  
  getStoryProgress(story) {
    const totalMissions = 25; // Total available
    const completed = Object.keys(story.completedMissions).length;
    return ((completed / totalMissions) * 100).toFixed(0);
  }
}
```

## Auto-Save System

The gameStore automatically saves to localStorage every 30 seconds:

```javascript
// Auto-save interval (30 seconds)
setInterval(() => {
  if (!isResetting) {
    saveGameState();
  }
}, 30000);

// Also save on page unload
window.addEventListener('beforeunload', () => {
  if (!isResetting) {
    saveGameState();
  }
});
```

**Auto-save only starts after character creation:**
```javascript
// main-new.js
const state = gameStore.getState();
if (state.player.characterCreated) {
  startAutoSave(); // Begin 30-second interval
}
```

## Best Practices

### ✅ DO

1. **Use actions for all state changes**
   ```javascript
   gameStore.dispatch(incrementStat('totalWins'));
   ```

2. **Read state when you need it**
   ```javascript
   const currentGold = gameStore.getState().player.gold;
   ```

3. **Use action creators**
   ```javascript
   import { addGold } from '../store/actions.js';
   gameStore.dispatch(addGold(100));
   ```

4. **Keep reducers pure**
   ```javascript
   [ActionTypes.ADD_GOLD]: (state, { amount }) => ({
     player: {
       ...state.player,
       gold: state.player.gold + amount,
     },
   })
   ```

### ❌ DON'T

1. **Mutate state directly**
   ```javascript
   const state = gameStore.getState();
   state.player.gold += 100; // WRONG!
   ```

2. **Use SaveManager for game state**
   ```javascript
   SaveManager.update('profile.gold', newGold); // WRONG! Use gameStore
   ```

3. **Cache state for long periods**
   ```javascript
   const gold = gameStore.getState().player.gold;
   // ... 5 minutes later ...
   console.log(gold); // Might be stale!
   ```

4. **Side effects in reducers**
   ```javascript
   [ActionTypes.ADD_GOLD]: (state, { amount }) => {
     console.log('Adding gold'); // Don't log in reducers
     SaveManager.save(state);    // Don't save in reducers
     return { ... };
   }
   ```

## Testing

### Mocking gameStore in Tests

```javascript
import { vi } from 'vitest';

// Mock gameStore
vi.mock('../store/gameStore.js', () => {
  let mockState = { player: { gold: 100 } };
  
  return {
    gameStore: {
      getState: vi.fn(() => mockState),
      dispatch: vi.fn((action) => {
        // Optionally handle actions in tests
        console.log('Action dispatched:', action);
      }),
      subscribe: vi.fn(),
    },
  };
});
```

### Testing Components

```javascript
import { gameStore } from '../store/gameStore.js';

describe('ProfileScreen', () => {
  it('should display player gold', () => {
    const profile = new ProfileScreen();
    const html = profile.render();
    
    expect(html).toContain('Gold: 100');
  });
});
```

## Migration from SaveManager

See [MIGRATION_GUIDE.md](../guides/MIGRATION_GUIDE.md#version-4100---state-management-migration-2026-01-13) for detailed migration instructions.

**Quick reference:**

| Old (SaveManager) | New (gameStore) |
|-------------------|-----------------|
| `SaveManager.get('profile.gold')` | `gameStore.getState().player.gold` |
| `SaveManager.update('profile.gold', 100)` | `gameStore.dispatch(addGold(100))` |
| `SaveManager.increment('stats.totalWins')` | `gameStore.dispatch(incrementStat('totalWins'))` |
| `SaveManager.load()` | Still used for loading saves |
| `SaveManager.save()` | Automatic via auto-save |

## Performance Considerations

- **Batching**: Multiple dispatches in quick succession are fine - state updates are synchronous
- **Subscribers**: Only subscribe when necessary, unsubscribe when done
- **State Size**: Keep state lean - don't store computed values
- **Auto-save**: Runs every 30 seconds, minimal performance impact
- **Compression**: SaveManager compresses data before localStorage write

## Debugging

### View Current State

```javascript
// In browser console
console.log(gameStore.getState());
```

### Log All Actions

Add logging to dispatch:
```javascript
const originalDispatch = gameStore.dispatch;
gameStore.dispatch = (action) => {
  console.log('Action:', action);
  const result = originalDispatch(action);
  console.log('New State:', gameStore.getState());
  return result;
};
```

### State History

Future feature: Time-travel debugging to replay actions and restore previous states.

## Future Enhancements

- **Middleware**: Add middleware for logging, async actions, etc.
- **DevTools**: Browser extension for debugging
- **Undo/Redo**: Time-travel debugging with action history
- **Persistence**: More granular control over what gets saved
- **Lazy Loading**: Load state modules on demand
