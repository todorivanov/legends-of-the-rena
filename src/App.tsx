import { ConfigProvider } from 'antd';
import { useGame } from './hooks/useGame';
import { TitleScreen } from './components/TitleScreen';
import { CharacterCreationScreen } from './components/CharacterCreation/CharacterCreationScreen';
import { ProfileScreen } from './components/Profile/ProfileScreen';
import { CombatScreen } from './components/Combat/CombatScreen';
import { EquipmentScreen } from './components/Equipment/EquipmentScreen';
import { MarketplaceScreen } from './components/Marketplace/MarketplaceScreen';
import { AchievementsScreen } from './components/Achievements/AchievementsScreen';
import { TournamentScreen } from './components/Tournament/TournamentScreen';
import TalentScreen from './components/Character/TalentScreen';
import StoryScreen from './components/Story/StoryScreen';
import './styles/global.scss';

function App() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'title':
        return <TitleScreen />;
      case 'character-creation':
        return <CharacterCreationScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'combat':
        return <CombatScreen />;
      case 'equipment':
        return <EquipmentScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'tournament':
        return <TournamentScreen />;
      case 'story':
        return <StoryScreen />;
      case 'talents':
        return <TalentScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      {renderScreen()}
    </ConfigProvider>
  );
}

export default App;
