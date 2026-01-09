# Changelog

All notable changes to Legends of the Arena will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
