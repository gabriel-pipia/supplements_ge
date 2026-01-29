import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { CartItem } from '../../types';
import { useApp } from '../../context';
import { IconPlus, IconMinus, IconTrash } from '../icons';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}


export const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const { colors } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.gray50 }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.brand, { color: colors.textMuted }]}>{item.brand}</Text>
        <Text style={[styles.price, { color: colors.accent }]}>₾{item.price}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => onUpdateQuantity(item.quantity - 1)}
          style={[styles.quantityButton, { backgroundColor: colors.surface }]}
        >
          <IconMinus size={14} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => onUpdateQuantity(item.quantity + 1)}
          style={[styles.quantityButton, styles.quantityButtonAdd, { backgroundColor: colors.accent }]}
        >
          <IconPlus size={14} color={colors.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
        <IconTrash size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  brand: {
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonAdd: {},
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 12,
  },
});
