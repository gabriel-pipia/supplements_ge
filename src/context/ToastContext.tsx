import React, { createContext, useContext, useState, useRef, useCallback, useEffect, memo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder,
  Platform,
  Dimensions,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useApp } from './AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOAST_DURATION = 3500;
const TOAST_HEIGHT = 72;

// Icons
const IconCheckCircle = ({ size = 22, color = '#22C55E' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

const IconAlertCircle = ({ size = 22, color = '#EF4444' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <SvgCircle cx="12" cy="12" r="10" />
    <Path d="M12 8v4" />
    <Path d="M12 16h.01" />
  </Svg>
);

const IconInfo = ({ size = 22, color = '#3B82F6' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <SvgCircle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);

// Toast type configuration
const TOAST_CONFIG = {
  success: {
    icon: IconCheckCircle,
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.12)',
    label: 'Success',
  },
  error: {
    icon: IconAlertCircle,
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    label: 'Error',
  },
  info: {
    icon: IconInfo,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    label: 'Info',
  },
};

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  showCartToast: (productName: string) => void;
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Individual Toast Item Component
interface ToastItemProps {
  toast: Toast;
  index: number;
  onRemove: (id: number) => void;
  insetTop: number;
  isDark: boolean;
  colors: any;
}

const ToastItem = memo(({ toast, index, onRemove, insetTop, isDark, colors }: ToastItemProps) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const isRemoving = useRef(false);
  
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;
  
  // Calculate position based on index
  const topPosition = insetTop + (index * (TOAST_HEIGHT + 12));

  const remove = useCallback(() => {
    if (isRemoving.current) return;
    isRemoving.current = true;
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onRemove(toast.id));
  }, [onRemove, toast.id, translateY, opacity, scale]);

  // Pan responder for swipe to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => 
        Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        // Allow horizontal swipe or upward swipe
        if (gesture.dy < 0) {
          translateY.setValue(gesture.dy);
        }
        translateX.setValue(gesture.dx);
        // Fade based on horizontal distance
        const fadeAmount = 1 - Math.min(Math.abs(gesture.dx) / 150, 1);
        opacity.setValue(fadeAmount);
      },
      onPanResponderRelease: (_, gesture) => {
        const shouldDismiss = 
          gesture.dy < -40 || 
          gesture.vy < -0.5 ||
          Math.abs(gesture.dx) > 100 ||
          Math.abs(gesture.vx) > 0.5;
          
        if (shouldDismiss) {
          // Dismiss in swipe direction
          const exitX = gesture.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
          const exitY = gesture.dy < -40 ? -100 : 0;
          
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: exitX,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: exitY,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => onRemove(toast.id));
        } else {
          // Spring back
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              friction: 8,
              tension: 100,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              friction: 8,
              tension: 100,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Enter animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 65,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progress, {
      toValue: 1,
      duration: TOAST_DURATION,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();

    // Auto dismiss
    const timer = setTimeout(remove, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          top: topPosition,
          opacity,
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View 
        style={[
          styles.toast,
          {
            backgroundColor: isDark ? 'rgba(28, 28, 32, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }
        ]}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: config.color }]} />
        
        {/* Content */}
        <View style={styles.toastContent}>
          <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
            <Icon color={config.color} />
          </View>
          
          <View style={styles.textWrapper}>
            <Text 
              style={[styles.toastTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
            <Text 
              style={[styles.toastMessage, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {toast.message}
            </Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <Animated.View 
          style={[
            styles.progressBar,
            { 
              backgroundColor: config.color,
              width: progressWidth,
            }
          ]} 
        />
      </View>
    </Animated.View>
  );
});

// Exposed Toast Overlay Component
export const ToastOverlay = () => {
  const { toasts, removeToast } = useToast();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useApp();

  if (toasts.length === 0) return null;

  return (
    <View 
       style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]} 
       pointerEvents="box-none"
    >
       {toasts.map((toast, index) => (
         <ToastItem
           key={toast.id}
           toast={toast}
           index={index}
           onRemove={removeToast}
           insetTop={insets.top + 8}
           isDark={isDark}
           colors={colors}
         />
       ))}
    </View>
  );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { colors, t, isDark } = useApp();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastIdRef.current;
    setToasts(prev => {
      // Limit to 3 visible toasts, remove oldest if exceeded
      const newToasts = prev.length >= 3 ? prev.slice(1) : prev;
      return [...newToasts, { id, message, type }];
    });
  }, []);

  const showCartToast = useCallback((productName: string) => {
    const msg = `${productName} ${t('addedToCart') || 'added to cart'}`;
    showToast(msg, 'success');
  }, [showToast, t]);

  return (
    <ToastContext.Provider value={{ showToast, showCartToast, toasts, removeToast }}>
      {children}
      <ToastOverlay />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 999,
    ...Platform.select({
      web: {
        right: 20,
        top: 20,
        width: 400,
      },
    }),
  },
  toast: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingLeft: 20,
    gap: 14,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    marginRight: 8,
  },
  toastTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.85,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    borderBottomLeftRadius: 16,
  },
});
