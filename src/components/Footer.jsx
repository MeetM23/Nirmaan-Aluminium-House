// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { products } from '../data/products';
import { businessConfig } from '../config/business';

// Inline social SVG icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const currentYear = new Date().getFullYear();

export default function Footer() {

  return (
    <footer className="bg-[#061411] border-t border-white/[0.06]" role="contentinfo">
      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-5 text-sm text-white/50 leading-relaxed max-w-[240px]">
              Premium aluminium &amp; stainless steel fabrication solutions crafted for strength, style and lasting value.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: InstagramIcon, label: 'Instagram', href: businessConfig.social.instagram },
                { Icon: FacebookIcon, label: 'Facebook', href: businessConfig.social.facebook },
                { Icon: YoutubeIcon, label: 'YouTube', href: businessConfig.social.youtube },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[#C9A15A]/30 flex items-center justify-center text-[#C9A15A]/70 hover:bg-[#C9A15A] hover:text-white hover:border-[#C9A15A] transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-sans text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-[#C9A15A] mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5" role="list">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/products', label: 'Products' },
                { to: '/services', label: 'Services' },
                { to: '/projects', label: 'Projects' },
                { to: '/why-us', label: 'Why Us' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to} role="listitem">
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-[#C9A15A] transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-sans text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-[#C9A15A] mb-5">
              Our Products
            </h3>
            <ul className="space-y-2.5" role="list">
              {products.map((p) => (
                <li key={p.slug} role="listitem">
                  <Link
                    to={`/products/${p.slug}`}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-[#C9A15A] transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-[#C9A15A] mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4" role="list">
              <li>
                <a href={`tel:${businessConfig.phoneClean}`} className="flex items-start gap-3 text-sm text-white/50 hover:text-[#C9A15A] transition-colors">
                  <Phone size={15} className="text-[#C9A15A] flex-shrink-0 mt-0.5" />
                  <div>
                    <div>{businessConfig.phone}</div>
                    <div className="text-xs text-white/30 mt-0.5">{businessConfig.workingHours}</div>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${businessConfig.email}`} className="flex items-start gap-3 text-sm text-white/50 hover:text-[#C9A15A] transition-colors">
                  <Mail size={15} className="text-[#C9A15A] flex-shrink-0 mt-0.5" />
                  {businessConfig.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-white/50">
                  <MapPin size={15} className="text-[#C9A15A] flex-shrink-0 mt-0.5" />
                  <div>
                    {businessConfig.address.city}, {businessConfig.address.state}, {businessConfig.address.country}<br />
                    <span className="text-xs text-white/30">Serving Residential, Commercial &amp; Industrial Spaces</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-white/50">
                  <Clock size={15} className="text-[#C9A15A] flex-shrink-0 mt-0.5" />
                  {businessConfig.workingHours}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            &copy; {currentYear} Nirmaan Aluminium House. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Designed with ❤ in Anand, Gujarat
          </p>
        </div>
      </div>
    </footer>
  );
}
