import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import { Input } from './Input';
import Svg, { Path, Rect } from 'react-native-svg';

interface PaymentMethodsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (method: any) => void;
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

const IconCreditCard = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <Path d="M1 10h22" />
  </Svg>
);

const IconCalendar = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4" />
    <Path d="M8 2v4" />
    <Path d="M3 10h18" />
  </Svg>
);

const IconLock = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({ visible, onClose, onSelect, selectedId }) => {
  const { colors, t, user, updateUser, isDark } = useApp();
  const [isAdding, setIsAdding] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const insets = useSafeAreaInsets();

  const handleAdd = () => {
    if (!cardNumber || !expiry || !cvv) return;
    const newMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: cardNumber.slice(-4) || '0000',
      label: 'Personal Card',
      isDefault: user.paymentMethods.length === 0
    };
    // @ts-ignore
    updateUser({ paymentMethods: [newMethod, ...user.paymentMethods] });
    setIsAdding(false);
    setCardNumber('');
    setExpiry('');
    setCvv('');
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
          <Text style={[styles.title, { color: colors.text }]}>{t('paymentMethods') || 'Payment Methods'}</Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.gray100 }]} 
            onPress={onClose}
          >
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isAdding ? (
              <View style={styles.form}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Card</Text>
                
                {/* Visual Card Preview */}
                <View style={[styles.cardPreview, { backgroundColor: colors.accent }]}>
                  {/* Card Chip */}
                  <View style={styles.cardChip}>
                    <View style={[styles.chipLine, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                    <View style={[styles.chipLine, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                    <View style={[styles.chipLine, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                  </View>
                  
                  {/* Card Number */}
                  <View style={styles.cardNumberContainer}>
                    <Text style={styles.cardLabel}>CARD NUMBER</Text>
                    <Text style={styles.cardNumber}>
                      {cardNumber || '•••• •••• •••• ••••'}
                    </Text>
                  </View>
                  
                  {/* Bottom Row: Expiry & CVV */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.cardExpiryContainer}>
                      <Text style={styles.cardLabel}>EXPIRES</Text>
                      <Text style={styles.cardExpiry}>{expiry || 'MM/YY'}</Text>
                    </View>
                    <View style={styles.cardCvvContainer}>
                      <Text style={styles.cardLabel}>CVV</Text>
                      <Text style={styles.cardCvv}>{cvv ? '•'.repeat(cvv.length) : '•••'}</Text>
                    </View>
                  </View>
                  
                  {/* Card Type Logo Placeholder */}
                  <View style={styles.cardLogo}>
                    <Text style={styles.cardLogoText}>VISA</Text>
                  </View>
                </View>
                
                {/* Helper Text */}
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  Enter your card details as shown on your card
                </Text>
                
                <Input
                  label="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  leftIcon={<IconCreditCard size={18} color={colors.textMuted} />}
                />
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
                   <Input
                      label="Expiry"
                      value={expiry}
                      onChangeText={setExpiry}
                      placeholder="MM/YY"
                      containerStyle={{ flex: 1 }}
                      leftIcon={<IconCalendar size={18} color={colors.textMuted} />}
                    />
                    <Input
                      label="CVV"
                      value={cvv}
                      onChangeText={setCvv}
                      placeholder="123"
                      keyboardType="numeric"
                      containerStyle={{ flex: 1 }}
                      leftIcon={<IconLock size={18} color={colors.textMuted} />}
                    />
                </View>
                <View style={styles.formActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setIsAdding(false)}
                    variant="outline"
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="Save Card"
                    onPress={handleAdd}
                    variant="primary"
                    style={{ flex: 1, marginLeft: 8 }}
                  />
                </View>
              </View>
            ) : (
              user.paymentMethods && user.paymentMethods.length > 0 ? (
                 <View style={styles.list}>
                   {user.paymentMethods.map((pm: any) => {
                     const isSelected = selectedId ? (selectedId === pm.id) : pm.isDefault;
                     return (
                     <TouchableOpacity 
                       key={pm.id} 
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
                            onSelect(pm);
                            onClose();
                          } else {
                              // Set default
                             const updated = user.paymentMethods.map((p: any) => ({
                                 ...p, isDefault: p.id === pm.id
                             }));
                             // @ts-ignore
                             updateUser({ paymentMethods: updated });
                          }
                       }}
                     >
                       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <IconCreditCard size={24} color={isSelected ? colors.success : colors.text} />
                          <View>
                              <Text style={[styles.cardTitle, { color: colors.text }]}>•••• {pm.last4}</Text>
                              <Text style={[styles.cardText, { color: colors.textMuted }]}>{pm.label || 'Card'}</Text>
                          </View>
                       </View>
                       {isSelected && <IconCheck size={20} color={colors.success} />}
                     </TouchableOpacity>
                     );
                   })}
                   <Button
                      title="Add New Card"
                      onPress={() => setIsAdding(true)}
                      variant="primary"
                      size="md"
                      style={{ marginTop: 16 }}
                    />
                 </View>
              ) : (
                <View style={styles.emptyState}>
                  <IconCreditCard size={48} color={colors.gray200} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>No cards saved</Text>
                  <Button
                    title="Add New Card"
                    onPress={() => setIsAdding(true)}
                    variant="primary"
                    size="md"
                    style={{ marginTop: 16 }}
                  />
                </View>
              )
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingTop: 0,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 8,
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
    marginBottom: 0,
  },
  cardText: {
    fontSize: 12,
  },
  // Card Preview Styles
  cardPreview: {
    width: '100%',
    aspectRatio: 1.586, // Standard credit card ratio
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardChip: {
    width: 45,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    padding: 4,
    gap: 3,
    marginBottom: 20,
  },
  chipLine: {
    height: 3,
    borderRadius: 1.5,
  },
  cardNumberContainer: {
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 3,
    fontWeight: '600',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 32,
  },
  cardExpiryContainer: {},
  cardCvvContainer: {},
  cardExpiry: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  cardCvv: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 2,
  },
  cardLogo: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cardLogoText: {
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
  },
  helperText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
});
