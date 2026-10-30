// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { products } from '../data/products';
import { businessConfig } from '../config/business';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products', hasDropdown: true },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/why-us', label: 'Why Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setMobileOpen(false);
    // oxlint-disable-next-line react/set-state-in-effect
    setProductsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navBg = scrolled
    ? 'bg-[#061411]/95 backdrop-blur-md shadow-lg shadow-black/20'
    : 'bg-[#061411]/80 backdrop-blur-sm';

  return (
    <>
      {/* ===== Desktop / Mobile Topbar ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg} border-b border-white/5`}
        role="banner"
      >
        <nav
          className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
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
            {/* Desktop Get Quote */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex btn-outline-gold text-xs py-2 px-4"
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
                </ul>

                <div className="mt-6 px-1">
                  <Link
                    to="/contact"
                    className="btn-gold w-full justify-center text-xs py-3"
                  >
                    Request a Quote <ArrowRight size={14} />
                  </Link>
                </div>
              </nav>

              {/* Contact Info */}
              <div className="px-5 py-4 space-y-2.5 border-t border-white/10 bg-black/20">
                <a
                  href={`tel:${businessConfig.phoneClean}`}
                  className="flex items-center gap-3 text-xs text-white/70 hover:text-[#C9A15A] transition-colors"
                >
                  <Phone size={13} className="text-[#C9A15A]" />
                  <span>{businessConfig.phone}</span>
                </a>
                <a
                  href={`mailto:${businessConfig.email}`}
                  className="flex items-center gap-3 text-xs text-white/70 hover:text-[#C9A15A] transition-colors"
                >
                  <Mail size={13} className="text-[#C9A15A]" />
                  <span>{businessConfig.email}</span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
