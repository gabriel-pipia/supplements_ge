import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image,
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  Platform,
  BackHandler,
  useWindowDimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context';
import { Product } from '../../types';
import { PRODUCTS } from '../../data';
import { IconHeart, IconPlus, IconMinus, IconStar } from '../icons';
import { ProductReviewModal } from './ProductReviewModal';
import { ShareModal } from './ShareModal';
import { ImagePreviewModal } from './ImagePreviewModal';
import { BottomSheetModal, BottomSheetModalRef } from './BottomSheetModal';
import { Button } from './Button';
import Svg, { Path } from 'react-native-svg';

// Mobile breakpoint for responsive layout
const MOBILE_BREAKPOINT = 768;
const WEB_MODAL_MAX_WIDTH = 550;

// Back Icon 
const IconBack = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

// Share Icon
const IconShare = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Svg>
);

// Chevron Icon
const IconChevron = ({ size = 20, color = '#18181B', direction = 'down' }: { size?: number; color?: string; direction?: 'up' | 'down' }) => (
  <Svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth={2}
    style={{ transform: [{ rotate: direction === 'up' ? '180deg' : '0deg' }] }}
  >
    <Path d="m6 9 6 6 6-6" />
  </Svg>
);

// Check Icon
const IconCheck = ({ size = 16, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

interface ProductDetailModalProps {
  visible: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onProductPress?: (product: Product) => void;
}

const generateProductImages = (baseImage: string) => [
  baseImage,
  baseImage.replace('w=400', 'w=500'),
  baseImage.replace('h=400', 'h=500'),
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  onProductPress,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();
  const windowDimensions = useWindowDimensions();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [containerWidth, setContainerWidth] = useState(windowDimensions.width);
  const heartScale = useRef(new Animated.Value(1)).current;
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  // Calculate the actual image width based on container
  const isMobileLayout = windowDimensions.width < MOBILE_BREAKPOINT;
  const modalWidth = Platform.OS === 'web' && !isMobileLayout 
    ? Math.min(WEB_MODAL_MAX_WIDTH, windowDimensions.width - 32)
    : containerWidth;
  const imageSlideWidth = modalWidth - 32; // Account for padding

  // Handle layout change to get accurate container width
  const handleLayoutChange = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleClosePress();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [visible]);

  // Scroll to top when product changes
  useEffect(() => {
    if (visible && product) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [product?.id, visible]);

  if (!product) return null;

  const productImages = generateProductImages(product.image);

  const similarProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setQuantity(1);
  };



  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
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
    onToggleFavorite();
  };

  const handleImageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / imageSlideWidth);
    setActiveImageIndex(slideIndex);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Product details sections
  const detailsSections = [
    {
      id: 'description',
      title: t('description'),
      content: product.description || (t('description') + ': ' + t('original')),
    },
    {
      id: 'ingredients',
      title: t('ingredients'),
      content: t('ingredients') + ' 100%',
    },
    {
      id: 'usage',
      title: t('usage'),
      content: t('usage') + ' 1 ' + t('servings'),
    },
  ];

  // Product specs
  const specs = [
    { label: t('weight'), value: '908 ' + t('weight').charAt(0) },
    { label: t('servings'), value: '30' },
    { label: t('flavor'), value: 'Demo' },
    { label: t('shelfLife'), value: '24 ' + t('months') },
  ];

  return (
    <BottomSheetModal 
      ref={bottomSheetRef}
      onClose={onClose} 
      height="95%"
      safeAreaEdges={['bottom']}
    >
        <StatusBar barStyle={colors.statusBar} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.gray100 }]}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
            onPress={handleClosePress}
          >
            <IconBack size={20} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>Details</Text>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowShareModal(true)}
          >
            <IconShare size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent]}
          onLayout={handleLayoutChange}
        >
          {/* Swipable Image Gallery */}
          <View style={styles.imageSection}>
            <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
              <FlatList
                ref={flatListRef}
                data={productImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleImageScroll}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                  length: imageSlideWidth,
                  offset: imageSlideWidth * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.imageSlide, { width: imageSlideWidth }]}
                    activeOpacity={0.9}
                    onPress={() => setShowImagePreview(true)}
                  >
                    <Image
                      source={{ uri: item }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
              />

              {/* Discount Badge */}
              {discountPercent && (
                <View style={[styles.discountBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.discountText, { color: colors.white }]}>-{discountPercent}%</Text>
                </View>
              )}

              {/* Favorite Button */}
              <TouchableOpacity 
                style={[styles.favoriteButton, { backgroundColor: isFavorite ? colors.accent : colors.gray50 }]}
                onPress={handleFavoritePress}
              >
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <IconHeart 
                    size={22}
                    color={isFavorite ? colors.white : colors.gray600}
                  />
                </Animated.View>
              </TouchableOpacity>
          </View>
                        {/* Pagination Dots */}
              <View style={styles.pagination}>
                {productImages.map((_, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.paginationDot,
                      { backgroundColor: colors.gray200 },
                      activeImageIndex === index && [styles.paginationDotActive, { backgroundColor: colors.accent }]
                    ]}
                  />
                ))}
              </View>
          </View>

          {/* Product Info */}
          <View style={styles.infoSection}>
            {/* Brand & In Stock */}
            <View style={styles.brandRow}>
              <Text style={[styles.brand, { color: colors.textMuted }]}>{product.brand}</Text>
              {product.inStock && (
                <View style={[styles.inStockBadge, { backgroundColor: colors.success + '1A' }]}>
                  <IconCheck size={12} color={colors.success} />
                  <Text style={[styles.inStockText, { color: colors.success }]}>{t('inStock')}</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
            
            {/* Rating with Reviews */}
            <TouchableOpacity 
              style={styles.ratingRow}
              onPress={() => setShowReviewScreen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconStar 
                    key={star}
                    size={14} 
                    color={star <= Math.floor(product.rating) ? colors.accent : colors.gray200} 
                    filled={star <= Math.floor(product.rating)}
                  />
                ))}
              </View>
              <Text style={[styles.ratingText, { color: colors.text }]}>{product.rating}</Text>
              <Text style={[styles.reviewsLink, { color: colors.textMuted, textDecorationLine: 'underline' }]}>
                ({product.reviews} {t('reviews')})
              </Text>
            </TouchableOpacity>

            {/* Price */}
            <View style={styles.priceSection}>
              <Text style={[styles.price, { color: colors.text }]}>₾{product.price}</Text>
              {product.originalPrice && (
                <Text style={[styles.originalPrice, { color: colors.textMuted }]}>₾{product.originalPrice}</Text>
              )}
              {discountPercent && (
                <View style={[styles.saveBadge, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.saveText, { color: colors.accent }]}>{t('save')} ₾{(product.originalPrice! - product.price).toFixed(0)}</Text>
                </View>
              )}
            </View>

            {/* Quick Specs */}
            <View style={[styles.specsGrid]}>
              {specs.map((spec, index) => (
                <View key={index} style={[styles.specItem, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                  <Text style={[styles.specLabel, { color: colors.textMuted }]}>{spec.label}</Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>{spec.value}</Text>
                </View>
              ))}
            </View>



            {/* Expandable Details */}
            <View style={[styles.detailsSection, { backgroundColor: colors.surface }]}>
              {detailsSections.map((section) => (
                <View key={section.id} style={[styles.detailItem, { borderBottomColor: colors.gray100 }]}>
                  <TouchableOpacity 
                    style={styles.detailHeader}
                    onPress={() => toggleSection(section.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.detailTitle, { color: colors.text }]}>{section.title}</Text>
                    <IconChevron 
                      size={18} 
                      color={colors.textMuted}
                      direction={expandedSection === section.id ? 'up' : 'down'}
                    />
                  </TouchableOpacity>
                  {expandedSection === section.id && (
                    <View style={styles.detailContent}>
                      <Text style={[styles.detailText, { color: colors.textMuted }]}>{section.content}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <View style={[styles.featureItem, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                <View style={[styles.featureIcon, { backgroundColor: colors.gray100 }]}>
                  <Text style={styles.featureEmoji}>🚚</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>{t('freeDelivery')}</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textMuted }]}>{t('freeDeliveryDesc')}</Text>
                </View>
              </View>
              <View style={[styles.featureItem, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                <View style={[styles.featureIcon, { backgroundColor: colors.gray100 }]}>
                  <Text style={styles.featureEmoji}>✅</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>{t('original')}</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textMuted }]}>{t('originalDesc')}</Text>
                </View>
              </View>
              <View style={[styles.featureItem, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                <View style={[styles.featureIcon, { backgroundColor: colors.gray100 }]}>
                  <Text style={styles.featureEmoji}>↩️</Text>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>{t('returns')}</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textMuted }]}>{t('returnsDesc')}</Text>
                </View>
              </View>
            </View>

            {/* Reviews Preview */}
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
                <TouchableOpacity onPress={() => setShowReviewScreen(true)}>
                  <Text style={[styles.seeAllLink, { color: colors.accent }]}>{t('seeAll') ?? 'See All'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => setShowReviewScreen(true)}
                style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.gray100, borderRadius: 20, padding: 16 }]}
              >
                <View style={styles.reviewTop}>
                  <View style={[styles.reviewAvatar, { backgroundColor: colors.accent, width: 40, height: 40, borderRadius: 20 }]}>
                    <Text style={[styles.reviewAvatarText, { color: colors.white, fontSize: 16, fontWeight: '700' }]}>G</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.reviewName, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>Giorgi M.</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <IconStar key={s} size={12} color={colors.accent} filled />
                      ))}
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                     <Text style={[styles.reviewDate, { color: colors.textMuted, marginLeft: 8, fontSize: 12 }]}>2 days ago</Text>
                  </View>
                </View>
                <Text style={[styles.reviewText, { color: colors.textSecondary, marginTop: 12, lineHeight: 20 }]}>
                  Great product! Consistent results and good taste.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <View style={styles.similarSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('similarProducts')}</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarScroll}
                >
                  {similarProducts.map((item) => (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[styles.similarCard, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}
                      onPress={() => onProductPress?.(item)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.similarImage}
                        resizeMode="cover"
                      />
                      <Text style={[styles.similarBrand, { color: colors.textMuted }]}>{item.brand}</Text>
                      <Text style={[styles.similarName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                      <Text style={[styles.similarPrice, { color: colors.accent }]}>₾{item.price}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer with Quantity & Add to Cart */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.surface, borderTopColor: colors.gray100 }]}>
          <View style={[styles.quantityControlFooter, { backgroundColor: colors.gray100 }]}>
             <TouchableOpacity 
                  style={styles.quantityBtnFooter}
                  onPress={() => quantity > 1 && setQuantity(q => q - 1)}
                  disabled={quantity <= 1}
              >
                  <IconMinus size={18} color={quantity <= 1 ? colors.gray300 : colors.text} />
              </TouchableOpacity>
              <Text style={[styles.quantityTextFooter, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity 
                  style={styles.quantityBtnFooter}
                  onPress={() => setQuantity(q => q + 1)}
              >
                  <IconPlus size={18} color={colors.text} />
              </TouchableOpacity>
          </View>

          <Button
            title={`${t('addToCart')} • ₾${product.price * quantity}`}
            onPress={handleAddToCart}
            variant="primary"
            size="lg"
            style={{ flex: 2, height: 50 }}
            textStyle={{ fontSize: 16, fontWeight: '700' }}
          />
        </View>

      {/* Reviews Modal */}
      {showReviewScreen && (
        <Modal
          visible={showReviewScreen}
          animationType="slide"
          transparent={true}
          presentationStyle="overFullScreen"
          onRequestClose={() => setShowReviewScreen(false)}
        >
          <ProductReviewModal
            product={product}
            onClose={() => setShowReviewScreen(false)}
          />
        </Modal>
      )}

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        item={{
          id: product.id,
          title: product.name,
          description: `Check out ${product.name} - ${product.brand} on supplement.ge! Only ₾${product.price}`,
          image: product.image,
          type: 'product',
          url: `https://supplement.ge/products/${product.id}`
        }}

      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        visible={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        images={productImages}
        initialIndex={activeImageIndex}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS == "web" ? 16 : 0,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollContent: {
    paddingBottom: 70, // Space for footer
  },
  imageSection: {
    padding: 16,
    paddingBottom: 0,
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  imageSlide: {
    // Width is set dynamically via inline style
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 220,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    width: 20,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',

  },
  infoSection: {
    paddingHorizontal: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  inStockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  reviewsLink: {
    fontSize: 13,
    marginLeft: 4,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '600',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Gap handles spacing
    marginBottom: 24,
    marginTop: 8,
  },
  specItem: {
    width: '48%', // Approx half with gap
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent', // Override inline
  },
  specLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',

  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  detailsSection: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  detailItem: {
    borderBottomWidth: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 22,
  },
  featuresSection: {
    gap: 12,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 12,
  },
  reviewsSection: {
    marginBottom: 32,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
  },
  similarSection: {
    marginBottom: 20, // Extra space
  },
  similarScroll: {
    paddingVertical: 10,
    paddingLeft: 4,
    gap: 12,
  },
  similarCard: {
    width: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 8,
  },
  similarImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  similarBrand: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  similarName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    height: 36,
  },
  similarPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 16,
  },
  quantityControlFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 4,
    height: 50,
  },
  quantityBtnFooter: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  quantityTextFooter: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '800',
  },
});
