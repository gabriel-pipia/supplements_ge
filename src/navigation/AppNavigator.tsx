import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useCart, useFavorites, useResponsive } from '../hooks';
import { useApp } from '../context';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Import navigation components
import { TabBar } from './TabBar';
import { SidebarNav } from './SidebarNav';
import { AIChatModal, IconChat } from '../components';

export type TabId = 'home' | 'search' | 'cart' | 'profile';
const TABS: TabId[] = ['home', 'search', 'cart', 'profile'];

interface AppNavigatorProps {
  cart: ReturnType<typeof useCart>;
  favorites: ReturnType<typeof useFavorites>;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ cart, favorites }) => {
  const { colors, activeTab: currentTab, setActiveTab: setCurrentTab, isProductModalOpen } = useApp();
  const { isDesktop, showSidebar, width: responsiveWidth } = useResponsive();
  // const [currentTab, setCurrentTab] = useState(0); // Removed local state
  const [chatVisible, setChatVisible] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const currentTabRef = useRef(currentTab);
  const translateX = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };


  


  // Keep ref in sync
  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  const animateToTab = (index: number) => {
    if (showSidebar) {
      translateX.setValue(-index * responsiveWidth);
    } else {
      Animated.spring(translateX, {
        toValue: -index * responsiveWidth,
        friction: 20,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    animateToTab(currentTab);
  }, [currentTab, showSidebar, responsiveWidth]);

  const handleTabPress = (index: number) => {
    setCurrentTab(index);
  };

  const handleFABPress = () => {
    Animated.sequence([
      Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true, friction: 3 }),
      Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    setChatVisible(true);
  };



  if (showSidebar) {
    return (
      <View style={[styles.container, styles.desktopContainer, { backgroundColor: colors.background }]}>
        <SidebarNav
          currentTab={currentTab}
          onTabPress={handleTabPress}
          cartCount={cart.totalItems}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <View style={styles.desktopContent}>
          {currentTab === 0 && <HomeScreen cart={cart} favorites={favorites} />}
          {currentTab === 1 && <SearchScreen cart={cart} favorites={favorites} />}
          {currentTab === 2 && <CartScreen cart={cart} />}
          {currentTab === 3 && (
            <ProfileScreen 
              cartCount={cart.totalItems} 
              favoritesCount={favorites.favorites.length} 
            />
          )}
        </View>
        {!isProductModalOpen && (
          <Animated.View style={[styles.fabContainer, styles.fabDesktop, { transform: [{ scale: fabScale }] }]}>
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]} onPress={handleFABPress}>
              <IconChat size={28} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>
        )}
        <AIChatModal visible={chatVisible} onClose={() => setChatVisible(false)} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.pagesContainer}>
        <Animated.View 
          style={[
            styles.pagesRow,
            { 
              width: responsiveWidth * TABS.length,
              transform: [{ translateX }] 
            }
          ]}
        >
          <View style={[styles.page, { width: responsiveWidth }]}>
            <HomeScreen cart={cart} favorites={favorites} />
          </View>
          <View style={[styles.page, { width: responsiveWidth }]}>
            <SearchScreen cart={cart} favorites={favorites} />
          </View>
          <View style={[styles.page, { width: responsiveWidth }]}>
            <CartScreen cart={cart} />
          </View>
          <View style={[styles.page, { width: responsiveWidth }]}>
            <ProfileScreen 
              cartCount={cart.totalItems} 
              favoritesCount={favorites.favorites.length} 
            />
          </View>
        </Animated.View>
      </View>
      {!isProductModalOpen && (
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]} onPress={handleFABPress}>
            <IconChat size={28} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}
      <TabBar currentTab={currentTab} onTabPress={handleTabPress} cartCount={cart.totalItems} />
      <AIChatModal visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  desktopContainer: { flexDirection: 'row' },
  desktopContent: { flex: 1 },
  pagesContainer: { flex: 1, overflow: 'hidden' },
  pagesRow: { flexDirection: 'row', flex: 1 },
  page: { flex: 1 },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 90,
    zIndex: 100,
  },
  fabDesktop: { bottom: 32, right: 32 },
  fab: {
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
