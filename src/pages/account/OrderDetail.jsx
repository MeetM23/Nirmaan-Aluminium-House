// src/pages/account/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, FileText, Download, RefreshCw, CheckCircle2, Clock, MapPin, CreditCard, ShieldCheck
} from 'lucide-react';
import orderService from '../../services/orderService';
import invoiceService from '../../services/invoiceService';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/pricing';
import toast from 'react-hot-toast';

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'In Production', 'Installed', 'Delivered'];

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error('Order not found.');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleReorder = async () => {
    if (!order) return;
    try {
      for (const item of order.items) {
        await addToCart({
          id: item.productId || item.id,
          productId: item.productId || item.id,
          slug: item.slug,
          name: item.name,
          variant: item.variant,
          finish: item.finish,
          material: item.material,
          unit: item.unit,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          image: item.image,
        });
      }
      toast.success('All items added to cart!');
      openCart();
    } catch (err) {
      toast.error('Failed to reorder.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-white/50 text-xs">Loading order details...</div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center text-white/60">
        <p className="mb-4">Order not found.</p>
        <Link to="/account/orders" className="btn-gold">Back to Orders</Link>
      </div>
    );
  }

  // Calculate timeline index
  const currentStepIdx = TIMELINE_STEPS.indexOf(order.status);

  return (
    <>
      <Helmet>
        <title>{order.invoiceNumber} – Order Details – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="space-y-6">
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Link
                to="/account/orders"
                className="p-2 rounded-xl border border-white/10 text-white/70 hover:text-white transition"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <span className="eyebrow block">Fabrication Order</span>
                <h1 className="font-serif text-2xl font-bold text-white">
                  {order.invoiceNumber}
                </h1>
                <p className="text-xs text-white/50">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleReorder}
                className="px-4 py-2.5 rounded-xl border border-white/20 text-white hover:border-[#C9A15A] hover:text-[#C9A15A] text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Reorder</span>
              </button>

              <Link
                to={`/account/orders/${order.id}/invoice`}
                className="btn-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <FileText size={15} />
                <span>Official Invoice</span>
              </Link>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
            <h3 className="font-serif text-sm font-semibold text-white mb-6 uppercase tracking-wider text-center">
              Fabrication &amp; Installation Progress
            </h3>

            <div className="relative flex items-center justify-between max-w-2xl mx-auto">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C9A15A] transition-all duration-500 z-0"
                style={{
                  width: `${Math.max(0, (currentStepIdx / (TIMELINE_STEPS.length - 1)) * 100)}%`,
                }}
              />

              {TIMELINE_STEPS.map((s, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={s} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-[#C9A15A] text-[#061411]'
                          : 'bg-[#0A1F1A] border border-white/20 text-white/40'
                      } ${isCurrent ? 'ring-4 ring-[#C9A15A]/30 scale-110' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-medium tracking-wider uppercase text-center max-w-[70px] ${
                        isCurrent ? 'text-[#E2C285] font-bold' : isPassed ? 'text-white/80' : 'text-white/40'
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-white">
              Ordered Fabrication Items ({order.items?.length})
            </h3>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || '/images/products/ss-railing.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div>
                      <Link
                        to={`/products/${item.slug}`}
                        className="font-serif font-semibold text-white hover:text-[#C9A15A] transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#C9A15A] mt-0.5">{item.variant}</p>
                      <p className="text-[11px] text-white/50 mt-1">
                        Rate: {formatINR(item.unitPrice)} / {item.unit?.replace('per ', '')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white/40 block">Qty: {item.quantity}</span>
                    <span className="font-serif font-bold text-base text-[#E2C285]">
                      {formatINR(item.lineTotal || (item.unitPrice * item.quantity))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses & Pricing Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Addresses */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/25 border border-white/10 text-xs space-y-1.5">
                <span className="text-white/50 uppercase tracking-wider font-semibold block mb-1">
                  Billing Address
                </span>
                <p className="font-bold text-white">{order.billingAddress?.name}</p>
                {order.billingAddress?.company && <p className="text-white/70">{order.billingAddress.company}</p>}
                <p className="text-white/70">
                  {order.billingAddress?.line1}, {order.billingAddress?.city}, {order.billingAddress?.state} - {order.billingAddress?.pincode}
                </p>
                <p className="text-white/60">Phone: {order.billingAddress?.phone}</p>
                {order.billingAddress?.gstNumber && (
                  <p className="text-[#E2C285] font-mono">GSTIN: {order.billingAddress.gstNumber}</p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-black/25 border border-white/10 text-xs space-y-1.5">
                <span className="text-white/50 uppercase tracking-wider font-semibold block mb-1">
                  Installation / Site Address
                </span>
                <p className="font-bold text-white">{order.shippingAddress?.name}</p>
                <p className="text-white/70">
                  {order.shippingAddress?.line1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
                <p className="text-white/60">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-5 rounded-xl bg-black/35 border border-white/10 text-xs space-y-2.5">
              <span className="text-white/50 uppercase tracking-wider font-semibold block mb-2">
                Payment &amp; GST Summary
              </span>

              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>{formatINR(order.pricing?.subtotal)}</span>
              </div>

              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({order.pricing?.discountPercent}%)</span>
                  <span>-{formatINR(order.pricing?.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-white/70">
                <span>Taxable Fabrication Amount</span>
                <span>{formatINR(order.pricing?.taxableAmount)}</span>
              </div>

              {order.pricing?.isGujarat ? (
                <>
                  <div className="flex justify-between text-white/60">
                    <span>CGST (9%)</span>
                    <span>{formatINR(order.pricing?.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>SGST (9%)</span>
                    <span>{formatINR(order.pricing?.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-white/60">
                  <span>IGST (18%)</span>
                  <span>{formatINR(order.pricing?.igst)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="text-base text-[#E2C285]">{formatINR(order.pricing?.grandTotal)}</span>
              </div>

              <div className="pt-2 text-[11px] text-white/50">
                Payment Method: <strong className="text-white">{order.paymentMethod}</strong> ({order.paymentStatus})
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
