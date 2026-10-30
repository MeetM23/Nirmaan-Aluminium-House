// src/components/Logo.jsx
import { Link } from 'react-router-dom';

export default function Logo({ className = '', dark = false }) {
  const logoSrc = dark
    ? '/images/logo-horizontal-light.png'
    : '/images/logo-horizontal-dark.png';

  return (
    <Link
      to="/"
      className={`inline-flex items-center no-underline transition-opacity hover:opacity-95 ${className}`}
      aria-label="Nirmaan Aluminium House - Home"
    >
      <img
        src={logoSrc}
        alt="Nirmaan Aluminium House"
        className="h-9 sm:h-11 md:h-12 w-auto max-w-[210px] sm:max-w-[260px] md:max-w-none object-contain"
        loading="eager"
      />
    </Link>
  );
}
