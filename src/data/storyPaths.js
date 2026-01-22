/**
 * Story Path Definitions - v5.0.0
 * Five unique narrative arcs with exclusive mechanics and missions
 */

/**
 * Story Path Structure:
 * - id: Unique identifier
 * - name: Display name
 * - icon: Emoji icon
 * - description: Short tagline
 * - lore: Full backstory (2-3 paragraphs)
 * - startingBonus: Base bonuses (modified by combat class)
 * - pathMechanics: Exclusive gameplay features
 * - objectives: Main path goals
 * - difficultyRating: 1-5 stars
 * - estimatedPlaytime: Hours to complete
 */

export const STORY_PATHS = {
  slave_gladiator: {
    id: 'slave_gladiator',
    name: 'Slave Gladiator',
    icon: '⚔️',
    description: 'Fight for your freedom in the brutal arena',
    difficultyRating: 2,
    estimatedPlaytime: '8-10 hours',

    lore: `Captured during a raid on your homeland, you were sold into slavery and thrust into the 
unforgiving world of the arena. Forced to fight for the entertainment of Rome's elite, every battle 
is a struggle for survival. Your master, a wealthy lanista, sees you as nothing more than property—a 
tool to generate profit through blood and spectacle.

But you are more than a slave. With each victory, you inch closer to earning enough coin to purchase 
your freedom. The crowd's roar becomes your lifeline, and the sand of the arena your proving ground. 
Will you survive long enough to taste liberty? And once free, will you seek revenge, build your own 
ludus, or forge a new path entirely?

Your journey begins in chains, but it may end in glory—or death.`,

    startingBonus: {
      // Base bonuses (modified by class below)
      gold: 50,
      equipment: ['wooden_sword', 'leather_vest'],
      stats: {
        health: 0,
        strength: 2,
        defense: 0,
      },
    },

    // Class-specific modifications
    classModifications: {
      WARRIOR: {
        equipment: ['wooden_sword', 'leather_vest', 'iron_gauntlets'],
        stats: { strength: 3, health: 20 },
      },
      TANK: {
        equipment: ['wooden_sword', 'leather_vest', 'leather_bracers'],
        stats: { health: 50, defense: 5 },
      },
      BERSERKER: {
        equipment: ['steel_axe', 'leather_vest'],
        stats: { strength: 4, health: 10 },
      },
      BRAWLER: {
        equipment: ['iron_gauntlets', 'leather_vest'],
        stats: { strength: 3, health: 30 },
      },
      MAGE: {
        equipment: ['wooden_staff', 'cloth_pants'],
        stats: { manaRegen: 3, health: -10 },
      },
      ASSASSIN: {
        equipment: ['wooden_dagger', 'shadow_cloak'],
        stats: { strength: 2, critChance: 5 },
      },
      PALADIN: {
        equipment: ['wooden_sword', 'chainmail'],
        stats: { health: 40, defense: 3 },
      },
      BALANCED: {
        equipment: ['wooden_sword', 'leather_vest', 'bronze_ring'],
        stats: { health: 20, strength: 2 },
      },
      GLASS_CANNON: {
        equipment: ['iron_sword', 'cloth_pants'],
        stats: { strength: 5, health: -20 },
      },
      BRUISER: {
        equipment: ['steel_axe', 'leather_vest'],
        stats: { health: 30, strength: 2 },
      },
      NECROMANCER: {
        equipment: ['cursed_staff', 'mystic_robes'],
        stats: { manaRegen: 4, health: -10 },
      },
    },

    pathMechanics: {
      freedomMeter: {
        enabled: true,
        threshold: 1000,
        description: 'Accumulate 1000 gold to purchase your freedom',
        currentValue: 0,
      },
      ludusManagement: {
        enabled: false, // Unlocks after gaining freedom
        unlockCost: 5000,
        description: 'Build and manage your own gladiator school',
        maxGladiators: 10,
      },
    },

    objectives: [
      {
        id: 'survive_first_10',
        name: 'Survive 10 Arena Battles',
        description: 'Prove your worth by surviving your first 10 fights',
        reward: { gold: 200, xp: 500 },
      },
      {
        id: 'earn_freedom',
        name: 'Purchase Your Freedom',
        description: 'Accumulate 1000 gold to buy your liberty',
        reward: { gold: 0, xp: 1000, unlocks: ['free_fighter_phase'] },
      },
      {
        id: 'defeat_champion',
        name: 'Defeat the Arena Champion',
        description: 'Face the undefeated champion in mortal combat',
        reward: { gold: 500, xp: 2000, equipment: ['champions_blade'] },
      },
      {
        id: 'build_ludus',
        name: 'Establish Your Ludus',
        description: 'Purchase land and build your own gladiator school',
        reward: { gold: 0, xp: 3000, unlocks: ['ludus_management'] },
      },
    ],

    missionCount: 12,
    finalBoss: 'slave_champion',
  },

  roman_legionnaire: {
    id: 'roman_legionnaire',
    name: 'Roman Legionnaire',
    icon: '🛡️',
    description: "Rise through the ranks of Rome's military might",
    difficultyRating: 3,
    estimatedPlaytime: '10-12 hours',

    lore: `You are a soldier of Rome, sworn to defend the Empire against barbarian hordes and foreign 
invaders. Clad in the iconic lorica segmentata, you march beneath the eagle standard, part of the 
greatest military machine the world has ever known. Your legion is your family, your brothers-in-arms 
bound by oath and blood.

From the frozen forests of Germania to the scorching deserts of Aegyptus, Rome's enemies are legion. 
Each campaign is an opportunity to prove your valor, earn promotions, and carve your name into history. 
Rise from common legionnaire to centurion, commanding your own century. Expand Rome's borders, defend 
its territories, and crush those who would challenge its supremacy.

But warfare is not without cost. Friends fall, territories are lost, and the glory of Rome is written 
in the blood of its soldiers. Will you become a legend of the legions, or just another name on a 
memorial stone? For Rome!`,

    startingBonus: {
      gold: 150,
      equipment: ['iron_sword', 'chainmail', 'iron_helmet'],
      stats: {
        health: 50,
        strength: 0,
        defense: 5,
      },
    },

    classModifications: {
      WARRIOR: {
        equipment: ['iron_sword', 'chainmail', 'iron_helmet', 'legion_shield'],
        stats: { strength: 3, defense: 5, health: 50 },
      },
      TANK: {
        equipment: ['iron_sword', 'steel_plate', 'battle_helm', 'legion_shield'],
        stats: { health: 80, defense: 10 },
      },
      PALADIN: {
        equipment: ['blessed_sword', 'chainmail', 'iron_helmet'],
        stats: { health: 60, defense: 7, manaRegen: 2 },
      },
      BALANCED: {
        equipment: ['iron_sword', 'chainmail', 'iron_helmet', 'bronze_ring'],
        stats: { health: 50, strength: 2, defense: 5 },
      },
      MAGE: {
        equipment: ['legion_staff', 'mystic_robes', 'crown_of_wisdom'],
        stats: { manaRegen: 5, health: 20, defense: 3 },
      },
      BERSERKER: {
        equipment: ['steel_axe', 'chainmail', 'iron_helmet'],
        stats: { strength: 4, health: 40, defense: 3 },
      },
      BRAWLER: {
        equipment: ['iron_gauntlets', 'chainmail', 'power_bracers'],
        stats: { strength: 3, health: 60, defense: 5 },
      },
      ASSASSIN: {
        equipment: ['legion_dagger', 'shadow_cloak', 'leather_vest'],
        stats: { strength: 2, critChance: 8, defense: 3 },
      },
      GLASS_CANNON: {
        equipment: ['flame_blade', 'leather_vest'],
        stats: { strength: 6, critChance: 10, health: 20 },
      },
      BRUISER: {
        equipment: ['steel_axe', 'chainmail', 'iron_gauntlets'],
        stats: { strength: 3, health: 70, defense: 5 },
      },
      NECROMANCER: {
        equipment: ['cursed_staff', 'mystic_robes'],
        stats: { manaRegen: 5, health: 20, defense: 2 },
      },
    },

    pathMechanics: {
      rankSystem: {
        enabled: true,
        currentRank: 'legionnaire',
        ranks: [
          { id: 'legionnaire', name: 'Legionnaire', bonus: {} },
          { id: 'optio', name: 'Optio', bonus: { gold: 50, strength: 2 } },
          { id: 'tesserarius', name: 'Tesserarius', bonus: { gold: 100, defense: 3 } },
          { id: 'signifer', name: 'Signifer', bonus: { gold: 150, health: 50 } },
          { id: 'centurion', name: 'Centurion', bonus: { gold: 200, strength: 5, defense: 5 } },
          {
            id: 'primus_pilus',
            name: 'Primus Pilus',
            bonus: { gold: 500, strength: 10, defense: 10, health: 100 },
          },
        ],
      },
      territoryConquest: {
        enabled: true,
        controlledTerritories: ['italia'],
        availableTerritories: ['gallia', 'germania', 'britannia', 'hispania', 'aegyptus', 'syria'],
        description: "Expand Rome's borders through military campaigns",
      },
      legionCompanions: {
        enabled: true,
        maxCompanions: 3,
        companions: [],
        description: 'Recruit loyal soldiers to fight alongside you',
      },
    },

    objectives: [
      {
        id: 'complete_training',
        name: 'Complete Legion Training',
        description: 'Prove yourself worthy of the eagle standard',
        reward: { gold: 100, xp: 300 },
      },
      {
        id: 'first_campaign',
        name: 'Your First Campaign',
        description: "Participate in a military campaign beyond Rome's borders",
        reward: { gold: 200, xp: 500 },
      },
      {
        id: 'earn_promotion',
        name: 'Rise to Centurion',
        description: 'Command your own century of 80 men',
        reward: { gold: 500, xp: 2000, unlocks: ['centurion_authority'] },
      },
      {
        id: 'conquer_territories',
        name: 'Conquer Three Territories',
        description: "Expand Rome's dominion across three new regions",
        reward: { gold: 1000, xp: 3000 },
      },
      {
        id: 'defend_rome',
        name: 'Defend the Empire',
        description: 'Repel a massive invasion threatening Rome itself',
        reward: { gold: 2000, xp: 5000, equipment: ['legion_of_honor'] },
      },
    ],

    missionCount: 15,
    finalBoss: 'barbarian_warlord',
  },

  lanista: {
    id: 'lanista',
    name: 'Lanista (Ludus Owner)',
    icon: '🏛️',
    description: 'Build an empire through gladiator management',
    difficultyRating: 4,
    estimatedPlaytime: '12-15 hours',

    lore: `Born into wealth or risen through cunning, you are a lanista—a master of gladiators and owner 
of a ludus. While others fight for glory, you profit from their blood. Your gladiators are your assets, 
carefully trained and equipped to survive the arena and earn you gold. Each victory brings profit; each 
death, a costly loss.

The arena is your stage, and you are the puppetmaster. Scout new talent from slave markets, invest in 
training and equipment, and send your champions to fight in spectacles that captivate Rome. Build your 
reputation among the elite, attract wealthy patrons, and expand your ludus into an empire of combat.

But competition is fierce. Rival lanistae seek to poach your best fighters, and maintaining a stable of 
champions is expensive. Balancing profit and investment, reputation and ruthlessness—this is the path of 
the lanista. Will you become the wealthiest ludus owner in Rome, or will bankruptcy and ruin be your fate?`,

    startingBonus: {
      gold: 500,
      equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring'],
      stats: {
        health: 0,
        strength: 0,
        defense: 0,
      },
    },

    classModifications: {
      WARRIOR: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'iron_sword'],
        stats: { strength: 2, gold: 100 },
      },
      TANK: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'steel_plate'],
        stats: { defense: 5, gold: 100 },
      },
      BALANCED: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'iron_sword'],
        stats: { strength: 1, defense: 2, gold: 150 },
      },
      MAGE: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'arcane_staff'],
        stats: { manaRegen: 3, gold: 100 },
      },
      PALADIN: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'blessed_sword'],
        stats: { health: 30, gold: 100 },
      },
      ASSASSIN: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'shadow_dagger'],
        stats: { critChance: 5, gold: 150 },
      },
      BERSERKER: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'steel_axe'],
        stats: { strength: 3, gold: 100 },
      },
      BRAWLER: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'iron_gauntlets'],
        stats: { strength: 2, health: 30, gold: 100 },
      },
      GLASS_CANNON: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'flame_blade'],
        stats: { strength: 4, gold: 150 },
      },
      BRUISER: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'steel_axe'],
        stats: { strength: 2, health: 40, gold: 100 },
      },
      NECROMANCER: {
        equipment: ['masters_whip', 'luxurious_toga', 'ludus_seal_ring', 'cursed_staff'],
        stats: { manaRegen: 4, gold: 100 },
      },
    },

    pathMechanics: {
      gladiatorRecruitment: {
        enabled: true,
        maxGladiators: 10,
        recruitmentCost: { min: 500, max: 2000 },
        description: 'Purchase and train gladiators for arena combat',
      },
      trainingSystem: {
        enabled: true,
        trainingCosts: {
          basic: 100,
          intermediate: 300,
          advanced: 500,
        },
        description: 'Invest gold to improve gladiator stats and skills',
      },
      arenaProfit: {
        enabled: true,
        profitRange: { min: 50, max: 500 },
        matchFrequency: 'daily',
        description: 'Send gladiators to fight and earn gold based on performance',
      },
      reputation: {
        current: 0,
        max: 1000,
        benefits: [
          { threshold: 250, bonus: 'Recruit cost -10%' },
          { threshold: 500, bonus: 'Match profit +20%' },
          { threshold: 750, bonus: 'Unlock elite recruits' },
          { threshold: 1000, bonus: 'Imperial patronage' },
        ],
      },
    },

    objectives: [
      {
        id: 'recruit_first_five',
        name: 'Build Your Roster',
        description: 'Recruit your first 5 gladiators',
        reward: { gold: 300, xp: 500 },
      },
      {
        id: 'win_ten_matches',
        name: 'Profitable Ventures',
        description: 'Win 10 arena matches with your gladiators',
        reward: { gold: 500, xp: 1000 },
      },
      {
        id: 'train_champion',
        name: 'Forge a Champion',
        description: 'Train a gladiator to level 10 or higher',
        reward: { gold: 1000, xp: 2000 },
      },
      {
        id: 'high_reputation',
        name: 'Master Lanista',
        description: "Reach 750 reputation among Rome's elite",
        reward: { gold: 2000, xp: 3000, unlocks: ['elite_recruits'] },
      },
      {
        id: 'empire_of_champions',
        name: 'Empire of Champions',
        description: 'Maintain a full roster of 10 gladiators, all level 8+',
        reward: { gold: 5000, xp: 5000, equipment: ['golden_laurel'] },
      },
    ],

    missionCount: 14,
    finalBoss: 'rival_lanista',
  },

  barbarian_traveller: {
    id: 'barbarian_traveller',
    name: 'Barbarian Traveller',
    icon: '🪓',
    description: 'Explore tribal lands and forge alliances',
    difficultyRating: 3,
    estimatedPlaytime: '10-12 hours',

    lore: `You are a wanderer from beyond Rome's borders—a barbarian in their eyes, but a free soul in 
truth. Born among the tribes of the north, you have rejected the settled life for the open road. The 
world is vast, and you intend to see it all. From Celtic strongholds to Germanic forests, from Gallic 
villages to Pictish highlands, you roam freely.

Each tribe has its own customs, warriors, and treasures. Some welcome travelers; others see only threats. 
Through combat, trade, and diplomacy, you must navigate this web of alliances and rivalries. Earn the 
trust of tribal chiefs, trade exotic goods, and discover hidden locations forgotten by civilization.

But the wilderness is dangerous. Bandits, wild beasts, and rival travelers threaten your journey. Roman 
patrols view you with suspicion, and tribal feuds can turn deadly. Will you unite the tribes against Rome, 
or forge your own legend as a nomadic warrior without allegiance? The choice is yours, wanderer.`,

    startingBonus: {
      gold: 200,
      equipment: ['celtic_longsword', 'bear_pelt_cloak', 'tribal_war_paint'],
      stats: {
        health: 30,
        strength: 3,
        defense: 0,
      },
    },

    classModifications: {
      WARRIOR: {
        equipment: ['celtic_longsword', 'bear_pelt_cloak', 'tribal_war_paint', 'leather_vest'],
        stats: { strength: 5, health: 40 },
      },
      BERSERKER: {
        equipment: ['great_axe', 'bear_pelt_cloak', 'tribal_war_paint'],
        stats: { strength: 6, health: 50, critDamage: 20 },
      },
      BRAWLER: {
        equipment: ['iron_gauntlets', 'bear_pelt_cloak', 'tribal_war_paint'],
        stats: { strength: 4, health: 60 },
      },
      ASSASSIN: {
        equipment: ['tribal_dagger', 'shadow_cloak', 'tribal_war_paint'],
        stats: { strength: 3, critChance: 10 },
      },
      BALANCED: {
        equipment: ['celtic_longsword', 'bear_pelt_cloak', 'tribal_war_paint', 'bronze_ring'],
        stats: { strength: 3, health: 40 },
      },
      TANK: {
        equipment: ['celtic_longsword', 'bear_pelt_cloak', 'tribal_war_paint', 'wooden_shield'],
        stats: { health: 70, defense: 8 },
      },
      PALADIN: {
        equipment: ['blessed_sword', 'bear_pelt_cloak', 'tribal_war_paint'],
        stats: { strength: 3, health: 50, manaRegen: 2 },
      },
      MAGE: {
        equipment: ['druidic_staff', 'mystic_robes', 'tribal_war_paint'],
        stats: { manaRegen: 5, health: 20 },
      },
      GLASS_CANNON: {
        equipment: ['flame_blade', 'tribal_war_paint'],
        stats: { strength: 7, critChance: 15 },
      },
      BRUISER: {
        equipment: ['great_axe', 'bear_pelt_cloak', 'tribal_war_paint'],
        stats: { strength: 4, health: 60 },
      },
      NECROMANCER: {
        equipment: ['cursed_staff', 'mystic_robes', 'tribal_war_paint'],
        stats: { manaRegen: 5, health: 20 },
      },
    },

    pathMechanics: {
      explorationSystem: {
        enabled: true,
        discoveredLocations: ['starting_camp'],
        totalLocations: 20,
        randomEvents: true,
        description: 'Discover hidden locations and encounter random events',
      },
      tribalReputation: {
        enabled: true,
        tribes: [
          { id: 'celtic_clans', name: 'Celtic Clans', reputation: 0 },
          { id: 'germanic_tribes', name: 'Germanic Tribes', reputation: 0 },
          { id: 'gallic_warriors', name: 'Gallic Warriors', reputation: 0 },
          { id: 'pictish_raiders', name: 'Pictish Raiders', reputation: 0 },
          { id: 'nomadic_horsemen', name: 'Nomadic Horsemen', reputation: 0 },
        ],
        reputationRange: { min: -100, max: 100 },
      },
      nomadicTrading: {
        enabled: true,
        barterSystem: true,
        exchangeRates: {}, // Varies by tribe
        description: 'Trade goods with tribes using barter system',
      },
    },

    objectives: [
      {
        id: 'discover_ten_locations',
        name: 'Seasoned Explorer',
        description: 'Discover 10 hidden locations',
        reward: { gold: 300, xp: 800 },
      },
      {
        id: 'positive_reputation',
        name: 'Friend of the Tribes',
        description: 'Reach positive reputation with 3 tribes',
        reward: { gold: 500, xp: 1500 },
      },
      {
        id: 'master_trader',
        name: 'Master Trader',
        description: 'Complete 20 successful barter trades',
        reward: { gold: 800, xp: 2000 },
      },
      {
        id: 'unite_tribes',
        name: 'Tribal Alliance',
        description: 'Achieve maximum reputation with all 5 tribes',
        reward: { gold: 2000, xp: 4000, unlocks: ['tribal_coalition'] },
      },
      {
        id: 'legendary_wanderer',
        name: 'Legendary Wanderer',
        description: 'Discover all 20 locations and complete the exploration',
        reward: { gold: 3000, xp: 5000, equipment: ['wanderers_legacy'] },
      },
    ],

    missionCount: 13,
    finalBoss: 'tribal_warlord',
  },

  desert_nomad: {
    id: 'desert_nomad',
    name: 'Desert Nomad',
    icon: '🏜️',
    description: 'Master the sands and protect desert caravans',
    difficultyRating: 4,
    estimatedPlaytime: '11-14 hours',

    lore: `The desert is your home—a vast expanse of golden sand, scorching sun, and hidden oases. Born 
among the nomadic tribes of the southern wastes, you have learned to survive where others perish. Water 
is more precious than gold, and the dunes hold secrets known only to those who listen.

As a nomad, you serve as guide, warrior, and protector. Merchant caravans pay handsomely for safe passage 
through bandit-infested territories. Oases scattered across the desert provide respite, but they must be 
discovered and protected. The desert's unique treasures—scimitars forged in ancient forges, silk armor 
lighter than air, jeweled weapons of legendary craftsmanship—are yours to claim.

But danger lurks beneath the sands. Sandstorms can bury entire caravans, bandits strike from hidden camps, 
and the desert itself is a merciless foe. Navigate the dunes, defend the caravans, and unlock the exotic 
riches of the southern wastes. Will you become a legend of the sands, or another skeleton bleached by the 
unforgiving sun?`,

    startingBonus: {
      gold: 250,
      equipment: ['scimitar', 'desert_silk_armor', 'nomad_headwrap'],
      stats: {
        health: 20,
        strength: 2,
        defense: 3,
      },
    },

    classModifications: {
      WARRIOR: {
        equipment: ['scimitar', 'desert_silk_armor', 'nomad_headwrap', 'sand_shield'],
        stats: { strength: 4, defense: 5, health: 30 },
      },
      ASSASSIN: {
        equipment: ['jeweled_dagger', 'desert_silk_armor', 'nomad_headwrap'],
        stats: { strength: 3, critChance: 12, defense: 3 },
      },
      BALANCED: {
        equipment: ['scimitar', 'desert_silk_armor', 'nomad_headwrap', 'bronze_ring'],
        stats: { strength: 3, defense: 4, health: 30 },
      },
      MAGE: {
        equipment: ['desert_staff', 'mystic_robes', 'nomad_headwrap'],
        stats: { manaRegen: 6, defense: 2, health: 20 },
      },
      TANK: {
        equipment: ['scimitar', 'heavy_silk_armor', 'nomad_headwrap', 'sand_shield'],
        stats: { health: 70, defense: 10 },
      },
      BERSERKER: {
        equipment: ['curved_axe', 'desert_silk_armor', 'nomad_headwrap'],
        stats: { strength: 5, health: 40, critDamage: 15 },
      },
      BRAWLER: {
        equipment: ['spiked_gauntlets', 'desert_silk_armor', 'nomad_headwrap'],
        stats: { strength: 4, health: 50, defense: 4 },
      },
      GLASS_CANNON: {
        equipment: ['flame_scimitar', 'desert_silk_armor'],
        stats: { strength: 6, critChance: 15, health: 20 },
      },
      PALADIN: {
        equipment: ['blessed_scimitar', 'desert_silk_armor', 'nomad_headwrap'],
        stats: { strength: 3, health: 50, defense: 5, manaRegen: 2 },
      },
      BRUISER: {
        equipment: ['curved_axe', 'desert_silk_armor', 'nomad_headwrap'],
        stats: { strength: 4, health: 60, defense: 4 },
      },
      NECROMANCER: {
        equipment: ['sand_cursed_staff', 'mystic_robes', 'nomad_headwrap'],
        stats: { manaRegen: 6, health: 20, defense: 2 },
      },
    },

    pathMechanics: {
      oasisNavigation: {
        enabled: true,
        waterMax: 100,
        waterCurrent: 100,
        depletionRate: 5, // Per travel action
        oasesDiscovered: ['starting_oasis'],
        totalOases: 15,
        description: 'Manage water resources and discover oases',
      },
      caravanDefense: {
        enabled: true,
        activeCaravans: [],
        completedDefenses: 0,
        rewardMultiplier: 1.0,
        description: 'Protect merchant caravans for rewards',
      },
      exoticEquipment: {
        enabled: true,
        unlockedItems: [],
        exclusiveShop: true,
        description: 'Access to desert-exclusive weapons and armor',
      },
      desertHazards: {
        enabled: true,
        sandstormChance: 0.15,
        banditEncounterChance: 0.25,
        description: 'Navigate sandstorms and bandit ambushes',
      },
    },

    objectives: [
      {
        id: 'discover_five_oases',
        name: 'Desert Navigator',
        description: 'Discover 5 oases across the desert',
        reward: { gold: 400, xp: 1000 },
      },
      {
        id: 'defend_ten_caravans',
        name: 'Caravan Protector',
        description: 'Successfully defend 10 merchant caravans',
        reward: { gold: 800, xp: 2000 },
      },
      {
        id: 'unlock_exotic_shop',
        name: 'Desert Merchant',
        description: 'Unlock the exotic equipment shop',
        reward: { gold: 500, xp: 1500, unlocks: ['exotic_shop'] },
      },
      {
        id: 'survive_sandstorms',
        name: 'Storm Survivor',
        description: 'Survive 5 sandstorm encounters',
        reward: { gold: 600, xp: 1800 },
      },
      {
        id: 'master_of_sands',
        name: 'Master of the Sands',
        description: 'Discover all 15 oases and complete 25 caravan defenses',
        reward: { gold: 3500, xp: 5000, equipment: ['desert_legend_blade'] },
      },
    ],

    missionCount: 14,
    finalBoss: 'desert_bandit_king',
  },
};

/**
 * Get story path by ID
 * @param {string} pathId - Path identifier
 * @returns {Object|null} Path data or null if not found
 */
export function getPathById(pathId) {
  return STORY_PATHS[pathId] || null;
}

/**
 * Get all available story paths
 * @returns {Array} Array of all path objects
 */
export function getAllPaths() {
  return Object.values(STORY_PATHS);
}

/**
 * Get starting bonus for a specific path and combat class
 * @param {string} pathId - Path identifier
 * @param {string} combatClass - Combat class (WARRIOR, MAGE, etc.)
 * @returns {Object} Starting bonus with equipment and stats
 */
export function getPathStartingBonus(pathId, combatClass) {
  const path = getPathById(pathId);
  if (!path) return null;

  const baseBonus = path.startingBonus;
  const classModification = path.classModifications[combatClass] || {};

  // Merge base bonus with class-specific modifications
  return {
    gold: baseBonus.gold,
    equipment: classModification.equipment || baseBonus.equipment,
    stats: {
      ...baseBonus.stats,
      ...(classModification.stats || {}),
    },
  };
}

/**
 * Get available starting equipment for path and class
 * @param {string} pathId - Path identifier
 * @param {string} combatClass - Combat class
 * @returns {Array} Array of equipment IDs
 */
export function getAvailableStartingEquipment(pathId, combatClass) {
  const bonus = getPathStartingBonus(pathId, combatClass);
  return bonus ? bonus.equipment : [];
}

/**
 * Get path mechanics configuration
 * @param {string} pathId - Path identifier
 * @returns {Object|null} Path mechanics object
 */
export function getPathMechanics(pathId) {
  const path = getPathById(pathId);
  return path ? path.pathMechanics : null;
}

/**
 * Get path objectives
 * @param {string} pathId - Path identifier
 * @returns {Array} Array of objective objects
 */
export function getPathObjectives(pathId) {
  const path = getPathById(pathId);
  return path ? path.objectives : [];
}

/**
 * Validate if a combat class is suitable for a path
 * All classes are allowed, but some have better synergy
 * @param {string} pathId - Path identifier
 * @param {string} combatClass - Combat class
 * @returns {Object} { suitable: boolean, reason: string }
 */
export function validateClassForPath(pathId, combatClass) {
  const path = getPathById(pathId);
  if (!path) {
    return { suitable: false, reason: 'Invalid path' };
  }

  // All classes are allowed, but check if class has specific modifications
  const hasModification = path.classModifications[combatClass] !== undefined;

  return {
    suitable: true,
    hasSpecialBonus: hasModification,
    reason: hasModification
      ? `${combatClass} has specialized equipment for this path`
      : `${combatClass} can follow this path with standard equipment`,
  };
}
