// src/pages/account/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Package, Clock, CheckCircle2, FileText, ArrowRight, ShoppingBag, MapPin, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { formatINR } from '../../utils/pricing';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const userOrders = await orderService.getOrders(user?.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching dashboard orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
  const activeOrders = orders.filter((o) => ['Placed', 'Confirmed', 'In Production'].includes(o.status));
  const recentOrders = orders.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Account Dashboard – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0A1F1A] border border-[#C9A15A]/25 shadow-xl">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Orders</span>
              <Package size={18} className="text-[#C9A15A]" />
            </div>
            <p className="font-serif text-3xl font-bold text-white">{orders.length}</p>
            <p className="text-[11px] text-white/40 mt-1">Fabrication jobs on record</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A1F1A] border border-[#C9A15A]/25 shadow-xl">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Active Jobs</span>
              <Clock size={18} className="text-amber-400" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#E2C285]">{activeOrders.length}</p>
            <p className="text-[11px] text-white/40 mt-1">Under measurement / fabrication</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A1F1A] border border-[#C9A15A]/25 shadow-xl">
            <div className="flex items-center justify-between text-white/50 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Investment</span>
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-white">{formatINR(totalSpent)}</p>
            <p className="text-[11px] text-white/40 mt-1">All verified GST invoices</p>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif text-lg font-semibold text-white">Recent Fabrication Orders</h3>
            <Link
              to="/account/orders"
              className="text-xs text-[#C9A15A] hover:underline flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-white/50 text-xs">Loading orders...</div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center text-white/50 text-xs">No orders yet. Place your first order today!</div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-[#C9A15A]/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-[#E2C285]">
                        {order.invoiceNumber}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A15A]/15 text-[#C9A15A]">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/60">
                      {order.items?.map((i) => i.name).join(', ')}
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-serif font-bold text-base text-white">
                      {formatINR(order.pricing?.grandTotal)}
                    </span>
                    <Link
                      to={`/account/orders/${order.id}/invoice`}
                      className="px-3 py-1.5 rounded-lg border border-[#C9A15A]/40 text-[#C9A15A] hover:bg-[#C9A15A]/10 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <FileText size={13} />
                      <span>Invoice</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="p-5 rounded-2xl bg-[#0A1F1A] border border-white/10 hover:border-[#C9A15A]/40 transition group flex flex-col justify-between"
          >
            <div>
              <ShoppingBag size={22} className="text-[#C9A15A] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-serif text-base font-semibold text-white mb-1">Explore Products</h4>
              <p className="text-xs text-white/50">Browse railings, balconies, gates &amp; PVD panels.</p>
            </div>
            <span className="text-xs font-semibold text-[#E2C285] mt-4 flex items-center gap-1">
              Browse Catalog <ArrowRight size={13} />
            </span>
          </Link>

          <Link
            to="/account/addresses"
            className="p-5 rounded-2xl bg-[#0A1F1A] border border-white/10 hover:border-[#C9A15A]/40 transition group flex flex-col justify-between"
          >
            <div>
              <MapPin size={22} className="text-[#C9A15A] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-serif text-base font-semibold text-white mb-1">Installation Sites</h4>
              <p className="text-xs text-white/50">Manage saved residential &amp; commercial addresses.</p>
            </div>
            <span className="text-xs font-semibold text-[#E2C285] mt-4 flex items-center gap-1">
              Manage Addresses <ArrowRight size={13} />
            </span>
          </Link>

          <Link
            to="/account/wishlist"
            className="p-5 rounded-2xl bg-[#0A1F1A] border border-white/10 hover:border-[#C9A15A]/40 transition group flex flex-col justify-between"
          >
            <div>
              <Heart size={22} className="text-[#C9A15A] mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-serif text-base font-semibold text-white mb-1">Saved Designs</h4>
              <p className="text-xs text-white/50">View bookmarked architectural designs for your projects.</p>
            </div>
            <span className="text-xs font-semibold text-[#E2C285] mt-4 flex items-center gap-1">
              View Wishlist <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
