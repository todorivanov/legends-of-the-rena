import React, { useState } from 'react';
import { Card, Button, Row, Col, Tag, Typography, Tabs, Modal, Progress, message } from 'antd';
import { 
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import { getEquipmentById, getRarityColor, getDurabilityStatus } from '../../data/equipment';
import type { Equipment } from '../../types/game';
import './EquipmentScreen.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export const EquipmentScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, inventory, equipped } = state;
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Convert inventory item IDs to full Equipment objects with durability
  const inventoryItems: Equipment[] = inventory.equipment
    .map(item => {
      const equipmentData = getEquipmentById(item.id);
      if (!equipmentData) return null;
      return {
        ...equipmentData,
        durability: item.durability,
      };
    })
    .filter((item): item is Equipment => item !== null);

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'profile' });
  };

  const handleViewDetails = (item: Equipment) => {
    setSelectedItem(item);
    setDetailsModalVisible(true);
  };

  const handleEquipItem = (item: Equipment) => {
    if (!player.characterCreated) {
      message.error('No character created!');
      return;
    }

    // Check level requirements
    if (player.level < item.level) {
      message.error(`Requires level ${item.level}!`);
      return;
    }

    // Check class requirements
    if (item.requirements?.class && !item.requirements.class.includes(player.class)) {
      message.error(`This item is not compatible with your class!`);
      return;
    }

    // Equip the item
    dispatch({ 
      type: 'EQUIP_ITEM', 
      payload: { 
        slot: item.type, 
        itemId: item.id 
      } 
    });
    
    message.success(`Equipped ${item.name}!`);
    setDetailsModalVisible(false);
  };

  const handleRepairItem = (item: Equipment) => {
    const repairCost = Math.floor((100 - item.durability) * item.price * 0.01);
    
    if (repairCost === 0) {
      message.info('Item is already at full durability!');
      return;
    }

    if (player.gold >= repairCost) {
      dispatch({ type: 'REPAIR_EQUIPMENT', payload: item.id });
      dispatch({ type: 'SPEND_GOLD', payload: repairCost });
      message.success(`Repaired ${item.name} for ${repairCost} gold!`);
      setDetailsModalVisible(false);
    } else {
      message.error(`Not enough gold! Need ${repairCost}g`);
    }
  };

  const handleSellItem = (item: Equipment) => {
    const sellValue = Math.floor(item.price * 0.5);
    
    Modal.confirm({
      title: 'Sell Item?',
      content: `Sell ${item.name} for ${sellValue} gold?`,
      okText: 'Sell',
      cancelText: 'Cancel',
      onOk: () => {
        // Check if item is equipped and unequip it first
        if (state.equipped.weapon === item.id) {
          dispatch({ type: 'UNEQUIP_ITEM', payload: 'weapon' });
        } else if (state.equipped.armor === item.id) {
          dispatch({ type: 'UNEQUIP_ITEM', payload: 'armor' });
        } else if (state.equipped.accessory === item.id) {
          dispatch({ type: 'UNEQUIP_ITEM', payload: 'accessory' });
        }
        
        dispatch({ type: 'REMOVE_EQUIPMENT', payload: item.id });
        dispatch({ type: 'SELL_ITEM', payload: { itemId: item.id, value: sellValue } });
        dispatch({ type: 'ADD_GOLD', payload: sellValue });
        message.success(`Sold ${item.name} for ${sellValue} gold!`);
        setDetailsModalVisible(false);
      },
    });
  };

  const renderEquipmentCard = (item: Equipment, isEquipped: boolean = false) => {
    const durabilityInfo = getDurabilityStatus(item.durability ?? 100);
    
    return (
      <Card
        key={item.id}
        className={`equipment-card ${isEquipped ? 'equipment-card--equipped' : ''}`}
        hoverable
        onClick={() => handleViewDetails(item)}
      >
        {isEquipped && (
          <div className="equipment-card__equipped-badge">
            <Tag color="green">Equipped</Tag>
          </div>
        )}
        
        <div className="equipment-card__header">
          <Text strong className="equipment-card__name" style={{ color: getRarityColor(item.rarity) }}>
            {item.name}
          </Text>
          <Tag color={getRarityColor(item.rarity)}>{item.rarity}</Tag>
        </div>

        <div className="equipment-card__stats">
          <Text type="secondary" className="equipment-card__type">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Text className="equipment-card__level">Level {item.level}</Text>
        </div>

        <div className="equipment-card__durability">
          <div className="durability-label">
            <Text style={{ fontSize: 12 }}>Durability:</Text>
            <Text strong style={{ fontSize: 12, color: durabilityInfo.color }}>
              {durabilityInfo.status}
            </Text>
          </div>
          <Progress 
            percent={durabilityInfo.percentage} 
            size="small"
            showInfo={false}
            strokeColor={durabilityInfo.color}
          />
        </div>

        <div className="equipment-card__price">
          <Text type="secondary">💰 {item.price}g</Text>
        </div>
      </Card>
    );
  };

  const weapons = inventoryItems.filter(item => item.type === 'weapon');
  const armor = inventoryItems.filter(item => item.type === 'armor');
  const accessories = inventoryItems.filter(item => item.type === 'accessory');

  return (
    <div className="equipment-screen">
      <div className="equipment-screen__header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="equipment-screen__back"
        >
          Back to Profile
        </Button>
        <div className="equipment-screen__title-area">
          <Title level={2} className="equipment-screen__title">
            Equipment & Inventory
          </Title>
          <Text className="equipment-screen__gold">
            💰 {player.gold} Gold
          </Text>
        </div>
      </div>

      <div className="equipment-screen__content">
        {inventoryItems.length === 0 ? (
          <Card className="empty-inventory">
            <div className="empty-inventory__content">
              <ShoppingCartOutlined className="empty-inventory__icon" />
              <Title level={4}>Your inventory is empty</Title>
              <Paragraph type="secondary">
                Visit the marketplace to purchase equipment and enhance your fighter!
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: 'marketplace' })}
              >
                Go to Marketplace
              </Button>
            </div>
          </Card>
        ) : (
          <Tabs defaultActiveKey="all" size="large" className="equipment-tabs">
            <TabPane tab={`All Items (${inventoryItems.length})`} key="all">
              <Row gutter={[16, 16]}>
                {inventoryItems.map(item => {
                  const isEquipped = 
                    equipped.weapon === item.id ||
                    equipped.armor === item.id ||
                    equipped.accessory === item.id;
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                      {renderEquipmentCard(item, isEquipped)}
                    </Col>
                  );
                })}
              </Row>
            </TabPane>

            <TabPane tab={`Weapons (${weapons.length})`} key="weapons">
              <Row gutter={[16, 16]}>
                {weapons.map(item => {
                  const isEquipped = equipped.weapon === item.id;
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                      {renderEquipmentCard(item, isEquipped)}
                    </Col>
                  );
                })}
              </Row>
            </TabPane>

            <TabPane tab={`Armor (${armor.length})`} key="armor">
              <Row gutter={[16, 16]}>
                {armor.map(item => {
                  const isEquipped = equipped.armor === item.id;
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                      {renderEquipmentCard(item, isEquipped)}
                    </Col>
                  );
                })}
              </Row>
            </TabPane>

            <TabPane tab={`Accessories (${accessories.length})`} key="accessories">
              <Row gutter={[16, 16]}>
                {accessories.map(item => {
                  const isEquipped = equipped.accessory === item.id;
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                      {renderEquipmentCard(item, isEquipped)}
                    </Col>
                  );
                })}
              </Row>
            </TabPane>
          </Tabs>
        )}
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <Modal
          title={selectedItem.name}
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={null}
          width={600}
        >
          <div className="item-details">
            <div className="item-details__header">
              <Tag color={getRarityColor(selectedItem.rarity)} style={{ fontSize: 14, padding: '4px 12px' }}>
                {selectedItem.rarity.toUpperCase()}
              </Tag>
              <Text type="secondary">{selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}</Text>
            </div>

            <Paragraph className="item-details__description">
              {selectedItem.description}
            </Paragraph>

            <div className="item-details__section">
              <Text strong>Requirements:</Text>
              <div style={{ marginTop: 8 }}>
                <Text>Level: {selectedItem.level}</Text>
                {selectedItem.requirements?.class && (
                  <div>
                    <Text>Class: {selectedItem.requirements.class.join(', ')}</Text>
                  </div>
                )}
              </div>
            </div>

            <div className="item-details__section">
              <Text strong>Stats:</Text>
              <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                {selectedItem.stats.health && (
                  <Col span={12}>
                    <Text>Health: +{selectedItem.stats.health}</Text>
                  </Col>
                )}
                {selectedItem.stats.strength && (
                  <Col span={12}>
                    <Text>Strength: +{selectedItem.stats.strength}</Text>
                  </Col>
                )}
                {selectedItem.stats.defense && (
                  <Col span={12}>
                    <Text>Defense: +{selectedItem.stats.defense}</Text>
                  </Col>
                )}
                {selectedItem.stats.manaRegen && (
                  <Col span={12}>
                    <Text>Mana Regen: +{selectedItem.stats.manaRegen}</Text>
                  </Col>
                )}
                {selectedItem.stats.critChance && (
                  <Col span={12}>
                    <Text>Crit Chance: +{(selectedItem.stats.critChance * 100).toFixed(0)}%</Text>
                  </Col>
                )}
                {selectedItem.stats.critDamage && (
                  <Col span={12}>
                    <Text>Crit Damage: +{(selectedItem.stats.critDamage * 100).toFixed(0)}%</Text>
                  </Col>
                )}
              </Row>
            </div>

            <div className="item-details__section">
              <Text strong>Durability:</Text>
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={selectedItem.durability ?? 100} 
                  strokeColor={getDurabilityStatus(selectedItem.durability ?? 100).color}
                />
              </div>
            </div>

            <div className="item-details__actions">
              <Button 
                type="primary" 
                size="large"
                onClick={() => handleEquipItem(selectedItem)}
                disabled={
                  equipped.weapon === selectedItem.id ||
                  equipped.armor === selectedItem.id ||
                  equipped.accessory === selectedItem.id
                }
                block
              >
                {(equipped.weapon === selectedItem.id || 
                  equipped.armor === selectedItem.id || 
                  equipped.accessory === selectedItem.id)
                  ? 'Currently Equipped'
                  : 'Equip Item'}
              </Button>
              <Row gutter={8} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Button 
                    icon={<ToolOutlined />}
                    onClick={() => handleRepairItem(selectedItem)}
                    block
                  >
                    Repair ({Math.floor((100 - (selectedItem.durability ?? 100)) * selectedItem.price * 0.01)}g)
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    danger
                    onClick={() => handleSellItem(selectedItem)}
                    block
                  >
                    Sell ({Math.floor(selectedItem.price * 0.5)}g)
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
