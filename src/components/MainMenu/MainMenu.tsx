import { Button, Card, Space, Typography } from 'antd';
import { PlayCircleOutlined, SettingOutlined, TrophyOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface MainMenuProps {
  onStartGame: () => void;
  onShowSettings?: () => void;
  onShowLeaderboard?: () => void;
  onShowHelp?: () => void;
}

export const MainMenu = ({ 
  onStartGame, 
  onShowSettings,
  onShowLeaderboard,
  onShowHelp 
}: MainMenuProps) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100%' 
    }}>
      <Card 
        style={{ 
          width: 400, 
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1}>ObjectFighterJS</Title>
          <Paragraph type="secondary">
            Choose your fighter and battle!
          </Paragraph>
          
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<PlayCircleOutlined />}
              onClick={onStartGame}
              block
            >
              Start Game
            </Button>
            
            {onShowSettings && (
              <Button 
                size="large" 
                icon={<SettingOutlined />}
                onClick={onShowSettings}
                block
              >
                Settings
              </Button>
            )}
            
            {onShowLeaderboard && (
              <Button 
                size="large" 
                icon={<TrophyOutlined />}
                onClick={onShowLeaderboard}
                block
              >
                Leaderboard
              </Button>
            )}
            
            {onShowHelp && (
              <Button 
                size="large" 
                icon={<QuestionCircleOutlined />}
                onClick={onShowHelp}
                block
              >
                How to Play
              </Button>
            )}
          </Space>
        </Space>
      </Card>
    </div>
  );
};
