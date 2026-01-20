import React from 'react';
import { Card, Button, Row, Col, Tag, Typography, Progress, Statistic } from 'antd';
import { 
  ArrowLeftOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  LockOutlined,
  StarOutlined,
  FireOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import type { GameStats } from '../../types/game';
import './AchievementsScreen.scss';

const { Title, Text, Paragraph } = Typography;

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: (stats: GameStats) => boolean;
  progress: (stats: GameStats) => { current: number; total: number };
  reward: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first combat',
    icon: <FireOutlined />,
    tier: 'bronze',
    requirement: (stats) => stats.totalWins >= 1,
    progress: (stats) => ({ current: Math.min(stats.totalWins, 1), total: 1 }),
    reward: '50 Gold',
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Win 10 combats',
    icon: <TrophyOutlined />,
    tier: 'bronze',
    requirement: (stats) => stats.totalWins >= 10,
    progress: (stats) => ({ current: Math.min(stats.totalWins, 10), total: 10 }),
    reward: '200 Gold',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Win 50 combats',
    icon: <TrophyOutlined />,
    tier: 'silver',
    requirement: (stats) => stats.totalWins >= 50,
    progress: (stats) => ({ current: Math.min(stats.totalWins, 50), total: 50 }),
    reward: '500 Gold',
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Win 100 combats',
    icon: <CrownOutlined />,
    tier: 'gold',
    requirement: (stats) => stats.totalWins >= 100,
    progress: (stats) => ({ current: Math.min(stats.totalWins, 100), total: 100 }),
    reward: '1000 Gold',
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Win 500 combats',
    icon: <StarOutlined />,
    tier: 'platinum',
    requirement: (stats) => stats.totalWins >= 500,
    progress: (stats) => ({ current: Math.min(stats.totalWins, 500), total: 500 }),
    reward: '5000 Gold',
  },
  {
    id: 'win_streak_5',
    name: 'Hot Streak',
    description: 'Win 5 combats in a row',
    icon: <FireOutlined />,
    tier: 'bronze',
    requirement: (stats) => stats.bestStreak >= 5,
    progress: (stats) => ({ current: Math.min(stats.bestStreak, 5), total: 5 }),
    reward: '100 Gold',
  },
  {
    id: 'win_streak_10',
    name: 'Unstoppable',
    description: 'Win 10 combats in a row',
    icon: <FireOutlined />,
    tier: 'silver',
    requirement: (stats) => stats.bestStreak >= 10,
    progress: (stats) => ({ current: Math.min(stats.bestStreak, 10), total: 10 }),
    reward: '300 Gold',
  },
  {
    id: 'win_streak_25',
    name: 'Untouchable',
    description: 'Win 25 combats in a row',
    icon: <FireOutlined />,
    tier: 'gold',
    requirement: (stats) => stats.bestStreak >= 25,
    progress: (stats) => ({ current: Math.min(stats.bestStreak, 25), total: 25 }),
    reward: '1000 Gold',
  },
  {
    id: 'critical_master',
    name: 'Critical Master',
    description: 'Land 100 critical hits',
    icon: <FireOutlined />,
    tier: 'silver',
    requirement: (stats) => stats.criticalHits >= 100,
    progress: (stats) => ({ current: Math.min(stats.criticalHits, 100), total: 100 }),
    reward: '500 Gold',
  },
  {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spend 10,000 gold',
    icon: <TrophyOutlined />,
    tier: 'silver',
    requirement: (stats) => stats.goldSpent >= 10000,
    progress: (stats) => ({ current: Math.min(stats.goldSpent, 10000), total: 10000 }),
    reward: '1000 Gold',
  },
  {
    id: 'merchant',
    name: 'Merchant',
    description: 'Sell 50 items',
    icon: <TrophyOutlined />,
    tier: 'bronze',
    requirement: (stats) => stats.itemsSold >= 50,
    progress: (stats) => ({ current: Math.min(stats.itemsSold, 50), total: 50 }),
    reward: '300 Gold',
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Purchase 25 items',
    icon: <TrophyOutlined />,
    tier: 'silver',
    requirement: (stats) => stats.itemsPurchased >= 25,
    progress: (stats) => ({ current: Math.min(stats.itemsPurchased, 25), total: 25 }),
    reward: '500 Gold',
  },
];

export const AchievementsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { stats } = state;

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
  };

  const getTierColor = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
    }
  };

  const getTierLabel = (tier: Achievement['tier']) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.requirement(stats));
  const totalAchievements = ACHIEVEMENTS.length;
  const completionRate = Math.round((unlockedAchievements.length / totalAchievements) * 100);

  return (
    <div className="achievements-screen">
      <div className="achievements-screen__header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="achievements-screen__back"
        >
          Back to Menu
        </Button>
        <div className="achievements-screen__title-area">
          <Title level={2} className="achievements-screen__title">
            <TrophyOutlined /> Achievements
          </Title>
        </div>
      </div>

      <div className="achievements-screen__content">
        {/* Summary Stats */}
        <Card className="achievements-summary">
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Statistic 
                title="Total Achievements"
                value={totalAchievements}
                prefix={<TrophyOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic 
                title="Unlocked"
                value={unlockedAchievements.length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  Completion Rate
                </Text>
                <Progress 
                  percent={completionRate}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Achievements Grid */}
        <Row gutter={[16, 16]}>
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = achievement.requirement(stats);
            const progress = achievement.progress(stats);
            const progressPercent = (progress.current / progress.total) * 100;

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={achievement.id}>
                <Card 
                  className={`achievement-card ${isUnlocked ? 'achievement-card--unlocked' : ''}`}
                  hoverable={isUnlocked}
                >
                  <div className="achievement-card__icon" style={{ color: getTierColor(achievement.tier) }}>
                    {isUnlocked ? achievement.icon : <LockOutlined />}
                  </div>
                  
                  <div className="achievement-card__tier">
                    <Tag color={getTierColor(achievement.tier)}>
                      {getTierLabel(achievement.tier)}
                    </Tag>
                  </div>

                  <Title level={5} className="achievement-card__name">
                    {achievement.name}
                  </Title>

                  <Paragraph className="achievement-card__description">
                    {achievement.description}
                  </Paragraph>

                  {!isUnlocked && (
                    <div className="achievement-card__progress">
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Progress: {progress.current} / {progress.total}
                      </Text>
                      <Progress 
                        percent={progressPercent}
                        size="small"
                        showInfo={false}
                        strokeColor={getTierColor(achievement.tier)}
                      />
                    </div>
                  )}

                  {isUnlocked && (
                    <div className="achievement-card__unlocked">
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                      <Text type="success" strong>Unlocked!</Text>
                    </div>
                  )}

                  <div className="achievement-card__reward">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Reward: {achievement.reward}
                    </Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};
