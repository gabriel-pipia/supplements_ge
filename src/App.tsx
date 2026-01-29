import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, LogBox } from 'react-native';
import { useCart, useFavorites } from './hooks';
import { AppNavigator } from './navigation';
import { AppProvider, ToastProvider, ModalProvider } from './context';
import { LanguageModal } from './components';
import { SplashScreen } from './screens';

// Ignore SafeAreaView deprecation warning from third-party libraries
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

/**
 * Main App Component
 * supplement.ge - Premium Supplements E-commerce App
 * 
 * Features:
 * - Swipeable tabs using react-native-pager-view
 * - 4 main tabs: Home, Search, Cart, Profile
 * - Animated header on scroll
 * - Dark mode support
 * - Multi-language support (Georgian/English)
 * - Custom animated splash screen
 */
const App: React.FC = () => {
  const cart = useCart();
  const favorites = useFavorites();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ModalProvider cart={cart} favorites={favorites}>
      <AppNavigator cart={cart} favorites={favorites} />
      <LanguageModal />
    </ModalProvider>
  );
};

const AppWithProviders: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppWithProviders;
