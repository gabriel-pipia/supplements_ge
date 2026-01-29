import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../../context';
import { Product } from '../../types';
import { useResponsive } from '../../hooks';
import { Button } from './Button';
import Svg, { Path } from 'react-native-svg';

// Web specific styles
const webStyles = {
  pointer: {
    cursor: 'pointer',
  } as any,
  slideHover: {
    transform: [{ scale: 1.002 }],
    transition: 'transform 0.4s ease',
  } as any,
  container: {
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  } as any,
  arrowButton: {
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  } as any
};

const IconChevronLeft = ({ size = 24, color = '#FFF' }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const IconChevronRight = ({ size = 24, color = '#FFF' }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productId: string;
  color: string;
}

interface OfferSliderProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Summer Sale!',
    subtitle: 'Get up to 30% off on all Whey Proteins',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1200&h=600&fit=crop',
    productId: '1',
    color: '#FF6B00',
  },
  {
    id: '2',
    title: 'New Arrival',
    subtitle: 'Pure Creatine Monohydrate for maximum performance',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1200&h=600&fit=crop',
    productId: '2',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Daily Essentials',
    subtitle: 'Boost your immunity with Vitamin D3',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=600&fit=crop',
    productId: '3',
    color: '#3B82F6',
  },
];

export const OfferSlider: React.FC<OfferSliderProps> = ({ products, onProductPress }) => {
  const { colors, t } = useApp();
  const { width: windowWidth } = useWindowDimensions();
  const { containerPadding, isDesktop } = useResponsive();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Calculate slide width
  // On Desktop Web, windowWidth includes scrollbar which can cause overflow
  // We constrain max width and subtract padding
  const MAX_WIDTH = 1200;
  const GAP = 16;
  
  // Effective width constraint
  const effectiveWidth = Math.min(windowWidth, MAX_WIDTH);
  
  // Item width is strict: available space - 2 * padding
  const ITEM_WIDTH = effectiveWidth - (containerPadding * 2);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < OFFERS.length) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewOffset: containerPadding // Important for centering with padding
      });
      setActiveIndex(index);
    }
  };

  const handleNext = useCallback(() => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < OFFERS.length) {
      scrollToIndex(nextIndex);
    } else {
      scrollToIndex(0);
    }
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    const prevIndex = activeIndex - 1;
    if (prevIndex >= 0) {
      scrollToIndex(prevIndex);
    } else {
      scrollToIndex(OFFERS.length - 1);
    }
  }, [activeIndex]);

  const renderItem = ({ item, index }: { item: Offer, index: number }) => {
    const product = products.find(p => p.id === item.productId);
    const isLast = index === OFFERS.length - 1;
    
    return (
      <TouchableOpacity 
        activeOpacity={0.95} 
        onPress={() => product && onProductPress(product)}
        style={[
            styles.slideContainer, 
            { 
              width: ITEM_WIDTH, 
              marginRight: isLast ? 0 : GAP 
            },
            webStyles.pointer,
            webStyles.slideHover
        ]}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.gradientOverlay} />
          
          <View style={styles.overlay}>
            <View style={[styles.label, { backgroundColor: item.color }]}>
              <Text style={styles.labelText}>{t('promoLabel') || 'Offer'}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={[styles.subtitle, { paddingRight: 40 }]}>{item.subtitle}</Text>
            
            <Button
              title={t('seeAll') || 'Shop Now'}
              onPress={() => product && onProductPress(product)}
              variant="secondary"
              size={isDesktop ? "lg" : "md"}
              style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 0, paddingHorizontal: 24 }}
              textStyle={{ color: '#000000', fontWeight: '700' }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderWrapper}>
        <FlatList
          ref={flatListRef}
          data={OFFERS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled={false} // Disable paging to use snapToInterval
          snapToInterval={ITEM_WIDTH + GAP} // Snap to item width + gap
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={[
            styles.listContent, 
            { paddingHorizontal: containerPadding }
          ]}
          // @ts-ignore - Web styling
          style={Platform.OS === 'web' ? { 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              width: '100%' 
          } as any : undefined}
        />

        {/* Navigation Arrows - Only Desktop */}
        {isDesktop && (
          <>
            <TouchableOpacity 
              style={[styles.arrowButton, styles.arrowLeft, { backgroundColor: 'rgba(255,255,255,0.9)', left: containerPadding + 16 }, webStyles.arrowButton]}
              onPress={handlePrev}
            >
              <IconChevronLeft size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.arrowButton, styles.arrowRight, { backgroundColor: 'rgba(255,255,255,0.9)', right: containerPadding + 16 }, webStyles.arrowButton]}
              onPress={handleNext}
            >
              <IconChevronRight size={24} color="#000" />
            </TouchableOpacity>
          </>
        )}
      </View>
      
      {/* Pagination */}
      <View style={styles.pagination}>
        {OFFERS.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[styles.dotContainer, webStyles.pointer]}
          >
            <View 
                style={[
                    styles.dot,
                    { backgroundColor: colors.gray300 },
                    activeIndex === index && { backgroundColor: colors.accent, width: 24 }
                ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  sliderWrapper: {
    position: 'relative',
    width: '100%',
    alignItems: 'center', // Center slider if max-width constraint hits
  },
  listContent: {
    // paddingHorizontal set via props
  },
  slideContainer: {
    // width set dynamically
  },
  card: {
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    // Web shadow
    ...Platform.select({
        web: {
           boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
    }) as any,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)', 
    padding: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  } as any,
  label: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  labelText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 32,
    lineHeight: 28,
    maxWidth: 500,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  dotContainer: {
    padding: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  } as any,
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'pointer',
      }
    }) as any,
  },
  arrowLeft: {
     // Positioned in render
  },
  arrowRight: {
     // Positioned in render
  }
});
