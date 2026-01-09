# Weapon Range & Attack Distance System

## Overview

The grid combat system now includes a comprehensive **attack range** mechanic. Fighters can only attack enemies within their attack range, making positioning absolutely critical to combat success.

---

## Attack Range Mechanics

### Base Class Ranges

Each class has a **base attack range** determined by their combat style:

| Class | Range | Type | Description |
|-------|-------|------|-------------|
| **Warrior** | 1 | Melee | Sword and board, close combat |
| **Tank** | 1 | Melee | Heavy armor, defensive stance |
| **Balanced** | 1 | Melee | Versatile melee fighter |
| **Glass Cannon** | 1 | Melee | High-risk close range |
| **Bruiser** | 1 | Melee | Brawling, fist fighting |
| **Assassin** | 1 | Melee | Dagger strikes, close quarters |
| **Berserker** | 1 | Melee | Axe wielding, brutal attacks |
| **Paladin** | 1 | Melee | Holy weapons, melee range |
| **Mage** | 3 | Ranged Magic | Arcane blasts, projectile spells |
| **Necromancer** | 3 | Ranged Magic | Dark magic, life drain |

### Weapon Range Modifiers

Weapons can **extend** your attack range:

#### Melee Weapons (Range 1)
- **Swords**: wooden_sword, iron_sword, steel_sword, flame_blade, etc.
- **Axes**: steel_axe, thunder_axe
- **Daggers**: shadow_dagger, poison_dagger
- **Maces/Fists**: All brawling weapons

#### Magic Weapons (Range 3)
- **Staves**: arcane_staff, mystic_staff
- **Wands**: Various magical focus items

#### Legendary Weapons (Range 2)
- **Excalibur**: Extended reach (2 cells)
- **Infinity Blade**: Extended reach (2 cells)

### Range Calculation

Your **final attack range** is:

```javascript
attackRange = MAX(classBaseRange, weaponRange)
```

**Examples:**
- **Warrior** with **Iron Sword**: `MAX(1, 1) = 1` (melee)
- **Mage** with **Arcane Staff**: `MAX(3, 3) = 3` (ranged magic)
- **Warrior** with **Excalibur**: `MAX(1, 2) = 2` (extended melee!)
- **Mage** with no weapon: `MAX(3, 0) = 3` (base class range)

---

## Distance Calculation

### Manhattan Distance

The system uses **Manhattan distance** (also called taxicab distance):

```
distance = |x2 - x1| + |y2 - y1|
```

**Why Manhattan?**
- Matches grid-based movement
- Simple and predictable
- No diagonal "shortcuts"

**Examples on 5x5 grid:**
```
You (0,0) → Enemy (0,1) = distance 1 ✅ In melee range
You (0,0) → Enemy (1,1) = distance 2 ❌ Out of melee range
You (0,0) → Enemy (0,3) = distance 3 ✅ In mage range
You (0,0) → Enemy (4,4) = distance 8 ❌ Out of all range
```

---

## Gameplay Flow

### Scenario 1: Melee Fighter vs Distant Enemy

**Turn 1:**
1. Your turn starts
2. Enemy is at distance 4 (too far!)
3. **Attack button** is grayed out with ⚠️ OUT OF RANGE
4. Combat log shows: "⚠️ Enemy out of range! (Need range 1)"
5. **You must use movement skill** to get closer

**Turn 2:**
1. Use "Reposition" movement skill (costs 10 mana)
2. Click cell closer to enemy
3. Now at distance 1 ✅
4. **Attack button** is now enabled
5. Attack successfully!

### Scenario 2: Mage vs Distant Enemy

**Turn 1:**
1. Your turn starts (Mage class)
2. Enemy is at distance 3
3. **Attack button** is enabled ✅ (Mage range = 3)
4. Attack works from distance!
5. No movement needed

**Advantage:** Mages can attack from safety!

### Scenario 3: Out of Range Attack Attempt

If you somehow trigger an attack while out of range:

```
Combat Log:
⚠️ Tosho is out of range! (Need range 1)
💡 Use your movement skill to get closer!
```

The attack is **blocked** and your turn ends.

---

## Strategic Implications

### 1. **Positioning is Critical**

- **Melee fighters** must close distance to attack
- **Ranged fighters** can kite and maintain distance
- **Terrain** affects movement speed (mud slows you down!)

### 2. **Resource Management**

- **Movement costs mana** (10-15 depending on class)
- Must balance: Move closer OR attack from current position?
- Mana must be managed for both movement AND damage skills

### 3. **Class Balance**

**Melee Advantages:**
- ✅ Higher HP and defense
- ✅ Higher physical damage
- ✅ Can use terrain for cover

**Melee Disadvantages:**
- ❌ Must spend turns moving to reach enemy
- ❌ Vulnerable while crossing open ground
- ❌ Mana spent on movement = less for skills

**Ranged Advantages:**
- ✅ Can attack from distance 3
- ✅ Can stay on favorable terrain
- ✅ Can kite melee enemies

**Ranged Disadvantages:**
- ❌ Lower HP (fragile)
- ❌ Lower physical defense
- ❌ Weak if enemy reaches melee range

### 4. **Tactical Decisions**

**Question:** Enemy is 3 cells away. Do you:
- **A)** Use movement skill to close distance? (costs mana, takes a turn)
- **B)** Use ranged skill if available? (some skills have range)
- **C)** Defend and let enemy come to you? (save mana, but they move)

**Answer:** Depends on:
- Your HP (low? stay defensive)
- Your mana (low? don't waste on movement)
- Terrain between you (mud? they'll be slow!)
- Your class (Mage? stay at range!)

---

## Technical Implementation

### Fighter Class

```javascript
/**
 * Get fighter's attack range
 * Combines base class range + equipped weapon range
 */
getAttackRange() {
  const classData = getClassById(this.class);
  let range = classData?.stats?.attackRange || 1;

  // Add weapon range if equipped
  if (this.equipped && this.equipped.weapon) {
    const weapon = EQUIPMENT_DATABASE[this.equipped.weapon];
    if (weapon && weapon.range) {
      range = Math.max(range, weapon.range);
    }
  }

  return range;
}
```

### GridManager Class

```javascript
/**
 * Calculate grid distance (Manhattan)
 */
getDistance(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Check if target is within attack range
 */
isInAttackRange(attackerId, targetId, attackRange) {
  const attacker = this.getFighterById(attackerId);
  const target = this.getFighterById(targetId);

  if (!attacker || !target) return false;

  const distance = this.getDistance(
    attacker.gridPosition.x,
    attacker.gridPosition.y,
    target.gridPosition.x,
    target.gridPosition.y
  );

  return distance <= attackRange;
}
```

### Combat Logic

```javascript
// In game.js - before executing attack
if (!gridCombatIntegration.isTargetInRange(attacker.id, defender.id)) {
  const attackRange = gridCombatIntegration.getAttackRangeForFighter(attacker);
  Logger.log(`⚠️ ${attacker.name} is out of range! (Need range ${attackRange})`);
  Logger.log(`💡 Use your movement skill to get closer!`);
  return; // Block the attack
}
```

### UI Indicators

```javascript
// ActionSelection component
const inRange = this.dataset.inRange === 'true';
const attackBtn = this.shadowRoot.querySelector('.attack-btn');

if (attackBtn && !inRange) {
  attackBtn.classList.add('out-of-range');
  // Shows "⚠️ OUT OF RANGE" on button
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/data/classes.js` | Added `attackRange` to all class stats |
| `src/data/equipment.js` | Added `range` property to weapons |
| `src/entities/fighter.js` | Added `getAttackRange()` method |
| `src/game/GridManager.js` | Added distance & range validation methods |
| `src/game/GridCombatIntegration.js` | Added range checking logic |
| `src/game/game.js` | Added range validation before attacks |
| `src/components/ActionSelection.js` | Added out-of-range visual indicator |
| `src/utils/weaponRangeUpdater.js` | New file: weapon range configuration |

---

## Testing Checklist

- [x] Melee class at distance 1 can attack ✅
- [x] Melee class at distance 2+ cannot attack ❌
- [x] Mage class at distance 3 can attack ✅
- [x] Mage class at distance 4+ cannot attack ❌
- [x] Out-of-range shows warning message in combat log
- [x] Attack button shows "OUT OF RANGE" indicator
- [x] getAttackRange() returns correct values
- [x] Manhattan distance calculated correctly
- [x] Weapon range extends attack range
- [x] Mages can attack from distance
- [x] Movement skills close distance
- [ ] AI uses movement to get in range (TODO)

---

## Future Enhancements

### Possible Additions:

1. **Range-Based Skills**
   - Some skills have different range than basic attack
   - "Charge" skill: move + attack in one action
   - "Snipe" skill: extended range attack

2. **Visual Range Indicators**
   - Show attack range circles on grid
   - Highlight attackable enemies in red
   - Show "out of range" enemies grayed out

3. **Reach Weapons**
   - Spears/polearms with range 2
   - Crossbows with range 4
   - Different weapon types with unique ranges

4. **AI Range Awareness**
   - AI closes distance when out of range
   - AI kites when at disadvantage
   - AI uses terrain to avoid ranged attacks

5. **Range-Based Damage**
   - Point-blank bonus for melee
   - Accuracy penalty at max range
   - "Sweet spot" optimal range

---

**Version:** 4.9.0  
**Date:** 2026-01-09  
**Status:** ✅ Implemented and Tested  
**Gameplay Impact:** High - Fundamentally changes combat tactics
