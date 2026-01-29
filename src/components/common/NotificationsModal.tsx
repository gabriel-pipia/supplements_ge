import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path, Circle } from 'react-native-svg';
import { Modal } from 'react-native';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

// Notification Icons
const IconTag = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <Circle cx="7" cy="7" r="1.5" fill={color} />
  </Svg>
);

const IconPackage = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M16.5 9.4l-9-5.19" />
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05" />
    <Path d="M12 22.08V12" />
  </Svg>
);

const IconTruck = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
    <Circle cx="5.5" cy="18.5" r="2.5" />
    <Circle cx="18.5" cy="18.5" r="2.5" />
  </Svg>
);

const IconSparkles = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <Path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
    <Path d="M19 11l.5 1.5L21 13l-1.5.5L19 15l-.5-1.5L17 13l1.5-.5L19 11z" />
  </Svg>
);

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const { colors, t } = useApp();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState({
    promo: true,
    order: true,
    delivery: true,
    newArrivals: false,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NotificationItem = ({ icon: Icon, label, desc, value, onToggle }: any) => (
    <View style={[styles.item, { borderBottomColor: colors.gray100 }]}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.surface, borderColor: colors.gray200, borderWidth: 1 }]}>
        <Icon size={20} color={colors.accent} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.itemDesc, { color: colors.textMuted }]}>{desc}</Text>
      </View>
      <Switch
        trackColor={{ false: colors.gray200, true: colors.accent }}
        thumbColor={'#fff'}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <BottomSheetModal onClose={onClose} height="100%" showDragHandle={true}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('notifications') || 'Notifications'}</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.gray100 }]} onPress={onClose}>
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
          <NotificationItem 
            icon={IconTag}
            label="Promotions & Offers" 
            desc="Get notified about discounts and special offers"
            value={settings.promo}
            onToggle={() => toggleSwitch('promo')}
          />
          <NotificationItem 
            icon={IconPackage}
            label="Order Status" 
            desc="Updates about your order processing"
            value={settings.order}
            onToggle={() => toggleSwitch('order')}
          />
          <NotificationItem 
            icon={IconTruck}
            label="Delivery Updates" 
            desc="Track your package delivery status"
            value={settings.delivery}
            onToggle={() => toggleSwitch('delivery')}
          />
          <NotificationItem 
            icon={IconSparkles}
            label="New Arrivals" 
            desc="Be the first to know about new products"
            value={settings.newArrivals}
            onToggle={() => toggleSwitch('newArrivals')}
          />
        </ScrollView>
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
  },
});
