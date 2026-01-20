import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Tag, Modal, Steps, Statistic, Space, Progress } from 'antd';
import { 
  ArrowLeftOutlined,
  TrophyOutlined,
  FireOutlined,
  CrownOutlined,
  StarOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import './TournamentScreen.scss';

const { Title, Text, Paragraph } = Typography;

interface TournamentTier {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  minLevel: number;
  rounds: number;
  entryFee: number;
  rewards: {
    gold: number;
    xp: number;
    items?: string[];
  };
}

const TOURNAMENT_TIERS: TournamentTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Tournament',
    description: 'A tournament for aspiring fighters. Face off against 3 opponents to prove your worth.',
    icon: <TrophyOutlined />,
    color: '#cd7f32',
    minLevel: 1,
    rounds: 3,
    entryFee: 50,
    rewards: {
      gold: 300,
      xp: 200,
    },
  },
  {
    id: 'silver',
    name: 'Silver Tournament',
    description: 'Test your skills against tougher opponents. 4 rounds of intense combat.',
    icon: <FireOutlined />,
    color: '#c0c0c0',
    minLevel: 5,
    rounds: 4,
    entryFee: 200,
    rewards: {
      gold: 1000,
      xp: 500,
    },
  },
  {
    id: 'gold',
    name: 'Gold Tournament',
    description: 'Elite fighters gather here. Survive 5 rounds to claim victory and prestigious rewards.',
    icon: <StarOutlined />,
    color: '#ffd700',
    minLevel: 10,
    rounds: 5,
    entryFee: 500,
    rewards: {
      gold: 3000,
      xp: 1500,
      items: ['Legendary Equipment Box'],
    },
  },
  {
    id: 'legendary',
    name: 'Legendary Championship',
    description: 'Only the strongest dare enter. 7 brutal rounds against the most fearsome opponents.',
    icon: <CrownOutlined />,
    color: '#e5e4e2',
    minLevel: 20,
    rounds: 7,
    entryFee: 1500,
    rewards: {
      gold: 10000,
      xp: 5000,
      items: ['Champion\'s Crown', 'Legendary Equipment Box x3'],
    },
  },
];

export const TournamentScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, stats } = state;
  const [selectedTournament, setSelectedTournament] = useState<TournamentTier | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
  };

  const canEnterTournament = (tournament: TournamentTier) => {
    return player.level >= tournament.minLevel && player.gold >= tournament.entryFee;
  };

  const handleSelectTournament = (tournament: TournamentTier) => {
    setSelectedTournament(tournament);
    setIsModalVisible(true);
  };

  const handleEnterTournament = () => {
    if (!selectedTournament) return;

    // Deduct entry fee
    dispatch({ type: 'SPEND_GOLD', payload: selectedTournament.entryFee });
    
    // Set tournament state
    dispatch({ 
      type: 'START_TOURNAMENT', 
      payload: {
        difficulty: 'MEDIUM', // Default difficulty based on tier
        opponents: Array(selectedTournament.rounds).fill('AI'), // Generate opponents
      }
    });

    setIsModalVisible(false);
    
    // Navigate to combat screen
    dispatch({ type: 'CHANGE_SCREEN', payload: 'combat' });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTournamentProgress = (_tournamentId: string) => {
    // In a full implementation, this would track progress from state
    // For now, return 0
    return 0;
  };

  const renderTournamentCard = (tournament: TournamentTier) => {
    const canEnter = canEnterTournament(tournament);
    const isLevelLocked = player.level < tournament.minLevel;
    const progress = getTournamentProgress(tournament.id);

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={tournament.id}>
        <Card
          className={`tournament-card ${!canEnter ? 'tournament-card--locked' : ''}`}
          hoverable={canEnter}
          onClick={() => canEnter && handleSelectTournament(tournament)}
        >
          <div className="tournament-card__header">
            <div className="tournament-card__icon" style={{ color: tournament.color }}>
              {tournament.icon}
            </div>
            <Tag color={tournament.color} className="tournament-card__tag">
              Level {tournament.minLevel}+
            </Tag>
          </div>

          <Title level={4} className="tournament-card__name">
            {tournament.name}
          </Title>

          <Paragraph className="tournament-card__description">
            {tournament.description}
          </Paragraph>

          <div className="tournament-card__details">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div className="tournament-card__stat">
                <ThunderboltOutlined /> <Text strong>{tournament.rounds}</Text> Rounds
              </div>
              <div className="tournament-card__stat">
                <TrophyOutlined /> <Text strong>{tournament.rewards.gold}</Text> Gold
              </div>
              <div className="tournament-card__stat">
                <StarOutlined /> <Text strong>{tournament.rewards.xp}</Text> XP
              </div>
            </Space>
          </div>

          {progress > 0 && (
            <div className="tournament-card__progress">
              <Text type="secondary" style={{ fontSize: 12 }}>
                Best: Round {progress}/{tournament.rounds}
              </Text>
              <Progress 
                percent={(progress / tournament.rounds) * 100}
                size="small"
                showInfo={false}
                strokeColor={tournament.color}
              />
            </div>
          )}

          <div className="tournament-card__footer">
            {isLevelLocked ? (
              <Button block disabled>
                Requires Level {tournament.minLevel}
              </Button>
            ) : player.gold < tournament.entryFee ? (
              <Button block disabled>
                Need {tournament.entryFee - player.gold} More Gold
              </Button>
            ) : (
              <Button 
                type="primary" 
                block
                style={{ backgroundColor: tournament.color, borderColor: tournament.color }}
              >
                Enter ({tournament.entryFee} Gold)
              </Button>
            )}
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div className="tournament-screen">
      <div className="tournament-screen__header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="tournament-screen__back"
        >
          Back to Menu
        </Button>
        <div className="tournament-screen__title-area">
          <Title level={2} className="tournament-screen__title">
            <TrophyOutlined /> Tournament Arena
          </Title>
          <Text className="tournament-screen__subtitle">
            Prove your worth in structured combat challenges
          </Text>
        </div>
      </div>

      <div className="tournament-screen__content">
        {/* Player Stats Summary */}
        <Card className="tournament-stats">
          <Row gutter={[24, 16]}>
            <Col xs={12} sm={6}>
              <Statistic 
                title="Your Level"
                value={player.level}
                prefix={<StarOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic 
                title="Available Gold"
                value={player.gold}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic 
                title="Tournaments Won"
                value={stats.tournamentsWon || 0}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic 
                title="Win Rate"
                value={stats.totalFightsPlayed > 0 ? Math.round((stats.totalWins / stats.totalFightsPlayed) * 100) : 0}
                suffix="%"
                valueStyle={{ color: stats.totalWins > stats.totalLosses ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Tournaments Grid */}
        <Row gutter={[16, 16]}>
          {TOURNAMENT_TIERS.map(renderTournamentCard)}
        </Row>
      </div>

      {/* Tournament Details Modal */}
      <Modal
        title={
          <Space>
            <span style={{ color: selectedTournament?.color }}>
              {selectedTournament?.icon}
            </span>
            {selectedTournament?.name}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="enter" 
            type="primary" 
            onClick={handleEnterTournament}
            style={{ 
              backgroundColor: selectedTournament?.color, 
              borderColor: selectedTournament?.color 
            }}
          >
            Enter Tournament ({selectedTournament?.entryFee} Gold)
          </Button>,
        ]}
        width={600}
      >
        {selectedTournament && (
          <div className="tournament-modal">
            <Paragraph>{selectedTournament.description}</Paragraph>

            <Card title="Tournament Format" size="small" style={{ marginBottom: 16 }}>
              <Steps
                direction="vertical"
                size="small"
                current={-1}
                items={Array.from({ length: selectedTournament.rounds }, (_, i) => ({
                  title: `Round ${i + 1}`,
                  description: i === selectedTournament.rounds - 1 
                    ? 'Final Round - Defeat the Champion!' 
                    : `Face opponent ${i + 1}`,
                  icon: i === selectedTournament.rounds - 1 ? <CrownOutlined /> : <ThunderboltOutlined />,
                }))}
              />
            </Card>

            <Card title="Victory Rewards" size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Gold:</Text> <Text type="warning">{selectedTournament.rewards.gold}</Text>
                </div>
                <div>
                  <Text strong>Experience:</Text> <Text type="success">{selectedTournament.rewards.xp} XP</Text>
                </div>
                {selectedTournament.rewards.items && selectedTournament.rewards.items.length > 0 && (
                  <div>
                    <Text strong>Bonus Items:</Text>
                    <ul style={{ marginTop: 8, marginBottom: 0 }}>
                      {selectedTournament.rewards.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Space>
            </Card>

            <Card title="Tournament Rules" size="small">
              <ul style={{ marginBottom: 0 }}>
                <li>Each round must be won to proceed</li>
                <li>Opponents get progressively stronger</li>
                <li>Your health does NOT restore between rounds</li>
                <li>Defeat means tournament elimination (no refunds)</li>
                <li>Victory in all rounds grants the full reward</li>
              </ul>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};
