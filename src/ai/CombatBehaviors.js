/**
 * CombatBehaviors - Combat-specific behavior tree nodes
 */

import { Selector, Sequence, Condition, Action } from './BehaviorTree.js';
import { PersonalityTraits } from './AIPersonality.js';

/**
 * Combat Conditions - Check combat state
 */

export const CombatConditions = {
  /**
   * Is health below threshold?
   */
  isLowHealth: (threshold = 0.3) =>
    new Condition('LowHealth', (context) => {
      const { fighter } = context;
      return fighter.health / fighter.maxHealth < threshold;
    }),

  /**
   * Is health critically low?
   */
  isCriticalHealth: () =>
    new Condition('CriticalHealth', (context) => {
      const { fighter } = context;
      return fighter.health / fighter.maxHealth < 0.2;
    }),

  /**
   * Is opponent low on health?
   */
  isOpponentLowHealth: (threshold = 0.3) =>
    new Condition('OpponentLowHealth', (context) => {
      const { opponent } = context;
      return opponent.health / opponent.maxHealth < threshold;
    }),

  /**
   * Has mana for skill?
   */
  hasManaForSkill: (skillIndex = 0) =>
    new Condition('HasMana', (context) => {
      const { fighter } = context;
      const skill = fighter.skills?.[skillIndex];
      return skill && fighter.mana >= skill.manaCost && skill.cooldownRemaining === 0;
    }),

  /**
   * Has healing items?
   */
  hasHealingItems: () =>
    new Condition('HasItems', (context) => {
      const { fighter } = context;
      return fighter.itemsRemaining > 0;
    }),

  /**
   * Is defending beneficial? (opponent is strong)
   */
  shouldDefend: () =>
    new Condition('ShouldDefend', (context) => {
      const { fighter, opponent, personality } = context;

      // Check caution trait
      const caution = personality.getTraitProbability(PersonalityTraits.CAUTION);

      // More likely to defend if low health
      const healthFactor = 1 - fighter.health / fighter.maxHealth;

      // More likely to defend if opponent is strong
      const strengthRatio = opponent.strength / fighter.strength;
      const strengthFactor = Math.min(strengthRatio / 2, 1);

      const defendProbability = (caution + healthFactor + strengthFactor) / 3;
      return Math.random() < defendProbability;
    }),

  /**
   * Should use skill?
   */
  shouldUseSkill: () =>
    new Condition('ShouldUseSkill', (context) => {
      const { personality } = context;
      const skillPref = personality.getTraitProbability(PersonalityTraits.SKILL_PREFERENCE);
      return Math.random() < skillPref;
    }),

  /**
   * Should use item?
   */
  shouldUseItem: () =>
    new Condition('ShouldUseItem', (context) => {
      const { fighter, personality } = context;
      const itemUsage = personality.getTraitProbability(PersonalityTraits.ITEM_USAGE);
      const healthPercent = fighter.health / fighter.maxHealth;

      // More likely to use item when low health
      const urgency = 1 - healthPercent;
      const probability = (itemUsage + urgency) / 2;

      return Math.random() < probability;
    }),

  /**
   * Is combo active?
   */
  hasCombo: () =>
    new Condition('HasCombo', (context) => {
      const { fighter } = context;
      return fighter.combo > 0;
    }),

  /**
   * Should take risk?
   */
  shouldTakeRisk: () =>
    new Condition('ShouldRisk', (context) => {
      const { personality } = context;
      const riskTaking = personality.getTraitProbability(PersonalityTraits.RISK_TAKING);
      return Math.random() < riskTaking;
    }),
};

/**
 * Combat Actions - Perform combat actions
 */

export const CombatActions = {
  /**
   * Attack action
   */
  attack: () =>
    new Action('Attack', (context) => {
      context.chosenAction = { type: 'attack' };
      return true;
    }),

  /**
   * Defend action
   */
  defend: () =>
    new Action('Defend', (context) => {
      context.chosenAction = { type: 'defend' };
      return true;
    }),

  /**
   * Use skill action
   */
  useSkill: (skillIndex = 0) =>
    new Action('UseSkill', (context) => {
      const { fighter } = context;
      const skill = fighter.skills?.[skillIndex];

      if (!skill) return false;

      context.chosenAction = {
        type: 'skill',
        skillIndex,
        skill,
      };
      return true;
    }),

  /**
   * Use item action
   */
  useItem: () =>
    new Action('UseItem', (context) => {
      context.chosenAction = { type: 'item' };
      return true;
    }),

  /**
   * Choose best skill
   */
  chooseBestSkill: () =>
    new Action('ChooseBestSkill', (context) => {
      const { fighter, opponent } = context;

      // Find best available skill
      let bestSkillIndex = -1;
      let bestScore = -1;

      fighter.skills?.forEach((skill, index) => {
        if (fighter.mana >= skill.manaCost && skill.cooldownRemaining === 0) {
          let score = skill.power || 0;

          // Bonus for damage skills against low health opponents
          if (skill.type === 'damage' && opponent.health < opponent.maxHealth * 0.4) {
            score *= 1.5;
          }

          // Bonus for healing when low health
          if (skill.type === 'heal' && fighter.health < fighter.maxHealth * 0.4) {
            score *= 2;
          }

          // Bonus for buffs early in fight
          if (skill.type === 'buff' && !fighter.statusEffects?.some((e) => e.type === 'buff')) {
            score *= 1.3;
          }

          if (score > bestScore) {
            bestScore = score;
            bestSkillIndex = index;
          }
        }
      });

      if (bestSkillIndex >= 0) {
        context.chosenAction = {
          type: 'skill',
          skillIndex: bestSkillIndex,
          skill: fighter.skills[bestSkillIndex],
        };
        return true;
      }

      return false;
    }),
};

/**
 * Build Aggressive AI behavior tree
 */
export function buildAggressiveBehavior() {
  return new Selector('AggressiveAI', [
    // If critical health and has items, use them
    new Sequence('EmergencyHeal', [
      CombatConditions.isCriticalHealth(),
      CombatConditions.hasHealingItems(),
      CombatActions.useItem(),
    ]),

    // If opponent is low health and we have a damage skill, finish them
    new Sequence('FinishingBlow', [
      CombatConditions.isOpponentLowHealth(0.25),
      CombatConditions.hasManaForSkill(0),
      CombatActions.chooseBestSkill(),
    ]),

    // Use skills aggressively
    new Sequence('AggressiveSkill', [
      CombatConditions.shouldUseSkill(),
      CombatActions.chooseBestSkill(),
    ]),

    // Default: Attack
    CombatActions.attack(),
  ]);
}

/**
 * Build Defensive AI behavior tree
 */
export function buildDefensiveBehavior() {
  return new Selector('DefensiveAI', [
    // If low health and has items, heal
    new Sequence('HealWhenLow', [
      CombatConditions.isLowHealth(0.4),
      CombatConditions.hasHealingItems(),
      CombatConditions.shouldUseItem(),
      CombatActions.useItem(),
    ]),

    // If should defend, defend
    new Sequence('DefensiveStance', [CombatConditions.shouldDefend(), CombatActions.defend()]),

    // Use defensive skills
    new Sequence('DefensiveSkill', [
      CombatConditions.shouldUseSkill(),
      CombatActions.chooseBestSkill(),
    ]),

    // Cautious attack
    CombatActions.attack(),
  ]);
}

/**
 * Build Tactical AI behavior tree
 */
export function buildTacticalBehavior() {
  return new Selector('TacticalAI', [
    // Emergency response
    new Sequence('Emergency', [
      CombatConditions.isCriticalHealth(),
      CombatConditions.hasHealingItems(),
      CombatActions.useItem(),
    ]),

    // Opportunistic finish
    new Sequence('Finish', [
      CombatConditions.isOpponentLowHealth(0.2),
      CombatConditions.shouldTakeRisk(),
      CombatActions.chooseBestSkill(),
    ]),

    // Tactical skill use
    new Sequence('TacticalSkill', [
      CombatConditions.shouldUseSkill(),
      CombatActions.chooseBestSkill(),
    ]),

    // Defend when necessary
    new Sequence('TacticalDefend', [
      CombatConditions.isLowHealth(0.35),
      CombatConditions.shouldDefend(),
      CombatActions.defend(),
    ]),

    // Heal when low
    new Sequence('TacticalHeal', [
      CombatConditions.isLowHealth(0.3),
      CombatConditions.hasHealingItems(),
      CombatConditions.shouldUseItem(),
      CombatActions.useItem(),
    ]),

    // Default attack
    CombatActions.attack(),
  ]);
}

/**
 * Build Berserker AI behavior tree
 */
export function buildBerserkerBehavior() {
  return new Selector('BerserkerAI', [
    // Only heal if absolutely critical
    new Sequence('LastResort', [
      new Condition('VeryLowHealth', (ctx) => ctx.fighter.health < ctx.fighter.maxHealth * 0.1),
      CombatConditions.hasHealingItems(),
      CombatActions.useItem(),
    ]),

    // Always try to use damage skills
    CombatActions.chooseBestSkill(),

    // Always attack, never defend
    CombatActions.attack(),
  ]);
}

/**
 * Build Balanced AI behavior tree
 */
export function buildBalancedBehavior() {
  return new Selector('BalancedAI', [
    // Heal if moderately low
    new Sequence('ModerateHeal', [
      CombatConditions.isLowHealth(0.35),
      CombatConditions.hasHealingItems(),
      CombatActions.useItem(),
    ]),

    // Use skills strategically
    new Sequence('StrategicSkill', [
      CombatConditions.shouldUseSkill(),
      CombatActions.chooseBestSkill(),
    ]),

    // Defend occasionally
    new Sequence('OccasionalDefend', [
      CombatConditions.isLowHealth(0.4),
      CombatConditions.shouldDefend(),
      CombatActions.defend(),
    ]),

    // Default attack
    CombatActions.attack(),
  ]);
}

/**
 * Get behavior tree for personality archetype
 */
export function getBehaviorForPersonality(personality) {
  const archetypeName = personality.archetype.name;

  switch (archetypeName) {
    case 'Aggressive':
      return buildAggressiveBehavior();
    case 'Defensive':
      return buildDefensiveBehavior();
    case 'Tactical':
      return buildTacticalBehavior();
    case 'Berserker':
      return buildBerserkerBehavior();
    case 'Tank':
      return buildDefensiveBehavior();
    case 'Glass Cannon':
      return buildAggressiveBehavior();
    case 'Opportunist':
      return buildTacticalBehavior();
    case 'Balanced':
    default:
      return buildBalancedBehavior();
  }
}
