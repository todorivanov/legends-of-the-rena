

# Status Effect System Guide

## Overview

Version 4.7.0 introduces an enhanced status effect system with **17 different effects** and a comprehensive **interaction matrix** that creates strategic depth in combat.

---

## Status Effects

### 🔴 Damage Over Time (DOT)

#### Poison ☠️
- **Duration**: 4 turns
- **Effect**: -10 HP per turn
- **Stackable**: Yes (max 5 stacks)
- **Tags**: damage, nature

#### Burn 🔥
- **Duration**: 3 turns
- **Effect**: -12 HP per turn
- **Stackable**: Yes (max 3 stacks)
- **Tags**: damage, fire
- **Interactions**: Melts Frozen, extinguished by Frozen

#### Bleed 🩸
- **Duration**: 4 turns
- **Effect**: -8 HP per turn
- **Stackable**: Yes (max 5 stacks)
- **Tags**: damage, physical
- **Special**: Damage increases when taking actions

#### Shock ⚡
- **Duration**: 2 turns
- **Effect**: -15 HP per turn
- **Tags**: damage, lightning, chain
- **Interactions**: Amplified when Wet (x2 damage)

### 💚 Healing Over Time (HOT)

#### Regeneration 💚
- **Duration**: 5 turns
- **Effect**: +15 HP per turn
- **Stackable**: Yes (max 3 stacks)
- **Tags**: healing
- **Interactions**: Partially canceled by Poison, reduced by Curse

### 💪 Stat Buffs

#### Strength Boost 💪
- **Duration**: 3 turns
- **Effect**: +20 Strength
- **Tags**: stat_boost

#### Defense Boost 🛡️
- **Duration**: 3 turns
- **Effect**: +15 Defense
- **Tags**: stat_boost

#### Bless ✨
- **Duration**: 3 turns
- **Effect**: +25% damage dealt
- **Tags**: damage_boost, holy
- **Interactions**: Cancels Curse

#### Haste 💨
- **Duration**: 3 turns
- **Effect**: +40% action speed
- **Tags**: speed_boost, time
- **Interactions**: Cancels Slow

#### Fortify ⛰️
- **Duration**: 3 turns
- **Effect**: -30% damage taken
- **Stackable**: Yes (max 2 stacks)
- **Tags**: damage_reduction
- **Interactions**: Partially cancels Vulnerable

#### Enrage 😡
- **Duration**: 2 turns
- **Effect**: +40% damage, -20% defense
- **Tags**: berserk
- **Trade-off**: Higher damage but lower defense

#### Clarity 🧠
- **Duration**: 3 turns
- **Effect**: -50% mana costs
- **Tags**: mana

### 😰 Stat Debuffs

#### Weakness 😰
- **Duration**: 3 turns
- **Effect**: -15 to all stats
- **Tags**: stat_debuff

#### Curse 🌑
- **Duration**: 4 turns
- **Effect**: -50% healing received
- **Tags**: healing_reduction, dark
- **Interactions**: Reduces healing effects, cancels Bless

#### Slow 🐌
- **Duration**: 3 turns
- **Effect**: -30% action speed
- **Tags**: speed_debuff, time
- **Interactions**: Cancels Haste

#### Vulnerable 💔
- **Duration**: 2 turns
- **Effect**: +50% damage taken
- **Tags**: damage_amp
- **Interactions**: Partially canceled by Fortify

### 🛡️ Protection Effects

#### Shield 🔰
- **Duration**: 3 turns
- **Effect**: Absorbs 50 damage
- **Tags**: protection, absorption
- **Special**: Tracks absorbed damage

#### Reflect 🪞
- **Duration**: 2 turns
- **Effect**: Reflects 30% damage back to attacker
- **Tags**: protection, counter

#### Thorns 🌹
- **Duration**: 4 turns
- **Effect**: Returns 15 damage when hit
- **Stackable**: Yes (max 3 stacks)
- **Tags**: counter, damage

### 🎯 Crowd Control

#### Stun 💫
- **Duration**: 1 turn
- **Effect**: Cannot act
- **Tags**: cc, disable

#### Frozen ❄️
- **Duration**: 2 turns
- **Effect**: -30% speed
- **Tags**: cc, ice, shatterable
- **Interactions**: Melted by Burn, can shatter on heavy hit (+30 bonus damage)
- **Special**: Vulnerable to shattering

#### Silence 🔇
- **Duration**: 2 turns
- **Effect**: Cannot use skills
- **Tags**: cc, disable

---

## Interaction Matrix

Status effects can interact with each other, creating strategic combos and counter-plays:

### Fire 🔥 + Ice ❄️
- **Burn removes Frozen** - Fire melts ice
- **Frozen removes Burn** - Ice extinguishes fire
- Priority: 10

### Poison ☠️ + Regeneration 💚
- **Reduce Both** - Effects partially cancel (50% reduction)
- Priority: 5

### Shock ⚡ + Wet 💧
- **Amplify Shock** - Double shock damage when wet
- Priority: 8

### Curse 🌑 + Regeneration 💚
- **Reduce Healing** - Curse cuts healing in half
- Priority: 7

### Curse 🌑 + Bless ✨
- **Dispel Both** - Light and dark cancel each other
- Priority: 12

### Haste 💨 + Slow 🐌
- **Dispel Both** - Time effects cancel out
- Priority: 10

### Vulnerable 💔 + Fortify ⛰️
- **Reduce Both** - Protection vs vulnerability (50% reduction)
- Priority: 8

### Bleed 🩸 + Action Taken
- **Stack Bleed** - Taking actions worsens bleeding
- Priority: 5

### Frozen ❄️ + Heavy Damage
- **Shatter** - Frozen targets take +30 bonus damage and effect breaks
- Priority: 15

### Shield 🔰 + Vulnerable 💔
- **Reduce Vulnerable** - Shield provides some protection
- Priority: 6

### Enrage 😡 + Weakness 😰
- **Reduce Weakness** - Rage partially overcomes weakness
- Priority: 7

---

## Strategic Use

### Offensive Combos

**DOT Stack**
```
Poison + Burn + Bleed = Massive damage over time
```

**Burst Damage**
```
Bless + Enrage + Vulnerable (on enemy) = Maximum damage
```

**Shatter Combo**
```
1. Apply Frozen to enemy
2. Deal heavy damage
3. Trigger shatter for +30 bonus damage
```

**Shock Chain**
```
1. Apply Wet status (from environment/skill)
2. Apply Shock
3. Deal double shock damage
```

### Defensive Combos

**Tank Build**
```
Fortify + Shield + Thorns = Absorb and reflect damage
```

**Sustain Build**
```
Regeneration (stacked) + Clarity = Continuous healing with mana
```

**Speed Control**
```
Haste (self) + Slow (enemy) = Action advantage
```

### Counter-Plays

**Against DOTs**
```
- Apply Regeneration to offset Poison/Burn
- Use dispel abilities
- End fight quickly with Bless + Enrage
```

**Against Crowd Control**
```
- Haste reduces CC duration impact
- Shield can absorb damage during stun
- Dispel removes Frozen/Silence
```

**Against Buffs**
```
- Curse negates healing strategies
- Vulnerable amplifies damage through shields
- Silence prevents skill usage
```

---

## Effect Stacking

Some effects can stack:

### Stackable Effects
- **Poison**: Max 5 stacks
- **Burn**: Max 3 stacks
- **Bleed**: Max 5 stacks
- **Regeneration**: Max 3 stacks
- **Fortify**: Max 2 stacks
- **Thorns**: Max 3 stacks

### Stacking Rules
1. Each stack increases effect value
2. Duration refreshes on new application
3. Max stacks = no more stacking
4. Dispel removes one stack at a time

---

## Effect Categories

Effects are organized into categories:

- **BUFF**: Positive stat modifications
- **DEBUFF**: Negative stat modifications
- **DOT**: Damage over time
- **HOT**: Heal over time
- **CROWD_CONTROL**: Movement/action restrictions
- **MODIFIER**: Percentage-based modifications

---

## Effect Tags

Effects have tags for filtering and interactions:

- **damage**: Deals damage
- **healing**: Provides healing
- **stat_boost**: Increases stats
- **stat_debuff**: Decreases stats
- **cc**: Crowd control
- **disable**: Prevents actions
- **fire/ice/lightning/nature**: Element types
- **protection**: Defensive effects
- **counter**: Retaliatory effects

---

## API Usage

### Applying Effects

```javascript
import { applyEffect } from './game/StatusEffectSystem.js';

// Apply effect to fighter
applyEffect(fighter, 'BURN');
applyEffect(fighter, 'BLESS');
```

### Checking Effects

```javascript
import { hasEffect, statusEffectManager } from './game/StatusEffectSystem.js';

// Check if fighter has effect
if (hasEffect(fighter, 'frozen')) {
  // Can trigger shatter
}

// Get effect details
const effect = statusEffectManager.getEffect(fighter, 'burn');
console.log(`Burn stacks: ${effect.stacks}`);
```

### Processing Effects

```javascript
import { processEffects } from './game/StatusEffectSystem.js';

// Process all effects (call each turn)
processEffects(fighter);
```

### Dispelling Effects

```javascript
import { dispelEffects } from './game/StatusEffectSystem.js';

// Dispel 2 debuffs
dispelEffects(fighter, 2, 'debuff');

// Dispel 1 buff
dispelEffects(fighter, 1, 'buff');
```

### Clearing Effects

```javascript
import { clearEffects } from './game/StatusEffectSystem.js';

// Remove all effects
clearEffects(fighter);
```

---

## Advanced Features

### Custom Effects

Create custom effects by extending the system:

```javascript
const CUSTOM_EFFECT = {
  name: 'my_effect',
  type: 'buff',
  category: EffectCategory.BUFF,
  duration: 3,
  value: 25,
  icon: '🌟',
  description: 'Custom effect',
  tags: ['custom'],
  onApply: (fighter, effect) => {
    // Custom logic on application
  },
  onRemove: (fighter, effect) => {
    // Custom logic on removal
  },
  onStack: (effect) => {
    // Custom logic on stacking
  },
};
```

### Effect Metadata

Effects can store custom data:

```javascript
const effect = statusEffectManager.getEffect(fighter, 'shield');
console.log(`Damage absorbed: ${effect.metadata.absorbedDamage}`);
```

### Tag-Based Queries

Query effects by tags:

```javascript
// Get all damage-dealing effects
const damageEffects = statusEffectManager.getEffectsByTag(fighter, 'damage');

// Get all crowd control effects
const ccEffects = statusEffectManager.getEffectsByCategory(fighter, EffectCategory.CROWD_CONTROL);
```

---

## Tips & Tricks

### For Players

1. **Stack DOTs Early** - Apply multiple DOTs at fight start for maximum damage
2. **Watch for Interactions** - Look for combo opportunities (Frozen + Heavy hit = Shatter)
3. **Counter Enemy Strategy** - Use Curse against healing builds, Silence against casters
4. **Time Your Dispels** - Save dispels for high-priority debuffs
5. **Build Synergies** - Combine effects that work well together (Bless + Enrage)

### For Developers

1. **Balance Testing** - Test effect combinations for balance issues
2. **Visual Feedback** - Provide clear indicators when interactions trigger
3. **Performance** - Effect processing is optimized with the status manager
4. **Extensibility** - Easy to add new effects and interactions
5. **Documentation** - Keep effect descriptions clear and accurate

---

## Version

- **Version**: 4.7.0
- **Date**: 2026-01-09
- **Effects**: 17 total
- **Interactions**: 11 defined
- **Status**: ✅ Complete

---

**Next**: Integrate with skill system for strategic gameplay! ⚔️
