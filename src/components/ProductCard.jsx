// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, className = '' }) {
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

          {/* Unit / Specification Badge */}
          {product.unit && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-[#E2C285] text-[10px] uppercase font-semibold px-2 py-0.5 rounded tracking-wider">
              {product.unit}
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="block font-sans text-[0.65rem] text-[#6B6B6B] mb-0.5 tracking-wider font-mono">
              {product.number}
            </span>
            <h3 className="font-serif text-base font-semibold text-[#1A1A1A] leading-tight group-hover:text-[#C9A15A] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs font-medium text-[#C9A15A] mt-1">
              Custom Fabricated
            </p>
          </div>
          <div
            className="circle-arrow-btn flex-shrink-0"
            aria-label={`View ${product.name}`}
          >
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
