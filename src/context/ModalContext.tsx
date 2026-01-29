import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { Modal } from 'react-native';
import { Product } from '../types';
import { TrainingProgram } from '../data/training';
import { 
  ProductDetailModal, 
  TrainingProgramModal, 
  TrainingProgramsListModal,
  FavoritesListModal,
  AddressesModal,
  PaymentMethodsModal,
  NotificationsModal,
  HelpModal,
  OrdersModal,
  AuthModal,
  OrderDetailModal,
  OrderDetails,
  CheckoutModal,
} from '../components/common';

// Define Modal Types and their Props
type ModalType = 
  | 'PRODUCT_DETAIL' 
  | 'TRAINING_PROGRAM_DETAIL' 
  | 'TRAINING_PROGRAMS_LIST'
  | 'FAVORITES_LIST'
  | 'ADDRESSES'
  | 'PAYMENT_METHODS'
  | 'NOTIFICATIONS'
  | 'HELP'
  | 'ORDERS'
  | 'AUTH'
  | 'ORDER_DETAIL'
  | 'CHECKOUT';

interface ModalState {
  type: ModalType | null;
  props: any;
}

interface ModalContextType {
  openModal: <T extends ModalType>(type: T, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode; favorites?: any; cart?: any }> = ({ children, favorites, cart }) => {
  const [activeModal, setActiveModal] = useState<ModalState>({ type: null, props: {} });
  const modalOrder = useRef<OrderDetails | null>(null);

  const openModal = useCallback(<T extends ModalType>(type: T, props: any = {}) => {
    if (type === 'ORDER_DETAIL') {
      modalOrder.current = props.order;
    }
    setActiveModal({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal({ type: null, props: {} });
    // Keep order data briefly for exit animation
    setTimeout(() => {
      modalOrder.current = null;
    }, 500);
  }, []);

  // Use props passed to ModalProvider (likely from AppNavigator/App) or rely on hooks if they are available globally
  // Since we are likely inside AppProvider, we might not need to pass favorites/cart if the modals handle their own data fetching or if we pass callbacks.
  // However, ProductDetailModal currently expects onAddToCart, isFavorite, etc.
  // We can wrap the modals to inject these dependencies if they are available via hooks, 
  // OR we can expect the caller of openModal to pass the necessary callbacks (which is flexible but verbose),
  // OR we can use hooks inside the wrapper here if the ModalProvider is inside the logical providers.

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      
      {/* Global Modals */}
      {/* We render them conditionally but keep them mounted if needed for animation, 
          though the current components expect 'visible' prop to handle animation.
          So we might render all of them but only set one visible.
      */}

      <ProductDetailModal
        visible={activeModal.type === 'PRODUCT_DETAIL'}
        product={activeModal.props.product}
        onClose={closeModal}
        onAddToCart={activeModal.props.onAddToCart || (() => {})} 
        isFavorite={activeModal.props.product && favorites ? favorites.isFavorite(activeModal.props.product.id) : (activeModal.props.isFavorite || false)}
        onToggleFavorite={activeModal.props.onToggleFavorite || (() => {})}
        onProductPress={(product) => openModal('PRODUCT_DETAIL', { 
          ...activeModal.props, 
          product 
        })}
      />

      <TrainingProgramModal
        visible={activeModal.type === 'TRAINING_PROGRAM_DETAIL'}
        program={activeModal.type === 'TRAINING_PROGRAM_DETAIL' ? activeModal.props.program : null}
        onClose={closeModal}
      />

      <TrainingProgramsListModal
        visible={activeModal.type === 'TRAINING_PROGRAMS_LIST'}
        onClose={closeModal}
      />

      <FavoritesListModal
        visible={activeModal.type === 'FAVORITES_LIST'}
        onClose={closeModal}
        favorites={favorites?.favorites || []}
        onToggleFavorite={favorites?.toggleFavorite || (() => {})}
        onProductPress={(product) => openModal('PRODUCT_DETAIL', { 
          product,
          onAddToCart: cart?.addToCart,
          isFavorite: favorites?.isFavorite(product.id),
          onToggleFavorite: () => favorites?.toggleFavorite(product.id)
        })}
        onAddToCart={cart?.addToCart}
      />

      <AddressesModal
        visible={activeModal.type === 'ADDRESSES'}
        onClose={closeModal}
      />

      <PaymentMethodsModal
        visible={activeModal.type === 'PAYMENT_METHODS'}
        onClose={closeModal}
      />

      <NotificationsModal
        visible={activeModal.type === 'NOTIFICATIONS'}
        onClose={closeModal}
      />

      <HelpModal
        visible={activeModal.type === 'HELP'}
        onClose={closeModal}
      />

      <OrdersModal
        visible={activeModal.type === 'ORDERS'}
        onClose={closeModal}
        cart={cart}
      />

      {/* Auth Modal - rendered conditionally or kept mounted if needed, but here simple conditional rendering */}
      {activeModal.type === 'AUTH' && (
        <AuthModal
          visible={activeModal.type === 'AUTH'}
          onClose={closeModal}
        />
      )}

      <OrderDetailModal
        visible={activeModal.type === 'ORDER_DETAIL'}
        order={modalOrder.current}
        onClose={closeModal}
      />

      <CheckoutModal
        visible={activeModal.type === 'CHECKOUT'}
        onClose={closeModal}
        cart={cart}
      />

    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
