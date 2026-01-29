import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image,
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, useModal, useToast } from '../context';
import { CartContextType } from '../types';
import { IconCart, IconPlus, IconMinus, IconTrash } from '../components/icons';
import { Button } from '../components/common/Button';
import { CustomRefreshControl } from '../components/common';

interface CartScreenProps {
  cart: CartContextType;
}

export const CartScreen: React.FC<CartScreenProps> = ({ cart }) => {
  const { colors, t, isGuest } = useApp();
  const { openModal } = useModal();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate cart refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  /* import useToast from context */
  const { showToast } = useToast();

  const handleCheckout = () => {
    if (isGuest) {
      openModal('AUTH');
      return;
    }

    if (cart.items.length === 0) {
      showToast(t('cartEmpty') || 'Cart is empty', 'error');
      return;
    } else {
      openModal('CHECKOUT');
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('cartTitle')}</Text>
          {cart.items.length > 0 && (
            <TouchableOpacity onPress={cart.clearCart}>
              <Text style={[styles.clearText, { color: colors.accent }]}>{t('clear')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {cart.items.length > 0 ? (
          <CustomRefreshControl 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
          >
              {cart.items.map((item) => (
                <View key={item.id} style={[styles.cartItem, { backgroundColor: colors.surface }]}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemBrand, { color: colors.textMuted }]}>{item.brand}</Text>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.itemPriceRow}>
                      <Text style={[styles.itemPrice, { color: colors.accent }]}>₾{item.price}</Text>
                      {item.originalPrice && (
                        <Text style={[styles.itemOriginalPrice, { color: colors.textMuted }]}>₾{item.originalPrice}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.quantityColumn}>
                    <TouchableOpacity
                      onPress={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      style={[styles.quantityButton, { backgroundColor: colors.accent }]}
                    >
                      <IconPlus size={16} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => cart.updateQuantity(item.id, item.quantity - 1)}
                      style={[styles.quantityButton, styles.quantityButtonMinus, { backgroundColor: colors.gray100 }]}
                    >
                      <IconMinus size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                    onPress={() => cart.removeFromCart(item.id)}
                    style={styles.deleteButton}
                  >
                    <IconTrash size={20} color={colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Order Summary */}
              <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('orderDetails')}</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{t('productsCount')} ({cart.totalItems})</Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>₾{cart.totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{t('delivery')}</Text>
                  <Text style={[styles.summaryValueFree, { color: colors.success }]}>{t('free')}</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.gray200 }]} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>{t('total')}</Text>
                  <Text style={[styles.totalValue, { color: colors.accent }]}>₾{cart.totalPrice.toFixed(2)}</Text>
                </View>
              </View>

              {/* Checkout Button - Inside Scroll */}
              <View style={[styles.checkoutContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.checkoutInfo}>
                  <Text style={[styles.checkoutLabel, { color: colors.textMuted }]}>{t('total')}:</Text>
                  <Text style={[styles.checkoutTotal, { color: colors.text }]}>₾{cart.totalPrice.toFixed(2)}</Text>
                </View>
                <Button
                  title={t('checkout')}
                  onPress={handleCheckout}
                  variant="primary"
                  size="lg"
                  style={{ flex: 1, maxWidth: 200 }}
                />
            </View>
          </CustomRefreshControl>
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: colors.gray100 }]}>
              <IconCart size={64} color={colors.gray300} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('cartEmpty')}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {t('cartEmptySubtitle')}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemBrand: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  quantityColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonMinus: {
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  summaryValueFree: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    marginHorizontal: 0,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkoutInfo: {
    marginRight: 16,
  },
  checkoutLabel: {
    fontSize: 12,
  },
  checkoutTotal: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
