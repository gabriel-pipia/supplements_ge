import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  Switch,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, useModal } from '../context';
import { useResponsive } from '../hooks';
import { IconUser, IconHeart, IconCart, IconLogOut } from '../components/icons';
import { ProfileEditModal } from '../components/common/ProfileEditModal';
import { Button } from '../components/common/Button';
import { CustomRefreshControl } from '../components/common';
import Svg, { Path, Circle } from 'react-native-svg';

interface ProfileScreenProps {
  cartCount: number;
  favoritesCount: number;
}

// Icons with string color type
const IconSettings = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const IconBell = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Svg>
);

const IconMapPin = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const IconCreditCard = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
    <Path d="M1 10h22" />
  </Svg>
);

const IconHelpCircle = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Circle cx="12" cy="17" r="0.5" fill={color} />
  </Svg>
);

const IconChevronRight = ({ size = 20, color = '#9CA3AF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="m9 18 6-6-6-6" />
  </Svg>
);

const IconMoon = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

const IconGlobe = ({ size = 24, color = '#18181B' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const SettingsItem = ({ 
  icon: Icon, 
  label, 
  onPress, 
  rightElement, 
  colors,
  isLast = false,
  isDesktop
}: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { borderBottomColor: colors.gray100 },
        !isLast && { borderBottomWidth: 1 },
        isHovered && isDesktop && { backgroundColor: colors.gray50 },
        Platform.select({ web: { transition: '0.2s' } as any })
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      // @ts-ignore
      onMouseEnter={() => setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => setIsHovered(false)}
    >
      <View style={[styles.menuIconWrapper, { backgroundColor: colors.gray50 }]}>
        <Icon size={22} color={colors.text} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.menuRightArgs}>
        {rightElement}
        {!rightElement && <IconChevronRight color={colors.gray400} />}
      </View>
    </TouchableOpacity>
  );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  cartCount,
  favoritesCount,
}) => {
  const { colors, isDark, toggleTheme, t, language, showLanguageModal, user, isGuest, logout } = useApp();
  const { openModal } = useModal();
  const { isDesktop, containerPadding, maxContentWidth } = useResponsive();
  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate user data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleMenuPress = (id: string) => {
    switch (id) {
      case 'favorites':
        if (isGuest) { openModal('AUTH'); return; }
        openModal('FAVORITES_LIST');
        break;
      case 'addresses':
        if (isGuest) { openModal('AUTH'); return; }
        openModal('ADDRESSES');
        break;
      case 'payment':
        if (isGuest) { openModal('AUTH'); return; }
        openModal('PAYMENT_METHODS');
        break;
      case 'notifications':
        if (isGuest) { openModal('AUTH'); return; }
        openModal('NOTIFICATIONS');
        break;
      case 'help':
        openModal('HELP');
        break;
      case 'orders':
        if (isGuest) { openModal('AUTH'); return; }
        openModal('ORDERS');
        break;
    }
  };

  const menuItems = [
    { id: 'orders', icon: IconCart, label: t('myOrders'), badge: user.orders && user.orders.length > 0 ? user.orders.length.toString() : undefined },
    { id: 'favorites', icon: IconHeart, label: t('favorites'), badge: favoritesCount > 0 ? favoritesCount.toString() : undefined },
    { id: 'addresses', icon: IconMapPin, label: t('addresses') },
    { id: 'payment', icon: IconCreditCard, label: t('paymentMethods') },
    { id: 'notifications', icon: IconBell, label: t('notifications') },
    { id: 'help', icon: IconHelpCircle, label: t('help') },
  ];

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}>
      <StatusBar barStyle={colors.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[
          styles.header, 
          isDesktop && { 
            paddingHorizontal: containerPadding, 
            maxWidth: maxContentWidth, 
            width: '100%', 
            alignSelf: 'center' 
          }
        ]}>
          <Text style={[styles.title, { color: colors.text }]}>{t('profileTitle')}</Text>
        </View>

        <CustomRefreshControl 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && { alignItems: 'center' }
          ]}
          refreshing={refreshing}
          onRefresh={onRefresh}
        >
          <View style={[
            styles.contentContainer,
            isDesktop && { 
              flex: 1,
              flexDirection: 'row', 
              alignItems: 'flex-start',
              width: '100%',
              paddingHorizontal: containerPadding,
              gap: 24,
            }
          ]}>
            
            {/* Left Column (Desktop) */}
            <View style={[
              styles.column, 
              isDesktop ? { width: '40%', flex: 1 } : { width: '100%' }
            ]}>
              {/* Profile Card - Only if logged in */}
              {!isGuest && (
                <View style={[
                  styles.profileCardContainer, 
                  { shadowColor: colors.accent },
                  isDesktop && { marginHorizontal: 0 }
                ]}>
                <LinearGradient
                  colors={colors.gradientPrimary as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileCard}
                >
                  <View style={styles.profileHeader}>
                    <View style={[styles.avatarWrapper, { borderColor: 'rgba(255,255,255,0.3)' }]}>
                      <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        {user.avatar ? (
                          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                        ) : (
                          <IconUser size={40} color="#FFF" />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.profileInfo}>
                      <Text style={[styles.userName, { color: '#FFF' }]}>{user.name}</Text>
                      <Text style={[styles.userEmail, { color: 'rgba(255,255,255,0.8)' }]}>{user.email}</Text>
                      
                      
                      {!isGuest && (
                          <Button
                            title={t('edit')}
                            onPress={() => setEditModalVisible(true)}
                            variant="outline"
                            size="sm"
                            style={{ 
                            alignSelf: 'flex-start',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderColor: 'rgba(255,255,255,0.3)',
                            borderWidth: 1,
                            paddingHorizontal: 16,
                            height: 32,
                            }}
                            textStyle={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}
                        />
                      )}
                    </View>
                  </View>
                  
                  {/* Bio Stats - Only show if not guest */}
                  {!isGuest && (
                      <View style={[styles.bioStatsContainer, { 
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }]}>
                    <View style={styles.bioStatItem}>
                      <Text style={[styles.bioStatValue, { color: '#FFF' }]}>
                        {user.age || '-'}
                      </Text>
                      <Text style={[styles.bioStatLabel, { color: 'rgba(255,255,255,0.7)' }]}>Age</Text>
                    </View>
                    <View style={[styles.bioStatDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                    <View style={styles.bioStatItem}>
                      <Text style={[styles.bioStatValue, { color: '#FFF' }]}>
                        {user.weight ? `${user.weight}` : '-'} <Text style={{ fontSize: 12 }}>kg</Text>
                      </Text>
                      <Text style={[styles.bioStatLabel, { color: 'rgba(255,255,255,0.7)' }]}>Weight</Text>
                    </View>
                    <View style={[styles.bioStatDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                    <View style={styles.bioStatItem}>
                      <Text style={[styles.bioStatValue, { color: '#FFF' }]}>
                        {user.height ? `${user.height}` : '-'} <Text style={{ fontSize: 12 }}>cm</Text>
                      </Text>
                      <Text style={[styles.bioStatLabel, { color: 'rgba(255,255,255,0.7)' }]}>Height</Text>
                    </View>
                  </View>
                  )}

                  {/* Goals */}
                  {user.goals && user.goals.length > 0 && (
                    <View style={styles.goalsWrapper}>
                      {user.goals.map((goal, index) => (
                        <View key={index} style={[styles.goalChip, { 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderColor: 'rgba(255,255,255,0.2)'
                        }]}>
                          <Text style={[styles.goalText, { color: '#FFF' }]}>{goal}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </LinearGradient>
              </View>
              )}

              {isGuest && (
                 <View style={{ marginHorizontal: 16, marginBottom: 24, padding: 20, backgroundColor: colors.surface, borderRadius: 20, alignItems: 'center' }}>
                     <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>{t('guestWelcome') || 'Join Supplements.ge'}</Text>
                     <Text style={{ textAlign: 'center', color: colors.textMuted, marginBottom: 16 }}>
                         {t('guestDesc') || 'Sign up to track your orders, save favorites, and get personalized recommendations.'}
                     </Text>
                     <Button 
                        title={t('loginOrSignup') || 'Login / Sign Up'}
                        onPress={() => openModal('AUTH')}
                        variant="primary"
                        style={{ width: '100%' }}
                     />
                 </View>
              )}

              {/* Stats - Hide for Guest */}
              {!isGuest && (
                 <View style={[
                  styles.statsRow, 
                  { backgroundColor: colors.surface },
                  isDesktop && { marginHorizontal: 0 }
                ]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{cartCount}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('inCart')}</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.gray200 }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{favoritesCount}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('favorites')}</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.gray200 }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{user.orders?.length || 0}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t('orders')}</Text>
                </View>
              </View>
              )}
            </View>

            {/* Right Column (Desktop) */}
            <View style={[
              styles.column, 
              isDesktop ? { width: '60%' } : { width: '100%' }
            ]}>
              
              {/* Settings Section */}
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settings')}</Text>
              <View style={[
                  styles.menuSection, 
                  { backgroundColor: colors.surface },
                  isDesktop && { marginHorizontal: 0 }
                ]}>
                
                <View style={[styles.menuItem, { borderBottomColor: colors.gray100, borderBottomWidth: 1 }]}>
                  <View style={[styles.menuIconWrapper, { backgroundColor: colors.gray50 }]}>
                    <IconMoon size={22} color={colors.text} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{t('darkMode')}</Text>
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.gray200, true: colors.accent }}
                    thumbColor={colors.white}
                    {...Platform.select({ web: { activeThumbColor: colors.white } })}
                  />
                </View>

                {/* Language Selector */}
                <SettingsItem
                  icon={IconGlobe}
                  label={t('language')}
                  onPress={showLanguageModal}
                  colors={colors}
                  isDesktop={isDesktop}
                  isLast={true}
                  rightElement={
                    <View style={styles.languageValue}>
                      <Text style={[styles.languageText, { color: colors.textMuted }]}>
                        {language === 'ka' ? '🇬🇪 ქართული' : '🇬🇧 English'}
                      </Text>
                      <IconChevronRight color={colors.gray400} />
                    </View>
                  }
                />
              </View>

              {/* Menu Items */}
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('profile')}</Text>
              <View style={[
                  styles.menuSection, 
                  { backgroundColor: colors.surface },
                  isDesktop && { marginHorizontal: 0 }
                ]}>
                {menuItems.map((item, index) => (
                  <SettingsItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onPress={() => handleMenuPress(item.id)}
                    colors={colors}
                    isDesktop={isDesktop}
                    isLast={index === menuItems.length - 1}
                    rightElement={item.badge ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <View style={[styles.menuBadge, { backgroundColor: colors.accent }]}>
                          <Text style={[styles.menuBadgeText, { color: colors.white }]}>{item.badge}</Text>
                        </View>
                        <IconChevronRight color={colors.gray400} />
                      </View>
                    ) : undefined}
                  />
                ))}
              </View>

              {/* Logout/Login Button */}
              <View style={{ paddingHorizontal: isDesktop ? 0 : 16, marginBottom: 16 }}>
                {!isGuest && (
                    <Button
                    title={t('logout')}
                    onPress={logout}
                    variant="secondary"
                    size="lg"
                    leftIcon={<IconLogOut size={22} color={colors.accent} />}
                    style={{ backgroundColor: colors.surface }}
                    textStyle={{ color: colors.accent }}
                    />
                )}
                {isGuest && (
                    <Button
                    title={t('login')}
                    onPress={() => openModal('AUTH')}
                    variant="primary"
                    size="lg"
                    style={{ }}
                    />
                )}
              </View>

              {/* App Version */}
              <Text style={[styles.version, { color: colors.textMuted }]}>{t('version')} 1.0.0</Text>
            </View>
          </View>
          
          <ProfileEditModal 
            visible={isEditModalVisible} 
            onClose={() => setEditModalVisible(false)} 
          />
        </CustomRefreshControl>
      </SafeAreaView>
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  contentContainer: {
    width: '100%',
  },
  column: {
    flexDirection: 'column',
  },
  profileCardContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  bioStatsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  bioStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  bioStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bioStatLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bioStatDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  goalsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  goalText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    // borderBottomWidth handled in render
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  menuRightArgs: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  menuBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 32,
  },
});
