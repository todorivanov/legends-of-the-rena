# ObjectFighterJS v2.0 ⚔️

A browser-based fighting game where objects battle each other in epic turn-based combat.

## 🎮 Game Modes

### Single Match
Select two fighters and watch them battle in a 1v1 arena.

### Team Match
Drag & drop multiple fighters into two teams and witness an epic team battle.

## ✨ Features

### Combat System
- **Normal Attacks**: Standard damage with 90% hit chance
- **Special Attacks**: High damage critical strikes with 20% chance
- **Consumables**: Potions and food that randomly appear during battle
- **Miss Chance**: 10% chance to miss any attack

### Dynamic Events
**6 random events** can shake up any battle:
- 🌍 **Earthquake**: Global damage (-100 HP)
- 🌕 **Full Moon**: Wild beasts attack one team (-50% HP)
- ☠️ **Poisoned Food**: 5 rounds of poison damage (-20 HP/round)
- ⚡ **Lightning Storm**: 2 rounds of electric damage (-50 HP/round)
- 🔥 **Fire Eruption**: 3 rounds of burning (-30 HP/round)
- ❄️ **Blizzard**: 4 rounds of freezing damage (-15 HP/round)

### Fighters
Choose from **10 unique fighters** across 5 different classes:

**🔴 Glass Cannon** - High damage, low HP
- **Ivan**: 800 HP, 20 STR - Devastating attacks, fragile defense
- **Viktor**: 850 HP, 18 STR - Aggressive striker

**🟢 Balanced** - Equal offense and defense
- **Gosho**: 1000 HP, 10 STR - Perfect for beginners
- **Marina**: 1100 HP, 9 STR - Tactical and consistent

**🔵 Tank** - Massive HP, weak attacks
- **Jivko**: 2000 HP, 4 STR - Impenetrable defense
- **Dimitri**: 1800 HP, 5 STR - Superior endurance

**🟡 Bruiser** - High HP, moderate damage
- **Bobba**: 1500 HP, 6 STR - Reliable in long fights
- **Nikolai**: 1200 HP, 8 STR - Relentless pressure

**🟠 Warrior** - Offensive focus
- **Petar**: 900 HP, 11 STR - Power and survivability
- **Svetlana**: 950 HP, 13 STR - Versatile combatant

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

## 🛠️ Technology Stack

- **Build Tool**: Vite 5 (⚡ lightning fast)
- **UI Framework**: Bootstrap 5
- **Language**: Modern JavaScript (ES2022+)
- **Code Quality**: ESLint + Prettier

## 📝 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code |

## 🎯 How to Play

1. **Choose Game Mode**: Select Single Fight or Team Match
2. **Select Fighters**: 
   - Single: Click two fighters to battle
   - Team: Drag & drop fighters into Team One and Team Two
3. **Start Fight**: Click "Start Fight" button
4. **Watch the Battle**: Combat is automatic with real-time log
5. **Victory**: Last fighter/team standing wins!

## 📚 Documentation

- **[Migration Guide](MIGRATION_GUIDE.md)**: Upgrading from v1.0 to v2.0
- **[Phase 1.1 Complete](PHASE_1.1_COMPLETE.md)**: Core dependencies upgrade
- **[Phase 1.2 Complete](PHASE_1.2_COMPLETE.md)**: Architecture refactoring  
- **[Phase 2 Complete](PHASE_2_COMPLETE.md)**: Bug fixes & content expansion
- **[Phase 4 Complete](PHASE_4_COMPLETE.md)**: UI/UX overhaul with animations

## 🔄 Recent Updates

### v2.3.0 - UX Improvements (Jan 8, 2026) 🎯
- 🖥️ **Fullscreen arena** - Immersive viewport experience
- 📊 **Live fighter stats HUD** - Real-time health bars at top
- 🔊 **Fixed sound system** - Proper Web Audio API initialization
- 🎨 **Color-coded health** - Green/yellow/red bars with pulse

### v2.2.0 - Phase 4 Complete (Jan 8, 2026) 🎨
- 🎬 **20+ CSS animations** (slide, shake, pulse, zoom effects)
- 🌙 **Dark mode** with smooth transitions and persistence
- 🔊 **6 sound effects** (Web Audio API, zero latency)
- 💥 **Floating damage numbers** (color-coded by type)
- ✨ **Enhanced fighter cards** (3D transforms, shimmer effects)

### v2.1.0 - Phase 2 Complete (Jan 8, 2026)
- ✅ **10 fighters** with working avatars (was 5 with broken images)
- ✅ **6 random events** (doubled from 3)
- ✅ **Visual health bars** with color indicators
- ✅ **Emoji-rich combat log** for better UX
- ✅ **Fighter classes** (Tank, Glass Cannon, Balanced, etc.)

### v2.0.0 - Phase 1 Complete (Jan 8, 2026)
- ⚡ **17x faster** dev server (Webpack → Vite)
- 🗑️ **Removed jQuery** (vanilla JS)
- 🏗️ **Clean architecture** (eliminated global state)
- 📉 **50% less code duplication**

## 📦 Project Structure

```
ObjectFighterJS/
├── src/
│   ├── api/
│   │   └── mockFighters.js      # Fighter data
│   ├── entities/
│   │   ├── baseEntity.js        # Base combat entity
│   │   ├── fighter.js           # Fighter class
│   │   ├── referee.js           # Game referee
│   │   └── team.js              # Team class
│   ├── game/
│   │   ├── consumables.js       # Healing items
│   │   ├── game.js              # Game engine
│   │   └── GameEvent.js         # Random events
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── logger.js            # Combat logger
│   ├── index.css                # Styles
│   └── main.js                  # Entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
└── vite.config.js              # Vite configuration
```

## 🤝 Contributing

This is a learning project demonstrating OOP principles in JavaScript.

## 📄 License

MIT License - See LICENSE file

## 👤 Author

Todor Ivanov

---

**Version**: 2.3.0  
**Status**: Polished & Ready - Try it at http://localhost:3000  
**Next Phase**: Phase 3 - Gameplay Enhancements (Player Control, Skills, Status Effects)
