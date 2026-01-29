import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { CATEGORIES, PRODUCTS } from '../data';
import { getCategoryIcon } from '../components/icons';
import { ProductCard } from '../components/common';
import { CartContextType } from '../types';

interface CategoriesScreenProps {
  cart: CartContextType;
  onBack: () => void;
  favorites: {
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
  };
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ 
  cart, 
  onBack,
  favorites 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? PRODUCTS.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← უკან</Text>
          </TouchableOpacity>
          <Text style={styles.title}>კატეგორიები</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Category Grid */}
          {!selectedCategory ? (
            <View style={styles.categoryGrid}>
              {CATEGORIES.filter(c => c.id !== 'all').map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryIconWrapper}>
                    {getCategoryIcon(category.iconType, COLORS.accent)}
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {PRODUCTS.filter(p => p.category === category.id).length} პროდუქტი
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <>
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <TouchableOpacity 
                  onPress={() => setSelectedCategory(null)}
                  style={styles.categoryBackButton}
                >
                  <Text style={styles.categoryBackText}>← ყველა კატეგორია</Text>
                </TouchableOpacity>
                <Text style={styles.selectedCategoryTitle}>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </Text>
              </View>

              {/* Products Grid */}
              <View style={styles.productsGrid}>
                {filteredProducts.map((product, index) => (
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
            </>
          )}
        </ScrollView>
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
  placeholder: {
    width: 60,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  categoryHeader: {
    padding: 24,
  },
  categoryBackButton: {
    marginBottom: 12,
  },
  categoryBackText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCategoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
});
