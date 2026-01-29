import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { IconFlame, IconSearch, IconX, IconFilter } from '../icons';
import { Input } from './Input';
import { TRAINING_PROGRAMS, TrainingProgram } from '../../data/training';
import { GlassCard } from './GlassCard';
import { TrainingProgramModal } from './TrainingProgramModal';
import { TrainingFilterModal, TrainingFilterState } from './TrainingFilterModal';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path } from 'react-native-svg';
  
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

interface TrainingProgramsListModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TrainingProgramsListModal: React.FC<TrainingProgramsListModalProps> = ({ visible, onClose }) => {
  const { colors, t, isDark } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // const [isFocused, setIsFocused] = useState(false); // Removed, handled by Input
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<TrainingFilterState>({
    minDuration: 0,
    maxDuration: 52,
    levels: [],
    minRating: 0,
  });

  // Helper to parse duration string '12 Weeks' -> 12
  const parseDuration = (durationStr: string) => {
    return parseInt(durationStr.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate active filters count
  const activeFiltersCount = 
    (filters.minDuration > 0 ? 1 : 0) +
    (filters.maxDuration < 52 ? 1 : 0) +
    filters.levels.length +
    (filters.minRating > 0 ? 1 : 0);

  const filteredPrograms = TRAINING_PROGRAMS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Duration Filter
    const duration = parseDuration(p.duration);
    const matchesDuration = duration >= filters.minDuration && duration <= filters.maxDuration;

    // Level Filter
    const matchesLevel = filters.levels.length === 0 || filters.levels.includes(p.level);

    // Rating Filter
    const matchesRating = p.rating >= filters.minRating;

    return matchesSearch && matchesDuration && matchesLevel && matchesRating;
  });

  return (
   <Modal
         visible={visible}
         transparent
         animationType="slide"
         onRequestClose={onClose}
       >
         <BottomSheetModal onClose={onClose} height="100%" showDragHandle={true}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Training Programs
            </Text>
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
              onPress={onClose}
            >
              <IconClose size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
            
            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
              <Input
                containerStyle={{ flex: 1, marginBottom: 0 }}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search programs..."
                leftIcon={<IconSearch size={20} />}
                rightIcon={searchQuery.length > 0 ? <IconX size={16} /> : undefined}
                onRightIconPress={() => setSearchQuery('')}
              />

              {/* Filter Button */}
              <TouchableOpacity 
                style={[
                  styles.filterButton, 
                  { 
                    backgroundColor: colors.surface,
                    borderColor: activeFiltersCount > 0 ? colors.accent : colors.gray200,
                    borderWidth: 1 // Always show border width but transparent if inactive
                  }
                ]}
                onPress={() => setIsFilterVisible(true)}
              >
                <IconFilter size={20} color={activeFiltersCount > 0 ? colors.accent : colors.text} />
                {activeFiltersCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                    <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

          {/* Filter Modal */}
          <TrainingFilterModal
            visible={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            onApply={setFilters}
            initialFilters={filters}
          />

          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            {filteredPrograms.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🔍</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No programs found</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {filteredPrograms.map((program) => (
                  <TouchableOpacity 
                    key={program.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedProgram(program)}
                    style={styles.cardContainer}
                  >
                    <View style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
                      <Image source={{ uri: program.image }} style={styles.cardImage} resizeMode="cover" />
                      
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.imageOverlay}
                      />

                      <View style={styles.cardBadge}>
                        <IconFlame size={12} color="#FFF" />
                        <Text style={styles.cardBadgeText}>{program.level}</Text>
                      </View>
                      
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                          {program.title}
                        </Text>
                        <Text style={styles.cardTrainer}>
                          By {program.trainer}
                        </Text>
                        
                        <View style={styles.cardFooter}>
                          <View style={styles.footerItem}>
                            <Text style={styles.footerLabel}>Duration</Text>
                            <Text style={styles.footerValue}>{program.duration}</Text>
                          </View>
                          <View style={[styles.footerItem, { alignItems: 'flex-end' }]}>
                            <Text style={styles.footerLabel}>Rating</Text>
                            <Text style={[styles.footerValue, { color: '#FFB800' }]}>★ {program.rating}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Detail Modal */}
          <TrainingProgramModal
            visible={selectedProgram !== null}
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
          />
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',

  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchWrapper: {
    // Replaced by Input
  },
  searchInput: {
    // Replaced by Input
  },
  scrollContent: {
    padding: 20,
  },
  grid: {
    gap: 20,
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    elevation: 3,
    ...Platform.select({
       web: { 
         boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
       } as any 
    })
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
    lineHeight: 26,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardTrainer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  footerItem: {
    gap: 2,
  },
  footerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  footerValue: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    width: 55,
    height: 55,
    borderRadius:16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
