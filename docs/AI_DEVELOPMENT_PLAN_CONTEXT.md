# Legends of the Arena - AI Development Planning Context Document

> **Purpose**: This document provides comprehensive context about the "Legends of the Arena" (ObjectFighterJS) codebase for AI models to understand the project architecture, systems, and create development plans.
>
> **Version**: 5.0.0 | **Last Updated**: January 2026

---

## 1. PROJECT OVERVIEW

### 1.1 What Is This Project?
**Legends of the Arena** is a browser-based RPG fighting game built entirely with vanilla JavaScript and Web Components (zero frameworks). It features turn-based tactical combat, story campaigns, character progression with talent trees, equipment systems, and a marketplace economy.

### 1.2 Technology Stack
| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Native Web Components | All 34+ UI components extend `BaseComponent` |
| Build | Vite 5 | ES modules, fast HMR |
| Testing | Vitest + Playwright | Unit/Integration/E2E |
| Styling | CSS3 + Bootstrap 5.3.8 | Modern CSS features |
| State | Custom Redux-like Store | `gameStore` with actions/reducers |
| Storage | localStorage + LZ-String | Compressed save data |
| Audio | Web Audio API | Custom SoundManager |

### 1.3 Dependencies (Minimal!)
```json
{
  "dependencies": {
    "bootstrap": "5.3.8",    // UI framework
    "lz-string": "1.5.0"     // Save data compression
  }
}
```

---

## 2. ARCHITECTURE OVERVIEW

### 2.1 Directory Structure
```
src/
├── ai/              # AI system (BehaviorTree, Personality, CombatBehaviors)
├── api/             # Mock data APIs for fighter generation
├── components/      # 34+ Web Components (UI layer)
├── config/          # Route definitions, game configuration
├── data/            # Static game data (classes, equipment, talents, missions)
├── entities/        # Core entities (Fighter, BaseEntity, Referee, Team)
├── game/            # 26+ game systems (combat, grid, economy, etc.)
├── screens/         # Legacy screen components
├── store/           # State management (Store, actions, reducers, gameStore)
├── styles/          # SCSS theme files
└── utils/           # Utilities (Router, SaveManager, Logger, Sound)

docs/                # Technical documentation
guides/              # User-facing guides (24 markdown files)
tests/               # Test suites (unit, integration, e2e)
```

### 2.2 Core Architectural Patterns

#### Web Components Pattern
All UI components extend `BaseComponent`:
```javascript
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = {};
  }
  
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this.render();  // Auto re-render on state change
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      ${this.template()}
    `;
    this.attachEventListeners();
  }
  
  emit(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail, bubbles: true, composed: true
    }));
  }
}
```

#### State Management (Redux-like)
Single source of truth via `gameStore`:
```javascript
// Reading state
const state = gameStore.getState();
const gold = state.player.gold;

// Modifying state via actions
gameStore.dispatch(addGold(100));
gameStore.dispatch(incrementStat('totalWins'));

// Subscribing to changes
gameStore.subscribe((state) => updateUI(state));
```

**State Structure:**
```javascript
{
  player: { name, class, level, xp, gold, talents, storyPath, pathSelected },
  combat: { active, fighter1, fighter2, round, currentTurn, winner },
  gameMode: 'single' | 'tournament' | 'story',
  tournament: { active, opponents, currentRound, roundsWon },
  story: { currentMission, completedMissions, unlockedRegions, pathProgress },
  inventory: { equipment: [], consumables: {} },
  equipped: { weapon, head, torso, arms, trousers, shoes, coat, accessory },
  equipmentDurability: {},
  stats: { totalWins, totalLosses, winStreak, bestStreak, criticalHits, ... },
  settings: { difficulty, soundEnabled, darkMode, ... },
  unlocks: { achievements: [] },
  ui: { loading, error, notification }
}
```

#### Routing System
Client-side routing with route guards:
```javascript
router.register('/profile', handlers.showProfileScreen, {
  guard: 'characterCreated',
  title: 'Profile - Legends of the Arena'
});

router.navigate('/combat', { opponent: selectedFighter });
```

---

## 3. GAME SYSTEMS BREAKDOWN

### 3.1 Combat System (CORE)

#### Combat Engine (`CombatEngine.js`)
Pure functions for damage calculations:
- `calculateDamage(attacker, defender, actionType)` - Core damage formula
- `calculateCritical(attacker)` - 15% base crit chance, 1.5x damage
- `calculateDefenseReduction(damage, defender)` - Flat defense reduction

#### Base Attack Mechanics (`baseEntity.js`)
```javascript
hit() {
  return Math.random() < 0.8 ? this.normalAttack() : this.specialAttack();
}

normalAttack() {
  if (Math.random() < 0.1) return { missed: true };  // 10% miss
  let damage = Math.floor(this.strength * 0.4 + Math.random() * 40);
  if (Math.random() < 0.15) damage = Math.floor(damage * 1.5);  // 15% crit
  return { damage, isCritical };
}

specialAttack() {
  return { damage: Math.floor(this.strength * 0.8 + 20 + Math.random() * 60) };
}
```

#### Combat Configuration (`gameConfig.js`)
```javascript
combat: {
  roundInterval: 1500,           // ms between rounds
  normalAttackChance: 80,        // % for normal vs special
  missChance: 10,                // % miss rate
  normalAttackMultiplier: 0.4,   // damage = strength * 0.4 + random
  specialAttackMultiplier: 0.8,
  normalAttackRandomMin: 0,
  normalAttackRandomMax: 40,
  specialAttackRandomMin: 20,
  specialAttackRandomMax: 80
}
```

### 3.2 Tactical Grid System (`GridManager.js`)

**Grid Specifications:**
- **Size**: 9x9 grid (81 cells)
- **Pathfinding**: BFS algorithm with terrain costs
- **Line of Sight**: Bresenham's algorithm

**10 Terrain Types:**
| Terrain | Move Cost | Defense | Attack | Notes |
|---------|-----------|---------|--------|-------|
| Normal | 1 | 0% | 0% | Standard |
| Grassland | 1 | 0% | 0% | Open field |
| Forest | 2 | +15% | -10% | Blocks LOS |
| Rock | 1 | +10% | +5% | Stable footing |
| Water | 3 | -10% | -15% | Very slow |
| Mud | 2 | -5% | -10% | Slippery |
| High Ground | 1 | +20% | +25% | **Best position!** |
| Low Ground | 1 | -15% | -10% | Disadvantage |
| Wall | ∞ | - | - | Impassable, blocks LOS |
| Pit | ∞ | - | - | Impassable |

**Spawn Zones:**
- Player: Bottom 3 rows (y=6,7,8)
- Enemy: Top 3 rows (y=0,1,2)

**Movement System:**
- Base range: 2 cells
- Class modifiers: Assassin +1, Tank -1
- Movement is a SKILL with mana cost (10-15) and cooldown

### 3.3 Character System

#### 10 Character Classes (`classes.js`)
| Class | HP Mod | STR Mod | DEF Mod | Crit % | Specialty |
|-------|--------|---------|---------|--------|-----------|
| BALANCED | 1.0x | 1.0x | 1.0x | 15% | Versatile |
| WARRIOR | 0.9x | 1.3x | 0.95x | 20% | High damage |
| TANK | 1.5x | 0.6x | 1.5x | 10% | High HP/Defense |
| GLASS_CANNON | 0.75x | 2.0x | 0.7x | 25% | Extreme damage |
| BRUISER | 1.25x | 0.9x | 1.1x | 12% | Sustain fighter |
| MAGE | 0.85x | 0.8x | 0.9x | 10% | Ranged (3 cells) |
| ASSASSIN | 0.8x | 1.2x | 0.85x | 30% | Highest crit |
| BERSERKER | 1.1x | 1.15x | 0.8x | 18% | Rage mechanic |
| PALADIN | 1.2x | 1.05x | 1.15x | 15% | Healing |
| NECROMANCER | 0.9x | 0.85x | 0.95x | 12% | Life drain |

#### Fighter Entity (`fighter.js`)
```javascript
class Fighter extends BaseEntity {
  constructor({ name, class: fighterClass, level = 1, equipped = {} }) {
    // Stats calculated from class modifiers
    this.health = BASE_HP * classData.stats.healthMod;
    this.strength = BASE_STR * classData.stats.strengthMod;
    this.mana = 100;
    this.skills = [];  // Assigned by SkillSystem
    this.statusEffects = [];
    this.talents = {};  // From TalentManager
  }
}
```

### 3.4 Skill System (`SkillSystem.js`)

**Skill Structure:**
```javascript
class Skill {
  constructor(name, type, manaCost, cooldown, power, statusEffect, range) {
    this.name = name;
    this.type = type;         // 'damage' | 'heal' | 'buff' | 'debuff' | 'movement'
    this.manaCost = manaCost;
    this.cooldown = cooldown;
    this.cooldownRemaining = 0;
    this.power = power;
    this.statusEffect = statusEffect;
    this.range = range;
  }
}
```

**Class Skills (3 per class):**
- **Movement Skill** - Grid repositioning
- **Offensive Skill** - Primary damage ability
- **Utility Skill** - Heal, buff, or debuff

### 3.5 Talent System (`TalentManager.js`)

**Structure:**
- 3 talent trees per class
- 40+ talents total
- 1 talent point per level (starting level 2)
- Max 19 points at level 20

**Talent Tree Example (Warrior):**
```
Arms Tree (DPS):
├── Row 0: Weapon Mastery (+2 STR per rank, 5 max)
├── Row 1: Precise Strikes (+2% crit), Deadly Precision (+10% crit dmg)
├── Row 2: Execute (+50% dmg below 20% HP), Mortal Strike (bleed)
└── Row 3: Bladestorm (+50% crit dmg, AoE chance)

Fury Tree (Burst):
├── Row 0: Building Rage (+1 STR, +1% crit per rank)
├── Row 1: Enrage (crit = temp STR), Berserker (<50% HP = +dmg)
├── Row 2: Rampage (stacking dmg), Bloodthirst (5% lifesteal on crit)
└── Row 3: Reckless Abandon (+20% dmg, +30% crit)

Protection Tree (Tank):
├── Row 0: Thick Skin (+3 DEF per rank)
├── Row 1: Toughness (+25 HP per rank)
├── Row 2: Shield Block (10% block per rank), Taunt (force aggro)
└── Row 3: Shield Wall (+50 DEF, 20% damage reflect)
```

### 3.6 Status Effect System (`StatusEffectSystem.js`)

**17 Status Effects:**
| Effect | Type | Duration | Description |
|--------|------|----------|-------------|
| STRENGTH_BOOST | BUFF | 3 turns | +15 Strength |
| DEFENSE_BOOST | BUFF | 3 turns | +15 Defense |
| REGENERATION | HOT | 4 turns | +8 HP/turn, stackable |
| POISON | DOT | 5 turns | -5 HP/turn, stackable |
| BURN | DOT | 3 turns | -12 HP/turn |
| BLEED | DOT | 4 turns | -6 HP/turn, stacks with actions |
| STUN | CC | 1 turn | Skip turn |
| FROZEN | CC | 2 turns | Speed reduction, shatter vulnerable |
| SHOCK | DOT | 3 turns | -10 HP/turn, chains |
| CURSE | DEBUFF | 3 turns | -30% healing received |
| BLESS | BUFF | 3 turns | +20% damage dealt |
| WEAKNESS | DEBUFF | 3 turns | -15% all stats |
| HASTE | BUFF | 3 turns | +Speed |
| SLOW | DEBUFF | 3 turns | -Speed |
| SHIELD | MODIFIER | 3 turns | Absorb 50 damage |
| REFLECT | MODIFIER | 2 turns | Reflect 20% damage |
| VULNERABLE | DEBUFF | 3 turns | +25% damage taken |

**Interaction Matrix (11 interactions):**
- Fire vs Ice: Burn + Frozen cancel
- Poison vs Regen: Partial cancel
- Shock + Wet: Amplified damage
- Curse vs Bless: Mutual cancel
- Haste vs Slow: Mutual cancel

### 3.7 Combo System (`ComboSystem.js`)

**Tracking:**
- Records last 5 actions
- Matches against COMBO_DEFINITIONS

**20+ Combos:**
| Combo | Sequence | Effect |
|-------|----------|--------|
| Offensive Surge | Attack → Attack | 1.3x damage, +10 |
| Berserker Rush | Attack → Attack → Attack | 1.5x damage, +25, STR boost |
| Tactical Retreat | Defend → Attack | 1.4x damage, +15 heal |
| Arcane Inferno (Mage) | Mana Surge → Fireball | 2.0x damage, +50, mana restore |
| Silent Death (Assassin) | Weaken → Shadow Strike | 2.2x damage, +60 |

### 3.8 Economy System (`EconomyManager.js`)

**Gold Sources:**
- Battle rewards (base 30, modified by difficulty)
- Tournament rewards (50/100/200 per round)
- Story mission rewards (50-600 based on difficulty + stars)
- Selling equipment (50% of purchase price)

**Gold Sinks:**
- Marketplace purchases
- Equipment repairs
- Talent respec (50g × points spent)
- Force inventory refresh (100g)

**Difficulty Multipliers:**
| Difficulty | XP | Gold | Drop Rate |
|------------|-----|------|-----------|
| Easy | 0.8x | 0.8x | 70% |
| Normal | 1.0x | 1.0x | 50% |
| Hard | 1.3x | 1.3x | 60% |
| Nightmare | 1.5x | 1.5x | 70% |

### 3.9 Equipment System (`EquipmentManager.js`)

**8 Equipment Slots:**
weapon, head, torso, arms, trousers, shoes, coat, accessory

**4 Rarity Tiers:**
| Rarity | Color | Stats | Price Range |
|--------|-------|-------|-------------|
| Common | Gray | Low | 50-150g |
| Rare | Blue | Medium | 200-500g |
| Epic | Purple | High | 600-1200g |
| Legendary | Orange | Very High | 1500-3000g |

**Equipment Stats:**
- strength, health, defense
- critChance, critDamage
- manaRegen
- movementBonus (grid combat)

**Durability System:**
- Max durability: 100
- Loss per battle: 5-10
- Effectiveness tiers: 100% (>50), 90% (25-50), 75% (<25), 0% (broken)
- Broken items auto-unequip

### 3.10 Marketplace System (`MarketplaceManager.js`)

**Features:**
- 24-hour rotating inventory
- 6-8 items based on player level
- Force refresh for 100 gold
- Rarity chances scale with level
- Buy, sell, and repair operations

**Inventory Generation:**
```javascript
// Level-based rarity chances
if (level >= 15 && Math.random() < 0.05) rarity = 'legendary';
else if (level >= 10 && Math.random() < 0.15) rarity = 'epic';
else if (level >= 5 && Math.random() < 0.30) rarity = 'rare';
else rarity = 'common';
```

### 3.11 AI System (`ai/`)

**Behavior Trees (`BehaviorTree.js`):**
- Selector (OR logic) - Try children until success
- Sequence (AND logic) - Execute all children
- Condition - Evaluate state
- Action - Perform action
- Decorators - Inverter, Repeater, UntilFail

**AI Personalities (`AIPersonality.js`):**
| Archetype | Aggression | Caution | Skill Pref | Risk |
|-----------|------------|---------|------------|------|
| AGGRESSIVE | 90 | 20 | 70 | 80 |
| DEFENSIVE | 30 | 90 | 40 | 20 |
| TACTICAL | 50 | 60 | 80 | 40 |
| BERSERKER | 100 | 10 | 50 | 100 |
| OPPORTUNIST | 60 | 50 | 70 | 90 |

**Difficulty-Based AI:**
- Easy: 25% mistake chance
- Normal: 10% mistake chance
- Hard: 5% mistake chance
- Nightmare: 0% mistakes (perfect play)

### 3.12 Story Mode System (`StoryMode.js`)

**5 Story Paths (v5.0):**
1. **Slave Gladiator** - Freedom meter mechanic (0-100)
2. **Roman Legionnaire** - Rank progression, territory control
3. **Lanista** - Gladiator school management, roster building
4. **Barbarian Traveller** - Location discovery, tribal reputation
5. **Desert Nomad** - Water management, oasis discovery

**Mission Types:**
- Standard Battle (1v1)
- Survival Mode (3 waves)
- Boss Battle (enhanced enemy)

**Star Rating (1-3):**
- 1 Star: Complete mission
- 2 Stars: Complete + 1 objective
- 3 Stars: Complete ALL objectives

**Objectives:**
- no_items, no_healing, no_defend
- rounds ≤ X, damage_dealt ≥ X, damage_taken ≤ X
- health_percent ≥ X%, crits ≥ X, combo ≥ X

### 3.13 Achievement System (`AchievementManager.js`)

**25 Achievements across 7 categories:**
- COMBAT: first_blood, warrior, veteran, legend, flawless_victory
- STRATEGIC: skill_master, combo_king, basic_warrior, purist
- SPECIAL: tournament_champion, story_complete, boss_slayer
- PROGRESSION: level_5, level_10, level_20
- ECONOMY: first_purchase, big_spender, merchant
- STORY: tutorial_complete, chapter_complete, perfect_mission

**Rewards:**
- XP: 50-500 per achievement
- Gold: Some achievements give gold bonuses

### 3.14 Tournament Mode (`TournamentMode.js`)

**Structure:**
- 3 rounds: Quarterfinal → Semifinal → Final
- 4 opponents generated based on player level
- Rewards per round: 50/100/200 gold (Normal difficulty)
- Win tournament: +1 tournamentsWon stat

---

## 4. DATA STRUCTURES

### 4.1 Fighter Object
```javascript
{
  id: 'fighter_123',
  name: 'Player',
  class: 'WARRIOR',
  level: 10,
  health: 400,
  maxHealth: 400,
  strength: 50,
  baseStrength: 40,
  defense: 15,
  mana: 100,
  maxMana: 100,
  manaRegen: 5,
  critChance: 0.2,
  critDamage: 1.75,
  attackRange: 1,
  skills: [Skill, Skill, Skill],
  statusEffects: [],
  talents: { tree1: {}, tree2: {}, tree3: {} },
  equipped: { weapon: 'iron_sword', torso: 'chainmail' },
  isDefending: false,
  itemsRemaining: 3
}
```

### 4.2 Equipment Object
```javascript
{
  id: 'flame_blade',
  name: 'Flame Blade',
  type: 'weapon',
  rarity: 'rare',
  stats: { strength: 15, critChance: 5 },
  requirements: { level: 6, class: ['WARRIOR', 'GLASS_CANNON'] },
  durability: { max: 100, degradationRate: 7, repairCostBase: 25 },
  description: 'Enchanted with fire magic.',
  icon: '🔥'
}
```

### 4.3 Mission Object
```javascript
{
  id: 'forest_boss',
  name: 'The Ancient Treelord',
  description: 'Defeat Treelord Oakenheart',
  type: 'boss',
  difficulty: 8,
  region: 'forest',
  enemy: { name: 'Treelord Oakenheart', class: 'TANK', level: 8 },
  objectives: [
    { id: 'win', type: 'win', description: 'Defeat the boss', star: false },
    { id: 'no_items', type: 'no_items', description: 'No items', star: true },
    { id: 'health_50', type: 'health_percent', value: 50, description: '50%+ HP', star: true }
  ],
  rewards: { gold: 200, xp: 400, equipment: ['flame_blade'] },
  unlocks: ['shadow_realm']
}
```

### 4.4 Talent Node Object
```javascript
{
  id: 'war_arms_execute',
  name: 'Execute',
  description: 'Deal 50% more damage to enemies below 20% health',
  icon: '⚡',
  maxRank: 1,
  row: 2,
  column: 1,
  requires: ['war_arms_dmg_1'],
  requiresPoints: 8,
  effects: {
    passive: {
      type: 'execute',
      damageBonus: 0.5,
      threshold: 0.2
    }
  }
}
```

---

## 5. KEY FILES REFERENCE

### 5.1 Entry Points
- `index.html` - HTML entry
- `src/main-new.js` - App initialization, routing setup, screen management

### 5.2 Core Game Files
- `src/game/game.js` - Main game loop, turn management, victory/defeat
- `src/game/CombatEngine.js` - Damage calculations
- `src/game/GridManager.js` - Tactical grid, pathfinding
- `src/game/GridCombatIntegration.js` - Bridge grid to combat

### 5.3 Entity Files
- `src/entities/fighter.js` - Fighter class
- `src/entities/baseEntity.js` - Base entity with attack methods

### 5.4 System Managers
- `src/game/SkillSystem.js` - Skills per class
- `src/game/ComboSystem.js` - Combo detection
- `src/game/StatusEffectSystem.js` - Status effects
- `src/game/TalentManager.js` - Talent trees
- `src/game/EquipmentManager.js` - Equipment handling
- `src/game/DurabilityManager.js` - Equipment wear
- `src/game/EconomyManager.js` - Gold transactions
- `src/game/MarketplaceManager.js` - Shop system
- `src/game/LevelingSystem.js` - XP and leveling
- `src/game/AchievementManager.js` - Achievements
- `src/game/DifficultyManager.js` - Difficulty modifiers
- `src/game/StoryMode.js` - Story mission logic
- `src/game/TournamentMode.js` - Tournament brackets

### 5.5 AI Files
- `src/ai/AIManager.js` - AI coordination
- `src/ai/BehaviorTree.js` - Behavior tree nodes
- `src/ai/AIPersonality.js` - Personality archetypes
- `src/ai/CombatBehaviors.js` - Combat-specific behaviors

### 5.6 State Management
- `src/store/Store.js` - Store class
- `src/store/gameStore.js` - Game store instance
- `src/store/actions.js` - Action creators
- `src/store/reducers.js` - State reducers

### 5.7 Data Files
- `src/data/classes.js` - 10 character classes
- `src/data/equipment.js` - 24+ equipment items
- `src/data/talents.js` - Talent tree definitions
- `src/data/achievements.js` - Achievement definitions
- `src/data/comboDefinitions.js` - Combo patterns
- `src/data/storyPaths.js` - Story path definitions
- `src/data/*_missions.js` - Path-specific mission data

### 5.8 Components (34+)
Key UI components in `src/components/`:
- `BaseComponent.js` - Base class for all components
- `CombatArena.js` - Main combat UI
- `GridCombatUI.js` - Tactical grid display
- `FighterCard.js` - Fighter display
- `ActionSelection.js` - Combat action buttons
- `TalentTreeScreen.js` - Talent UI
- `MarketplaceScreen.js` - Shop UI
- `CampaignMap.js` - Story mode map
- etc.

---

## 6. TESTING INFRASTRUCTURE

### 6.1 Test Stack
- **Unit**: Vitest with happy-dom
- **E2E**: Playwright (Chromium, Firefox, WebKit)
- **Coverage**: v8 provider, 70% threshold

### 6.2 Test Commands
```bash
npm run test:unit      # Unit tests with coverage
npm run test:e2e       # E2E tests
npm run test:all       # Both
npm run test:watch     # Watch mode
npm run test:ui        # Vitest UI
```

### 6.3 Test Structure
```
tests/
├── setup.js           # Global mocks (localStorage, etc.)
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/               # Playwright E2E tests
└── utils/             # Test helpers
```

---

## 7. CURRENT STATE & KNOWN ISSUES

### 7.1 Completed Features (v5.0)
- ✅ 10 character classes with unique stats
- ✅ Turn-based combat with skills and combos
- ✅ 9x9 tactical grid with 10 terrain types
- ✅ Talent system with 3 trees per class
- ✅ 8-slot equipment system with durability
- ✅ Marketplace with rotating inventory
- ✅ 5 story paths with unique mechanics
- ✅ Tournament mode with brackets
- ✅ 25 achievements
- ✅ AI with behavior trees and personalities
- ✅ Save system with compression and backup
- ✅ Full state management via gameStore

### 7.2 Known Limitations
- Team Battle mode was removed in v4.7
- AI doesn't use grid movement strategically (auto-positioning)
- No multiplayer/PvP
- No sound/music implemented (SoundManager exists but unused)
- Some component files are legacy/deprecated

### 7.3 Potential Areas for Development
1. **AI Enhancement** - Make AI use grid tactically
2. **Multiplayer** - PvP or co-op modes
3. **Audio** - Music and sound effects
4. **Mobile** - Better touch controls
5. **Content** - More classes, equipment, missions
6. **Balance** - Combat tuning
7. **Visual Polish** - Animations, particle effects

---

## 8. NPM SCRIPTS REFERENCE

```bash
# Development
npm run dev            # Start Vite dev server (port 3000)
npm run build          # Production build to /dist
npm run preview        # Preview production build

# Code Quality
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix lint issues
npm run format         # Prettier formatting
npm run format:check   # Check formatting

# Testing
npm run test           # Vitest watch mode
npm run test:unit      # Unit tests with coverage
npm run test:e2e       # Playwright E2E
npm run test:all       # All tests
npm run test:coverage  # Coverage report
```

---

## 9. GLOSSARY

| Term | Definition |
|------|------------|
| **Fighter** | Player or AI-controlled combatant |
| **Class** | Character archetype with stat modifiers |
| **Skill** | Special ability with mana cost and cooldown |
| **Talent** | Permanent upgrade chosen at level-up |
| **Status Effect** | Temporary buff/debuff on fighter |
| **Combo** | Action sequence that triggers bonus effects |
| **Grid** | 9x9 tactical battlefield |
| **Terrain** | Grid cell type affecting combat |
| **Equipment** | Items that modify fighter stats |
| **Durability** | Equipment condition (degrades with use) |
| **Story Path** | Narrative branch with unique mechanics |
| **Star Rating** | Mission performance score (1-3) |
| **Personality** | AI behavior profile |

---

*This document was generated for AI development planning purposes. For the most current information, refer to the source code and CHANGELOG.md.*
