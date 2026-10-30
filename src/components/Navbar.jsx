// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Phone, Mail, MapPin, ArrowRight,
  ShoppingBag, User, LogOut, Package, Heart, MapPin as AddressIcon, Shield
} from 'lucide-react';
import Logo from './Logo';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Custom social icon SVGs
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products', hasDropdown: true },
  { to: '/projects', label: 'Projects' },
  { to: '/why-us', label: 'Why Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { itemCount, openCart, cartBump } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navBg = scrolled
    ? 'bg-[#061411]/95 backdrop-blur-md shadow-lg shadow-black/20'
    : 'bg-[#061411]/80 backdrop-blur-sm';

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* ===== Desktop / Mobile Topbar ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg} border-b border-white/5`}
        role="banner"
      >
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <Logo />

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {navLinks.map((link) => (
              <li key={link.to} role="listitem">
                <NavLink
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Action Icons & CTA */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Cart Icon with badge */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-white/80 hover:text-[#C9A15A] hover:bg-white/5 transition-colors"
              aria-label="View Cart"
              id="navbar-cart-btn"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <motion.span
                  animate={cartBump ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] text-[11px] font-bold flex items-center justify-center shadow"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full text-white/80 hover:text-[#C9A15A] hover:bg-white/5 transition-colors"
                aria-label="User Account"
                id="navbar-user-btn"
              >
                {isAuthenticated ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9A15A] to-[#E2C285] text-[#061411] font-bold text-xs flex items-center justify-center shadow">
                    {user?.avatar || 'U'}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70">
                    <User size={16} />
                  </div>
                )}
                <ChevronDown size={14} className="hidden sm:block text-white/50" />
              </button>

              {/* Account Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0A1F1A] border border-[#C9A15A]/30 shadow-2xl py-2 z-50 text-sm"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-white/10">
                          <p className="font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-[#C9A15A] truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/account"
                            className="flex items-center gap-2.5 px-4 py-2 text-white/80 hover:text-[#C9A15A] hover:bg-white/5 transition"
                          >
                            <User size={15} />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            to="/account/orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-white/80 hover:text-[#C9A15A] hover:bg-white/5 transition"
                          >
                            <Package size={15} />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/account/addresses"
                            className="flex items-center gap-2.5 px-4 py-2 text-white/80 hover:text-[#C9A15A] hover:bg-white/5 transition"
                          >
                            <AddressIcon size={15} />
                            <span>Saved Addresses</span>
                          </Link>
                          <Link
                            to="/account/wishlist"
                            className="flex items-center gap-2.5 px-4 py-2 text-white/80 hover:text-[#C9A15A] hover:bg-white/5 transition"
                          >
                            <Heart size={15} />
                            <span>Wishlist</span>
                          </Link>
                        </div>
                        <div className="border-t border-white/10 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-red-400 hover:bg-red-500/10 transition text-left"
                          >
                            <LogOut size={15} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2.5 border-b border-white/10">
                          <p className="font-serif text-sm font-semibold text-white">Client Portal</p>
                          <p className="text-xs text-white/50">Manage fabrication orders</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to="/login"
                            className="flex items-center justify-center w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] font-semibold text-xs transition hover:brightness-105"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="flex items-center justify-center w-full py-2 px-3 rounded-lg border border-[#C9A15A]/40 text-[#C9A15A] text-xs hover:bg-[#C9A15A]/10 transition"
                          >
                            Create Account
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Get Quote */}
            <Link
              to="/contact"
              className="hidden lg:flex btn-outline-gold text-xs py-2 px-4"
              id="nav-get-quote-btn"
            >
              Get a Quote <ArrowRight size={13} />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-white/80 hover:text-[#C9A15A] transition-colors"
              aria-label="Open mobile menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-sidebar"
              id="hamburger-btn"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* ===== Mobile Sidebar Overlay ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar */}
            <motion.aside
              id="mobile-sidebar"
              ref={sidebarRef}
              key="sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[310px] flex flex-col lg:hidden overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #0A1F1A 0%, #061411 100%)' }}
              aria-label="Mobile navigation"
              role="dialog"
              aria-modal="true"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/60 hover:text-[#C9A15A] transition-colors"
                  aria-label="Close mobile menu"
                  id="close-sidebar-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Client Quick Bar in mobile */}
              <div className="px-5 py-3.5 bg-black/30 border-b border-white/10 flex items-center justify-between">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#C9A15A] text-[#061411] font-bold text-xs flex items-center justify-center">
                      {user?.avatar || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <Link to="/account" className="text-[11px] text-[#C9A15A] hover:underline">
                        My Account
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <Link
                      to="/login"
                      className="flex-1 text-center py-1.5 px-3 rounded bg-[#C9A15A] text-[#061411] font-semibold text-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-center py-1.5 px-3 rounded border border-white/20 text-white text-xs"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-4" aria-label="Mobile navigation links">
                <ul className="space-y-1" role="list">
                  {navLinks.map((link) => (
                    <li key={link.to} role="listitem">
                      {link.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => setProductsOpen(!productsOpen)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white/80 hover:text-[#C9A15A] hover:bg-white/5 rounded transition-all"
                            aria-expanded={productsOpen}
                            aria-controls="mobile-products-dropdown"
                            id="mobile-products-btn"
                          >
                            <span>Products</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          <AnimatePresence>
                            {productsOpen && (
                              <motion.ul
                                id="mobile-products-dropdown"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden ml-4 mt-1 space-y-0.5 border-l border-[#C9A15A]/20"
                                role="list"
                              >
                                {products.map((p) => (
                                  <li key={p.slug} role="listitem">
                                    <Link
                                      to={`/products/${p.slug}`}
                                      className="flex items-center gap-2 pl-4 py-2 text-xs text-white/60 hover:text-[#C9A15A] transition-colors"
                                    >
                                      <span className="text-[#C9A15A] font-mono text-[10px]">{p.number}</span>
                                      {p.name}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <NavLink
                          to={link.to}
                          end={link.exact}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded transition-all ${
                              isActive
                                ? 'text-[#C9A15A] bg-white/5'
                                : 'text-white/80 hover:text-[#C9A15A] hover:bg-white/5'
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      )}
                    </li>
                  ))}

                  {/* Account Pages for Mobile */}
                  <li className="pt-2 border-t border-white/10">
                    <Link
                      to="/cart"
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-white/80 hover:text-[#C9A15A] rounded"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#C9A15A]" />
                        <span>Shopping Cart</span>
                      </div>
                      {itemCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C9A15A] text-[#061411] text-xs font-bold">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-[#C9A15A] rounded"
                    >
                      <Package size={16} className="text-[#C9A15A]" />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account/wishlist"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-[#C9A15A] rounded"
                    >
                      <Heart size={16} className="text-[#C9A15A]" />
                      <span>Saved Wishlist</span>
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Contact Info */}
              <div className="px-5 py-4 space-y-2.5 border-t border-white/10">
                <a href="tel:+919876543210" className="flex items-center gap-3 text-xs text-white/70 hover:text-[#C9A15A]">
                  <Phone size={13} className="text-[#C9A15A]" />
                  <span>+91 98765 43210</span>
                </a>
                <a href="mailto:info@nirmaanaluminium.com" className="flex items-center gap-3 text-xs text-white/70 hover:text-[#C9A15A]">
                  <Mail size={13} className="text-[#C9A15A]" />
                  <span>info@nirmaanaluminium.com</span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
