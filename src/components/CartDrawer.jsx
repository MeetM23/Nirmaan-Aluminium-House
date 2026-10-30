// src/components/CartDrawer.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/pricing';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, itemCount, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer content */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#0A1F1A] border-l border-[#C9A15A]/25 text-[#EFEBDD] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#C9A15A]/20 flex items-center justify-between bg-[#061411]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C9A15A]/15 border border-[#C9A15A]/30 flex items-center justify-center text-[#C9A15A]">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#EFEBDD] tracking-wide">
                    Your Cart
                  </h3>
                  <p className="text-xs text-white/50">{itemCount} items selected</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-white/60 hover:text-[#C9A15A] hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4">
                    <ShoppingBag size={36} />
                  </div>
                  <h4 className="font-serif text-xl font-medium text-white/80 mb-2">
                    Your cart is empty
                  </h4>
                  <p className="text-sm text-white/50 max-w-xs mb-6">
                    Discover our luxury architectural aluminium and stainless steel fabrication works.
                  </p>
                  <button
                    onClick={() => {
                      closeCart();
                      navigate('/products');
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] font-semibold text-sm hover:brightness-110 transition shadow-lg"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const key = item.variantKey || item.id;
                  return (
                    <motion.div
                      layout
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-3.5 rounded-xl bg-[#061411]/80 border border-white/10 hover:border-[#C9A15A]/30 transition group"
                    >
                      <img
                        src={item.image || '/images/products/ss-railing.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-sm font-semibold text-white/95 truncate">
                              {item.name}
                            </h5>
                            <button
                              onClick={() => removeFromCart(key)}
                              className="text-white/40 hover:text-red-400 transition shrink-0 p-1"
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-xs text-[#C9A15A]/90 mt-0.5 truncate">
                            {item.variant || `${item.finish || 'Standard'} • ${item.material || 'Standard'}`}
                          </p>
                          <p className="text-xs text-white/50 mt-0.5">
                            {formatINR(item.unitPrice)} / {item.unit?.replace('per ', '') || 'unit'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2 border border-white/15 rounded-lg bg-black/40 px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(key, (item.quantity || 1) - 1)}
                              className="text-white/60 hover:text-[#C9A15A] transition"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-semibold px-1 text-white min-w-[1.2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(key, (item.quantity || 1) + 1)}
                              className="text-white/60 hover:text-[#C9A15A] transition"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-[#E2C285]">
                            {formatINR((item.unitPrice || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#C9A15A]/20 bg-[#061411] space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Estimated Subtotal</span>
                  <span className="font-bold text-lg text-[#E2C285]">{formatINR(subtotal)}</span>
                </div>
                <p className="text-[11px] text-white/40">
                  Taxes & transport calculated at checkout. Site measurement may adjust final quote.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleViewCart}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#C9A15A]/40 text-[#C9A15A] hover:bg-[#C9A15A]/10 font-medium text-xs tracking-wide uppercase transition text-center"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] font-semibold text-xs tracking-wide uppercase hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#C9A15A]/20"
                  >
                    <span>Checkout</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
