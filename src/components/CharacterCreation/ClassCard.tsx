import React from 'react';
import { Card } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import type { CharacterClass } from '../../types/game';
import type { CHARACTER_CLASSES } from '../../data/classes';
import './ClassCard.scss';

interface ClassCardProps {
  classData: typeof CHARACTER_CLASSES[CharacterClass];
  selected: boolean;
  onSelect: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ classData, selected, onSelect }) => {
  return (
    <Card
      className={`class-card ${selected ? 'class-card--selected' : ''}`}
      hoverable
      onClick={onSelect}
    >
      {selected && (
        <div className="class-card__check">
          <CheckCircleFilled />
        </div>
      )}
      
      <div className="class-card__icon">{classData.icon}</div>
      
      <div className="class-card__name">{classData.name}</div>
      
      <div className="class-card__difficulty">
        {'⭐'.repeat(classData.difficulty)}
      </div>
      
      <div className="class-card__description">
        {classData.description}
      </div>
      
      <div className="class-card__passive">
        <strong>{classData.passive.name}</strong>
      </div>
    </Card>
  );
};
