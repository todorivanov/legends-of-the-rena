import { Card, Row, Col } from 'antd';
import { HealthBar } from '../HealthBar';
import { ScoreBoard } from '../ScoreBoard';

interface Player {
  name: string;
  health: number;
  maxHealth: number;
}

interface GameHUDProps {
  player1: Player;
  player2?: Player;
  score: number;
  highScore?: number;
  time?: number;
  combo?: number;
}

export const GameHUD = ({ 
  player1, 
  player2, 
  score, 
  highScore, 
  time, 
  combo 
}: GameHUDProps) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <ScoreBoard 
        score={score} 
        highScore={highScore}
        time={time}
        combo={combo}
      />
      
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={player2 ? 12 : 24}>
            <HealthBar 
              current={player1.health}
              max={player1.maxHealth}
              label={player1.name}
            />
          </Col>
          
          {player2 && (
            <Col xs={24} md={12}>
              <HealthBar 
                current={player2.health}
                max={player2.maxHealth}
                label={player2.name}
              />
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};
