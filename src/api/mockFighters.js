import { Fighter } from '../entities/fighter.js';

/**
 * Generate avatar URL using DiceBear API
 * @param {string} seed - Unique identifier for consistent avatar generation
 * @param {string} style - Avatar style (avataaars, adventurer, bottts, etc.)
 * @returns {string} Avatar URL
 */
function getAvatarUrl(seed, style = 'avataaars') {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4`;
}

/**
 * Get all available fighters
 * Epic fantasy fighters for all character classes
 * @returns {Promise<Array<Fighter>>} Promise resolving to fighters array
 */
export function getFighters() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fighters = [
        // ⚖️ BALANCED FIGHTERS - Jack of all trades
        new Fighter({
          id: 1,
          name: 'Aric Steelwind',
          health: 200,
          strength: 10,
          image: getAvatarUrl('aric-steelwind'),
          description:
            'A seasoned mercenary who mastered every combat style. Adaptable and reliable in any situation.',
          class: 'BALANCED',
        }),
        new Fighter({
          id: 2,
          name: 'Lyria Dawnshard',
          health: 200,
          strength: 10,
          image: getAvatarUrl('lyria-dawnshard'),
          description:
            'Guardian of the Eternal Flame, she fights with unwavering balance between might and wisdom.',
          class: 'BALANCED',
        }),

        // ⚔️ WARRIOR FIGHTERS - High damage dealers
        new Fighter({
          id: 3,
          name: 'Thorgrim Bloodaxe',
          health: 180,
          strength: 13,
          image: getAvatarUrl('thorgrim-bloodaxe'),
          description:
            'Northern berserker whose mighty axe has cleaved through countless foes. Lives for the thrill of battle.',
          class: 'WARRIOR',
        }),
        new Fighter({
          id: 4,
          name: 'Kael Stormbreaker',
          health: 180,
          strength: 13,
          image: getAvatarUrl('kael-stormbreaker'),
          description:
            'Lightning-fast swordsman who strikes with devastating precision. His blade never misses its mark.',
          class: 'WARRIOR',
        }),
        new Fighter({
          id: 5,
          name: 'Valeria Ironfist',
          health: 180,
          strength: 13,
          image: getAvatarUrl('valeria-ironfist'),
          description:
            'Arena champion who crushes opponents with overwhelming offensive power and brutal combos.',
          class: 'WARRIOR',
        }),

        // 🛡️ TANK FIGHTERS - Defensive juggernauts
        new Fighter({
          id: 6,
          name: 'Brutus Ironwall',
          health: 300,
          strength: 6,
          image: getAvatarUrl('brutus-ironwall'),
          description:
            'Living fortress who has never fallen in battle. His shield has protected countless allies.',
          class: 'TANK',
        }),
        new Fighter({
          id: 7,
          name: 'Gorok the Unyielding',
          health: 300,
          strength: 6,
          image: getAvatarUrl('gorok-unyielding'),
          description:
            'Mountain-born defender with skin like stone. Outlasts enemies through sheer endurance.',
          class: 'TANK',
        }),
        new Fighter({
          id: 8,
          name: 'Aegis Stoneborn',
          health: 300,
          strength: 6,
          image: getAvatarUrl('aegis-stoneborn'),
          description:
            'Ancient protector forged from living rock. Nearly invulnerable and eternally patient.',
          class: 'TANK',
        }),

        // 💥 GLASS CANNON FIGHTERS - Maximum damage, minimum defense
        new Fighter({
          id: 9,
          name: 'Raze Hellfire',
          health: 150,
          strength: 20,
          image: getAvatarUrl('raze-hellfire'),
          description:
            'Reckless pyromancer who sacrifices everything for devastating power. Burns bright, burns fast.',
          class: 'GLASS_CANNON',
        }),
        new Fighter({
          id: 10,
          name: 'Vex Shadowstrike',
          health: 150,
          strength: 20,
          image: getAvatarUrl('vex-shadowstrike'),
          description:
            'High-risk assassin who deals catastrophic damage before enemies can react. Death or glory.',
          class: 'GLASS_CANNON',
        }),

        // 👊 BRUISER FIGHTERS - Sustain and brawling
        new Fighter({
          id: 11,
          name: 'Grakk Bonecrusher',
          health: 250,
          strength: 9,
          image: getAvatarUrl('grakk-bonecrusher'),
          description:
            'Pit fighter who heals through combat. The longer the fight, the stronger he becomes.',
          class: 'BRUISER',
        }),
        new Fighter({
          id: 12,
          name: 'Darius Warhound',
          health: 250,
          strength: 9,
          image: getAvatarUrl('darius-warhound'),
          description:
            'Relentless brawler who wears down opponents with sustained pressure and lifesteal.',
          class: 'BRUISER',
        }),
        new Fighter({
          id: 13,
          name: 'Ursa Bloodfang',
          health: 250,
          strength: 9,
          image: getAvatarUrl('ursa-bloodfang'),
          description:
            'Savage warrior who grows stronger with each wound inflicted, draining life from enemies.',
          class: 'BRUISER',
        }),

        // 🔮 MAGE FIGHTERS - Powerful spellcasters
        new Fighter({
          id: 14,
          name: 'Azura Starweaver',
          health: 170,
          strength: 8,
          image: getAvatarUrl('azura-starweaver'),
          description:
            'Archmage who bends cosmic forces to her will. Her spells devastate entire battlefields.',
          class: 'MAGE',
        }),
        new Fighter({
          id: 15,
          name: 'Zephyr Frostmind',
          health: 170,
          strength: 8,
          image: getAvatarUrl('zephyr-frostmind'),
          description:
            'Ice sorcerer whose frozen magic slows and shatters foes. Masters long-range devastation.',
          class: 'MAGE',
        }),
        new Fighter({
          id: 16,
          name: 'Ignis Emberheart',
          health: 170,
          strength: 8,
          image: getAvatarUrl('ignis-emberheart'),
          description:
            'Pyromancer with unmatched skill damage. Incinerates enemies from safe distances.',
          class: 'MAGE',
        }),

        // 🗡️ ASSASSIN FIGHTERS - High crit, high mobility
        new Fighter({
          id: 17,
          name: 'Nyx Shadowblade',
          health: 160,
          strength: 12,
          image: getAvatarUrl('nyx-shadowblade'),
          description:
            'Silent killer who strikes from darkness with lethal precision. First attack always critical.',
          class: 'ASSASSIN',
        }),
        new Fighter({
          id: 18,
          name: 'Talon Nightwhisper',
          health: 160,
          strength: 12,
          image: getAvatarUrl('talon-nightwhisper'),
          description:
            'Master of poisons and daggers. Delivers rapid burst damage with deadly combo chains.',
          class: 'ASSASSIN',
        }),
        new Fighter({
          id: 19,
          name: 'Shade Deathmark',
          health: 160,
          strength: 12,
          image: getAvatarUrl('shade-deathmark'),
          description:
            'Phantom assassin with supernatural agility. Multiple strikes in the blink of an eye.',
          class: 'ASSASSIN',
        }),

        // 🪓 BERSERKER FIGHTERS - Rage-fueled warriors
        new Fighter({
          id: 20,
          name: 'Ragnar Skullsplitter',
          health: 220,
          strength: 11,
          image: getAvatarUrl('ragnar-skullsplitter'),
          description:
            'Fury incarnate who grows deadlier as he bleeds. Unstoppable when enraged.',
          class: 'BERSERKER',
        }),
        new Fighter({
          id: 21,
          name: 'Kruul Bloodrage',
          health: 220,
          strength: 11,
          image: getAvatarUrl('kruul-bloodrage'),
          description:
            'Savage warrior fueled by pure rage. Pain only makes him stronger and more dangerous.',
          class: 'BERSERKER',
        }),
        new Fighter({
          id: 22,
          name: 'Axia Wildborn',
          health: 220,
          strength: 11,
          image: getAvatarUrl('axia-wildborn'),
          description:
            'Primal berserker who channels beast fury. Trading damage for devastation is her way.',
          class: 'BERSERKER',
        }),

        // ⚜️ PALADIN FIGHTERS - Holy warriors
        new Fighter({
          id: 23,
          name: 'Seraphine Lightbringer',
          health: 240,
          strength: 10,
          image: getAvatarUrl('seraphine-lightbringer'),
          description:
            'Champion of the divine who smites evil with holy wrath. Heals allies and destroys darkness.',
          class: 'PALADIN',
        }),
        new Fighter({
          id: 24,
          name: 'Marcus Dawnforge',
          health: 240,
          strength: 10,
          image: getAvatarUrl('marcus-dawnforge'),
          description:
            'Blessed warrior who balances righteous fury with divine protection. Faith is his armor.',
          class: 'PALADIN',
        }),
        new Fighter({
          id: 25,
          name: 'Althea Holyshield',
          health: 240,
          strength: 10,
          image: getAvatarUrl('althea-holyshield'),
          description:
            'Sacred defender blessed with regeneration. Her light never fades, her resolve never breaks.',
          class: 'PALADIN',
        }),

        // 💀 NECROMANCER FIGHTERS - Death magic masters
        new Fighter({
          id: 26,
          name: 'Malakai Deathwhisper',
          health: 180,
          strength: 8,
          image: getAvatarUrl('malakai-deathwhisper'),
          description:
            'Dark sorcerer who drains life force from victims. Grows more powerful with each kill.',
          class: 'NECROMANCER',
        }),
        new Fighter({
          id: 27,
          name: 'Morgana Soulreaper',
          health: 180,
          strength: 8,
          image: getAvatarUrl('morgana-soulreaper'),
          description:
            'Mistress of death magic who feeds on fallen foes. Life drain sustains her dark power.',
          class: 'NECROMANCER',
        }),
        new Fighter({
          id: 28,
          name: 'Valdis Graveborn',
          health: 180,
          strength: 8,
          image: getAvatarUrl('valdis-graveborn'),
          description:
            'Undead warlock who converts enemy vitality into arcane might. Death is merely power.',
          class: 'NECROMANCER',
        }),

        // Additional fighters for variety
        new Fighter({
          id: 29,
          name: 'Elena Swiftblade',
          health: 200,
          strength: 10,
          image: getAvatarUrl('elena-swiftblade'),
          description:
            'Versatile duelist who adapts to any opponent. Her technique is flawless and ever-evolving.',
          class: 'BALANCED',
        }),
        new Fighter({
          id: 30,
          name: 'Rex Titanfall',
          health: 300,
          strength: 6,
          image: getAvatarUrl('rex-titanfall'),
          description:
            'Colossal defender whose presence alone intimidates foes. A wall that never crumbles.',
          class: 'TANK',
        }),
      ];

      resolve(fighters);
    }, 800); // Simulated API delay
  });
}
