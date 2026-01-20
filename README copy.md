# Legends of the Arena v4.11 ⚔️

**A modern browser-based RPG fighting game with tactical grid combat, story campaigns, character progression, talent trees, and dynamic equipment systems.**

> **Latest Update (v4.11.0):** 🌟 **Talent Tree System!** Deep character customization with 3 specialization trees per class, 40+ unique talents, passive abilities, and strategic build diversity. Level up to earn talent points and create your perfect warrior or mage! [See full changelog](CHANGELOG.md#4110---2026-01-14)

## 🎮 [Play Live Demo](https://todorivanov.github.io/legends-of-the-rena/)

---

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/legends-of-the-rena.git
   cd legends-of-the-rena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the game**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🌟 Key Features

### ⭐ **Talent Tree System** ⭐NEW in v4.11⭐
- **3 specialization trees per class** - Arms, Fury, Protection | Fire, Frost, Arcane
- **40+ unique talents** with multiple ranks
- **Progressive talent points** - 1 point per level (max 19 at level 20)
- **Strategic dependencies** - prerequisites and point requirements
- **Stat modifiers** - +Strength, +Health, +Defense, +Crit, +Mana
- **Passive abilities** - Execute, Bleed, Block, Ignite, Lifesteal, Freeze
- **Respec system** - Reset talents anytime for gold
- **Build diversity** - Countless combinations for unique playstyles

### 🗺️ **Tactical Grid Combat**
- **5x5 tactical grid** with 10 distinct terrain types
- **Strategic positioning** - terrain provides bonuses/penalties
- **Movement skills** - class-specific movement abilities
- **Weapon ranges** - melee (1 cell) vs ranged (2-4 cells)
- **Line of sight** mechanics and flanking bonuses
- **Enhanced visuals** - animated terrains, gradients, patterns

### 🎮 **Game Modes**
- **Story Mode** - 25-mission campaign across 5 regions
- **Single Combat** - Quick battles with custom characters
- **Tournament Mode** - 3-round championship brackets

### 👤 **Character System**
- **10 unique classes** with distinct playstyles
- **Level progression** (1-20) with stat bonuses
- **Talent system** - 3 specialization trees with deep customization
- **Equipment system** - 24 items across 4 rarity tiers
- **Combo system** - chain attacks for powerful effects
- **17 status effects** with interaction matrix

### 💰 **Economy & Progression**
- **Marketplace** - buy, sell, and repair equipment
- **Gold currency** - earn from battles and missions
- **Achievements** - 25 unlockables with 6000+ XP rewards
- **Difficulty levels** - Easy to Nightmare with scaled rewards

### 💾 **Advanced Features**
- **Multiple save slots** with import/export
- **Data compression** for efficient storage
- **Version migration** for seamless updates
- **Auto-backup** to protect your progress
- **Native Web Components** - zero framework dependencies
- **Modern UI/UX** with glassmorphism design

---

## 📚 Documentation

### 📖 **User Guides**
- [Talent System Guide](guides/TALENT_SYSTEM_GUIDE.md) - Talent trees, builds, and strategies ⭐NEW⭐
- [Story Mode Guide](guides/STORY_MODE_GUIDE.md) - Campaign walkthrough
- [Character Classes Guide](guides/CHARACTER_CLASSES_GUIDE.md) - Class details and strategies
- [Equipment System Guide](guides/EQUIPMENT_SYSTEM_GUIDE.md) - Items and gear
- [Achievements Guide](guides/ACHIEVEMENTS_GUIDE.md) - All 25 achievements
- [Tournament Mode Guide](guides/TOURNAMENT_MODE_GUIDE.md) - Championship system
- [Marketplace Guide](guides/MARKETPLACE_GUIDE.md) - Economy and trading
- [Difficulty System Guide](guides/DIFFICULTY_SYSTEM_GUIDE.md) - Challenge levels

### 🔧 **Technical Documentation**
- [Grid Combat System](docs/GRID_COMBAT_SYSTEM.md) - Tactical grid mechanics ⭐
- [Weapon Range System](docs/WEAPON_RANGE_SYSTEM.md) - Attack distances ⭐
- [Status Effects](docs/STATUS_EFFECTS.md) - Effect system and interactions
- [Combo System](docs/COMBO_SYSTEM.md) - Combo chains and bonuses
- [Combat Phases](docs/COMBAT_PHASES.md) - Phase system architecture
- [State Management](docs/STATE_MANAGEMENT.md) - Store pattern
- [Save System V2](docs/SAVE_SYSTEM_V2.md) - Advanced save features
- [AI System](docs/AI_SYSTEM.md) - Behavior trees and personalities
- [Performance Optimization](docs/PERFORMANCE_OPTIMIZATION.md) - Lazy loading, pooling
- [Testing](docs/TESTING.md) - Test framework and strategies

### 📝 **Project Documentation**
- [Migration Guide](guides/MIGRATION_GUIDE.md) - Version upgrade guide
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards
- [Changelog](CHANGELOG.md) - Version history and updates

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:all
npm run test:coverage

# Watch mode
npm run test:watch
```

See [docs/TESTING.md](docs/TESTING.md) for detailed testing documentation.

---

## 🚀 Technology Stack

- **Frontend**: Native Web Components (zero dependencies!)
- **Build Tool**: Vite 5
- **Testing**: Vitest + Playwright
- **Storage**: LocalStorage with LZ-String compression
- **Styling**: CSS3 with modern features (Grid, Flexbox, Animations)
- **ES Modules**: Modern JavaScript (ES2021+)

---

## 📁 Project Structure

```
src/
├── ai/              # AI behavior trees and personalities
├── components/      # Web Components (UI)
├── config/          # Game configuration and routes
├── data/            # Game data (classes, equipment, missions)
├── entities/        # Core game entities (Fighter, Team, Referee)
├── game/            # Game systems (Combat, Grid, Economy, etc.)
├── store/           # State management
├── styles/          # Global styles and themes
└── utils/           # Utility functions and helpers

docs/                # Technical documentation
guides/              # User guides
tests/               # Test suites (unit, integration, e2e)
```

---

## 🎨 In-Game Wiki

The game includes a comprehensive **in-game wiki** accessible from the main menu:
- 🗺️ Grid Combat - Tactical system guide
- 📖 Story Mode - Campaign information
- 🎯 Status Effects - All effects and interactions
- 🏪 Marketplace - Shopping guide
- 💰 Economy - Gold and progression
- 🎭 Classes - Character class details
- 🏅 Achievements - All unlockables
- ⚔️ Equipment - Item database
- 🏆 Tournament - Championship guide
- ⚙️ Difficulty - Challenge levels

---

## 🔄 Recent Updates (v4.9.0)

### ✨ **Enhanced Terrain Visuals**
- Rich gradient backgrounds for all terrain types
- Unique texture patterns (grass stripes, wave patterns, brick walls)
- Animated effects (water shimmer, fire pulse, ice sparkle)
- 3D-style elevation (high ground raised, low ground sunken)
- Larger, centered terrain icons for better visibility

### 🎯 **Weapon Range System**
- Attack ranges based on weapon and class type
- Visual indicators when targets are out of range
- Strategic positioning required for combat
- AI intelligently moves to attack range

### 🏃 **Movement Skills**
- Movement as class-specific skills with mana costs
- Interactive grid movement with cell highlighting
- Cooldown system for strategic depth

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Font: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- Icons: Unicode emoji characters
- Inspiration: Classic RPG and tactical strategy games

---

## 📧 Contact

- **Author**: Todor Ivanov
- **GitHub**: [@TodorIvanov](https://github.com/TodorIvanov)
- **Repository**: [Legends of the Rena](https://github.com/todorivanov/legends-of-the-rena)

---

**⚔️ May the best fighter win! ⚔️**
