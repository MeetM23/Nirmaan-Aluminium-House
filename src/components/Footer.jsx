// src/components/Footer.jsx
// Amended design.md §5.10 & Refinement §G: Balanced columns, pt-24 pb-16 padding, 14px legal text

import { Link } from 'react-router-dom';
import Logo from './Logo';
import { products } from '../data/products';
import { businessConfig } from '../config/business';
import MonoLabel from './MonoLabel';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#15171B] text-[#F5F4F1] border-t border-[#2A2D33]" role="contentinfo">
      {/* Main footer container with generous padding (pt-24 pb-16) */}
      <div className="site-container pt-24 pb-16">
        {/* Responsive Grid: 4 columns desktop, 2 columns mobile/tablet (items-start aligned) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 items-start">
          {/* Col 1: Brand & Studio */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-[#C9CCD1] leading-relaxed max-w-[280px] pt-1">
              Bespoke architectural aluminium and stainless steel fabrication practice based in Anand, Gujarat.
            </p>
            <div className="font-mono text-xs text-[#A8ACB3] space-y-1 pt-2">
              <p>Plot No. 42, GIDC Industrial Estate</p>
              <p>Anand, Gujarat - 388001</p>
            </div>
          </div>

          {/* Col 2: Sitemap */}
          <div className="space-y-4">
            <MonoLabel color="text-[#C9CCD1]">01 — Sitemap</MonoLabel>
            <ul className="space-y-3 text-sm" role="list">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/products', label: 'Systems & Catalogue' },
                { to: '/projects', label: 'Project Gallery' },
                { to: '/about', label: 'About Studio' },
                { to: '/why-us', label: 'Craft & Tolerances' },
                { to: '/contact', label: 'Contact & Inquiries' },
              ].map(({ to, label }) => (
                <li key={to} role="listitem">
                  <Link
                    to={to}
                    className="text-[#C9CCD1] hover:text-[#F5F4F1] transition-colors duration-150 block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Systems */}
          <div className="space-y-4">
            <MonoLabel color="text-[#C9CCD1]">02 — Systems</MonoLabel>
            <ul className="space-y-3 text-sm" role="list">
              {products.slice(0, 6).map((p) => (
                <li key={p.slug} role="listitem">
                  <Link
                    to={`/products/${p.slug}`}
                    className="text-[#C9CCD1] hover:text-[#F5F4F1] transition-colors duration-150 block truncate"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <MonoLabel color="text-[#C9CCD1]">03 — Contact</MonoLabel>
            <div className="space-y-3.5 text-sm">
              <div>
                <span className="font-mono text-[11px] uppercase text-[#A8ACB3] block tracking-wider">
                  Direct Line
                </span>
                <a
                  href={`tel:${businessConfig.phoneClean}`}
                  className="text-[#F5F4F1] hover:text-[#C9CCD1] transition-colors font-mono text-xs block mt-0.5"
                >
                  {businessConfig.phone}
                </a>
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase text-[#A8ACB3] block tracking-wider">
                  Studio Inquiries
                </span>
                <a
                  href={`mailto:${businessConfig.email}`}
                  className="text-[#F5F4F1] hover:text-[#C9CCD1] transition-colors font-mono text-xs break-all block mt-0.5"
                >
                  {businessConfig.email}
                </a>
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase text-[#A8ACB3] block tracking-wider">
                  Operating Hours
                </span>
                <p className="text-xs text-[#C9CCD1] mt-0.5">{businessConfig.workingHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar: Text ≥14px in --color-aluminium-2 */}
        <div className="mt-20 pt-8 border-t border-[#2A2D33] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-mono text-[#C9CCD1]">
          <p>© {CURRENT_YEAR} Nirmaan Aluminium House. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-xs text-[#A8ACB3]">Crafting Spaces. Building Trust.</span>
            <button
              type="button"
              onClick={handleBackToTop}
              className="text-[#C9CCD1] hover:text-[#F5F4F1] transition-colors flex items-center gap-1 cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
