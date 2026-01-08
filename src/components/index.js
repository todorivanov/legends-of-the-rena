/**
 * Web Components Entry Point
 * Import all components to register them
 */

export { BaseComponent } from './BaseComponent.js';
export { FighterCard } from './FighterCard.js';
export { ActionSelection } from './ActionSelection.js';
export { StatusEffectIcon } from './StatusEffectIcon.js';
export { TurnIndicator } from './TurnIndicator.js';
export { ComboIndicator } from './ComboIndicator.js';
export { FighterHUD } from './FighterHUD.js';
export { TitleScreen } from './TitleScreen.js';
export { FighterGallery } from './FighterGallery.js';
export { VictoryScreen } from './VictoryScreen.js';
export { CombatArena } from './CombatArena.js';
export { ProfileScreen } from './ProfileScreen.js'; // Phase 5
export { CharacterCreation } from './CharacterCreation.js'; // Phase 5
export { EquipmentScreen } from './EquipmentScreen.js'; // Phase 5 - Sprint 2
export { TournamentBracket } from './TournamentBracket.js'; // Phase 5 - Sprint 3
export { AchievementsScreen } from './AchievementsScreen.js'; // Phase 5 - Sprint 4
export { SettingsScreen } from './SettingsScreen.js';
export { WikiScreen } from './WikiScreen.js'; // Phase 5 - Sprint 4

// Auto-register all components by importing this file
console.log('✅ All Web Components registered');
