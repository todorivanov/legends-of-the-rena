import { Progress } from 'antd';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  showInfo?: boolean;
}

export const HealthBar = ({ 
  current, 
  max, 
  label,
  showInfo = true 
}: HealthBarProps) => {
  const percentage = Math.round((current / max) * 100);
  
  const getStatus = () => {
    if (percentage > 60) return 'success';
    if (percentage > 30) return 'normal';
    return 'exception';
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ marginBottom: 4, fontWeight: 500 }}>
          {label}
        </div>
      )}
      <Progress 
        percent={percentage} 
        status={getStatus()}
        showInfo={showInfo}
        strokeColor={{
          '0%': percentage > 60 ? '#52c41a' : percentage > 30 ? '#faad14' : '#f5222d',
          '100%': percentage > 60 ? '#95de64' : percentage > 30 ? '#ffc53d' : '#ff4d4f',
        }}
      />
    </div>
  );
};
