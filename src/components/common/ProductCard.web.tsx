import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Animated, StyleSheet, Platform } from 'react-native';
import { Product } from '../../types';
import { useApp } from '../../context';
import { IconPlus, IconHeart } from '../icons';
import { useResponsive } from '../../hooks';

// Web specific styles
const webStyles = {
  pointer: {
    cursor: 'pointer',
  } as any,
  container: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  } as any,
  cardHover: {
    transform: [{ scale: 1.02 }],
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  } as any,
};

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
  const { columns, gap } = useResponsive();
  const [isHovered, setIsHovered] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // Dynamic width calculation for Web Grid
  const webGridWidth = `calc((100% - ${gap * (columns - 1)}px) / ${columns})`;

  if (viewMode === 'list') {
    return (
      <Animated.View
        style={[
          styles.listCard,
          { 
            opacity: fadeAnim,
            borderColor: colors.gray100,
            backgroundColor: colors.surface,
          },
          webStyles.container,
          isHovered && webStyles.cardHover
        ]}
        // @ts-ignore - Web event handlers
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Pressable
          onPress={onPress}
          style={[styles.listCardInner, webStyles.pointer]}
        >
          {/* Product Image */}
          <View style={[styles.listImageContainer, { backgroundColor: colors.gray50 }]}>
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
              onPress={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.();
              }}
              style={[styles.listFavoriteButton, { backgroundColor: colors.gray50 }, webStyles.pointer]}
            >
              <IconHeart 
                size={18} 
                color={isFavorite ? colors.accent : colors.gray400} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart();
              }}
              style={[styles.listAddButton, { backgroundColor: colors.accent }, webStyles.pointer]}
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
          // Use calculated width to respect columns strictly
          width: webGridWidth as any,
          // Removed flex: 1 to prevent single items from stretching full width
          minWidth: 160, 
          opacity: fadeAnim,
          borderColor: colors.gray100,
          backgroundColor: colors.surface,
        },
        webStyles.container,
        isHovered && webStyles.cardHover
      ]}
      // @ts-ignore - Web event handlers
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Pressable
        onPress={onPress}
        style={[styles.cardInner, webStyles.pointer]}
      >
        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}>
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

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
            }}
            style={[styles.favoriteButton, { backgroundColor: colors.surface }, webStyles.pointer]}
          >
            <IconHeart 
              size={16} 
              color={isFavorite ? colors.accent : colors.gray400} 
            />
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
              onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart();
              }}
              style={[styles.addButton, { backgroundColor: colors.accent }, webStyles.pointer]}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    // Web specific - optimized shadow
    ...Platform.select({
        web: {
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }
    }) as any,
  },
  cardInner: {
    flex: 1,
  },
  imageContainer: {
    padding: 12,
    position: 'relative',
    height: 140, // Fixed height for web grid consistency
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    objectFit: 'contain',
  } as any,
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
    height: 36, 
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
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    marginLeft: 6,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List View Styles
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
    ...Platform.select({
        web: {
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
    }) as any,
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
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '700',
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
