import React, { useState } from 'react';
import { Card, Input, Button, Typography, Row, Col, message } from 'antd';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import { CHARACTER_CLASSES, getClassById } from '../../data/classes';
import type { CharacterClass } from '../../types/game';
import { ClassCard } from './ClassCard';
import './CharacterCreationScreen.scss';

const { Title, Paragraph } = Typography;

export const CharacterCreationScreen: React.FC = () => {
  const { dispatch } = useGame();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  const handleCreateCharacter = () => {
    if (!name.trim()) {
      message.error('Please enter a character name');
      return;
    }

    if (name.trim().length < 3) {
      message.error('Name must be at least 3 characters long');
      return;
    }

    if (name.trim().length > 20) {
      message.error('Name must be 20 characters or less');
      return;
    }

    if (!selectedClass) {
      message.error('Please select a class');
      return;
    }

    dispatch({
      type: 'CREATE_CHARACTER',
      payload: {
        name: name.trim(),
        class: selectedClass,
      },
    });

    message.success(`Welcome to the arena, ${name.trim()}!`);
    dispatch({ type: 'CHANGE_SCREEN', payload: 'profile' });
  };

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
  };

  const selectedClassData = selectedClass ? getClassById(selectedClass) : null;

  return (
    <div className="character-creation">
      <div className="character-creation__header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="character-creation__back"
        >
          Back
        </Button>
        <Title level={2} className="character-creation__title">
          Create Your Champion
        </Title>
      </div>

      <div className="character-creation__content">
        <Card className="character-creation__section" title="Character Name">
          <Input
            size="large"
            placeholder="Enter your character's name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            showCount
            className="character-creation__name-input"
          />
        </Card>

        <Card className="character-creation__section" title="Choose Your Class">
          <Paragraph className="character-creation__description">
            Select a fighting style that matches your playstyle. Each class has unique abilities and passives.
          </Paragraph>
          
          <Row gutter={[16, 16]}>
            {Object.values(CHARACTER_CLASSES).map((classData) => (
              <Col xs={24} sm={12} md={8} lg={6} key={classData.id}>
                <ClassCard
                  classData={classData}
                  selected={selectedClass === classData.id}
                  onSelect={() => setSelectedClass(classData.id)}
                />
              </Col>
            ))}
          </Row>
        </Card>

        {selectedClassData && (
          <Card className="character-creation__section character-creation__preview" title="Class Preview">
            <div className="character-creation__preview-header">
              <span className="character-creation__preview-icon">
                {selectedClassData.icon}
              </span>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedClassData.name}
                </Title>
                <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                  Difficulty: {'⭐'.repeat(selectedClassData.difficulty)}
                </Paragraph>
              </div>
            </div>

            <Paragraph className="character-creation__preview-lore">
              {selectedClassData.lore}
            </Paragraph>

            <div className="character-creation__stats-preview">
              <Title level={5}>Base Stats</Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <div className="stat-item">
                    <span className="stat-label">Health:</span>
                    <span className="stat-value">{Math.round(selectedClassData.stats.healthMod * 100)}%</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <span className="stat-label">Strength:</span>
                    <span className="stat-value">{Math.round(selectedClassData.stats.strengthMod * 100)}%</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <span className="stat-label">Defense:</span>
                    <span className="stat-value">{Math.round(selectedClassData.stats.defenseMod * 100)}%</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <span className="stat-label">Crit Chance:</span>
                    <span className="stat-value">{Math.round(selectedClassData.stats.critChance * 100)}%</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <span className="stat-label">Crit Damage:</span>
                    <span className="stat-value">{Math.round(selectedClassData.stats.critDamage * 100)}%</span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <span className="stat-label">Mana Regen:</span>
                    <span className="stat-value">{selectedClassData.stats.manaRegen}/turn</span>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="character-creation__passive">
              <Title level={5}>Passive Ability</Title>
              <div className="passive-box">
                <span className="passive-name">{selectedClassData.passive.name}</span>
                <Paragraph className="passive-description">
                  {selectedClassData.passive.description}
                </Paragraph>
              </div>
            </div>
          </Card>
        )}

        <div className="character-creation__actions">
          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            onClick={handleCreateCharacter}
            disabled={!name.trim() || !selectedClass}
            block
          >
            Create Character
          </Button>
        </div>
      </div>
    </div>
  );
};
