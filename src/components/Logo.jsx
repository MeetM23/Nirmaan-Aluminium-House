// src/components/Logo.jsx
import { Link } from 'react-router-dom';

export default function Logo({ className = '', dark = false }) {
  const textColor = dark ? 'text-[#1A1A1A]' : 'text-white';
  const subColor = dark ? 'text-[#6B6B6B]' : 'text-white/60';

  return (
    <Link to="/" className={`flex items-center gap-3 no-underline group ${className}`} aria-label="Nirmaan Aluminium House - Home">
      {/* Gold N monogram SVG */}
      <div className="relative flex-shrink-0">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0.5" y="0.5" width="43" height="43" stroke="url(#goldGrad)" strokeWidth="1"/>
          <path d="M10 34V10H14L28 28V10H34V34H30L16 16V34H10Z" fill="url(#goldGrad)" />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9A15A"/>
              <stop offset="1" stopColor="#E2C285"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className={`font-serif text-lg font-semibold tracking-widest uppercase ${textColor} transition-colors`} style={{ letterSpacing: '0.18em' }}>
          Nirmaan
        </span>
        <span className={`font-sans text-[0.5rem] font-medium tracking-[0.22em] uppercase ${subColor} mt-0.5`}>
          Aluminium House
        </span>
      </div>
    </Link>
  );
}
