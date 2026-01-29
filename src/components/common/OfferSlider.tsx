import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useApp } from '../../context';
import { Product } from '../../types';
import { useResponsive } from '../../hooks';
import { Button } from './Button';

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
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=400&fit=crop',
    productId: '1',
    color: '#FF6B00',
  },
  {
    id: '2',
    title: 'New Arrival',
    subtitle: 'Pure Creatine Monohydrate for maximum performance',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&h=400&fit=crop',
    productId: '2',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Daily Essentials',
    subtitle: 'Boost your immunity with Vitamin D3',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=400&fit=crop',
    productId: '3',
    color: '#3B82F6',
  },
];

export const OfferSlider: React.FC<OfferSliderProps> = ({ products, onProductPress }) => {
  const { colors, t } = useApp();
  const { width: responsiveWidth, containerPadding } = useResponsive();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Mobile: strict one item per view minus padding
  const GAP = 12;
  // Width is screen width minus padding on left and right
  const ITEM_WIDTH = responsiveWidth - (containerPadding * 2);

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

  const renderItem = ({ item, index }: { item: Offer, index: number }) => {
    const product = products.find(p => p.id === item.productId);
    const isLast = index === OFFERS.length - 1;
    
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => product && onProductPress(product)}
        style={[
            styles.slideContainer, 
            { 
                width: ITEM_WIDTH, 
                // Add right margin to all except last for spacing
                // Last item relies on container padding
                marginRight: isLast ? 0 : GAP
            }
        ]}
      >
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: item.image }} style={styles.image} />
          
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
              size="sm"
              style={{ alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 0 }}
              textStyle={{ color: '#000000' }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={OFFERS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        // Disable page snapping, use interval for custom spacing
        pagingEnabled={false}
        snapToInterval={ITEM_WIDTH + GAP}
        decelerationRate="fast"
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={[
            styles.listContent, 
            { paddingHorizontal: containerPadding }
        ]}
      />
      
      <View style={styles.pagination}>
        {OFFERS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: colors.gray200 },
              activeIndex === index && { backgroundColor: colors.accent, width: 20 }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  slideContainer: {
    // Width and margin set dynamically
  },
  card: {
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slightly lighter overlay
    padding: 24,
    justifyContent: 'flex-end',
  },
  label: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  labelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 18,
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
