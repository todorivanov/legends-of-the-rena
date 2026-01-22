/**
 * EnemyIconMapper - Maps enemy types to appropriate icons for grid combat
 * Based on enemy name, class, and story context
 */

export class EnemyIconMapper {
  /**
   * Get icon for an enemy based on their characteristics
   * @param {Object} fighter - Enemy fighter object
   * @returns {string} - Emoji icon representing the enemy
   */
  static getEnemyIcon(fighter) {
    if (!fighter || fighter.isPlayer) {
      return '🦸'; // Player icon
    }

    const name = fighter.name.toLowerCase();

    // ========== SLAVE GLADIATOR PATH ENEMIES ==========

    // Specific named enemies first (most specific matches)
    if (name.includes('brutus')) {
      return '🧔'; // Brutus - bearded strong man
    }
    if (name.includes('gaius')) {
      return '👊'; // Iron Fist Gaius - brawler
    }
    if (name.includes('helena')) {
      return '🗡️'; // Swift Blade Helena - assassin
    }
    if (name.includes('titus')) {
      return '🛡️'; // Mountain Titus - tank
    }
    if (name.includes('marcus')) {
      return '👨'; // Fellow slave Marcus
    }

    // Prison/Arena fighters
    if (name.includes('condemned') || name.includes('prisoner')) {
      return '⛓️'; // Chained prisoner
    }
    if (name.includes('fellow slave') || name.includes('slave')) {
      return '👤'; // Generic slave fighter
    }
    if (name.includes('veteran')) {
      return '⚔️'; // Armored veteran
    }
    if (name.includes('champion') && !name.includes('emperor')) {
      return '🏆'; // Arena champion (gold trophy)
    }
    if (name.includes('imperial champion') || name.includes("emperor's")) {
      return '👑'; // Imperial champion - crowned
    }

    // Raiders and bandits
    if (name.includes('desert raider') || name.includes('raider')) {
      return '🧕'; // Desert raider (turbaned figure)
    }
    if (name.includes('bandit') || name.includes('thief')) {
      return '🥷'; // Bandit/thief (ninja-style)
    }

    // Special fighters
    if (name.includes('executioner')) {
      return '🪓'; // The Executioner - axe
    }
    if (name.includes('guardian') || name.includes('test')) {
      return '🛡️'; // Guardian
    }
    if (name.includes('shadow')) {
      return '👤'; // Shadow enemy (silhouette)
    }
    if (name.includes('rival') && name.includes('master')) {
      return '🤺'; // Rival master's champion - fencer
    }

    // Legendary/Freedom fighters
    if (name.includes('freedom') || name.includes('liberator')) {
      return '🕊️'; // Symbol of freedom
    }

    // ========== ROMAN LEGIONNAIRE PATH ENEMIES ==========

    // Barbarians (more specific icons)
    if (name.includes('warchief') || name.includes('chieftain')) {
      return '👑'; // Tribal leader with crown
    }
    if (name.includes('barbarian') || name.includes('gaul') || name.includes('germanic')) {
      return '🧔'; // Barbarian warrior (bearded man)
    }
    if (name.includes('berserker')) {
      return '😡'; // Berserker (angry face)
    }

    // Rebels
    if (name.includes('rebel leader') || name.includes('insurgent leader')) {
      return '🔥'; // Rebel leader with fire
    }
    if (name.includes('rebel') || name.includes('insurgent')) {
      return '⚔️'; // Rebel fighter
    }
    if (name.includes('partisan')) {
      return '🗡️'; // Partisan rebel
    }

    // Roman military hierarchy
    if (name.includes('emperor') || name.includes('caesar')) {
      return '👑'; // Imperial ruler
    }
    if (name.includes('general') || name.includes('legatus')) {
      return '⭐'; // High-ranking general
    }
    if (name.includes('praetorian')) {
      return '🛡️'; // Elite Roman guard
    }
    if (name.includes('centurion')) {
      return '🦅'; // Centurion with Roman eagle
    }
    if (name.includes('legionnaire') || name.includes('soldier')) {
      return '⚔️'; // Roman soldier
    }

    // Foreign enemies
    if (name.includes('numidian') || name.includes('carthaginian')) {
      return '🐫'; // North African cavalry
    }
    if (name.includes('parthian') || name.includes('persian')) {
      return '🏹'; // Eastern archer
    }
    if (name.includes('egyptian')) {
      return '🐍'; // Egyptian (serpent symbol)
    }
    if (name.includes('scythian')) {
      return '🏇'; // Horse archer
    }

    // ========== LANISTA PATH ENEMIES ==========

    // Business rivals
    if (name.includes('rival lanista') || name.includes('competitor')) {
      return '🤵'; // Business rival (man in suit)
    }
    if (name.includes('crooked') || name.includes('corrupt official')) {
      return '🎭'; // Corrupt official (mask)
    }
    if (name.includes('senator') || name.includes('noble')) {
      return '👔'; // Noble/politician
    }

    // Rogue gladiators
    if (name.includes('rogue gladiator') || name.includes('deserter')) {
      return '🥷'; // Rogue fighter (ninja)
    }
    if (name.includes('rogue') || name.includes('outlaw')) {
      return '🗡️'; // Outlaw
    }
    if (name.includes('mercenary')) {
      return '💰'; // Mercenary (money bag)
    }

    // Criminals
    if (name.includes('crime lord') || name.includes('syndicate boss')) {
      return '🦹'; // Crime boss (villain)
    }
    if (name.includes('syndicate') || name.includes('gang')) {
      return '🔪'; // Gang member
    }
    if (name.includes('assassin') || name.includes('hitman')) {
      return '🥷'; // Assassin
    }
    if (name.includes('enforcer') || name.includes('thug')) {
      return '👊'; // Enforcer
    }

    // Arena legends
    if (name.includes('legend') || name.includes('legendary')) {
      return '⭐'; // Legendary fighter (star)
    }
    if (name.includes('master gladiator')) {
      return '🏆'; // Master gladiator
    }
    if (name.includes('champion')) {
      return '👑'; // Arena champion
    }

    // ========== BARBARIAN TRAVELLER PATH ENEMIES ==========

    // Hostile tribes (more specific)
    if (name.includes('blood warrior') || name.includes('blood tribe')) {
      return '🩸'; // Blood warrior
    }
    if (name.includes('war band') || name.includes('raiding party')) {
      return '⚔️'; // War band
    }
    if (name.includes('hostile tribe') || name.includes('enemy tribe')) {
      return '🧔'; // Tribal warrior (bearded)
    }
    if (name.includes('shaman') || name.includes('witch doctor')) {
      return '🔮'; // Shaman (crystal ball)
    }
    if (name.includes('elder') || name.includes('sage')) {
      return '👴'; // Tribal elder
    }
    if (name.includes('berserker')) {
      return '😡'; // Berserker
    }

    // Wildlife
    if (name.includes('dire wolf') || name.includes('alpha wolf')) {
      return '🐺'; // Wolf
    }
    if (name.includes('bear') || name.includes('great bear')) {
      return '🐻'; // Bear
    }
    if (name.includes('beast') || name.includes('creature')) {
      return '🦁'; // Beast (lion)
    }
    if (name.includes('boar') || name.includes('wild boar')) {
      return '🐗'; // Boar
    }

    // Romans (invaders from barbarian perspective)
    if (name.includes('roman patrol') || name.includes('roman scout')) {
      return '🛡️'; // Roman patrol
    }
    if (name.includes('roman officer') || name.includes('centurion')) {
      return '🦅'; // Roman officer
    }
    if (name.includes('roman')) {
      return '⚔️'; // Roman soldier
    }

    // Warlords and conquerors
    if (name.includes('warlord') || name.includes('conqueror')) {
      return '👹'; // Warlord (demon face)
    }
    if (name.includes('tyrant') || name.includes('despot')) {
      return '😈'; // Tyrant
    }

    // Mystical/Ancient enemies
    if (name.includes('ancient guardian') || name.includes('ancient protector')) {
      return '🗿'; // Ancient statue
    }
    if (name.includes('cursed') || name.includes('corrupted')) {
      return '💀'; // Cursed being (skull)
    }
    if (name.includes('spirit') || name.includes('wraith') || name.includes('ghost')) {
      return '👻'; // Spirit
    }
    if (name.includes('demon') || name.includes('fiend')) {
      return '😈'; // Demon
    }

    // ========== DESERT NOMAD PATH ENEMIES ==========

    // Desert enemies (more specific)
    if (name.includes('scavenger') || name.includes('looter')) {
      return '🦎'; // Desert scavenger (lizard)
    }
    if (name.includes('sand creature') || name.includes('sand elemental')) {
      return '🌪️'; // Sand creature (tornado)
    }
    if (name.includes('dune') || name.includes('desert walker')) {
      return '🧕'; // Desert walker (turbaned figure)
    }

    // Raiders and pirates
    if (name.includes('caravan raider') || name.includes('highway')) {
      return '🐫'; // Caravan raider (camel)
    }
    if (name.includes('desert pirate') || name.includes('pirate')) {
      return '🏴‍☠️'; // Desert pirate (pirate flag)
    }
    if (name.includes('marauder') || name.includes('bandit')) {
      return '🥷'; // Marauder
    }
    if (name.includes('raider') && !name.includes('caravan')) {
      return '⚔️'; // Generic raider
    }

    // Mystical desert enemies
    if (name.includes('djinn') || name.includes('genie')) {
      return '🧞'; // Djinn (genie)
    }
    if (name.includes('spirit') || name.includes('specter')) {
      return '👻'; // Desert spirit
    }
    if (name.includes('sand witch') || name.includes('sorceress')) {
      return '🧙'; // Sorceress (wizard)
    }
    if (name.includes('mystic') || name.includes('oracle')) {
      return '🔮'; // Mystic
    }

    // Rival nomads
    if (name.includes('rival chief') || name.includes('competing chief')) {
      return '👳'; // Rival chief (turbaned person)
    }
    if (name.includes('rival nomad') || name.includes('competing')) {
      return '🧕'; // Rival nomad
    }

    // Desert creatures
    if (name.includes('giant scorpion') || name.includes('scorpion king')) {
      return '🦂'; // Scorpion
    }
    if (name.includes('serpent') || name.includes('snake') || name.includes('viper')) {
      return '🐍'; // Desert serpent
    }
    if (name.includes('vulture') || name.includes('carrion')) {
      return '🦅'; // Vulture
    }
    if (name.includes('scarab') || name.includes('beetle')) {
      return '🪲'; // Scarab beetle
    }

    // Final bosses and legends
    if (name.includes('tyrant') || name.includes('oppressor')) {
      return '😈'; // Desert tyrant
    }
    if (name.includes('warlord')) {
      return '👹'; // Desert warlord (demon)
    }
    if (name.includes('eternal') || name.includes('immortal') || name.includes('ancient king')) {
      return '💀'; // Ancient immortal (skull)
    }
    if (name.includes('champion') && name.includes('sand')) {
      return '🏆'; // Sand champion
    }

    // ========== CLASS-BASED FALLBACKS ==========

    const fighterClass = fighter.class || fighter.fighterClass;

    switch (fighterClass) {
      case 'WARRIOR':
        return '🗡️'; // Sword warrior
      case 'TANK':
        return '🛡️'; // Shield tank
      case 'MAGE':
        return '🧙'; // Mage wizard
      case 'NECROMANCER':
        return '💀'; // Necromancer skull
      case 'ASSASSIN':
        return '🥷'; // Ninja assassin
      case 'AGILE':
        return '🤸'; // Acrobat
      case 'BERSERKER':
        return '😡'; // Angry berserker
      case 'PALADIN':
        return '✨'; // Holy warrior
      case 'BRAWLER':
        return '👊'; // Fist brawler
      case 'GLASS_CANNON':
        return '💥'; // Explosive power
      case 'BRUISER':
        return '🧔'; // Tough bruiser
      case 'BALANCED':
        return '⚖️'; // Balanced fighter
      default:
        return '👹'; // Generic enemy demon
    }
  }

  /**
   * Get icon with boss indicator
   * @param {Object} fighter - Fighter object
   * @returns {string} - Icon with boss crown if applicable
   */
  static getIconWithBossIndicator(fighter) {
    const baseIcon = this.getEnemyIcon(fighter);

    if (fighter.isBoss) {
      return `${baseIcon}👑`; // Add crown for bosses
    }

    return baseIcon;
  }

  /**
   * Get enemy icon color based on type
   * @param {Object} fighter - Fighter object
   * @returns {string} - CSS color value
   */
  static getEnemyColor(fighter) {
    if (!fighter || fighter.isPlayer) {
      return '#4caf50'; // Green for player
    }

    const name = fighter.name.toLowerCase();

    // Special enemy types get unique colors
    if (name.includes('boss') || fighter.isBoss) {
      return '#ff9800'; // Orange for bosses
    }
    if (name.includes('champion') || name.includes('legend')) {
      return '#ffd700'; // Gold for champions
    }
    if (name.includes('spirit') || name.includes('ancient') || name.includes('cursed')) {
      return '#9c27b0'; // Purple for mystical
    }
    if (name.includes('elite') || name.includes('praetorian')) {
      return '#e91e63'; // Pink for elite
    }

    return '#f44336'; // Default red for enemies
  }
}
