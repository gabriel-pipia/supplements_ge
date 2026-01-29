import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { TrainingProgram } from '../../data/training';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { BottomSheetModal } from './BottomSheetModal';
import { ShareModal } from './ShareModal';
import { Button } from './Button';

// Icons
const IconBack = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const IconTimer = ({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <SvgCircle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const IconFlame = ({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2c0 2.5-2 4-2 7 0 1.7 1.3 3 3 3s3-1.3 3-3c0-2-1-3-1-5 2 1.5 4 4 4 8 0 4.4-3.6 8-8 8s-8-3.6-8-8c0-4 2.5-6.5 4-8 0 2 1.5 3 2.5 4 .5-2 1.5-4 2.5-6z" />
  </Svg>
);

const IconStar = ({ size = 16, color = '#FFB800' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

const IconUser = ({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <SvgCircle cx="12" cy="7" r="4" />
  </Svg>
);

const IconShare = ({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Svg>
);

const IconCheck = ({ size = 14, color = '#22C55E' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const IconCalendar = ({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18" />
  </Svg>
);

interface TrainingProgramModalProps {
  visible: boolean;
  program: TrainingProgram | null;
  onClose: () => void;
}

type TabType = 'overview' | 'schedule' | 'nutrition';
const TABS: TabType[] = ['overview', 'schedule', 'nutrition'];

const WEEKLY_SCHEDULE = [
  { day: 'Monday', focus: 'Upper Body Strength', duration: '60 min', intensity: 'High' },
  { day: 'Tuesday', focus: 'Cardio & Core', duration: '45 min', intensity: 'Medium' },
  { day: 'Wednesday', focus: 'Lower Body Power', duration: '60 min', intensity: 'High' },
  { day: 'Thursday', focus: 'Active Recovery', duration: '30 min', intensity: 'Low' },
  { day: 'Friday', focus: 'Full Body Circuit', duration: '50 min', intensity: 'High' },
  { day: 'Saturday', focus: 'HIIT Training', duration: '40 min', intensity: 'Very High' },
  { day: 'Sunday', focus: 'Rest & Stretch', duration: '20 min', intensity: 'Low' },
];

const NUTRITION_TIPS = [
  { title: 'Protein Intake', description: '1.6-2.2g per kg of bodyweight daily', icon: '🥩' },
  { title: 'Hydration', description: '3-4 liters of water per day', icon: '💧' },
  { title: 'Pre-Workout', description: 'Complex carbs 2-3 hours before training', icon: '🍌' },
  { title: 'Post-Workout', description: 'Protein shake within 30 minutes', icon: '🥤' },
];

const BENEFITS = [
  'Personalized workout plans',
  'Video exercise demonstrations',
  'Nutrition guidance',
  'Progress tracking tools',
  'Direct trainer support',
];

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'Low': return '#22C55E';
    default: return '#6B7280';
  }
};

type Exercise = { name: string; sets: number; reps: string };
type DailyPlan = { 
  day: string; 
  focus: string; 
  duration: string; 
  intensity: string;
  exercises: Exercise[];
};

const DETAILED_SCHEDULE: DailyPlan[] = [
  { 
    day: 'Monday', 
    focus: 'Upper Body Strength', 
    duration: '60 min', 
    intensity: 'High',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6-8' },
      { name: 'Overhead Press', sets: 4, reps: '8-10' },
      { name: 'Bent Over Rows', sets: 3, reps: '10-12' },
      { name: 'Pull Ups', sets: 3, reps: 'AMRAP' }
    ]
  },
  { 
    day: 'Tuesday', 
    focus: 'Lower Body Power', 
    duration: '60 min', 
    intensity: 'High',
    exercises: [
      { name: 'Squats', sets: 4, reps: '5-8' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10' },
      { name: 'Leg Press', sets: 3, reps: '12-15' },
      { name: 'Calf Raises', sets: 4, reps: '15-20' }
    ]
  },
  { 
    day: 'Wednesday', 
    focus: 'Active Recovery & Cardio', 
    duration: '30 min', 
    intensity: 'Low',
    exercises: [
      { name: 'Light Jog', sets: 1, reps: '20 min' },
      { name: 'Dynamic Stretching', sets: 1, reps: '10 min' }
    ]
  },
  { 
    day: 'Thursday', 
    focus: 'Legs & Core', 
    duration: '50 min', 
    intensity: 'High',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: '5' },
      { name: 'Lunges', sets: 3, reps: '12/leg' },
      { name: 'Plank', sets: 3, reps: '60 sec' }
    ]
  },
  { 
    day: 'Friday', 
    focus: 'Full Body & HIIT', 
    duration: '45 min', 
    intensity: 'Very High',
    exercises: [
      { name: 'Burpees', sets: 4, reps: '15' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20' },
      { name: 'Box Jumps', sets: 3, reps: '12' },
      { name: 'Mountain Climbers', sets: 3, reps: '40 sec' }
    ]
  },
  { day: 'Saturday', focus: 'Rest Day', duration: '0 min', intensity: 'Low', exercises: [] },
  { day: 'Sunday', focus: 'Yoga & Mobility', duration: '40 min', intensity: 'Low', exercises: [] },
];

export const TrainingProgramModal: React.FC<TrainingProgramModalProps> = ({
  visible,
  program,
  onClose,
}) => {
  const { colors, isDark } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [30, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateRight: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const stickyTabsOpacity = scrollY.interpolate({
    inputRange: [230, 231], // Sharp transition right after hero scroll
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const renderTabs = (isSticky = false) => (
    <Animated.View style={[
      styles.tabsContainer, 
      isSticky && { 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
        backgroundColor: colors.background,
        opacity: stickyTabsOpacity 
      }
    ]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => handleTabPress(tab)}
          style={[
            styles.tab,
            selectedTab === tab && { borderBottomColor: colors.accent },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === tab ? colors.accent : colors.textMuted },
              selectedTab === tab && styles.tabTextActive,
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleTabPress = (tab: TabType) => {
    setSelectedTab(tab);
    // If not already snapped, scroll to content
    scrollViewRef.current?.scrollTo({ y: 230, animated: true });
  };

  if (!program) return null;

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About This Program</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              This comprehensive {program.duration.toLowerCase()} program is designed to transform your physique and performance.
              Whether you are looking to build muscle, lose fat, or improve athletic performance, this structured plan provides everything you need.
            </Text>

            <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Level</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{program.level}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Frequency</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>5 days/wk</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Type</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>Hypertrophy</Text>
                </View>
            </View>

            <View style={[styles.benefitsCard, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
              <Text style={[styles.benefitsTitle, { color: colors.text }]}>What You'll Get</Text>
              {BENEFITS.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <View style={[styles.checkCircle, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                    <IconCheck size={12} color="#22C55E" />
                  </View>
                  <Text style={[styles.benefitText, { color: colors.text }]}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'schedule':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Schedule</Text>
            {DETAILED_SCHEDULE.map((day, index) => (
              <View 
                key={index} 
                style={[styles.scheduleCard, { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                  borderColor: isDark ? 'transparent' : colors.gray100,
                  borderWidth: isDark ? 0 : 1,
                }]}
              >
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={styles.scheduleHeader}
                >
                  <View style={styles.dayHeaderLeft}>
                    <View style={[styles.dayBadge, { backgroundColor: colors.accent, borderRadius: 8, padding: 6 }]}>
                       <Text style={[styles.dayTextDate, { color: colors.white, fontWeight: '800' }]}>{day.day.substring(0,3).toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={[styles.dayText, { color: colors.text }]}>{day.focus}</Text>
                      <View style={styles.scheduleMetaRow}>
                        <IconTimer size={12} color={colors.textMuted} />
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{day.duration} • {day.intensity}</Text>
                      </View>
                    </View>
                  </View>
                  <IconCheck size={16} color={colors.success} />
                </TouchableOpacity>

                {day.exercises.length > 0 && (
                  <View style={[styles.exerciseList, { borderTopColor: colors.gray100 }]}>
                    {day.exercises.map((ex, i) => (
                      <View key={i} style={styles.exerciseRow}>
                         <Text style={[styles.exerciseName, { color: colors.textSecondary }]}>• {ex.name}</Text>
                         <Text style={[styles.exerciseSets, { color: colors.textMuted }]}>{ex.sets} x {ex.reps}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        );

      case 'nutrition':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition & Fuel</Text>
             
             {/* Macros Chart Mockup */}
             <View style={[styles.macrosCard, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: colors.accent }]}>180g</Text>
                  <Text style={[styles.macroLabel, { color: colors.textMuted }]}>Protein</Text>
                  <View style={[styles.macroBar, { backgroundColor: colors.accent, width: '100%' }]} />
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#3B82F6' }]}>250g</Text>
                  <Text style={[styles.macroLabel, { color: colors.textMuted }]}>Carbs</Text>
                  <View style={[styles.macroBar, { backgroundColor: '#3B82F6', width: '80%' }]} />
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#F59E0B' }]}>70g</Text>
                  <Text style={[styles.macroLabel, { color: colors.textMuted }]}>Fats</Text>
                  <View style={[styles.macroBar, { backgroundColor: '#F59E0B', width: '40%' }]} />
                </View>
             </View>

            <Text style={[styles.subHeading, { color: colors.text }]}>Daily Guidelines</Text>
            {NUTRITION_TIPS.map((tip, index) => (
              <View 
                key={index} 
                style={[styles.nutritionCard, { 
                  backgroundColor: colors.surface,
                  borderColor: colors.gray100
                }]}
              >
                <Text style={styles.nutritionIcon}>{tip.icon}</Text>
                <View style={styles.nutritionContent}>
                  <Text style={[styles.nutritionTitle, { color: colors.text }]}>{tip.title}</Text>
                  <Text style={[styles.nutritionDesc, { color: colors.textMuted }]}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BottomSheetModal 
        onClose={onClose} 
        height="100%"
        safeAreaEdges={['bottom']}
        showDragHandle={true}
      >
        <StatusBar backgroundColor={colors.surface} barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Fixed Header with Close Button */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.gray100 }]}>
          <TouchableOpacity onPress={onClose} style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <IconBack size={18} color={colors.text} />
          </TouchableOpacity>
          
          <Animated.View style={[styles.headerTitleContainer, { opacity: stickyHeaderOpacity }]}>
            <View style={styles.headerTitleContent}>
              <Image source={{ uri: program.trainerImage }} style={styles.headerAvatar} />
              <View>
                <Text style={[styles.headerTrainerName, { color: colors.text }]}>{program.trainer}</Text>
                <View style={styles.headerRatingRow}>
                  <IconStar size={10} color="#FFB800" />
                  <Text style={[styles.headerRatingText, { color: colors.textMuted }]}>{program.rating}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} 
            onPress={() => setShowShareModal(true)}
          >
            <IconShare size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Main ScrollView and Sticky Tabs Wrapper */}
        <View style={{ flex: 1 }}>
          <Animated.ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            snapToOffsets={[230]}
            snapToEnd={false}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          >

            {/* 0: Hero Section */}
            <View style={styles.heroContainer}>
              <Animated.Image
                source={{ uri: program.image }}
                style={[
                  styles.heroImage,
                  { transform: [{ scale: imageScale }, { translateY: imageTranslateY }] },
                ]}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent','rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFill}
              />
              
              <Animated.View style={[styles.heroContent, { opacity: headerOpacity }]}>
                {/* Level Badge */}
                <View style={[styles.levelBadge, { backgroundColor: colors.accent }]}>
                  <IconFlame size={12} color="#FFF" />
                  <Text style={styles.levelText}>{program.level}</Text>
                </View>
                
                {/* Title */}
                <Text style={styles.heroTitle}>{program.title}</Text>
                
                {/* Trainer */}
                <View style={styles.trainerRow}>
                  <Image source={{ uri: program.trainerImage }} style={styles.trainerAvatar} />
                  <View>
                    <Text style={styles.trainerLabel}>Your Trainer</Text>
                    <Text style={styles.trainerName}>{program.trainer}</Text>
                  </View>
                </View>
                
                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <IconTimer size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.statText}>{program.duration}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <IconStar size={14} color="#FFB800" />
                    <Text style={styles.statText}>{program.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <IconUser size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.statText}>{program.students}+</Text>
                  </View>
                </View>
              </Animated.View>
            </View>

            {/* 1: Tabs (Scrollable) */}
            {renderTabs(false)}

            {/* 2: Content based on active tab */}
            <View style={{ minHeight: Dimensions.get('window').height }}>
               {renderContent()}
            </View>

          </Animated.ScrollView>

          {/* Sticky Tabs (Absolute) */}
          {renderTabs(true)}
        </View>

        {/* Footer CTA */}
        <View style={[styles.footer, { backgroundColor: colors.surface, paddingBottom: insets.bottom, borderTopColor: colors.gray100 }]}>
            <Button
              title="Start Training  •  ₾99"
              variant="primary"
              size="lg"
              leftIcon={<IconFlame size={20} color="#FFF" />}
              block
              textStyle={{ fontWeight: '700' }}
            />
        </View>

        {/* Share Modal */}
        <ShareModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          item={{
            id: program.id,
            title: program.title,
            description: `Check out ${program.title} - ${program.trainer} on supplement.ge!`,
            image: program.image,
            type: 'program',
            url: `https://supplement.ge/programs/${program.id}`
          }}
        />
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  headerTrainerName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  headerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerRatingText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    height: 230,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    marginBottom: 12,
  },
  levelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 16,
    lineHeight: 32,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  trainerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  trainerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 2,
  },
  trainerName: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
  },
  tabsContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 8,
    zIndex: 1000,
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
  },
  benefitsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  scheduleCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  scheduleHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  dayTextDate: {
    fontSize: 12,
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  exerciseList: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseSets: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
  },
  statBox: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
  },
  statLabel: {
      fontSize: 12,
      marginBottom: 4,
  },
  statValue: {
      fontSize: 14,
      fontWeight: '700',
  },
  macrosCard: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 16,
      gap: 16,
      marginBottom: 24,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
  },
  macroItem: {
      flex: 1,
      alignItems: 'center',
  },
  macroValue: {
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 4,
  },
  macroLabel: {
      fontSize: 12,
      marginBottom: 8,
  },
  macroBar: {
      height: 4,
      borderRadius: 2,
  },
  subHeading: {
     fontSize: 18,
     fontWeight: '700',
     marginBottom: 16,
     marginTop: 8,
  },
  dayBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionIcon: {
    fontSize: 32,
  },
  nutritionContent: {
    flex: 1,
  },
  nutritionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  nutritionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
});