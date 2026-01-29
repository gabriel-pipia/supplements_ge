import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { PRODUCTS } from '../data';
import { ProductCard, Button, CustomRefreshControl } from '../components/common';
import { CartContextType } from '../types';
import { IconHeart } from '../components/icons';

interface FavoritesScreenProps {
  favorites: {
    favorites: string[];
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
    clearFavorites: () => void;
  };
  cart: CartContextType;
  onBack: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ 
  favorites, 
  cart, 
  onBack 
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const favoriteProducts = PRODUCTS.filter((p) => 
    favorites.favorites.includes(p.id)
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate favorites refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← უკან</Text>
          </TouchableOpacity>
          <Text style={styles.title}>რჩეულები</Text>
          {favoriteProducts.length > 0 ? (
            <TouchableOpacity onPress={favorites.clearFavorites}>
              <Text style={styles.clearText}>გასუფთავება</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {favoriteProducts.length > 0 ? (
          <CustomRefreshControl 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
          >
            <View style={styles.productsGrid}>
              {favoriteProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={() => cart.addToCart(product)}
                  isFavorite={favorites.isFavorite(product.id)}
                  onToggleFavorite={() => favorites.toggleFavorite(product.id)}
                />
              ))}
            </View>
          </CustomRefreshControl>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrapper}>
              <IconHeart size={64} color={COLORS.gray300} />
            </View>
            <Text style={styles.emptyTitle}>რჩეულები ცარიელია</Text>
            <Text style={styles.emptySubtitle}>
              დაამატეთ პროდუქტები რჩეულებში გულის ღილაკზე დაჭერით
            </Text>
            <Button
              title="შოპინგის გაგრძელება"
              onPress={onBack}
              variant="primary"
              size="lg"
              style={styles.shopButton}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    width: 80,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  shopButton: {
    paddingHorizontal: 32,
    marginTop: 16,
  },
});
