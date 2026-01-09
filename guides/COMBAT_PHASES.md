# Combat Phase System Documentation

## Overview

The Combat Phase System provides a structured, event-driven approach to combat with clear phases, event hooks, and action queuing. This makes combat more predictable, extensible, and easier to debug.

## Architecture

### Core Components

1. **CombatPhaseManager** - Main orchestrator
2. **ActionQueue** - Action queuing with priorities
3. **EventManager** - Event bus for combat events
4. **Phase Hooks** - Extensibility points

## Combat Phases

### Phase Flow

```
IDLE → BATTLE_START → TURN_START → ACTION_SELECTION → 
ACTION_EXECUTION → ACTION_RESOLUTION → TURN_END → 
(repeat turns) → BATTLE_END → IDLE
```

### Phase Descriptions

#### 1. IDLE
- Combat not active
- Used before and after battles

####2. BATTLE_START
- Battle initialization
- Pre-combat setup
- Fighter introductions
- **Hooks**: Pre-battle buffs, environment effects

#### 3. TURN_START
- New turn begins
- Status effect ticks
- Cooldown reductions
- **Hooks**: Turn-based abilities, conditional effects

#### 4. ACTION_SELECTION
- Fighter chooses action
- AI decision making
- Player input
- **Hooks**: Action suggestions, auto-actions

#### 5. ACTION_EXECUTION
- Action is performed
- Damage/healing calculated
- Effects triggered
- **Hooks**: Damage modification, counter-attacks

#### 6. ACTION_RESOLUTION
- Effects applied
- Combos triggered
- Victory checked
- **Hooks**: Post-action effects, chain reactions

#### 7. TURN_END
- Turn cleanup
- Effect processing
- Turn counter increment
- **Hooks**: End-of-turn abilities

#### 8. BATTLE_END
- Battle concluded
- Rewards distributed
- Stats recorded
- **Hooks**: Post-battle bonuses, achievements

## Combat Events

### Event Categories

#### Battle Lifecycle
- `combat:battle_started` - Battle begins
- `combat:battle_ended` - Battle concludes

#### Turn Lifecycle
- `combat:turn_started` - Turn begins
- `combat:turn_ended` - Turn ends

#### Action Lifecycle
- `combat:action_selected` - Action chosen
- `combat:action_queued` - Action added to queue
- `combat:action_executing` - Action executing
- `combat:action_executed` - Action completed
- `combat:action_resolved` - Effects resolved

#### Combat Results
- `combat:damage_dealt` - Damage inflicted
- `combat:healing_applied` - HP restored
- `combat:status_applied` - Status effect added
- `combat:status_removed` - Status effect removed

#### Fighter State
- `combat:fighter_defeated` - Fighter KO'd
- `combat:health_changed` - HP changed
- `combat:mana_changed` - Mana changed

#### Combo System
- `combat:combo_triggered` - Combo activated
- `combat:combo_broken` - Combo lost

## Usage Examples

### Basic Setup

```javascript
import { combatPhaseManager, CombatPhase, CombatEvent } from './CombatPhaseManager.js';

// Initialize combat
combatPhaseManager.initialize(player, enemy, turnManager);

// Start battle
await combatPhaseManager.startBattle();
```

### Event Listeners

```javascript
// Listen for damage events
combatPhaseManager.on(CombatEvent.DAMAGE_DEALT, (data) => {
  console.log(`${data.attacker.name} dealt ${data.damage} damage!`);
  updateUI(data);
});

// Listen for turn start
combatPhaseManager.on(CombatEvent.TURN_STARTED, (data) => {
  console.log(`Turn ${data.turnNumber}: ${data.fighter.name}'s turn`);
  showTurnIndicator(data.fighter);
});

// Listen for combos
combatPhaseManager.on(CombatEvent.COMBO_TRIGGERED, (data) => {
  showComboAnimation(data.combo);
  playSoundEffect('combo');
});
```

### Phase Hooks

```javascript
// Register a hook for turn start (e.g., regeneration)
const hookId = combatPhaseManager.registerPhaseHook(
  CombatPhase.TURN_START,
  (data) => {
    const { fighter } = data;
    
    // Apply regeneration if fighter has it
    if (fighter.hasStatus('regeneration')) {
      fighter.health += 10;
      console.log(`${fighter.name} regenerated 10 HP!`);
    }
    
    return { regenerationApplied: true };
  },
  10 // Priority: higher executes first
);

// Later: remove hook
combatPhaseManager.unregisterPhaseHook(hookId);
```

### Action Queue

```javascript
// Queue an action
const action = {
  type: 'attack',
  attacker: player,
  target: enemy,
  priority: 0, // Normal priority
};

combatPhaseManager.queueAction(action);

// Queue a high-priority action (interrupts)
const interruptAction = {
  type: 'counter',
  attacker: enemy,
  target: player,
  priority: 10, // High priority
};

combatPhaseManager.queueAction(interruptAction);

// Execute next action
const result = await combatPhaseManager.executeNextAction();
```

### Custom Combat Flow

```javascript
async function runCustomCombat() {
  // Start battle
  await combatPhaseManager.startBattle();
  
  while (!battleEnded) {
    // Start turn
    const activeFighter = turnManager.getCurrentFighter();
    await combatPhaseManager.startTurn(activeFighter);
    
    // Get action (player or AI)
    const action = await getAction(activeFighter);
    
    // Queue and execute
    combatPhaseManager.queueAction(action);
    const result = await combatPhaseManager.executeNextAction();
    
    // Check victory
    if (result.fighterDefeated) {
      await combatPhaseManager.endBattle(result.winner, result.loser);
      battleEnded = true;
    } else {
      await combatPhaseManager.endTurn(activeFighter);
      turnManager.nextTurn();
    }
  }
}
```

## Integration with Existing Systems

### Combo System Integration

```javascript
// Hook combo system into action resolution
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_RESOLUTION,
  (data) => {
    const { action, result } = data;
    
    // Record action for combo tracking
    comboSystem.recordAction(
      action.attacker,
      action.type,
      action.skillName
    );
    
    // Check for combos
    const combo = comboSystem.checkForCombo(action.attacker);
    if (combo) {
      combatPhaseManager.emit(CombatEvent.COMBO_TRIGGERED, { combo });
    }
    
    return { comboChecked: true };
  },
  5 // Medium priority
);
```

### AI System Integration

```javascript
// Hook AI into action selection
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_SELECTION,
  async (data) => {
    const { fighter } = data;
    
    if (!fighter.isPlayer) {
      // Use AI to select action
      const aiManager = createAI(fighter);
      const action = aiManager.chooseAction(fighter, opponent);
      
      combatPhaseManager.queueAction(action);
      
      return { aiActionSelected: true };
    }
  },
  0
);
```

### Status Effect Integration

```javascript
// Apply status effects at turn start
combatPhaseManager.registerPhaseHook(
  CombatPhase.TURN_START,
  (data) => {
    const { fighter } = data;
    
    // Process all status effects
    fighter.statusEffects.forEach((effect) => {
      effect.apply(fighter);
      
      combatPhaseManager.emit(CombatEvent.STATUS_APPLIED, {
        fighter,
        effect,
      });
      
      // Remove expired effects
      if (!effect.tick()) {
        effect.remove(fighter);
        combatPhaseManager.emit(CombatEvent.STATUS_REMOVED, {
          fighter,
          effect,
        });
      }
    });
    
    return { statusEffectsProcessed: true };
  },
  15 // High priority - before other turn start effects
);
```

## Advanced Features

### Priority System

Actions and hooks support priorities:
- **0-4**: Low priority (passive effects)
- **5-9**: Normal priority (standard actions)
- **10-14**: High priority (reactions, counters)
- **15+**: Critical priority (interrupts, shields)

### Action Batching

```javascript
// Queue multiple actions at once
const actions = [
  { type: 'buff', attacker: player, target: player },
  { type: 'attack', attacker: player, target: enemy },
  { type: 'attack', attacker: player, target: enemy },
];

actions.forEach((action) => combatPhaseManager.queueAction(action));

// Execute all queued actions
while (combatPhaseManager.getActionQueue().length > 0) {
  await combatPhaseManager.executeNextAction();
}
```

### Conditional Hooks

```javascript
// Only execute hook if condition met
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_EXECUTION,
  (data) => {
    const { action } = data;
    
    // Only trigger if fighter is below 50% HP
    if (action.attacker.health / action.attacker.maxHealth < 0.5) {
      // Apply desperate strike bonus
      action.damageMultiplier = (action.damageMultiplier || 1.0) * 1.2;
      
      return { desperateStrikeActive: true };
    }
  },
  8
);
```

### Debug Tools

```javascript
// Get current phase
console.log('Current phase:', combatPhaseManager.getPhase());

// Get action queue
console.log('Queued actions:', combatPhaseManager.getActionQueue());

// Get phase history
console.log('Phase history:', combatPhaseManager.getPhaseHistory());

// Get debug info
console.log('Debug info:', combatPhaseManager.getDebugInfo());
```

## Best Practices

### 1. Use Appropriate Priorities
- Reserve high priorities (10+) for reactive abilities
- Use normal priorities (5-9) for standard actions
- Use low priorities (0-4) for passive effects

### 2. Clean Up Hooks
Always unregister hooks when no longer needed:

```javascript
const hookId = combatPhaseManager.registerPhaseHook(phase, callback);

// Later...
combatPhaseManager.unregisterPhaseHook(hookId);
```

### 3. Handle Async Operations
Phase hooks and action execution support async:

```javascript
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_EXECUTION,
  async (data) => {
    await playAnimation(data.action);
    await wait(500);
    return { animationPlayed: true };
  }
);
```

### 4. Emit Meaningful Events
Emit events for important state changes:

```javascript
combatPhaseManager.emit(CombatEvent.HEALTH_CHANGED, {
  fighter,
  oldHealth,
  newHealth,
  change: newHealth - oldHealth,
});
```

### 5. Keep Actions Immutable
Don't modify original action objects:

```javascript
// Bad
action.damage += 10;

// Good
return {
  ...action,
  damage: (action.damage || 0) + 10,
};
```

## Migration Guide

### From Old Combat System

**Before:**
```javascript
// Direct execution
const damage = attacker.attack();
defender.takeDamage(damage);
```

**After:**
```javascript
// Phased execution
const action = { type: 'attack', attacker, target: defender };
combatPhaseManager.queueAction(action);
await combatPhaseManager.executeNextAction();
```

### Gradual Migration

1. Keep existing combat flow
2. Add phase manager alongside
3. Emit events from old system
4. Gradually move logic to hooks
5. Eventually replace old system

## Performance Considerations

- Phase hooks execute in priority order
- Action queue uses efficient array operations
- Event listeners are stored in Map for O(1) lookup
- History is trimmed automatically to prevent memory leaks

## Debugging

### Enable Debug Logging

```javascript
// See all phase transitions
combatPhaseManager.on('phase_changed', (data) => {
  console.log(`Phase: ${data.from} → ${data.to}`);
});

// Track all actions
combatPhaseManager.on(CombatEvent.ACTION_QUEUED, (data) => {
  console.log('Action queued:', data.action);
});
```

### Inspect State

```javascript
// Get complete state snapshot
const state = {
  phase: combatPhaseManager.getPhase(),
  queue: combatPhaseManager.getActionQueue(),
  history: combatPhaseManager.getPhaseHistory(),
  debug: combatPhaseManager.getDebugInfo(),
};

console.log('Combat state:', state);
```

---

**Version**: 4.2.0  
**Status**: ✅ Fully Implemented  
**Complexity**: Advanced
