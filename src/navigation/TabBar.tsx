import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useApp } from '../context';

interface TabBarProps {
  currentTab: number;
  onTabPress: (index: number) => void;
  cartCount: number;
}

// Icon Components - filled when active
const IconHome = ({ active, colors }: { active: boolean; colors: any }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    {active ? (
      <Path 
        d="M21 9.492v9.76a2.748 2.748 0 0 1-2.748 2.748h-3.415a.733.733 0 0 1-.733-.733v-3.72a2.112 2.112 0 1 0-4.224 0v3.72a.733.733 0 0 1-.733.733H5.733A2.747 2.747 0 0 1 2.985 19.252V9.493a3.666 3.666 0 0 1 1.072-2.593L9.833 1.55c1.168-1.168 3.167-1.168 4.334 0l5.776 5.349A3.667 3.667 0 0 1 21 9.493z" 
        fill={colors.accent} 
      />
    ) : (
      <Path 
        d="M21 9.492v9.76a2.748 2.748 0 0 1-2.748 2.748h-3.415a.733.733 0 0 1-.733-.733v-3.72a2.112 2.112 0 1 0-4.224 0v3.72a.733.733 0 0 1-.733.733H5.733A2.747 2.747 0 0 1 2.985 19.252V9.493a3.666 3.666 0 0 1 1.072-2.593L9.833 1.55c1.168-1.168 3.167-1.168 4.334 0l5.776 5.349A3.667 3.667 0 0 1 21 9.493z" 
        stroke={colors.textMuted} 
        strokeWidth={1.5}
        fill="none"
      />
    )}
  </Svg>
);

const IconSearch = ({ active, colors }: { active: boolean; colors: any }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" 
    fill="none" 
    stroke={active ? colors.accent : colors.textMuted} 
    strokeWidth={active ? 2.5 : 2}>
    <SvgCircle cx="11" cy="11" r="8" />
    <Path d="m21 21-4.3-4.3" />
  </Svg>
);

const IconCart = ({ active, colors }: { active: boolean; colors: any }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" 
    fill={active ? colors.accent : 'none'} 
    stroke={active ? colors.accent : colors.textMuted} 
    strokeWidth={active ? 1.5 : 2}>
    <Path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    <SvgCircle cx="8" cy="21" r="1" fill={active ? colors.accent : colors.textMuted} />
    <SvgCircle cx="19" cy="21" r="1" fill={active ? colors.accent : colors.textMuted} />
  </Svg>
);

const IconUser = ({ active, colors }: { active: boolean; colors: any }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" 
    fill={active ? colors.accent : 'none'} 
    stroke={active ? colors.accent : colors.textMuted} 
    strokeWidth={active ? 1.5 : 2}>
    <SvgCircle cx="12" cy="8" r="5" />
    <Path d="M20 21a8 8 0 0 0-16 0" />
  </Svg>
);

export const TabBar: React.FC<TabBarProps> = ({ 
  currentTab, 
  onTabPress, 
  cartCount,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, t } = useApp();

  const tabs = [
    { id: 'home', label: t('home'), Icon: IconHome },
    { id: 'search', label: t('search'), Icon: IconSearch },
    { id: 'cart', label: t('cart'), Icon: IconCart },
    { id: 'profile', label: t('profile'), Icon: IconUser },
  ];

  return (
    <View style={[styles.container, { 
      paddingBottom: Math.max(insets.bottom, 8),
      backgroundColor: colors.surface,
      borderTopColor: colors.gray100
    }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = currentTab === index;
          const { Icon } = tab;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabPress(index)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon active={isActive} colors={colors} />
                {tab.id === 'cart' && cartCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.surface }]}>
                    <Text style={[styles.badgeText, { color: colors.white }]}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.label, 
                { color: colors.textMuted },
                isActive && [styles.labelActive, { color: colors.accent }]
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
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
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '600',
  },
});
