import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useApp } from '../context';
import { IconSearch, IconCart } from '../components/icons';
import Svg, { Path, Circle, Line } from 'react-native-svg';

// Custom Icons for Sidebar
const IconHome = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

const IconProfile = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

// Hamburger Menu Icon
const IconMenu = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Line x1="3" y1="6" x2="21" y2="6" />
    <Line x1="3" y1="12" x2="21" y2="12" />
    <Line x1="3" y1="18" x2="21" y2="18" />
  </Svg>
);

// Chevron Left Icon for collapse
const IconChevronLeft = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="m15 18-6-6 6-6" />
  </Svg>
);

interface SidebarNavProps {
  currentTab: number;
  onTabPress: (index: number) => void;
  cartCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

export const SidebarNav: React.FC<SidebarNavProps> = ({ 
  currentTab, 
  onTabPress, 
  cartCount,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { colors, t } = useApp();
  const widthAnim = useRef(new Animated.Value(isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH)).current;
  const labelOpacity = useRef(new Animated.Value(isCollapsed ? 0 : 1)).current;
  const chevronRotate = useRef(new Animated.Value(isCollapsed ? 1 : 0)).current;

  const NAV_ITEMS = [
    { id: 'home', label: t('home'), icon: IconHome },
    { id: 'search', label: t('search'), icon: IconSearch },
    { id: 'cart', label: t('cart'), icon: IconCart, count: cartCount },
    { id: 'profile', label: t('profile'), icon: IconProfile },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        friction: 20,
        tension: 170,
        useNativeDriver: false,
      }),
      Animated.timing(labelOpacity, {
        toValue: isCollapsed ? 0 : 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.spring(chevronRotate, {
        toValue: isCollapsed ? 1 : 0,
        friction: 15,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isCollapsed]);

  const chevronRotation = chevronRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.sidebar, 
        { 
          backgroundColor: colors.surface, 
          borderRightColor: colors.gray100,
          width: widthAnim,
        }
      ]}
    >
      {/* Toggle Button */}
      <TouchableOpacity 
        style={[
          styles.toggleButton, 
          { backgroundColor: colors.gray100 },
          isCollapsed && styles.toggleButtonCollapsed
        ]}
        onPress={onToggleCollapse}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <IconChevronLeft color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

      <View style={[styles.navSection, isCollapsed && styles.navSectionCollapsed]}>
        {NAV_ITEMS.map((item, index) => {
          const isActive = currentTab === index;
          const Icon = item.icon;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isCollapsed && styles.navItemCollapsed,
                isActive && { backgroundColor: colors.accent + '15' }
              ]}
              onPress={() => onTabPress(index)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isCollapsed && styles.iconWrapperCollapsed]}>
                <Icon color={isActive ? colors.accent : colors.textMuted} />
                {item.count !== undefined && item.count > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.badgeText}>{item.count}</Text>
                  </View>
                )}
              </View>
              
              {!isCollapsed && (
                <Animated.Text 
                  style={[
                    styles.navLabel, 
                    { color: isActive ? colors.text : colors.textMuted, opacity: labelOpacity },
                    isActive && { fontWeight: '700' }
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Animated.Text>
              )}
              
              {isActive && !isCollapsed && (
                <View style={[styles.indicator, { backgroundColor: colors.accent }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {!isCollapsed && (
        <Animated.View style={[styles.footer, { opacity: labelOpacity }]}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            © 2026 Supplements.ge
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    paddingVertical: 20,
    borderRightWidth: 1,
    overflow: 'hidden',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft: 18,
  },
  toggleButtonCollapsed: {
    alignSelf: 'center',
    marginLeft: 0,
  },
  navSection: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  navSectionCollapsed: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    position: 'relative',
  },
  navItemCollapsed: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    width: 56,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  iconWrapperCollapsed: {
    marginRight: 0,
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 15,
    bottom: 15,
    width: 4,
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
  },
});
