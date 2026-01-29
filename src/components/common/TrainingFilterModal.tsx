import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context';
import { IconX, IconStar, IconFlame } from '../icons';
import { BottomSheetModal } from './BottomSheetModal';
import { TRAINING_PROGRAMS } from '../../data/training';
import { Button } from './Button';

export interface TrainingFilterState {
  minDuration: number; // in weeks
  maxDuration: number; // in weeks
  levels: string[];
  minRating: number;
}

interface TrainingFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: TrainingFilterState) => void;
  initialFilters: TrainingFilterState;
}

const LEVELS = Array.from(new Set(TRAINING_PROGRAMS.map(p => p.level))).sort();

export const TrainingFilterModal: React.FC<TrainingFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const { colors, t, isDark } = useApp();
  const insets = useSafeAreaInsets();
  
  const [minDuration, setMinDuration] = useState(initialFilters.minDuration);
  const [maxDuration, setMaxDuration] = useState(initialFilters.maxDuration);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialFilters.levels);
  const [minRating, setMinRating] = useState(initialFilters.minRating);

  const handleApply = () => {
    onApply({
      minDuration,
      maxDuration,
      levels: selectedLevels,
      minRating,
    });
    onClose();
  };

  const handleReset = () => {
    setMinDuration(0);
    setMaxDuration(52);
    setSelectedLevels([]);
    setMinRating(0);
  };

  const toggleLevel = (level: string) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
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
          <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={[styles.resetText, { color: colors.accent }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Duration Range Inputs */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Duration (Weeks)</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={minDuration.toString()}
                  onChangeText={(text) => {
                    const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                    setMinDuration(val);
                  }}
                  keyboardType="numeric"
                  placeholder="Min"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.inputDivider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.gray200 }]} />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={maxDuration.toString()}
                  onChangeText={(text) => {
                    const val = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                    setMaxDuration(val);
                  }}
                  keyboardType="numeric"
                  placeholder="Max"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </View>

          {/* Levels */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Difficulty Level</Text>
            <View style={styles.grid}>
              {LEVELS.map(level => {
                const isSelected = selectedLevels.includes(level);
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.chip,
                      { borderColor: colors.gray200 },
                      isSelected && { backgroundColor: colors.accent, borderColor: colors.accent }
                    ]}
                    onPress={() => toggleLevel(level)}
                  >
                    <IconFlame size={14} color={isSelected ? '#FFF' : colors.textMuted} />
                    <Text style={[
                      styles.chipText,
                      { color: colors.text },
                      isSelected && { color: colors.white }
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Minimum Rating</Text>
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
    paddingVertical: 16,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
  },
  inputDivider: {
    width: 20,
    alignItems: 'center',
  },
  dividerLine: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
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
  chipText: {
    fontSize: 14,
    fontWeight: '600',
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
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
