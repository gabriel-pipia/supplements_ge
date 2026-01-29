import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useModal } from '../../context';
import { CartContextType } from '../../types';
import { IconX, IconCart } from '../icons';
import { CartItemRow } from './CartItemRow';
import { BottomSheetModal, Button } from '../common';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CartBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  cart: CartContextType;
}

export const CartBottomSheet: React.FC<CartBottomSheetProps> = ({
  visible,
  onClose,
  cart,
}) => {
  const { colors, t, setActiveTab } = useApp();
  const { openModal } = useModal();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BottomSheetModal onClose={onClose} height="75%">

        {/* Header */}
                        <View style={styles.header}>
                          <Text style={[styles.title, { color: colors.text }]}>
                            {t('cartTitle')} ({cart.totalItems})
                          </Text>
                          <TouchableOpacity 
                            style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
                            onPress={onClose}
                          >
                                        <IconX size={20} color={colors.text} />
                          </TouchableOpacity>
                        </View>

        {/* Cart Items */}
        {cart.items.length > 0 ? (
          <>
            <ScrollView 
              style={styles.itemsContainer}
              showsVerticalScrollIndicator={false}
            >
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(q) => cart.updateQuantity(item.id, q)}
                  onRemove={() => cart.removeFromCart(item.id)}
                />
              ))}
            </ScrollView>

            {/* Total & Checkout */}
            <View style={[styles.footer, { borderTopColor: colors.gray100, paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textMuted }]}>{t('total')}:</Text>
                <Text style={[styles.totalAmount, { color: colors.text }]}>₾{cart.totalPrice.toFixed(2)}</Text>
              </View>
              <Button
                title={t('checkout')}
                onPress={() => {
                  onClose();
                  openModal('CHECKOUT');
                }}
                variant="primary"
                size="lg"
                style={styles.checkoutButton}
              />
            </View>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <IconCart size={64} color={colors.gray200} />
            <Text style={[styles.emptyCartText, { color: colors.textMuted }]}>{t('cartEmpty')}</Text>
            <Button
              title={t('startShopping') || 'Start Shopping'}
              onPress={() => {
                setActiveTab(1);
                onClose();
              }}
              variant="primary"
              size="md"
              style={{ marginTop: 24 }}
            />
          </View>
        )}
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
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: '900',
  },
  checkoutButton: {
    paddingVertical: 18, // Adjusted since Button has its own padding, but keeping this for now if needed or remove.
                         // Actually Button handles padding. Let's make it minimal or remove.
                         // Wait, in previous replacement I used style={styles.checkoutButton}.
                         // Button component uses 'container' style.
                         // Let's just remove the explicit padding from here and let Button handle it,
                         // or override it if I assume Button defaults are different.
                         // I will leave it empty or remove.
    marginTop: 10,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
});
