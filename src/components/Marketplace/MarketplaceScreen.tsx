import React, { useState } from 'react';
import { Card, Button, Row, Col, Tag, Typography, Modal, message } from 'antd';
import { 
  ArrowLeftOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useGame } from '../../hooks/useGame';
import { getAllEquipment, getRarityColor } from '../../data/equipment';
import type { Equipment } from '../../types/game';
import './MarketplaceScreen.scss';

const { Title, Text, Paragraph } = Typography;

export const MarketplaceScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, inventory } = state;
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Get all available equipment
  const allEquipment = getAllEquipment();
  
  // Filter equipment based on player level (show items up to player level + 5)
  const availableEquipment = allEquipment.filter(
    item => item.level <= player.level + 5
  );

  const handleBack = () => {
    dispatch({ type: 'CHANGE_SCREEN', payload: 'title' });
  };

  const handleViewDetails = (item: Equipment) => {
    setSelectedItem(item);
    setDetailsModalVisible(true);
  };

  const handlePurchase = (item: Equipment) => {
    if (player.gold < item.price) {
      message.error('Not enough gold!');
      return;
    }

    // Check level requirements
    if (player.level < item.level) {
      message.error(`Requires level ${item.level}!`);
      return;
    }

    // Check class requirements
    if (item.requirements?.class && !item.requirements.class.includes(player.class)) {
      message.error('This item is not compatible with your class!');
      return;
    }

    // Check inventory space
    if (inventory.equipment.length >= inventory.maxSlots) {
      message.error('Inventory is full!');
      return;
    }

    // Purchase item
    dispatch({ type: 'ADD_EQUIPMENT', payload: { id: item.id, durability: 100 } });
    dispatch({ type: 'SPEND_GOLD', payload: item.price });
    dispatch({ type: 'PURCHASE_ITEM', payload: { itemId: item.id, cost: item.price } });
    
    message.success(`Purchased ${item.name} for ${item.price} gold!`);
    setDetailsModalVisible(false);
  };

  const canAfford = (price: number) => player.gold >= price;
  const canEquip = (item: Omit<Equipment, 'durability' | 'maxDurability'>) => {
    if (player.level < item.level) return false;
    if (item.requirements?.class && !item.requirements.class.includes(player.class)) return false;
    return true;
  };

  const renderItemCard = (item: Omit<Equipment, 'durability' | 'maxDurability'>) => {
    const affordable = canAfford(item.price);
    const equipable = canEquip(item);
    const owned = inventory.equipment.some(invItem => invItem.id === item.id);

    return (
      <Card
        key={item.id}
        className={`marketplace-item ${!affordable ? 'marketplace-item--unaffordable' : ''}`}
        hoverable
        onClick={() => handleViewDetails(item as Equipment)}
      >
        {owned && (
          <div className="marketplace-item__owned-badge">
            <Tag color="green">Owned</Tag>
          </div>
        )}

        <div className="marketplace-item__header">
          <Text strong className="marketplace-item__name" style={{ color: getRarityColor(item.rarity) }}>
            {item.name}
          </Text>
          <Tag color={getRarityColor(item.rarity)}>{item.rarity.toUpperCase()}</Tag>
        </div>

        <Paragraph className="marketplace-item__description" ellipsis={{ rows: 2 }}>
          {item.description}
        </Paragraph>

        <div className="marketplace-item__requirements">
          <Text type="secondary" style={{ fontSize: 12 }}>
            Level {item.level} • {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          {!equipable && (
            <Tag color="red" style={{ fontSize: 11 }}>
              Cannot Equip
            </Tag>
          )}
        </div>

        <div className="marketplace-item__footer">
          <div className="marketplace-item__price">
            <Text strong style={{ fontSize: 16, color: affordable ? '#faad14' : '#ff4d4f' }}>
              💰 {item.price}g
            </Text>
          </div>
          {!affordable && (
            <Text type="danger" style={{ fontSize: 11 }}>
              Cannot Afford
            </Text>
          )}
        </div>
      </Card>
    );
  };

  // Group items by type
  const weapons = availableEquipment.filter(item => item.type === 'weapon');
  const armor = availableEquipment.filter(item => item.type === 'armor');
  const accessories = availableEquipment.filter(item => item.type === 'accessory');

  return (
    <div className="marketplace-screen">
      <div className="marketplace-screen__header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="marketplace-screen__back"
        >
          Back to Menu
        </Button>
        <div className="marketplace-screen__title-area">
          <div>
            <Title level={2} className="marketplace-screen__title">
              <ShoppingCartOutlined /> Marketplace
            </Title>
            <Text type="secondary">Browse and purchase equipment to enhance your fighter</Text>
          </div>
          <div className="marketplace-screen__gold">
            <Text style={{ fontSize: 14, marginRight: 8 }}>Your Gold:</Text>
            <Text strong style={{ fontSize: 24, color: '#faad14' }}>
              💰 {player.gold}
            </Text>
          </div>
        </div>
      </div>

      <div className="marketplace-screen__content">
        {/* Weapons Section */}
        <Card className="marketplace-section" title={`⚔️ Weapons (${weapons.length})`}>
          <Row gutter={[16, 16]}>
            {weapons.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                {renderItemCard(item)}
              </Col>
            ))}
          </Row>
        </Card>

        {/* Armor Section */}
        <Card className="marketplace-section" title={`🛡️ Armor (${armor.length})`}>
          <Row gutter={[16, 16]}>
            {armor.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                {renderItemCard(item)}
              </Col>
            ))}
          </Row>
        </Card>

        {/* Accessories Section */}
        <Card className="marketplace-section" title={`💍 Accessories (${accessories.length})`}>
          <Row gutter={[16, 16]}>
            {accessories.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                {renderItemCard(item)}
              </Col>
            ))}
          </Row>
        </Card>
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
              <Text strong>Price:</Text>
              <div style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 20, color: canAfford(selectedItem.price) ? '#faad14' : '#ff4d4f' }}>
                  💰 {selectedItem.price} Gold
                </Text>
              </div>
            </div>

            <div className="item-details__actions">
              <Button 
                type="primary" 
                size="large"
                onClick={() => handlePurchase(selectedItem)}
                disabled={
                  !canAfford(selectedItem.price) || 
                  !canEquip(selectedItem) ||
                  inventory.equipment.some(invItem => invItem.id === selectedItem.id)
                }
                block
              >
                {inventory.equipment.some(invItem => invItem.id === selectedItem.id)
                  ? 'Already Owned'
                  : !canAfford(selectedItem.price)
                  ? `Need ${selectedItem.price - player.gold} More Gold`
                  : !canEquip(selectedItem)
                  ? 'Cannot Equip'
                  : `Purchase for ${selectedItem.price}g`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
