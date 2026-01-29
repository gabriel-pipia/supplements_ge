import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  RefreshControl,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { useApp } from '../../context';

interface CustomRefreshControlProps extends ScrollViewProps {
  onRefresh: () => void;
  refreshing: boolean;
  children: React.ReactNode;
  progressViewOffset?: number; // For Android, offset the refresh indicator
}

export const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({
  onRefresh,
  refreshing,
  children,
  style,
  contentContainerStyle,
  onScroll,
  progressViewOffset = 0,
  ...props
}) => {
  const { colors } = useApp();

  // For web, just render a plain ScrollView without refresh control
  if (Platform.OS === 'web') {
    return (
      <Animated.ScrollView
        {...props}
        style={[styles.scrollView, style]}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
      >
        {children}
      </Animated.ScrollView>
    );
  }

  // For native (iOS/Android), use the built-in RefreshControl with Animated.ScrollView
  return (
    <Animated.ScrollView
      {...props}
      style={[styles.scrollView, style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]} // Android
          progressBackgroundColor={colors.surface} // Android
          progressViewOffset={progressViewOffset} // Android: offset from top
        />
      }
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
