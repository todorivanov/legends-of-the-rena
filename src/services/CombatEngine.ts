import type { Fighter, StatusEffect, DifficultyLevel } from '../types/game';
import { getStatusEffectDef } from '../data/statusEffects';
import { applyDifficultyToFighter, applyDifficultyToRewards } from '../data/difficulty';
import { getSkillsForClass } from '../utils/skills';

// ============================================================================
// COMBAT ENGINE - Core combat logic and calculations
// ============================================================================

/**
 * Calculate damage dealt by attacker to defender
 */
export function calculateDamage(
  attacker: Fighter,
  defender: Fighter,
  skillMultiplier: number = 1.0
): { damage: number; isCritical: boolean; blocked: number } {
  // Base damage = attacker's strength
  let baseDamage = attacker.currentStrength * skillMultiplier;
  
  // Check for critical hit
  const critRoll = Math.random();
  const isCritical = critRoll < attacker.critChance;
  
  if (isCritical) {
    baseDamage *= attacker.critDamage;
  }
  
  // Apply defense reduction (damage reduction formula)
  // Damage = BaseDamage * (100 / (100 + Defense))
  const defenseMultiplier = 100 / (100 + defender.currentDefense);
  let finalDamage = baseDamage * defenseMultiplier;
  
  // Check for status effects that modify damage
  const vulnerableEffect = defender.statusEffects.find(e => e.type === 'vulnerable');
  if (vulnerableEffect) {
    finalDamage *= 1.25; // 25% more damage when vulnerable
  }
  
  const fortifyEffect = defender.statusEffects.find(e => e.type === 'fortify');
  if (fortifyEffect) {
    finalDamage *= 0.75; // 25% less damage when fortified
  }
  
  // Calculate blocked amount (shown for UI)
  const blocked = Math.floor(baseDamage - finalDamage);
  
  // Round to integer
  finalDamage = Math.floor(finalDamage);
  
  // Ensure minimum damage of 1
  finalDamage = Math.max(1, finalDamage);
  
  return { damage: finalDamage, isCritical, blocked };
}

/**
 * Apply damage to a fighter
 */
export function applyDamage(fighter: Fighter, damage: number): Fighter {
  const newHealth = Math.max(0, fighter.currentHealth - damage);
  
  return {
    ...fighter,
    currentHealth: newHealth,
  };
}

/**
 * Apply healing to a fighter
 */
export function applyHealing(fighter: Fighter, amount: number): Fighter {
  const newHealth = Math.min(fighter.maxHealth, fighter.currentHealth + amount);
  
  return {
    ...fighter,
    currentHealth: newHealth,
  };
}

/**
 * Restore mana to a fighter
 */
export function restoreMana(fighter: Fighter, amount: number): Fighter {
  const newMana = Math.min(fighter.maxMana, fighter.currentMana + amount);
  
  return {
    ...fighter,
    currentMana: newMana,
  };
}

/**
 * Add a status effect to a fighter
 */
export function addStatusEffect(
  fighter: Fighter,
  effect: StatusEffect
): Fighter {
  const existingIndex = fighter.statusEffects.findIndex(e => e.type === effect.type);
  
  if (existingIndex >= 0) {
    // Effect already exists - refresh duration or stack
    const existing = fighter.statusEffects[existingIndex];
    const effectDef = getStatusEffectDef(effect.type);
    
    if (effectDef && effectDef.maxStacks > 1) {
      // Stackable effect - increase stacks
      const newStacks = Math.min(effectDef.maxStacks, existing.stacks + 1);
      const updatedEffects = [...fighter.statusEffects];
      updatedEffects[existingIndex] = {
        ...existing,
        stacks: newStacks,
        duration: effect.duration, // Refresh duration
      };
      
      return {
        ...fighter,
        statusEffects: updatedEffects,
      };
    } else {
      // Non-stackable - just refresh duration
      const updatedEffects = [...fighter.statusEffects];
      updatedEffects[existingIndex] = {
        ...existing,
        duration: effect.duration,
      };
      
      return {
        ...fighter,
        statusEffects: updatedEffects,
      };
    }
  } else {
    // New effect
    return {
      ...fighter,
      statusEffects: [...fighter.statusEffects, effect],
    };
  }
}

/**
 * Remove a status effect from a fighter
 */
export function removeStatusEffect(
  fighter: Fighter,
  effectType: StatusEffect['type']
): Fighter {
  return {
    ...fighter,
    statusEffects: fighter.statusEffects.filter(e => e.type !== effectType),
  };
}

/**
 * Process status effects at the start of turn (DoT, HoT, etc.)
 */
export function processStatusEffects(fighter: Fighter): {
  fighter: Fighter;
  log: string[];
} {
  let updatedFighter = { ...fighter };
  const log: string[] = [];
  
  // Process each active status effect
  for (const effect of fighter.statusEffects) {
    const effectDef = getStatusEffectDef(effect.type);
    if (!effectDef) continue;
    
    // Apply effect based on category
    switch (effectDef.category) {
      case 'dot': {
        // Damage over time
        const damage = effect.value * effect.stacks;
        updatedFighter = applyDamage(updatedFighter, damage);
        log.push(`${fighter.name} takes ${damage} ${effectDef.name} damage! ${effectDef.icon}`);
        break;
      }
      
      case 'hot': {
        // Heal over time
        const healing = effect.value * effect.stacks;
        updatedFighter = applyHealing(updatedFighter, healing);
        log.push(`${fighter.name} regenerates ${healing} health! ${effectDef.icon}`);
        break;
      }
      
      case 'buff':
      case 'debuff':
      case 'control':
        // These are passive and applied during damage calculation
        break;
    }
  }
  
  // Decrease duration of all effects
  updatedFighter.statusEffects = updatedFighter.statusEffects
    .map(effect => ({
      ...effect,
      duration: effect.duration - 1,
    }))
    .filter(effect => effect.duration > 0); // Remove expired effects
  
  return { fighter: updatedFighter, log };
}

/** * Spend mana
 */
export function spendMana(fighter: Fighter, amount: number): Fighter {
  return {
    ...fighter,
    currentMana: Math.max(0, fighter.currentMana - amount),
  };
}

/** * Check if a fighter can act (not stunned/frozen)
 */
export function canAct(fighter: Fighter): boolean {
  return !fighter.statusEffects.some(
    e => e.type === 'stunned' || e.type === 'frozen'
  );
}

/**
 * Apply mana regeneration at end of turn
 */
export function regenerateMana(fighter: Fighter): Fighter {
  const regenAmount = Math.ceil(fighter.maxMana * (fighter.manaRegen / 100));
  return restoreMana(fighter, regenAmount);
}

/**
 * Check if fighter is defeated
 */
export function isDefeated(fighter: Fighter): boolean {
  return fighter.currentHealth <= 0;
}

/**
 * Apply stat modifiers from status effects
 */
export function applyStatusModifiers(fighter: Fighter): Fighter {
  const modifiedFighter = { ...fighter };
  
  // Apply strength modifiers
  const strengthBoost = fighter.statusEffects.find(e => e.type === 'strengthBoost');
  if (strengthBoost) {
    modifiedFighter.currentStrength = Math.floor(
      fighter.currentStrength * (1 + strengthBoost.value / 100)
    );
  }
  
  const weakness = fighter.statusEffects.find(e => e.type === 'weakness');
  if (weakness) {
    modifiedFighter.currentStrength = Math.floor(
      fighter.currentStrength * (1 - weakness.value / 100)
    );
  }
  
  const enrage = fighter.statusEffects.find(e => e.type === 'enrage');
  if (enrage) {
    modifiedFighter.currentStrength = Math.floor(
      fighter.currentStrength * (1 + enrage.value / 100)
    );
  }
  
  // Apply defense modifiers
  const defenseBoost = fighter.statusEffects.find(e => e.type === 'defenseBoost');
  if (defenseBoost) {
    modifiedFighter.currentDefense = Math.floor(
      fighter.currentDefense * (1 + defenseBoost.value / 100)
    );
  }
  
  const curse = fighter.statusEffects.find(e => e.type === 'curse');
  if (curse) {
    modifiedFighter.currentDefense = Math.floor(
      fighter.currentDefense * (1 - curse.value / 100)
    );
  }
  
  return modifiedFighter;
}

/**
 * Generate a random opponent based on player level
 */
export function generateOpponent(
  playerLevel: number,
  difficulty: DifficultyLevel = 'normal'
): Fighter {
  const levelVariance = difficulty === 'easy' ? -1 : difficulty === 'hard' ? 2 : difficulty === 'nightmare' ? 3 : 0;
  const opponentLevel = Math.max(1, playerLevel + levelVariance);
  
  // Base stats scale with level
  const baseHealth = 300 + (opponentLevel * 50);
  const baseStrength = 40 + (opponentLevel * 5);
  const baseDefense = 8 + (opponentLevel * 2);
  const baseMana = 100 + (opponentLevel * 10);
  
  // Apply difficulty modifiers
  const { health: modifiedHealth, damage: modifiedStrength } = applyDifficultyToFighter(
    baseHealth,
    baseStrength,
    difficulty,
    false // isPlayer = false
  );
  
  // Assign varied classes for opponents
  const opponentClasses: Array<'WARRIOR' | 'MAGE' | 'ROGUE' | 'TANK' | 'RANGER'> = ['WARRIOR', 'MAGE', 'ROGUE', 'TANK', 'RANGER'];
  const opponentClass = opponentClasses[Math.floor(Math.random() * opponentClasses.length)];
  
  // Give opponents skills based on their level and class
  const allSkills = getSkillsForClass(opponentClass);
  const opponentSkills = allSkills
    .filter((skill) => (skill as any).requiredLevel <= opponentLevel)
    .map(skill => ({ ...skill, cooldownRemaining: 0 }))
    .slice(0, Math.min(4, Math.floor(opponentLevel / 2) + 1)); // 1-4 skills based on level
  
  const names = [
    'Training Dummy',
    'Arena Fighter',
    'Veteran Warrior',
    'Elite Champion',
    'Battle Master',
    'Arena Legend',
  ];
  
  const name = names[Math.min(Math.floor(opponentLevel / 3), names.length - 1)];
  
  return {
    name,
    class: opponentClass,
    level: opponentLevel,
    maxHealth: modifiedHealth,
    currentHealth: modifiedHealth,
    maxMana: baseMana,
    currentMana: baseMana,
    currentStrength: modifiedStrength,
    currentDefense: baseDefense,
    critChance: 0.15,
    critDamage: 1.5,
    manaRegen: 10,
    attackRange: 1,
    statusEffects: [],
    skills: opponentSkills,
    position: { x: 0, y: 0 },
  };
}

/**
 * Calculate rewards for winning combat
 */
export function calculateRewards(
  playerLevel: number,
  opponentLevel: number,
  victory: boolean,
  difficulty: DifficultyLevel = 'normal'
): { xp: number; gold: number } {
  if (!victory) {
    return { xp: 0, gold: 0 };
  }
  
  // Base rewards
  const baseXP = 50 * opponentLevel;
  const baseGold = 25 * opponentLevel;
  
  // Bonus for fighting higher level opponents
  const levelDiff = opponentLevel - playerLevel;
  const bonusMultiplier = levelDiff > 0 ? 1 + (levelDiff * 0.2) : 1;
  
  const adjustedXP = Math.floor(baseXP * bonusMultiplier);
  const adjustedGold = Math.floor(baseGold * bonusMultiplier);
  
  // Apply difficulty modifiers
  return applyDifficultyToRewards(adjustedXP, adjustedGold, difficulty);
}
