# Changelog

All notable changes to Legends of the Arena will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.9.0] - 2026-01-09

### Added - Weapon Range & Attack Distance System 🎯

**Attack Range Mechanics:**
- **Class-Based Ranges** - Melee (1), Ranged (3), Magic (3)
- **Weapon Ranges** - Swords/axes (1), Staves (3), Legendary (2)
- **Range Validation** - Can't attack enemies out of range
- **Visual Indicators** - Attack button shows "OUT OF RANGE" warning
- **Combat Log Messages** - Helpful hints to move closer

**Range System:**
- **Manhattan Distance** - Grid-based distance calculation
- **Dynamic Range** - Combines class base + weapon bonus
- **Mages are Ranged** - Mage and Necromancer have 3-cell attack range
- **Melee Classes** - All other classes default to 1-cell melee range
- **Strategic Positioning** - Must use movement skills to get in range

**Class Attack Ranges:**
| Class | Base Range | Type |
|-------|------------|------|
| Warrior, Tank, Balanced, Assassin, Berserker, Paladin, Brawler | 1 | Melee |
| Mage, Necromancer | 3 | Ranged/Magic |

**Technical Implementation:**
- `Fighter.getAttackRange()` - Calculate combined range
- `GridManager.getDistance()` - Manhattan distance
- `GridManager.isInAttackRange()` - Range validation
- `GridCombatIntegration.isTargetInRange()` - Combat range check

### Added - Enhanced Terrain Visuals 🎨

**Rich Visual Design:**
- **Gradient Backgrounds** - All 10 terrain types have unique multi-color gradients
- **Texture Patterns** - Repeating patterns for grass, forest, water, mud, rock, and walls
- **Animated Effects** - Water shimmer (3s), fire pulse (2s), ice sparkle (3s)
- **3D Elevation Effects** - High ground scaled up with shadows, low ground scaled down and dimmed
- **Centered Icons** - Terrain icons increased to 28px and centered behind fighters

**Terrain-Specific Visuals:**
- **Normal Ground** (◻️) - Clean gray gradient
- **Grassland** (🌱) - Green gradient with diagonal stripe pattern
- **Forest** (🌳) - Dark green with vertical tree shadow lines
- **Water** (💧) - Blue gradient with diagonal wave pattern + shimmer animation
- **Mud** (🟤) - Brown with spotty texture dots
- **Rock** (⬜) - Gray stone with diagonal pattern + highlighted edges
- **High Ground** (🏔️) - Elevated with thick border, shadows, and 1.05x scale
- **Low Ground** (⬛) - Depressed with deep shadows, darkened, and 0.95x scale
- **Wall** (🧱) - Dark gray with brick pattern (horizontal/vertical lines)
- **Pit** (⚫) - Black radial gradient with deep inset shadows

**UI/UX Improvements:**
- Icons now have drop shadows for better visibility
- Fighter icons (z-index 2) appear above terrain icons (z-index 1)
- Each terrain instantly recognizable by color, pattern, and animation
- Professional, polished appearance

### Added - In-Game Wiki: Grid Combat Tab 📚

**New Wiki Section:**
- **Grid Combat Tab** - Comprehensive guide to tactical grid system
- **Core Mechanics** - Positioning, movement, and range explained
- **10 Terrain Cards** - Visual display with stats for each terrain type
- **Tactical Mechanics** - Flanking, line of sight, and battlefield layouts
- **Pro Tips** - Strategic advice for mastering grid combat
- **Movement Skills** - Complete list of all class movement abilities

**Wiki Enhancements:**
- Interactive terrain cards with hover effects
- Color-coded terrain categories (highlight for good, danger for bad, impassable)
- Organized movement skill reference
- Links to technical documentation

### Changed
- Attack button now disabled/grayed when target out of range
- Combat flow validates range before executing attacks
- Out-of-range attacks show warning message instead of executing
- Grid UI side-by-side layout: battle logs (left) + tactical grid (right)
- README simplified to focus on quick start and documentation links
- Wiki opens to Grid Combat tab by default

---

## [4.8.1] - 2026-01-09

### Added - Interactive Grid Movement 🏃

**Movement Skills System:**
- **Movement as Skills** - Each class has a unique movement skill
- **Mana-Based Movement** - Movement costs 10-15 mana
- **Cooldown System** - Movement skills have 0-2 turn cooldowns
- **Class-Specific Names**: Shadow Step, Quick Step, Arcane Step, etc.
- **Strategic Depth** - Must choose between moving, attacking, or defending

**Interactive Controls:**
- **Click-to-Move** - Click highlighted cells to move fighters
- **Cell Highlighting** - Valid moves shown in blue during selection
- **Real-time Feedback** - Instant visual updates and combat log messages
- **Invalid Move Warnings** - User-friendly error messages for invalid selections

**Grid UI Enhancements:**
- `highlightCells()` method for showing valid moves
- `clearHighlights()` method for resetting highlights
- `cell-clicked` event emission for external listeners
- Support for interactive modes (view/move/attack)

**Movement Logic:**
- `handleGridMovement()` in Game class
- Event-driven cell selection system
- Automatic terrain effect application after moving
- Turn management integration

**Documentation:**
- Created `INTERACTIVE_MOVEMENT_GUIDE.md` with comprehensive instructions
- Updated `GRID_COMBAT_SYSTEM.md` with movement controls
- Updated `README.md` with interactive movement features

### Changed
- Grid UI now supports multiple interaction modes
- Enhanced GridCombatUI component with new methods
- Updated ActionSelection component with move button
- Improved game loop to handle grid-based movement actions

---

## [4.8.0] - 2026-01-09

### Added - Tactical 5x5 Grid Combat System 🗺️

**Core Grid System:**
- **5x5 Tactical Grid** - 25-cell battlefield with positioning
- **GridManager** - Complete grid management with pathfinding
- **GridCell** - Individual cell with terrain and occupancy tracking
- **Position-based combat** - Fighters occupy specific grid positions

**Terrain System (10 Types):**
- **Normal Terrain**:
  - ⬜ Normal Ground (standard)
  - 🟩 Grassland (open field)
- **Defensive Terrain**:
  - 🌲 Forest (+15% def, -10% atk, blocks LOS)
  - 🪨 Rock (+10% def, +5% atk)
- **Difficult Terrain**:
  - 🌊 Water (3 movement cost, -10% def, -15% atk)
  - 🟫 Mud (2 movement cost, -5% def, -10% atk)
- **Elevation Terrain**:
  - ⛰️ High Ground (+20% def, +25% atk) ✨ Best advantage!
  - 🕳️ Low Ground (-15% def, -10% atk)
- **Impassable Terrain**:
  - 🧱 Wall (blocks movement and LOS)
  - 🕳️ Pit (blocks movement)

**Movement System:**
- **Pathfinding** - BFS algorithm for valid moves
- **Movement Range** - Base 2 spaces, class-modified
  - Assassin/Agile: 3 spaces
  - Tank: 1 space
- **Terrain Costs** - Different movement costs per terrain
- **Visual Indicators** - Green pulse for valid moves

**Attack System:**
- **Range-based Attacks** - Melee (1), Extended (2), Ranged (3)
- **Line of Sight** - Bresenham's algorithm
- **Terrain Modifiers** - Attack/defense bonuses from terrain
- **Flanking Mechanic** - +25% damage when flanked
- **Visual Indicators** - Red pulse for valid targets

**Battlefield Layouts (6 Predefined):**
1. **Open Field** - Wide open, minimal cover
2. **Forest Clearing** - Dense forest with central clearing
3. **Ancient Ruins** - Rocky terrain with walls
4. **Treacherous Swamp** - Mud and water obstacles
5. **Mountain Pass** - Elevated terrain with high/low ground
6. **Combat Arena** - Walled perimeter with rock cover

**Grid Combat UI Component:**
- **Interactive 5x5 Grid** - Click to select cells
- **Real-time Visualization** - Terrain colors and fighter icons
- **Mode System** - View, Move, Attack modes
- **Tooltips** - Terrain info, fighter stats, bonuses
- **Legend** - Always-visible terrain reference
- **Stats Display** - Fighter counts and positioning
- **Animations** - Pulse effects, hover states, bouncing fighters

**Combat Integration:**
- **GridCombatIntegration** - Bridges grid with existing combat
- **Action System** - Move, Attack, Skill, Defend, Wait
- **Terrain Damage Calculation** - Applies bonuses to combat
- **Flanking Detection** - Automatic flanking bonus
- **Combat Info API** - Get positioning data for UI

**Strategic Features:**
- **High Ground Advantage** - Up to 45% total swing
- **Defensive Positioning** - Forest cover, rock stability
- **Mobility Tactics** - Kiting, rushing, zoning
- **Flanking Prevention** - Corner positioning
- **Terrain Control** - Key position dominance

**Technical Implementation:**
- **Efficient Pathfinding** - BFS with movement costs
- **Line-of-Sight Caching** - Optimized LOS checks
- **Grid State Management** - Serializable grid state
- **Fighter Position Tracking** - Bidirectional references
- **Terrain Effect Processor** - Centralized bonus calculation

**API Additions:**
```javascript
// GridManager
gridManager.placeFighter(fighter, x, y)
gridManager.getValidMoves(fighter, range)
gridManager.hasLineOfSight(x1, y1, x2, y2)
gridManager.getEnemiesInRange(fighter, range)
gridManager.isFlanked(fighter)

// TerrainSystem
TerrainGenerator.generateRandom()
TerrainGenerator.generateByName('MOUNTAIN_PASS')
TerrainEffectProcessor.calculateTerrainModifiedDamage(damage, attackerCell, defenderCell)

// GridCombatIntegration
gridCombatIntegration.initializeBattle(player, enemy, 'ARENA')
gridCombatIntegration.getAvailableActions(fighter)
gridCombatIntegration.executeMove(fighter, x, y)
gridCombatIntegration.executeAttack(attacker, x, y)
gridCombatIntegration.getCombatInfo(fighter)
```

**Files Added:**
- `src/game/GridManager.js` - Core grid management (500+ lines)
- `src/game/TerrainSystem.js` - Terrain types and effects (400+ lines)
- `src/game/GridCombatIntegration.js` - Combat integration (300+ lines)
- `src/components/GridCombatUI.js` - Visual grid component (400+ lines)
- `docs/GRID_COMBAT_SYSTEM.md` - Complete documentation (600+ lines)

**Documentation:**
- Complete terrain type catalog
- Movement and attack mechanics
- Strategic positioning guide
- Battlefield layout descriptions
- API reference with examples
- Tips for each class
- Future enhancement roadmap

**Game Balance:**
- High ground provides significant advantage
- Terrain variety creates strategic choices
- Movement costs balance mobility
- Flanking adds tactical depth
- Line-of-sight creates positioning importance

**Version:**
- Version bumped from 4.7.0 to 4.8.0

## [4.7.0] - 2026-01-09

### Removed - Team Battle Mode 🔄
- **Removed Team Battle** from game modes
  - Removed "👥 Team Battle" button from title screen
  - Removed `startTeamMatch()` from Game class
  - Removed `processTeamCombat()` and `removeFighter()` from CombatEngine
  - Removed team-specific victory condition logic
  - Removed `introduceTeams()`, `matchRoundSummary()`, and `declareWinningTeam()` from Referee
  - Removed `displayTeamSummary()` and `displayTeamHealthSummary()` from Game class
  - Removed Team import from main-new.js
  - Kept Team entity file for potential future use
- **Game now focuses on three core modes**:
  - 📖 Story Mode (25 missions, 5 regions)
  - ⚔️ Single Combat (1v1 battles)
  - 🏆 Tournament Mode (bracket championships)
- Updated README.md to reflect mode changes
- Simplified codebase by removing ~300 lines of team-specific code

### Added - Enhanced Status Effect System 🎯
- **17 Status Effects** (9 new + 8 enhanced existing):
  - **New Effects**:
    - Bleed 🩸 - DOT that stacks with actions
    - Frozen ❄️ - Speed reduction, vulnerable to shatter
    - Shock ⚡ - Lightning DOT with chaining
    - Curse 🌑 - Reduces healing received
    - Bless ✨ - Increases damage dealt
    - Weakness 😰 - Reduces all stats
    - Haste 💨 - Increases action speed
    - Slow 🐌 - Decreases action speed
    - Shield 🔰 - Absorbs damage
    - Reflect 🪞 - Reflects damage back
    - Vulnerable 💔 - Increases damage taken
    - Fortify ⛰️ - Reduces damage taken (stackable)
    - Enrage 😡 - High damage, low defense trade-off
    - Silence 🔇 - Prevents skill usage
    - Clarity 🧠 - Reduces mana costs
    - Thorns 🌹 - Returns damage when hit (stackable)
  - **Enhanced Existing**:
    - Poison, Burn, Regeneration now stackable
    - Defense Boost, Strength Boost with tags
    - Stun with proper CC category

- **Interaction Matrix** (11 interactions):
  - Fire vs Ice (Burn/Frozen cancel each other)
  - Poison vs Regeneration (partial cancellation)
  - Shock + Wet (amplified damage)
  - Curse vs Healing (reduces effectiveness)
  - Curse vs Bless (mutual cancellation)
  - Haste vs Slow (mutual cancellation)
  - Vulnerable vs Fortify (partial cancellation)
  - Bleed + Actions (stacking mechanic)
  - Frozen + Heavy Damage (shatter combo)
  - Shield vs Vulnerable (protection)
  - Enrage vs Weakness (partial overcome)

- **Enhanced Status Effect Class**:
  - Stacking system (max stacks per effect)
  - Effect categories (BUFF, DEBUFF, DOT, HOT, CC, MODIFIER)
  - Tag system for filtering and querying
  - Custom callbacks (onApply, onRemove, onStack)
  - Metadata support for complex effects
  - Dispel protection flags

- **Status Effect Manager**:
  - Centralized effect management
  - Automatic interaction processing
  - Effect stacking logic
  - Category and tag-based queries
  - Dispel mechanics
  - Effect clearing and cleanup

### Technical Features
- **Effect Categories**: 6 categories for organization
- **Effect Tags**: Flexible tagging system for queries
- **Interaction Priority**: Priority-based interaction resolution
- **Stack Limits**: Configurable max stacks per effect
- **Dispel System**: Type-based effect removal
- **Metadata Storage**: Custom data per effect instance

### Effect Stacking
- Poison: Max 5 stacks
- Burn: Max 3 stacks
- Bleed: Max 5 stacks
- Regeneration: Max 3 stacks
- Fortify: Max 2 stacks
- Thorns: Max 3 stacks

### Strategic Depth
- **Offensive Combos**: DOT stacking, burst damage setups
- **Defensive Combos**: Tank builds, sustain strategies
- **Counter-Plays**: Effect cancellation, dispels
- **Element Interactions**: Fire/Ice/Lightning mechanics
- **Shatter Mechanic**: Bonus damage on frozen targets

### API Additions
```javascript
// Apply effects
applyEffect(fighter, 'BURN')
applyEffect(fighter, 'FROZEN')

// Check effects
hasEffect(fighter, 'frozen')
statusEffectManager.getEffect(fighter, 'burn')

// Process effects
processEffects(fighter)

// Dispel effects
dispelEffects(fighter, 2, 'debuff')

// Clear all effects
clearEffects(fighter)

// Query by category/tag
statusEffectManager.getEffectsByCategory(fighter, EffectCategory.DOT)
statusEffectManager.getEffectsByTag(fighter, 'damage')
```

### Files Added
- `src/game/StatusEffectSystem.js`: Enhanced status effect system
- `docs/STATUS_EFFECTS.md`: Complete status effect guide

### Documentation
- Complete effect catalog with icons
- Interaction matrix explanation
- Strategic combo guide
- API reference
- Usage examples
- Tips and tricks

### Game Balance
- DOT effects deal consistent damage over time
- Stacking allows for build-around strategies
- Interactions create counter-play opportunities
- CC effects provide tactical control
- Protection effects enable tank builds

### Version
- Version bumped from 4.6.0 to 4.7.0

## [4.6.0] - 2026-01-09

### Added - Performance Optimization System ⚡
- **Lazy Loading System**:
  - Dynamic module loading on demand
  - Async image asset loading with caching
  - Batch loading for multiple resources
  - Preload queue with priority support
  - Lazy Web Component registration
  - Intersection Observer integration for viewport-based loading
  - Resource cache with statistics
- **Object Pooling System**:
  - Generic object pool implementation
  - Pool manager for multiple pools
  - Pre-configured pools (vectors, particles, damage numbers, events)
  - Automatic object recycling
  - Pool statistics and monitoring
  - Batch acquire/release operations
  - Dynamic pool resizing
- **Performance Monitoring**:
  - Real-time FPS tracking
  - Frame time measurement
  - Memory usage monitoring (if available)
  - Custom performance marks and measures
  - Function profiling (sync and async)
  - Performance timers
  - Metric history tracking (60 samples)
  - Performance status levels (good/warning/critical)
  - Average/min/max calculations
  - Performance summary logging

### Added - New Files
- `src/utils/LazyLoader.js`: Dynamic resource loading system
- `src/utils/ObjectPool.js`: Object pooling and recycling system
- `src/utils/PerformanceMonitor.js`: Performance tracking and profiling
- `src/components/PerformanceMonitorUI.js`: Visual performance metrics display
- `docs/PERFORMANCE_OPTIMIZATION.md`: Comprehensive performance guide

### Added - Performance UI
- Real-time FPS counter (top-left corner)
- Frame time display
- Memory usage display
- Expandable detailed view:
  - Object pool utilization
  - Lazy loader statistics
  - Average performance metrics
- Click to expand/collapse
- Color-coded status indicators

### Technical Features
- **Lazy Loading**:
  - Module caching
  - Parallel batch loading
  - Idle-time preloading
  - Load event observers
  - Cache management
- **Object Pooling**:
  - Factory pattern
  - Custom reset functions
  - Size limits
  - Utilization tracking
  - Memory-efficient reuse
- **Performance Monitoring**:
  - RAF-based monitoring loop
  - Performance API integration
  - Memory API support (Chrome/Edge)
  - Metric thresholds
  - Historical data
  - Status-based warnings

### Pre-configured Object Pools
- `vector2d`: 2D vector objects (20/100)
- `damageNumber`: Floating damage text (15/50)
- `particle`: Visual effect particles (50/200)
- `event`: Event objects (10/50)

### Performance Thresholds
- **FPS**: Good ≥55, Warning 40-54, Critical <40
- **Frame Time**: Good ≤16ms, Warning 17-25ms, Critical >25ms
- **Memory**: Warning >80%, Critical >95%

### API Additions
```javascript
// Lazy Loading
lazyLoader.loadModule(path)
lazyLoader.loadImage(path)
lazyLoader.loadBatch(paths, type)
lazyLoader.preload(paths, type, priority)
lazyLoader.loadComponent(tagName, modulePath)
lazyLoader.observeElement(element, callback)

// Object Pooling
poolManager.createPool(name, factory, reset, initial, max)
poolManager.acquire(poolName)
poolManager.release(poolName, obj)
poolManager.getAllStats()

// Performance Monitoring
performanceMonitor.mark(name)
performanceMonitor.measure(name, start, end)
performanceMonitor.startTimer(name)
performanceMonitor.endTimer(name)
performanceMonitor.profile(name, fn)
performanceMonitor.profileAsync(name, fn)
performanceMonitor.getMetrics()
performanceMonitor.getStatus()
```

### Integration
- Performance monitor UI integrated into main app
- Automatic monitoring on game start
- Available globally via singleton patterns
- Zero-config default setup

### Benefits
- **Faster Initial Load**: Lazy loading reduces bundle size
- **Lower Memory Usage**: Object pooling reduces allocations
- **Reduced GC Pressure**: Object reuse minimizes garbage collection
- **Better Performance**: Real-time monitoring enables optimization
- **Improved UX**: Smoother gameplay with higher FPS
- **Developer Tools**: Profiling and debugging capabilities

### Documentation
- Complete performance optimization guide
- Usage examples for all systems
- Best practices and patterns
- Integration examples
- Troubleshooting guide
- API reference

### Version
- Version bumped from 4.5.0 to 4.6.0

## [4.5.0] - 2026-01-09

### Added - Comprehensive Testing Framework 🧪
- **Vitest** for unit and integration tests
  - Fast, Vite-native test runner
  - Coverage reporting with v8
  - Interactive UI mode
  - Watch mode for continuous testing
- **Playwright** for E2E tests
  - Cross-browser testing (Chromium, Firefox, WebKit)
  - Mobile viewport testing
  - Screenshot and video on failure
  - Trace recording for debugging
- **Test Infrastructure**:
  - Global test setup with mocks
  - Reusable test helpers and utilities
  - Mock localStorage, sessionStorage, requestAnimationFrame
  - Custom test fighter factories
- **Test Suites**:
  - Unit tests for Fighter class
  - Unit tests for ComboSystem
  - Integration tests for Combat Flow
  - E2E tests for game flow
  - Accessibility tests
  - Responsive design tests

### Added - New Files
- `vitest.config.js`: Vitest configuration
- `playwright.config.js`: Playwright configuration
- `tests/setup.js`: Global test setup
- `tests/utils/testHelpers.js`: Reusable test utilities
- `tests/unit/Fighter.test.js`: Fighter unit tests
- `tests/unit/ComboSystem.test.js`: Combo system tests
- `tests/integration/CombatFlow.test.js`: Combat integration tests
- `tests/e2e/gameFlow.spec.js`: E2E game flow tests
- `docs/TESTING.md`: Comprehensive testing guide
- `.gitignore`: Test artifacts exclusions

### Added - NPM Scripts
- `npm test`: Run tests in watch mode
- `npm run test:unit`: Run unit tests with coverage
- `npm run test:watch`: Watch mode
- `npm run test:ui`: Interactive Vitest UI
- `npm run test:e2e`: Run E2E tests
- `npm run test:e2e:ui`: Playwright UI mode
- `npm run test:e2e:debug`: Debug E2E tests
- `npm run test:all`: Run all test types
- `npm run test:coverage`: Generate coverage report

### Added - Dev Dependencies
- `vitest@^2.1.0`
- `@vitest/ui@^2.1.0`
- `@vitest/coverage-v8@^2.1.0`
- `@playwright/test@^1.48.0`
- `happy-dom@^15.7.4`

### Technical Features
- **Coverage Thresholds**: 70% for lines, functions, branches, statements
- **Test Isolation**: Each test runs in clean environment
- **Mock Utilities**: localStorage, sessionStorage, timers, etc.
- **Shadow DOM Testing**: Helpers for Web Component testing
- **Async Testing**: Full support for promises and async/await
- **Event Testing**: Mock and verify event emissions
- **Cross-Browser**: E2E tests run on all major browsers

### Testing Coverage
- ✅ Fighter combat mechanics
- ✅ Combo system logic
- ✅ Phase manager integration
- ✅ Turn management
- ✅ Action queuing and execution
- ✅ Event emission and handling
- ✅ Game flow (E2E)
- ✅ Character creation (E2E)
- ✅ Navigation (E2E)
- ✅ Responsive design (E2E)

### Documentation
- Comprehensive testing guide
- Unit test examples
- Integration test patterns
- E2E test best practices
- Debugging tips
- CI/CD integration guide

### Version
- Version bumped from 4.4.0 to 4.5.0

## [4.4.0] - 2026-01-09

### Changed - Full Combat Phase System Migration 🎯
- **Complete Migration**: Old combat system fully replaced with phase system
- **game.js Refactored**: Main game loop now uses CombatPhaseManager
- **New Methods**:
  - `startGame()` now async, initializes phase manager
  - `executeActionPhased()` replaces direct action execution
  - `registerCombatHooks()` sets up phase hooks for combat systems
- **Phase Integration**:
  - Combo system integrated via phase hooks
  - Status effects processed in turn start phase
  - Action execution flows through phase system
  - Victory checking integrated with battle end phase
- **Backward Compatibility**: All existing features work identically
- **Performance**: No noticeable overhead from phase system

### Technical Changes
- Combat loop now uses `async/await` for phase transitions
- Actions queued and executed through CombatPhaseManager
- Turn management integrated with phase system
- Story mode tracking works with phased combat
- Statistics tracking preserved through hooks
- Equipment and durability systems unchanged

### Benefits Realized
- ✅ Combat now extensible via hooks
- ✅ Clear phase structure for debugging
- ✅ Event system ready for new features
- ✅ Action queue enables complex mechanics
- ✅ Foundation for future enhancements

### Migration Notes
- Old `executeAction()` method kept for reference
- New `executeActionPhased()` handles all combat
- Phase hooks registered at battle start
- No breaking changes to existing gameplay
- Full test coverage maintained

### Version
- Version bumped from 4.3.0 to 4.4.0

## [4.3.0] - 2026-01-09

### Added - Combat Phase System 🎯
- **CombatPhaseManager**: Structured combat flow with 8 distinct phases
  - IDLE, BATTLE_START, TURN_START, ACTION_SELECTION
  - ACTION_EXECUTION, ACTION_RESOLUTION, TURN_END, BATTLE_END
- **Event System**: 15+ combat events for integration
  - Battle lifecycle events (started, ended)
  - Turn lifecycle events (started, ended)
  - Action lifecycle events (selected, queued, executing, executed, resolved)
  - Combat result events (damage dealt, healing applied, status effects)
  - Fighter state events (defeated, health/mana changed)
  - Combo events (triggered, broken)
- **Phase Hooks**: Extensibility system with priority support
  - Register custom logic at any combat phase
  - Priority-based execution order (0-15+)
  - Async hook support
  - Hook registration and removal
- **ActionQueue**: Advanced action queue system
  - Priority-based action execution
  - Action batching support
  - Queue pause/resume functionality
  - Action history tracking (last 50 actions)
  - Action filtering and search
  - Queue statistics and debugging

### Added - New Files
- `src/game/CombatPhaseManager.js`: Main phase orchestrator (400+ lines)
- `src/game/ActionQueue.js`: Action queue implementation (300+ lines)
- `docs/COMBAT_PHASES.md`: Comprehensive system documentation
- `docs/COMBAT_PHASES_EXAMPLES.md`: Practical usage examples

### Technical Features
- **Modular Architecture**: Clean separation of concerns
- **Event-Driven**: Decoupled components communicate via events
- **Extensible**: Add custom behavior without modifying core
- **Debuggable**: Rich logging and state inspection tools
- **Testable**: Designed for unit and integration testing

### Use Cases Enabled
- Custom abilities (lifesteal, thorns, berserk)
- Reactive systems (counter-attacks, dodge, auto-revive)
- Environmental effects (weather, terrain)
- Complex mechanics (multi-hit combos, delayed damage, resurrection)
- Conditional triggers (low HP bonuses, mana shields)

### Changed
- Version bumped from 4.2.0 to 4.3.0
- Updated README.md with Combat Phase System section

### Developer Benefits
- **Easier Extensions**: Add new mechanics via hooks instead of core edits
- **Better Testing**: Mock phases and events for isolated testing
- **Cleaner Code**: Replace spaghetti logic with structured phases
- **Rich Events**: Subscribe to specific combat moments
- **Debug Tools**: Inspect phases, queue, and history in real-time

## [4.2.0] - 2026-01-09

### Added - Combo System ⚡
- **20+ Unique Combos**: Universal combos available to all classes plus class-specific combos
- **Action Tracking**: System remembers last 5 actions to detect combo patterns
- **Combo Effects**: 
  - Damage multipliers (1.3x to 2.2x)
  - Extra flat damage bonuses
  - Healing effects
  - Mana restoration
  - Status effect application
  - Skill cooldown reduction
- **Combo Types**:
  - Universal: Offensive Surge, Berserker Rush, Tactical Retreat, Double Defense
  - Tank: Iron Fortress, Unstoppable Force
  - Balanced: Perfect Balance, Warrior's Resolve
  - Agile: Rapid Assault, Shadow Dance
  - Mage: Arcane Inferno, Elemental Barrage
  - Hybrid: Adaptive Strike, Life Surge
  - Assassin: Silent Death, Backstab
  - Brawler: Knockout Punch, Relentless Assault
- **Visual Feedback**: Stunning animated banners when combos trigger
- **Combo Hints**: Real-time UI showing available combo opportunities
- **Strategic Depth**: Plan action sequences for maximum effectiveness

### Added - New Status Effects
- **Defense Boost**: +15 Defense for 3 turns
- **Burn**: Fire damage over time (12 HP/turn for 3 turns)
- **Stun**: Skip enemy turn for 1 turn

### Added - New Files
- `src/game/ComboSystem.js`: Core combo tracking and effect application
- `src/data/comboDefinitions.js`: All combo patterns and bonuses
- `src/components/ComboHint.js`: UI component for combo suggestions
- `docs/COMBO_SYSTEM.md`: Comprehensive combo system documentation

### Changed
- Updated `src/game/game.js` to integrate combo system
- Enhanced `src/game/StatusEffect.js` with new status effects
- Updated `src/components/index.js` to register ComboHint component
- Version bumped from 4.1.0 to 4.2.0

### Technical
- Combo system uses singleton pattern for global state
- Action history limited to 5 most recent actions
- Combo matching supports exact sequence patterns
- Class restrictions enforced for specialized combos
- Pending combo effects stored on fighter object
- Auto-cleanup of combo hints on action selection

## [4.1.0] - 2026-01-09

### Added - Save System V2
- **Multiple Save Slots**: Manage up to 3 different character saves
- **Import/Export**: Download save files as JSON and import them back
- **Auto-Backup System**: Automatic backups (up to 5 per slot) before each save
- **Backup Restore**: Restore from any previous backup with timestamp selection
- **Data Compression**: LZ-String compression reduces save file size by ~60%
- **Version Migration**: Automatic migration of old save formats to new versions
- **Save Management Screen**: Dedicated UI for managing all save operations
- **Storage Info**: View localStorage usage and available space
- **Save Validation**: Integrity checks to prevent corrupted saves

### Added - Architecture Improvements
- **Router System**: Client-side routing with History API and route guards
- **State Management**: Centralized store with actions, reducers, and selectors
- **Enhanced AI System**: Behavior trees with personality-based decision making
- **Component Refactoring**: Extracted navigation, theme, and sound controls into reusable Web Components
- **SaveManagerAdapter**: Backward compatibility layer for gradual migration

### Added - New Components
- `NavigationBar`: Persistent navigation with Profile, Achievements, and Settings
- `ThemeToggle`: Dark/light mode toggle component
- `SoundToggle`: Sound on/off toggle component
- `SaveManagementScreen`: Full-featured save management interface

### Technical
- Added `lz-string` dependency for data compression
- Created `SaveManagerV2` with advanced features
- Implemented `Router` class for client-side navigation
- Added `Store` class with middleware and time-travel debugging
- Created `AIManager` with behavior tree support
- Added comprehensive documentation in `/docs` folder

### Changed
- Refactored `main-new.js` to use Router instead of imperative navigation
- Updated all navigation to use `router.navigate()` instead of direct function calls
- Settings screen now includes link to Save Management
- All 19 modules migrated from old `SaveManager` to `SaveManagerV2`
- Version bumped from 4.0.0 to 4.1.0

### Removed
- `src/utils/saveManager.js` - Replaced by SaveManagerV2
- `src/utils/SaveManagerAdapter.js` - No longer needed after direct migration

### Documentation
- Added `ROUTER_SYSTEM.md` - Router architecture and usage
- Added `STATE_MANAGEMENT.md` - Store pattern documentation
- Added `SAVE_SYSTEM_V2.md` - Save system features and API
- Added `AI_SYSTEM.md` - AI behavior tree documentation
- Added `COMPONENT_REFACTORING.md` - Component architecture guide
- Added `STORE_EXAMPLES.md` - Integration examples

## [4.0.0] - 2026-01-09

### Added - Major Features
- **10 Character Classes**: Balanced, Warrior, Tank, Glass Cannon, Bruiser, Mage, Assassin, Berserker, Paladin, Necromancer
- **Story Mode**: 25-mission campaign across 5 unique regions with star rating system
- **Gold Economy**: Currency system for buying, selling, and upgrading equipment
- **Marketplace System**: 
  - Equipment shop with rotating inventory (refreshes every 24 hours)
  - Force refresh option for 100 gold
  - Consumables shop for health and mana potions
  - Repair shop for damaged equipment
  - Sell tab for unwanted items
- **Equipment Durability**: Items degrade with use and require repairs
- **22 New Achievements**: For story mode completion and marketplace activities
- **Class-Specific Equipment**: Items with class requirements and compatibility indicators
- **Enhanced Profile Stats**: Comprehensive statistics tracking across all game modes

### Added - UI/UX Improvements
- Victory screen now has "Close & View Logs" button to review combat details
- Marketplace shows class compatibility indicators (✅/❌) for all items
- Story mode mission results with manual navigation button
- Class requirement badges with icons and color coding
- Duplicate item handling in sell tab
- Force refresh button in marketplace header

### Fixed
- Duplicate equipped items now show correctly in sell tab
- Selling items no longer refreshes the entire page
- Mission completion properly tracks player state
- Fighter class flags now persist correctly
- Curly quote syntax errors in data files
- Equipment durability calculations

### Changed
- Game rebranded from "ObjectFighterJS" to "Legends of the Arena"
- Version bumped from 3.x to 4.0.0
- Main menu buttons made smaller for better mobile display
- Equipment Manager renamed to use consistent naming
- Improved event handling with preventDefault/stopPropagation

### Technical
- Centralized game configuration in `GameConfig`
- Created comprehensive character class system with passive abilities
- Integrated achievement tracking across all systems
- Enhanced save system with new stats fields
- Improved Web Component architecture

## [3.0.0] - Previous Version

### Added
- Tournament Mode with bracket system
- Achievement System (22 achievements)
- Equipment System with rarity tiers
- Character progression and leveling
- Skill system with cooldowns
- Status effects and buffs/debuffs

### Changed
- Refactored combat system
- Improved UI design
- Enhanced save management

## [2.0.0] - Earlier Version

### Added
- Team battle mode
- Equipment drops
- Profile screen
- Settings system

## [1.0.0] - Initial Release

### Added
- Basic single combat system
- Character creation
- Turn-based combat
- Basic stats tracking

---

## Version History

- **4.0.0** - Story Mode, Marketplace, Classes Update
- **3.0.0** - Tournament & Achievement Update
- **2.0.0** - Team Battle & Equipment Update  
- **1.0.0** - Initial Release

[4.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v4.0.0
[3.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v3.0.0
[2.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v2.0.0
[1.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v1.0.0
