# Movement Skills Implementation

## Overview

Movement on the tactical grid is now implemented as **class-specific skills** rather than a basic action. This adds strategic depth by making movement a resource-managed decision.

## Implementation Details

### What Changed

#### Before
- Movement was a **basic action button** (🏃 Move)
- Could move freely every turn at no cost
- No strategic cost or cooldown

#### After
- Movement is a **skill** with mana cost and cooldown
- Must manage mana/cooldown to reposition
- Strategic choice: move, attack, or defend?

### Movement Skills by Class

Each class has a unique movement skill with different costs and cooldowns:

| Class | Skill Name | Mana Cost | Cooldown | Notes |
|-------|------------|-----------|----------|-------|
| **Tank** | Tactical Reposition | 15 | 2 turns | Higher cost, longer cooldown |
| **Balanced** | Reposition | 10 | 1 turn | Standard mobility |
| **Agile** | Quick Step | 10 | 1 turn | Fast and efficient |
| **Mage** | Arcane Step | 15 | 2 turns | Magical teleportation |
| **Hybrid** | Tactical Movement | 10 | 1 turn | Versatile positioning |
| **Assassin** | Shadow Step | 10 | 0 turns | Can spam! Best mobility |
| **Brawler** | Advance | 10 | 1 turn | Forward-focused |

### Technical Implementation

#### 1. New Skill Type: `'movement'`

Added to `src/game/SkillSystem.js`:

```javascript
case 'movement':
  // Movement is handled separately by the grid system
  Logger.log(
    `<div class="system-message">🏃 <strong>${caster.name}</strong> is repositioning...</div>`
  );
  soundManager.play('event');
  break;
```

#### 2. Skills Added to CLASS_SKILLS

Each class now has a movement skill as their first skill:

```javascript
ASSASSIN: [
  new Skill('Shadow Step', 10, 0, 'movement', 0, null), // Movement skill
  new Skill('Shadow Strike', 40, 3, 'damage', 90, null),
  new Skill('Weaken', 25, 2, 'debuff', 0, 'STRENGTH_DEBUFF'),
],
```

#### 3. Removed Move Button

Removed from `src/components/ActionSelection.js`:
- ❌ Move button UI element
- ❌ Associated CSS styling

#### 4. Updated Combat Logic

Modified `src/game/game.js` → `executeActionPhased()`:

```javascript
// Handle movement skill
if (action === 'skill' && actionData.skillIndex !== undefined) {
  const skill = attacker.skills[actionData.skillIndex];
  if (skill && skill.type === 'movement') {
    // Check skill readiness and mana
    if (!skill.isReady()) { /* show cooldown message */ }
    if (attacker.mana < skill.manaCost) { /* show mana message */ }
    
    // Deduct mana and set cooldown
    attacker.mana -= skill.manaCost;
    skill.currentCooldown = skill.maxCooldown;
    
    // Execute movement
    await this.handleGridMovement(attacker, defender, turnManager);
    
    // Update HUD and advance turn
    hudManager.update();
    turnManager.nextTurn();
  }
}
```

## User Experience

### How Players Move Now

1. **Select Movement Skill**
   - Click your class's movement skill (first skill slot)
   - Example: "Shadow Step" for Assassins

2. **Check Resources**
   - Ensure you have enough mana (10-15)
   - Check if skill is off cooldown

3. **Click to Move**
   - Valid cells are highlighted in blue
   - Click any highlighted cell to move
   - Mana is deducted and cooldown is set

4. **Plan Ahead**
   - Can't move every turn if on cooldown
   - Must balance mana between movement and other skills

### Strategic Implications

**Positioning is Now Tactical:**
- Can't always escape unfavorable terrain
- Must plan movement around cooldowns
- Assassins have best mobility (0 cooldown!)
- Tanks are slowest (2 turn cooldown)

**Resource Management:**
- Movement competes with other skills for mana
- Must decide: reposition or use damage skill?
- Defensive play when low on mana

**Class Identity:**
- Assassins: Highly mobile, can reposition freely
- Tanks: Slow, must commit to positions
- Agile/Balanced: Moderate mobility

## Benefits

1. **Strategic Depth** - Movement is now a meaningful choice
2. **Class Differentiation** - Each class has unique mobility
3. **Resource Management** - Mana matters more
4. **Tactical Planning** - Can't always run away
5. **Balanced Gameplay** - High mobility has mana/cooldown cost

## Files Modified

- `src/game/SkillSystem.js` - Added movement skill type and skills
- `src/components/ActionSelection.js` - Removed Move button
- `src/game/game.js` - Updated action execution logic
- `docs/GRID_COMBAT_SYSTEM.md` - Updated documentation
- `README.md` - Updated feature list
- `CHANGELOG.md` - Documented changes

## Testing Checklist

- [x] Each class has movement skill as first skill
- [x] Movement costs mana (10-15 depending on class)
- [x] Movement has cooldown (0-2 turns depending on class)
- [x] Grid highlights valid moves when movement skill used
- [x] Mana is deducted after successful move
- [x] Cooldown is set after successful move
- [x] Can't move when on cooldown
- [x] Can't move when insufficient mana
- [x] HUD updates after movement
- [x] Combat log shows movement messages

## Future Enhancements

Potential additions to the movement system:

1. **Advanced Movement Skills**
   - Teleport (ignore terrain)
   - Charge (move + attack)
   - Retreat (move + defense boost)

2. **Terrain Interactions**
   - Skills that create terrain
   - Skills that ignore terrain penalties

3. **Combo Movement**
   - Movement as part of combo chains
   - Bonus effects for moving to specific positions

4. **Positional Abilities**
   - Skills that only work from certain positions
   - Backstab bonuses for flanking

---

**Version:** 4.8.1  
**Date:** 2026-01-09  
**Status:** ✅ Complete and Tested
