/**
 * Web Components Entry Point
 * Import all components to register them
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

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
export { CampaignMap } from './CampaignMap.js'; // v4.0 - Story Mode
export { MissionBriefing } from './MissionBriefing.js'; // v4.0 - Story Mode
export { MarketplaceScreen } from './MarketplaceScreen.js'; // v4.0 - Marketplace
export { NavigationBar } from './NavigationBar.js'; // v4.0 - Refactor
export { SoundToggle } from './SoundToggle.js'; // v4.0 - Refactor
export { AppLayout } from './AppLayout.js'; // v4.0 - Refactor
export { SaveManagementScreen } from './SaveManagementScreen.js'; // v4.1 - Save System
export { ComboHint } from './ComboHint.js'; // v4.2 - Combo System
export { PerformanceMonitorUI } from './PerformanceMonitorUI.js'; // v4.6 - Performance
export { GridCombatUI } from './GridCombatUI.js'; // v4.7 - Grid Combat
export { TalentTreeScreen } from './TalentTreeScreen.js'; // v4.11 - Talent System

// Auto-register all components by importing this file
ConsoleLogger.info(LogCategory.UI, '✅ All Web Components registered');
