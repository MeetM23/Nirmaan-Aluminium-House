// src/components/Logo.jsx
import { Link } from 'react-router-dom';

/**
 * Reusable Nirmaan Logo Component with background-aware variant switching.
 *
 * Variants:
 * - 'light': White/silver text for dark backgrounds (Hero, Footer, dark sections).
 * - 'dark':  Dark charcoal/black text for light backgrounds (Sticky navbar, off-white/white pages, mobile menu).
 *
 * Supports:
 * - variant="light" | "dark"  (explicit variant selection)
 * - theme="dark" | "light"    (background theme: 'dark' bg -> light logo, 'light' bg -> dark logo)
 * - dark={true | false}       (convenience prop: true = dark bg -> light logo)
 */
export default function Logo({
  variant,
  theme,
  dark,
  className = '',
  imgClassName = '',
  asLink = true,
  alt = 'Nirmaan Aluminium House',
  priority = true,
  crossfade = true,
}) {
  // Determine effective logo variant: 'light' (white lettering) or 'dark' (charcoal lettering)
  let effectiveVariant = 'dark'; // Safe default for light backgrounds

  if (variant === 'light' || variant === 'dark') {
    effectiveVariant = variant;
  } else if (theme === 'dark') {
    effectiveVariant = 'light';
  } else if (theme === 'light') {
    effectiveVariant = 'dark';
  } else if (typeof dark === 'boolean') {
    // dark={true} indicates a dark background (e.g. hero overlay, dark footer)
    effectiveVariant = dark ? 'light' : 'dark';
  }

  const isLight = effectiveVariant === 'light';

  // Responsive sizing matches existing header & footer balance without layout shift
  const defaultImgClasses = 'h-9 sm:h-11 md:h-12 w-auto max-w-[210px] sm:max-w-[260px] md:max-w-none object-contain';

  const logoContent = crossfade ? (
    <span className={`relative inline-flex items-center ${imgClassName}`}>
      {/* Dark Logo: Dark charcoal/black lettering for light backgrounds */}
      <img
        src="/images/logo-dark.png"
        alt={!isLight ? alt : ''}
        aria-hidden={isLight}
        width={1229}
        height={200}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${defaultImgClasses} transition-opacity duration-200 ease-in-out ${
          isLight ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
      {/* Light Logo: White/light silver lettering for dark backgrounds */}
      <img
        src="/images/logo-light.png"
        alt={isLight ? alt : ''}
        aria-hidden={!isLight}
        width={1229}
        height={200}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${defaultImgClasses} transition-opacity duration-200 ease-in-out absolute inset-0 h-full w-full ${
          isLight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </span>
  ) : (
    <img
      src={isLight ? '/images/logo-light.png' : '/images/logo-dark.png'}
      alt={alt}
      width={1229}
      height={200}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`${defaultImgClasses} ${imgClassName}`}
    />
  );

  if (!asLink) {
    return <div className={`inline-flex items-center ${className}`}>{logoContent}</div>;
  }

  return (
    <Link
      to="/"
      className={`inline-flex items-center no-underline transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A15A] rounded ${className}`}
      aria-label="Nirmaan Aluminium House - Home"
    >
      {logoContent}
    </Link>
  );
}
