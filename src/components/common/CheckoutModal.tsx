import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useModal, useToast } from '../../context';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import { AddressesModal } from './AddressesModal';
import { PaymentMethodsModal } from './PaymentMethodsModal';
import { CartContextType } from '../../types';
import Svg, { Path } from 'react-native-svg';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  cart?: CartContextType;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ visible, onClose, cart }) => {
  const { colors, t, user, updateUser, isDark } = useApp();
  const { showToast } = useToast();
  // Fallback if cart not passed (should be passed)
  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;
  const clearCart = cart?.clearCart || (() => {});
  
  const { openModal } = useModal();
  const insets = useSafeAreaInsets();
  
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<any>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);

  // Computed selected or default
  const activeAddress = selectedAddress || user.addresses?.find((a: any) => a.isDefault) || user.addresses?.[0];
  const activePayment = selectedPayment || user.paymentMethods?.find((p: any) => p.isDefault) || user.paymentMethods?.[0];

  const handlePlaceOrder = () => {
    const orderId = `#ORD-${Math.floor(Math.random() * 10000)}`;
    const createdAtTimestamp = Date.now();
    
    const newOrder = {
      id: orderId,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAtTimestamp, // Store timestamp for status update logic
      status: 'Processing',
      total: totalPrice,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      shippingAddress: activeAddress || { label: 'Default', street: 'No Address Selected', city: 'Tbilisi' },
      paymentMethod: activePayment ? `Card ending in ${activePayment.last4}` : 'Credit Card'
    };

    if (!activeAddress) {
       showToast('Please select an address', 'error');
       return;
    }

    // @ts-ignore - simplistic type handling for demo
    updateUser({ orders: [newOrder, ...user.orders] });
    
    // Clear and navigate
    clearCart();
    
    // Prepare order for detail view (which expects string address)
    const displayOrder = {
        ...newOrder,
        shippingAddress: `${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city}`
    };

    openModal('ORDER_DETAIL', { order: displayOrder });
    
    showToast('Order placed successfully!', 'success');

    // Auto-update order status after 1 minute (60000ms)
    setTimeout(() => {
      // Update the order status in user's orders
      const updatedOrders = user.orders.map((order: any) => {
        if (order.id === orderId && order.status === 'Processing') {
          return { ...order, status: 'Delivered' };
        }
        return order;
      });
      
      // Check if the order was found and updated
      const orderWasUpdated = updatedOrders.some(
        (order: any) => order.id === orderId && order.status === 'Delivered'
      );
      
      if (orderWasUpdated) {
        updateUser({ orders: updatedOrders });
        showToast(`Order ${orderId} has been delivered! 🎉`, 'success');
      }
    }, 60000); // 1 minute
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
            <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
            <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: colors.gray100 }]} 
                onPress={onClose}
            >
                <IconClose size={20} color={colors.text} />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
            {/* Items Summary */}
            <View style={[
                styles.section, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: colors.gray100,
                    shadowColor: isDark ? '#000' : '#888',
                    shadowOpacity: isDark ? 0.3 : 0.08,
                }
            ]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Items ({items.length})</Text>
                {items.length === 0 ? (
                    <Text style={{ color: colors.textMuted }}>Your cart is empty</Text>
                ) : (
                    items.map((item) => (
                        <View key={item.id} style={[styles.itemCard, { borderBottomColor: colors.gray100 }]}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemBrand, { color: colors.textMuted }]}>{item.brand}</Text>
                                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                                <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                                    Qty: {item.quantity} • ₾{item.price.toFixed(2)}
                                </Text>
                            </View>
                            <Text style={[styles.itemTotal, { color: colors.text }]}>
                                ₾{(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))
                )}
            </View>

            {/* Delivery Address */}
            <View style={[
                styles.section, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: colors.gray100,
                    shadowColor: isDark ? '#000' : '#888',
                    shadowOpacity: isDark ? 0.3 : 0.08,
                }
            ]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
                <View style={styles.infoRow}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>{activeAddress?.label || 'No Address Selected'}</Text>
                    <Text style={{ color: colors.textMuted, marginTop: 4 }}>{activeAddress ? `${activeAddress.street}, ${activeAddress.city}` : 'Please add an address'}</Text>
                </View>
                <Button 
                    title={activeAddress ? "Change Address" : "Add Address"}
                    onPress={() => setShowAddressModal(true)}
                    variant="outline"
                    style={{ marginTop: 8 }}
                />
            </View>

            {/* Payment Method */}
            <View style={[
                styles.section, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: colors.gray100,
                    shadowColor: isDark ? '#000' : '#888',
                    shadowOpacity: isDark ? 0.3 : 0.08,
                }
            ]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
                <View style={styles.infoRow}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                         {activePayment ? `Card •••• ${activePayment.last4}` : 'No Payment Method'}
                    </Text>
                    {activePayment && <Text style={{ color: colors.textMuted, marginTop: 4 }}>{activePayment.label || 'Personal Card'}</Text>}
                </View>
                <Button 
                    title={activePayment ? "Change Payment Method" : "Add Payment Method"}
                    onPress={() => setShowPaymentModal(true)}
                    variant="outline"
                    style={{ marginTop: 8 }}
                />
            </View>

            {/* Total & Action */}
             <View style={[
                styles.section, 
                { 
                    backgroundColor: colors.surface,
                    borderColor: colors.gray100,
                    shadowColor: isDark ? '#000' : '#888',
                    shadowOpacity: isDark ? 0.3 : 0.08,
                }
            ]}>
                <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
                    <Text style={[styles.totalValue, { color: colors.accent }]}>₾{totalPrice.toFixed(2)}</Text>
                </View>
                <Button 
                    title="Place Order" 
                    onPress={handlePlaceOrder}
                    variant="primary"
                    size="lg"
                    style={{ marginTop: 24 }}
                    disabled={items.length === 0}
                />
            </View>
        </ScrollView>
      </BottomSheetModal>
      
      {/* Nested Modals */}
      <AddressesModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(addr) => setSelectedAddress(addr)}
        selectedId={activeAddress?.id}
      />
      <PaymentMethodsModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={(pm) => setSelectedPayment(pm)}
        selectedId={activePayment?.id}
      />
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
    gap: 20,
  },
  section: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemBrand: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  infoRow: {
    marginBottom: 12,
  }
});
