# Enemy Icon System - Grid Combat Customization

## Overview

Version 5.0.1 introduces **dynamic enemy icons** on the tactical grid, providing visual storytelling through context-aware icons based on enemy type, name, and story path.

---

## Features

### 🎭 **Story-Aware Icons**
- **68+ unique enemy types** across all 5 story paths
- Icons change based on enemy name and story context
- Visual distinction between enemy categories

### 👑 **Boss Indicators**
- Boss enemies display with a **crown suffix** (e.g., 💪👑)
- Easy identification of challenging encounters

### 🌈 **Color-Coded Enemies**
- **Green** (🟢): Player character
- **Red** (🔴): Standard enemies
- **Orange** (🟠): Boss enemies
- **Gold** (🟡): Champions and legends
- **Purple** (🟣): Mystical/ancient enemies
- **Pink** (🩷): Elite units

### ✨ **Glow Effects**
- Each icon has a colored glow matching its type
- Enhanced visual clarity on the grid
- Atmospheric combat presentation

---

## Enemy Icon Categories

### ⛓️ **Slave Gladiator Path**

| Icon | Enemy Type | Example Names |
|------|------------|---------------|
| ⛓️ | Chained Prisoner | Condemned Prisoner |
| 👤 | Fellow Slave/Shadow | Fellow Slave Marcus, Emperor's Shadow |
| 👨 | Named Slave | Marcus (Fellow Slave) |
| ⚔️ | Veteran Fighter | Armored Veteran |
| 🏆 | Arena Champion | Champion (non-imperial) |
| 👑 | Imperial Champion | Imperial Champion, Master's Champion |
| 🧔 | Strong Warrior | Champion Brutus |
| 🧕 | Desert Raider | Desert Raider |
| 🥷 | Bandit/Thief | Bandit Leader |
| 🪓 | Executioner | The Executioner |
| 🛡️ | Guardian | Final Test Guardian |
| 🤺 | Rival's Champion | Rival Master's Champion |
| 👊 | Brawler | Iron Fist Gaius |
| 🗡️ | Assassin | Swift Blade Helena |
| 🕊️ | Freedom Fighter | Path to Freedom |

---

### 🦅 **Roman Legionnaire Path**

| Icon | Enemy Type | Example Names |
|------|------------|---------------|
| 🧔 | Barbarian | Barbarian Raider, Gaul Warrior |
| 😡 | Berserker | Barbarian Berserker |
| 👑 | Tribal Leader | Chieftain, Warchief |
| ⚔️ | Rebel/Soldier | Rebel Fighter, Legionnaire |
| 🗡️ | Partisan | Partisan Rebel |
| 🔥 | Rebel Leader | Insurgent Leader |
| 🦅 | Centurion | Centurion, Roman Officer |
| 🛡️ | Elite Guard | Praetorian Guard |
| ⭐ | General | General, High-Ranking Commander |
| 🐫 | North African | Numidian Cavalry, Carthaginian |
| 🏹 | Eastern Archer | Parthian Archer, Persian |
| 🐍 | Egyptian | Egyptian Warrior |
| 🏇 | Horse Archer | Scythian Rider |
| 👑 | Emperor | Emperor, Caesar |

---

### 💼 **Lanista Path**

| Icon | Enemy Type | Example Names |
|------|------------|---------------|
| 🤵 | Business Rival | Rival Lanista, Competitor |
| 🎭 | Corrupt Official | Corrupt Official (mask symbol) |
| 👔 | Noble | Senator, Noble Patron |
| 🥷 | Rogue Fighter | Rogue Gladiator, Deserter, Assassin |
| 🗡️ | Outlaw | Outlaw, Rogue |
| 💰 | Mercenary | Hired Mercenary |
| 🦹 | Crime Boss | Crime Lord, Syndicate Boss |
| 🔪 | Gang Member | Syndicate Member, Gang |
| 👊 | Enforcer | Enforcer, Thug |
| ⭐ | Legend | Legendary Fighter |
| 🏆 | Master | Master Gladiator |
| 👑 | Champion | Arena Champion |

---

### 🪓 **Barbarian Traveller Path**

| Icon | Enemy Type | Example Names |
|------|------------|---------------|
| 🩸 | Blood Warrior | Blood Warrior, Blood Tribe |
| ⚔️ | War Band | War Band, Raiding Party, Roman Soldier |
| 🧔 | Tribal Warrior | Hostile Tribesman, Enemy Tribe |
| 🔮 | Shaman | Shaman, Witch Doctor |
| 👴 | Elder | Tribal Elder, Sage |
| 😡 | Berserker | Tribal Berserker |
| 🐺 | Wolf | Dire Wolf, Alpha Wolf |
| 🐻 | Bear | Great Bear, Bear |
| 🦁 | Beast | Wild Beast, Creature |
| 🐗 | Boar | Wild Boar |
| 🛡️ | Roman Patrol | Roman Patrol, Roman Scout |
| 🦅 | Roman Officer | Roman Officer, Centurion |
| 👹 | Warlord | Warlord, Conqueror |
| 😈 | Tyrant | Tyrant, Despot, Demon |
| 🗿 | Ancient Guardian | Ancient Guardian, Ancient Protector |
| 💀 | Cursed Being | Cursed Warrior, Corrupted |
| 👻 | Spirit | Spirit, Wraith, Ghost |

---

### 🏜️ **Desert Nomad Path**

| Icon | Enemy Type | Example Names |
|------|------------|---------------|
| 🦎 | Scavenger | Desert Scavenger, Looter |
| �️ | Sand Creature | Sand Elemental, Sand Creature |
| 🧕 | Desert Walker | Dune Walker, Desert Nomad |
| 🐫 | Caravan Raider | Caravan Raider (camel connection) |
| 🏴‍☠️ | Desert Pirate | Desert Pirate |
| 🥷 | Marauder | Stealthy Marauder |
| ⚔️ | Generic Raider | Desert Raider |
| 🧞 | Djinn | Djinn, Genie (Arabian mythology) |
| 👻 | Desert Spirit | Spirit, Sand Spirit |
| 🧙 | Sand Witch | Sand Witch, Sorceress |
| 🔮 | Mystic | Desert Mystic |
| 👳 | Rival Chief | Rival Chief, Tribal Leader |
| 🧕 | Rival Nomad | Rival Nomad Clan, Competing Tribe |
| 🦂 | Scorpion | Giant Scorpion, Scorpion King |
| 🐍 | Serpent | Desert Viper, Desert Serpent |
| 🦅 | Vulture | Desert Vulture |
| 🪲 | Scarab | Scarab Swarm |
| 😈 | Tyrant | Desert Tyrant |
| 👹 | Warlord | Desert Warlord |
| 💀 | Eternal Being | Eternal, Immortal Spirit |
| 🏆 | Sand Champion | Sand Champion |

---

## Class-Based Fallbacks

If enemy type isn't recognized, the system uses class-based icons:

| Class | Icon | Description |
|-------|------|-------------|
| WARRIOR | 🗡️ | Dagger warrior |
| TANK | 🛡️ | Shield defender |
| MAGE | 🧙 | Wizard character |
| NECROMANCER | 💀 | Skull (death magic) |
| ASSASSIN | 🥷 | Ninja character |
| AGILE | 🤸 | Acrobat |
| BERSERKER | 😡 | Angry face (rage) |
| PALADIN | ✨ | Holy sparkles |
| BRAWLER | 👊 | Fist action |
| GLASS_CANNON | 💥 | Explosion |
| BRUISER | 🧔 | Bearded tough guy |
| BALANCED | ⚖️ | Balance scales |
| Default | 👹 | Demon enemy |

---
| PALADIN | ✨ | Holy warrior |
| BRAWLER | 🥊 | Fist fighter |
| GLASS_CANNON | 💥 | High damage |
| BRUISER, BALANCED | 👹 | Generic enemy |

---

## Technical Implementation

### EnemyIconMapper API

```javascript
import { EnemyIconMapper } from '../utils/EnemyIconMapper.js';

// Get basic enemy icon
const icon = EnemyIconMapper.getEnemyIcon(fighter);
// Returns: '🪓' (for barbarian)

// Get icon with boss indicator
const iconWithBoss = EnemyIconMapper.getIconWithBossIndicator(fighter);
// Returns: '🪓👑' (for barbarian boss)

// Get enemy color
const color = EnemyIconMapper.getEnemyColor(fighter);
// Returns: '#f44336' (red for standard enemy)
```

### Icon Matching Logic

**Priority Order:**
1. **Specific name match** (e.g., "Brutus" → 🧔, "Gaius" → 👊, "Helena" → 🗡️)
2. **Generic type match** (e.g., "barbarian" → 🧔, "veteran" → ⚔️)
3. **Story path context** (e.g., Roman path → military hierarchy)
4. **Class fallback** (e.g., WARRIOR → 🗡️)
5. **Default** (👹)

### Color System

```javascript
// Color mappings
{
  player: '#4caf50',        // Green
  enemy: '#f44336',         // Red
  boss: '#ff9800',          // Orange
  champion: '#ffd700',      // Gold
  mystical: '#9c27b0',      // Purple
  elite: '#e91e63'          // Pink
}
```

---

## Integration with Grid Combat

### Automatic Application
- Icons update automatically when fighters are placed on grid
- No manual configuration needed
- Works seamlessly with all story paths

### Visual Enhancements
- **Colored glow effect**: `text-shadow: 0 0 8px ${color}aa`
- **Dynamic sizing**: Icons scale with grid cells
- **Hover effects**: Tooltip shows enemy details
- **Boss crowns**: Automatically appended to boss icons

### Grid Display Example
```
[ ⛓️ ]  [ 🧔 ]  [    ]  [ 🦅 ]  [ 🧙👑 ]
[    ]  [    ]  [ 🦸 ]  [    ]  [    ]
[ 🥷 ]  [    ]  [    ]  [    ]  [ 🤵 ]
```

---

## Customization Guide

### Adding New Enemy Types

**1. Add to EnemyIconMapper.js:**
```javascript
// In getEnemyIcon() method
if (name.includes('new_enemy_type')) {
  return '🎯'; // Your chosen icon
}
```

**2. Add color mapping (optional):**
```javascript
// In getEnemyColor() method
if (name.includes('new_enemy_type')) {
  return '#custom_color';
}
```

### Adding New Story Path

**1. Create section in EnemyIconMapper:**
```javascript
// ========== NEW PATH ENEMIES ==========

if (name.includes('path_specific_enemy')) {
  return '🎭'; // Path-specific icon
}
```

**2. Document in guide:**
Update this file with new path icons table.

---

## Benefits

### Player Experience
- **Visual storytelling**: Icons reinforce narrative context
- **Quick identification**: Instantly recognize enemy types
- **Strategic awareness**: Boss indicators warn of challenges
- **Immersion**: Different paths feel visually distinct

### Developer Experience
- **Extensible**: Easy to add new enemy types
- **Maintainable**: Centralized icon logic
- **Flexible**: Name-based matching allows variations
- **Documented**: Comprehensive icon catalog

---

## Examples in Combat

### Slave Gladiator Mission 1
```
Enemy: "Condemned Prisoner"
Icon: ⛓️ (chained)
Color: 🔴 Red glow
Context: Prison/arena fighter
```

### Roman Legionnaire Mission 5
```
Enemy: "Barbarian Chieftain"
Icon: 👑🪓 (crowned barbarian)
Color: 🟠 Orange glow (boss)
Context: Tribal leader boss fight
```

### Desert Nomad Mission 10
```
Enemy: "Sand Spirit"
Icon: 🌪️
Color: 🟣 Purple glow (mystical)
Context: Desert supernatural enemy
```

---

## Future Enhancements

### Planned Features
- [ ] **Animated icons** - Subtle pulsing/movement effects
- [ ] **Icon customization** - Player-selectable icon sets
- [ ] **Faction badges** - Small indicator of allegiance
- [ ] **Rank insignia** - Visual rank system for military enemies
- [ ] **Conditional icons** - Change based on enemy state (wounded, enraged)

### Community Contributions
- Submit new enemy type suggestions
- Propose alternative icon sets (medieval, fantasy, sci-fi themes)
- Create custom color schemes

---

## Version History

**v5.0.1** - Initial Release
- 68+ enemy type icons
- 5 story path icon sets
- Boss crown indicators
- Color-coded system
- Dynamic glow effects

---

## Related Documentation

- [Grid Combat System](GRID_COMBAT_SYSTEM.md) - Tactical grid mechanics
- [Story Path System](../CHANGELOG.md#500) - 5 story paths overview
- [Mission Database](../src/data/) - All mission enemy data

---

**Enjoy the enhanced visual combat experience!** ⚔️🎭🗺️
