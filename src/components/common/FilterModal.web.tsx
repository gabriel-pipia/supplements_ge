import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  // @ts-ignore
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context';
import { IconX, IconStar } from '../icons';
import { PRODUCTS } from '../../data';
import { BottomSheetModal } from './BottomSheetModal'; // Resolves to .web
import { Input } from './Input';
import { Button } from './Button';

// Web styles
const webStyles = {
    pointer: { cursor: 'pointer' } as any,
    shadow: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } as any,
};

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
}

// ... Data (same as native) ...
const BRANDS = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const { colors, t } = useApp();
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.selectedBrands);
  const [minRating, setMinRating] = useState(initialFilters.minRating);

  const maxPossiblePrice = Math.max(...PRODUCTS.map(p => p.price));

  const handleApply = () => {
    onApply({ minPrice, maxPrice, selectedBrands, minRating });
    onClose();
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(maxPossiblePrice);
    setSelectedBrands([]);
    setMinRating(0);
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
        setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
        setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal 
        onClose={onClose} 
        height="auto" // Auto height for filter dialog
        showDragHandle={false}
      >
        <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, webStyles.pointer]}>
                <IconX size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>{t('filters') || 'Filters'}</Text>
            <TouchableOpacity onPress={handleReset} style={webStyles.pointer}>
                <Text style={[styles.resetText, { color: colors.accent }]}>{t('reset') || 'Reset'}</Text>
            </TouchableOpacity>
        </View>

        <ScrollView 
            showsVerticalScrollIndicator={true} 
            contentContainerStyle={styles.scrollContent}
        >
            {/* Price Range */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('priceRange') || 'Price Range'}</Text>
                <View style={styles.priceInputRow}>
                    <Input
                        containerStyle={{ flex: 1, marginBottom: 0 }}
                        value={minPrice.toString()}
                        onChangeText={(text) => setMinPrice(parseInt(text.replace(/[^0-9]/g, '')) || 0)}
                        keyboardType="numeric"
                        placeholder="Min"
                        leftIcon={<Text style={{ fontSize: 16, color: colors.text }}>₾</Text>}
                    />
                    <Text style={{ marginHorizontal: 8 }}>-</Text>
                    <Input
                        containerStyle={{ flex: 1, marginBottom: 0 }}
                        value={maxPrice.toString()}
                        onChangeText={(text) => setMaxPrice(parseInt(text.replace(/[^0-9]/g, '')) || 0)}
                        keyboardType="numeric"
                        placeholder="Max"
                        leftIcon={<Text style={{ fontSize: 16, color: colors.text }}>₾</Text>}
                    />
                </View>
            </View>

            {/* Brands */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Brands</Text>
                <View style={styles.brandGrid}>
                    {BRANDS.map(brand => {
                        const isSelected = selectedBrands.includes(brand);
                        return (
                            <TouchableOpacity
                                key={brand}
                                style={[
                                    styles.brandChip, 
                                    { borderColor: isSelected ? colors.accent : colors.gray200, backgroundColor: isSelected ? colors.accent : 'transparent' }, 
                                    webStyles.pointer,
                                    webStyles.shadow
                                ]}
                                onPress={() => toggleBrand(brand)}
                            >
                                <Text style={[styles.brandText, { color: isSelected ? '#FFF' : colors.text }]}>{brand}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

            {/* Rating */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Rating</Text>
                <View style={styles.ratingRow}>
                    {[1,2,3,4,5].map(r => {
                         const isSelected = minRating === r;
                         return (
                             <TouchableOpacity
                                key={r}
                                style={[
                                    styles.ratingChip, 
                                    { backgroundColor: isSelected ? colors.accent : colors.gray50 }, 
                                    webStyles.pointer,
                                    webStyles.shadow
                                ]}
                                onPress={() => setMinRating(isSelected ? 0 : r)}
                             >
                                 <IconStar size={16} color={isSelected ? '#FFF' : colors.accent} />
                                 <Text style={{ color: isSelected ? '#FFF' : colors.text, fontWeight: 'bold' }}>{r}+</Text>
                             </TouchableOpacity>
                         )
                    })}
                </View>
            </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.gray100 }]}>
             <Button 
                title={t('apply') || 'Apply'} 
                onPress={handleApply} 
                variant="primary" 
                block 
                size="lg" 
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
        padding: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    resetText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    priceInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    brandChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    brandText: {
        fontSize: 14,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 8,
    },
    ratingChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 4,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    }
});
