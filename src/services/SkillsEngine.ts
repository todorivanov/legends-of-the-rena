import type { Fighter, Skill, StatusEffect, StatusEffectType } from '../types/game';
import { applyDamage, applyHealing, addStatusEffect } from './CombatEngine';

/**
 * Apply skill effects to fighter(s)
 */
export function applySkillEffects(
  caster: Fighter,
  target: Fighter,
  skill: Skill
): { caster: Fighter; target: Fighter; log: string[] } {
  const log: string[] = [];
  let updatedCaster = { ...caster };
  let updatedTarget = { ...target };

  for (const effect of skill.effects) {
    const effectTarget = effect.target === 'self' ? updatedCaster : updatedTarget;
    const targetName = effect.target === 'self' ? caster.name : target.name;

    switch (effect.type) {
      case 'damage': {
        // Calculate damage with skill multiplier
        const baseDamage = Math.floor(updatedCaster.currentStrength * effect.value);
        const critRoll = Math.random();
        const isCrit = critRoll < updatedCaster.critChance;
        const finalDamage = isCrit ? Math.floor(baseDamage * updatedCaster.critDamage) : baseDamage;
        
        // Apply defense reduction
        const defenseMultiplier = 100 / (100 + updatedTarget.currentDefense);
        const damageAfterDefense = Math.floor(finalDamage * defenseMultiplier);
        
        updatedTarget = applyDamage(updatedTarget, damageAfterDefense);
        log.push(
          `${skill.name} deals ${damageAfterDefense} damage to ${targetName}!${isCrit ? ' 💥 CRITICAL!' : ''}`
        );
        break;
      }

      case 'heal': {
        const healAmount = Math.floor(effectTarget.maxHealth * effect.value);
        if (effect.target === 'self') {
          updatedCaster = applyHealing(updatedCaster, healAmount);
        } else {
          updatedTarget = applyHealing(updatedTarget, healAmount);
        }
        log.push(`${targetName} heals for ${healAmount} HP! 💚`);
        break;
      }

      case 'statusEffect': {
        if (effect.statusEffect && effect.duration) {
          const statusEffect: StatusEffect = {
            type: effect.statusEffect as StatusEffectType,
            duration: effect.duration,
            value: effect.value || 0,
            stacks: 1,
            icon: '✨',
            description: `Applied by ${skill.name}`,
          };
          
          if (effect.target === 'self') {
            updatedCaster = addStatusEffect(updatedCaster, statusEffect);
          } else {
            updatedTarget = addStatusEffect(updatedTarget, statusEffect);
          }
          
          log.push(`${targetName} is affected by ${effect.statusEffect}! ✨`);
        }
        break;
      }

      case 'statModifier': {
        // Temporary stat modifiers (could be enhanced later)
        log.push(`${targetName}'s stats are modified!`);
        break;
      }
    }
  }

  return { 
    caster: updatedCaster, 
    target: updatedTarget, 
    log 
  };
}

/**
 * Reduce cooldowns on all skills
 */
export function tickSkillCooldowns(fighter: Fighter): Fighter {
  return {
    ...fighter,
    skills: fighter.skills.map(skill => ({
      ...skill,
      cooldownRemaining: Math.max(0, skill.cooldownRemaining - 1),
    })),
  };
}
