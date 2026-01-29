import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import { Input } from './Input';
import Svg, { Path, Circle } from 'react-native-svg';

interface AddressesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (address: any) => void;
  selectedId?: string;
}

const IconCheck = ({ size = 20, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconMapPin = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const IconBuilding = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <Path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <Path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <Path d="M10 6h4" />
    <Path d="M10 10h4" />
    <Path d="M10 14h4" />
    <Path d="M10 18h4" />
  </Svg>
);

export const AddressesModal: React.FC<AddressesModalProps> = ({ visible, onClose, onSelect, selectedId }) => {
  const { colors, t, user, updateUser, isDark } = useApp();
  const [isAdding, setIsAdding] = React.useState(false);
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const insets = useSafeAreaInsets();

  const handleAdd = () => {
    if (!street || !city) return;
    const newAddress = {
      id: Date.now().toString(),
      label: 'New Address',
      street,
      city,
      postalCode: '0000',
      country: 'Georgia',
      isDefault: user.addresses.length === 0
    };
    updateUser({ addresses: [newAddress, ...user.addresses] });
    setIsAdding(false);
    setStreet('');
    setCity('');
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal 
        onClose={onClose} 
        height="100%" 
        showDragHandle={true}
        containerStyle={{ paddingVertical: Platform.OS === 'web' ? 24 : 0 }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('addresses') || 'Addresses'}</Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.gray100 }]} 
            onPress={onClose}
          >
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
          {isAdding ? (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>New Address</Text>
              <Input
                label="Street Address"
                value={street}
                onChangeText={setStreet}
                placeholder="e.g. Chavchavadze Ave 1"
                leftIcon={<IconMapPin size={18} color={colors.textMuted} />}
              />
              <Input
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Tbilisi"
                containerStyle={{ marginTop: 16 }}
                leftIcon={<IconBuilding size={18} color={colors.textMuted} />}
              />
              <View style={styles.formActions}>
                <Button
                  title="Cancel"
                  onPress={() => setIsAdding(false)}
                  variant="outline"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Save Address"
                  onPress={handleAdd}
                  variant="primary"
                  style={{ flex: 1, marginLeft: 8 }}
                />
              </View>
            </View>
          ) : (
            user.addresses && user.addresses.length > 0 ? (
               <View style={styles.list}>
                 {user.addresses.map(addr => {
                   const isSelected = selectedId ? (selectedId === addr.id) : addr.isDefault;
                   return (
                   <TouchableOpacity 
                     key={addr.id} 
                     style={[
                       styles.card, 
                       { 
                         backgroundColor: colors.surface, 
                         borderColor: isSelected ? colors.success : colors.gray100,
                         borderWidth: 1,
                         shadowColor: isDark ? '#000' : '#888',
                         shadowOpacity: isDark ? 0.3 : 0.08,
                       }
                     ]}
                     activeOpacity={0.7}
                     onPress={() => {
                       if (onSelect) {
                         onSelect(addr);
                         onClose();
                       } else {
                           // Set default logic
                           const updated = user.addresses.map(a => ({
                               ...a, isDefault: a.id === addr.id
                           }));
                           // @ts-ignore
                           updateUser({ addresses: updated });
                       }
                     }}
                   >
                     <View>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{addr.label}</Text>
                        <Text style={[styles.cardText, { color: colors.textMuted }]}>{addr.street}, {addr.city}</Text>
                     </View>
                     {isSelected ? <IconCheck size={20} color={colors.success} /> : (addr.isDefault && <IconMapPin size={20} color={colors.accent} />)}
                   </TouchableOpacity>
                   );
                 })}
                 <Button
                    title="Add New Address"
                    onPress={() => setIsAdding(true)}
                    variant="primary"
                    size="md"
                    style={{ marginTop: 16 }}
                  />
               </View>
            ) : (
              <View style={styles.emptyState}>
                <IconMapPin size={48} color={colors.gray200} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No addresses saved</Text>
                <Button
                  title="Add New Address"
                  onPress={() => setIsAdding(true)}
                  variant="primary"
                  size="md"
                  style={{ marginTop: 16 }}
                />
              </View>
            )
          )}
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
    padding: 24,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
  },
  form: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    ...Platform.select({
       web: { 
         boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
       } as any 
    })
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
  },
});
