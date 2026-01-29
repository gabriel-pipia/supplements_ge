import React, { useRef, ReactNode, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context';

// Breakpoint for switching between mobile and desktop layouts
const MOBILE_BREAKPOINT = 768;

export interface BottomSheetModalRef {
  close: () => void;
}

interface BottomSheetModalProps {
  children: ReactNode;
  onClose: () => void;
  height?: `${number}%` | number | 'auto';
  showDragHandle?: boolean;
  dismissOnBackdrop?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  containerStyle?: ViewStyle;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
}

export const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(({
  children,
  onClose,
  height = 'auto',
  showDragHandle = false,
  dismissOnBackdrop = true,
  safeAreaEdges = ['bottom'],
  containerStyle,
  keyboardAvoiding = true,
  keyboardVerticalOffset = 0,
}, ref) => {
  const { colors } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current; // For mobile slide-up
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // For desktop scale
  
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const isMobileLayout = windowDimensions.width < MOBILE_BREAKPOINT;

  // Listen for window resize
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Animate in on mount
  useEffect(() => {
    if (isMobileLayout) {
      // Mobile: slide up from bottom
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Desktop: fade in with scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isMobileLayout]);

  const handleClose = () => {
    if (isMobileLayout) {
      // Mobile: slide down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    } else {
      // Desktop: fade out with scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }
  };

  useImperativeHandle(ref, () => ({
    close: handleClose
  }));

  const content = (
    <SafeAreaView edges={safeAreaEdges} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  );

  // Calculate modal width for mobile (full width) vs desktop (centered with max width)
  const modalWidth = isMobileLayout ? '100%' : Math.min(550, windowDimensions.width - 32);
  
  // Calculate height based on layout
  const modalHeight = isMobileLayout 
    ? (height === 'auto' ? '90%' : height)
    : (height === '100%' ? '90%' : height);

  return (
    <View style={[
      styles.modalOverlay,
      isMobileLayout ? styles.mobileOverlay : styles.desktopOverlay
    ]}>
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          { backgroundColor: 'rgba(0,0,0,0.5)', opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={dismissOnBackdrop ? handleClose : undefined}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          isMobileLayout ? styles.mobileContainer : styles.desktopContainer,
          {
            backgroundColor: colors.background,
            opacity: fadeAnim,
            width: modalWidth,
            height: modalHeight,
            maxHeight: isMobileLayout ? '95%' : '90%',
            transform: isMobileLayout 
              ? [{ translateY: slideAnim }]
              : [{ scale: scaleAnim }],
          },
          containerStyle,
        ]}
      >
        <StatusBar barStyle={colors.statusBar} />

        {/* Show drag handle on mobile */}
        {(showDragHandle || isMobileLayout) && (
          <View style={styles.dragHandleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: colors.gray200 }]} />
          </View>
        )}

        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            behavior={undefined}
            style={styles.keyboardAvoid}
            keyboardVerticalOffset={0}
          >
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    ...({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    } as any),
  },
  mobileOverlay: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  desktopOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
    ...({
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    } as any),
  },
  mobileContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  desktopContainer: {
    borderRadius: 24,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
});
