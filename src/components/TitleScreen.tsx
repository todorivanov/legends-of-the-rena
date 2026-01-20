import React, { useState } from 'react';
import { Button, Card, Typography, Modal } from 'antd';
import { 
  PlayCircleOutlined, 
  UserOutlined, 
  TrophyOutlined, 
  BookOutlined,
  SettingOutlined,
  ShopOutlined,
  StarOutlined 
} from '@ant-design/icons';
import { useGame } from '../hooks/useGame';
import DifficultySelector from './Settings/DifficultySelector';
import type { GameScreen } from '../types/game';
import './TitleScreen.scss';

const { Title, Paragraph } = Typography;

export const TitleScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);
  
  const navigateTo = (screen: GameScreen) => {
    dispatch({ type: 'CHANGE_SCREEN', payload: screen });
  };

  const hasCharacter = state.player.name !== '';

  return (
    <div className="title-screen">
      <div className="title-screen__background">
        <div className="title-screen__overlay" />
      </div>
      
      <div className="title-screen__content">
        <Card className="title-screen__card" bordered={false}>
          <div className="title-screen__header">
            <Title level={1} className="title-screen__title">
              ⚔️ Legends of the Arena
            </Title>
            <Paragraph className="title-screen__subtitle">
              Enter the arena and prove your worth
            </Paragraph>
          </div>

          <div className="title-screen__menu">
            {!hasCharacter ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => navigateTo('character-creation')}
                  block
                  className="title-screen__button"
                >
                  New Game
                </Button>
                
                <Button
                  size="large"
                  disabled
                  block
                  className="title-screen__button"
                >
                  Continue (No Save)
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => navigateTo('combat')}
                  block
                  className="title-screen__button"
                >
                  Continue - {state.player.name}
                </Button>
                
                <Button
                  size="large"
                  icon={<UserOutlined />}
                  onClick={() => navigateTo('profile')}
                  block
                  className="title-screen__button"
                >
                  Character Profile
                </Button>
                
                <Button
                  size="large"
                  icon={<BookOutlined />}
                  onClick={() => navigateTo('story')}
                  block
                  className="title-screen__button"
                >
                  Story Mode
                </Button>
                
                <Button
                  size="large"
                  icon={<TrophyOutlined />}
                  onClick={() => navigateTo('tournament')}
                  block
                  className="title-screen__button"
                >
                  Tournament
                </Button>
                
                <Button
                  size="large"
                  icon={<ShopOutlined />}
                  onClick={() => navigateTo('marketplace')}
                  block
                  className="title-screen__button"
                >
                  Marketplace
                </Button>
                
                <Button
                  size="large"
                  icon={<StarOutlined />}
                  onClick={() => navigateTo('achievements')}
                  block
                  className="title-screen__button"
                >
                  Achievements
                </Button>
              </>
            )}
            
            <Button
              size="large"
              icon={<SettingOutlined />}
              onClick={() => setDifficultyModalVisible(true)}
              block
              className="title-screen__button title-screen__button--secondary"
            >
              Difficulty Settings
            </Button>
          </div>

          {hasCharacter && (
            <div className="title-screen__stats">
              <div className="title-screen__stat">
                <span className="title-screen__stat-label">Level</span>
                <span className="title-screen__stat-value">{state.player.level}</span>
              </div>
              <div className="title-screen__stat">
                <span className="title-screen__stat-label">Gold</span>
                <span className="title-screen__stat-value">💰 {state.player.gold}</span>
              </div>
              <div className="title-screen__stat">
                <span className="title-screen__stat-label">Victories</span>
                <span className="title-screen__stat-value">{state.stats.totalWins}</span>
              </div>
              <div className="title-screen__stat">
                <span className="title-screen__stat-label">Difficulty</span>
                <span className="title-screen__stat-value">{state.settings.difficulty.toUpperCase()}</span>
              </div>
            </div>
          )}
        </Card>

        <div className="title-screen__footer">
          <Paragraph className="title-screen__version">
            Version 1.0.0 | Built with React + TypeScript
          </Paragraph>
        </div>
      </div>

      <Modal
        title="Difficulty Settings"
        open={difficultyModalVisible}
        onCancel={() => setDifficultyModalVisible(false)}
        footer={null}
        width={1200}
        centered
      >
        <DifficultySelector onSelect={() => setDifficultyModalVisible(false)} />
      </Modal>
    </div>
  );
};
