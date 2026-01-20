import React from 'react';
import { Card, Button, Row, Col, Progress, Tag, Typography, Statistic, Divider } from 'antd';
import { 
  ArrowLeftOutlined, 
  TrophyOutlined, 
  FireOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import { getClassById, calculatePlayerStats } from '../../data/classes';
import { getRarityColor, getEquipmentById } from '../../data/equipment';
import './ProfileScreen.scss';

const { Title, Paragraph, Text } = Typography;

export const ProfileScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, stats, equipped, inventory } = state;

  // Get equipment details from IDs
  const equippedWeapon = equipped.weapon 
    ? inventory.equipment.find(item => item.id === equipped.weapon)
    : null;
  const equippedArmor = equipped.armor 
    ? inventory.equipment.find(item => item.id === equipped.armor)
    : null;
  const equippedAccessory = equipped.accessory 
    ? inventory.equipment.find(item => item.id === equipped.accessory)
    : null;

  // Convert to full equipment objects
  const weaponData = equippedWeapon ? getEquipmentById(equippedWeapon.id) : null;
  const armorData = equippedArmor ? getEquipmentById(equippedArmor.id) : null;
  const accessoryData = equippedAccessory ? getEquipmentById(equippedAccessory.id) : null;

  const equipment = {
    weapon: weaponData && equippedWeapon ? { ...weaponData, durability: equippedWeapon.durability } : null,
    armor: armorData && equippedArmor ? { ...armorData, durability: equippedArmor.durability } : null,
    accessory: accessoryData && equippedAccessory ? { ...accessoryData, durability: equippedAccessory.durability } : null,
  };

  const classData = getClassById(player.class);
  const calculatedStats = calculatePlayerStats(player);

  const xpToNextLevel = Math.floor(100 * Math.pow(1.5, player.level - 1));
  const xpProgress = (player.xp / xpToNextLevel) * 100;

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
  };

  const handleEquipment = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'equipment' });
  };

  const handleTalents = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'talents' });
  };

  return (
    <div className="profile-screen">
      <div className="profile-screen__header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="profile-screen__back"
        >
          Back to Menu
        </Button>
        <Title level={2} className="profile-screen__title">
          Character Profile
        </Title>
      </div>

      <div className="profile-screen__content">
        <Row gutter={[24, 24]}>
          {/* Left Column - Character Info */}
          <Col xs={24} lg={12}>
            <Card className="profile-card profile-card--character">
              <div className="character-header">
                <div className="character-header__icon">
                  {classData?.icon}
                </div>
                <div className="character-header__info">
                  <Title level={3} style={{ margin: 0 }}>
                    {player.name}
                  </Title>
                  <Text className="character-header__class">
                    {classData?.name} • Level {player.level}
                  </Text>
                </div>
              </div>

              <Divider />

              <div className="xp-section">
                <div className="xp-section__label">
                  <Text>Experience</Text>
                  <Text strong>
                    {player.xp} / {xpToNextLevel} XP
                  </Text>
                </div>
                <Progress 
                  percent={xpProgress} 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                />
              </div>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Gold"
                    value={player.gold}
                    prefix="💰"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Unspent Points"
                    value={player.talentPoints}
                    prefix={<FireOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Stats Card */}
            <Card className="profile-card profile-card--stats" title="Combat Stats">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="stat-item">
                    <HeartOutlined className="stat-item__icon stat-item__icon--health" />
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Health</Text>
                      <Text className="stat-item__value">{calculatedStats.health}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <ThunderboltOutlined className="stat-item__icon stat-item__icon--mana" />
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Mana</Text>
                      <Text className="stat-item__value">{100}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <FireOutlined className="stat-item__icon stat-item__icon--strength" />
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Strength</Text>
                      <Text className="stat-item__value">{calculatedStats.strength}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <SafetyOutlined className="stat-item__icon stat-item__icon--defense" />
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Defense</Text>
                      <Text className="stat-item__value">{calculatedStats.defense}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Crit Chance</Text>
                      <Text className="stat-item__value">
                        {(calculatedStats.critChance * 100).toFixed(1)}%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Crit Damage</Text>
                      <Text className="stat-item__value">
                        {(calculatedStats.critDamage * 100).toFixed(0)}%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Mana Regen</Text>
                      <Text className="stat-item__value">
                        {calculatedStats.manaRegen}/turn
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <div className="stat-item__content">
                      <Text className="stat-item__label">Attack Range</Text>
                      <Text className="stat-item__value">
                        {calculatedStats.attackRange}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Equipment & Actions */}
          <Col xs={24} lg={12}>
            {/* Equipment Card */}
            <Card className="profile-card profile-card--equipment" title="Equipment">
              <div className="equipment-slots">
                <div className="equipment-slot">
                  <Text className="equipment-slot__label">Weapon</Text>
                  {equipment.weapon ? (
                    <div 
                      className="equipment-slot__item"
                      style={{ borderColor: getRarityColor(equipment.weapon.rarity) }}
                    >
                      <Text strong>{equipment.weapon.name}</Text>
                      <Tag color={getRarityColor(equipment.weapon.rarity)}>
                        {equipment.weapon.rarity}
                      </Tag>
                      <Progress 
                        percent={equipment.weapon.durability} 
                        size="small"
                        showInfo={false}
                        strokeColor={equipment.weapon.durability < 50 ? '#fa8c16' : '#52c41a'}
                      />
                    </div>
                  ) : (
                    <div className="equipment-slot__empty">Empty</div>
                  )}
                </div>

                <div className="equipment-slot">
                  <Text className="equipment-slot__label">Armor</Text>
                  {equipment.armor ? (
                    <div 
                      className="equipment-slot__item"
                      style={{ borderColor: getRarityColor(equipment.armor.rarity) }}
                    >
                      <Text strong>{equipment.armor.name}</Text>
                      <Tag color={getRarityColor(equipment.armor.rarity)}>
                        {equipment.armor.rarity}
                      </Tag>
                      <Progress 
                        percent={equipment.armor.durability} 
                        size="small"
                        showInfo={false}
                        strokeColor={equipment.armor.durability < 50 ? '#fa8c16' : '#52c41a'}
                      />
                    </div>
                  ) : (
                    <div className="equipment-slot__empty">Empty</div>
                  )}
                </div>

                <div className="equipment-slot">
                  <Text className="equipment-slot__label">Accessory</Text>
                  {equipment.accessory ? (
                    <div 
                      className="equipment-slot__item"
                      style={{ borderColor: getRarityColor(equipment.accessory.rarity) }}
                    >
                      <Text strong>{equipment.accessory.name}</Text>
                      <Tag color={getRarityColor(equipment.accessory.rarity)}>
                        {equipment.accessory.rarity}
                      </Tag>
                      <Progress 
                        percent={equipment.accessory.durability} 
                        size="small"
                        showInfo={false}
                        strokeColor={equipment.accessory.durability < 50 ? '#fa8c16' : '#52c41a'}
                      />
                    </div>
                  ) : (
                    <div className="equipment-slot__empty">Empty</div>
                  )}
                </div>
              </div>

              <Button 
                type="primary" 
                block 
                onClick={handleEquipment}
                style={{ marginTop: 16 }}
              >
                Manage Equipment
              </Button>
            </Card>

            {/* Class Info Card */}
            <Card className="profile-card profile-card--class" title="Class Abilities">
              <div className="class-passive">
                <Text strong className="class-passive__name">
                  {classData?.passive.name}
                </Text>
                <Paragraph className="class-passive__description">
                  {classData?.passive.description}
                </Paragraph>
              </div>

              <Divider />

              <div className="class-skills">
                <Text strong>Available Skills: 0</Text>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  Skills will be unlocked as you level up
                </Paragraph>
              </div>

              <Button 
                block 
                onClick={handleTalents}
                style={{ marginTop: 16 }}
              >
                Talent Tree
              </Button>
            </Card>

            {/* Battle Stats Card */}
            <Card className="profile-card profile-card--battle" title="Battle Statistics">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Total Battles"
                    value={stats.totalFightsPlayed}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Victories"
                    value={stats.totalWins}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Win Rate"
                    value={stats.totalFightsPlayed > 0 
                      ? ((stats.totalWins / stats.totalFightsPlayed) * 100).toFixed(1)
                      : 0
                    }
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Win Streak"
                    value={stats.bestStreak}
                    prefix={<FireOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
