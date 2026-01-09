/**
 * ComboSystem - Manages skill combos and chain reactions
 * Tracks action sequences and triggers bonus effects when combos are executed
 */

import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';
import { createStatusEffect } from './StatusEffect.js';
import { COMBO_DEFINITIONS } from '../data/comboDefinitions.js';

export class ComboSystem {
  constructor() {
    this.actionHistory = []; // Track last N actions
    this.maxHistory = 5; // Remember last 5 actions
    this.activeCombo = null; // Currently active combo
    this.comboMultiplier = 1.0; // Damage multiplier
  }

  /**
   * Record an action for combo tracking
   * @param {Object} fighter - Fighter performing action
   * @param {string} actionType - Type of action ('attack', 'skill', 'defend')
   * @param {string} skillName - Name of skill if actionType is 'skill'
   */
  recordAction(fighter, actionType, skillName = null) {
    const action = {
      fighter: fighter.name,
      fighterId: fighter.id,
      type: actionType,
      skill: skillName,
      timestamp: Date.now(),
    };

    this.actionHistory.push(action);

    // Keep only recent history
    if (this.actionHistory.length > this.maxHistory) {
      this.actionHistory.shift();
    }

    // Check for combos
    this.checkForCombo(fighter);
  }

  /**
   * Check if recent actions form a combo
   * @param {Object} fighter - Fighter to check combos for
   * @returns {Object|null} Combo data if found
   */
  checkForCombo(fighter) {
    // Get recent actions for this fighter
    const fighterActions = this.actionHistory
      .filter((action) => action.fighterId === fighter.id)
      .slice(-4); // Check last 4 actions

    if (fighterActions.length < 2) return null;

    // Check against combo definitions
    for (const combo of COMBO_DEFINITIONS) {
      if (this.matchesCombo(fighterActions, combo, fighter.class)) {
        this.triggerCombo(combo, fighter);
        return combo;
      }
    }

    return null;
  }

  /**
   * Check if action sequence matches a combo definition
   * @param {Array} actions - Recent actions
   * @param {Object} combo - Combo definition
   * @param {string} fighterClass - Fighter's class
   * @returns {boolean} True if matches
   */
  matchesCombo(actions, combo, fighterClass) {
    // Check class restriction
    if (combo.requiredClass && combo.requiredClass !== fighterClass) {
      return false;
    }

    const sequence = combo.sequence;
    if (actions.length < sequence.length) return false;

    // Check if last N actions match the sequence
    const recentActions = actions.slice(-sequence.length);

    for (let i = 0; i < sequence.length; i++) {
      const required = sequence[i];
      const actual = recentActions[i];

      // Check action type
      if (required.type !== actual.type) {
        return false;
      }

      // Check skill name if specified
      if (required.skill && required.skill !== actual.skill) {
        return false;
      }
    }

    return true;
  }

  /**
   * Trigger a combo effect
   * @param {Object} combo - Combo definition
   * @param {Object} fighter - Fighter triggering combo
   */
  triggerCombo(combo, fighter) {
    this.activeCombo = combo;

    Logger.log(`
      <div class="combo-trigger" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 3px solid #ffd700;
        border-radius: 12px;
        padding: 20px;
        margin: 15px 0;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        animation: comboFlash 0.5s ease;
      ">
        <div style="font-size: 32px; margin-bottom: 10px;">
          ${combo.icon || '⚡'}
        </div>
        <div style="font-size: 24px; font-weight: bold; color: #ffd700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
          ${combo.name}
        </div>
        <div style="font-size: 16px; color: #fff; margin-top: 8px;">
          ${combo.description}
        </div>
        ${
          combo.bonus
            ? `
          <div style="font-size: 14px; color: #4caf50; margin-top: 8px; font-weight: 600;">
            ${this.formatBonus(combo.bonus)}
          </div>
        `
            : ''
        }
      </div>
    `);

    // Play combo sound
    soundManager.play('special');

    // Store combo for effect application
    fighter._pendingCombo = combo;

    // Clear action history to prevent chain triggering
    this.actionHistory = [];
  }

  /**
   * Format combo bonus for display
   * @param {Object} bonus - Bonus data
   * @returns {string} Formatted text
   */
  formatBonus(bonus) {
    const parts = [];

    if (bonus.damageMultiplier) {
      parts.push(`+${((bonus.damageMultiplier - 1) * 100).toFixed(0)}% Damage`);
    }
    if (bonus.extraDamage) {
      parts.push(`+${bonus.extraDamage} Bonus Damage`);
    }
    if (bonus.heal) {
      parts.push(`+${bonus.heal} HP Restored`);
    }
    if (bonus.manaRestore) {
      parts.push(`+${bonus.manaRestore} Mana Restored`);
    }
    if (bonus.statusEffect) {
      parts.push(`Applies ${bonus.statusEffect}`);
    }
    if (bonus.cooldownReduce) {
      parts.push(`-${bonus.cooldownReduce} Turn Cooldown`);
    }

    return parts.join(' | ');
  }

  /**
   * Apply combo effects to an attack
   * @param {Object} fighter - Fighter with pending combo
   * @param {Object} target - Target of attack
   * @param {number} baseDamage - Base damage before combo
   * @returns {number} Modified damage
   */
  applyComboEffects(fighter, target, baseDamage) {
    if (!fighter._pendingCombo) return baseDamage;

    const combo = fighter._pendingCombo;
    const bonus = combo.bonus || {};

    let finalDamage = baseDamage;

    // Apply damage multiplier
    if (bonus.damageMultiplier) {
      finalDamage *= bonus.damageMultiplier;
    }

    // Apply extra damage
    if (bonus.extraDamage) {
      finalDamage += bonus.extraDamage;
    }

    // Apply healing
    if (bonus.heal) {
      fighter.health = Math.min(fighter.maxHealth, fighter.health + bonus.heal);
      fighter.showFloatingDamage?.(bonus.heal, 'heal');
    }

    // Restore mana
    if (bonus.manaRestore) {
      fighter.mana = Math.min(fighter.maxMana, fighter.mana + bonus.manaRestore);
      Logger.log(
        `<div class="text-center" style="color: #2196f3;">💧 ${fighter.name} restored ${bonus.manaRestore} mana!</div>`
      );
    }

    // Apply status effect
    if (bonus.statusEffect) {
      const effect = createStatusEffect(bonus.statusEffect);
      if (effect) {
        target.statusEffects.push(effect);
        Logger.log(
          `<div class="text-center" style="color: #ff9800;">${effect.icon} ${target.name} was afflicted with ${effect.name}!</div>`
        );
      }
    }

    // Reduce skill cooldowns
    if (bonus.cooldownReduce && fighter.skills) {
      fighter.skills.forEach((skill) => {
        skill.currentCooldown = Math.max(0, skill.currentCooldown - bonus.cooldownReduce);
      });
      Logger.log(
        `<div class="text-center" style="color: #9c27b0;">⏱️ ${fighter.name}'s skill cooldowns reduced!</div>`
      );
    }

    // Execute special effect function if provided
    if (bonus.specialEffect && typeof bonus.specialEffect === 'function') {
      bonus.specialEffect(fighter, target);
    }

    // Clear pending combo
    fighter._pendingCombo = null;

    return Math.ceil(finalDamage);
  }

  /**
   * Get combo suggestions for a fighter based on recent actions
   * @param {Object} fighter - Fighter to check
   * @returns {Array} Available combo options
   */
  getComboSuggestions(fighter) {
    const fighterActions = this.actionHistory
      .filter((action) => action.fighterId === fighter.id)
      .slice(-3);

    if (fighterActions.length === 0) return [];

    const suggestions = [];

    for (const combo of COMBO_DEFINITIONS) {
      // Check class restriction
      if (combo.requiredClass && combo.requiredClass !== fighter.class) {
        continue;
      }

      const sequence = combo.sequence;

      // Check if current actions are a partial match
      if (fighterActions.length < sequence.length) {
        let isPartialMatch = true;
        for (let i = 0; i < fighterActions.length; i++) {
          const required = sequence[i];
          const actual = fighterActions[i];

          if (
            required.type !== actual.type ||
            (required.skill && required.skill !== actual.skill)
          ) {
            isPartialMatch = false;
            break;
          }
        }

        if (isPartialMatch) {
          const nextAction = sequence[fighterActions.length];
          suggestions.push({
            combo,
            nextAction,
            progress: `${fighterActions.length}/${sequence.length}`,
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Reset combo tracking
   */
  reset() {
    this.actionHistory = [];
    this.activeCombo = null;
    this.comboMultiplier = 1.0;
  }

  /**
   * Get current combo streak
   * @returns {number} Number of consecutive actions
   */
  getComboStreak(fighterId) {
    let streak = 0;
    for (let i = this.actionHistory.length - 1; i >= 0; i--) {
      if (this.actionHistory[i].fighterId === fighterId) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}

// Export singleton instance
export const comboSystem = new ComboSystem();
