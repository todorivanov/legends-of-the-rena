import type { PlayerCharacter } from '../types/game';
import { TALENT_TREES, type TalentNode } from '../data/talents';

/**
 * Calculate stat bonuses from learned talents
 */
export function calculateTalentBonuses(
  learnedTalents: Record<string, number>
): {
  strength: number;
  health: number;
  defense: number;
  critChance: number;
  critDamage: number;
  manaRegen: number;
} {
  const bonuses = {
    strength: 0,
    health: 0,
    defense: 0,
    critChance: 0,
    critDamage: 0,
    manaRegen: 0,
  };

  // Go through all learned talents
  Object.entries(learnedTalents).forEach(([talentId, ranks]) => {
    if (ranks === 0) return;

    // Find the talent definition
    let foundTalent: TalentNode | null = null;
    for (const tree of TALENT_TREES) {
      const talent = tree.talents.find(t => t.id === talentId);
      if (talent) {
        foundTalent = talent;
        break;
      }
    }

    if (!foundTalent || !foundTalent.effects.stats) return;

    // Apply stat bonuses
    const stats = foundTalent.effects.stats;
    if (stats.strength) bonuses.strength += stats.strength * ranks;
    if (stats.health) bonuses.health += stats.health * ranks;
    if (stats.defense) bonuses.defense += stats.defense * ranks;
    if (stats.critChance) bonuses.critChance += stats.critChance * ranks;
    if (stats.critDamage) bonuses.critDamage += stats.critDamage * ranks;
    if (stats.manaRegen) bonuses.manaRegen += stats.manaRegen * ranks;
  });

  return bonuses;
}

/**
 * Get player's effective stats with talent bonuses applied
 */
export function getPlayerStatsWithTalents(player: PlayerCharacter): {
  maxHealth: number;
  strength: number;
  defense: number;
  maxMana: number;
  critChance: number;
  critDamage: number;
  manaRegen: number;
} {
  const talentBonuses = calculateTalentBonuses(player.learnedTalents);

  return {
    maxHealth: player.baseHealth + talentBonuses.health,
    strength: player.baseStrength + talentBonuses.strength,
    defense: player.baseDefense + talentBonuses.defense,
    maxMana: player.baseMana,
    critChance: talentBonuses.critChance,
    critDamage: 150 + talentBonuses.critDamage, // Base 150% crit damage
    manaRegen: 10 + talentBonuses.manaRegen, // Base 10 mana per turn
  };
}

/**
 * Get active passive abilities from talents
 */
export function getTalentPassives(
  learnedTalents: Record<string, number>
): Array<{ type: string; ranks: number; [key: string]: string | number | boolean | undefined }> {
  const passives: Array<{ type: string; ranks: number; [key: string]: string | number | boolean | undefined }> = [];

  Object.entries(learnedTalents).forEach(([talentId, ranks]) => {
    if (ranks === 0) return;

    // Find the talent definition
    let foundTalent: TalentNode | null = null;
    for (const tree of TALENT_TREES) {
      const talent = tree.talents.find(t => t.id === talentId);
      if (talent) {
        foundTalent = talent;
        break;
      }
    }

    if (!foundTalent || !foundTalent.effects.passive) return;

    passives.push({
      ...foundTalent.effects.passive,
      ranks,
    });
  });

  return passives;
}
