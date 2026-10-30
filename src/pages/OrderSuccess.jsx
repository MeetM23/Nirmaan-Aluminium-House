// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  CheckCircle, FileText, Download, ArrowRight, ShoppingBag, ShieldCheck, Clock
} from 'lucide-react';
import orderService from '../services/orderService';
import invoiceService from '../services/invoiceService';
import { formatINR } from '../utils/pricing';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      } catch (err) {
        console.error('Order retrieval failed:', err);
        toast.error('Order not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-[#061411]">
        <div className="w-12 h-12 border-3 border-[#C9A15A]/30 border-t-[#C9A15A] rounded-full animate-spin mb-4" />
        <p className="text-[#C9A15A] font-serif">Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center bg-[#061411] text-[#EFEBDD]">
        <h2 className="font-serif text-2xl mb-4 text-white">Order not found</h2>
        <Link to="/products" className="btn-gold">Explore Catalog</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmed – {order.invoiceNumber} – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="pt-28 pb-24 px-6 lg:px-10 min-h-screen bg-[#061411] text-[#EFEBDD] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-[#0A1F1A] border border-[#C9A15A]/30 rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Subtle gold glow behind header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#C9A15A]/10 blur-3xl pointer-events-none" />

          {/* Animated Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#C9A15A] to-[#E2C285] text-[#061411] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#C9A15A]/25"
          >
            <CheckCircle size={44} strokeWidth={2.2} />
          </motion.div>

          <p className="eyebrow mb-2">Order Confirmed</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Thank You For Building With Us!
          </h1>
          <p className="text-sm text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
            Your fabrication order has been placed with Nirmaan Aluminium House. Our Anand technical team will verify measurements and schedule your fabrication schedule.
          </p>

          {/* Order Details Card */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-left mb-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div>
                <span className="text-xs text-white/50 block">Official Invoice Number:</span>
                <span className="font-serif text-lg font-bold text-[#E2C285]">{order.invoiceNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/50 block">Grand Total:</span>
                <span className="font-serif text-lg font-bold text-white">
                  {formatINR(order.pricing.grandTotal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-white/40 block">Payment Method</span>
                <strong className="text-white">{order.paymentMethod}</strong>
              </div>
              <div>
                <span className="text-white/40 block">Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold text-[11px]">
                  {order.status}
                </span>
              </div>
              <div>
                <span className="text-white/40 block">Items Count</span>
                <strong className="text-white">{order.items?.length || 0} Products</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to={`/account/orders/${order.id}/invoice`}
              className="w-full sm:w-auto btn-gold px-6 py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              id="view-invoice-btn"
            >
              <FileText size={16} />
              <span>View &amp; Print Invoice</span>
            </Link>

            <Link
              to="/account/orders"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-white hover:border-[#C9A15A] hover:text-[#C9A15A] transition text-xs uppercase tracking-wider font-semibold"
            >
              My Orders
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-white/60 hover:text-white transition text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
