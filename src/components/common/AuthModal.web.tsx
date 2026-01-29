import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  Modal,
  Animated,
  // @ts-ignore
  LayoutAnimation,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, useToast } from '../../context';
import { BottomSheetModal } from './BottomSheetModal';
import { Input } from './Input';
import { Button } from './Button';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

// --- Icons ---
const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconMail = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="m22 6-10 7L2 6" />
  </Svg>
);

const IconLockReal = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
     <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
     <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconUser = ({ size = 20, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const IconGoogle = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

// --- Component ---

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { colors, t, isDark, loginUser } = useApp();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Web Optimized transition
  const changeMode = (newMode: AuthMode) => {
    // Faster transition for web
    Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: false }).start(() => {
        setMode(newMode);
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    });
  };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const getTitle = () => {
    switch(mode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch(mode) {
      case 'signin': return 'Sign in to access your account';
      case 'signup': return 'Sign up to get started';
      case 'forgot': return 'Enter your email to receive a reset link';
    }
  };

  const handleAction = () => {
    if (!email || (mode !== 'forgot' && !password)) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signin') {
        loginUser({ name: 'Demo User', email: email });
        showToast('Welcome back!', 'success');
      } else if (mode === 'signup') {
         loginUser({ name: name || 'New User', email: email });
        showToast('Account created successfully!', 'success');
      } else {
        showToast('Reset link sent to your email', 'success');
      }
      onClose();
    }, 1500);
  };

  const handleGoogle = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser({
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIq8d1-wN-j-7_w-w',
      });
      showToast('Successfully signed in with Google', 'success');
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal 
        onClose={onClose} 
        height='auto' 
        showDragHandle={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
          <TouchableOpacity 
             style={[styles.closeButton, { backgroundColor: colors.gray100 }]} 
             onPress={onClose}
             // @ts-ignore
             onMouseEnter={(e: any) => e.target.style.opacity = '0.7'}
             onMouseLeave={(e: any) => e.target.style.opacity = '1'}
          >
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={[styles.content]}>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>{getSubtitle()}</Text>

            {mode === 'signup' && (
              <Input
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                leftIcon={<IconUser size={20} />}
                containerStyle={{ marginBottom: 16 }}
              />
            )}

            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<IconMail size={20} />}
              containerStyle={{ marginBottom: 16 }}
            />

            {mode !== 'forgot' && (
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<IconLockReal size={20} />}
                containerStyle={{ marginBottom: 16 }}
              />
            )}

            {mode === 'signin' && (
              <TouchableOpacity 
                style={styles.forgotButton}
                onPress={() => changeMode('forgot')}
              >
                <Text style={[styles.forgotText, { color: colors.accent }]}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <Button
              title={mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Link'}
              onPress={handleAction}
              loading={isLoading}
              variant="primary"
              block
              style={{ marginBottom: 24 }}
            />

            {mode !== 'forgot' && (
              <>
                <View style={styles.dividerContainer}>
                  <View style={[styles.divider, { backgroundColor: colors.gray200 }]} />
                  <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
                  <View style={[styles.divider, { backgroundColor: colors.gray200 }]} />
                </View>

                <Button
                  title="Join with Google"
                  onPress={handleGoogle}
                  loading={isLoading}
                  variant="secondary"
                  block
                  leftIcon={<IconGoogle size={20} />}
                  style={{ marginBottom: 24 }}
                />
              </>
            )}

            <View style={styles.footer}>
              {mode === 'signin' ? (
                <Text style={[styles.footerText, { color: colors.textMuted }]}>
                  Don't have an account?{' '}
                  <Text style={[styles.footerLink, { color: colors.accent, cursor: 'pointer' } as any]} onPress={() => changeMode('signup')}>Sign Up</Text>
                </Text>
              ) : mode === 'signup' ? (
                <Text style={[styles.footerText, { color: colors.textMuted }]}>
                  Already have an account?{' '}
                  <Text style={[styles.footerLink, { color: colors.accent, cursor: 'pointer' } as any]} onPress={() => changeMode('signin')}>Sign In</Text>
                </Text>
              ) : (
                <Text style={[styles.footerLink, { color: colors.accent, cursor: 'pointer' } as any]} onPress={() => changeMode('signin')}>
                  Back to Sign In
                </Text>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as any,
  content: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    cursor: 'pointer',
  } as any,
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: '700',
  },
});
