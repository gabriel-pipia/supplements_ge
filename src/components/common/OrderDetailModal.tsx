import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { Modal } from 'react-native';
import { ShareModal } from './ShareModal';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetails {
  id: string;
  date: string;
  status: string; // relaxed type to matching lowercase/uppercase
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingSteps?: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

interface OrderDetailModalProps {
  visible: boolean;
  order: OrderDetails | null;
  onClose: () => void;
  onCancel?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconShare = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <Polyline points="16 6 12 2 8 6" />
    <Line x1="12" y1="2" x2="12" y2="15" />
  </Svg>
);

const IconCheck = ({ size = 16, color = '#FFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, order, onClose, onCancel, onReorder }) => {
  const { colors, t, isDark } = useApp();
  const insets = useSafeAreaInsets();
  const [isShareVisible, setIsShareVisible] = useState(false);

  if (!order) return null;
  
  // Normalize status check (case insensitive)
  const isProcessing = order.status.toLowerCase() === 'processing' || order.status.toLowerCase() === 'pending';
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#10B981';
      case 'processing': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return colors.text;
    }
  };

  const statusColor = getStatusColor(order.status);

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <BottomSheetModal onClose={onClose} height="100%" showDragHandle={true}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>{t('orderDetails') || 'Order Details'}</Text>
              <View style={styles.headerSub}>
                 <Text style={[styles.subtitle, { color: colors.textMuted }]}>{order.id}</Text>
                 <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                 </View>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.gray100 }]} 
                onPress={() => setIsShareVisible(true)}
              >
                <IconShare size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: colors.gray100 }]} 
                onPress={onClose}
              >
                <IconClose size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
            
            {/* Tracking Timeline */}
            {order.trackingSteps && order.trackingSteps.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Status</Text>
              <View style={styles.timeline}>
                {order.trackingSteps.map((step, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[
                        styles.timelineDot, 
                        { backgroundColor: step.completed ? colors.accent : colors.gray200 }
                      ]}>
                        {step.completed && <IconCheck size={10} color="#FFF" />}
                      </View>
                      {index < (order.trackingSteps?.length || 0) - 1 && (
                        <View style={[
                          styles.timelineLine, 
                          { backgroundColor: step.completed ? colors.accent : colors.gray200 }
                        ]} />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, { 
                        color: step.completed ? colors.text : colors.textMuted,
                        fontWeight: step.completed ? '700' : '400'
                      }]}>
                        {step.title}
                      </Text>
                      <Text style={[styles.timelineDate, { color: colors.textMuted }]}>{step.date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            )}

            {/* Order Items */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
              {order.items.map((item, index) => (
                <View key={item.id} style={[
                    styles.itemCard, 
                    { borderBottomColor: colors.gray100, borderBottomWidth: index === order.items.length - 1 ? 0 : 1 }
                ]}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                    <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                      Qty: {item.quantity}  ×  ₾{item.price.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={[styles.itemTotal, { color: colors.text }]}>
                    ₾{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={[styles.totalSection, { borderTopColor: colors.gray100 }]}>
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: colors.textMuted, fontSize: 13 }]}>Subtotal</Text>
                    <Text style={[styles.totalValueSecondary, { color: colors.text }]}>₾{order.total.toFixed(2)}</Text>
                  </View>
                   <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: colors.textMuted, fontSize: 13 }]}>Shipping</Text>
                    <Text style={[styles.totalValueSecondary, { color: colors.success }]}>Free</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.gray100, marginVertical: 8 }]} />
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabelFinal, { color: colors.text }]}>Total</Text>
                    <Text style={[styles.totalValueFinal, { color: colors.accent }]}>₾{order.total.toFixed(2)}</Text>
                  </View>
              </View>
            </View>

            {/* Shipping & Payment Grid */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.infoBox, { backgroundColor: colors.surface, flex: 1, borderColor: colors.gray100 }]}>
                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Shipping To</Text>
                     <Text style={[styles.infoValue, { color: colors.text }]}>{order.shippingAddress}</Text>
                </View>
                <View style={[styles.infoBox, { backgroundColor: colors.surface, flex: 1, borderColor: colors.gray100 }]}>
                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Payment</Text>
                     <Text style={[styles.infoValue, { color: colors.text }]}>{order.paymentMethod}</Text>
                </View>
            </View>

             {/* Action Buttons Row */}
            {(onReorder || (isProcessing && onCancel)) && (
               <View style={styles.actionsRow}>
                   {isProcessing && onCancel && (
                       <Button 
                           title="Cancel Order"
                           onPress={() => onCancel(order.id)}
                           variant="outline"
                           style={{ flex: 1, height: 44, borderColor: colors.gray200 }}
                           textStyle={{ color: colors.error, fontWeight: '600' }}
                       />
                   )}
                   {onReorder && (
                       <Button 
                           title="Reorder"
                           onPress={() => onReorder(order.id)}
                           variant="primary"
                           style={{ flex: 1, height: 44 }}
                       />
                   )}
               </View>
            )}

          </ScrollView>
        </BottomSheetModal>
      </Modal>

      <ShareModal
        visible={isShareVisible}
        onClose={() => setIsShareVisible(false)}
        item={{
            id: order.id,
            title: `Order ${order.id}`,
            description: `Check out my order details! Total: ₾${order.total.toFixed(2)}`,
            image: order.items[0]?.image || '', // Use first item image as preview
            type: 'product' // Reusing product type for now or add 'order' type if needed
        }}
      />
    </>
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
  headerSub: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  section: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    ...Platform.select({
       web: { 
         boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
       } as any 
    })
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.8
  },
  timeline: {
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  itemMeta: {
    fontSize: 12,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalSection: {
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: 1,
      borderStyle: 'dashed',
      gap: 6
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalValueSecondary: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalLabelFinal: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValueFinal: {
    fontSize: 20,
    fontWeight: '800',
  },
  infoBox: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 2,
      ...Platform.select({
         web: { 
           boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
         } as any 
      }),
      gap: 6
  },
  infoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  divider: {
    height: 1,
  },
  actionsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
  }
});
