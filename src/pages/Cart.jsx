// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Check, Info, ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/pricing';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    pricing,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart – Nirmaan Aluminium House</title>
        <meta name="description" content="Review your fabrication items, calculate estimates, and proceed to checkout." />
      </Helmet>

      <div className="pt-28 pb-20 px-6 lg:px-10 min-h-[85vh] bg-[#061411] text-[#EFEBDD]">
        <div className="max-w-[1300px] mx-auto">
          {/* Header */}
          <div className="border-b border-[#C9A15A]/20 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Order Review</p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-white">
                Fabrication Cart
              </h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-white/50 hover:text-red-400 transition flex items-center gap-1.5 self-start md:self-auto"
              >
                <Trash2 size={14} /> Clear all items
              </button>
            )}
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center flex flex-col items-center justify-center bg-[#0A1F1A]/60 border border-[#C9A15A]/15 rounded-2xl p-8"
            >
              <div className="w-24 h-24 rounded-full bg-[#C9A15A]/10 border border-[#C9A15A]/20 flex items-center justify-center text-[#C9A15A] mb-6">
                <ShoppingBag size={44} />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-3">
                Your cart is currently empty
              </h2>
              <p className="text-sm text-white/60 max-w-md mb-8 leading-relaxed">
                Explore our catalog of architectural aluminium railings, balustrades, SS gates, PVD wall cladding, and laser-cut CNC panels.
              </p>
              <Link
                to="/products"
                className="btn-gold flex items-center gap-2 px-8 py-3.5 shadow-lg shadow-[#C9A15A]/20"
              >
                <span>Explore Products</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            /* Cart Grid with Items Table & Summary Card */
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Left 2 Cols: Items list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-[#0A1F1A] border border-white/10 rounded-xl text-xs font-semibold text-white/50 uppercase tracking-wider">
                  <div className="col-span-6">Product &amp; Specification</div>
                  <div className="col-span-2 text-center">Rate</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Line Total</div>
                </div>

                {items.map((item) => {
                  const key = item.variantKey || item.id;
                  const itemLineTotal = (item.unitPrice || 0) * (item.quantity || 1);

                  return (
                    <motion.div
                      layout
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 md:p-5 bg-[#0A1F1A]/80 border border-white/10 rounded-xl hover:border-[#C9A15A]/30 transition group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Product info */}
                        <div className="md:col-span-6 flex gap-4 items-center">
                          <img
                            src={item.image || '/images/products/ss-railing.jpg'}
                            alt={item.name}
                            className="w-18 h-18 md:w-20 md:h-20 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/products/${item.slug}`}
                              className="font-serif text-base font-semibold text-white hover:text-[#C9A15A] transition line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-[#C9A15A] mt-0.5">
                              {item.variant || `${item.finish || 'Standard'} • ${item.material || 'Standard'}`}
                            </p>
                            <p className="text-[11px] text-white/40 mt-1">
                              Unit: {item.unit || 'per sq ft'}
                            </p>
                          </div>
                        </div>

                        {/* Rate */}
                        <div className="md:col-span-2 text-left md:text-center">
                          <span className="md:hidden text-xs text-white/40 mr-2">Rate:</span>
                          <span className="text-sm font-medium text-white/80">
                            {formatINR(item.unitPrice)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                          <div className="flex items-center border border-white/20 rounded-lg bg-black/40 px-2 py-1">
                            <button
                              onClick={() => updateQuantity(key, (item.quantity || 1) - 1)}
                              className="text-white/60 hover:text-[#C9A15A] p-0.5 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-semibold px-2.5 text-white min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(key, (item.quantity || 1) + 1)}
                              className="text-white/60 hover:text-[#C9A15A] p-0.5 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Line Total + Remove */}
                        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                          <span className="font-serif font-semibold text-[#E2C285] text-base">
                            {formatINR(itemLineTotal)}
                          </span>
                          <button
                            onClick={() => removeFromCart(key)}
                            className="text-white/30 hover:text-red-400 p-1.5 transition"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Info box */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-start gap-3 text-xs text-white/60">
                  <Info size={16} className="text-[#C9A15A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#E2C285]">Fabrication Note:</strong> All quantities reflect architectural measurement estimates. After placing your order, our Anand technical surveyors verify exact on-site dimensions before final workshop cutting.
                  </div>
                </div>
              </div>

              {/* Right Col: Order Summary */}
              <div className="space-y-6">
                {/* Coupon Box */}
                <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-5 shadow-xl">
                  <h3 className="font-serif text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Tag size={16} className="text-[#C9A15A]" />
                    <span>Have a Coupon Code?</span>
                  </h3>

                  {coupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#C9A15A]/15 border border-[#C9A15A]/30 text-xs">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-[#C9A15A]" />
                        <div>
                          <strong className="text-white font-mono">{coupon.code}</strong>
                          <span className="text-[#C9A15A] ml-1.5 font-medium">({coupon.discountPercent}% OFF)</span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-white/50 hover:text-red-400 font-semibold uppercase text-[10px] tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. NIRMAAN10"
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/15 focus:border-[#C9A15A] focus:outline-none uppercase tracking-wider text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#C9A15A] text-[#061411] font-semibold text-xs rounded-xl hover:brightness-110 transition shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  <p className="text-[11px] text-white/40 mt-2">
                    Try <code className="text-[#E2C285]">NIRMAAN10</code> for 10% off or <code className="text-[#E2C285]">WELCOME5</code> for 5% off.
                  </p>
                </div>

                {/* Pricing Summary Card */}
                <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-white pb-3 border-b border-white/10">
                    Order Estimate
                  </h3>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal</span>
                      <span className="font-medium text-white">{formatINR(pricing.subtotal)}</span>
                    </div>

                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount ({pricing.discountPercent}%)</span>
                        <span>-{formatINR(pricing.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-white/70">
                      <span>Taxable Amount</span>
                      <span className="font-medium text-white">{formatINR(pricing.taxableAmount)}</span>
                    </div>

                    {/* GST Rows */}
                    {pricing.isGujarat ? (
                      <>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>CGST (9%)</span>
                          <span>{formatINR(pricing.cgst)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>SGST (9%)</span>
                          <span>{formatINR(pricing.sgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-xs text-white/60">
                        <span>IGST (18%)</span>
                        <span>{formatINR(pricing.igst)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                      <span className="font-serif text-base font-semibold text-white">Grand Total</span>
                      <div className="text-right">
                        <span className="font-serif text-2xl font-bold text-[#E2C285]">
                          {formatINR(pricing.grandTotal)}
                        </span>
                        <span className="block text-[10px] text-white/40">Includes all applicable GST</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] font-bold text-sm tracking-wide uppercase hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg shadow-[#C9A15A]/25 mt-4"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-white/50 pt-2">
                    <ShieldCheck size={14} className="text-[#C9A15A]" />
                    <span>Quality certified fabrication • Guaranteed installation</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
