# Grid Combat System

## Overview

Version 4.7.0 introduces a **tactical 5x5 grid combat system** that adds positional strategy, terrain effects, and tactical depth to battles.

---

## Core Features

### 🎯 5x5 Tactical Grid
- **25 battlefield cells** arranged in a 5x5 grid
- **Unique positioning** for each fighter
- **Real-time visualization** with interactive UI
- **Multiple battlefield layouts** with different terrain types

### 🗺️ Terrain Types (10 types)

#### Normal Terrain
- **⬜ Normal Ground** - Standard battlefield
  - Movement: 1 point
  - No bonuses or penalties
  - Always passable

- **🟩 Grassland** - Open field
  - Movement: 1 point
  - No bonuses or penalties
  - Easy to traverse

#### Defensive Terrain
- **🌲 Forest** - Dense trees
  - Movement: 2 points (slower)
  - Defense: +15%
  - Attack: -10% (obstructed)
  - **Blocks line of sight**

- **🪨 Rock** - Rocky ground
  - Movement: 1 point
  - Defense: +10%
  - Attack: +5% (stable footing)

#### Difficult Terrain
- **🌊 Water** - Shallow water
  - Movement: 3 points (very slow)
  - Defense: -10% (unstable)
  - Attack: -15% (hard to fight in)

- **🟫 Mud** - Muddy ground
  - Movement: 2 points
  - Defense: -5%
  - Attack: -10% (slippery)

#### Elevation Terrain
- **⛰️ High Ground** - Elevated position
  - Movement: 1 point
  - Defense: +20% ✨
  - Attack: +25% ✨ (best tactical advantage!)

- **🕳️ Low Ground** - Depression
  - Movement: 1 point
  - Defense: -15%
  - Attack: -10% (disadvantageous)

#### Impassable Terrain
- **🧱 Wall** - Stone barriers
  - **Cannot be crossed**
  - **Blocks line of sight**

- **🕳️ Pit** - Deep holes
  - **Cannot be crossed**
  - Does not block line of sight

---

## Combat Mechanics

### Movement System

**Movement Range:**
- **Base**: 2 spaces per turn
- **Assassin/Agile**: 3 spaces (+1 bonus)
- **Tank**: 1 space (-1 penalty)

**Movement Costs:**
- Each terrain type has a movement cost
- Path-finding uses BFS algorithm
- Can move through multiple terrains if points allow

**Example:**
```
Fighter has 2 movement points:
- 2 normal tiles = 2 points ✅
- 1 forest tile = 2 points ✅
- 1 water tile = 3 points ❌ (not enough)
```

### Attack System

**Attack Range:**
- **Melee**: 1 space (most classes)
- **Assassin**: 2 spaces (extended reach)
- **Mage**: 3 spaces (ranged attacks)

**Line of Sight:**
- Attacks require clear line of sight
- **Forest** and **Walls** block LOS
- Uses Bresenham's line algorithm

**Terrain Damage Modifiers:**
```javascript
Final Damage = Base Damage × (1 + Attacker Bonus) × (1 - Defender Bonus × 0.5)
```

**Example Calculation:**
```
Base Damage: 100
Attacker on High Ground: +25% = 125 damage
Defender in Forest: +15% defense = ~15% reduction
Final Damage: 125 × (1 - 0.15 × 0.5) ≈ 116 damage
```

### Flanking Mechanic

**Flanking Bonus: +25% damage**

Flanking occurs when a fighter has enemies on **opposite sides**:
- Top + Bottom
- Left + Right
- Top + Left/Right
- Bottom + Left/Right

**Example:**
```
    [ ]
[E] [P] [E]  ← Player is flanked!
    [ ]

Enemies deal +25% damage to player
```

---

## Battlefield Layouts

### 6 Predefined Battlefields

#### 1. Open Field
- Wide open space
- Minimal cover
- Grass patches
- **Best for**: Direct combat, melee fighters

#### 2. Forest Clearing
- Dense forest perimeter
- Open center
- High defense positions
- **Best for**: Defensive play, ranged fighters

#### 3. Ancient Ruins
- Rocky terrain with walls
- Strategic passages
- Destructible cover
- **Best for**: Tactical positioning

#### 4. Treacherous Swamp
- Mud and water
- Slows movement
- Few solid ground positions
- **Best for**: Mobile fighters, kiting

#### 5. Mountain Pass
- Elevated terrain
- High ground advantage
- Low ground penalties
- **Best for**: Controlling key positions

#### 6. Combat Arena
- Walled perimeter
- Rock cover
- Classic gladiator setup
- **Best for**: Enclosed combat

### Random Generation
- System picks random layout each battle
- Ensures variety in gameplay
- All layouts are balanced

---

## Strategic Depth

### Positioning Strategy

**High Ground Advantage:**
```
Attacker on high ground: +25% attack, +20% defense
vs
Defender on low ground: -10% attack, -15% defense

Total swing: ~70% advantage!
```

**Forest Defense:**
```
Defender in forest: +15% defense
Attacker loses line of sight if forest between

Strategy: Retreat to forest when low HP
```

**Flanking Prevention:**
```
Position near walls or corners
Limits enemy approach angles
Prevents flanking bonus
```

### Movement Tactics

**Kiting:**
1. Attack from range
2. Move away
3. Repeat (requires 3+ movement)

**Zoning:**
1. Control high ground
2. Force enemies into bad terrain
3. Maintain range advantage

**Rushing:**
1. Move max distance forward
2. Engage immediately
3. Works best with high movement

---

## Grid Actions

### How to Move on the Grid

**Movement is now a Skill!** Each class has a unique movement ability with mana cost and cooldown.

**Step 1: Use Movement Skill**
- During your turn, click your class's **movement skill** (e.g., "Shadow Step", "Quick Step")
- Mana cost: 10-15 depending on class
- Cooldown: 0-2 turns depending on class

**Step 2: See Valid Moves**
- Valid movement cells will be **highlighted in blue**
- The number of valid moves depends on your:
  - Base movement speed (default: 2)
  - Class bonuses (Assassins get +1)
  - Terrain costs (forests/water slow you down)

**Step 3: Click to Move**
- Click any **highlighted cell** to move there
- Movement is instant
- Terrain effects apply immediately after moving
- Mana is deducted and cooldown is set

**Step 4: Invalid Moves**
- If you click an unhighlighted cell, you'll see a warning
- Choose again from the valid options

### Movement Skills by Class

| Class | Skill Name | Mana Cost | Cooldown |
|-------|------------|-----------|----------|
| **Tank** | Tactical Reposition | 15 | 2 turns |
| **Balanced** | Reposition | 10 | 1 turn |
| **Agile** | Quick Step | 10 | 1 turn |
| **Mage** | Arcane Step | 15 | 2 turns |
| **Hybrid** | Tactical Movement | 10 | 1 turn |
| **Assassin** | Shadow Step | 10 | 0 turns (spam!) |
| **Brawler** | Advance | 10 | 1 turn |

### Available Actions

1. **💫 Movement Skills**
   - Use class-specific movement skill to reposition
   - Costs mana and has cooldown
   - Strategic choice vs attacking/defending
   - **Interactive**: Click highlighted cells to move

2. **⚔️ Attack**
   - Attack enemy **within your attack range**
   - **Melee classes**: Range 1 (must be adjacent)
   - **Mages**: Range 3 (can attack from distance!)
   - Requires line of sight
   - **Blocked if out of range** - must move closer first!
   - Applies terrain bonuses

3. **✨ Use Skill**
   - Special abilities
   - Some skills have range
   - Costs mana

4. **🛡️ Defend**
   - Reduce incoming damage 50%
   - Maintain position
   - Lasts until next turn

5. **⏸️ Wait**
   - End turn without acting
   - Useful for timing

---

## UI Features

### Grid Visualization

**Cell Colors:**
- **Grey**: Normal terrain
- **Green**: Grassland
- **Dark Green**: Forest
- **Blue**: Water
- **Brown**: Mud
- **Grey**: Rock
- **Light Brown**: High ground
- **Dark Brown**: Low ground
- **Dark Grey**: Wall/Pit

**Fighter Icons:**
- **🦸 Green**: Player/Ally
- **👹 Red**: Enemy

**Highlights:**
- **Green pulse**: Valid move destinations
- **Red pulse**: Valid attack targets
- **Gold border**: Selected cell
- **Gold glow**: Occupied cells

### Interactive Elements

**Click Actions:**
- Click cell to select
- Click valid move to move
- Click enemy to attack
- Hover for terrain info

**Tooltips:**
- Terrain type and effects
- Fighter name and HP
- Movement cost
- Bonuses/penalties

### Legend

Always visible legend shows:
- Terrain types
- Icons and meanings
- Current fighter counts

---

## Integration with Existing Systems

### Combat Phase System
- Grid actions integrate with action phase
- Maintains turn-based flow
- Adds positioning layer

### Status Effects
- Status effects work on grid
- Area effects possible (future)
- Terrain + status combos

### AI System
- AI evaluates terrain bonuses
- Seeks high ground
- Avoids bad terrain
- Uses flanking opportunities

---

## Performance

### Optimizations
- Efficient pathfinding (BFS)
- Line-of-sight caching
- Minimal re-renders
- Smooth animations

### Memory Usage
- 25 cell objects (~1KB)
- Fighter position tracking
- Terrain state minimal

---

## API Reference

### GridManager

```javascript
import { gridManager } from './game/GridManager.js';

// Place fighter
gridManager.placeFighter(fighter, x, y);

// Get valid moves
const moves = gridManager.getValidMoves(fighter, range);

// Check line of sight
const canSee = gridManager.hasLineOfSight(x1, y1, x2, y2);

// Get enemies in range
const enemies = gridManager.getEnemiesInRange(fighter, range);

// Check flanking
const isFlanked = gridManager.isFlanked(fighter);
```

### TerrainSystem

```javascript
import { TerrainGenerator, TerrainEffectProcessor } from './game/TerrainSystem.js';

// Generate terrain
const layout = TerrainGenerator.generateRandom();
const layout2 = TerrainGenerator.generateByName('MOUNTAIN_PASS');

// Get terrain info
const color = TerrainEffectProcessor.getTerrainColor('high_ground');
const icon = TerrainEffectProcessor.getTerrainIcon('forest');
const desc = TerrainEffectProcessor.getTerrainDescription('water');
```

### GridCombatIntegration

```javascript
import { gridCombatIntegration } from './game/GridCombatIntegration.js';

// Initialize battle
gridCombatIntegration.initializeBattle(player, enemy, 'ARENA');

// Get available actions
const actions = gridCombatIntegration.getAvailableActions(fighter);

// Execute move
gridCombatIntegration.executeMove(fighter, targetX, targetY);

// Execute attack
const result = gridCombatIntegration.executeAttack(attacker, targetX, targetY);

// Get combat info
const info = gridCombatIntegration.getCombatInfo(fighter);

// Cleanup
gridCombatIntegration.cleanup();
```

### GridCombatUI Component

```javascript
// In HTML/JS
const gridUI = document.createElement('grid-combat-ui');
document.body.appendChild(gridUI);

// Set grid manager
gridUI.setGridManager(gridManager);

// Set mode
gridUI.setMode('move', { validMoves: moves });
gridUI.setMode('attack', { validTargets: enemies });

// Handle clicks
gridUI.onCellClick = (x, y) => {
  console.log(`Clicked cell: ${x}, ${y}`);
};

// Select cell
gridUI.selectCell(x, y);

// Clear selection
gridUI.clearSelection();
```

---

## Future Enhancements

### Planned Features
1. **Area-of-Effect Skills** - Skills that hit multiple cells
2. **Terrain Destruction** - Break walls, create obstacles
3. **Environmental Hazards** - Fire, poison clouds, traps
4. **Multi-Fighter Battles** - 2v2, 3v3 on grid
5. **Terrain Abilities** - Class skills that manipulate terrain
6. **Weather Effects** - Rain makes terrain muddy, etc.
7. **Interactive Objects** - Barrels, crates, switches
8. **Elevation Changes** - Dynamic terrain modification

### Experimental Ideas
- **Hex Grid** - Alternative to square grid
- **Larger Grids** - 7x7 or 10x10 for epic battles
- **3D Visualization** - Isometric or 3D view
- **Grid Editor** - Custom battlefield creator

---

## Tips & Strategies

### For Players

**Beginner:**
1. Always seek high ground
2. Avoid water and mud
3. Use forests for defense when low HP
4. Stay away from walls (can get cornered)

**Intermediate:**
5. Plan movement path considering terrain costs
6. Use line-of-sight blocking to your advantage
7. Flank when possible for bonus damage
8. Position to prevent being flanked

**Advanced:**
9. Bait enemies into bad terrain
10. Control key high ground positions
11. Use mobility to kite slower enemies
12. Combine terrain + status effects

### For Each Class

**Tank:**
- Hold high ground
- Block narrow passages
- Use rocks for defense
- Don't get caught in water

**Mage:**
- Stay at range
- Use high ground for attack bonus
- Hide behind walls
- Avoid getting flanked

**Assassin:**
- High mobility, use it!
- Flank positioning
- Hit and run tactics
- Jump between cover

**Warrior:**
- Rush high ground
- Force melee engagements
- Tank on favorable terrain
- Push enemies into bad spots

---

## Version

- **Version**: 4.7.0
- **Date**: 2026-01-09
- **Grid Size**: 5x5
- **Terrain Types**: 10
- **Battlefield Layouts**: 6
- **Status**: ✅ Complete

---

**Master the grid to master combat!** ⚔️🗺️

