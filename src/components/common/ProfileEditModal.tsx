import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal';
import { Button } from './Button';
import { Input } from './Input';
import Svg, { Path, Circle } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { IconUser, IconMail, IconPhone, IconCalendar, IconRuler, IconScale } from '../icons';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconCamera = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const GOALS = [
  { id: 'Muscle Gain', key: 'buildMuscle' },
  { id: 'Weight Loss', key: 'loseWeight' },
  { id: 'Endurance', key: 'improveStamina' },
  { id: 'Strength', key: 'increaseStrength' },
  { id: 'General Health', key: 'generalHealth' },
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ visible, onClose }) => {
  const { colors, t, user, updateUser, isDark } = useApp();
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Numeric fields
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  
  // Goals
  const [goals, setGoals] = useState<string[]>(user?.goals || []);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setAge(user.age?.toString() || '');
        setWeight(user.weight?.toString() || '');
        setHeight(user.height?.toString() || '');
        setGoals(user.goals || []);
        setAvatar(user.avatar || null);
    }
  }, [visible, user]);

  const toggleGoal = (goalId: string) => {
    setGoals(prev => {
        if (prev.includes(goalId)) {
            return prev.filter(g => g !== goalId);
        } else {
            return [...prev, goalId];
        }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        updateUser({ 
            name, 
            email, 
            phone,
            age: age ? parseInt(age) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            height: height ? parseFloat(height) : undefined,
            goals,
            avatar: avatar || undefined
        });
        setLoading(false);
        onClose();
    }, 800);
  };

  const handleChangePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal 
        onClose={onClose} 
        height="100%"
        showDragHandle={true}
      >
        <KeyboardAvoidingView 
            behavior='padding'
            style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.closeButton, { backgroundColor: colors.surface }]} 
                    onPress={onClose}
                >
                    <IconClose size={20} color={colors.text} />
                </TouchableOpacity>
                
                <Text style={[styles.title, { color: colors.text }]}>{t('editProfile')}</Text>

                <TouchableOpacity 
                    onPress={handleSave}
                    disabled={loading}
                    style={styles.headerSaveButton}
                >
                    <Text style={[styles.headerSaveText, { color: colors.accent }]}>
                        {loading ? '•••' : t('save') || 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.content} 
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Photo Section */}
                <View style={styles.photoContainer}>
                    <TouchableOpacity onPress={handleChangePhoto} style={styles.imageWrapper}>
                         {avatar ? (
                             <Image source={{ uri: avatar }} style={styles.avatar} />
                         ) : (
                             <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
                                 <Text style={styles.avatarInitials}>
                                    {name.charAt(0).toUpperCase()}
                                 </Text>
                             </View>
                         )}
                         <View style={[styles.editBadge, { backgroundColor: colors.accent, borderColor: colors.gray100 }]}>
                              <IconCamera size={14} color={colors.white} />
                         </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChangePhoto}>
                        <Text style={[styles.changePhotoText, { color: colors.accent }]}>{t('changePhoto')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Personal Info */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
                    <Input
                        label={t('name')}
                        value={name}
                        onChangeText={setName}
                        placeholder="John Doe"
                        leftIcon={<IconUser size={20} color={colors.textMuted} />}
                        containerStyle={styles.inputSpacing}
                    />
                    <Input
                        label={t('email')}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="john@example.com"
                        keyboardType="email-address"
                        leftIcon={<IconMail size={20} color={colors.textMuted} />}
                        containerStyle={styles.inputSpacing}
                    />
                    <Input
                        label={t('phone')}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+995 5xx xxx xxx"
                        keyboardType="phone-pad"
                        leftIcon={<IconPhone size={20} color={colors.textMuted} />}
                        containerStyle={styles.inputSpacing}
                    />
                </View>

                {/* Physical Stats - Single Row */}
                <View style={styles.row}>
                    <View style={styles.thirdInput}>
                         <Input
                            label={t('age')}
                            value={age}
                            onChangeText={setAge}
                            placeholder="25"
                            keyboardType="numeric"
                            leftIcon={<IconCalendar size={20} color={colors.textMuted} />}
                        />
                    </View>
                    <View style={styles.thirdInput}>
                        <Input
                            label={t('weight')}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="75"
                            keyboardType="numeric"
                            leftIcon={<IconScale size={20} color={colors.textMuted} />}
                        />
                    </View>
                    <View style={styles.thirdInput}>
                        <Input
                            label={t('height')}
                            value={height}
                            onChangeText={setHeight}
                            placeholder="180"
                            keyboardType="numeric"
                            leftIcon={<IconRuler size={20} color={colors.textMuted} />}
                        />
                    </View>
                </View>

                {/* Goals */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('fitnessGoals')}</Text>
                <View style={styles.goalsContainer}>
                    {GOALS.map((goal) => {
                        const isSelected = goals.includes(goal.id);
                        return (
                            <TouchableOpacity
                                key={goal.id}
                                style={[
                                    styles.goalChip,
                                    { 
                                        backgroundColor: isSelected ? colors.accent : colors.surface,
                                        borderColor: isSelected ? colors.accent : colors.gray100
                                    }
                                ]}
                                onPress={() => toggleGoal(goal.id)}
                            >
                                <Text style={[
                                    styles.goalText,
                                    { color: isSelected ? '#FFFFFF' : colors.text }
                                ]}>
                                    {t(goal.key as any) || goal.id}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    padding: Platform.OS == "web" ? 16 : 0,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  photoContainer: {
      alignItems: 'center',
      marginBottom: 32,
  },
  imageWrapper: {
      position: 'relative',
      marginBottom: 12,
  },
  avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
  },
  avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
  },
  avatarInitials: {
      fontSize: 36,
      fontWeight: '700',
      color: '#FFFFFF',
  },
  editBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
  },
  changePhotoText: {
      fontSize: 14,
      fontWeight: '600',
  },
  section: {
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
  },
  inputSpacing: {
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
  },
  goalsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 32,
  },
  goalChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
    },
  goalText: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
  },
  headerSaveButton: {
      paddingVertical: 6,
      minWidth: 40
  },
  headerSaveText: {
      fontSize: 16,
      fontWeight: '600',
  },
  thirdInput: {
      flex: 1,
      marginHorizontal: 4,
  },
  row: {
      flexDirection: 'row',
      marginBottom: 16,
      marginHorizontal: -4, 
  },
});
