import { Card, Col, Row, Statistic } from 'antd';
import { TrophyOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';

interface ScoreBoardProps {
  score: number;
  highScore?: number;
  time?: number;
  combo?: number;
}

export const ScoreBoard = ({ score, highScore, time, combo }: ScoreBoardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card bordered={false} style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={highScore !== undefined ? 6 : 8}>
          <Statistic 
            title="Score" 
            value={score} 
            prefix={<TrophyOutlined />}
          />
        </Col>
        
        {highScore !== undefined && (
          <Col span={6}>
            <Statistic 
              title="High Score" 
              value={highScore}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
        )}
        
        {time !== undefined && (
          <Col span={highScore !== undefined ? 6 : 8}>
            <Statistic 
              title="Time" 
              value={formatTime(time)}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
        )}
        
        {combo !== undefined && combo > 0 && (
          <Col span={highScore !== undefined ? 6 : 8}>
            <Statistic 
              title="Combo" 
              value={combo}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
};
