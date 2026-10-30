// src/pages/account/Orders.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Package, Search, FileText, ArrowRight, RefreshCw, Calendar, CheckCircle, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import { formatINR } from '../../utils/pricing';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'Placed', 'Confirmed', 'In Production', 'Installed', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { user } = useAuth();
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await orderService.getOrders(user?.id);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  // Reorder: add all items to cart
  const handleReorder = async (order) => {
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
      toast.success('Items added to cart!');
      openCart();
    } catch (err) {
      toast.error('Failed to reorder items.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'All' || order.status.toLowerCase() === selectedStatus.toLowerCase();
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.invoiceNumber.toLowerCase().includes(query) ||
      order.items?.some((i) => i.name.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Installed':
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'In Production':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Confirmed':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Cancelled':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      default:
        return 'bg-[#C9A15A]/15 text-[#E2C285] border-[#C9A15A]/30';
    }
  };

  return (
    <>
      <Helmet>
        <title>My Orders &amp; Invoices – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="space-y-6">
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Fabrication Orders &amp; GST Invoices</h2>
              <p className="text-xs text-white/50">Track workshop status, download tax invoices, and reorder</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by invoice # or product..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition border ${
                    selectedStatus === s
                      ? 'bg-[#C9A15A] text-[#061411] border-[#C9A15A]'
                      : 'bg-black/30 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="py-12 text-center text-white/50 text-xs">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-white/50 text-xs">
              <Package size={36} className="mx-auto text-white/20 mb-3" />
              <p>No orders found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-black/35 border border-white/10 hover:border-[#C9A15A]/30 transition space-y-4"
                >
                  {/* Top Row: Invoice #, Date, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-[#E2C285]">
                        {order.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar size={13} className="text-[#C9A15A]" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Items list preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.image || '/images/products/ss-railing.jpg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-[#C9A15A] truncate">{item.variant}</p>
                          <p className="text-[10px] text-white/40">
                            Qty: {item.quantity} {item.unit?.replace('per ', '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row: Total, Reorder & Invoice Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-[11px] text-white/50 block">Grand Total:</span>
                      <span className="font-serif font-bold text-lg text-white">
                        {formatINR(order.pricing?.grandTotal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-2 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 transition"
                        title="Add these items to your cart"
                      >
                        <RefreshCw size={13} />
                        <span>Reorder</span>
                      </button>

                      <Link
                        to={`/account/orders/${order.id}`}
                        className="px-3.5 py-2 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/5 text-xs font-semibold transition"
                      >
                        Details
                      </Link>

                      <Link
                        to={`/account/orders/${order.id}/invoice`}
                        className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <FileText size={14} />
                        <span>View Invoice</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
