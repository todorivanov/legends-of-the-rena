# Changelog

All notable changes to Legends of the Arena will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - Enhanced Enemy Icon System 🎭✨

**Major Icon Quality Improvement**

The tactical grid enemy icons have been completely overhauled to better represent enemy names and types. Changed from generic symbols to **character-focused, culturally appropriate icons** that match visual identity.

**Philosophy Change:**
- **Before**: Generic symbols (💪 muscles, 🏜️ landscapes, 🪓 weapons)
- **After**: Character icons (🧔 people, 😡 emotions, 🧕 cultural attire)

**Key Improvements:**

**1. Named Enemy Support (15+ specific characters)**
- **Brutus**: 💪 muscle → 🧔 bearded man
- **Iron Fist Gaius**: (new) → 👊 fist brawler
- **Swift Blade Helena**: (new) → 🗡️ assassin blade
- **Mountain Titus**: (new) → 🛡️ tank shield
- **Fellow Slave Marcus**: (new) → 👨 generic man

**2. Story Path Themes:**

**⛓️ Slave Gladiator** - Arena/Freedom theme:
- Desert Raider: 🏜️ landscape → 🧕 turbaned figure
- Veteran: (new) → ⚔️ armored fighter
- Imperial Champion: (new) → 👑 crowned (vs regular 🏆 trophy)
- Bandit: 🗡️ → 🥷 ninja
- Guardian: (new) → 🛡️
- Shadow: (new) → 👤 silhouette
- Rival Master's Champion: (new) → 🤺 fencer

**🦅 Roman Legionnaire** - Military hierarchy:
- Barbarian: 🪓 axe → 🧔 bearded warrior
- Berserker: (new) → 😡 angry face (rage emotion)
- Warchief: (new) → 👑 tribal leader
- Rebel Leader: (new) → 🔥 revolution fire (vs regular rebel ⚔️)
- Created visual rank system:
  - Emperor/Caesar: 👑 crown
  - General/Legatus: ⭐ star
  - Praetorian: 🛡️ → 🛡️ shield (kept)
  - Centurion: 🦅 eagle (kept)
  - Legionnaire: ⚔️ sword
- Added cultural enemies:
  - Egyptian: 🐍 serpent
  - Scythian: 🏇 horse archer
- Removed: 🏛️ building icon (not character)

**💼 Lanista** - Business/Crime theme:
- Rival Lanista: 💼 briefcase → 🤵 tuxedo professional
- Senator: (new) → 👔 suit
- Rogue Gladiator: 🗡️ → 🥷 ninja deserter
- Crime Lord/Syndicate Boss: 🦂 scorpion → 🦹 villain icon
- Syndicate/Gang: (new) → 🔪 knife
- Enforcer/Thug: (new) → 👊 fist
- Assassin: 🔪 → 🥷 professional killer
- Arena Legend: ⭐ star, Master Gladiator: 🏆 trophy, Champion: 👑 crown

**🪓 Barbarian Traveller** - Tribal/Wilderness:
- Blood Warrior: (new) → 🩸 blood drop
- War Band: (new) → ⚔️ crossed swords
- Hostile Tribe: 🪓 axe → 🧔 bearded warrior
- Shaman: 🔮 crystal ball
- Elder: (new) → 👴 old man
- Specific wildlife: Dire Wolf 🐺, Bear 🐻, Boar 🐗, Lion 🦁 (not generic beast)
- Roman invaders: Patrol 🛡️, Officer 🦅, Soldier ⚔️
- Warlords: Warlord 👹 demon, Tyrant 😈 devil
- Mystical: Ancient Guardian 🗿 statue, Cursed 💀 skull, Spirit 👻 ghost, Demon 😈

**🏜️ Desert Nomad** - Arabian/Desert theme:
- Sand Creature: (new) → 🌪️ tornado
- Desert Walker: (new) → 🧕 turbaned figure
- Caravan Raider: 🏴‍☠️ → 🐫 camel
- Marauder: ⚔️ → 🥷 ninja
- Djinn/Genie: 🌪️ tornado → 🧞 genie (Arabian mythology)
- Sand Witch: 🔮 → 🧙 wizard
- Rival Chief: 🐪 camel → 👳 turbaned chief
- Rival Nomad: 🐪 camel → 🧕 turbaned figure
- Creatures: Scorpion 🦂, Serpent 🐍, Vulture 🦅, Scarab 🪲
- Bosses: Tyrant 😈 devil, Warlord 👹 demon, Eternal 💀 skull
- Removed: 🏜️ landscape, ☠️ skull and crossbones

**3. Class-Based Fallbacks** - Better variety:
- WARRIOR: ⚔️ → 🗡️ dagger (for variety)
- MAGE: 🔮 crystal ball → 🧙 wizard character
- NECROMANCER: (split from MAGE) → 💀 skull (distinct identity)
- ASSASSIN: 🗡️ weapon → 🥷 ninja character
- AGILE: (split from ASSASSIN) → 🤸 acrobat (shows agility)
- BERSERKER: 🪓 axe → 😡 angry face (rage emotion)
- BRAWLER: 🥊 gloves → 👊 fist action
- BRUISER: (new fallback) → 🧔 bearded tough guy
- BALANCED: (new fallback) → ⚖️ balance scales
- TANK: 🛡️ (unchanged - perfect)
- PALADIN: ✨ (unchanged - holiness)
- GLASS_CANNON: 💥 (unchanged - perfect)

**Visual Design Principles:**
1. ✅ **Character Over Objects** - People/faces instead of weapons/landscapes
2. ✅ **Cultural Accuracy** - Turbans 🧕👳 for desert, beards 🧔 for barbarians, eagles 🦅 for Romans
3. ✅ **Emotional Representation** - Angry 😡 for berserkers, devils 😈 for tyrants
4. ✅ **Visual Hierarchy** - Crowns 👑 for leaders, stars ⭐ for generals, shields 🛡️ for guards
5. ✅ **Creature Diversity** - Specific animals (🐺 wolf, 🐻 bear, 🐗 boar, 🦁 lion) not generic beast
6. ✅ **Mythological Accuracy** - Genie 🧞 for djinn, ghost 👻 for spirits, statue 🗿 for ancients

**Statistics:**
- **80+ icon mappings** replaced across entire system
- **15+ named enemies** now have unique icons
- **5 story paths** completely updated with thematic consistency
- **13 class fallbacks** improved with better variety

**Files Modified:**
- `src/utils/EnemyIconMapper.js` - Complete icon overhaul (289 lines)
- `guides/ENEMY_ICON_SYSTEM.md` - Updated all icon reference tables

**User Experience:**
- Instantly recognize enemy types at a glance
- Better visual storytelling during combat
- Cultural and thematic authenticity
- Boss enemies clearly distinguished with character + crown
- Improved tactical awareness on grid

**Developer Impact:**
- Icon selection now follows: Name → Type → Path → Class → Default
- Better code maintainability with clear patterns
- Easier to add new enemies with established themes

---

### Added - Dynamic Enemy Icons on Tactical Grid 🎭 (v5.0.0)

**Story-Aware Enemy Icons System**

The tactical grid displays **context-aware enemy icons** that change based on enemy type, story path, and character name, providing rich visual storytelling during combat.

**Core Features:**
- 🎭 **68+ Unique Enemy Icons** - Different icons for each enemy type across all 5 story paths
- 📖 **Story Path Integration** - Slave Gladiator (⛓️👤), Roman Legionnaire (🦅🧔), Lanista (💼🎭), Barbarian (🐺🔮), Desert Nomad (🏜️🦂)
- 👑 **Boss Indicators** - Boss enemies display with crown suffix (e.g., 🧔👑)
- 🌈 **Color-Coded Enemies** - Green (player), Red (enemy), Orange (boss), Gold (champion), Purple (mystical), Pink (elite)
- ✨ **Glow Effects** - Colored halos around icons for enhanced visibility
- 🎯 **Name-Based Matching** - Intelligent icon selection based on enemy names and keywords

**Enemy Icon Examples:**
- **Slave Gladiator Path**: ⛓️ Condemned Prisoner, 👤 Fellow Slave, 🏆 Arena Champion, 🧔 Champion Brutus
- **Roman Legion Path**: 🧔 Barbarian Raider, 🦅 Centurion, 👑 Chieftain, 🛡️ Praetorian Guard
- **Lanista Path**: 🤵 Rival Lanista, 🎭 Corrupt Official, 🥷 Rogue Gladiator, 💰 Mercenary
- **Barbarian Path**: 🧔 Tribal Warrior, 🐺 Wild Beast, 🔮 Shaman, 👻 Spirit Enemy
- **Desert Nomad Path**: 🦎 Scavenger, 🌪️ Sand Creature, 🧞 Desert Spirit, 🦂 Scorpion King

**Technical Implementation:**
- New `EnemyIconMapper` utility class
- Name-based keyword matching system
- Class fallback for unrecognized enemies
- Priority-based icon resolution (name → type → class → default)
- Color system with CSS glow effects

**Files Added:**
- `src/utils/EnemyIconMapper.js` - Core icon mapping system (289 lines)
- `guides/ENEMY_ICON_SYSTEM.md` - Complete documentation (362 lines)

**Files Modified:**
- `src/components/GridCombatUI.js` - Integrated EnemyIconMapper with colored glows

**Benefits:**
- Enhanced visual storytelling during combat
- Quick enemy identification at a glance
- Distinct visual identity for each story path
- Boss fights clearly indicated
- Improved tactical awareness

See [Enemy Icon System Guide](./guides/ENEMY_ICON_SYSTEM.md) for complete icon catalog and customization instructions.

---

### Added - Arena Face-Off: Single Fight UI Overhaul ⚔️✨

**Major Feature: Immersive Pre-Battle Experience**

The Single Fight mode now features a dramatic **"Versus" Lobby** that appears after selecting an opponent, completely transforming the pre-combat experience.

**Core Features:**
- 🎭 **Split-Screen Presentation** - Player vs Opponent with dynamic glows
  - Player section (left) with blue glow effect
  - Opponent section (right) with red/orange glow effect
  - Animated fighter displays with float effects
- 📊 **Live Stat Comparison** - Side-by-side stat bars with animations
  - ❤️ Health (HP) comparison
  - ⚔️ Attack (STR) comparison
  - ⚡ Speed comparison
  - 📏 Range comparison
  - Animated fill effects with shimmer
- 🎯 **Difficulty Rating System** - Dynamic power level assessment
  - 😎 Easy Victory (Green)
  - 💪 Favorable (Light Green)
  - ⚔️ Fair Fight (Yellow)
  - 🔥 Challenging (Orange)
  - ⚠️ Dangerous (Red)
  - 💀 Lethal (Dark Red)
- 🎨 **Glassmorphism Design** - Modern, lightweight UI aesthetic
  - Frosted glass panels with backdrop blur
  - Smooth animations and transitions
  - Rotating VS logo with dual-colored glow
- 🎮 **Quick Actions** - Convenient pre-battle options
  - ⚔️ ENTER ARENA - Primary action with pulse animation
  - 🎒 Edit Loadout - Quick access to equipment
  - ← Back - Return to opponent selection

**UI Flow Changes:**
```
Before: Title Screen → Opponent Selection → Combat Arena
Now:    Title Screen → Opponent Selection → Face-Off Screen → Combat Arena
                                                 ↓
                                           Edit Loadout (Optional)
```

**Game Balance Impact:**
- No direct combat changes - all mathematical balance preserved
- Prevents accidental "impossible" fights through clear warnings
- Empowers players with full information for strategic decisions

**Technical Implementation:**
- New `FaceOffComponent` Web Component
- Responsive design (desktop, tablet, mobile)
- Comprehensive animation library
- Updated E2E tests for new flow

See [Arena Face-Off Guide](./guides/ARENA_FACE_OFF_GUIDE.md) for complete documentation.

---

## [5.0.0] - 2026-01-22

### Added - Story Path Selection System 📖✨

**MAJOR FEATURE: Five Unique Narrative Paths**

Transformative update introducing **5 distinct story paths** with unique narratives, progression systems, and missions. Players now choose their story at character creation, fundamentally changing their gameplay experience.

### 🛤️ **The Five Story Paths**

#### 1. ⛓️ **Slave Gladiator Path** (12 missions)
**"Rise from bondage to claim your freedom"**
- **Core Mechanic**: Freedom Meter (0-100)
  - Earn freedom through victories and choices
  - Critical decision at 50% freedom: Escape or Continue
  - Path splits based on player choice
- **Narrative**: Captivity → Proving Ground → Choice → Freedom/Champion
- **Enemies**: Guards, Rival Slaves, Overseers, Champion Gladiators
- **Final Mission**: Freedom choice or Arena Champion (difficulty 12)

#### 2. 🏛️ **Roman Legionnaire Path** (15 missions)
**"Conquer the known world for Rome"**
- **Core Mechanics**: 
  - Rank System: Legionnaire → Optio → Centurion → Primus Pilus → Prefect → General
  - Controlled Territories (1-15 provinces)
  - Legion Morale and Political Power
- **Narrative**: Training → Barbarian Wars → Conquest → Political Intrigue
- **Enemies**: Barbarians, Rebels, Rival Legions, Enemy Generals
- **Final Mission**: "Empire's Glory" - Emperor's Champion (difficulty 15)

#### 3. 🏟️ **Lanista Path** (14 missions)
**"Build and manage your own gladiator school"**
- **Core Mechanics**:
  - Gladiator Roster (1-6 fighters to recruit/train)
  - Reputation (5-100)
  - Ludus Profit tracking
  - Patron relationships
- **Narrative**: Apprentice → Lanista → Business Growth → Arena Empire
- **Enemies**: Business Rivals, Corrupt Officials, Rogue Gladiators
- **Final Mission**: "Ludus Maximus" - Arena Empire (difficulty 14)

#### 4. 🗡️ **Barbarian Traveller Path** (13 missions)  
**"Journey across untamed lands, forging alliances"**
- **Core Mechanics**:
  - Discovered Locations (8 regions: Homeland, Forest, Mountain, Plains, Coast, Swamp, Desert, Rome)
  - Tribal Reputation (object tracking relations with multiple tribes)
  - Ancient Knowledge (1-100)
  - Alliances Made (4 possible)
- **Narrative**: Exile → Exploration → Alliance Building → United Tribes
- **Enemies**: Hostile Tribes, Wild Beasts, Roman Patrols, Warlords
- **Final Mission**: "United Tribes" - Unified Barbarian Alliance (difficulty 13)

#### 5. 🏜️ **Desert Nomad Path** (14 missions)
**"Master the harsh desert and its secrets"**
- **Core Mechanics**:
  - Water Current (100 starting, consumption/replenishment system)
  - Oases Discovered (6 total: First, Second, Nomad, Hidden, Prosperity, Eternal)
  - Caravans Defended (4 total)
  - Desert Reputation (5-100)
  - Trade Routes Established (3)
- **Narrative**: Survival → Prosperity → Desert Kingdom → Eternal Master
- **Enemies**: Desert Scavengers, Raiders, Sand Spirits, Desert Warlords
- **Final Mission**: "Master of Eternal Waters" - Spirit of the Desert (difficulty 15)

### 🎮 **System Features**

**Path Selection:**
- New `StoryPathSelection` component at character creation
- Interactive path cards with hover effects
- Detailed path descriptions and starting bonuses
- One-time choice (permanent per character)

**Mission System:**
- **68 total missions** across all 5 paths
- 3-Act structure per path:
  - Act 1: Introduction (missions 1-5)
  - Act 2: Development (missions 6-10)
  - Act 3: Climax (missions 11-15)
- Mission types: Standard, Boss, Survival (waves)
- Path-specific objectives and rewards

**Progression Tracking:**
- Path-specific progress bars and counters
- Dynamic UI showing path mechanics (freedom meter, rank badges, roster icons, location list, water gauge)
- Act-based mission display in Campaign Map
- Path progress saved to player state

**Starting Bonuses:**
- Slave Gladiator: +20 gold, iron_sword
- Roman Legionnaire: +50 gold, chainmail, iron_sword
- Lanista: +100 gold, 1 starter gladiator
- Barbarian: leather_vest, iron_sword, +10 strength
- Desert Nomad: +30 gold, leather_vest, +20 health

### 🏗️ **Technical Implementation**

**New Files Created (Phase 1 - Foundation):**
- `src/data/storyPaths.js` - Path definitions and data
- `src/components/StoryPathSelection.js` - Path selection UI
- Path-specific state in gameStore
- Routing integration with guards

**New Files Created (Phase 2 - Mission Databases, ~4600 lines):**
- `src/data/slave_gladiator_missions.js` (12 missions, 580+ lines)
- `src/data/roman_legionnaire_missions.js` (15 missions, 850+ lines)  
- `src/data/lanista_missions.js` (14 missions, 850+ lines)
- `src/data/barbarian_traveller_missions.js` (13 missions, 750+ lines)
- `src/data/desert_nomad_missions.js` (14 missions, 900+ lines)

**Modified Files (Phase 3 - Integration):**
- `src/game/StoryMode.js` - Path-based mission loading
- `src/components/CampaignMap.js` - Path-specific UI display
- `src/components/MissionBriefing.js` - Path-aware mission data
- `src/main-new.js` - Path integration in game loop

**State Management:**
```javascript
player: {
  storyPath: 'slave_gladiator' | 'roman_legionnaire' | 'lanista' | 'barbarian_traveller' | 'desert_nomad',
  pathSelected: true/false,
  pathProgress: {
    freedomMeter: 0-100,
    currentRank: 'legionnaire',
    controlledTerritories: [],
    gladiatorRoster: [],
    reputation: 0-100,
    discoveredLocations: [],
    tribalReputation: {},
    waterCurrent: 100,
    oasesDiscovered: [],
    caravansDefended: 0,
  },
  pathMechanics: {}, // Active path mechanics state
}
```

**Action System:**
- `selectStoryPath(pathId, startingBonus)` - Choose path
- `updatePathProgress(progressType, value)` - Update path metrics
- `updatePathMechanic(mechanicKey, value)` - Update mechanics
- `resetPathProgress()` - Clear path data

### 🎯 **Gameplay Impact**

**Replayability:**
- 5 completely different story experiences
- Unique progression systems per path  
- Path-specific enemies and challenges
- Different strategic focuses

**Narrative Depth:**
- Rich backstories and character development
- Branching narratives (Slave path)
- Cultural and historical authenticity
- Emotional story arcs

**Strategic Variety:**
- Resource management (Desert water)
- Territory control (Legionnaire conquest)
- Business simulation (Lanista management)
- Relationship building (Barbarian alliances)
- Freedom/morality choices (Slave path)

### 🔧 **Developer Features**

**Path Mission Utilities:**
Each path file includes 8-10 helper functions:
- `getAllPathMissions()` - Get all missions
- `getPathMissionById(id)` - Get specific mission
- `getAvailablePathMissions(mechanic, progress)` - Filter unlocked
- `isPathMissionUnlocked(id, completed, mechanic)` - Check availability
- `getPathMissionsByAct(act)` - Filter by act
- `getNextPathMission(currentId)` - Get next in sequence
- Plus path-specific utilities (calculateWaterStatus, getRankRequirements, etc.)

**Extensibility:**
- Easy to add new paths following established pattern
- Modular mission structure
- Path-independent core systems
- Clear separation of concerns

### 📊 **Statistics**

- **Total Missions**: 68 (up from 25)
- **Code Added**: ~6000+ lines
- **New Components**: 2 (StoryPathSelection, path-specific UI elements)
- **New Data Files**: 6 (1 paths definition + 5 mission databases)
- **Modified Systems**: 4 (StoryMode, CampaignMap, MissionBriefing, main game loop)

### 🐛 **Fixed**
- Mission loading now path-specific (no cross-path leakage)
- Campaign map displays appropriate missions per path
- Mission briefing works with path missions
- Save system properly stores path selection and progress

### ⚠️ **Breaking Changes**
- Story missions now require path selection
- Old storyMissions.js used only as fallback
- Campaign Map UI completely redesigned (regions → acts)
- Mission availability logic path-specific

### 📚 **Documentation**
- Added inline JSDoc for all path utilities
- Comprehensive mission descriptions
- Path mechanics explained in storyPaths.js
- Updated game guides with path information

### 🎨 **UI/UX Improvements**
- Beautiful path selection screen with hover effects
- Path-specific progress visualization
- Act-based mission navigation
- Dynamic path mechanics display (meters, badges, counters)
- Responsive design for all path UI elements

**Version**: 5.0.0  
**Release Date**: January 22, 2026  
**Development Time**: ~10 hours (3 phases)

This is a **MAJOR MILESTONE** - the game now has 5× more content and infinite replayability! 🎉🎮

---

**Game Balance Impact:**
- No direct combat changes - all mathematical balance preserved
- Prevents accidental "impossible" fights through clear warnings
- Empowers players with full information for strategic decisions

**Technical Implementation:**
- New `FaceOffComponent` Web Component
- Responsive design (desktop, tablet, mobile)
- Comprehensive animation library
- Updated E2E tests for new flow

See [Arena Face-Off Guide](./guides/ARENA_FACE_OFF_GUIDE.md) for complete documentation.

---

## [4.11.0] - 2026-01-14

### Added - Talent Tree System ⭐🌳

**Major Feature: Deep Character Customization**

The Talent System adds massive replayability and build diversity to your character. Each class now has **3 unique specialization trees** with multiple talent nodes providing stat bonuses and passive abilities.

**Core Features:**
- 🌳 **3 Talent Trees Per Class** - Each class has distinct specializations
  - WARRIOR: Arms (DPS), Fury (Burst), Protection (Tank)
  - MAGE: Fire (Burn), Frost (Control), Arcane (Power)
- 📊 **Progressive Talent Points** - Earn 1 talent point per level (starting at level 2)
  - Level 10 = 9 talent points
  - Level 20 = 19 talent points
- 🎯 **Talent Dependencies** - Strategic progression with prerequisites
  - Foundation talents (Row 0) - No requirements
  - Tier 1 talents (Row 1) - Require 5 points in tree
  - Tier 2 talents (Row 2) - Require 10 points in tree + prerequisites
  - Capstone talents (Row 3) - Require 15 points in tree + multiple prerequisites
- 💪 **40+ Unique Talents** - 20+ talents per class with multiple ranks
- ⚡ **Two Effect Types**:
  - **Stat Modifiers**: +Strength, +Health, +Defense, +Crit Chance/Damage, +Mana Regen, +Movement
  - **Passive Abilities**: Execute, Bleed, Block, Ignite, Lifesteal, Slow/Freeze, Cleave, Reflect, Taunt, and more

**WARRIOR Talent Trees:**
- ⚔️ **Arms (DPS)** - Weapon mastery and devastating strikes
  - Weapon Mastery (Rank 5): +2 Strength per rank
  - Precise Strikes (Rank 3): +2% Crit Chance per rank
  - Execute (Capstone): +50% damage to enemies below 20% HP
  - Mortal Strike: Attacks cause bleeding
  - Bladestorm (Ultimate): +50% Critical Damage
- 😤 **Fury (Burst)** - Rage-fueled relentless attacks
  - Building Rage (Rank 5): +1 STR, +1% Crit per rank
  - Enrage: Critical hits grant temporary strength boost
  - Rampage (Rank 3): Stacking damage on consecutive attacks
  - Bloodthirst (Rank 3): 5% lifesteal on critical hits
  - Reckless Abandon (Ultimate): +20% damage, +30% crit chance
- 🛡️ **Protection (Tank)** - Impenetrable defense and battlefield control
  - Thick Skin (Rank 5): +3 Defense per rank
  - Toughness (Rank 5): +25 HP per rank
  - Shield Block (Rank 3): 10% chance to block attacks per rank
  - Challenging Shout: Force enemies to attack you (taunt)
  - Shield Wall (Ultimate): +50 Defense, reflect 20% damage

**MAGE Talent Trees:**
- 🔥 **Fire (Burn)** - Devastating flames and damage over time
  - Flame Touched (Rank 5): +2 Spell Damage per rank
  - Critical Mass (Rank 3): +3% Crit Chance per rank
  - Ignite: Critical strikes set enemies on fire (8 damage over 4 turns)
  - Pyroblast: 15% chance to deal 2.5x damage
  - Combustion (Ultimate): Ignite explodes for AoE damage
- ❄️ **Frost (Control)** - Battlefield control with ice and cold
  - Ice Veins (Rank 5): +1 Damage, +2 Defense per rank
  - Frost Nova: Attacks slow enemy movement
  - Ice Barrier (Rank 3): Absorb 20 damage per rank
  - Deep Freeze: 20% chance to freeze enemies in place
  - Blizzard (Ultimate): AoE frost damage and control
- 🔮 **Arcane (Power)** - Raw magical power
  - Arcane Power (Rank 5): +3 Damage per rank
  - Arcane Intellect (Rank 3): +2 Mana Regen per rank
  - Arcane Missiles: Attacks hit multiple times
  - Arcane Surge (Rank 3): Attacks amplify next spell (10% per rank, stacks)
  - Arcane Mastery (Ultimate): +25 STR, +5 Mana Regen, +15% Crit, +25% all damage

**UI & Interaction:**
- 🎨 **Beautiful Talent Tree Screen** - Interactive node-based interface
  - Visual dependency connections between talents
  - Color-coded talent states: Locked (gray), Available (green), Learned (blue), Maxed (gold)
  - Detailed tooltips showing effects, requirements, and descriptions
  - Real-time point counter (available/spent)
- 🖱️ **Intuitive Controls**:
  - Left-click to learn talents
  - Right-click to unlearn talents
  - Hover for detailed tooltips
- 🔄 **Respec System** - Reset all talents anytime
  - Cost: 50 gold × total talent points spent
  - All points refunded immediately

**Integration & Mechanics:**
- ⚔️ **Fighter Integration** - Talents apply to all game modes
  - Stat bonuses automatically added to fighter stats
  - Passive abilities stored and checked during combat
  - `applyTalents()` method for fighter creation
- 🎮 **Universal Application** - Works in ALL game modes:
  - Story Mode missions
  - Tournament battles
  - Single combat
  - Grid combat system
- 💾 **Save System** - Talents fully integrated with save/load
  - Talent selections persist across sessions
  - Backward compatible with older saves
  - State stored in `player.talents` (tree1, tree2, tree3)

**Navigation:**
- 📍 **Top Navigation Bar** - "⭐ Talents" button between Profile and Achievements
- 🔗 **Direct URL Access** - `/talents` route with character creation guard

**Technical Implementation:**
- 🔧 **TalentManager** - Core system for managing talent trees
  - `getTalentTrees(class)` - Retrieve talent trees by class
  - `learnTalent(treeId, talentId)` - Spend talent point
  - `unlearnTalent(treeId, talentId)` - Refund talent point
  - `canLearnTalent()` - Validate prerequisites and requirements
  - `resetAllTalents(cost)` - Full respec with gold cost
  - `getActiveTalentEffects()` - Aggregate all active effects
  - `applyTalentsToFighter(fighter)` - Apply bonuses to fighter
- 📊 **State Management** - Redux-like pattern with gameStore
  - Actions: `LEARN_TALENT`, `UNLEARN_TALENT`, `RESET_TALENTS`
  - Reducers handle state mutations
  - Real-time UI updates via store subscriptions
- 📁 **Data Structure** - JSON-based talent definitions
  - `src/data/talents.js` - 40+ talent definitions
  - Flexible structure for easy expansion

**Testing & Quality:**
- ✅ **29 Unit Tests** - All passing with 100% success rate
  - Talent tree retrieval
  - Point management and calculations
  - Learning/unlearning validation
  - Prerequisite checking
  - Respec functionality
  - Effect aggregation
  - Fighter integration
- 📝 **Comprehensive Documentation**:
  - `guides/TALENT_SYSTEM_GUIDE.md` - Full user guide (300+ lines)
  - Sample builds for each specialization
  - Strategy guide (early/mid/late game)
  - FAQ with 10+ common questions

**Strategic Depth:**
- 🎯 **Build Diversity** - Countless build combinations
  - Pure DPS builds (Arms/Fire)
  - Tank builds (Protection/Frost)
  - Hybrid builds (mix trees)
- 🧠 **Strategic Choices** - Can't max everything!
  - 19 points max at level 20
  - Must choose between trees
  - Trade-offs between foundation and capstone talents
- 🔄 **Replayability** - Try different builds
  - Same class, different playstyle
  - Respec for specific challenges
  - Experiment with synergies

**Sample Builds:**
```
Warrior - Arms DPS (19 points):
├── Arms (15): Weapon Mastery 5/5, Execute, Bladestorm
└── Fury (4): Building Rage 4/5
Result: +14 STR, +10% Crit, +50% Crit Dmg, Execute passive

Mage - Fire Burst (19 points):
├── Fire (15): Flame Touched 5/5, Ignite, Combustion
└── Arcane (4): Arcane Power 4/5
Result: +22 Dmg, +9% Crit, Ignite + AoE explosion
```

**Performance:**
- ⚡ **Zero Performance Impact** - Calculations done at fighter creation
- 💾 **Minimal Save Size** - Only stores allocated points (compact format)
- 🔄 **Real-time Updates** - Instant UI feedback on talent changes

**Future Expansion:**
- More classes with unique trees (Assassin, Berserker, Paladin, Necromancer)
- Additional talent rows (5-6)
- Legendary/Ultimate tier talents
- Talent presets (save/load builds)
- Talent import/export codes

**Files Added:**
- `src/game/TalentManager.js` - Core talent management system
- `src/data/talents.js` - Talent tree definitions (40+ talents)
- `src/components/TalentTreeScreen.js` - Interactive UI component
- `src/styles/components/TalentTreeScreen.scss` - Talent tree styling
- `tests/unit/TalentManager.test.js` - Unit tests (29 tests)
- `guides/TALENT_SYSTEM_GUIDE.md` - Comprehensive documentation

**Files Modified:**
- `src/store/gameStore.js` - Added talents state
- `src/store/reducers.js` - Added talent reducers
- `src/entities/Fighter.js` - Talent integration methods
- `src/components/NavigationBar.js` - Added Talents button
- `src/main-new.js` - Added showTalentTreeScreen handler
- `src/config/routes.js` - Added /talents route
- `package.json` - Version bump to 4.11.0

This is a **game-changing feature** that transforms character progression! Two Level 10 Warriors can now be completely different based on their talent choices. 🎮⭐

---

## [4.10.2] - 2026-01-13

### Fixed
- **Story Mode Achievements** - Fixed achievements not tracking for story missions, bosses, and survival modes
- **Tournament Stats** - Fixed tournament statistics not being tracked properly
- **Marketplace Stats** - Fixed marketplace purchase and sale statistics tracking
- Migrated remaining `SaveManager.increment()` calls to use `gameStore.dispatch(incrementStat())`
- Completed state management migration that was partially finished in v4.10.0

---

## [4.10.1] - 2026-01-13

### Added - Spawn Zone Validation System \ud83c\udfaf

**Strategic Spawn Positioning:**
- **Spawn Zones** - Dedicated areas for fighter placement
  - Player spawn zone: Bottom 2 rows (y=3, y=4)
  - Enemy spawn zone: Top 2 rows (y=0, y=1)
- **Terrain Validation** - Prevents spawning on impassable terrain
  - No spawning on walls (\ud83e\uddf1)
  - No spawning on pits (\u26ab)
  - Only passable terrain allowed for initial placement
- **Smart Fallback System** - Ensures fighters always spawn successfully
  - Tries preferred position first (player: 0,4 | enemy: 4,0)
  - Falls back to random valid position in spawn zone
  - Final fallback scans entire spawn row
  - Logs warnings if placement fails

**Strategic Benefits:**
- \ud83d\udee1\ufe0f **Protect Squishies** - Position mages behind tanks in spawn zone
- \ud83c\udfaf **Tactical Setup** - Choose advantageous starting positions
- \u26d3\ufe0f **Bug Fix** - No more spawning on walls that restrict movement
- \ud83e\udde0 **AI Intelligence** - AI also gets valid spawn positions

**Technical Implementation:**
- `GridManager.getValidSpawnZones(side)` - Get all valid positions for a side
- `GridManager.placeFighter(fighter, x, y)` - Validates terrain passability
- `GridCombatIntegration.placeFightersInitial()` - Smart placement with fallbacks
- `GridCombatIntegration.getSpawnZonePositions(side)` - Helper for UI/testing

**API Reference:**
```javascript
// Get valid spawn positions
const playerSpawns = gridManager.getValidSpawnZones('player');
const enemySpawns = gridManager.getValidSpawnZones('enemy');

// Place fighter (with automatic validation)
const success = gridManager.placeFighter(fighter, x, y);
if (!success) {
  console.warn('Cannot spawn on impassable terrain!');
}

// Get spawn zone info for UI
const spawnZones = gridCombatIntegration.getSpawnZonePositions('player');
```

---

## [4.10.0] - 2026-01-13

### Fixed - Complete State Management Migration 🔧

**Critical Bug Fixes:**
- **Story Mode Mission Completion** - Fixed "Mission failed - Unknown mission" error after winning battles
  - StoryMode now uses gameStore instead of SaveManager for all state operations
  - Mission completion properly tracks and saves mission state
  - All story progress correctly persists across sessions

- **Statistics Tracking** - Fixed ALL stat tracking across the entire game (28+ calls)
  - Migrated all `SaveManager.increment()` calls to `gameStore.dispatch(incrementStat())`
  - Battle statistics (wins, losses, damage dealt, crits, etc.) now track in all modes
  - Win/loss streak tracking fully migrated to gameStore with `UPDATE_STREAK` action
  - Story mode combat now properly updates battle performance stats
  - Combat stats work correctly in single combat, tournament, and story missions

- **Marketplace Activity Stats** - Fixed items sold and gold from sales not tracking
  - Stat tracking code was incorrectly placed after early return statement
  - Now properly tracks `itemsSold` and `goldFromSales` on successful sales
  - Purchase stats (`itemsPurchased`, `legendaryPurchases`) confirmed working

**State Management Refactor:**
- **Unified Architecture** - All game managers now use gameStore as single source of truth
  - `StoryMode.js` - Fully migrated to gameStore actions
  - `EconomyManager.js` - Reads gold from gameStore.getState()
  - `LevelingSystem.js` - All XP/level operations via gameStore
  - `EquipmentManager.js` - Inventory management through gameStore
  - `DurabilityManager.js` - Durability updates + stat tracking
  - `AchievementManager.js` - Achievement unlocks via gameStore
  - `MarketplaceManager.js` - Shop operations with stat tracking
  - `game.js` (Combat Engine) - All 28 stat tracking calls use gameStore

- **Removed Force-Saves** - Eliminated 4 immediate save operations after combat
  - Relies on 30-second auto-save interval instead
  - Prevents excessive localStorage writes
  - Reduces save file corruption risk

**Profile & UI Fixes:**
- **XP Display** - Fixed negative XP percentages (was showing -167%)
  - ProfileScreen now uses `getLevelFromXP()` for correct level calculation
  - Handles level/XP data mismatches gracefully
  
- **XP Progress Bar** - Fixed visual progress bar not filling
  - Calculates progress locally from xpForCurrentLevel/xpForNextLevel
  - Shows accurate visual representation of XP progress

- **Story Progress** - Fixed story progress showing 0%
  - Updated to handle new `completedMissions` object format: `{ 'mission_id': { stars: 3, completedAt: timestamp } }`
  - Uses `Object.keys(completedMissions).length` instead of array length
  - `getTotalStars()` correctly reads from object values

- **Profile Dates** - Fixed "Invalid Date" display
  - Added null checks for `createdAt` and `lastPlayedAt`
  - Shows 'N/A' or current date as fallback
  - Character creation now sets timestamps properly

**Inventory & Equipment Fixes:**
- **Equipped Items in Inventory** - Fixed equipped items still showing in inventory list
  - `EQUIP_ITEM` reducer now removes item from inventory.equipment array
  - `UNEQUIP_ITEM` reducer adds item back to inventory
  - Equipped items properly filtered from inventory display

- **Selling Items** - Fixed sold items not being removed from inventory
  - Fixed critical bug in `REMOVE_ITEM` reducer
  - Changed comparison from `item.id !== itemId` to `item !== itemId`
  - Inventory stores string IDs, not objects

**Save System Improvements:**
- **Reset Progress** - Fixed reset creating default saves immediately
  - Added `isResetting` flag to gameStore to prevent beforeunload save
  - `SaveManager.load()` now returns `null` instead of auto-creating profiles
  - True reset now clears all data and forces character creation

- **Character Creation** - Fixed profile access denied after creating character
  - Character creation now dispatches `updatePlayer()` action
  - Sets `characterCreated: true` in gameStore (enables route guards)
  - Auto-save only starts after character creation completes
  - Added `createdAt` and `lastPlayedAt` timestamps

**UI/UX Fixes:**
- **Wiki Back Button** - Fixed non-functional back button on Game Wiki screen
  - Removed duplicate back button elements
  - Added missing `id="backBtn"` attribute
  - Event listener now properly connects to button

**Test Suite Updates:**
- **SaveManagerV2 Tests** - Updated all tests to expect `null` when no save exists
  - Changed from expecting default profile to expecting `null`
  - Matches new SaveManager behavior
  
- **Unit Test Mocks** - Fixed "SaveManagerV2.load is not a function" errors
  - Added `load: vi.fn(() => null)` to SaveManager mocks
  - Fixed AchievementManager, EconomyManager, and LevelingSystem tests
  - All 8 previously failing tests now pass

### Changed
- **Data Migration** - `completedMissions` format changed from array to object
  - Old: `['mission_id_1', 'mission_id_2']`
  - New: `{ 'mission_id_1': { stars: 3, completedAt: 1234567890 } }`
  - Provides star ratings and completion timestamps
  - Backwards compatible via migration in gameStore

- **Auto-Save Behavior** - Conditional auto-save initialization
  - Auto-save only starts if `characterCreated: true`
  - Prevents empty save file creation before character setup
  - Starts immediately after character creation event

### Technical Details

**GameStore Actions Used:**
- `setCurrentMissionState` - Track active story mission
- `completeMissionAction` - Complete mission with stars/rewards
- `unlockRegionAction` - Unlock new story regions
- `incrementStat` - Increment any statistic by amount
- `updateStreak` - Update win/loss streak and best streak
- `equipItemAction` - Equip item and remove from inventory
- `unequipItemAction` - Unequip item and return to inventory
- `removeItem` - Remove item from inventory (selling/consuming)
- `addItem` - Add item to inventory
- `updatePlayer` - Update player properties
- `unlockAchievementAction` - Unlock achievement

**Files Modified:**
- `src/game/game.js` - 28 stat tracking calls migrated
- `src/game/StoryMode.js` - Complete gameStore migration
- `src/game/MarketplaceManager.js` - Fixed stat tracking placement
- `src/store/reducers.js` - Fixed EQUIP_ITEM, UNEQUIP_ITEM, REMOVE_ITEM
- `src/store/gameStore.js` - Added isResetting flag, conditional auto-save
- `src/utils/SaveManagerV2.js` - load() returns null, no auto-creation
- `src/components/ProfileScreen.js` - Fixed XP/progress/dates/story display
- `src/components/CharacterCreation.js` - Added timestamps, gameStore sync
- `src/components/WikiScreen.js` - Fixed back button
- `src/main-new.js` - Conditional auto-save start
- All test files - Updated for new SaveManager behavior

---

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

[4.0.0]: https://github.com/todorivanov/legends-of-the-rena/releases/tag/v4.0.0
[3.0.0]: https://github.com/todorivanov/legends-of-the-rena/releases/tag/v3.0.0
[2.0.0]: https://github.com/todorivanov/legends-of-the-rena/releases/tag/v2.0.0
[1.0.0]: https://github.com/todorivanov/legends-of-the-rena/releases/tag/v1.0.0
