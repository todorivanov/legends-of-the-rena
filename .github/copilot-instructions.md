# Legends of the Arena - AI Coding Agent Instructions

## Project Overview
A browser-based RPG fighting game built with **vanilla JavaScript and native Web Components** (zero frameworks). Features tactical 5x5 grid combat, story mode campaigns, talent trees, equipment systems, and character progression.

## Architecture Principles

### Web Components Pattern
- **All UI components extend `BaseComponent`** ([src/components/BaseComponent.js](../src/components/BaseComponent.js))
  - Shadow DOM for encapsulation
  - Internal `setState()` triggers re-render
  - Custom event emission with `emit(eventName, detail)`
  - Override `styles()`, `template()`, `attachEventListeners()`
- **Register components in [src/components/index.js](../src/components/index.js)** with `customElements.define('component-name', ComponentClass)`
- Component naming: kebab-case in HTML, PascalCase class names

### State Management (Redux-like)
- **Single source of truth**: `gameStore` ([src/store/gameStore.js](../src/store/gameStore.js))
- **Never mutate state directly** - always dispatch actions from [src/store/actions.js](../src/store/actions.js)
- **Reducer pattern**: [src/store/reducers.js](../src/store/reducers.js) returns new state objects
- Auto-save to localStorage every 30 seconds via `SaveManagerV2`
- State structure: `player`, `inventory`, `equipped`, `stats`, `story`, `unlocks`, `talents`
- Access state: `gameStore.getState()`, modify: `gameStore.dispatch(actionCreator(...))`

### Combat System Architecture
- **Multi-layer design**:
  1. `CombatEngine.js` - Core damage calculations
  2. `GridCombatIntegration.js` - Tactical positioning layer  
  3. `CombatPhaseManager.js` - Turn order and phases (INITIATIVE → MOVEMENT → ACTION → EFFECT_RESOLUTION)
  4. `StatusEffectSystem.js` - Status effects with interaction matrix
  5. `ComboSystem.js` - Combo chains with 17 effects
- **Grid combat** (v4.8+): 5x5 grid with 10 terrain types, pathfinding (BFS), line-of-sight checks, flanking mechanics
- Grid actions use movement skills (class-specific, mana cost, cooldowns) - see [guides/INTERACTIVE_MOVEMENT_GUIDE.md](../guides/INTERACTIVE_MOVEMENT_GUIDE.md)

### Entity System
- **Inheritance**: `BaseEntity` → `Fighter` (composition over inheritance for features)
- Fighters use class data from [src/data/classes.js](../src/data/classes.js) (10 classes: Warrior, Mage, Tank, etc.)
- Equipment from [src/data/equipment.js](../src/data/equipment.js) modifies stats dynamically
- **Talent system** (v4.11): 3 specialization trees per class, passive bonuses via `TalentManager.js`

## Key Technical Patterns

### Routing
- Client-side router: [src/utils/Router.js](../src/utils/Router.js)
- Route guards in [src/config/routes.js](../src/config/routes.js) for access control (`characterCreated`, `minimumLevel`, etc.)
- URL-based navigation: `router.navigate('/path')` triggers screen changes

### Data Loading
- **Static data**: Import directly from `src/data/*.js` (classes, equipment, missions)
- **Game state**: Always read from `gameStore.getState()`, never cache locally
- **Mission data**: Use `StoryMode` from [src/game/StoryMode.js](../src/game/StoryMode.js)
  - Path-aware mission loading: Automatically routes to correct story path
  - Available methods: `getMissionById(id)`, `getAllPathMissions()`, `getAvailablePathMissions()`, `getMissionsByAct(act)`
  - 5 story paths: slave_gladiator, roman_legionnaire, lanista, barbarian_traveller, desert_nomad

### Event System
- Web Component events: `emit('event-name', { detail })` bubbles up DOM
- Global event bus: `EventManager` for cross-component communication
- Combat events: `GameEvent` objects dispatched through `EventManager`

### Performance Optimizations
- `ObjectPool` for frequently created objects (vectors, effects)
- `PerformanceMonitor` tracks metrics - wrap expensive operations with `profile(name, fn)`
- Lazy loading: Components render only when needed

## Development Workflows

### Running the Project
```bash
npm run dev          # Start Vite dev server (port 3000)
npm run build        # Production build to /dist
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint issues
```

### Testing
```bash
npm run test:unit    # Vitest unit tests with coverage
npm run test:e2e     # Playwright E2E tests
npm run test:watch   # Watch mode for TDD
npm run test:all     # Full test suite
```
- **Test environment**: `happy-dom` (see [vitest.config.js](../vitest.config.js))
- Unit tests in `tests/unit/`, E2E in `tests/e2e/`
- Coverage target: 70% lines/functions/branches
- Mock setup: [tests/setup.js](../tests/setup.js)

### File Organization
```
src/
  components/      # Web Components (UI)
  game/            # Game logic (managers, systems)
  entities/        # Fighter, BaseEntity classes
  store/           # State management (Store, actions, reducers)
  data/            # Static game data (classes, equipment, missions)
  utils/           # Helpers (Router, SaveManager, Logger, etc.)
  config/          # Configuration (routes, constants)
  screens/         # (Legacy - migrating to components)
```

## Common Tasks & Conventions

### Adding a New Feature
1. **State changes**: Add action to `actions.js`, reducer to `reducers.js`
2. **UI component**: Extend `BaseComponent`, register in `components/index.js`
3. **Game logic**: Create manager in `src/game/` (e.g., `MyFeatureManager.js`)
4. **Data**: Add static data to `src/data/` if needed
5. **Tests**: Unit test in `tests/unit/`, integration test for complex flows

### Grid Combat Integration
- Initialize grid: `gridCombatIntegration.initializeBattle(player, enemy, 'ARENA')`
- Movement validation: `gridManager.getValidMoves(fighter, range)`
- Line of sight: `gridManager.hasLineOfSight(x1, y1, x2, y2)`
- Terrain effects: `TerrainEffectProcessor.calculateTerrainModifiedDamage(...)`
- See full API in [guides/GRID_COMBAT_SYSTEM.md](../guides/GRID_COMBAT_SYSTEM.md)

### Modifying Combat
- Damage calculations in `CombatEngine.js` (stateless pure functions)
- Status effects: Add to `StatusEffectSystem.js`, update interaction matrix
- Combos: Define in [src/data/comboDefinitions.js](../src/data/comboDefinitions.js)
- Phase logic: `CombatPhaseManager.js` controls turn flow

### Character/Class Changes
- Class stats: [src/data/classes.js](../src/data/classes.js) - base HP, strength, defense, passives
- Talent trees: [src/data/talents.js](../src/data/talents.js) - 3 trees per class, requirements, effects
- Equipment: [src/data/equipment.js](../src/data/equipment.js) - stats, rarity, durability

### Logging & Debugging
- Use `ConsoleLogger` with categories: `ConsoleLogger.info(LogCategory.COMBAT, 'message')`
- Categories: `UI`, `COMBAT`, `STORE`, `ROUTER`, `AI`, `PERFORMANCE`
- Performance profiling: `performanceMonitor.profile('operation', () => { ... })`

## Project-Specific Gotchas

1. **State mutations**: NEVER use `gameStore.state.x = y`. Always dispatch actions.
2. **Component lifecycle**: Call `render()` in `connectedCallback()`, not constructor
3. **Shadow DOM styling**: CSS variables inherit from `:host`, Bootstrap is global
4. **Grid coordinates**: (0,0) is top-left, row-major indexing
5. **Mana costs**: Movement skills cost 10-15 mana, combat skills vary by class
6. **Save system**: Uses LZ-String compression, auto-migrates versions
7. **Team Battle mode removed** (v4.x) - only Single Combat, Story, Tournament
8. **ESLint**: Use ES2022 modules, prefer `const`, no `var`

## Testing Patterns
- **Fighter creation**: `new Fighter({ name, class: 'warrior', level: 5 })`
- **Mock localStorage**: `vi.spyOn(Storage.prototype, 'setItem')`
- **Store testing**: Create isolated store with `createStore(initialState, reducers)`
- **Component testing**: Mount to DOM, query shadow root: `component.shadowRoot.querySelector(...)`

## Documentation References
- Architecture: [docs/STATE_MANAGEMENT.md](../docs/STATE_MANAGEMENT.md), [docs/COMBAT_PHASES.md](../docs/COMBAT_PHASES.md)
- Features: [guides/TALENT_SYSTEM_GUIDE.md](../guides/TALENT_SYSTEM_GUIDE.md), [guides/GRID_COMBAT_SYSTEM.md](../guides/GRID_COMBAT_SYSTEM.md)
- Migration: [guides/MIGRATION_GUIDE.md](../guides/MIGRATION_GUIDE.md) for version upgrades
- Full changelog: [CHANGELOG.md](../CHANGELOG.md)

## Code Style
- **Naming**: camelCase for functions/variables, PascalCase for classes, UPPER_SNAKE_CASE for constants
- **JSDoc**: Document public methods with `@param`, `@returns`, `@description`
- **Error handling**: Use `try/catch` for async, log errors with `ConsoleLogger.error()`
- **Async patterns**: Prefer `async/await` over raw promises

## Code Examples

### Creating a Web Component
```javascript
import { BaseComponent } from './BaseComponent.js';

export class MyComponent extends BaseComponent {
  constructor() {
    super();
    this.setState({ count: 0 });
  }

  styles() {
    return `
      .container { padding: 20px; }
      button { background: var(--primary-color); }
    `;
  }

  template() {
    return `
      <div class="container">
        <p>Count: ${this.state.count}</p>
        <button id="increment">Increment</button>
      </div>
    `;
  }

  attachEventListeners() {
    this.shadowRoot.querySelector('#increment').addEventListener('click', () => {
      this.setState({ count: this.state.count + 1 });
      this.emit('count-changed', { value: this.state.count });
    });
  }
}

// Register in src/components/index.js
customElements.define('my-component', MyComponent);
```

### Working with gameStore
```javascript
import { gameStore } from '../store/gameStore.js';
import { updatePlayer, addGold, incrementStat } from '../store/actions.js';

// Reading state
const state = gameStore.getState();
const playerGold = state.player.gold;
const totalWins = state.stats.totalWins;

// Dispatching actions
gameStore.dispatch(addGold(100));
gameStore.dispatch(incrementStat('totalWins'));
gameStore.dispatch(updatePlayer({ level: 10, xp: 0 }));

// Subscribing to changes
const unsubscribe = gameStore.subscribe((newState) => {
  console.log('Gold changed:', newState.player.gold);
  updateUI(newState);
});
// Later: unsubscribe();
```

### Creating a Fighter
```javascript
import { Fighter } from '../entities/fighter.js';
import { TalentManager } from '../game/TalentManager.js';

// Basic fighter creation
const fighter = new Fighter({
  name: 'Warrior Bob',
  class: 'WARRIOR',
  level: 10
});

// With equipment and talents
const state = gameStore.getState();
const advancedFighter = new Fighter({
  name: state.player.name,
  class: state.player.class,
  level: state.player.level,
  equipped: state.equipped,
  talents: state.player.talents
});

// Apply talent bonuses
TalentManager.applyTalentsToFighter(advancedFighter);
```

### Achievement Tracking
```javascript
import { AchievementManager } from '../game/AchievementManager.js';
import { gameStore } from '../store/gameStore.js';
import { incrementStat } from '../store/actions.js';

// After a victory
function handleVictory() {
  gameStore.dispatch(incrementStat('totalWins'));
  
  // Check achievements
  const state = gameStore.getState();
  if (state.stats.totalWins === 10) {
    AchievementManager.unlockAchievement('first_10_wins');
  }
  if (state.stats.winStreak === 5) {
    AchievementManager.unlockAchievement('win_streak_5');
  }
}

// Check if achievement unlocked
if (AchievementManager.isUnlocked('first_legendary')) {
  console.log('Player has legendary equipment!');
}
```

### Marketplace Transactions
```javascript
import { MarketplaceManager } from '../game/MarketplaceManager.js';
import { EconomyManager } from '../game/EconomyManager.js';

// Buy item
async function buyItem(itemId) {
  const equipment = getEquipmentById(itemId);
  const price = MarketplaceManager.getItemPrice(equipment);
  
  const state = gameStore.getState();
  if (state.player.gold < price) {
    showError('Not enough gold!');
    return false;
  }
  
  const success = await MarketplaceManager.buyItem(itemId);
  if (success) {
    // Stats tracked automatically via incrementStat in MarketplaceManager
    showSuccess(`Purchased ${equipment.name}!`);
  }
  return success;
}

// Sell item
const sellPrice = MarketplaceManager.getSellPrice(equipment);
MarketplaceManager.sellItem(itemId); // Auto-adds gold, tracks stats
```

### Grid Combat Operations
```javascript
import { gridManager } from '../game/GridManager.js';
import { gridCombatIntegration } from '../game/GridCombatIntegration.js';

// Initialize battle
gridCombatIntegration.initializeBattle(player, enemy, 'MOUNTAIN_PASS');

// Get valid moves
const validMoves = gridManager.getValidMoves(player, 2);
// Returns: [{x: 0, y: 3}, {x: 1, y: 3}, ...]

// Move fighter
const moved = gridCombatIntegration.moveFighter(player.id, 2, 3);
if (moved) {
  // Apply terrain effects automatically
  const effects = gridCombatIntegration.applyTerrainEffects(player.id);
  effects.forEach(effect => console.log(effect));
}

// Check attack range
const inRange = gridManager.isInAttackRange(player, enemy);
if (inRange) {
  const result = gridCombatIntegration.executeAttack(player, enemy.x, enemy.y);
  console.log(`Damage: ${result.damage}, Flanking: ${result.flanking}`);
}
```

### AI System Integration
```javascript
import { AIManager } from '../ai/AIManager.js';

// Create AI for enemy
const aiManager = new AIManager(enemyFighter, 'hard');

// Get AI decision during combat
const action = aiManager.chooseAction(playerFighter);
// Returns: { type: 'attack' } or { type: 'skill', skillIndex: 0 } or { type: 'defend' }

// Record combat events for learning
aiManager.recordEvent({ type: 'damage_dealt', amount: 50 });
aiManager.recordEvent({ type: 'action_success', action: 'skill' });

// AI uses behavior trees with personality archetypes:
// - Aggressive: High offense, low defense
// - Defensive: High defense, prefers healing
// - Balanced: Tactical decision-making
// - Reckless: High risk, high reward
```

### Talent System
```javascript
import { TalentManager } from '../game/TalentManager.js';

// Learn talent
const learned = TalentManager.learnTalent('tree1', 'war_arms_dmg_1');
if (learned) {
  // Talent learned, state updated automatically
  console.log('Learned Weapon Mastery rank 1');
}

// Check if can learn
const canLearn = TalentManager.canLearnTalent('tree1', 'war_arms_execute');
if (!canLearn.valid) {
  console.log(`Cannot learn: ${canLearn.reason}`);
}

// Get active talents
const effects = TalentManager.getActiveTalentEffects();
// Returns: { stats: { strength: 10, health: 50 }, passives: [...] }

// Reset all talents
const cost = TalentManager.calculateRespecCost();
TalentManager.resetAllTalents(cost);
```

### Status Effects
```javascript
import { statusEffectManager } from '../game/StatusEffectSystem.js';

// Apply status effect
statusEffectManager.applyEffect(fighter, 'BURN', { damage: 10, duration: 3 });
statusEffectManager.applyEffect(fighter, 'POISON', { damage: 5, duration: 4 });

// Process effects at turn start
statusEffectManager.processEffects(fighter);

// Check for specific effect
if (statusEffectManager.hasEffect(fighter, 'frozen')) {
  // Reduce movement speed
  movementSpeed -= 1;
}

// Effects interact: Fire vs Ice cancels, Poison vs Regen partially cancels
// See StatusEffectSystem.js for full interaction matrix
```

## Specific System Details

### Achievement System
- **Location**: `src/game/AchievementManager.js`, data in `src/data/achievements.js`
- **25 achievements**: Combat, story, marketplace, collection, misc
- **Auto-checking**: Check conditions after relevant events (victories, purchases, etc.)
- **Rewards**: XP (100-500) and gold (50-500) awarded automatically
- **State**: Stored in `gameStore.state.unlocks.achievements` array

### Marketplace System
- **Location**: `src/game/MarketplaceManager.js`
- **Rotating inventory**: 10 random items, refreshes every 24 hours
- **Force refresh**: 100 gold cost, resets inventory immediately
- **Pricing**: Based on rarity (common: 50-150g, legendary: 1500-3000g)
- **Sell price**: Always 50% of purchase price
- **Repair costs**: Based on item rarity and missing durability
- **Stats tracking**: All transactions auto-tracked via `incrementStat()`

### AI System
- **Location**: `src/ai/AIManager.js`, behaviors in `src/ai/CombatBehaviors.js`
- **Behavior trees**: Composite pattern for decision-making (Sequence, Selector, Condition, Action)
- **Personalities**: 4 archetypes (Aggressive, Defensive, Balanced, Reckless) with class-specific traits
- **Difficulty scaling**: Easy/Normal/Hard/Nightmare affects aggression, skill usage, and decision quality
- **Learning**: Records combat events to adjust future decisions
- **Integration**: Create one `AIManager` per enemy fighter, call `chooseAction()` each turn

### Talent System (v4.11)
- **Location**: `src/game/TalentManager.js`, data in `src/data/talents.js`
- **Trees**: 3 specialization trees per class (WARRIOR: Arms/Fury/Protection, MAGE: Fire/Frost/Arcane)
- **40+ talents**: Stat modifiers (+STR, +HP, +DEF) and passive abilities (Execute, Bleed, Block, Ignite)
- **Dependencies**: Talents require prerequisites and minimum points in tree (Row 1: 5pts, Row 2: 10pts, etc.)
- **Points**: 1 point per level starting at level 2 (max 19 points at level 20)
- **Respec**: Cost = 50 gold × points spent, refunds all points
- **Application**: Call `TalentManager.applyTalentsToFighter(fighter)` after creation

---

When in doubt, check the comprehensive guides in `/guides` and `/docs` for detailed system documentation.
