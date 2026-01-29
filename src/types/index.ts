// ============ TYPE DEFINITIONS ============

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  description?: string;
  inStock?: boolean;
  type?: string; // e.g., 'Protein', 'Vitamins', 'Creatine', etc.
  goals?: string[]; // e.g., ['Muscle Gain', 'Recovery']
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  iconType: CategoryIconType;
}

export type CategoryIconType = 'sparkles' | 'dumbbell' | 'zap' | 'pill' | 'leaf';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress?: Address;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Work"
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  label?: string;
  brand?: string; // e.g., "Visa", "Mastercard"
  expiryDate?: string;
  isDefault?: boolean;
}

export interface NotificationSetting {
  id: string;
  type: 'promotions' | 'orders' | 'security' | 'news';
  label: string;
  description: string;
  enabled: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Updated TabId for 4 tabs only
export type TabId = 'home' | 'search' | 'cart' | 'profile';

export interface TabItem {
  id: TabId;
  label: string;
  onPress?: () => void;
  showBadge?: boolean;
}
