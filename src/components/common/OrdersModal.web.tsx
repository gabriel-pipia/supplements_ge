import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useApp, useModal, useToast } from '../../context';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import Svg, { Path } from 'react-native-svg';
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

const webStyles = {
    pointer: { cursor: 'pointer' } as any,
    cardHover: {
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    } as any
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ visible, onClose, cart }) => {
  const { colors, t, user, updateUser, isDark } = useApp();
  const { openModal } = useModal();
  const { showToast } = useToast();

  const handleCancelOrder = (orderId: string, e?: any) => {
      e?.stopPropagation();
      const updatedOrders = user.orders.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      );
      // @ts-ignore
      updateUser({ orders: updatedOrders });
      showToast('Order cancelled', 'info');
  };

  const handleReorder = (orderId: string, e?: any) => {
      e?.stopPropagation();
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
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal onClose={onClose} height="90%" showDragHandle={false}>
          <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
               <Text style={[styles.title, { color: colors.text }]}>{t('myOrders') || 'My Orders'}</Text>
               <TouchableOpacity 
                    style={[styles.closeButton, { backgroundColor: colors.gray100 }, webStyles.pointer]} 
                    onPress={onClose}
                >
                    <IconClose size={20} color={colors.text} />
               </TouchableOpacity>
          </View>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent} 
          >
              {user.orders.length === 0 ? (
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
                            <TouchableOpacity
                                key={order.id}
                                style={[
                                    styles.orderCard,
                                    { 
                                        backgroundColor: colors.surface, 
                                        borderColor: colors.gray100,
                                        shadowColor: isDark ? '#000' : '#888',
                                        shadowOpacity: isDark ? 0.3 : 0.08,
                                    },
                                    webStyles.pointer,
                                    webStyles.cardHover
                                ]}
                                // @ts-ignore
                                onMouseEnter={(e: any) => { 
                                    e.currentTarget.style.transform = 'scale(1.005)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                }}
                                // @ts-ignore
                                onMouseLeave={(e: any) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                onPress={() => {
                                     openModal('ORDER_DETAIL', {
                                        order: {
                                            ...order,
                                            date: order.createdAt,
                                            items: order.items.map(i => ({
                                               id: i.id,
                                               name: i.name,
                                               price: i.price,
                                               quantity: i.quantity,
                                               image: i.image
                                            })),
                                            shippingAddress: order.shippingAddress ? (typeof order.shippingAddress === 'string' ? order.shippingAddress : `${order.shippingAddress.street}, ${order.shippingAddress.city}`) : 'N/A',
                                            paymentMethod: (order as any).paymentMethod || 'Credit Card',
                                            trackingSteps: []
                                          },
                                        onCancel: handleCancelOrder,
                                        onReorder: handleReorder
                                     })
                                }}
                            >
                                <View style={styles.cardMain}>
                                    <View style={[styles.imageWrapper, { backgroundColor: colors.background }]}>
                                        <Image source={{ uri: orderImage }} style={styles.orderImage} resizeMode="contain" />
                                    </View>
                                    
                                    <View style={styles.orderInfo}>
                                        <View style={styles.orderHeader}>
                                             <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                                             <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                                                 <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                                             </View>
                                        </View>
                                        <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>{order.createdAt}</Text>
                                        <Text style={{ fontSize: 13, color: colors.text }}>{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</Text>
                                    </View>
                                </View>
                                
                                <View style={[styles.cardFooter, { borderTopColor: colors.gray100 }]}>
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
                                                textStyle={{ color: colors.error, fontSize: 12, fontWeight: '600' }}
                                                style={{ borderColor: colors.gray200, height: 36, paddingHorizontal: 12 }}
                                                onPress={(e: any) => handleCancelOrder(order.id, e)}
                                            />
                                        )}
                                        <Button 
                                            title="Reorder" 
                                            size="sm" 
                                            variant="primary" 
                                            style={{ height: 36, paddingHorizontal: 14 }}
                                            textStyle={{ fontSize: 12 }}
                                            onPress={(e: any) => handleReorder(order.id, e)}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
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
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
    },
    list: {
        gap: 16,
    },
    orderCard: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 8,
    },
    cardMain: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    imageWrapper: {
        width: 64,
        height: 64,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderImage: {
        width: '100%',
        height: '100%',
    },
    orderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        backgroundColor: 'transparent'
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
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
    },
});
