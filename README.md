# Legends of the Arena v4.0 ⚔️

**An epic browser-based RPG fighting game with story mode, turn-based tactical combat, character progression, equipment systems, and marketplace economy.**

## 🎮 [Play Live Demo](https://todorivanov.github.io/ObjectFighterJS/)

> **Note**: Once you enable GitHub Pages, your game will be available at the link above!

---

## ✨ Key Features

### 🎯 **Tactical Turn-Based Combat**
- **Player-controlled actions** - Choose your moves strategically
- **4 action types** - Attack, Defend, Use Skill, Use Item
- **Class-specific skills** - 2 unique abilities per class
- **Status effects** - Buffs, debuffs, damage-over-time
- **Combo system** - Chain attacks for bonus damage
- **Critical hits** - 15% chance for 1.5x damage

### 🎮 **Multiple Game Modes**
- **Story Mode** - Epic 25-mission campaign across 5 unique regions
- **Single Combat** - Face an opponent with your custom character
- **Team Battle** - Assemble and command teams in epic battles
- **Tournament Mode** - 3-round bracket championship with escalating rewards

### 👤 **Character Progression**
- **Create your character** - Choose name, class, and avatar
- **Level system** - Gain XP and level up (1-20)
- **Stat bonuses** - Increase HP, Strength, and Defense per level
- **Profile tracking** - View wins, losses, streaks, and statistics

### ⚔️ **Equipment System**
- **24 unique items** - 10 weapons, 8 armor pieces, 6 accessories
- **4 rarity tiers** - Common, Rare, Epic, Legendary
- **Stat bonuses** - Strength, HP, Defense, Crit Chance, Mana Regen
- **Durability system** - Items degrade and require repairs
- **Level requirements** - Unlock powerful gear as you progress
- **Class restrictions** - Specialized equipment for each class

### 🏆 **Tournament Mode**
- **3 difficulty levels** - Normal, Hard, Nightmare
- **Progressive rewards** - 300-600 XP + guaranteed equipment drops
- **Bracket progression** - Quarter Final → Semi Final → Grand Final
- **Champion status** - Track tournament wins and titles

### 🏅 **Achievement System**
- **25 achievements** across 4 categories
- **6,000+ total XP** available from achievements
- **Progress tracking** - Real-time progress bars
- **Unlock notifications** - Celebrate your accomplishments

### ⚙️ **Difficulty Levels**
- **Easy** - Forgiving gameplay for newcomers (+30% player HP/STR)
- **Normal** - Balanced challenge for most players
- **Hard** - Tough opponents with +30% XP rewards
- **Nightmare** - Extreme challenge with +50% XP and best loot

### 🎨 **Modern UI/UX**
- **Native Web Components** - Zero dependencies, lightweight
- **Glass morphism design** - Beautiful, modern aesthetic
- **Dark theme** - Easy on the eyes
- **Smooth animations** - Polished user experience
- **Sound effects** - Immersive audio feedback
- **Responsive design** - Works on all screen sizes

### 💰 **Marketplace & Economy**
- **Gold currency** - Earn from battles, missions, and tournaments
- **Rotating shop** - New items every 24 hours
- **Buy & Sell** - Trade equipment for profit
- **Repair shop** - Restore durability of damaged items
- **Consumables** - Purchase health and mana potions

### 📖 **Story Mode Campaign**
- **25 epic missions** across 5 unique regions
- **Boss battles** with legendary opponents
- **Survival mode** - Face multiple waves of enemies
- **Star rating** - Complete objectives for bonus rewards
- **Branching paths** - Choose between Forest or Mountain
- **Rich narrative** - Dialogue and story progression

### 📚 **In-Game Wiki**
- Comprehensive guides for all game systems
- Achievement database
- Equipment catalog
- Tournament strategies
- Difficulty comparisons

---

## 🎮 Game Modes

### **Story Mode** ⭐NEW⭐
Embark on an epic 25-mission campaign! Journey through 5 unique regions, from the Tutorial Arena to the legendary Champions' Valley. Face standard battles, survive enemy waves, and defeat powerful bosses. Earn stars by completing optional objectives, unlock new regions, and become a true Legend of the Arena!

### **Single Combat**
Create your character and face opponents in 1v1 tactical battles. Choose your actions each turn and outsmart your enemy! Earn gold and equipment with each victory.

### **Team Battle**
Select multiple fighters for each team and watch them battle it out in epic team combat.

### **Tournament Mode**
Enter the arena and face 3 opponents in succession. Win all rounds to claim the championship and massive rewards!

---

## ⚔️ Combat System

### **Turn-Based Tactical Combat**
Each turn, choose from 4 actions:
1. **Attack** - Standard damage with 90% accuracy
2. **Defend** - Reduce incoming damage by 50% for 1 turn
3. **Use Skill** - Class-specific abilities (costs mana, has cooldown)
4. **Use Item** - Heal for 20 HP (limited uses)

### **Skills by Class**
- **TANK** - Iron Wall (buff), Taunt Strike (damage)
- **BALANCED** - Power Slash (damage), Second Wind (heal)
- **AGILE** - Swift Strike (damage), Poison Dart (debuff)
- **MAGE** - Fireball (damage), Mana Surge (buff)
- **HYBRID** - Versatile Strike (damage), Rejuvenate (buff)
- **ASSASSIN** - Shadow Strike (high damage), Weaken (debuff)
- **BRAWLER** - Haymaker (damage), Adrenaline (buff)

### **Status Effects**
- 💪 **Strength Boost** - Increased damage
- 💔 **Strength Debuff** - Reduced damage
- 💚 **Regeneration** - Heal over time
- ☠️ **Poison** - Damage over time
- 💧 **Mana Regen** - Increased mana regeneration

### **Combat Features**
- **Combo system** - Build streaks for bonus damage
- **Critical hits** - 15% chance for 1.5x damage
- **Mana regeneration** - 10 mana per turn
- **Smart AI** - Adapts to difficulty level

---

## 🎯 Fighters

Choose from **10 unique fighters** across 7 different classes:

| Fighter | Class | HP | STR | Description |
|---------|-------|-----|-----|-------------|
| **Gosho** | BALANCED | 500 | 10 | Perfect for beginners |
| **Marina** | BALANCED | 550 | 9 | Tactical and consistent |
| **Ivan** | AGILE | 400 | 20 | High damage, low defense |
| **Viktor** | AGILE | 425 | 18 | Fast and deadly |
| **Jivko** | TANK | 1000 | 4 | Impenetrable defense |
| **Dimitri** | TANK | 900 | 5 | Superior endurance |
| **Bobba** | HYBRID | 750 | 6 | Versatile combatant |
| **Nikolai** | BRAWLER | 600 | 8 | Relentless pressure |
| **Petar** | ASSASSIN | 450 | 11 | Precision strikes |
| **Svetlana** | MAGE | 475 | 13 | Arcane power |

---

## 🚀 Quick Start

### **Installation**
```bash
npm install
```

### **Development**
```bash
npm run dev
# Opens at http://localhost:3000
```

### **Production Build**
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack

- **Build Tool**: Vite 5 (⚡ Lightning fast HMR)
- **UI Framework**: Native Web Components (Zero dependencies!)
- **Styling**: Custom CSS with Glass Morphism
- **Language**: Modern JavaScript (ES2022+)
- **Code Quality**: ESLint + Prettier
- **Audio**: Web Audio API

---

## 📝 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build (port 4173) |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code with Prettier |

---

## 🎯 How to Play

### **First Time Setup**
1. **Character Creation** - Create your custom character (name, class, avatar)
2. **Learn the Basics** - Check the in-game Wiki (📚 button on main menu)
3. **Visit Marketplace** - Spend your starting 100 gold on equipment!

### **Story Mode** (NEW!)
1. Click **"📖 Story Mode"** from main menu
2. Select an unlocked region (Tutorial Arena starts unlocked)
3. Choose a mission to view objectives and rewards
4. Complete missions to earn stars, gold, XP, and equipment!
5. Unlock new regions by defeating region bosses

### **Single Combat**
1. Click **"⚔️ Single Combat"** from main menu
2. Select an opponent from the gallery
3. Click **"Start Battle"**
4. Choose your actions each turn:
   - **Attack** for consistent damage
   - **Defend** when low on health
   - **Use Skill** for powerful effects (watch mana and cooldowns!)
   - **Use Item** to heal in emergencies
5. Defeat your opponent to gain gold, XP, and equipment!

### **Marketplace** (NEW!)
1. Click **"🏪 Marketplace"** from main menu
2. Browse equipment in the rotating shop (refreshes every 24 hours)
3. Purchase equipment, consumables, or repair damaged items
4. Sell unwanted equipment for gold

### **Team Battle**
1. Click **"👥 Team Battle"** from main menu
2. Select multiple fighters for each team
3. Click **"Start Battle"**
4. Watch the teams battle automatically

### **Tournament Mode**
1. Click **"🏆 Tournament"** from main menu
2. Choose difficulty (Normal, Hard, or Nightmare)
3. Select 4 opponents to fill the bracket
4. Battle through 3 rounds to become champion!

---

## 📚 Documentation & Guides

Comprehensive guides are available in the `guides/` folder:

- **[Achievements Guide](guides/ACHIEVEMENTS_GUIDE.md)** - All 25 achievements, rewards, and strategies
- **[Equipment Guide](guides/EQUIPMENT_SYSTEM_GUIDE.md)** - Complete equipment database and usage guide
- **[Tournament Guide](guides/TOURNAMENT_MODE_GUIDE.md)** - Tournament strategies and rewards
- **[Difficulty Guide](guides/DIFFICULTY_SYSTEM_GUIDE.md)** - Difficulty comparison and optimization tips

**In-Game Wiki**: Access all guides from the main menu (📚 Game Wiki button)

---

## 📦 Project Structure

```
ObjectFighterJS/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment
│
├── src/
│   ├── api/
│   │   └── mockFighters.js      # Fighter data
│   │
│   ├── components/              # Web Components
│   │   ├── BaseComponent.js
│   │   ├── TitleScreen.js
│   │   ├── FighterGallery.js
│   │   ├── CombatArena.js
│   │   ├── ActionSelection.js
│   │   ├── FighterHUD.js
│   │   ├── ProfileScreen.js
│   │   ├── CharacterCreation.js
│   │   ├── EquipmentScreen.js
│   │   ├── TournamentBracket.js
│   │   ├── AchievementsScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── WikiScreen.js
│   │   └── ...more
│   │
│   ├── config/
│   │   └── gameConfig.js        # Game configuration
│   │
│   ├── data/
│   │   ├── achievements.js      # Achievement definitions
│   │   └── equipment.js         # Equipment database
│   │
│   ├── entities/
│   │   ├── baseEntity.js        # Base combat entity
│   │   ├── fighter.js           # Fighter class
│   │   ├── referee.js           # Game referee
│   │   └── team.js              # Team class
│   │
│   ├── game/
│   │   ├── game.js              # Main game engine
│   │   ├── CombatEngine.js      # Combat logic
│   │   ├── TurnManager.js       # Turn-based system
│   │   ├── SkillSystem.js       # Skills & abilities
│   │   ├── StatusEffect.js      # Status effects
│   │   ├── LevelingSystem.js    # XP & leveling
│   │   ├── EquipmentManager.js  # Equipment logic
│   │   ├── TournamentMode.js    # Tournament system
│   │   ├── AchievementManager.js# Achievement tracking
│   │   ├── DifficultyManager.js # Difficulty scaling
│   │   ├── EventManager.js      # Event bus
│   │   ├── GameStateManager.js  # State management
│   │   └── ...more
│   │
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   ├── logger.js            # Combat logger
│   │   ├── saveManager.js       # Save/load system
│   │   ├── soundManager.js      # Audio system
│   │   └── hudManager.js        # HUD updates
│   │
│   ├── styles/
│   │   └── theme.css            # Global theme
│   │
│   ├── index.css                # Main styles
│   └── main-new.js              # Application entry point
│
├── guides/                       # Game documentation
│   ├── ACHIEVEMENTS_GUIDE.md
│   ├── EQUIPMENT_SYSTEM_GUIDE.md
│   ├── TOURNAMENT_MODE_GUIDE.md
│   └── DIFFICULTY_SYSTEM_GUIDE.md
│
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
└── README.md                    # This file
```

---

## 🚀 Deployment

### **GitHub Pages (Automatic)**

This project includes automatic deployment to GitHub Pages via GitHub Actions.

**Quick Setup:**

1. **Enable GitHub Pages:**
   - Go to repository **Settings** → **Pages**
   - **Source**: Select "GitHub Actions"

2. **Set Permissions:**
   - Go to **Settings** → **Actions** → **General**
   - **Workflow permissions**: Select "Read and write permissions"

3. **Push to main/master:**
   ```bash
   git push origin main
   ```

4. **Access your game** (~1-2 minutes later):  
```  
https://todorivanov.github.io/ObjectFighterJS/  
```

**Auto-Deploy**: Every push to main/master automatically triggers deployment!

---

## 🔄 Version History

### **v4.0.0 - Legends of the Arena** (Jan 2026) ⚔️
**MAJOR UPDATE - Story Mode, Economy, and Marketplace!**

**New Name**: Rebranded to "Legends of the Arena"

**New Features**:
- 📖 **Story Mode** - 25-mission campaign across 5 regions
- 💰 **Gold Economy** - Earn and spend gold currency
- 🏪 **Marketplace** - Rotating shop with buy/sell/repair
- 🔧 **Equipment Durability** - Items degrade and need repairs
- ⭐ **Mission Stars** - Earn up to 3 stars per mission
- 👑 **Boss Battles** - Epic encounters with legendary foes
- 🛡️ **Survival Mode** - Face waves of increasingly powerful enemies

**Improvements**:
- Enhanced fighter class with unique methods
- Centralized game configuration
- Comprehensive JSDoc documentation
- Removed legacy code and unused dependencies
- Improved code organization and maintainability

**Total Lines of Code**: ~14,000+ lines
**New Files**: 15+ new game systems and components

### **v3.0.0 - The RPG Update** (Jan 2026) 🎮
**Phase 5 Complete - Full RPG Experience!**

**New Features:**
- ✨ **Character Creation** - Create your own custom fighter
- 📈 **Leveling System** - Gain XP and level up (1-20)
- 👤 **Profile System** - Track stats, progress, and achievements
- ⚔️ **Equipment System** - 24 items with rarity tiers
- 🏆 **Tournament Mode** - 3-round championships
- 🏅 **Achievement System** - 25 achievements worth 6,000+ XP
- ⚙️ **Difficulty Levels** - 4 difficulty settings with modifiers
- 📚 **In-Game Wiki** - Comprehensive game guides
- 💾 **Save/Load System** - Persistent player data
- 🎯 **Auto-Battle Mode** - Optional automatic combat
- 📜 **Auto-Scroll Toggle** - Control battle log scrolling

**Total Lines of Code**: ~10,000+ lines
**Components**: 15+ Web Components
**Game Systems**: 10+ interconnected systems

### **v2.4.0 - Phase 3 Complete** (Jan 2026) 🎯
**Gameplay Enhancements:**
- ⚔️ **Turn-Based Combat** - Player-controlled tactical combat
- 🌟 **Skill System** - Class-specific abilities
- 💫 **Status Effects** - 5 buffs/debuffs
- 💥 **Combo System** - Chain attacks for bonus damage
- 🎮 **Action Selection UI** - Interactive combat interface
- 🤖 **Smart AI** - Strategic opponent decision-making

### **v2.3.0 - UX Improvements** (Jan 2026) 🎯
- 🖥️ **Fullscreen layout** - Immersive experience
- 📊 **Live fighter HUD** - Real-time stats display
- 🔊 **Fixed sound system** - Proper Web Audio API
- 🎨 **Visual improvements** - Enhanced UI/UX

### **v2.0.0 - Modernization** (Jan 2026) ⚡
**Phase 1 & 2 Complete:**
- ⚡ **17x faster** dev server (Webpack → Vite)
- 🗑️ **Removed jQuery** - Pure vanilla JS
- 🏗️ **Clean architecture** - Event-driven design
- 🎨 **Web Components** - Modern UI framework
- 🌙 **Dark mode** - Theme system
- 🔊 **Sound effects** - Web Audio API
- 💥 **Animations** - CSS animations throughout
- 📉 **50% less** code duplication

---

## 🎮 Game Statistics

- **Total Fighters**: 10
- **Classes**: 7 (Tank, Balanced, Agile, Mage, Hybrid, Assassin, Brawler)
- **Skills**: 14 (2 per class)
- **Equipment Items**: 24 (10 weapons, 8 armor, 6 accessories)
- **Story Missions**: 25 across 5 regions
- **Achievements**: 25 across 4 categories
- **Max Level**: 20
- **Difficulty Levels**: 4
- **Game Modes**: 4 (Story, Single, Team, Tournament)

---

## 🤝 Contributing

This is a learning project demonstrating:
- ✅ Object-Oriented Programming in JavaScript
- ✅ Native Web Components
- ✅ Event-Driven Architecture
- ✅ Modern ES2022+ features
- ✅ State Management patterns
- ✅ Game development concepts

Feel free to explore, learn, and experiment!

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👤 Author

**Todor Ivanov**

---

## 🎉 Highlights

✨ **Modern Stack**: Vite 5 + Native Web Components  
⚡ **Zero Dependencies**: No frameworks, pure vanilla JS  
🎮 **Rich Gameplay**: RPG progression + tactical combat  
🎨 **Beautiful UI**: Glass morphism + smooth animations  
📱 **Responsive**: Works on desktop, tablet, and mobile  
🚀 **Auto-Deploy**: GitHub Actions + GitHub Pages  
📚 **Well Documented**: In-game wiki + markdown guides  
💾 **Save System**: LocalStorage persistence  

---

**Version**: 4.0.0  
**Status**: Legends of the Arena - Epic Story Mode! ⚔️✨  
**Play Now**: Deploy to GitHub Pages and become a legend!

---

*Built with ❤️ using Vite, JavaScript, and Web Components*
