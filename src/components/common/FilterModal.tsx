import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context';
import { IconX, IconStar } from '../icons';
import { PRODUCTS } from '../../data';
import { BottomSheetModal } from './BottomSheetModal';
import { Input } from './Input';
import { Button } from './Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  minRating: number;
  selectedGoals: string[];
  selectedTypes: string[];
}

const BRANDS = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
const GOALS = ['Muscle Gain', 'Weight Loss', 'Energy', 'Recovery', 'General Health'];
const TYPES = ['Protein', 'Creatine', 'Vitamins', 'Minerals', 'Pre-Workout', 'Natural'];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const { colors, t, isDark } = useApp();
  const insets = useSafeAreaInsets();
  
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.selectedBrands);
  const [minRating, setMinRating] = useState(initialFilters.minRating);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialFilters.selectedGoals || []);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.selectedTypes || []);

  const maxPossiblePrice = Math.max(...PRODUCTS.map(p => p.price));

  const handleApply = () => {
    onApply({
      minPrice,
      maxPrice,
      selectedBrands,
      minRating,
      selectedGoals,
      selectedTypes,
    });
    onClose();
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(maxPossiblePrice);
    setSelectedBrands([]);
    setMinRating(0);
    setSelectedGoals([]);
    setSelectedTypes([]);
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BottomSheetModal onClose={onClose} height="85%">
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconX size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{t('filters') || 'Filters'}</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={[styles.resetText, { color: colors.accent }]}>{t('reset') || 'Reset'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Price Range Inputs */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>{t('priceRange') || 'Price Range'}</Text>
            <View style={styles.priceInputRow}>
              <Input
                containerStyle={{ flex: 1, marginBottom: 0 }}
                value={minPrice.toString()}
                onChangeText={(text) => {
                  const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                  setMinPrice(val);
                }}
                keyboardType="numeric"
                placeholder="Min"
                leftIcon={<Text style={{ fontSize: 16, fontWeight: '600', color: colors.textMuted }}>₾</Text>}
              />
              <View style={styles.priceInputDivider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.gray200 }]} />
              </View>
              <Input
                containerStyle={{ flex: 1, marginBottom: 0 }}
                value={maxPrice.toString()}
                onChangeText={(text) => {
                  const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                  setMaxPrice(val);
                }}
                keyboardType="numeric"
                placeholder="Max"
                leftIcon={<Text style={{ fontSize: 16, fontWeight: '600', color: colors.textMuted }}>₾</Text>}
              />
            </View>
          </View>

          {/* Brands */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>{t('brands') || 'Brands'}</Text>
            <View style={styles.brandGrid}>
              {BRANDS.map(brand => {
                const isSelected = selectedBrands.includes(brand);
                return (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.brandChip,
                      { borderColor: colors.gray200 },
                      isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                    ]}
                    onPress={() => toggleBrand(brand)}
                  >
                    <Text style={[
                      styles.brandText,
                      { color: colors.text },
                      isSelected && { color: colors.white }
                    ]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Supplement Types */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>{t('supplementType') || 'Supplement Type'}</Text>
            <View style={styles.brandGrid}>
              {TYPES.map(type => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.brandChip,
                      { borderColor: colors.gray200 },
                      isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                    ]}
                    onPress={() => toggleType(type)}
                  >
                    <Text style={[
                      styles.brandText,
                      { color: colors.text },
                      isSelected && { color: colors.white }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Fitness Goals */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>{t('fitnessGoals') || 'Fitness Goals'}</Text>
            <View style={styles.brandGrid}>
              {GOALS.map(goal => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.brandChip,
                      { borderColor: colors.gray200 },
                      isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                    ]}
                    onPress={() => toggleGoal(goal)}
                  >
                    <Text style={[
                      styles.brandText,
                      { color: colors.text },
                      isSelected && { color: colors.white }
                    ]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>{t('minRating') || 'Minimum Rating'}</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(rating => {
                const isSelected = minRating === rating;
                return (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingChip,
                      { backgroundColor: colors.gray50 },
                      isSelected && { backgroundColor: colors.accent }
                    ]}
                    onPress={() => setMinRating(isSelected ? 0 : rating)}
                  >
                    <IconStar size={16} color={isSelected ? colors.white : colors.accent} />
                    <Text style={[
                      styles.ratingText,
                      { color: colors.text },
                      isSelected && { color: colors.white }
                    ]}>
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Button
            title={t('apply') || 'Apply Filters'}
            onPress={handleApply}
            variant="primary"
            block
            size="lg"
            style={styles.applyButton} // Let Button handle bg, keep shadow
          />
        </View>
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
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputDivider: {
    width: 20,
    alignItems: 'center',
  },
  dividerLine: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
       web: { 
         boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
       } as any 
    })
  },
  brandText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
       web: { 
         boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
       } as any 
    })
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  applyButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
});
