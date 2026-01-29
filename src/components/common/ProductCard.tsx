import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Animated, StyleSheet, Platform } from 'react-native';
import { Product } from '../../types';
import { useApp } from '../../context';
import { IconPlus, IconHeart } from '../icons';
import { useResponsive } from '../../hooks';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: () => void;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  index, 
  onAddToCart,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  viewMode = 'grid',
}) => {
  const { colors, isDark } = useApp();
  const { cardWidth } = useResponsive();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.2,
        friction: 3,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        tension: 300,
        useNativeDriver: true,
      }),
    ]).start();
    onToggleFavorite?.();
  };

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  if (viewMode === 'list') {
    return (
      <Animated.View
        style={[
          styles.listCard,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.gray100,
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            shadowColor: isDark ? '#000' : '#888',
            shadowOpacity: isDark ? 0.3 : 0.08,
          },
        ]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          style={styles.listCardInner}
        >
          {/* Product Image */}
          <View style={[styles.listImageContainer]}>
            <Image
              source={{ uri: product.image }}
              style={styles.listImage}
              resizeMode="cover"
            />
            {discountPercent && (
              <View style={[styles.discountBadge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.discountText, { color: colors.white }]}>-{discountPercent}%</Text>
              </View>
            )}
          </View>

          {/* Product Info */}
          <View style={styles.listInfo}>
            <Text style={[styles.listBrand, { color: colors.textMuted }]}>{product.brand}</Text>
            <Text style={[styles.listName, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
            
            {/* Price */}
            <View style={styles.listPriceRow}>
              <Text style={[styles.listPrice, { color: colors.text }]}>₾{product.price}</Text>
              {product.originalPrice && (
                <Text style={[styles.listOriginalPrice, { color: colors.textMuted }]}>₾{product.originalPrice}</Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.listActions}>
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={[styles.listFavoriteButton, { backgroundColor: colors.gray50 }]}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <IconHeart 
                  size={18} 
                  color={isFavorite ? colors.accent : colors.gray400} 
                />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddToCart}
              style={[styles.listAddButton, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <IconPlus size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // Grid View (default)
  return (
    <Animated.View
      style={[
        styles.card,
        { 
          width: cardWidth,
          backgroundColor: colors.surface,
          borderColor: colors.gray100,
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
          shadowColor: isDark ? '#000' : '#888',
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.cardInner}
      >
        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: colors.gray100 }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Discount Badge */}
          {discountPercent && (
            <View style={[styles.discountBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.discountText, { color: colors.white }]}>-{discountPercent}%</Text>
            </View>
          )}

          {/* Favorite Button - Absolute Top Right */}
          <TouchableOpacity
            onPress={handleFavoritePress}
            style={[styles.favoriteButton, { backgroundColor: isFavorite ? colors.accent : colors.surface }]}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <IconHeart 
                size={16} 
                color={isFavorite ? colors.white : colors.gray400}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <Text style={[styles.brand, { color: colors.textMuted }]}>{product.brand}</Text>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>

          {/* Price Row with Add Button */}
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.text }]}>₾{product.price}</Text>
              {product.originalPrice && (
                <Text style={[styles.originalPrice, { color: colors.textMuted }]}>₾{product.originalPrice}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={onAddToCart}
              style={[styles.addButton, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <IconPlus size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Grid View Styles
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardInner: {
    flex: 1,
  },
  imageContainer: {
    padding: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 16, // Softer radius for image
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    padding: 12,
  },
  brand: {
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 12,
    marginLeft: 6,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // List View Styles
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  listCardInner: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  listImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listInfo: {
    flex: 1,
    marginLeft: 16,
  },
  listBrand: {
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  listName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  listOriginalPrice: {
    fontSize: 12,
    marginLeft: 6,
    textDecorationLine: 'line-through',
  },
  listActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  listFavoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAddButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
