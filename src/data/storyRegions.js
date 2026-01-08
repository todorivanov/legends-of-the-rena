/**
 * Story Regions Database
 * Defines all story regions with unlock conditions and visual information
 */

export const STORY_REGIONS = {
  tutorial: {
    id: 'tutorial',
    name: 'Tutorial Arena',
    description: 'Where all champions begin their journey.',
    icon: '🎯',
    unlocked: true, // Always unlocked
    missions: ['tutorial_1', 'tutorial_2'],
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  },

  novice: {
    id: 'novice',
    name: 'Novice Grounds',
    description: 'Prove yourself against bandits threatening the realm.',
    icon: '⚔️',
    unlocked: false,
    unlockedBy: 'tutorial_2', // Mission that unlocks this region
    missions: ['novice_1', 'novice_2', 'novice_3'],
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
  },

  forest: {
    id: 'forest',
    name: 'Forest of Trials',
    description: 'Ancient magic flows through these woods. Only the worthy may pass.',
    icon: '🌲',
    unlocked: false,
    unlockedBy: 'novice_3',
    missions: ['forest_1', 'forest_2', 'forest_3'],
    background: 'linear-gradient(135deg, #1b5e20 0%, #004d40 100%)',
  },

  mountain: {
    id: 'mountain',
    name: 'Mountain Pass',
    description: 'Treacherous peaks where warriors test their mettle against the elements.',
    icon: '⛰️',
    unlocked: false,
    unlockedBy: 'novice_3',
    missions: ['mountain_1', 'mountain_2', 'mountain_3'],
    background: 'linear-gradient(135deg, #263238 0%, #455a64 100%)',
  },

  shadow: {
    id: 'shadow',
    name: 'Shadow Realm',
    description: 'A dimension of darkness where nightmares dwell. Extreme danger.',
    icon: '🌑',
    unlocked: false,
    unlockedBy: ['forest_3', 'mountain_3'], // Requires either forest OR mountain boss
    missions: ['shadow_1', 'shadow_2', 'shadow_boss'],
    background: 'linear-gradient(135deg, #1a0d2e 0%, #0a0612 100%)',
  },

  champions: {
    id: 'champions',
    name: "Champions' Valley",
    description: 'The final proving ground. Face legendary heroes and the Arena Master himself.',
    icon: '👑',
    unlocked: false,
    unlockedBy: 'shadow_boss',
    missions: ['champions_1', 'champions_2', 'champions_final'],
    background: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
  },
};

/**
 * Get region by ID
 */
export function getRegionById(id) {
  return STORY_REGIONS[id] || null;
}

/**
 * Get all regions in progression order
 */
export function getRegionsInOrder() {
  return [
    'tutorial',
    'novice',
    'forest', // Parallel path 1
    'mountain', // Parallel path 2
    'shadow',
    'champions',
  ];
}

/**
 * Check if region is unlocked based on story progress
 */
export function isRegionUnlocked(regionId, storyProgress) {
  const region = STORY_REGIONS[regionId];
  if (!region) return false;
  
  // Tutorial always unlocked
  if (region.unlocked) return true;
  
  // Check if unlocking mission(s) completed
  const unlockedBy = Array.isArray(region.unlockedBy) ? region.unlockedBy : [region.unlockedBy];
  
  return unlockedBy.some(missionId => 
    storyProgress.completedMissions.includes(missionId)
  );
}

/**
 * Get unlocked regions based on story progress
 */
export function getUnlockedRegions(storyProgress) {
  return Object.keys(STORY_REGIONS).filter(regionId => 
    isRegionUnlocked(regionId, storyProgress)
  );
}

/**
 * Get region completion percentage
 */
export function getRegionCompletion(regionId, storyProgress) {
  const region = STORY_REGIONS[regionId];
  if (!region) return 0;
  
  const totalMissions = region.missions.length;
  const completedMissions = region.missions.filter(missionId => 
    storyProgress.completedMissions.includes(missionId)
  ).length;
  
  return Math.floor((completedMissions / totalMissions) * 100);
}

/**
 * Check if region is completed
 */
export function isRegionCompleted(regionId, storyProgress) {
  return getRegionCompletion(regionId, storyProgress) === 100;
}
