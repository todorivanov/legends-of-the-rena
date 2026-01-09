# 🏃 Interactive Grid Movement Guide

## Overview

The grid combat system now supports **interactive movement**, allowing players to click on the battlefield to reposition their fighters strategically.

---

## 🎮 How to Move

### Step-by-Step Instructions

**1. Start Your Turn**
- Wait for your turn indicator to appear
- The action selection UI will show at the bottom of the screen

**2. Click the Move Button**
- Click the **🏃 Move** button in the action selection UI
- The button has a blue theme and is positioned first in the action list

**3. View Valid Moves**
- The grid will highlight all valid movement cells in **blue**
- The number of valid moves depends on:
  - Your base movement speed (default: 2 cells)
  - Your class (Assassins get 3, Tanks get 1)
  - Terrain costs (forest = 2, water = 3)

**4. Select Destination**
- Click any **blue highlighted cell** to move there
- The movement happens instantly
- Combat log will show: "✅ [Name] moved to position (x, y)"

**5. Apply Effects**
- Terrain effects are applied automatically after moving
- You'll see messages like: "🌍 Terrain effect: High Ground (+20% defense, +25% attack)"

**6. Continue Battle**
- Your turn ends after moving
- The opponent's turn begins

---

## 📊 Movement Mechanics

### Movement Range

| Class | Base Movement | Adjusted |
|-------|---------------|----------|
| Tank | 2 | 1 (-1 penalty) |
| Balanced | 2 | 2 (normal) |
| Agile | 2 | 2 (normal) |
| Assassin | 2 | 3 (+1 bonus) |
| Mage | 2 | 2 (normal) |
| Brawler | 2 | 2 (normal) |

### Terrain Costs

| Terrain | Movement Cost | Notes |
|---------|---------------|-------|
| Plains | 1 | Fast |
| Grassland | 1 | Fast |
| Rock | 1 | Normal |
| High Ground | 1 | Normal |
| Low Ground | 1 | Normal |
| Forest | 2 | Slow |
| Mud | 2 | Slow |
| Water | 3 | Very slow |
| Wall | ∞ | Impassable |
| Pit | ∞ | Impassable |

### Movement Examples

**Example 1: Normal Movement**
```
Balanced fighter (2 movement)
Can move through:
- 2 plains tiles ✅
- 1 forest tile ✅
- 2 grassland tiles ✅
```

**Example 2: Terrain Limits**
```
Tank (1 movement)
Can move through:
- 1 plains tile ✅
- 0 forest tiles ❌ (costs 2)
- 0 water tiles ❌ (costs 3)
```

**Example 3: Assassin Speed**
```
Assassin (3 movement)
Can move through:
- 3 plains tiles ✅
- 1 forest + 1 plains ✅
- 1 water tile ✅
```

---

## 🎯 Tactical Movement Tips

### Offensive Movement

**Flanking**
```
1. Move behind enemy
2. Attack from rear
3. Get +25% damage bonus
```

**High Ground Rush**
```
1. Move to ⛰️ High Ground
2. Gain +25% attack
3. Gain +20% defense
4. Dominate the battlefield
```

**Close the Gap**
```
1. Use full movement to approach
2. Get within attack range
3. Strike next turn
```

### Defensive Movement

**Retreat to Forest**
```
1. Move to 🌲 Forest when low HP
2. Gain +15% defense
3. Block enemy line of sight
```

**Avoid Flanking**
```
1. Move to corner or wall
2. Limit enemy approach angles
3. Prevent flanking bonus
```

**Terrain Advantage**
```
1. Move to favorable terrain for your class
2. Example: Tanks to Rock (+10% defense)
3. Example: Mages to Plains (no penalties)
```

### Movement Combos

**Kite & Attack**
```
Turn 1: Move back, Attack
Turn 2: Move back, Attack
(Requires 3+ movement - Assassins only)
```

**Bait & Trap**
```
Turn 1: Move to High Ground
Turn 2: Defend (enemy forced to attack uphill)
Turn 3: Counter-attack with bonuses
```

---

## ⚠️ Movement Restrictions

### What You CANNOT Do

❌ **Move through occupied cells**
- Enemy or ally positions block movement
- Must path around them

❌ **Move through impassable terrain**
- Walls and Pits cannot be crossed
- No exceptions

❌ **Move beyond your range**
- Only highlighted cells are valid
- Terrain costs reduce effective range

❌ **Move and attack in same turn** (currently)
- Movement ends your turn
- Attack-move combos coming in future update

### Invalid Move Messages

If you click an invalid cell:
```
⚠️ Invalid move! Choose a highlighted cell.
```

If you have no valid moves:
```
⚠️ [Name] has no valid moves!
(Turn is skipped)
```

---

## 🔧 Technical Details

### Implementation

**Frontend (User Input)**
- `ActionSelection.js` - Move button added to action list
- `GridCombatUI.js` - Handles cell highlighting and clicks
- `game.js` - `handleGridMovement()` method processes moves

**Backend (Logic)**
- `GridManager.js` - Calculates valid moves using BFS
- `GridCombatIntegration.js` - Applies movement and terrain effects
- `TerrainSystem.js` - Provides terrain costs and modifiers

### Event Flow

```
1. User clicks Move button
   ↓
2. Game calls getValidMoves(fighterId)
   ↓
3. Grid UI highlights valid cells
   ↓
4. User clicks a cell
   ↓
5. Grid emits 'cell-clicked' event
   ↓
6. Game validates move
   ↓
7. GridCombatIntegration.moveFighter(fighterId, x, y)
   ↓
8. Apply terrain effects
   ↓
9. Update UI and continue combat
```

---

## 🎨 Visual Indicators

### Cell Highlights

| Color | Meaning |
|-------|---------|
| 🔵 Blue outline | Valid move destination |
| 🟢 Green icon | Your fighter (🦸) |
| 🔴 Red icon | Enemy fighter (👹) |
| 🌈 Terrain color | Terrain type (see legend) |

### Grid Modes

- **View Mode**: Default - shows positions and terrain
- **Move Mode**: Active during movement selection - highlights valid moves
- **Attack Mode**: (Coming soon) - highlights valid attack targets

---

## 🆕 Recent Updates

**v4.8.0 - Interactive Movement**
- ✅ Added Move button to action selection
- ✅ Implemented cell highlighting for valid moves
- ✅ Added click-to-move functionality
- ✅ Integrated terrain effects after movement
- ✅ Updated documentation and guides

---

## 📚 Related Documentation

- [Grid Combat System](GRID_COMBAT_SYSTEM.md) - Complete grid combat guide
- [Status Effects](STATUS_EFFECTS.md) - Status effect system
- [Combo System](COMBO_SYSTEM.md) - Combo mechanics
- [Combat Phases](COMBAT_PHASES.md) - Combat flow

---

## 🐛 Known Issues & Limitations

**Current Limitations:**
- Cannot move and attack in the same turn
- No undo button for movement
- AI doesn't use grid movement yet (uses automatic positioning)

**Future Enhancements:**
- Interactive attack targeting on grid
- Area of effect skills
- Push/pull forced movement abilities
- Enhanced AI grid tactics

---

## 💡 Tips & Tricks

1. **Plan Ahead**: Look at terrain before moving
2. **Control High Ground**: It's the best tactical position
3. **Use Forest for Defense**: Great when retreating
4. **Avoid Water**: 3 movement cost is usually not worth it
5. **Corner Positioning**: Prevents flanking
6. **Class Synergy**: Use Assassin speed for kiting tactics

---

**Happy Moving!** 🏃⚔️🗺️
