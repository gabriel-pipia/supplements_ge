import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { TrainingProgram } from '../../data/training';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { BottomSheetModal } from './BottomSheetModal'; // Resolves to .web
import { ShareModal } from './ShareModal';
import { Button } from './Button';

// Web styles
const webStyles = {
    pointer: { cursor: 'pointer' } as any,
    stickyHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
    } as any,
    scrollContainer: {
        maxHeight: '80vh',
        overflowY: 'auto'
    } as any,
    cardHover: {
        transition: 'transform 0.2s, box-shadow 0.2s',
    } as any
};

// ... Icons (Same as native) ...
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

interface TrainingProgramModalProps {
  visible: boolean;
  program: TrainingProgram | null;
  onClose: () => void;
}

type TabType = 'overview' | 'schedule' | 'nutrition';
const TABS: TabType[] = ['overview', 'schedule', 'nutrition'];

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
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  
  if (!program) return null;

  const renderContent = () => {
      if (selectedTab === 'overview') {
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
                {/* Benefits */}
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
      } else if (selectedTab === 'schedule') {
          return (
              <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Schedule</Text>
                  {DETAILED_SCHEDULE.map((day, index) => (
                      <View 
                        key={index}
                        style={[
                            styles.scheduleCard, 
                            { 
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                                borderColor: colors.gray100,
                                borderWidth: 1
                            }
                        ]}
                      >
                         <View style={styles.scheduleHeader}>
                             <View style={styles.dayHeaderLeft}>
                                <View style={[styles.dayBadge, { backgroundColor: colors.accent, borderRadius: 8, padding: 6 }]}>
                                    <Text style={{ color: colors.text, fontWeight: '800', fontSize: 12 }}>{day.day.substring(0,3).toUpperCase()}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{day.focus}</Text>
                                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>{day.duration} • {day.intensity}</Text>
                                </View>
                             </View>
                         </View>
                         {day.exercises.length > 0 && (
                             <View style={[styles.exerciseList, { borderTopColor: colors.gray100 }]}>
                                 {day.exercises.map((ex, i) => (
                                     <View key={i} style={styles.exerciseRow}>
                                         <Text style={{ color: colors.textSecondary }}>• {ex.name}</Text>
                                         <Text style={{ color: colors.textMuted }}>{ex.sets} x {ex.reps}</Text>
                                     </View>
                                 ))}
                             </View>
                         )}
                      </View>
                  ))}
              </View>
          )
      } else {
          return (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition & Fuel</Text>
                
                {/* Macros Chart Mockup */}
                <View style={[styles.macrosCard, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                    <View style={styles.macroItem}>
                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginBottom: 4}}>
                           <Text style={{ color: colors.textMuted, fontSize: 12 }}>Protein</Text>
                           <Text style={{ color: colors.accent, fontWeight:'bold' }}>180g</Text>
                        </View>
                        <View style={{ height: 6, backgroundColor: colors.gray100, borderRadius: 3, overflow: 'hidden' }}>
                           <View style={{ height: '100%', width: '100%', backgroundColor: colors.accent }} />
                        </View>
                    </View>
                     <View style={styles.macroItem}>
                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginBottom: 4}}>
                           <Text style={{ color: colors.textMuted, fontSize: 12 }}>Carbs</Text>
                           <Text style={{ color: '#3B82F6', fontWeight:'bold' }}>250g</Text>
                        </View>
                        <View style={{ height: 6, backgroundColor: colors.gray100, borderRadius: 3, overflow: 'hidden' }}>
                           <View style={{ height: '100%', width: '80%', backgroundColor: '#3B82F6' }} />
                        </View>
                    </View>
                     <View style={styles.macroItem}>
                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginBottom: 4}}>
                           <Text style={{ color: colors.textMuted, fontSize: 12 }}>Fats</Text>
                           <Text style={{ color: '#F59E0B', fontWeight:'bold' }}>70g</Text>
                        </View>
                        <View style={{ height: 6, backgroundColor: colors.gray100, borderRadius: 3, overflow: 'hidden' }}>
                           <View style={{ height: '100%', width: '40%', backgroundColor: '#F59E0B' }} />
                        </View>
                    </View>
                </View>

                <Text style={[styles.subHeading, { color: colors.text }]}>Daily Guidelines</Text>
                {NUTRITION_TIPS.map((tip, index) => (
                    <View 
                        key={index} 
                        style={[styles.nutritionCard, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}
                    >
                        <Text style={{ fontSize: 24, marginRight: 16 }}>{tip.icon}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontWeight: 'bold' }}>{tip.title}</Text>
                            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{tip.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
          )
      }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal 
        onClose={onClose} 
        height="90%"
        showDragHandle={false}
      >
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <TouchableOpacity onPress={onClose} style={[webStyles.pointer, { marginRight: 16 }]}>
                         <IconBack size={24} color={colors.text} />
                     </TouchableOpacity>
                     
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Image source={{ uri: program.trainerImage }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                        <View>
                           <Text style={{ fontWeight: 'bold', color: colors.text }}>{program.trainer}</Text>
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                               <IconStar size={10} color="#FFB800" />
                               <Text style={{ fontSize: 12, color: colors.textMuted }}>{program.rating}</Text>
                           </View>
                        </View>
                     </View>
                </View>
                
                <TouchableOpacity onPress={() => setShowShareModal(true)} style={webStyles.pointer}>
                    <IconShare size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={{ flex: 1 }}>
                 {/* Hero Image */}
                 <View style={styles.heroContainer}>
                    <Image source={{ uri: program.image }} style={styles.heroImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.heroContent}>
                         <View style={[styles.levelBadge, { backgroundColor: colors.accent }]}>
                              <IconFlame size={12} color="#FFF" />
                              <Text style={styles.levelText}>{program.level}</Text>
                         </View>
                         <Text style={styles.heroTitle}>{program.title}</Text>
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
                    </View>
                 </View>

                 {/* Sticky Tabs */}
                 <View style={[styles.tabsContainer, { backgroundColor: colors.background, borderBottomColor: colors.gray100 }, webStyles.stickyHeader]}>
                     {TABS.map(tab => (
                         <TouchableOpacity 
                            key={tab} 
                            style={[styles.tab, selectedTab === tab && { borderBottomColor: colors.accent }, webStyles.pointer]}
                            onPress={() => setSelectedTab(tab)}
                         >
                             <Text style={[styles.tabText, selectedTab === tab ? { color: colors.accent, fontWeight: '700' } : { color: colors.textMuted }]}>
                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
                             </Text>
                         </TouchableOpacity>
                     ))}
                 </View>

                 {renderContent()}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.gray100 }]}>
                <Button 
                    title="Start Training  •  ₾99" 
                    variant="primary" 
                    block 
                    size="lg" 
                    leftIcon={<IconFlame size={20} color="#FFF" />}
                    textStyle={{ fontWeight: '700' }}
                />
            </View>
            
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
        </View>
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    heroContainer: {
        height: 300,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
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
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 16,
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
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 24,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        ...Platform.select({
           web: { 
             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
           } as any 
        })
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    benefitsCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        ...Platform.select({
           web: { 
             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
           } as any 
        })
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    benefitText: {
        fontSize: 14,
    },
    scheduleCard: {
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    scheduleHeader: {
        padding: 16,
    },
    dayHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dayBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
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
    macrosCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        ...Platform.select({
           web: { 
             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
           } as any 
        })
    },
    macroItem: {
        marginBottom: 12,
    },
    nutritionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        ...Platform.select({
           web: { 
             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
           } as any 
        })
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    }
});
