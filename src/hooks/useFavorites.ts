import { useState, useCallback } from 'react';
import { useToast, useApp } from '../context';

interface UseFavoritesReturn {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const { showToast } = useToast();
  const { t } = useApp();

  const addFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) return prev;
      showToast(t('addedToFavorites') || 'Added to favorites', 'success');
      return [...prev, productId];
    });
  }, [showToast, t]);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== productId);
      if (newFavorites.length !== prev.length) {
          showToast(t('removedFromFavorites') || 'Removed from favorites', 'info');
      }
      return newFavorites;
    });
  }, [showToast, t]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        showToast(t('removedFromFavorites') || 'Removed from favorites', 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast(t('addedToFavorites') || 'Added to favorites', 'success');
      return [...prev, productId];
    });
  }, [showToast, t]);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};
