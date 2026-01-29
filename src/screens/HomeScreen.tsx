import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Animated, 
  StyleSheet, 
  StatusBar, 
  Text, 
  TouchableOpacity, 
  Alert,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useToast, useModal } from '../context';
import { PRODUCTS, CATEGORIES, PROMO } from '../data';
import { Product } from '../types';
import { useCart, useFavorites, useResponsive } from '../hooks';
import {
  CategoryPill,
  ProductCard,
  PromoBanner,
  CartBottomSheet,
  OfferSlider,
  BrandLogo,
  ProductDetailModal,
  CustomRefreshControl
} from '../components';
import { IconCart } from '../components/icons';
import Svg, { Path } from 'react-native-svg';

// Grid Icon
const IconGrid = ({ size = 20, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" />
  </Svg>
);

// List Icon
const IconList = ({ size = 20, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
  </Svg>
);

interface HomeScreenProps {
  cart: ReturnType<typeof useCart>;
  favorites: ReturnType<typeof useFavorites>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ cart, favorites }) => {
  const insets = useSafeAreaInsets();
  const { colors, t, setProductModalOpen, isGuest } = useApp();
  const { showCartToast, showToast } = useToast();
  const { openModal } = useModal();
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartVisible, setCartVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { isDesktop, containerPadding, maxContentWidth, isWeb, gap, columns } = useResponsive();
  
  // Gentle entrance animation for hero
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(heroTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle Back Button for Modal
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedProduct) {
        handleCloseProductModal();
        setSelectedProduct(null);
        return true;
      }
      if (cartVisible) {
        setCartVisible(false);
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [selectedProduct, cartVisible]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const filteredProducts = PRODUCTS.filter((product) => {
    return activeCategory === 'all' || product.category === activeCategory;
  });

  const handleAddToCart = (product: Product) => {
    cart.addToCart(product);
    showCartToast(product.name);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Header border opacity on scroll
  const headerBorderOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Calculate header height (safe area + small padding + row height)
  const headerTotalHeight = insets.top + 60;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      {/* Minimal Header - Logo & Cart only - pointerEvents allows touches to pass through to scroll */}
      <View 
        style={[styles.header, { paddingTop: insets.top, paddingHorizontal: containerPadding, backgroundColor: colors.background }]}
        pointerEvents="box-none"
      >
        <View style={styles.headerRow} pointerEvents="auto">
          {/* Brand Logo */}
          <BrandLogo width={200} height={35} />
          
          <TouchableOpacity 
            style={[styles.cartButton, { backgroundColor: colors.gray100 }]}
            onPress={() => setCartVisible(true)}
          >
            <IconCart size={18} color={colors.text} />
            {cart.totalItems > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                <Text style={[styles.cartBadgeText, { color: colors.white }]}>{cart.totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Animated Bottom Border */}
        <Animated.View 
          style={[
            styles.headerBorder, 
            { opacity: headerBorderOpacity, backgroundColor: colors.gray100 }
          ]} 
          pointerEvents="none"
        />
      </View>

      {/* Main Content with Custom Refresh Control */}
      <CustomRefreshControl
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerTotalHeight + 12 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        progressViewOffset={headerTotalHeight}
      >
        {/* Hero Section with Animation */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: heroOpacity,
              transform: [{ translateY: heroTranslateY }],
              paddingHorizontal: containerPadding,
              alignItems: 'flex-start',
              width: '100%',
              marginTop: isDesktop ? 20 : 0,
              marginBottom: isDesktop ? 30 : 16,
            }
          ]}
        >
          <Text style={[
              styles.heroTitle, 
              { color: colors.textMuted },
              isDesktop && { fontSize: 32, marginBottom: 8 }
          ]}>
              {t('heroTitle')}
          </Text>
          <Text style={[
              styles.heroTitleAccent, 
              { color: colors.text },
              isDesktop && { fontSize: 48, lineHeight: 56 }
          ]}>
              {t('heroTitleAccent')}
          </Text>
        </Animated.View>

        <View>
          {/* Offer Slider */}
          <OfferSlider 
            products={PRODUCTS} 
            onProductPress={handleProductPress} 
          />
        </View>

        {/* Category Pills */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoryScroll, { paddingHorizontal: containerPadding }]}
          >
            {CATEGORIES.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onPress={() => setActiveCategory(category.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View>
          {/* Section Header with View Toggle */}
          <View style={[styles.sectionHeader, { paddingHorizontal: containerPadding }]}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('popular')}</Text>
              <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{filteredProducts.length} {t('products')}</Text>
            </View>
            
            {/* View Mode Toggle */}
            <View style={[styles.viewToggle, { backgroundColor: colors.gray100 }]}>
              <TouchableOpacity 
                style={[styles.viewToggleButton, viewMode === 'grid' && { backgroundColor: colors.gray50 }]}
                onPress={() => setViewMode('grid')}
              >
                <IconGrid size={18} color={viewMode === 'grid' ? colors.accent : colors.gray400} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewToggleButton, viewMode === 'list' && { backgroundColor: colors.gray50 }]}
                onPress={() => setViewMode('list')}
              >
                <IconList size={18} color={viewMode === 'list' ? colors.accent : colors.gray400} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Products */}
          <View style={[
            styles.productsContainer,
            { paddingHorizontal: containerPadding },
            viewMode === 'grid' 
              ? [styles.productsGrid, { gap }] 
              : [styles.productsList, { gap: 12 }]
          ]}>
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              viewMode={viewMode}
              onAddToCart={() => handleAddToCart(product)}
              onPress={() => handleProductPress(product)}
              isFavorite={favorites.isFavorite(product.id)}
              onToggleFavorite={() => {
                if (isGuest) {
                  openModal('AUTH');
                  return;
                }
                favorites.toggleFavorite(product.id);
              }}
            />
          ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View>
          <PromoBanner
            title={t('promoTitle')}
            label={t('promoLabel')}
            code={PROMO.code}
            onPress={() => showToast(t('promoCodeCopied'), "success")}
          />
        </View>
      </CustomRefreshControl>

      {/* Cart Bottom Sheet */}
      <CartBottomSheet
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cart={cart}
      />

      {/* Product Detail Modal - Rendered as absolute view for Toast visibility */}
      {selectedProduct && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]}>
          <ProductDetailModal
            visible={selectedProduct !== null}
            product={selectedProduct}
            onClose={handleCloseProductModal}
            onAddToCart={(p) => {
              handleAddToCart(p);
              handleCloseProductModal();
            }}
            isFavorite={favorites.isFavorite(selectedProduct.id)}
            onToggleFavorite={() => {
              if (isGuest) {
                 openModal('AUTH');
                 return;
              }
              favorites.toggleFavorite(selectedProduct.id);
            }}
            onProductPress={setSelectedProduct}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  headerRow: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  logo: {
    fontSize: 21,
    fontWeight: '700',
  },
  logoMain: {
  },
  logoAccent: {
  },
  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 26,
  },
  heroTitleAccent: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 12,
    marginTop: 2,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  viewToggleButton: {
    width: 32,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1, // Allow grid to fill width
  },
  productsList: {
    // List view - single column
  },
});
