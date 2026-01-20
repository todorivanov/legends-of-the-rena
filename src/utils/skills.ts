import { SKILLS_DATABASE } from '../data/skills';
import type { Skill, CharacterClass } from '../types/game';

/**
 * Get all skills available for a specific class
 */
export function getSkillsForClass(characterClass: CharacterClass): Omit<Skill, 'cooldownRemaining'>[] {
  return Object.values(SKILLS_DATABASE).filter(
    skill => !skill.classRestriction || skill.classRestriction.includes(characterClass)
  );
}

/**
 * Get starter skills for a class (first 2 skills)
 */
export function getStarterSkills(characterClass: CharacterClass): string[] {
  const skills = getSkillsForClass(characterClass);
  return skills.slice(0, 2).map(skill => skill.id);
}

/**
 * Get skill by ID with cooldown initialized
 */
export function getSkillById(skillId: string): Skill | null {
  const skillData = SKILLS_DATABASE[skillId];
  if (!skillData) return null;
  
  return {
    ...skillData,
    cooldownRemaining: 0,
  };
}

/**
 * Check if a skill can be used
 */
export function canUseSkill(
  skill: Skill,
  currentMana: number
): { canUse: boolean; reason?: string } {
  if (skill.cooldownRemaining > 0) {
    return { canUse: false, reason: `On cooldown (${skill.cooldownRemaining} turns)` };
  }
  
  if (currentMana < skill.manaCost) {
    return { canUse: false, reason: `Need ${skill.manaCost - currentMana} more mana` };
  }
  
  return { canUse: true };
}
