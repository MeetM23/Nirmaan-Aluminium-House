// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import profileService from '../services/profileService';
import { calculatePricing } from '../utils/pricing';
import { businessConfig } from '../config/business';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null); // { code, discountPercent }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart and wishlist on initial mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const loadedItems = await cartService.getCart();
        setItems(loadedItems);
        const loadedWishlist = await profileService.getWishlist();
        setWishlist(loadedWishlist);
      } catch (err) {
        console.error('Failed to load cart/wishlist:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Trigger bump animation whenever items change
  const triggerBump = () => {
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
  };

  const addToCart = async (productItem) => {
    try {
      const updated = await cartService.addToCart(productItem);
      setItems(updated);
      triggerBump();
      toast.success(`Added ${productItem.name} to cart!`, {
        icon: '🛒',
        style: {
          background: '#0D2922',
          color: '#EFEBDD',
          border: '1px solid #C9A15A',
        },
      });
      return updated;
    } catch (err) {
      toast.error('Failed to add to cart.');
      throw err;
    }
  };

  const updateQuantity = async (variantKeyOrId, quantity) => {
    try {
      const updated = await cartService.updateQuantity(variantKeyOrId, quantity);
      setItems(updated);
      triggerBump();
      return updated;
    } catch (err) {
      toast.error('Failed to update quantity.');
      throw err;
    }
  };

  const removeFromCart = async (variantKeyOrId) => {
    try {
      const updated = await cartService.removeFromCart(variantKeyOrId);
      setItems(updated);
      toast('Item removed from cart', { icon: '🗑️' });
      return updated;
    } catch (err) {
      toast.error('Failed to remove item.');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setItems([]);
      setCoupon(null);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    const foundCoupon = businessConfig.coupons[cleanCode];

    if (!foundCoupon) {
      toast.error('Invalid coupon code. Try NIRMAAN10 or WELCOME5');
      return false;
    }

    setCoupon(foundCoupon);
    toast.success(`Coupon applied! ${foundCoupon.discountPercent}% discount`);
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast('Coupon removed', { icon: '🏷️' });
  };

  const toggleWishlist = async (productId) => {
    try {
      const updated = await profileService.toggleWishlist(productId);
      setWishlist(updated);
      const isNowIn = updated.includes(productId);
      toast(isNowIn ? 'Added to wishlist' : 'Removed from wishlist', {
        icon: isNowIn ? '❤️' : '🤍',
      });
      return updated;
    } catch (err) {
      toast.error('Failed to update wishlist');
      throw err;
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Derive counts and pricing
  const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const pricing = calculatePricing({
    items,
    discountPercent: coupon?.discountPercent || 0,
    state: 'Gujarat', // default pricing state
  });

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal: pricing.subtotal,
        pricing,
        coupon,
        applyCoupon,
        removeCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        cartBump,
        wishlist,
        toggleWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
