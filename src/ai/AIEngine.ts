import type { Fighter, Skill, DifficultyLevel } from '../types/game';
import { getAIMistakeChance } from '../data/difficulty';

// ============================================================================
// AI Personality System
// ============================================================================

export type AIPersonalityType =
  | 'aggressive'
  | 'defensive'
  | 'tactical'
  | 'berserker'
  | 'cowardly'
  | 'balanced'
  | 'unpredictable'
  | 'adaptive';

export interface AIPersonalityTraits {
  aggression: number; // 0-100: How likely to attack vs defend
  caution: number; // 0-100: How conservative with resources
  skillPreference: number; // 0-100: Preference for skills over basic attacks
  itemUsage: number; // 0-100: How likely to use items (future feature)
  comboAwareness: number; // 0-100: Ability to recognize and execute combos
  adaptiveLearning: number; // 0-100: How much AI adjusts based on player behavior
}

export interface AIPersonality {
  type: AIPersonalityType;
  name: string;
  description: string;
  traits: AIPersonalityTraits;
  behaviorModifiers: {
    healthThresholds: {
      critical: number; // Below this, behavior changes dramatically
      low: number; // Below this, more cautious or aggressive based on type
      high: number; // Above this, more confident
    };
    priorityWeights: {
      damage: number;
      survival: number;
      efficiency: number;
    };
  };
}

// Predefined AI Personalities
export const AI_PERSONALITIES: Record<AIPersonalityType, AIPersonality> = {
  aggressive: {
    type: 'aggressive',
    name: 'Aggressive',
    description: 'Focuses on dealing maximum damage, rarely defends',
    traits: {
      aggression: 85,
      caution: 20,
      skillPreference: 60,
      itemUsage: 30,
      comboAwareness: 50,
      adaptiveLearning: 40,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.2, low: 0.35, high: 0.7 },
      priorityWeights: { damage: 80, survival: 10, efficiency: 10 },
    },
  },
  defensive: {
    type: 'defensive',
    name: 'Defensive',
    description: 'Prioritizes survival and defense over offense',
    traits: {
      aggression: 30,
      caution: 85,
      skillPreference: 40,
      itemUsage: 70,
      comboAwareness: 45,
      adaptiveLearning: 55,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.25, low: 0.5, high: 0.8 },
      priorityWeights: { damage: 20, survival: 70, efficiency: 10 },
    },
  },
  tactical: {
    type: 'tactical',
    name: 'Tactical',
    description: 'Balanced approach with focus on optimal decision-making',
    traits: {
      aggression: 55,
      caution: 60,
      skillPreference: 75,
      itemUsage: 65,
      comboAwareness: 85,
      adaptiveLearning: 80,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.2, low: 0.4, high: 0.75 },
      priorityWeights: { damage: 40, survival: 35, efficiency: 25 },
    },
  },
  berserker: {
    type: 'berserker',
    name: 'Berserker',
    description: 'Becomes more aggressive as health decreases',
    traits: {
      aggression: 70,
      caution: 15,
      skillPreference: 45,
      itemUsage: 20,
      comboAwareness: 40,
      adaptiveLearning: 30,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.15, low: 0.3, high: 0.6 },
      priorityWeights: { damage: 90, survival: 5, efficiency: 5 },
    },
  },
  cowardly: {
    type: 'cowardly',
    name: 'Cowardly',
    description: 'Extremely defensive, focuses on staying alive',
    traits: {
      aggression: 20,
      caution: 95,
      skillPreference: 50,
      itemUsage: 80,
      comboAwareness: 35,
      adaptiveLearning: 45,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.3, low: 0.6, high: 0.85 },
      priorityWeights: { damage: 10, survival: 85, efficiency: 5 },
    },
  },
  balanced: {
    type: 'balanced',
    name: 'Balanced',
    description: 'Well-rounded approach to combat',
    traits: {
      aggression: 50,
      caution: 50,
      skillPreference: 50,
      itemUsage: 50,
      comboAwareness: 60,
      adaptiveLearning: 60,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.2, low: 0.4, high: 0.7 },
      priorityWeights: { damage: 40, survival: 40, efficiency: 20 },
    },
  },
  unpredictable: {
    type: 'unpredictable',
    name: 'Unpredictable',
    description: 'Random behavior, hard to anticipate',
    traits: {
      aggression: 50,
      caution: 50,
      skillPreference: 60,
      itemUsage: 40,
      comboAwareness: 55,
      adaptiveLearning: 20,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.2, low: 0.4, high: 0.7 },
      priorityWeights: { damage: 35, survival: 35, efficiency: 30 },
    },
  },
  adaptive: {
    type: 'adaptive',
    name: 'Adaptive',
    description: 'Learns and adjusts strategy based on player actions',
    traits: {
      aggression: 50,
      caution: 55,
      skillPreference: 70,
      itemUsage: 60,
      comboAwareness: 75,
      adaptiveLearning: 95,
    },
    behaviorModifiers: {
      healthThresholds: { critical: 0.2, low: 0.4, high: 0.75 },
      priorityWeights: { damage: 35, survival: 40, efficiency: 25 },
    },
  },
};

// ============================================================================
// Behavior Tree System
// ============================================================================

export type BehaviorNodeType = 'selector' | 'sequence' | 'condition' | 'action';
export type BehaviorStatus = 'success' | 'failure' | 'running';

export interface BehaviorContext {
  self: Fighter;
  opponent: Fighter;
  personality: AIPersonality;
  turnHistory: Array<{ action: string; outcome: string }>;
  difficulty: DifficultyLevel;
}

export abstract class BehaviorNode {
  abstract execute(context: BehaviorContext): BehaviorStatus;
}

// Selector: Returns success on first successful child (OR logic)
export class SelectorNode extends BehaviorNode {
  private children: BehaviorNode[];
  
  constructor(children: BehaviorNode[]) {
    super();
    this.children = children;
  }

  execute(context: BehaviorContext): BehaviorStatus {
    for (const child of this.children) {
      const status = child.execute(context);
      if (status === 'success') return 'success';
      if (status === 'running') return 'running';
    }
    return 'failure';
  }
}

// Sequence: Returns success only if all children succeed (AND logic)
export class SequenceNode extends BehaviorNode {
  private children: BehaviorNode[];
  
  constructor(children: BehaviorNode[]) {
    super();
    this.children = children;
  }

  execute(context: BehaviorContext): BehaviorStatus {
    for (const child of this.children) {
      const status = child.execute(context);
      if (status === 'failure') return 'failure';
      if (status === 'running') return 'running';
    }
    return 'success';
  }
}

// Condition: Evaluates a condition function
export class ConditionNode extends BehaviorNode {
  private condition: (context: BehaviorContext) => boolean;
  
  constructor(condition: (context: BehaviorContext) => boolean) {
    super();
    this.condition = condition;
  }

  execute(context: BehaviorContext): BehaviorStatus {
    return this.condition(context) ? 'success' : 'failure';
  }
}

// Action: Performs an action and stores it for execution
export class ActionNode extends BehaviorNode {
  private actionType: 'attack' | 'defend' | 'skill';
  private skillId?: string;
  
  constructor(
    actionType: 'attack' | 'defend' | 'skill',
    skillId?: string
  ) {
    super();
    this.actionType = actionType;
    this.skillId = skillId;
  }

  execute(context: BehaviorContext): BehaviorStatus {
    // Store the decision for later execution
    (context as BehaviorContext & { selectedAction: { type: string; skillId?: string } }).selectedAction = {
      type: this.actionType,
      skillId: this.skillId,
    };
    return 'success';
  }
}

// ============================================================================
// AI Decision Engine
// ============================================================================

export interface AIDecision {
  action: 'attack' | 'defend' | 'skill';
  skillId?: string;
  reasoning?: string;
}

export class AIDecisionEngine {
  private turnHistory: Array<{ action: string; outcome: string }> = [];
  private personality: AIPersonality;

  constructor(personalityType: AIPersonalityType = 'balanced') {
    this.personality = AI_PERSONALITIES[personalityType];
  }

  /**
   * Main decision-making method
   */
  makeDecision(
    self: Fighter,
    opponent: Fighter,
    difficulty: DifficultyLevel
  ): AIDecision {
    const context: BehaviorContext = {
      self,
      opponent,
      personality: this.personality,
      turnHistory: this.turnHistory,
      difficulty,
    };

    // Apply difficulty-based mistake chance
    const mistakeChance = getAIMistakeChance(difficulty);
    if (Math.random() * 100 < mistakeChance) {
      return this.makeMistake(self);
    }

    // Unpredictable personality has random decision chance
    if (this.personality.type === 'unpredictable' && Math.random() < 0.3) {
      return this.makeRandomDecision(self);
    }

    // Build and execute behavior tree
    const behaviorTree = this.buildBehaviorTree(context);
    const extendedContext = context as BehaviorContext & { selectedAction?: { type: string; skillId?: string } };
    behaviorTree.execute(extendedContext);

    // Extract decision from context
    if (extendedContext.selectedAction) {
      const decision: AIDecision = {
        action: extendedContext.selectedAction.type as 'attack' | 'defend' | 'skill',
        skillId: extendedContext.selectedAction.skillId,
      };
      
      this.recordTurn(decision.action, 'pending');
      return decision;
    }

    // Fallback to basic attack
    return { action: 'attack' };
  }

  /**
   * Build dynamic behavior tree based on current state
   */
  private buildBehaviorTree(context: BehaviorContext): BehaviorNode {
    const { self, opponent, personality } = context;
    
    const healthPercent = self.currentHealth / self.maxHealth;
    const opponentHealthPercent = opponent.currentHealth / opponent.maxHealth;
    
    // Determine AI state based on health and personality
    const aiState = this.determineAIState(healthPercent, personality);

    return new SelectorNode([
      // Critical health emergency actions
      this.buildCriticalHealthBehavior(healthPercent, personality),
      
      // Offensive opportunities
      this.buildOffensiveBehavior(aiState, opponentHealthPercent, personality, self),
      
      // Defensive necessity
      this.buildDefensiveBehavior(aiState, healthPercent, personality),
      
      // Default balanced action
      this.buildDefaultBehavior(personality, self),
    ]);
  }

  /**
   * Determine current AI state based on health and personality
   */
  private determineAIState(
    healthPercent: number,
    personality: AIPersonality
  ): 'critical' | 'defensive' | 'aggressive' | 'balanced' {
    const { critical, low, high } = personality.behaviorModifiers.healthThresholds;

    if (healthPercent <= critical) {
      // Critical health: personality-dependent behavior
      if (personality.type === 'berserker') return 'aggressive';
      if (personality.type === 'cowardly') return 'defensive';
      return 'critical';
    }

    if (healthPercent <= low) {
      // Low health: become more cautious (except berserker)
      if (personality.type === 'berserker') return 'aggressive';
      return 'defensive';
    }

    if (healthPercent >= high) {
      // High health: more confident
      if (personality.traits.aggression > 60) return 'aggressive';
      return 'balanced';
    }

    // Mid health: personality-driven
    if (personality.traits.aggression > 65) return 'aggressive';
    if (personality.traits.caution > 65) return 'defensive';
    return 'balanced';
  }

  /**
   * Build critical health behavior subtree
   */
  private buildCriticalHealthBehavior(
    healthPercent: number,
    personality: AIPersonality
  ): BehaviorNode {
    return new SequenceNode([
      new ConditionNode(() => healthPercent <= personality.behaviorModifiers.healthThresholds.critical),
      new SelectorNode([
        // Berserker goes all-in
        new SequenceNode([
          new ConditionNode(() => personality.type === 'berserker'),
          new ActionNode('attack'),
        ]),
        // Others defend
        new ActionNode('defend'),
      ]),
    ]);
  }

  /**
   * Build offensive behavior subtree
   */
  private buildOffensiveBehavior(
    aiState: string,
    opponentHealthPercent: number,
    personality: AIPersonality,
    self: Fighter
  ): BehaviorNode {
    return new SequenceNode([
      new ConditionNode(() => 
        aiState === 'aggressive' || 
        (opponentHealthPercent < 0.3 && personality.traits.aggression > 40)
      ),
      new SelectorNode([
        // Try to use skill if available and preferred
        this.buildSkillUseBehavior(personality, self),
        // Otherwise basic attack
        new ActionNode('attack'),
      ]),
    ]);
  }

  /**
   * Build skill usage behavior
   */
  private buildSkillUseBehavior(personality: AIPersonality, self: Fighter): BehaviorNode {
    return new SequenceNode([
      new ConditionNode(() => {
        const skillChance = personality.traits.skillPreference;
        return Math.random() * 100 < skillChance && self.skills.length > 0;
      }),
      new ConditionNode(() => {
        // Check if we have mana for any skill
        return self.skills.some((skill: Skill) => self.currentMana >= skill.manaCost);
      }),
      new ActionNode('skill', this.selectBestSkill(self, personality)),
    ]);
  }

  /**
   * Build defensive behavior subtree
   */
  private buildDefensiveBehavior(
    aiState: string,
    healthPercent: number,
    personality: AIPersonality
  ): BehaviorNode {
    return new SequenceNode([
      new ConditionNode(() => 
        aiState === 'defensive' || 
        healthPercent < 0.4
      ),
      new ConditionNode(() => {
        // Defensive personalities defend more often
        const baseDefendChance = 40;
        const cautionBonus = personality.traits.caution * 0.5;
        return Math.random() * 100 < (baseDefendChance + cautionBonus);
      }),
      new ActionNode('defend'),
    ]);
  }

  /**
   * Build default balanced behavior
   */
  private buildDefaultBehavior(personality: AIPersonality, self: Fighter): BehaviorNode {
    return new SelectorNode([
      // Weighted decision based on aggression
      new SequenceNode([
        new ConditionNode(() => 
          Math.random() * 100 < personality.traits.aggression
        ),
        new SelectorNode([
          this.buildSkillUseBehavior(personality, self),
          new ActionNode('attack'),
        ]),
      ]),
      // Default to defend
      new ActionNode('defend'),
    ]);
  }

  /**
   * Select the best skill to use based on context
   */
  private selectBestSkill(fighter: Fighter, personality: AIPersonality): string | undefined {
    const availableSkills = fighter.skills.filter(
      (skill: Skill) => fighter.currentMana >= skill.manaCost
    );

    if (availableSkills.length === 0) return undefined;

    // Combo-aware personalities try to chain skills
    if (personality.traits.comboAwareness > 60 && this.turnHistory.length > 0) {
      const lastAction = this.turnHistory[this.turnHistory.length - 1];
      if (lastAction.action.includes('skill_')) {
        // Prefer different skill types for combo variety
        const lastSkillId = lastAction.action.replace('skill_', '');
        const differentSkills = availableSkills.filter((s: Skill) => s.id !== lastSkillId);
        if (differentSkills.length > 0) {
          return this.pickHighestDamageSkill(differentSkills);
        }
      }
    }

    // Default: pick highest damage skill
    return this.pickHighestDamageSkill(availableSkills);
  }

  /**
   * Pick skill with highest damage potential
   */
  private pickHighestDamageSkill(skills: Skill[]): string | undefined {
    if (skills.length === 0) return undefined;
    
    const sorted = [...skills].sort((a, b) => {
      // Prioritize skills with damage effects
      const aDamage = a.effects?.some(e => e.type === 'damage') ? 1 : 0;
      const bDamage = b.effects?.some(e => e.type === 'damage') ? 1 : 0;
      return bDamage - aDamage;
    });

    return sorted[0].id;
  }

  /**
   * Make an intentional mistake (difficulty-based)
   */
  private makeMistake(fighter: Fighter): AIDecision {
    const mistakes: Array<{ action: 'attack' | 'defend' | 'skill'; skillId?: string; reason: string }> = [
      { action: 'defend' as const, reason: 'Defended unnecessarily' },
      { action: 'attack' as const, reason: 'Attacked when should defend' },
    ];

    // Add skill mistakes if available
    if (fighter.skills.length > 0 && fighter.currentMana >= 10) {
      const randomSkill = fighter.skills[Math.floor(Math.random() * fighter.skills.length)];
      if (fighter.currentMana >= randomSkill.manaCost) {
        mistakes.push({
          action: 'skill' as const,
          reason: 'Used suboptimal skill',
        });
      }
    }

    const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
    return {
      action: mistake.action,
      reasoning: mistake.reason,
    };
  }

  /**
   * Make a random decision (unpredictable personality)
   */
  private makeRandomDecision(fighter: Fighter): AIDecision {
    const actions: AIDecision[] = [
      { action: 'attack' },
      { action: 'defend' },
    ];

    if (fighter.skills.length > 0 && fighter.currentMana >= 10) {
      const usableSkills = fighter.skills.filter((s: Skill) => fighter.currentMana >= s.manaCost);
      if (usableSkills.length > 0) {
        const randomSkill = usableSkills[Math.floor(Math.random() * usableSkills.length)];
        actions.push({ action: 'skill', skillId: randomSkill.id });
      }
    }

    return actions[Math.floor(Math.random() * actions.length)];
  }

  /**
   * Record turn for learning/adaptation
   */
  private recordTurn(action: string, outcome: string): void {
    this.turnHistory.push({ action, outcome });
    
    // Keep only last 10 turns for memory efficiency
    if (this.turnHistory.length > 10) {
      this.turnHistory.shift();
    }
  }

  /**
   * Update turn outcome (called after action resolves)
   */
  updateLastTurnOutcome(outcome: string): void {
    if (this.turnHistory.length > 0) {
      this.turnHistory[this.turnHistory.length - 1].outcome = outcome;
    }
  }

  /**
   * Get personality info
   */
  getPersonality(): AIPersonality {
    return this.personality;
  }

  /**
   * Change personality (for adaptive AI)
   */
  setPersonality(type: AIPersonalityType): void {
    this.personality = AI_PERSONALITIES[type];
  }

  /**
   * Reset AI state (for new combat)
   */
  reset(): void {
    this.turnHistory = [];
  }
}

/**
 * Generate random personality for opponent
 */
export function generateRandomPersonality(opponentLevel: number): AIPersonalityType {
  const personalities: AIPersonalityType[] = [
    'balanced',
    'aggressive',
    'defensive',
    'tactical',
  ];

  // Higher level opponents get more complex personalities
  if (opponentLevel >= 5) {
    personalities.push('berserker', 'cowardly');
  }

  if (opponentLevel >= 10) {
    personalities.push('unpredictable', 'adaptive');
  }

  return personalities[Math.floor(Math.random() * personalities.length)];
}

/**
 * Get personality for specific opponent type (future use with named bosses)
 */
export function getPersonalityForOpponent(opponentName: string): AIPersonalityType {
  const personalityMap: Record<string, AIPersonalityType> = {
    'Training Dummy': 'balanced',
    'Goblin Warrior': 'aggressive',
    'Skeleton Knight': 'defensive',
    'Dark Mage': 'tactical',
    'Orc Berserker': 'berserker',
    'Shadow Assassin': 'unpredictable',
    'Dragon Knight': 'adaptive',
  };

  return personalityMap[opponentName] || 'balanced';
}
