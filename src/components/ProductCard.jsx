// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/pricing';

export default function ProductCard({ product, className = '' }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Default variant
    const defaultFinish = product.variants?.finish?.[0]?.name || 'Standard';
    const defaultMaterial = product.variants?.material?.[0]?.name || 'Standard';

    addToCart({
      id: product.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variant: `${defaultFinish} • ${defaultMaterial}`,
      finish: defaultFinish,
      material: defaultMaterial,
      unit: product.unit || 'per sq ft',
      unitPrice: product.price || 1000,
      quantity: product.minQty || 1,
      image: product.image,
    });
  };

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`product-card group relative ${className}`}
    >
      <Link to={`/products/${product.slug}`} className="block no-underline">
        {/* Image Container */}
        <div className="overflow-hidden w-full relative" style={{ aspectRatio: '4/3', height: '200px' }}>
          <img
            src={product.image}
            alt={`${product.name} - Nirmaan Aluminium House`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />

          {/* Floating Action Buttons */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {/* Wishlist button */}
            <button
              onClick={handleToggleFav}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                isFavorited
                  ? 'bg-red-500 text-white'
                  : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-white'
              }`}
              title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label="Wishlist"
            >
              <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>

            {/* Quick Add to Cart button */}
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] flex items-center justify-center opacity-90 group-hover:opacity-100 hover:scale-105 transition shadow-md"
              title="Quick Add to Cart"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} />
            </button>
          </div>

          {/* Badge */}
          {product.unit && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-[#E2C285] text-[10px] uppercase font-semibold px-2 py-0.5 rounded tracking-wider">
              {product.unit}
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="block font-sans text-[0.65rem] text-[#6B6B6B] mb-0.5 tracking-wider">
              {product.number}
            </span>
            <h3 className="font-serif text-base font-semibold text-[#1A1A1A] leading-tight group-hover:text-[#C9A15A] transition-colors">
              {product.name}
            </h3>
            {product.price && (
              <p className="text-xs font-medium text-[#8F6E28] mt-1">
                From {formatINR(product.price)}
              </p>
            )}
          </div>
          <button
            className="circle-arrow-btn flex-shrink-0"
            aria-label={`View ${product.name}`}
            tabIndex={-1}
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
