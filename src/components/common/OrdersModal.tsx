import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useModal, useToast } from '../../context';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path } from 'react-native-svg';
import { Modal } from 'react-native';
import { OrderDetailModal } from './OrderDetailModal';
import { Button } from './Button';
import { CartContextType } from '../../types';

interface OrdersModalProps {
  visible: boolean;
  onClose: () => void;
  cart?: CartContextType;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconPackage = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M16.5 9.4 7.5 4.21" />
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.27 6.96 12 12.01l8.73-5.05" />
    <Path d="M12 22.08V12" />
  </Svg>
);

export const OrdersModal: React.FC<OrdersModalProps> = ({ visible, onClose, cart }) => {
  const { colors, t, isDark, user, updateUser } = useApp();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const insets = useSafeAreaInsets();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleCancelOrder = (orderId: string) => {
      const updatedOrders = user.orders.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      );
      // @ts-ignore
      updateUser({ orders: updatedOrders });
      showToast('Order cancelled', 'info');
      
      // Update local selected order to reflect change immediately
      if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
  };

  const handleReorder = (orderId: string) => {
      const order = user.orders.find(o => o.id === orderId);
      if (order && cart) {
          order.items.forEach(item => {
              cart.addToCart(item);
          });
          showToast('Order items added to cart', 'success');
      }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#10B981';
      case 'processing': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return colors.text;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <BottomSheetModal onClose={onClose} height="100%" showDragHandle={true}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('myOrders') || 'My Orders'}</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.gray100 }]} onPress={onClose}>
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
          {(!user.orders || user.orders.length === 0) ? (
            <View style={styles.emptyState}>
              <IconPackage size={48} color={colors.gray200} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No past orders</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {user.orders.map((order) => {
                const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
                const statusColor = getStatusColor(order.status);
                const orderImage = order.items[0]?.image || '';
                const isProcessing = order.status.toLowerCase() === 'processing' || order.status.toLowerCase() === 'pending';
                
                return (
                <View 
                   key={order.id} 
                   style={[
                       styles.orderCardContainer, 
                       { 
                           backgroundColor: colors.surface, 
                           borderColor: colors.gray100,
                           shadowColor: isDark ? '#000' : '#888',
                           shadowOpacity: isDark ? 0.3 : 0.08,
                       }
                   ]}
                >
                    <TouchableOpacity 
                        style={styles.orderCardContent}
                        activeOpacity={0.7}
                        onPress={() => {
                            setSelectedOrder({
                                ...order,
                                date: order.createdAt,
                                items: order.items,
                                shippingAddress: order.shippingAddress ? (typeof order.shippingAddress === 'string' ? order.shippingAddress : `${order.shippingAddress.street}, ${order.shippingAddress.city}`) : 'N/A',
                                paymentMethod: (order as any).paymentMethod || 'Credit Card',
                                trackingSteps: []
                            });
                        }}
                    >
                        <View style={[styles.orderHeaderRow, { borderBottomColor: colors.gray100 }]}>
                             <View>
                                <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                                <Text style={[styles.orderDate, { color: colors.textMuted }]}>{order.createdAt}</Text>
                             </View>
                             <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                                <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                             </View>
                        </View>

                        <View style={styles.orderBody}>
                            <View style={[styles.imageWrapper, { backgroundColor: colors.background }]}>
                                {orderImage ? (
                                    <Image source={{ uri: orderImage }} style={styles.orderImage} resizeMode="contain" />
                                ) : (
                                    <IconPackage size={28} color={colors.textMuted} />
                                )}
                            </View>
                            <View style={styles.orderMeta}>
                                <Text style={[styles.itemCount, { color: colors.text }]}>
                                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                                </Text>
                                <Text style={[styles.itemsPreview, { color: colors.textMuted }]} numberOfLines={1}>
                                    {order.items.map(i => i.name).join(', ')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    
                    {/* Clean Footer with Total and Actions */}
                    <View style={[styles.cardActions, { borderTopColor: colors.gray100 }]}>
                        <View>
                            <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Total</Text>
                            <Text style={[styles.totalAmount, { color: colors.accent }]}>₾{order.total.toFixed(2)}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                            {isProcessing && (
                                <Button 
                                    title="Cancel" 
                                    size="sm" 
                                    variant="outline" 
                                    textStyle={{ color: colors.error, fontSize: 13, fontWeight: '600' }}
                                    style={{ borderColor: colors.gray200, height: 38, paddingHorizontal: 14 }}
                                    onPress={() => handleCancelOrder(order.id)}
                                />
                            )}
                            <Button 
                                title="Reorder" 
                                size="sm" 
                                variant="primary" 
                                style={{ height: 38, paddingHorizontal: 16 }}
                                textStyle={{ fontSize: 13 }}
                                onPress={() => handleReorder(order.id)}
                            />
                        </View>
                    </View>
                </View>
              )})}
            </View>
          )}

        </ScrollView>
      </BottomSheetModal>
      
      {/* Nested Detail Modal */}
      <OrderDetailModal 
        visible={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancel={handleCancelOrder}
        onReorder={handleReorder}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    padding: 20,
    flexGrow: 1,
  },
  list: {
    gap: 16,
  },
  orderCardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  orderCardContent: {
    padding: 16,
    paddingBottom: 12, // Less padding bottom since footer is attached
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  imageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
  orderBody: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
  },
  orderMeta: {
    flex: 1,
    justifyContent: 'center'
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderDate: {
    fontSize: 12,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemsPreview: {
      fontSize: 12,
  },
  totalLabel: {
      fontSize: 11,
      textTransform: 'uppercase',
      fontWeight: '600',
      marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
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
  cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: 12,
      borderTopWidth: 1,
  },
  actionButtons: {
      flexDirection: 'row',
      gap: 8,
  }
});
