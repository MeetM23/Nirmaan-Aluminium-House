// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { businessConfig } from '../config/business';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/why-us', label: 'Why Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change (adjusted during render per React guidelines)
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isHome = location.pathname === '/';
  const headerBgClass = scrolled
    ? 'bg-[#F5F4F1]/95 backdrop-blur-md border-b border-[#E4E2DC] shadow-[0_1px_0_0_rgba(21,23,27,0.06)]'
    : isHome
    ? 'bg-transparent border-b border-transparent'
    : 'bg-[#F5F4F1] border-b border-[#E4E2DC]';

  const textColorClass = isHome && !scrolled ? 'text-white' : 'text-[#3A3D44]';
  // Transparent header over dark hero image uses light logo; sticky off-white & internal pages use dark logo
  const isDarkHeader = isHome && !scrolled;
  const logoVariant = isDarkHeader ? 'light' : 'dark';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${headerBgClass}`}
        role="banner"
      >
        <nav
          className="site-container h-20 flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo with visual weight balance */}
          <div className="flex-shrink-0">
            <Logo variant={logoVariant} />
          </div>

          {/* Right cluster: Nav links + CTA with generous spacing (≥36px gap before CTA) */}
          <div className="flex items-center gap-9 lg:gap-10">
            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-7" role="list">
              {navLinks.map((link) => (
                <li key={link.to} role="listitem">
                  <NavLink
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) =>
                      `relative text-[15px] font-medium py-1 transition-colors duration-150 group ${
                        isActive
                          ? isHome && !scrolled
                            ? 'text-white font-semibold'
                            : 'text-[#15171B] font-semibold'
                          : `${textColorClass} hover:text-[#15171B]`
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.label}</span>
                        {/* 1px underline growing on hover, solid on active */}
                        <span
                          className={`absolute bottom-0 left-0 h-[1px] transition-all duration-150 ${
                            isActive
                              ? isHome && !scrolled
                                ? 'w-full bg-white'
                                : 'w-full bg-[#15171B]'
                              : 'w-0 group-hover:w-full bg-[#A8ACB3]'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right Action: Clean text link "Get a quote →" with vertically centered mono arrow */}
            <div className="flex items-center gap-4">
              <Link
                to="/contact"
                className={`hidden sm:inline-flex items-center gap-1.5 text-[15px] font-medium transition-opacity hover:opacity-80 py-1 ${
                  isHome && !scrolled ? 'text-white' : 'text-[#15171B]'
                }`}
                id="nav-get-quote-link"
              >
                <span>Get a quote</span>
                <span className="font-mono text-xs leading-none inline-flex items-center">→</span>
              </Link>

              {/* Mobile Nav Hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden p-2 text-xs font-mono uppercase tracking-wider font-semibold transition ${
                  isHome && !scrolled ? 'text-white' : 'text-[#15171B]'
                }`}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <span className="border border-current px-2.5 py-1 rounded-sm">Menu</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Refined Full-screen Mobile Nav Overlay (design.md §5.1 & §6) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#F5F4F1] flex flex-col justify-between p-6 sm:p-10 lg:hidden overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Top Bar with Logo & Close affordance */}
            <div className="flex items-center justify-between border-b border-[#E4E2DC] pb-4">
              <Logo variant="dark" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs uppercase tracking-wider text-[#15171B] font-bold p-2 hover:opacity-70 transition"
                aria-label="Close menu"
              >
                Close ✕
              </button>
            </div>

            {/* Stacked Links in Fraunces with 32px gaps */}
            <div className="py-10 space-y-7">
              {navLinks.map((link) => (
                <div key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.exact}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `font-display text-3xl sm:text-4xl block transition-colors ${
                        isActive
                          ? 'text-[#15171B] font-medium underline underline-offset-8 decoration-1 decoration-[#A8ACB3]'
                          : 'text-[#3A3D44] hover:text-[#15171B]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}
            </div>

            {/* Bottom Contact & Workshop Meta in Mono */}
            <div className="border-t border-[#E4E2DC] pt-6 space-y-2 text-xs font-mono text-[#6B6F76]">
              <div className="flex justify-between items-center text-[#15171B] font-semibold">
                <span>Workshop: Anand, Gujarat</span>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="underline underline-offset-2"
                >
                  Direct Inquiry →
                </Link>
              </div>
              <p>Email: {businessConfig.email}</p>
              <p>Phone: {businessConfig.phone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
