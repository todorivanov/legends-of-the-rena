# Migration Guide - ObjectFighterJS

## Version 4.10.0 - State Management Migration (2026-01-13)

### Overview
Version 4.10.0 represents a major architectural refactor that migrates all game state management from direct `SaveManager` calls to a centralized `gameStore` (Redux-style state management). This provides better state consistency, easier debugging, and proper separation of concerns.

### What Changed?

**State Management Architecture:**
- All game managers now use `gameStore` as the single source of truth
- SaveManager is now only used for persistence (save/load operations)
- State mutations happen through dispatched actions
- 30-second auto-save writes gameStore state to localStorage

### Breaking Changes for Developers

#### 1. SaveManager.load() Returns Behavior
**Before (4.2.0):**
```javascript
const profile = SaveManager.load(); // Always returned default profile if none exists
expect(profile.profile.characterCreated).toBe(false);
```

**After (4.10.0):**
```javascript
const profile = SaveManager.load(); // Returns null if no save exists
if (profile === null) {
  // No save exists, handle first-time setup
}
```

**Migration:**
- Update any code expecting a default profile to check for `null` first
- Use `gameStore.getState()` for reading current game state
- Use `SaveManager.load()` only for actual load operations

#### 2. Statistics Tracking
**Before (4.2.0):**
```javascript
SaveManager.increment('stats.totalWins');
SaveManager.update('stats.winStreak', 0);
```

**After (4.10.0):**
```javascript
import { gameStore } from '../store/gameStore.js';
import { incrementStat, updateStreak } from '../store/actions.js';

gameStore.dispatch(incrementStat('totalWins'));
gameStore.dispatch(updateStreak(false)); // Auto-updates winStreak and bestStreak
```

**Migration:**
- Replace all `SaveManager.increment('stats.X')` with `gameStore.dispatch(incrementStat('X'))`
- Replace streak management with `updateStreak(won)` action
- Import gameStore and actions in any file that tracks stats

#### 3. Reading Game State
**Before (4.2.0):**
```javascript
const gold = SaveManager.get('profile.gold');
const level = SaveManager.get('profile.level');
```

**After (4.10.0):**
```javascript
import { gameStore } from '../store/gameStore.js';

const state = gameStore.getState();
const gold = state.player.gold;
const level = state.player.level;
```

**Migration:**
- Replace `SaveManager.get()` with `gameStore.getState()` for reading state
- Access nested properties directly from state object
- State structure: `player`, `inventory`, `equipped`, `stats`, `story`, `unlocks`, `settings`

#### 4. Updating Game State
**Before (4.2.0):**
```javascript
SaveManager.update('profile.gold', newGold);
SaveManager.update('inventory.equipment', newEquipment);
```

**After (4.10.0):**
```javascript
import { gameStore } from '../store/gameStore.js';
import { addGold, spendGold, addItem, removeItem } from '../store/actions.js';

gameStore.dispatch(addGold(100));
gameStore.dispatch(spendGold(50));
gameStore.dispatch(addItem(itemId));
gameStore.dispatch(removeItem(itemId));
```

**Migration:**
- Use specific action creators for state mutations
- Never mutate state directly
- All changes go through `gameStore.dispatch()`

### Data Format Changes

#### Completed Missions Structure
**Before (4.2.0):**
```javascript
completedMissions: ['mission_id_1', 'mission_id_2']
```

**After (4.10.0):**
```javascript
completedMissions: {
  'mission_id_1': { stars: 3, completedAt: 1234567890 },
  'mission_id_2': { stars: 2, completedAt: 1234567900 }
}
```

**Migration:**
- Array format is automatically migrated on load
- Check missions with `if (state.story.completedMissions[missionId])`
- Get star count: `state.story.completedMissions[missionId].stars`

### Available Actions

**Player Actions:**
```javascript
updatePlayer(updates)       // Update player properties
addGold(amount)            // Add gold
spendGold(amount)          // Spend gold
addXP(amount)              // Award XP
levelUp()                  // Level up player
```

**Inventory Actions:**
```javascript
addItem(itemId)            // Add item to inventory
removeItem(itemId)         // Remove item from inventory
equipItem(itemId, slot)    // Equip item
unequipItem(slot)          // Unequip item
updateDurability(itemId, durability)  // Update item durability
```

**Statistics Actions:**
```javascript
incrementStat(statName, amount = 1)  // Increment any stat
updateStreak(won)                    // Update win/loss streak
```

**Story Actions:**
```javascript
setCurrentMissionState(missionState)     // Set active mission
completeMission(missionId, stars, rewards)  // Complete mission
unlockRegion(regionId)                   // Unlock region
unlockMission(missionId)                 // Unlock mission
```

**Achievement Actions:**
```javascript
unlockAchievement(achievementId)  // Unlock achievement
```

### Testing Changes

**Mock SaveManager in Tests:**
```javascript
vi.mock('../../src/utils/SaveManagerV2.js', () => ({
  SaveManagerV2: {
    load: vi.fn(() => null),  // Important: return null
    save: vi.fn(() => true),
    get: vi.fn(),
    update: vi.fn(),
  },
}));
```

**Test Expectations:**
```javascript
// Old
expect(profile.profile.characterCreated).toBe(false);

// New
expect(profile).toBeNull();
```

### File Structure Changes

**New State Management Files:**
- `src/store/gameStore.js` - Main store with reducer and auto-save
- `src/store/actions.js` - All action creators and types
- `src/store/reducers.js` - All state mutation logic
- `src/store/index.js` - Store exports

**Modified Game Managers:**
- `src/game/game.js` - Combat engine (28 stat tracking calls)
- `src/game/StoryMode.js` - Story mode management
- `src/game/EconomyManager.js` - Gold management
- `src/game/LevelingSystem.js` - XP/leveling
- `src/game/EquipmentManager.js` - Equipment/inventory
- `src/game/DurabilityManager.js` - Item durability
- `src/game/AchievementManager.js` - Achievements
- `src/game/MarketplaceManager.js` - Shop operations

### Benefits of Migration

1. **Single Source of Truth** - All state in one place
2. **Predictable State Updates** - Actions define all mutations
3. **Easier Debugging** - Can log all state changes
4. **Better Testing** - Mock gameStore instead of SaveManager
5. **Atomic Updates** - State changes are batched
6. **Performance** - Reduced localStorage operations
7. **Time Travel Debugging** - Can replay actions (future feature)

### Common Pitfalls

❌ **Don't:**
```javascript
// Direct SaveManager calls for game state
SaveManager.update('profile.gold', newGold);

// Mutating state directly
const state = gameStore.getState();
state.player.gold = 100; // WRONG

// Reading stale state
const gold = gameStore.getState().player.gold;
// ... long operation ...
// gold might be outdated now
```

✅ **Do:**
```javascript
// Use actions for state updates
gameStore.dispatch(addGold(100));

// Create new state via reducers
const newState = { ...state, player: { ...state.player, gold: 100 } };

// Read fresh state when needed
const currentGold = gameStore.getState().player.gold;
```

---

## Version 2.0 - Tech Stack Modernization (Previous)

## What Changed?

This guide covers the migration from ObjectFighterJS v1.0 to v2.0, which includes a complete modernization of the tech stack.

## Technology Updates

### Build System
- **Old**: Webpack 3 + Babel 6
- **New**: Vite 5 (10x faster builds, instant HMR)

### Dependencies Removed
- ❌ jQuery 3.2.1
- ❌ Bootstrap 3.3.7
- ❌ Babel presets (es2015, react)

### Dependencies Added
- ✅ Bootstrap 5.3.3 (modern, better mobile support)
- ✅ Vite 5.4.11 (lightning-fast dev server)
- ✅ ESLint 9 + Prettier 3 (code quality)
- ✅ Native ES modules (no transpilation needed)

## File Changes

### New Files Created
- `src/main.js` - New entry point (replaces `src/index.js`)
- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git ignore patterns

### Modified Files
- `package.json` - Updated dependencies and scripts
- `index.html` - Simplified, now uses ES modules
- `src/utils/logger.js` - Removed jQuery, uses vanilla JS
- `src/index.css` - Updated for Bootstrap 5, modern styling

### Deleted Files
- `webpack.config.js` - No longer needed (using Vite)
- `src/index.js` - Replaced by `src/main.js`

## Breaking Changes

### jQuery Removal
All jQuery (`$`) usage has been replaced with vanilla JavaScript:

**Before:**
```javascript
$('.container').html('');
$('#log').append(message);
$('.fighter').on('click', handler);
```

**After:**
```javascript
document.querySelector('.container').innerHTML = '';
document.querySelector('#log').insertAdjacentHTML('beforeend', message);
document.querySelector('.fighter').addEventListener('click', handler);
```

### Bootstrap Grid Updates
Bootstrap 3 grid classes have been updated to Bootstrap 5:

**Before:**
```html
<div class="col-xs-6">...</div>
<div class="col-xs-2">...</div>
```

**After:**
```html
<div class="col-6">...</div>
<div class="col-2">...</div>
```

### Module Imports
All JavaScript files now use ES6 module syntax. Imports must include `.js` extension:

**Before:**
```javascript
import Game from './game/game';
```

**After:**
```javascript
import Game from './game/game.js';
```

## New NPM Scripts

### Development
```bash
npm run dev          # Start Vite dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Check code for errors
npm run format       # Auto-format code with Prettier
npm run format:check # Check if code is formatted
```

## Migration Steps (If Updating Existing Project)

1. **Backup your project**
   ```bash
   git commit -am "Backup before v2.0 migration"
   ```

2. **Remove old dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. **Install new dependencies**
   ```bash
   npm install
   ```

4. **Start dev server**
   ```bash
   npm run dev
   ```

5. **Test all game modes**
   - Single fight mode
   - Team match mode
   - Drag & drop functionality
   - Combat log display

## Improved Features

### Performance
- **Dev server starts in <1s** (was ~10s with Webpack)
- **Hot Module Replacement (HMR)** - instant updates without refresh
- **Smaller bundle size** - tree-shaking removes unused code

### Developer Experience
- **ESLint** catches errors before runtime
- **Prettier** ensures consistent code style
- **Modern JavaScript** - use latest ES2022+ features

### UI/UX Improvements
- **Responsive design** - works on mobile devices
- **Modern gradient background** - purple/blue theme
- **Hover effects** on fighter cards
- **Auto-scrolling combat log** - always see latest action
- **Better typography** - system font stack
- **Smooth transitions** - CSS animations throughout

## Known Issues

### Security Warnings
Running `npm install` may show 2 moderate vulnerabilities. These are in dev dependencies and don't affect production. To fix:
```bash
npm audit fix
```

### Image Loading
The fighter images use external CDN URLs that may be broken. Consider:
- Using local images in `/public/images/`
- Using a placeholder image service
- Implementing fighter avatars

## Next Steps

Now that Phase 1.1 is complete, the codebase is ready for:
- **Phase 1.2**: Architecture refactoring (state management)
- **Phase 2**: Bug fixes and code quality improvements
- **Phase 3**: Gameplay enhancements (player control, skills)
- **Phase 4**: UI/UX overhaul (animations, sound)
- **Phase 5**: Save system and progression

## Getting Help

If you encounter issues:
1. Check that Node.js version is 18+ (`node --version`)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console for errors (F12)
4. Ensure all files have `.js` extensions in imports

## Rollback Plan

If you need to revert to v1.0:
```bash
git revert HEAD
npm install
npm run webpack
```

---

**Version**: 2.0.0  
**Date**: January 2026  
**Author**: Todor Ivanov
