import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ThemeColors, ThemeMode } from '../constants/theme';
import { translations, Language, TranslationKey } from '../constants/translations';
import { Address, PaymentMethod, NotificationSetting, Order } from '../types';

// ============ APP CONTEXT TYPES ============

interface AppContextType {
  // Theme
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  
  // Modals
  isLanguageModalVisible: boolean;
  showLanguageModal: () => void;
  hideLanguageModal: () => void;

  // User Profile
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;

  // Navigation
  activeTab: number;
  setActiveTab: (index: number) => void;

  // Product Modal State (for hiding FAB)
  isProductModalOpen: boolean;
  setProductModalOpen: (open: boolean) => void;

  // Auth
  isGuest: boolean;
  loginUser: (profile: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  notifications: NotificationSetting[];
  orders: Order[];
  height?: number; // in cm
  weight?: number; // in kg
  age?: number;
  goals?: string[]; // e.g. ['Muscle Gain', 'Weight Loss']
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@supplement_theme';
const LANGUAGE_STORAGE_KEY = '@supplement_language';

// ============ APP PROVIDER ============

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(deviceColorScheme === 'dark' ? 'dark' : 'light');
  const [hasUserSetTheme, setHasUserSetTheme] = useState(false);
  const [language, setLanguageState] = useState<Language>('ka');
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: 'User',
    email: 'user@supplement.ge',
    phone: '+995 5xx xxx xxx',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        street: 'Chavchavadze Ave 24',
        city: 'Tbilisi',
        postalCode: '0179',
        country: 'Georgia',
        isDefault: true
      },
      {
        id: 'addr-2',
        label: 'Work',
        street: 'Rustaveli Ave 10',
        city: 'Tbilisi',
        postalCode: '0100',
        country: 'Georgia',
        isDefault: false
      }
    ],
    paymentMethods: [
       {
        id: 'pm-1',
        type: 'card',
        last4: '4242',
        label: 'Visa *4242',
        isDefault: true
      }
    ],
    notifications: [
      { id: '1', type: 'promotions', label: 'Promotions', description: 'Receive offers and discounts', enabled: true },
      { id: '2', type: 'orders', label: 'Order Status', description: 'Get updates about your orders', enabled: true },
      { id: '3', type: 'security', label: 'Security', description: 'Security alerts and login notifications', enabled: true },
    ],
    orders: [
      {
        id: '#ORD-7782-901',
        createdAt: 'Jan 15, 2024',
        status: 'delivered',
        total: 245.50,
        items: [
          { 
            id: '1', 
            name: 'Gold Standard Whey', 
            nameEn: 'Gold Standard Whey',
            brand: 'Optimum Nutrition',
            price: 245.50,
            quantity: 1, 
            image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'protein',
            rating: 4.8,
            reviews: 120
          }
        ],
        shippingAddress: {
          id: '1',
          label: 'Home',
          street: 'Chavchavadze Ave 1',
          city: 'Tbilisi',
          postalCode: '0179',
          country: 'Georgia',
          isDefault: true
        }
      },
      {
        id: '#ORD-9921-231',
        createdAt: 'Jan 02, 2024',
        status: 'processing',
        total: 120.00,
        items: [
           { 
            id: '2', 
            name: 'Creatine Monohydrate', 
            nameEn: 'Creatine Monohydrate',
            brand: 'MuscleTech',
            price: 120.00,
            quantity: 1, 
            image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'creatine',
            rating: 4.9,
            reviews: 85
          }
        ]
      }
    ],

    goals: ['Muscle Gain', 'Endurance'],
  });
  const [isGuest, setIsGuest] = useState(true); // Default to guest

  const guestUser: UserProfile = {
    name: 'Guest User',
    email: 'guest@supplement.ge',
    phone: '',
    addresses: [],
    paymentMethods: [],
    notifications: [],
    orders: [],
    height: undefined,
    weight: undefined,
    age: undefined,
    goals: [],
  };

  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        const savedUser = await AsyncStorage.getItem('@supplement_user');
        
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeState(savedTheme);
          setHasUserSetTheme(true);
        } else {
          // No saved preference, use device color scheme
          setThemeState(deviceColorScheme === 'dark' ? 'dark' : 'light');
        }
        if (savedLanguage === 'en' || savedLanguage === 'ka') {
          setLanguageState(savedLanguage);
        }
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setIsGuest(false);
          // Ensure new fields exist if loading from old storage
          setUser(prev => ({
            ...prev,
            ...parsedUser,
            orders: parsedUser.orders || prev.orders,
            addresses: parsedUser.addresses || prev.addresses,
            paymentMethods: parsedUser.paymentMethods || prev.paymentMethods,
            notifications: parsedUser.notifications || prev.notifications,
            height: parsedUser.height || prev.height,
            weight: parsedUser.weight || prev.weight,
            age: parsedUser.age || prev.age,
            goals: parsedUser.goals || prev.goals,
          }));
        } else {
             setIsGuest(true);
             setUser(guestUser);
        }
      } catch (error) {
        console.log('Error loading preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Theme functions
  const colors = theme === 'dark' ? darkColors : lightColors;
  const isDark = theme === 'dark';

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setHasUserSetTheme(true);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  }, [theme]);

  const setTheme = useCallback(async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setHasUserSetTheme(true);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  }, []);

  // Listen for device color scheme changes (only if user hasn't set preference)
  useEffect(() => {
    if (!hasUserSetTheme && deviceColorScheme) {
      setThemeState(deviceColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [deviceColorScheme, hasUserSetTheme]);

  // Language functions
  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    setLanguageModalVisible(false);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key;
  }, [language]);

  // Modal functions
  const showLanguageModal = useCallback(() => {
    setLanguageModalVisible(true);
  }, []);

  const hideLanguageModal = useCallback(() => {
    setLanguageModalVisible(false);
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const newProfile = { ...prev, ...updates };
      AsyncStorage.setItem('@supplement_user', JSON.stringify(newProfile)).catch(err => 
        console.log('Error saving user:', err)
      );
      return newProfile;
    });
  }, []);

  const loginAsGuest = useCallback(() => {
        setIsGuest(true);
        setUser(guestUser);
        AsyncStorage.removeItem('@supplement_user');
  }, []);

  const loginUser = useCallback((profile: Partial<UserProfile>) => {
    setIsGuest(false);
    updateUser(profile);
  }, [updateUser]);

  const logout = useCallback(() => {
      loginAsGuest();
  }, [loginAsGuest]);

  const value: AppContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
    isDark,
    language,
    setLanguage,
    t,
    isLanguageModalVisible,
    showLanguageModal,
    hideLanguageModal,
    user,
    updateUser,
    activeTab,
    setActiveTab,
    isProductModalOpen,
    setProductModalOpen,
    isGuest,
    loginAsGuest,
    loginUser,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ============ HOOK ============

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
