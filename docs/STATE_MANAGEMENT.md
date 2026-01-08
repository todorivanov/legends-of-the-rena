# State Management System Documentation

## Overview

The game now uses a centralized state management system inspired by Redux/Zustand, providing predictable state updates, time-travel debugging, and automatic persistence.

## Architecture

```
src/store/
├── Store.js         - Core store class with subscribe/notify
├── gameStore.js     - Main game state instance
├── actions.js       - Action types and action creators
├── reducers.js      - Pure functions for state mutations
├── selectors.js     - Functions to retrieve and derive state
└── index.js         - Centralized exports
```

## Core Concepts

### 1. Single Source of Truth

All game state lives in one place: `gameStore`

```javascript
import { gameStore } from './store/index.js';

// Get current state
const state = gameStore.getState();
console.log(state.player.gold); // 100
```

### 2. State is Read-Only

State can only be changed by dispatching actions:

```javascript
import { gameStore, addGold } from './store/index.js';

// ❌ DON'T: Mutate state directly
// gameStore.state.player.gold += 50;

// ✅ DO: Dispatch an action
gameStore.dispatch(addGold(50));
```

### 3. Changes are Made with Pure Functions

Reducers are pure functions that return new state:

```javascript
// In reducers.js
[ActionTypes.ADD_GOLD]: (state, { amount }) => ({
  player: {
    ...state.player,
    gold: state.player.gold + amount,
  },
}),
```

## Usage Guide

### Dispatching Actions

```javascript
import { gameStore, addGold, addXP, setDifficulty } from './store/index.js';

// Add gold
gameStore.dispatch(addGold(100));

// Add XP (auto-levels up if needed)
gameStore.dispatch(addXP(250));

// Change difficulty
gameStore.dispatch(setDifficulty('hard'));
```

### Reading State

```javascript
import { gameStore, selectPlayerGold, selectPlayerLevel } from './store/index.js';

// Get full state
const state = gameStore.getState();

// Use selectors (recommended)
const gold = selectPlayerGold(state);
const level = selectPlayerLevel(state);

console.log(`Level ${level} player has ${gold} gold`);
```

### Subscribing to Changes

```javascript
import { gameStore } from './store/index.js';

// Subscribe to all state changes
const unsubscribe = gameStore.subscribe((state, actionType) => {
  console.log('State changed by:', actionType);
  console.log('New state:', state);
});

// Subscribe to specific state changes
const unsubscribeGold = gameStore.subscribe(
  (state) => {
    console.log('Gold changed:', state.player.gold);
  },
  'player.gold' // Only notify when this changes
);

// Unsubscribe when done
unsubscribe();
unsubscribeGold();
```

## Available Actions

### Player Actions

```javascript
import {
  setPlayer,
  updatePlayer,
  addGold,
  spendGold,
  addXP,
  levelUp,
} from './store/index.js';

// Set player data
gameStore.dispatch(setPlayer({ name: 'Hero', level: 5, gold: 500 }));

// Update specific fields
gameStore.dispatch(updatePlayer({ health: 150 }));

// Economy
gameStore.dispatch(addGold(100));
gameStore.dispatch(spendGold(50));

// Progression
gameStore.dispatch(addXP(200)); // Auto-levels if XP threshold reached
gameStore.dispatch(levelUp()); // Manual level up
```

### Combat Actions

```javascript
import {
  startCombat,
  endCombat,
  updateFighter,
  setCombatRound,
  setCurrentTurn,
} from './store/index.js';

// Start combat
gameStore.dispatch(startCombat(fighter1, fighter2, { mode: 'tournament' }));

// Update fighter state
gameStore.dispatch(updateFighter(fighter1.id, { health: 80 }));

// Manage turns
gameStore.dispatch(setCombatRound(3));
gameStore.dispatch(setCurrentTurn(fighter2.id));

// End combat
gameStore.dispatch(endCombat(winner, { damageDealt: 150, damageTaken: 50 }));
```

### Inventory Actions

```javascript
import {
  addItem,
  removeItem,
  equipItem,
  unequipItem,
  updateDurability,
} from './store/index.js';

// Add item to inventory
gameStore.dispatch(addItem({ id: 'sword_1', name: 'Iron Sword' }));

// Remove item
gameStore.dispatch(removeItem('sword_1'));

// Equip/unequip
gameStore.dispatch(equipItem('sword_1', 'weapon'));
gameStore.dispatch(unequipItem('weapon'));

// Update durability
gameStore.dispatch(updateDurability('sword_1', 75));
```

### Story Mode Actions

```javascript
import {
  setStoryMission,
  completeMission,
  unlockRegion,
  unlockMission,
} from './store/index.js';

// Start mission
gameStore.dispatch(setStoryMission('tutorial_1'));

// Complete mission
gameStore.dispatch(completeMission('tutorial_1', 3, { gold: 50, xp: 100 }));

// Unlock content
gameStore.dispatch(unlockRegion('novice'));
gameStore.dispatch(unlockMission('novice_1'));
```

### Statistics Actions

```javascript
import {
  incrementStat,
  recordBattle,
  updateStreak,
} from './store/index.js';

// Increment any stat
gameStore.dispatch(incrementStat('criticalHits', 1));
gameStore.dispatch(incrementStat('skillsUsed', 1));

// Record battle result
gameStore.dispatch(recordBattle(true, { damageDealt: 200, damageTaken: 50 }));

// Update win streak
gameStore.dispatch(updateStreak(true)); // Won
gameStore.dispatch(updateStreak(false)); // Lost
```

## Selectors

Selectors provide a clean API to access state:

```javascript
import {
  selectPlayerLevel,
  selectPlayerGold,
  selectWinRate,
  selectCanAfford,
  selectLevelProgress,
} from './store/index.js';

const state = gameStore.getState();

// Basic selectors
const level = selectPlayerLevel(state); // 10
const gold = selectPlayerGold(state); // 500

// Derived selectors
const winRate = selectWinRate(state); // 75%
const canBuy = selectCanAfford(state, 100); // true/false
const progress = selectLevelProgress(state); // { current: 50, needed: 100, percentage: 50 }
```

### All Available Selectors

**Player:**
- `selectPlayer`, `selectPlayerLevel`, `selectPlayerGold`, `selectPlayerXP`, `selectPlayerHealth`, `selectPlayerStrength`, `selectPlayerDefense`

**Combat:**
- `selectCombat`, `selectIsCombatActive`, `selectCombatRound`, `selectCurrentTurn`, `selectFighter1`, `selectFighter2`

**Game Mode:**
- `selectGameMode`, `selectCurrentScreen`, `selectFighters`, `selectSelectedFighters`

**Tournament:**
- `selectTournament`, `selectIsTournamentActive`, `selectTournamentRound`, `selectTournamentDifficulty`

**Story:**
- `selectStory`, `selectCurrentMission`, `selectCompletedMissions`, `selectTotalStars`, `selectMissionInfo`

**Inventory:**
- `selectInventory`, `selectEquipment`, `selectEquipped`, `selectCanAfford`, `selectInventoryCount`

**Stats:**
- `selectStats`, `selectTotalWins`, `selectTotalLosses`, `selectWinRate`, `selectWinStreak`, `selectBestStreak`

**Settings:**
- `selectSettings`, `selectDifficulty`, `selectSoundEnabled`, `selectAutoBattle`, `selectAutoScroll`

## Advanced Features

### Time-Travel Debugging

```javascript
// Undo last action
gameStore.undo();

// Redo
gameStore.redo();

// Check history
const history = gameStore.getHistoryInfo();
console.log(history); // { current: 5, total: 10, canUndo: true, canRedo: true }
```

### Middleware

Middleware can intercept actions before/after they're processed:

```javascript
gameStore.use({
  before: (state, action) => {
    console.log('Before action:', action.type);
  },
  after: (state, action, prevState) => {
    console.log('After action:', action.type);
    // Auto-save, logging, analytics, etc.
  },
});
```

### Auto-Save

The store automatically saves to localStorage after every action (except UI-only actions):

```javascript
// Automatic - no action needed!
gameStore.dispatch(addGold(100));
// State is saved to localStorage via SaveManager
```

### Debugging

Access the store from browser console:

```javascript
// Available globally in dev mode
window.__GAME_STORE__

// Inspect store
window.__GAME_STORE__.inspect()

// Get state
window.__GAME_STORE__.getState()

// Dispatch actions
window.__GAME_STORE__.dispatch({ type: 'ADD_GOLD', payload: { amount: 999 } })
```

## Migration Guide

### Before (Direct State Mutation)

```javascript
// ❌ Old way
appState.gold += 50;
SaveManager.increment('profile.gold', 50);
```

### After (Store Actions)

```javascript
// ✅ New way
gameStore.dispatch(addGold(50));
// Auto-saves!
```

### Gradual Migration Strategy

The old `appState` still exists for backward compatibility. Migrate gradually:

1. **Phase 1**: Use store for new features
2. **Phase 2**: Migrate player/inventory state
3. **Phase 3**: Migrate combat state
4. **Phase 4**: Remove appState entirely

## Benefits

### Before Store
- ❌ State scattered everywhere
- ❌ Hard to track changes
- ❌ Manual save management
- ❌ No debugging tools
- ❌ Prone to bugs

### After Store
- ✅ Single source of truth
- ✅ Predictable state updates
- ✅ Automatic persistence
- ✅ Time-travel debugging
- ✅ Easy to test and maintain

## Best Practices

1. **Always use action creators** - Don't create action objects manually
2. **Use selectors** - Don't access state directly
3. **Keep reducers pure** - No side effects, API calls, or mutations
4. **Subscribe sparingly** - Unsubscribe when components unmount
5. **Use specific selectors** - Subscribe to only what you need

## Examples

### Complete Flow: Buying an Item

```javascript
import {
  gameStore,
  spendGold,
  addItem,
  incrementStat,
  selectPlayerGold,
  selectCanAfford,
} from './store/index.js';

function buyItem(item) {
  const state = gameStore.getState();

  // Check if can afford
  if (!selectCanAfford(state, item.price)) {
    console.log('Not enough gold!');
    return false;
  }

  // Purchase item
  gameStore.dispatch(spendGold(item.price));
  gameStore.dispatch(addItem(item));
  gameStore.dispatch(incrementStat('marketplacePurchases'));

  console.log('Item purchased!');
  return true;
}
```

### Reactive UI Updates

```javascript
import { gameStore, selectPlayerGold } from './store/index.js';

// Update UI when gold changes
const unsubscribe = gameStore.subscribe((state) => {
  const gold = selectPlayerGold(state);
  document.getElementById('gold-display').textContent = `${gold} Gold`;
}, 'player.gold');

// Clean up on page leave
window.addEventListener('beforeunload', unsubscribe);
```

## Future Enhancements

Potential improvements:
- TypeScript definitions for better type safety
- DevTools browser extension
- Action replay/recording
- State snapshots for testing
- Performance optimization with memoization
