# Combo System Documentation

## Overview

The Combo System adds depth to combat by rewarding players for executing specific action sequences. When you perform certain combinations of attacks, skills, and defensive moves, you trigger powerful combo effects that can turn the tide of battle.

## How It Works

### Action Tracking

The system tracks your last 5 actions during combat. When your recent actions match a combo pattern, the combo automatically triggers with bonus effects.

### Combo Types

#### Universal Combos
Available to all classes:
- **Offensive Surge** (⚔️⚔️): Two attacks → +30% damage, +10 bonus damage
- **Berserker Rush** (⚔️⚔️⚔️): Three attacks → +50% damage, +25 bonus damage, Strength Boost
- **Tactical Retreat** (🛡️⚔️): Defend then attack → +40% damage, +15 HP
- **Double Defense** (🛡️🛡️): Two defends → +30 HP, Defense Boost

#### Class-Specific Combos

**Tank**
- **Iron Fortress**: Iron Wall → Attack → +60% damage, +30 bonus damage, +20 HP
- **Unstoppable Force**: Taunt Strike → Attack → +50% damage, -1 turn cooldown

**Balanced**
- **Perfect Balance**: Power Slash → Second Wind → +40 HP, +20 mana, -1 turn cooldown
- **Warrior's Resolve**: Second Wind → Attack → +40% damage, +20 bonus damage

**Agile**
- **Rapid Assault**: Swift Strike → Poison Dart → +30% damage, +15 bonus damage, Poison
- **Shadow Dance**: Swift Strike → Attack → Attack → +60% damage, +25 bonus damage, +15 mana

**Mage**
- **Arcane Inferno**: Mana Surge → Fireball → +100% damage, +50 bonus damage, +25 mana
- **Elemental Barrage**: Fireball → Attack → +50% damage, Burn effect

**Hybrid**
- **Adaptive Strike**: Versatile Strike → Attack → +40% damage, +20 HP, +15 mana
- **Life Surge**: Rejuvenate → Attack → +30% damage, +30 HP, Regeneration

**Assassin**
- **Silent Death**: Weaken → Shadow Strike → +120% damage, +60 bonus damage
- **Backstab**: Defend → Shadow Strike → +80% damage, +40 bonus damage, -1 turn cooldown

**Brawler**
- **Knockout Punch**: Adrenaline → Haymaker → +100% damage, +45 bonus damage, Stun
- **Relentless Assault**: Haymaker → Attack → Attack → +70% damage, +35 bonus damage, +25 HP

## Combo Effects

### Damage Bonuses
- **Damage Multiplier**: Increases base damage by a percentage
- **Extra Damage**: Adds flat bonus damage on top of multiplier

### Healing & Mana
- **Heal**: Restores HP immediately
- **Mana Restore**: Replenishes mana for more skills

### Status Effects
- **Strength Boost**: Increases attack power
- **Defense Boost**: Reduces incoming damage
- **Poison**: Damage over time
- **Burn**: Fire damage over time
- **Stun**: Skip enemy turn
- **Regeneration**: Heal over time

### Utility
- **Cooldown Reduce**: Reduces skill cooldowns by 1-2 turns

## Strategy Tips

### 1. Plan Your Sequences
Think ahead! Instead of just attacking, consider what combo you're building toward.

### 2. Class Synergy
Learn your class's specific combos. They're usually more powerful than universal ones.

### 3. Combo Chains
Some combos set you up for another combo. For example:
- Berserker Rush gives Strength Boost
- Use that boost to start another powerful combo

### 4. Defensive Combos
Don't forget defensive combos! They can save you while dealing damage.

### 5. Mana Management
Mage combos often restore mana, allowing for sustained skill usage.

## Visual Indicators

### Combo Trigger
When you trigger a combo, you'll see:
- Large animated banner with combo name
- Combo icon
- Description of effects
- Bonus details (damage, healing, etc.)

### Combo Hints
During combat, watch for combo hints that show:
- Available combos based on your recent actions
- Progress toward completing a combo
- What action you need next

## Technical Details

### Action History
- System remembers your last 5 actions
- Each action includes type (attack/defend/skill) and skill name
- History resets when combo triggers (prevents chain triggering)

### Combo Matching
- Checks recent actions against all combo definitions
- Respects class restrictions
- Matches exact sequence of actions

### Effect Application
- Damage multipliers apply before extra damage
- Healing and mana restore happen immediately
- Status effects apply to target
- Cooldown reductions affect all skills

## Integration with Game Systems

### Works With
- ✅ All combat modes (Single, Team, Tournament, Story)
- ✅ AI opponents (they can trigger combos too!)
- ✅ Status effects system
- ✅ Skill cooldowns
- ✅ Difficulty modifiers

### Stacks With
- Equipment bonuses
- Level bonuses
- Difficulty multipliers
- Critical hits

## Examples

### Example 1: Mage Burst Damage
```
Turn 1: Use Mana Surge (buff yourself)
Turn 2: Use Fireball
Result: Arcane Inferno combo!
  - Fireball damage doubled
  - +50 extra damage
  - +25 mana restored
```

### Example 2: Tank Sustain
```
Turn 1: Use Iron Wall (defense buff)
Turn 2: Attack
Result: Iron Fortress combo!
  - +60% attack damage
  - +30 bonus damage
  - +20 HP healed
```

### Example 3: Assassin Burst
```
Turn 1: Use Weaken (debuff enemy)
Turn 2: Use Shadow Strike
Result: Silent Death combo!
  - +120% damage (more than double!)
  - +60 extra damage
  - Massive burst potential
```

## Advanced Tactics

### Combo Canceling
If you're building toward a combo but need to adapt:
- Using an item resets your combo progress
- Sometimes it's worth breaking a combo to survive

### Multi-Combo Battles
In longer fights, you can trigger multiple combos:
- Universal combos are easier to trigger
- Class combos are more powerful
- Mix both for sustained advantage

### Team Synergy
In team battles, coordinate combos:
- One fighter sets up with buffs
- Another finishes with powerful attacks
- Combo effects can swing team fights

## Future Enhancements

Potential additions in future versions:
- Custom combo creation
- Combo achievements
- Combo leaderboards
- Team combo chains
- Ultimate combos (4-5 action sequences)

---

## Quick Reference

### Universal Combos
| Name | Sequence | Key Benefit |
|------|----------|-------------|
| Offensive Surge | ⚔️⚔️ | +30% damage |
| Berserker Rush | ⚔️⚔️⚔️ | +50% damage + buff |
| Tactical Retreat | 🛡️⚔️ | +40% damage + heal |
| Double Defense | 🛡️🛡️ | Heal + defense buff |

### Best Class Combos
| Class | Combo | Power Level |
|-------|-------|-------------|
| Mage | Arcane Inferno | ⭐⭐⭐⭐⭐ |
| Assassin | Silent Death | ⭐⭐⭐⭐⭐ |
| Brawler | Knockout Punch | ⭐⭐⭐⭐⭐ |
| Tank | Iron Fortress | ⭐⭐⭐⭐ |
| Agile | Shadow Dance | ⭐⭐⭐⭐ |

---

**Version**: 4.1.0  
**Status**: ✅ Fully Implemented  
**Difficulty**: Intermediate to Advanced
