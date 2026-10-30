// src/pages/account/AccountLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, MapPin, Package, Heart, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const accountLinks = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/account/profile', label: 'My Profile', icon: User },
  { to: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { to: '/account/orders', label: 'My Orders & Invoices', icon: Package },
  { to: '/account/wishlist', label: 'Saved Wishlist', icon: Heart },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="pt-28 pb-24 px-6 lg:px-10 min-h-screen bg-[#061411] text-[#EFEBDD]">
      <div className="max-w-[1300px] mx-auto">
        {/* User Greeting Bar */}
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9A15A] to-[#E2C285] text-[#061411] font-serif text-xl font-bold flex items-center justify-center shadow-lg">
              {user?.avatar || 'U'}
            </div>
            <div>
              <span className="eyebrow block">Client Portal</span>
              <h1 className="font-serif text-2xl font-bold text-white">
                {user?.name}
              </h1>
              <p className="text-xs text-white/50">{user?.email} {user?.company ? `• ${user.company}` : ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Navigation Pills */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {accountLinks.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition border ${
                  isActive
                    ? 'bg-[#C9A15A] text-[#061411] border-[#C9A15A]'
                    : 'bg-[#0A1F1A] text-white/70 border-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={14} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Main Section: Sidebar (Desktop) + Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar (3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-4 shadow-xl space-y-1">
            {accountLinks.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] shadow'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
                <ChevronRight size={14} className="opacity-50" />
              </NavLink>
            ))}
          </aside>

          {/* Child Page Outlet (9 Cols) */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
