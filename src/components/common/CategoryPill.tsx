import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { Category } from '../../types';
import { useApp } from '../../context';
import { getCategoryIcon } from '../icons';

interface CategoryPillProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ category, isActive, onPress }) => {
  const { colors, t } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.05 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.pill, 
          { backgroundColor: colors.surface },
          isActive && [styles.pillActive, { backgroundColor: colors.accent }]
        ]}
        activeOpacity={0.8}
      >
        {getCategoryIcon(category.iconType, isActive ? colors.white : colors.text)}
        <Text style={[
          styles.pillText, 
          { color: colors.text },
          isActive && [styles.pillTextActive, { color: colors.white }]
        ]}>
          {t(category.id as any) || category.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
  },
  pillActive: {},
  pillText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextActive: {},
});
