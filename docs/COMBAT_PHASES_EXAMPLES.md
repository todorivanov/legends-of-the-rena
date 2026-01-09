# Combat Phase System - Practical Examples

## Table of Contents
1. [Basic Combat Flow](#basic-combat-flow)
2. [Custom Abilities](#custom-abilities)
3. [Reactive Systems](#reactive-systems)
4. [Complex Scenarios](#complex-scenarios)
5. [Testing](#testing)

## Basic Combat Flow

### Simple Turn-Based Combat

```javascript
import { combatPhaseManager, CombatPhase, CombatEvent } from './CombatPhaseManager.js';

async function runSimpleCombat(player, enemy) {
  // Initialize
  const turnManager = new TurnManager([player, enemy]);
  combatPhaseManager.initialize(player, enemy, turnManager);
  
  // Start battle
  await combatPhaseManager.startBattle();
  
  let battleActive = true;
  
  while (battleActive) {
    const activeFighter = turnManager.getCurrentFighter();
    
    // Start turn
    await combatPhaseManager.startTurn(activeFighter);
    
    // Get action
    const action = activeFighter.isPlayer 
      ? await getPlayerAction(activeFighter)
      : getAIAction(activeFighter);
    
    // Execute action
    combatPhaseManager.queueAction(action);
    const result = await combatPhaseManager.executeNextAction();
    
    // Check victory
    if (result.targetDefeated) {
      await combatPhaseManager.endBattle(activeFighter, result.target);
      battleActive = false;
    } else {
      await combatPhaseManager.endTurn(activeFighter);
      turnManager.nextTurn();
    }
  }
}
```

## Custom Abilities

### Lifesteal Ability

```javascript
// Register lifesteal effect on damage dealt
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_RESOLUTION,
  (data) => {
    const { action, result } = data;
    
    // Check if attacker has lifesteal
    if (action.attacker.hasAbility('lifesteal') && result.damageDealt > 0) {
      const healAmount = Math.floor(result.damageDealt * 0.3); // 30% lifesteal
      action.attacker.health = Math.min(
        action.attacker.maxHealth,
        action.attacker.health + healAmount
      );
      
      combatPhaseManager.emit(CombatEvent.HEALING_APPLIED, {
        fighter: action.attacker,
        amount: healAmount,
        source: 'lifesteal',
      });
      
      console.log(`${action.attacker.name} restored ${healAmount} HP via Lifesteal!`);
    }
  },
  5
);
```

### Thorns/Reflect Damage

```javascript
// Reflect damage back to attacker
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_RESOLUTION,
  (data) => {
    const { action, result } = data;
    
    // Check if target has thorns
    if (action.target.hasAbility('thorns') && result.damageDealt > 0) {
      const reflectDamage = Math.floor(result.damageDealt * 0.2); // 20% reflect
      action.attacker.health -= reflectDamage;
      
      combatPhaseManager.emit(CombatEvent.DAMAGE_DEALT, {
        attacker: action.target,
        target: action.attacker,
        damage: reflectDamage,
        source: 'thorns',
      });
      
      console.log(`${action.attacker.name} took ${reflectDamage} damage from Thorns!`);
    }
  },
  5
);
```

### Berserk Mode (Low HP Bonus)

```javascript
// Increase damage when low on HP
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_EXECUTION,
  (data) => {
    const { action } = data;
    const healthPercent = action.attacker.health / action.attacker.maxHealth;
    
    // Berserk activates below 30% HP
    if (healthPercent < 0.3 && action.type === 'attack') {
      const bonusMultiplier = 1.5; // 50% more damage
      action.damageMultiplier = (action.damageMultiplier || 1.0) * bonusMultiplier;
      
      console.log(`${action.attacker.name} enters BERSERK MODE! (+50% damage)`);
      
      return { berserkActive: true };
    }
  },
  8
);
```

### Mana Shield

```javascript
// Use mana to absorb damage
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_RESOLUTION,
  (data) => {
    const { action, result } = data;
    
    if (action.target.hasAbility('mana_shield') && result.damageDealt > 0) {
      const maxAbsorb = action.target.mana * 2; // 1 mana = 2 HP absorbed
      const absorbed = Math.min(result.damageDealt, maxAbsorb);
      const manaUsed = Math.ceil(absorbed / 2);
      
      // Reduce damage and mana
      result.damageDealt -= absorbed;
      action.target.mana -= manaUsed;
      
      console.log(`Mana Shield absorbed ${absorbed} damage! (${manaUsed} mana)`);
      
      return { manaShieldAbsorbed: absorbed };
    }
  },
  12 // High priority - before damage application
);
```

## Reactive Systems

### Counter-Attack System

```javascript
// Queue counter-attack when hit
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_RESOLUTION,
  (data) => {
    const { action, result } = data;
    
    // 25% chance to counter when attacked
    if (action.type === 'attack' && result.damageDealt > 0 && Math.random() < 0.25) {
      const counterAction = {
        type: 'counter',
        attacker: action.target,
        target: action.attacker,
        damage: Math.floor(result.damageDealt * 0.5), // Half damage counter
        priority: 10, // High priority - execute immediately
      };
      
      combatPhaseManager.queueAction(counterAction);
      
      console.log(`${action.target.name} counters!`);
      
      return { counterQueued: true };
    }
  },
  6
);
```

### Dodge/Evasion System

```javascript
// Chance to dodge attacks
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_EXECUTION,
  (data) => {
    const { action } = data;
    
    if (action.type === 'attack') {
      const evasionChance = action.target.agility / 500; // Max ~40% evasion
      
      if (Math.random() < evasionChance) {
        action.dodged = true;
        action.damageMultiplier = 0; // No damage
        
        console.log(`${action.target.name} dodged the attack!`);
        
        return { dodged: true };
      }
    }
  },
  11 // Very high priority - before damage calculation
);
```

### Guardian Angel (Auto-Revive)

```javascript
// Auto-revive when defeated
combatPhaseManager.registerPhaseHook(
  CombatPhase.ACTION_RESOLUTION,
  (data) => {
    const { action, result } = data;
    
    if (result.targetDefeated && action.target.hasAbility('guardian_angel')) {
      // Revive with 30% HP
      action.target.health = Math.floor(action.target.maxHealth * 0.3);
      result.targetDefeated = false;
      
      // Remove ability (one-time use)
      action.target.removeAbility('guardian_angel');
      
      combatPhaseManager.emit(CombatEvent.HEALING_APPLIED, {
        fighter: action.target,
        amount: action.target.health,
        source: 'guardian_angel',
      });
      
      console.log(`${action.target.name} was revived by Guardian Angel!`);
      
      return { guardianAngelTriggered: true };
    }
  },
  15 // Critical priority - check before defeat
);
```

## Complex Scenarios

### Multi-Hit Combo Attack

```javascript
async function executeMultiHitCombo(attacker, target, hitCount) {
  const baseAction = {
    type: 'multi_attack',
    attacker,
    target,
  };
  
  // Queue multiple hits
  for (let i = 0; i < hitCount; i++) {
    const hit = {
      ...baseAction,
      hitNumber: i + 1,
      damage: attacker.strength * (0.6 + Math.random() * 0.4), // 60-100% damage
      priority: 5 - i, // Descending priority
    };
    
    combatPhaseManager.queueAction(hit);
  }
  
  // Execute all hits
  const results = [];
  while (combatPhaseManager.getActionQueue().some(a => a.type === 'multi_attack')) {
    const result = await combatPhaseManager.executeNextAction();
    results.push(result);
  }
  
  const totalDamage = results.reduce((sum, r) => sum + (r.damageDealt || 0), 0);
  console.log(`Multi-hit combo dealt ${totalDamage} total damage!`);
  
  return results;
}
```

### Environmental Effects

```javascript
// Weather effects
const weatherEffects = {
  rain: {
    name: 'Rain',
    onTurnStart: (fighter) => {
      // Water magic boosted, fire magic reduced
      if (fighter.element === 'water') {
        fighter.magicPower *= 1.3;
      } else if (fighter.element === 'fire') {
        fighter.magicPower *= 0.7;
      }
    },
  },
  sunny: {
    name: 'Sunny',
    onTurnStart: (fighter) => {
      // Fire magic boosted
      if (fighter.element === 'fire') {
        fighter.magicPower *= 1.3;
      }
    },
  },
};

// Apply weather
function applyWeather(weather) {
  return combatPhaseManager.registerPhaseHook(
    CombatPhase.TURN_START,
    (data) => {
      weather.onTurnStart(data.fighter);
      return { weatherApplied: weather.name };
    },
    10
  );
}

// Usage
const weatherHookId = applyWeather(weatherEffects.rain);

// Later: clear weather
combatPhaseManager.unregisterPhaseHook(weatherHookId);
```

### Resurrection Mechanic

```javascript
// Resurrect defeated ally
async function resurrect(caster, target) {
  if (!target.defeated || caster.mana < 50) {
    console.log('Cannot resurrect!');
    return false;
  }
  
  const action = {
    type: 'resurrect',
    attacker: caster,
    target,
    priority: 15, // High priority
  };
  
  // Register one-time hook for resurrection
  const hookId = combatPhaseManager.registerPhaseHook(
    CombatPhase.ACTION_EXECUTION,
    (data) => {
      if (data.action.type === 'resurrect') {
        const reviveHP = Math.floor(data.action.target.maxHealth * 0.5);
        data.action.target.health = reviveHP;
        data.action.target.defeated = false;
        data.action.attacker.mana -= 50;
        
        combatPhaseManager.emit(CombatEvent.HEALING_APPLIED, {
          fighter: data.action.target,
          amount: reviveHP,
          source: 'resurrect',
        });
        
        console.log(`${data.action.target.name} was resurrected!`);
        
        // Remove hook after use
        combatPhaseManager.unregisterPhaseHook(hookId);
        
        return { resurrected: true };
      }
    },
    15
  );
  
  combatPhaseManager.queueAction(action);
  return await combatPhaseManager.executeNextAction();
}
```

### Delayed Damage (Bomb/Trap)

```javascript
// Set delayed damage trap
function setTrap(caster, target, delay) {
  const trapId = `trap_${Date.now()}`;
  let turnsRemaining = delay;
  
  const hookId = combatPhaseManager.registerPhaseHook(
    CombatPhase.TURN_END,
    (data) => {
      if (data.fighter.id === target.id) {
        turnsRemaining--;
        
        if (turnsRemaining === 0) {
          // Trap explodes!
          const damage = caster.magicPower * 2;
          target.health -= damage;
          
          combatPhaseManager.emit(CombatEvent.DAMAGE_DEALT, {
            attacker: caster,
            target,
            damage,
            source: 'trap',
          });
          
          console.log(`💣 Trap exploded! ${target.name} took ${damage} damage!`);
          
          // Remove hook
          combatPhaseManager.unregisterPhaseHook(hookId);
          
          return { trapExploded: true };
        } else {
          console.log(`💣 Trap countdown: ${turnsRemaining} turns...`);
        }
      }
    },
    5
  );
  
  console.log(`${caster.name} set a trap on ${target.name}! (${delay} turns)`);
  return trapId;
}
```

## Testing

### Unit Test Example

```javascript
describe('CombatPhaseManager', () => {
  let phaseManager;
  let player, enemy;
  
  beforeEach(() => {
    phaseManager = new CombatPhaseManager();
    player = createTestFighter('Player');
    enemy = createTestFighter('Enemy');
    phaseManager.initialize(player, enemy, mockTurnManager);
  });
  
  afterEach(() => {
    phaseManager.reset();
  });
  
  it('should transition through phases correctly', async () => {
    const phases = [];
    
    phaseManager.on('phase_changed', (data) => {
      phases.push(data.phase);
    });
    
    await phaseManager.startBattle();
    await phaseManager.startTurn(player);
    await phaseManager.endTurn(player);
    
    expect(phases).toEqual([
      CombatPhase.BATTLE_START,
      CombatPhase.TURN_START,
      CombatPhase.TURN_END,
    ]);
  });
  
  it('should execute hooks in priority order', async () => {
    const execOrder = [];
    
    phaseManager.registerPhaseHook(CombatPhase.TURN_START, () => {
      execOrder.push('low');
    }, 1);
    
    phaseManager.registerPhaseHook(CombatPhase.TURN_START, () => {
      execOrder.push('high');
    }, 10);
    
    phaseManager.registerPhaseHook(CombatPhase.TURN_START, () => {
      execOrder.push('medium');
    }, 5);
    
    await phaseManager.startTurn(player);
    
    expect(execOrder).toEqual(['high', 'medium', 'low']);
  });
  
  it('should queue actions with correct priority', () => {
    phaseManager.queueAction({ type: 'attack', priority: 0 });
    phaseManager.queueAction({ type: 'counter', priority: 10 });
    phaseManager.queueAction({ type: 'heal', priority: 5 });
    
    const queue = phaseManager.getActionQueue();
    
    expect(queue[0].type).toBe('counter'); // Highest priority
    expect(queue[1].type).toBe('heal');
    expect(queue[2].type).toBe('attack');
  });
});
```

### Integration Test

```javascript
describe('Combat Integration', () => {
  it('should handle complete battle flow', async () => {
    const results = {
      battleStarted: false,
      turnCount: 0,
      damageDealt: 0,
      battleEnded: false,
    };
    
    // Setup listeners
    combatPhaseManager.on(CombatEvent.BATTLE_STARTED, () => {
      results.battleStarted = true;
    });
    
    combatPhaseManager.on(CombatEvent.TURN_STARTED, () => {
      results.turnCount++;
    });
    
    combatPhaseManager.on(CombatEvent.DAMAGE_DEALT, (data) => {
      results.damageDealt += data.damage;
    });
    
    combatPhaseManager.on(CombatEvent.BATTLE_ENDED, () => {
      results.battleEnded = true;
    });
    
    // Run battle
    await runSimpleCombat(player, enemy);
    
    expect(results.battleStarted).toBe(true);
    expect(results.turnCount).toBeGreaterThan(0);
    expect(results.damageDealt).toBeGreaterThan(0);
    expect(results.battleEnded).toBe(true);
  });
});
```

---

**Tip**: Start with simple examples and gradually add complexity as you understand the system better!
