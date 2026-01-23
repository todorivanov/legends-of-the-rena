# Multi-Enemy Combat System Guide

## Overview

Version 5.0 introduces **Multi-Enemy Combat** - the ability to fight against multiple opponents simultaneously in story missions. This adds tactical depth and challenge to the game.

---

## Features

### 🎯 Core Mechanics

**Multiple Opponents**
- Fight 3-5 enemies at once
- Each enemy has unique class, stats, and AI
- Defeat them one by one or all at once

**Enemy Selection UI**
- Modal overlay showing all alive enemies
- Health bars with percentage display
- Defeated enemies grayed out and unselectable
- Cancel option to return to enemy selection

**Round-Robin Turn System**
- Turn order: Player → Enemy 1 → Enemy 2 → Enemy 3 → ... → Player
- Each fighter gets one action per round
- Defeated enemies automatically skipped

**Victory Conditions**
- **Win**: Defeat all enemies (all enemy health reaches 0)
- **Lose**: Player health reaches 0

---

## Mission Structure

### Multi-Enemy Mission Format

Multi-enemy missions use an `enemies` array instead of a single `enemy` object:

```javascript
{
  id: 'slave_13_arena_ambush',
  name: 'Arena Ambush',
  type: 'multi_enemy',  // New mission type
  difficulty: 6,
  enemies: [            // Array of enemies
    {
      name: 'Guard Captain',
      class: 'WARRIOR',
      health: 300,
      strength: 14,
      level: 5
    },
    {
      name: 'Prison Brute',
      class: 'TANK',
      health: 350,
      strength: 12,
      level: 5
    },
    {
      name: 'Arena Thug',
      class: 'BRAWLER',
      health: 280,
      strength: 15,
      level: 5
    }
  ],
  objectives: [
    { id: 'obj1', description: 'Defeat all 3 enemies', type: 'win', star: 1 },
    { id: 'obj2', description: 'Win with at least 30% HP remaining', type: 'health_percent', value: 30, star: 2 },
    { id: 'obj3', description: 'Complete in 15 rounds or less', type: 'rounds', value: 15, star: 3 }
  ],
  rewards: {
    gold: true,
    xp: true,
    equipment: ['battle_helm']
  }
}
```

---

## Available Multi-Enemy Missions

### 📖 Slave Gladiator Path

#### **1. Arena Ambush** (`slave_13_arena_ambush`)
- **Difficulty**: 6 (Medium)
- **Enemies**: 3 opponents
  - Guard Captain (WARRIOR, 300 HP)
  - Prison Brute (TANK, 350 HP)
  - Arena Thug (BRAWLER, 280 HP)
- **Objectives**:
  - ⭐ Defeat all 3 enemies
  - ⭐ Win with 30%+ HP
  - ⭐ Complete in ≤15 rounds
- **Rewards**: 250 gold, 500 XP, battle_helm, +20 freedom

#### **2. Champions Gauntlet** (`slave_14_champions_gauntlet`)
- **Difficulty**: 8 (Hard)
- **Enemies**: 4 opponents
  - Blade Master (ASSASSIN, 300 HP)
  - Shield Maiden (TANK, 400 HP)
  - Battle Mage (MAGE, 250 HP)
  - Berserker King (BERSERKER, 350 HP)
- **Objectives**:
  - ⭐ Defeat all 4 enemies
  - ⭐ Land 8 critical hits
  - ⭐ Build a 5-hit combo
- **Rewards**: 400 gold, 750 XP, dragons_fang + phoenix_armor, +25 freedom

#### **3. Final Trial** (`slave_15_final_trial`)
- **Difficulty**: 10 (Very Hard)
- **Enemies**: 5 opponents
  - Imperial Guard (PALADIN, 400 HP)
  - Shadow Assassin (ASSASSIN, 300 HP)
  - War Priest (MAGE, 320 HP)
  - Iron Colossus (TANK, 500 HP)
  - Flame Berserker (BERSERKER, 350 HP)
- **Objectives**:
  - ⭐ Defeat all 5 enemies
  - ⭐ Win with 25%+ HP
  - ⭐ Complete in ≤20 rounds
- **Rewards**: 600 gold, 1200 XP, excalibur + titans_guard, +20 freedom

---

## How to Play Multi-Enemy Missions

### Step-by-Step Combat Flow

**1. Mission Start**
- Accept mission from Campaign Map
- Read mission briefing showing all enemies
- Enter Arena button starts combat

**2. Battle Introduction**
- Game displays: "PlayerName faces X opponents!"
- Each enemy listed with name, class, and HP

**3. Combat Turns**
- **Your Turn**:
  1. Select target enemy (modal appears)
  2. Choose action (Attack, Defend, Skill, Item)
  3. Execute action on selected enemy
  
- **Enemy Turns** (round-robin):
  1. Enemy 1 acts (AI decides action)
  2. Enemy 2 acts
  3. Enemy 3 acts (if applicable)
  4. ... and so on
  
- **New Round**:
  - After all fighters have acted
  - Mana regenerates for all
  - Round counter increments

**4. Enemy Defeat**
- When enemy reaches 0 HP:
  - Defeat message logged
  - Enemy removed from turn order
  - Combat continues with remaining enemies

**5. Battle End**
- **Victory**: All enemies defeated
  - XP/gold awarded (multiplied by enemy count)
  - Mission objectives evaluated
  - Star rating calculated
  
- **Defeat**: Player reaches 0 HP
  - Mission failed
  - No rewards
  - Can retry mission

---

## Enemy Selection UI

### Features

**Visual Display**
- Grid layout of enemy cards (2-3 columns)
- Each card shows:
  - Enemy name and class icon
  - Health bar with percentage
  - Defeated badge (if health = 0)

**Interactive Elements**
- **Hover Effects**: Cards glow on hover
- **Click to Select**: Click enemy card to target them
- **Cancel Button**: Return to target selection (bottom of modal)

**Visual States**
- **Alive Enemies**: Full opacity, colored health bar
- **Defeated Enemies**: Grayscale, dimmed, unselectable
- **Low Health**: Pulsing red animation (<30% HP)

### Example

```
┌─────────────────────────────────────┐
│      SELECT YOUR TARGET             │
├─────────────────────────────────────┤
│  ┌───────────┐    ┌───────────┐   │
│  │ Guard Cap │    │ Arena Thug│   │
│  │ ⚔️ WARRIOR│    │ 👊 BRAWLER│   │
│  │ ▓▓▓▓░░ 70%│    │ ▓▓░░░░ 40%│   │
│  └───────────┘    └───────────┘   │
│  ┌───────────┐                     │
│  │Prison Brut│    (greyed out)    │
│  │ 🛡️ TANK   │    DEFEATED ☠️     │
│  │ ░░░░░░  0%│                     │
│  └───────────┘                     │
├─────────────────────────────────────┤
│          [❌ Cancel]                │
└─────────────────────────────────────┘
```

---

## Combat Strategy

### Tips for Multi-Enemy Battles

**Target Priority**
1. **Glass Cannons First** - High damage, low HP (Assassin, Mage)
2. **Damage Dealers** - Medium threat (Warrior, Berserker)
3. **Tanks Last** - High HP, low damage (Tank, Paladin)

**Resource Management**
- **Conserve Mana**: Skills for finishing blows
- **Use Items Wisely**: Health potions when low
- **Defend Strategically**: Against multiple attackers

**Positioning (Grid Combat)**
- **Avoid Flanking**: Stay near walls/corners
- **Control High Ground**: +25% attack bonus
- **Use Terrain**: Forest for defense, high ground for offense

**Action Economy**
- You get 1 action per round
- Enemies get 3-5 actions combined
- Make every turn count!

**Focus Fire**
- Eliminate one enemy at a time
- Reduces incoming damage quickly
- Easier to manage fewer enemies

---

## Technical Details

### Turn Order Calculation

```javascript
// Calculate turns per round
const turnsPerRound = 1 + aliveEnemies.length;

// Determine active fighter (0-indexed)
const turnInRound = turnNumber % turnsPerRound;
const isPlayerTurn = turnInRound === 0;
const activeFighter = isPlayerTurn 
  ? player 
  : aliveEnemies[turnInRound - 1];
```

**Example with 3 enemies:**
- Turn 0 (mod 4 = 0): **Player**
- Turn 1 (mod 4 = 1): **Enemy 1**
- Turn 2 (mod 4 = 2): **Enemy 2**
- Turn 3 (mod 4 = 3): **Enemy 3**
- Turn 4 (mod 4 = 0): **Player** (new round)

### Victory Check

```javascript
const aliveEnemies = currentEnemyFighters.filter(e => e.health > 0);

if (aliveEnemies.length === 0) {
  // All enemies defeated - VICTORY!
  Referee.declareWinner(player);
}

if (player.health <= 0) {
  // Player defeated - DEFEAT!
  Referee.declareWinner(aliveEnemies[0]);
}
```

### Reward Calculation

```javascript
// XP: 50 per enemy level
const totalXP = enemies.reduce((sum, enemy) => {
  return sum + (enemy.level * 50);
}, 0);

// Gold: 20 per enemy level
const totalGold = enemies.reduce((sum, enemy) => {
  return sum + (enemy.level * 20);
}, 0);
```

**Example (3 level 5 enemies):**
- XP: 3 × 5 × 50 = **750 XP**
- Gold: 3 × 5 × 20 = **300 gold**

---

## Backward Compatibility

### Single Enemy Missions

The system maintains **full backward compatibility** with existing single-enemy missions:

```javascript
// Old format (still works)
{
  enemy: {
    name: 'Arena Champion',
    class: 'WARRIOR',
    health: 400
  }
}

// New format (multi-enemy)
{
  enemies: [
    { name: 'Enemy 1', ... },
    { name: 'Enemy 2', ... }
  ]
}
```

**Detection Logic:**
```javascript
const isSingleEnemy = !Array.isArray(secondFighterOrEnemies);
const enemyFighters = isSingleEnemy 
  ? [secondFighterOrEnemies] 
  : secondFighterOrEnemies;
```

All existing 1v1 missions work identically to before!

---

## UI Components

### EnemySelector Component

**File**: `src/components/EnemySelector.js`

**Properties:**
- `enemies` - Array of Fighter objects to display

**Events:**
- `enemy-selected` - Emits `{ enemy: Fighter }` or `{ enemy: null }` if cancelled

**Usage:**
```javascript
const selector = document.createElement('enemy-selector');
selector.enemies = aliveEnemies;
document.body.appendChild(selector);

selector.addEventListener('enemy-selected', (e) => {
  const target = e.detail.enemy;
  if (target) {
    // Attack this enemy
    executeAttack(player, target);
  }
});
```

---

## Future Enhancements

### Planned Features

**Grid Combat Integration** 🗺️
- Place all enemies on 9x9 grid
- Tactical positioning for each enemy
- Flanking from multiple angles

**Multi-Enemy HUD** 📊
- Display all enemy health bars simultaneously
- Highlight active enemy's turn
- Show defeated enemies grayed out

**Area-of-Effect Skills** 💥
- Skills that hit multiple enemies
- Splash damage mechanics
- Group buffs/debuffs

**Team Battles** 👥
- Bring allies to fight alongside you
- 2v3, 3v5 battles
- Friendly fire considerations

**Advanced AI** 🤖
- Enemy coordination
- Focus fire tactics
- Healing/support enemies

---

## Troubleshooting

### Common Issues

**Q: Enemy selector doesn't appear**
- Check browser console for errors
- Verify EnemySelector component registered
- Ensure `enemies` array is valid

**Q: Turn order seems wrong**
- Turn system is round-robin (player → all enemies → player)
- Each enemy gets exactly one turn per round

**Q: Rewards seem low**
- Rewards scale with enemy count automatically
- 3 enemies = 3× XP and gold vs single enemy

**Q: Mission too hard**
- Try leveling up first
- Upgrade equipment
- Use consumable items (health/mana potions)
- Focus fire on weakest enemies first

---

## Version History

- **v5.0.0** - Initial multi-enemy combat release (January 2026)
  - 3 multi-enemy missions added to Slave Gladiator path
  - EnemySelector component
  - Round-robin turn system
  - Backward compatibility with single-enemy missions

---

## Related Documentation

- [Combat Phases](./COMBAT_PHASES.md) - Combat system architecture
- [Story Mode](./STORY_MODE_GUIDE.md) - Story mission system
- [Grid Combat](./GRID_COMBAT_SYSTEM.md) - Tactical grid mechanics
- [Character Classes](./CHARACTER_CLASSES_GUIDE.md) - Class abilities

---

**Good luck, Gladiator! May you defeat all who stand before you!** ⚔️👹👹👹

