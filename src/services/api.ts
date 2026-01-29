import { Product, Category, Order } from '../types';
import { APP_CONFIG } from '../constants';

/**
 * API Service for supplement.ge
 * This is a placeholder for future API integration
 */

const BASE_URL = APP_CONFIG.api.baseUrl;

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============ PRODUCTS API ============

export const ProductsApi = {
  /**
   * Get all products
   */
  getAll: async (): Promise<Product[]> => {
    return fetchApi<Product[]>('/products');
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<Product> => {
    return fetchApi<Product>(`/products/${id}`);
  },

  /**
   * Get products by category
   */
  getByCategory: async (categoryId: string): Promise<Product[]> => {
    return fetchApi<Product[]>(`/products?category=${categoryId}`);
  },

  /**
   * Search products
   */
  search: async (query: string): Promise<Product[]> => {
    return fetchApi<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  },
};

// ============ CATEGORIES API ============

export const CategoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    return fetchApi<Category[]>('/categories');
  },
};

// ============ ORDERS API ============

export const OrdersApi = {
  /**
   * Create a new order
   */
  create: async (orderData: Partial<Order>): Promise<Order> => {
    return fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Get order by ID
   */
  getById: async (id: string): Promise<Order> => {
    return fetchApi<Order>(`/orders/${id}`);
  },

  /**
   * Get user's orders
   */
  getUserOrders: async (): Promise<Order[]> => {
    return fetchApi<Order[]>('/orders/my-orders');
  },
};

// ============ AUTH API ============

export const AuthApi = {
  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<{ token: string }> => {
    return fetchApi<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register user
   */
  register: async (data: { 
    email: string; 
    password: string; 
    name: string 
  }): Promise<{ token: string }> => {
    return fetchApi<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return fetchApi<void>('/auth/logout', {
      method: 'POST',
    });
  },
};
