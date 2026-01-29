import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CART: '@supplements_cart',
  USER: '@supplements_user',
  FAVORITES: '@supplements_favorites',
  SETTINGS: '@supplements_settings',
} as const;

/**
 * Storage Service for persistent data
 */
export const StorageService = {
  /**
   * Save data to storage
   */
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * Get data from storage
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * Remove data from storage
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * Clear all storage
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },

  // ============ SPECIFIC METHODS ============

  /**
   * Save cart items
   */
  saveCart: async (cart: unknown): Promise<void> => {
    await StorageService.set(STORAGE_KEYS.CART, cart);
  },

  /**
   * Get cart items
   */
  getCart: async (): Promise<unknown> => {
    return StorageService.get(STORAGE_KEYS.CART);
  },

  /**
   * Save favorites
   */
  saveFavorites: async (favorites: string[]): Promise<void> => {
    await StorageService.set(STORAGE_KEYS.FAVORITES, favorites);
  },

  /**
   * Get favorites
   */
  getFavorites: async (): Promise<string[] | null> => {
    return StorageService.get<string[]>(STORAGE_KEYS.FAVORITES);
  },
};
