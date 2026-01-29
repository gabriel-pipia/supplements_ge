import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRODUCTS, CATEGORIES } from '../data';
import { ProductCard, CategoryPill, FilterModal, FilterState, Button, Input, CustomRefreshControl } from '../components/common';
import { IconSearch, IconX, IconFilter, IconGym, IconTimer, IconFlame, IconStarFull } from '../components/icons';
import { Product } from '../types';

import { useApp, useToast, useModal } from '../context';
import { useResponsive } from '../hooks';
import { TRAINING_PROGRAMS } from '../data/training';
import Svg, { Path } from 'react-native-svg';
import { Image } from 'react-native';

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

interface SearchScreenProps {
  cart: {
    addToCart: (product: Product) => void;
    totalItems: number;
    clearCart: () => void;
  };
  favorites: {
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
  };
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ cart, favorites }) => {
  const { colors, t, isGuest } = useApp();
  const { showCartToast } = useToast();
  const { openModal } = useModal();
  const { containerPadding, gap } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['პროტეინი', 'კრეატინი', 'ვიტამინი D', 'ომეგა-3', 'BCAA']);
  const [refreshing, setRefreshing] = useState(false);
  
  // Advanced Filter State
  const maxPossiblePrice = Math.max(...PRODUCTS.map(p => p.price));
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: maxPossiblePrice,
    selectedBrands: [],
    minRating: 0,
    selectedGoals: [],
    selectedTypes: [],
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate search refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Advanced Filters
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const matchesBrand = filters.selectedBrands.length === 0 || filters.selectedBrands.includes(product.brand);
    const matchesRating = product.rating >= filters.minRating;
    
    // New Filters: Supplement Type and Fitness Goals
    const matchesType = filters.selectedTypes.length === 0 || 
      (product.type && filters.selectedTypes.includes(product.type));
    const matchesGoals = filters.selectedGoals.length === 0 || 
      (product.goals && product.goals.some(g => filters.selectedGoals.includes(g)));

    return matchesCategory && matchesSearch && matchesPrice && matchesBrand && matchesRating && matchesType && matchesGoals;
  });

  const popularSearches = ['Whey Protein', 'Creatine', 'Pre-Workout', 'Vitamins'];

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecentSearches([]);
  };

  const activeFilterCount = (filters.minPrice > 0 ? 1 : 0) + 
                            (filters.maxPrice < maxPossiblePrice ? 1 : 0) + 
                            filters.selectedBrands.length + 
                            (filters.minRating > 0 ? 1 : 0) +
                            filters.selectedTypes.length +
                            filters.selectedGoals.length;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: containerPadding }]}>
          <Text style={[styles.title, { color: colors.text }]}>{t('search')}</Text>
        </View>

        {/* Search Input & Filter Button */}
        <View style={[styles.searchRow, { paddingHorizontal: containerPadding }]}>
         <Input
            containerStyle={{ flex: 1, marginBottom: 0 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchPlaceholder')}
            leftIcon={<IconSearch size={20} />}
            rightIcon={searchQuery.length > 0 ? <IconX size={16} /> : undefined}
            onRightIconPress={() => setSearchQuery('')}
          />
          
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.gray200 }, activeFilterCount > 0 && { borderColor: colors.accent, borderWidth: 1 }]}
            onPress={() => setIsFilterVisible(true)}
            activeOpacity={0.7}
          >
            <IconFilter size={22} color={activeFilterCount > 0 ? colors.accent : colors.text} />
            {activeFilterCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomRefreshControl 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshing={refreshing}
          onRefresh={onRefresh}
        >
          {/* Category Filter */}
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

          {/* Search Suggestions - show when no query and no active filters/categories */}
          {searchQuery === '' && activeFilterCount === 0 && activeCategory === 'all' && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={[styles.suggestionsSection, { paddingHorizontal: containerPadding }]}>
                  <View style={styles.suggestionHeader}>
                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>{t('recentSearches') || 'Recent Searches'}</Text>
                    <TouchableOpacity onPress={clearRecent}>
                      <Text style={[styles.clearAllText, { color: colors.accent }]}>{t('clear')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tagContainer}>
                    {recentSearches.map((term, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={[styles.tag, { backgroundColor: colors.surface }]}
                        onPress={() => setSearchQuery(term)}
                      >
                        <Text style={[styles.tagText, { color: colors.text }]}>{term}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Popular Searches */}
              <View style={[styles.suggestionsSection, { paddingHorizontal: containerPadding }]}>
                <View style={styles.suggestionHeader}>
                    <Text style={[styles.suggestionTitle, { color: colors.text }]}>{t('popular') || 'Popular'}</Text>
                  </View>
                <View style={styles.tagContainer}>
                  {popularSearches.map((term, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.popularTag, { backgroundColor: colors.surface }]}
                      onPress={() => setSearchQuery(term)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.popularTagIndicator, { backgroundColor: colors.accent }]} />
                      <Text style={[styles.tagText, { color: colors.text, fontWeight: '600' }]}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Training Programs Carousel */}
              <View style={styles.trainingSection}>
                <View style={[styles.sectionHeader, { paddingHorizontal: containerPadding }]}>
                  <Text style={[styles.suggestionTitle, { color: colors.text }]}>{t('trainingPrograms') || 'Custom Training Programs'}</Text>
                  <TouchableOpacity onPress={() => openModal('TRAINING_PROGRAMS_LIST')}>
                    <Text style={[styles.seeAllText, { color: colors.accent }]}>{t('seeAll')}</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.trainingScroll, { paddingHorizontal: containerPadding }]}
                  snapToAlignment="start"
                  decelerationRate="fast"
                >
                  {TRAINING_PROGRAMS.map((program) => (
                    <TouchableOpacity 
                      key={program.id} 
                      style={[styles.trainingCard, { backgroundColor: colors.surface }]}
                      activeOpacity={0.9}
                      onPress={() => openModal('TRAINING_PROGRAM_DETAIL', { program })}
                    >
                      <Image source={{ uri: program.image }} style={styles.trainingItemImage} resizeMode="cover" />
                      <View style={styles.trainingCardBadge}>
                        <IconFlame size={12} color={colors.white} />
                        <Text style={styles.trainingBadgeText}>{program.level}</Text>
                      </View>
                      
                      <View style={styles.trainingInfo}>
                        <Text style={[styles.trainingTitle, { color: colors.text }]} numberOfLines={1}>{program.title}</Text>
                        
                        <View style={styles.trainerRow}>
                          <Image source={{ uri: program.trainerImage }} style={styles.trainerAvatar} />
                          <Text style={[styles.trainerName, { color: colors.textMuted }]}>{program.trainer}</Text>
                        </View>
                        
                        <View style={styles.trainingFooter}>
                          <View style={styles.trainingStat}>
                            <IconTimer size={14} color={colors.accent} />
                            <Text style={[styles.statText, { color: colors.text }]}>{program.duration}</Text>
                          </View>
                          <View style={styles.trainingStat}>
                            <IconStarFull size={14} color="#FFB800" />
                            <Text style={[styles.statText, { color: colors.text }]}>{program.rating}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {/* Results */}
          <View style={[styles.resultsSection, { paddingHorizontal: containerPadding }]}>
            <View style={styles.resultsHeader}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>
                  {searchQuery || activeFilterCount > 0 ? t('results') || 'Results' : t('allProducts') || 'All Products'}
                </Text>
                <View style={[styles.resultsCountBadge, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                  <Text style={[styles.resultsCountText, { color: colors.text }]}>{filteredProducts.length}</Text>
                </View>
              </View>

               {/* View Mode Toggle */}
              <View style={[styles.viewToggle, { backgroundColor: colors.gray100 }]}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, viewMode === 'grid' && { backgroundColor: colors.gray50 }]}
                  onPress={() => setViewMode('grid')}
                >
                  <IconGrid size={18} color={viewMode === 'grid' ? colors.accent : colors.gray400} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: colors.gray50 }]}
                  onPress={() => setViewMode('list')}
                >
                  <IconList size={18} color={viewMode === 'list' ? colors.accent : colors.gray400} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[
              styles.productsContainer,
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
                  onAddToCart={() => {
                    cart.addToCart(product);
                    showCartToast(product.name);
                  }}
                  isFavorite={favorites.isFavorite(product.id)}
                  onToggleFavorite={() => {
                    if (isGuest) {
                       openModal('AUTH');
                       return;
                    }
                    favorites.toggleFavorite(product.id);
                  }}
                  onPress={() => openModal('PRODUCT_DETAIL', {
                    product,
                    onAddToCart: (p: Product) => {
                      cart.addToCart(p);
                      showCartToast(p.name);
                    },
                    isFavorite: favorites.isFavorite(product.id),
                    onToggleFavorite: () => {
                      if (isGuest) {
                         openModal('AUTH');
                         return;
                      }
                      favorites.toggleFavorite(product.id);
                    }
                  })}
                />
              ))}
            </View>

            {filteredProducts.length === 0 && (searchQuery !== '' || activeFilterCount > 0) && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={[styles.noResultsText, { color: colors.text }]}>{t('noResults') || 'No results found'}</Text>
                <Text style={[styles.noResultsSubtext, { color: colors.textMuted }]}>
                  {t('noResultsSubtext') || 'Try another search term or adjust filters'}
                </Text>
                {activeFilterCount > 0 && (
                  <Button
                    title={t('reset')}
                    onPress={() => setFilters({ minPrice: 0, maxPrice: maxPossiblePrice, selectedBrands: [], minRating: 0, selectedGoals: [], selectedTypes: [] })}
                    variant="secondary"
                    size="md"
                    style={{ borderColor: colors.accent, marginTop: 16 }}
                    textStyle={{ color: colors.accent, fontWeight: '700' }}
                  />
                )}
              </View>
            )}
          </View>
        </CustomRefreshControl>
      </SafeAreaView>

      {/* Filter Modal - Kept local as it returns state */}
      <FilterModal 
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={setFilters}
        initialFilters={filters}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56, // Fixed height to match filter button
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchInputWrapperFocused: {
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 8,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  categoryScroll: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  suggestionsSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  popularTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  popularTagIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  resultsCountBadge: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  resultsCountText: {
    fontSize: 14,
    fontWeight: '700',
  },
   viewToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  toggleBtn: {
    width: 32,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsContainer: {
    // Container for dynamic gap/layout
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productsList: {
    // List view styles logic
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },

  trainingSection: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
  trainingScroll: {
    paddingBottom: 10,
    gap: 16,
  },
  trainingCard: {
    width: 280,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  trainingItemImage: {
    width: '100%',
    height: 160,
  },
  trainingCardBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  trainingBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  trainingInfo: {
    padding: 16,
  },
  trainingTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  trainerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  trainerName: {
    fontSize: 13,
    fontWeight: '600',
  },
  trainingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  trainingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
