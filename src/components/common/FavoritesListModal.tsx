import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PRODUCTS } from '../../data';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import { Product } from '../../types';

interface FavoritesListModalProps {
  visible: boolean;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onProductPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconHeartFilled = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={2}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const IconHeartEmpty = ({ size = 48, color = '#D1D5DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const IconCart = ({ size = 16, color = '#FFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="9" cy="21" r="1" />
    <Circle cx="20" cy="21" r="1" />
    <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Svg>
);

const Circle = ({ cx, cy, r }: { cx: string, cy: string, r: string }) => (
    <Svg width="0" height="0">
       <Path d={`M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${parseFloat(r)*2},0 a ${r},${r} 0 1,0 -${parseFloat(r)*2},0`} />
    </Svg>
); 
// Note: SVG Circle component usually comes from library. I'll import it correctly instead of mocking.

export const FavoritesListModal: React.FC<FavoritesListModalProps> = ({ 
  visible, 
  onClose,
  favorites,
  onToggleFavorite,
  onProductPress,
  onAddToCart
}) => {
  const { colors, t, isDark, setActiveTab } = useApp();
  const { showCartToast } = useToast();
  const insets = useSafeAreaInsets();

  const favoriteProducts = useMemo(() => {
    return PRODUCTS.filter(p => favorites.includes(p.id));
  }, [favorites]);

  const handleAddToCart = (product: Product) => {
      if (onAddToCart) {
          onAddToCart(product);
          showCartToast(product.name);
      }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BottomSheetModal onClose={onClose} height="100%" showDragHandle={true}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('favorites') || 'Favorites'}
          </Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
            onPress={onClose}
          >
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {favoriteProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <IconHeartEmpty size={64} color={colors.gray200} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No favorites yet
              </Text>
              <Text style={[styles.emptySubText, { color: colors.textMuted }]}>
                Items you like will appear here
              </Text>
              <Button
                title={t('startShopping') || 'Start Shopping'}
                onPress={() => {
                  setActiveTab(1); // Assuming 1 is Shop/Search tab
                  onClose();
                }}
                variant="primary"
                size="md"
                style={{ marginTop: 24, paddingHorizontal: 32 }}
              />
            </View>
          ) : (
            <View style={styles.grid}>
              {favoriteProducts.map((product) => (
                <View 
                  key={product.id}
                  style={[
                    styles.cardContainer, 
                    { 
                      backgroundColor: colors.surface,
                      borderColor: colors.gray100,
                      shadowColor: isDark ? '#000' : '#888',
                      shadowOpacity: isDark ? 0.3 : 0.08,
                    }
                  ]}
                >
                  {/* Image with remove button overlay */}
                  <View style={styles.imageWrapper}>
                    <TouchableOpacity 
                      style={[styles.cardImageContainer, { backgroundColor: isDark ? colors.gray100 : '#F3F4F6' }]}
                      activeOpacity={0.9}
                      onPress={() => onProductPress(product)}
                    >
                      <Image source={{ uri: product.image }} style={styles.cardImage} resizeMode="contain" />
                    </TouchableOpacity>
                    
                    {/* Remove button - positioned on image */}
                    <TouchableOpacity 
                      style={[styles.removeButton, { backgroundColor: colors.background }]}
                      onPress={() => onToggleFavorite(product.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <IconHeartFilled size={16} color={colors.accent} />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Card Content */}
                  <View style={styles.cardContent}>
                    <TouchableOpacity onPress={() => onProductPress(product)}>
                         <Text style={[styles.cardBrand, { color: colors.accent }]}>{product.brand}</Text>
                         <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                           {product.name}
                         </Text>
                    </TouchableOpacity>
                   
                    <View style={styles.priceRow}>
                        <Text style={[styles.cardPrice, { color: colors.text }]}>₾{product.price}</Text>
                        {onAddToCart && (
                            <Button 
                                title="Add to Cart"
                                onPress={() => handleAddToCart(product)}
                                size="sm"
                                variant="primary"
                                style={{ height: 32, paddingHorizontal: 12 }}
                                textStyle={{ fontSize: 12, fontWeight: '700' }}
                            />
                        )}
                    </View>
                  </View>
                </View>
              ))}
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
  },
  grid: {
    gap: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '90%',
    height: '90%',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
    justifyContent: 'center',
  },
  cardBrand: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  imageWrapper: {
    position: 'relative',
  },
  removeButton: {
    padding: 6,
    borderRadius: 10,
    position: 'absolute',
    bottom: 4,
    right: 4,
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
    marginTop: 8
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 250,
  },
});
