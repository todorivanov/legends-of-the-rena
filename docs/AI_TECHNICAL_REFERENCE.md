# Legends of the Arena - Technical Implementation Reference

> **Purpose**: Detailed technical reference for AI models to understand code patterns, data flows, and implementation specifics for development planning.
>
> **Companion to**: `AI_DEVELOPMENT_PLAN_CONTEXT.md`

---

## 1. CODE PATTERNS & CONVENTIONS

### 1.1 File Organization

**Naming Conventions:**
- **Classes**: PascalCase (`FighterCard.js`, `GridManager.js`)
- **Functions/Variables**: camelCase (`calculateDamage`, `playerStats`)
- **Constants**: UPPER_SNAKE_CASE (`BASE_HP`, `MAX_LEVEL`)
- **CSS Classes**: kebab-case in HTML, camelCase in JS references
- **Component Tags**: kebab-case (`<fighter-card>`, `<combat-arena>`)

**Import Style:**
```javascript
// ES6 module imports
import { Fighter } from '../entities/fighter.js';
import { gameStore } from '../store/gameStore.js';
import { incrementStat, addGold } from '../store/actions.js';

// Named exports preferred
export { GridManager, GridCell };
export const TERRAIN_TYPES = { ... };
```

### 1.2 Web Component Pattern

Every UI component follows this structure:

```javascript
import { BaseComponent } from './BaseComponent.js';

export class MyComponent extends BaseComponent {
  constructor() {
    super();
    // Initialize component state
    this.setState({
      data: null,
      loading: false
    });
  }

  // CSS styles (scoped to shadow DOM)
  styles() {
    return `
      :host {
        display: block;
        /* Use CSS variables for theming */
        color: var(--text-color);
        background: var(--bg-color);
      }
      .container { padding: 20px; }
    `;
  }

  // HTML template
  template() {
    return `
      <div class="container">
        <h1>${this.state.data?.title || 'Loading...'}</h1>
        <button id="actionBtn">Click Me</button>
      </div>
    `;
  }

  // Event bindings
  attachEventListeners() {
    const btn = this.shadowRoot.querySelector('#actionBtn');
    btn?.addEventListener('click', () => this.handleAction());
  }

  // Custom methods
  handleAction() {
    this.emit('action-performed', { timestamp: Date.now() });
  }

  // Lifecycle - called when added to DOM
  connectedCallback() {
    this.render();  // BaseComponent.render() called automatically
    this.loadData();
  }
}

// Register custom element
customElements.define('my-component', MyComponent);
```

### 1.3 State Management Pattern

**Action Definition (`actions.js`):**
```javascript
export const ActionTypes = {
  ADD_GOLD: 'ADD_GOLD',
  INCREMENT_STAT: 'INCREMENT_STAT',
  // ...
};

export const addGold = (amount) => ({
  type: ActionTypes.ADD_GOLD,
  payload: { amount }
});
```

**Reducer Pattern (`reducers.js`):**
```javascript
export const playerReducers = {
  [ActionTypes.ADD_GOLD]: (state, { amount }) => ({
    player: {
      ...state.player,
      gold: state.player.gold + amount
    },
    stats: {
      ...state.stats,
      totalGoldEarned: state.stats.totalGoldEarned + amount
    }
  })
};
```

**Usage Pattern:**
```javascript
// Reading state - ALWAYS fresh read
const state = gameStore.getState();
const gold = state.player.gold;

// Modifying state - ALWAYS via dispatch
gameStore.dispatch(addGold(100));

// NEVER mutate directly
// ❌ state.player.gold = 100;  // WRONG!
```

### 1.4 Manager Singleton Pattern

Most game systems use singleton managers:

```javascript
// Manager class definition
class EquipmentManager {
  // Static methods operate on gameStore
  static addToInventory(itemId) {
    const state = gameStore.getState();
    if (state.inventory.equipment.length >= MAX_INVENTORY) {
      return false;
    }
    gameStore.dispatch(addItem({ item: itemId }));
    return true;
  }

  static equipItem(itemId, slot) {
    // Read equipment data
    const equipment = getEquipmentById(itemId);
    if (!equipment) return false;

    // Check requirements
    const state = gameStore.getState();
    if (equipment.requirements?.level > state.player.level) {
      return false;
    }

    // Dispatch action
    gameStore.dispatch(equipItemAction(itemId, slot));
    return true;
  }
}

export { EquipmentManager };
```

---

## 2. DATA FLOW DIAGRAMS

### 2.1 Combat Flow

```
┌─────────────────┐
│   startCombat   │
│   (game.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Fighters │  ← Fighter entity from player state + enemy data
│ Apply Equipment │  ← Stats modified by equipped items
│ Apply Talents   │  ← TalentManager.applyTalentsToFighter()
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│              COMBAT LOOP                     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 1. Turn Start                        │   │
│  │    - Process status effects          │   │
│  │    - Reduce cooldowns                │   │
│  │    - Check victory conditions        │   │
│  └──────────────┬──────────────────────┘   │
│                 │                          │
│                 ▼                          │
│  ┌─────────────────────────────────────┐   │
│  │ 2. Action Selection                  │   │
│  │    Player: UI buttons               │   │
│  │    AI: AIManager.chooseAction()      │   │
│  └──────────────┬──────────────────────┘   │
│                 │                          │
│                 ▼                          │
│  ┌─────────────────────────────────────┐   │
│  │ 3. Action Execution                  │   │
│  │    - Calculate damage                │   │
│  │    - Apply effects                   │   │
│  │    - Check combos                    │   │
│  │    - Update fighter state            │   │
│  └──────────────┬──────────────────────┘   │
│                 │                          │
│                 ▼                          │
│  ┌─────────────────────────────────────┐   │
│  │ 4. Turn End                          │   │
│  │    - Track stats                     │   │
│  │    - Switch active fighter           │   │
│  │    - Loop back to Turn Start         │   │
│  └─────────────────────────────────────┘   │
│                                             │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│             COMBAT END                       │
│  - Calculate rewards (XP, gold, drops)      │
│  - Update stats (incrementStat actions)     │
│  - Process achievements                     │
│  - Degrade equipment durability             │
│  - Show victory/defeat screen               │
└─────────────────────────────────────────────┘
```

### 2.2 Damage Calculation Flow

```
┌────────────────────────┐
│    Base Attack Value    │
│ strength * multiplier   │
│ + random variance       │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Equipment Modifiers   │
│ + equipped.weapon.str   │
│ + equipped.accessory    │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Talent Modifiers     │
│ + talent stat bonuses   │
│ × talent passives       │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Critical Check       │
│ if random < critChance  │
│   damage *= critDamage  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Terrain Modifiers     │
│ × attacker terrain atk  │
│ × (1 - defender def×0.5)│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Flanking Check       │
│ if flanked: damage *= 1.25│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Status Effect Mods    │
│ + STRENGTH_BOOST        │
│ × VULNERABLE (1.25)     │
│ × BLESS (1.2)           │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Combo Multiplier     │
│ × combo.damageMultiplier│
│ + combo.extraDamage     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    Execute Passive      │
│ if target HP < 20%:     │
│   damage *= 1.5         │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Defense Reduction     │
│ - defender.defense      │
│ (minimum 1 damage)      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     Final Damage        │
│   Apply to target HP    │
└────────────────────────┘
```

### 2.3 State Persistence Flow

```
┌─────────────┐
│  gameStore  │  ◄── Single source of truth
└──────┬──────┘
       │
       │ Auto-save (30 seconds)
       │ or beforeunload event
       ▼
┌─────────────────────┐
│  saveGameState()    │
│  (gameStore.js)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   SaveManagerV2     │
│   .save(saveData)   │
└──────────┬──────────┘
           │
           ├─── Create backup (max 5)
           │
           ├─── Serialize JSON
           │
           ├─── Compress with LZ-String
           │
           ▼
┌─────────────────────┐
│    localStorage     │
│  fighters_save_X    │  (X = slot 1-3)
│  fighters_backup_X  │  (per slot)
└─────────────────────┘

Loading:
┌─────────────────────┐
│    localStorage     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   SaveManagerV2     │
│   .load()           │
├─────────────────────┤
│ - Decompress        │
│ - Validate schema   │
│ - Migrate version   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  getInitialState()  │
│  (gameStore.js)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     gameStore       │
│   initialized       │
└─────────────────────┘
```

---

## 3. KEY ALGORITHMS

### 3.1 Grid Pathfinding (BFS)

```javascript
// GridManager.getValidMoves(fighter, range)
getValidMoves(fighterId, range) {
  const fighter = this.getFighter(fighterId);
  const startX = fighter.gridX;
  const startY = fighter.gridY;
  
  const validMoves = [];
  const visited = new Set();
  const queue = [{ x: startX, y: startY, cost: 0 }];
  
  while (queue.length > 0) {
    const { x, y, cost } = queue.shift();
    const key = `${x},${y}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    // Add to valid moves if within range and passable
    if (cost > 0 && cost <= range) {
      const cell = this.getCell(x, y);
      if (cell && cell.isPassable() && !cell.occupant) {
        validMoves.push({ x, y, cost });
      }
    }
    
    // Explore neighbors
    const neighbors = [
      { x: x-1, y }, { x: x+1, y },
      { x, y: y-1 }, { x, y: y+1 }
    ];
    
    for (const neighbor of neighbors) {
      const cell = this.getCell(neighbor.x, neighbor.y);
      if (cell && cell.isPassable()) {
        const newCost = cost + cell.movementCost;
        if (newCost <= range) {
          queue.push({ ...neighbor, cost: newCost });
        }
      }
    }
  }
  
  return validMoves;
}
```

### 3.2 Line of Sight (Bresenham)

```javascript
// GridManager.hasLineOfSight(x1, y1, x2, y2)
hasLineOfSight(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  
  let x = x1, y = y1;
  
  while (x !== x2 || y !== y2) {
    // Check if current cell blocks LOS
    if (x !== x1 || y !== y1) {  // Skip starting cell
      const cell = this.getCell(x, y);
      if (cell && cell.blocksLineOfSight()) {
        return false;
      }
    }
    
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
  }
  
  return true;
}
```

### 3.3 AI Decision Making

```javascript
// AIManager.chooseAction()
chooseAction(opponent) {
  const context = {
    fighter: this.fighter,
    opponent: opponent,
    personality: this.personality,
    chosenAction: null
  };
  
  // Execute behavior tree
  const status = this.behaviorTree.execute(context);
  
  // Apply difficulty-based mistakes
  const mistakeChance = DifficultyManager.getAIMistakeChance();
  if (Math.random() < mistakeChance) {
    // Make suboptimal choice
    return this.makeRandomAction();
  }
  
  return context.chosenAction || { type: 'attack' };
}

// Behavior tree structure
buildBehaviorTree() {
  return new Selector([
    // Priority 1: Use healing if critical health
    new Sequence([
      new Condition((ctx) => ctx.fighter.healthPercent < 0.2),
      new Condition((ctx) => ctx.fighter.hasHealingItems()),
      new Action((ctx) => ctx.chosenAction = { type: 'item', itemType: 'heal' })
    ]),
    
    // Priority 2: Use skill if available and advantageous
    new Sequence([
      new Condition((ctx) => ctx.fighter.canUseSkill()),
      new Condition((ctx) => this.shouldUseSkill(ctx)),
      new Action((ctx) => ctx.chosenAction = { type: 'skill', skillIndex: 0 })
    ]),
    
    // Priority 3: Defend if low health and cautious
    new Sequence([
      new Condition((ctx) => ctx.fighter.healthPercent < 0.4),
      new Condition((ctx) => ctx.personality.caution > 60),
      new Action((ctx) => ctx.chosenAction = { type: 'defend' })
    ]),
    
    // Default: Attack
    new Action((ctx) => ctx.chosenAction = { type: 'attack' })
  ]);
}
```

### 3.4 Combo Detection

```javascript
// ComboSystem.checkForCombo(fighter, action)
checkForCombo(fighter, action) {
  // Add action to history (max 5)
  fighter.actionHistory.push(action);
  if (fighter.actionHistory.length > 5) {
    fighter.actionHistory.shift();
  }
  
  // Get available combos for this class
  const availableCombos = getCombosForClass(fighter.class);
  
  for (const combo of availableCombos) {
    if (this.matchesSequence(fighter.actionHistory, combo.sequence)) {
      return combo;
    }
  }
  
  return null;
}

matchesSequence(history, sequence) {
  if (history.length < sequence.length) return false;
  
  const recentActions = history.slice(-sequence.length);
  
  for (let i = 0; i < sequence.length; i++) {
    const action = recentActions[i];
    const required = sequence[i];
    
    if (action.type !== required.type) return false;
    if (required.skill && action.skillName !== required.skill) return false;
  }
  
  return true;
}
```

### 3.5 Equipment Stat Calculation

```javascript
// Fighter.calculateEquipmentStats()
calculateEquipmentStats() {
  const state = gameStore.getState();
  const equipped = state.equipped;
  const durability = state.equipmentDurability;
  
  let bonusStats = {
    strength: 0,
    health: 0,
    defense: 0,
    critChance: 0,
    critDamage: 0,
    manaRegen: 0,
    movementBonus: 0
  };
  
  for (const [slot, itemId] of Object.entries(equipped)) {
    if (!itemId) continue;
    
    const item = getEquipmentById(itemId);
    if (!item) continue;
    
    // Get durability effectiveness
    const itemDurability = durability[itemId] ?? 100;
    const effectiveness = DurabilityManager.getEffectiveness(itemDurability);
    
    // Apply stats with durability modifier
    for (const [stat, value] of Object.entries(item.stats)) {
      bonusStats[stat] += Math.floor(value * effectiveness);
    }
  }
  
  return bonusStats;
}
```

---

## 4. EVENT SYSTEM

### 4.1 Component Events (Custom Events)

```javascript
// Emitting events from components
this.emit('action-selected', {
  actionType: 'attack',
  target: enemyId
});

// Listening in parent or game logic
document.querySelector('action-selection')
  .addEventListener('action-selected', (e) => {
    const { actionType, target } = e.detail;
    game.executeAction(actionType, target);
  });
```

### 4.2 Store Subscriptions

```javascript
// Subscribe to all changes
const unsubscribe = gameStore.subscribe((state) => {
  updateGoldDisplay(state.player.gold);
});

// Subscribe with selector (only fires when selected value changes)
gameStore.subscribe(
  (state) => updateHealthBar(state.player.health),
  (state) => state.player.health  // Selector
);
```

### 4.3 Combat Events

```javascript
// CombatPhaseManager events
const COMBAT_EVENTS = {
  BATTLE_STARTED: 'combat:battle_started',
  TURN_STARTED: 'combat:turn_started',
  ACTION_EXECUTED: 'combat:action_executed',
  DAMAGE_DEALT: 'combat:damage_dealt',
  FIGHTER_DEFEATED: 'combat:fighter_defeated',
  BATTLE_ENDED: 'combat:battle_ended'
};

// Registering hooks
phaseManager.registerHook(CombatPhases.TURN_START, (context) => {
  // Process status effects
  StatusEffectSystem.processEffects(context.activeFighter);
});
```

---

## 5. TESTING PATTERNS

### 5.1 Unit Test Structure

```javascript
// tests/unit/Fighter.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Fighter } from '../../src/entities/fighter.js';

describe('Fighter', () => {
  let fighter;
  
  beforeEach(() => {
    fighter = new Fighter({
      name: 'Test Fighter',
      class: 'WARRIOR',
      level: 5
    });
  });
  
  describe('constructor', () => {
    it('should create fighter with class stats', () => {
      expect(fighter.name).toBe('Test Fighter');
      expect(fighter.class).toBe('WARRIOR');
      expect(fighter.strength).toBeGreaterThan(10);  // WARRIOR has 1.3x
    });
  });
  
  describe('takeDamage', () => {
    it('should reduce health by damage amount', () => {
      const initialHealth = fighter.health;
      fighter.takeDamage(50);
      expect(fighter.health).toBe(initialHealth - 50);
    });
    
    it('should not go below 0', () => {
      fighter.takeDamage(9999);
      expect(fighter.health).toBe(0);
    });
  });
});
```

### 5.2 Mocking Patterns

```javascript
// Mocking gameStore
vi.mock('../../src/store/gameStore.js', () => ({
  gameStore: {
    getState: vi.fn(() => ({
      player: { gold: 100, level: 5 },
      inventory: { equipment: [] }
    })),
    dispatch: vi.fn()
  }
}));

// Mocking localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
global.localStorage = localStorageMock;
```

### 5.3 E2E Test Pattern

```javascript
// tests/e2e/gameFlow.spec.js
import { test, expect } from '@playwright/test';

test('complete game flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Character creation
  await page.fill('#nameInput', 'TestHero');
  await page.click('.class-card:has-text("Warrior")');
  await page.click('#createBtn');
  
  // Verify navigation to title screen
  await expect(page.locator('title-screen')).toBeVisible();
  
  // Start combat
  await page.click('button:has-text("Single Combat")');
  await page.click('.opponent-card:first-child');
  await page.click('#fightBtn');
  
  // Combat actions
  await page.click('button:has-text("Attack")');
  // ... continue test
});
```

---

## 6. CONFIGURATION REFERENCE

### 6.1 Game Configuration (`gameConfig.js`)

```javascript
export const GameConfig = {
  // Combat Settings
  combat: {
    roundInterval: 1500,
    normalAttackChance: 80,
    missChance: 10,
    normalAttackMultiplier: 0.4,
    specialAttackMultiplier: 0.8,
    normalAttackRandomMin: 0,
    normalAttackRandomMax: 40,
    specialAttackRandomMin: 20,
    specialAttackRandomMax: 80,
    criticalHitChance: 15,
    criticalHitMultiplier: 1.5
  },
  
  // Fighter Classes
  fighterClasses: {
    BALANCED: { healthMod: 1.0, strengthMod: 1.0 },
    GLASS_CANNON: { healthMod: 0.75, strengthMod: 2.0 },
    TANK: { healthMod: 1.5, strengthMod: 0.6 },
    // ...
  },
  
  // Economy
  economy: {
    startingGold: 100,
    baseBattleReward: 30,
    difficultyMultipliers: {
      easy: 0.8,
      normal: 1.0,
      hard: 1.3,
      nightmare: 1.5
    }
  },
  
  // Equipment
  equipment: {
    maxInventory: 20,
    maxDurability: 100,
    durabilityLossPerBattle: { min: 5, max: 10 },
    repairCostPerPoint: 2,
    brokenThreshold: 0
  },
  
  // Marketplace
  marketplace: {
    refreshInterval: 86400000,  // 24 hours
    forceRefreshCost: 100,
    minItems: 6,
    maxItems: 8
  },
  
  // Leveling
  leveling: {
    maxLevel: 20,
    baseXP: 100,
    xpScaling: 1.5,  // XP = baseXP * (1.5 ^ level)
    hpPerLevel: 10,
    strengthPerLevel: 2,
    defensePerLevel: 1
  }
};
```

### 6.2 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### 6.3 ESLint Configuration

```javascript
// eslint.config.js
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
];
```

---

## 7. EXTENSION POINTS

### 7.1 Adding a New Character Class

1. **Define class in `classes.js`:**
```javascript
RANGER: {
  id: 'RANGER',
  name: 'Ranger',
  icon: '🏹',
  stats: {
    healthMod: 0.9,
    strengthMod: 1.1,
    defenseMod: 0.9,
    manaRegen: 6,
    critChance: 0.18,
    critDamage: 1.6,
    attackRange: 2  // Ranged class
  },
  passive: {
    name: 'Hunter\'s Mark',
    description: 'First hit marks target for +10% damage'
  }
}
```

2. **Add skills in `SkillSystem.js`:**
```javascript
RANGER: [
  new Skill('Quick Shot', 'damage', 10, 1, 1.2, null, 2),
  new Skill('Trap', 'debuff', 15, 3, 0, 'SLOW', 1),
  new Skill('Volley', 'damage', 25, 4, 1.5, null, 2)
]
```

3. **Add talent tree in `talents.js`**
4. **Add AI personality in `AIPersonality.js`**
5. **Update tests**

### 7.2 Adding a New Equipment Type

1. **Define in `equipment.js`:**
```javascript
ranger_bow: {
  id: 'ranger_bow',
  name: 'Longbow',
  type: 'weapon',
  rarity: 'rare',
  stats: { strength: 12, critChance: 5 },
  requirements: { level: 5, class: ['RANGER'] },
  durability: { max: 100, degradationRate: 6, repairCostBase: 20 },
  description: 'A finely crafted longbow.',
  icon: '🏹'
}
```

2. **Marketplace will auto-include based on player level**
3. **Equipment manager handles stat application automatically**

### 7.3 Adding a New Status Effect

1. **Define in `StatusEffectSystem.js`:**
```javascript
MARKED: {
  name: 'Marked',
  icon: '🎯',
  type: EffectCategory.DEBUFF,
  duration: 3,
  stackable: false,
  tags: ['tracking', 'damage_amp'],
  onApply: (target) => { target.isMarked = true; },
  onRemove: (target) => { target.isMarked = false; },
  effect: { damageAmplification: 0.1 }
}
```

2. **Add interaction if needed:**
```javascript
{ effect1: 'MARKED', effect2: 'STEALTH', interaction: 'cancel' }
```

### 7.4 Adding a New Story Path

1. **Create mission file `src/data/new_path_missions.js`**
2. **Define path in `storyPaths.js`**
3. **Add path mechanics to state structure**
4. **Create reducers for path-specific actions**
5. **Update `StoryMode.js` PATH_MISSIONS mapping**

---

## 8. COMMON GOTCHAS

### 8.1 State Mutation

```javascript
// ❌ WRONG - Direct mutation
const state = gameStore.getState();
state.player.gold += 100;

// ✅ CORRECT - Dispatch action
gameStore.dispatch(addGold(100));
```

### 8.2 Shadow DOM Queries

```javascript
// ❌ WRONG - Document query won't find shadow DOM elements
document.querySelector('#myButton');

// ✅ CORRECT - Query through component's shadowRoot
this.shadowRoot.querySelector('#myButton');
```

### 8.3 Component Lifecycle

```javascript
// ❌ WRONG - Don't call render() in constructor
constructor() {
  super();
  this.render();  // Too early, not attached to DOM yet
}

// ✅ CORRECT - Render in connectedCallback
connectedCallback() {
  this.render();
  this.loadData();
}
```

### 8.4 Async State Access

```javascript
// ❌ WRONG - State might be stale
const gold = gameStore.getState().player.gold;
// ... async operation ...
console.log(gold);  // Might not reflect current value

// ✅ CORRECT - Re-read state when needed
// ... async operation ...
const currentGold = gameStore.getState().player.gold;
```

### 8.5 Grid Coordinates

```javascript
// Grid is 9x9, (0,0) is TOP-LEFT
// Player spawns BOTTOM (rows 6-8)
// Enemy spawns TOP (rows 0-2)

// ❌ WRONG - Assuming (0,0) is bottom-left
// ✅ CORRECT - (0,0) is top-left, y increases downward
```

---

## 9. DEBUGGING TIPS

### 9.1 Global Access Points

```javascript
// In browser console:
window.__GAME_STORE__             // Access gameStore
window.__GAME_STORE__.getState()  // View current state

// Game instance (if exposed)
window.__GAME__                   // Access game instance
```

### 9.2 State Logging

```javascript
// In dev mode, all actions are logged with:
// - Action type
// - Payload
// - State before
// - State after
```

### 9.3 Component Inspection

```javascript
// In browser DevTools Elements panel:
// 1. Select custom element
// 2. In Console: $0.shadowRoot  // Access shadow DOM
// 3. $0.state  // Access component state
```

---

*This technical reference is designed for AI consumption to understand implementation details for development planning. Always verify against actual source code for the most current implementations.*
