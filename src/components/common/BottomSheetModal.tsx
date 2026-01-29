import React, { useRef, ReactNode, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context';
import { ToastOverlay } from '../../context/ToastContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  height = '100%',
  showDragHandle = true,
  dismissOnBackdrop = true,
  safeAreaEdges = ['bottom'],
  containerStyle,
  keyboardAvoiding = true,
  keyboardVerticalOffset = 100,
}, ref) => {
  const { colors } = useApp();
  // Start off-screen at the bottom
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Animate in on mount
  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  useImperativeHandle(ref, () => ({
    close: handleClose
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.8) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            tension: 65,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const content = (
    <SafeAreaView edges={safeAreaEdges} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  );

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={dismissOnBackdrop ? handleClose : undefined}
      />
      <Animated.View
        style={[
          styles.modalContainer,
          {
            height,
            backgroundColor: colors.background,
            transform: [{ translateY }],
          },
          containerStyle,
        ]}
      >
        <StatusBar barStyle={colors.statusBar} />

        {showDragHandle && (
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragHandle, { backgroundColor: colors.gray200 }]} />
          </View>
        )}

        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
            keyboardVerticalOffset={keyboardVerticalOffset}
          >
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </Animated.View>
      <ToastOverlay />
    </View>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
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
