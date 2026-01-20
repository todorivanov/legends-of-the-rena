import { Button, Space } from 'antd';
import { 
  PauseCircleOutlined, 
  PlayCircleOutlined, 
  RedoOutlined, 
  HomeOutlined,
  SoundOutlined,
  MutedOutlined
} from '@ant-design/icons';

interface GameControlsProps {
  isPaused: boolean;
  isMuted?: boolean;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onToggleMute?: () => void;
}

export const GameControls = ({ 
  isPaused, 
  isMuted = false,
  onPause, 
  onResume, 
  onRestart, 
  onMainMenu,
  onToggleMute 
}: GameControlsProps) => {
  return (
    <Space wrap>
      {isPaused ? (
        <Button 
          type="primary" 
          icon={<PlayCircleOutlined />}
          onClick={onResume}
        >
          Resume
        </Button>
      ) : (
        <Button 
          icon={<PauseCircleOutlined />}
          onClick={onPause}
        >
          Pause
        </Button>
      )}
      
      <Button 
        icon={<RedoOutlined />}
        onClick={onRestart}
      >
        Restart
      </Button>
      
      {onToggleMute && (
        <Button 
          icon={isMuted ? <MutedOutlined /> : <SoundOutlined />}
          onClick={onToggleMute}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      )}
      
      <Button 
        icon={<HomeOutlined />}
        onClick={onMainMenu}
        danger
      >
        Main Menu
      </Button>
    </Space>
  );
};
