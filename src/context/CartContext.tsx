import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon } from '../types/store';

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  savings: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  shippingThreshold: number;
  shippingMethod: 'standard' | 'express';
  setShippingMethod: (method: 'standard' | 'express') => void;
  // Core required methods from problem statement
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  calculateTotal: () => CartTotals;
  clearCart: () => void;
  // Additional helpful store utilities
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  totalItemsCount: number;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'SAVE10', discountPercent: 10, description: '10% off entire order' },
  { code: 'AURA20', discountPercent: 20, minSpend: 100, description: '20% off orders over $100' },
  { code: 'FREESHIP', discountPercent: 0, freeShipping: true, description: 'Complimentary shipping' },
];

const TAX_RATE = 0.085; // 8.5% Sales Tax
const FREE_SHIPPING_THRESHOLD = 75.0; // Free standard shipping above $75
const STANDARD_SHIPPING_FEE = 9.99;
const EXPRESS_SHIPPING_FEE = 18.99;

const CART_STORAGE_KEY = 'aura_store_cart_v1';
const WISHLIST_STORAGE_KEY = 'aura_store_wishlist_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not persist wishlist to localStorage', e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const dismissToast = () => {
    setToastMessage(null);
  };

  // addToCart(product, quantity)
  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevCart];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty
        };
        showToast(`Updated "${product.title.slice(0, 24)}..." quantity to ${newQty}`);
        return next;
      } else {
        showToast(`Added "${product.title.slice(0, 24)}..." to cart`);
        return [...prevCart, { product, quantity }];
      }
    });
  };

  // removeFromCart(productId)
  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const target = prevCart.find(item => item.product.id === productId);
      if (target) {
        showToast(`Removed "${target.product.title.slice(0, 24)}..." from cart`);
      }
      return prevCart.filter(item => item.product.id !== productId);
    });
  };

  // updateQuantity(productId, quantity)
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(99, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // calculateTotal()
  const calculateTotal = (): CartTotals => {
    const rawSubtotal = cart.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    const subtotal = Math.round(rawSubtotal * 100) / 100;

    let discount = 0;
    let isFreeShippingCoupon = false;

    if (appliedCoupon) {
      if (appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) {
        // min spend not met
      } else {
        if (appliedCoupon.discountPercent > 0) {
          discount = Math.round((subtotal * (appliedCoupon.discountPercent / 100)) * 100) / 100;
        }
        if (appliedCoupon.freeShipping) {
          isFreeShippingCoupon = true;
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round((discountedSubtotal * TAX_RATE) * 100) / 100;

    let shipping = 0;
    if (cart.length > 0) {
      if (shippingMethod === 'express') {
        shipping = isFreeShippingCoupon ? 9.00 : EXPRESS_SHIPPING_FEE;
      } else {
        if (isFreeShippingCoupon || subtotal >= FREE_SHIPPING_THRESHOLD) {
          shipping = 0.00;
        } else {
          shipping = STANDARD_SHIPPING_FEE;
        }
      }
    }

    const total = Math.round((discountedSubtotal + tax + shipping) * 100) / 100;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total,
      savings: discount + (cart.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD && shippingMethod === 'standard' ? STANDARD_SHIPPING_FEE : 0)
    };
  };

  // applyCoupon(code)
  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === code);

    if (!coupon) {
      return { success: false, message: `Coupon "${code}" is invalid. Try SAVE10 or FREESHIP.` };
    }

    const totals = calculateTotal();
    if (coupon.minSpend && totals.subtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Coupon "${code}" requires a minimum subtotal of $${coupon.minSpend.toFixed(2)}.`
      };
    }

    setAppliedCoupon(coupon);
    showToast(`Coupon "${code}" applied: ${coupon.description}!`);
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon code removed');
  };

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed from saved items`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Saved to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        shippingThreshold: FREE_SHIPPING_THRESHOLD,
        shippingMethod,
        setShippingMethod,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        totalItemsCount,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
