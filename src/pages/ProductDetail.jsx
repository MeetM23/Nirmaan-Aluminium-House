// src/pages/ProductDetail.jsx
import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, ChevronLeft, ChevronRight, X,
  Maximize2, ShieldCheck, Gem, Sparkles, Settings, Download,
  ShoppingBag, Heart, Plus, Minus, Check, Info
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/pricing';

// Icon map
const iconMap = { ShieldCheck, Gem, Sparkles, Settings };

// ─── Quote Modal ─────────────────────────────────────────────────────────────
function QuoteModal({ product, onClose, selectedVariant, currentPrice, quantity }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-md p-8 relative rounded-xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          aria-label="Close quote modal"
        >
          <X size={20} />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#0A1F1A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#C9A15A]" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-2">
              Quote Request Sent!
            </h3>
            <p className="text-sm text-[#6B6B6B] mb-6">
              Thank you! Our Anand technical team will review your specifications for{' '}
              <strong>{product.name}</strong> and contact you within 24 hours.
            </p>
            <button onClick={onClose} className="btn-gold w-full justify-center">
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-1">Fabrication Consultation</p>
            <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-1">
              Request a Custom Quote
            </h3>
            <p className="text-xs text-[#6B6B6B] mb-4">
              {product.name} • {selectedVariant} ({quantity} {product.unit?.replace('per ', '')})
            </p>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#1A1A1A]/20 focus:border-[#C9A15A] focus:outline-none rounded"
                  placeholder="e.g. Ramesh Shah"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#1A1A1A]/20 focus:border-[#C9A15A] focus:outline-none rounded"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#1A1A1A]/20 focus:border-[#C9A15A] focus:outline-none rounded"
                  placeholder="ramesh@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Site Location & Requirements</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#1A1A1A]/20 focus:border-[#C9A15A] focus:outline-none rounded resize-none"
                  placeholder="e.g. 40ft balcony in Anand, site ready for survey next Tuesday..."
                />
              </div>
              <button type="submit" className="btn-gold w-full justify-center" id="modal-submit-btn">
                Send Request <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────
export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const related = getRelatedProducts(slug, 4);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [mainImg, setMainImg] = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Variant selection states
  const finishes = product?.variants?.finish || [{ name: 'Standard', priceMultiplier: 1.0 }];
  const materials = product?.variants?.material || [{ name: 'Standard', priceMultiplier: 1.0 }];

  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [quantity, setQuantity] = useState(product?.minQty || 1);

  if (!product) return <Navigate to="/products" replace />;

  const isFavorited = isInWishlist(product.id);

  // Calculate live unit price based on multipliers
  const basePrice = product.price || 1000;
  const finishMultiplier = selectedFinish?.priceMultiplier || 1.0;
  const materialMultiplier = selectedMaterial?.priceMultiplier || 1.0;
  const liveUnitPrice = Math.round(basePrice * finishMultiplier * materialMultiplier);
  const liveTotal = liveUnitPrice * quantity;

  const allImages = [product.image, ...product.gallery.map((g) => g.image)];

  const prevMain = () => setMainImg((i) => (i > 0 ? i - 1 : allImages.length - 1));
  const nextMain = () => setMainImg((i) => (i < allImages.length - 1 ? i + 1 : 0));

  const galleryVisible = 4;
  const prevGallery = () => setGalleryIdx((i) => Math.max(0, i - 1));
  const nextGallery = () => setGalleryIdx((i) => Math.min(product.gallery.length - galleryVisible, i + 1));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variant: `${selectedFinish.name} • ${selectedMaterial.name}`,
      finish: selectedFinish.name,
      material: selectedMaterial.name,
      unit: product.unit || 'per sq ft',
      unitPrice: liveUnitPrice,
      quantity,
      image: product.image,
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.name} – Nirmaan Aluminium House</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* ===== Product Hero ===== */}
      <section
        className="pt-28 pb-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(180deg, #F5F0E6 0%, #EDE8DC 100%)' }}
        aria-labelledby="product-name-heading"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Image Viewer */}
            <div>
              {/* Main image */}
              <div className="relative overflow-hidden bg-[#1A1A1A]/5 mb-4 group rounded-xl shadow-md" style={{ height: '380px' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainImg}
                    src={allImages[mainImg]}
                    alt={`${product.name} view ${mainImg + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Floating Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md z-10 ${
                    isFavorited
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-[#1A1A1A] hover:bg-white hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMain}
                  className="circle-arrow-btn flex-shrink-0 w-8 h-8"
                  aria-label="Previous image"
                  id="prev-thumbnail-btn"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none flex-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(i)}
                      className={`relative flex-shrink-0 w-16 h-16 overflow-hidden border-2 rounded transition-all ${
                        mainImg === i ? 'border-[#C9A15A] scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                      }`}
                      aria-label={`Select image ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextMain}
                  className="circle-arrow-btn flex-shrink-0 w-8 h-8"
                  aria-label="Next image"
                  id="next-thumbnail-btn"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Right: Details & E-Commerce Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="eyebrow">Product Fabrication</p>
                <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 bg-[#C9A15A]/15 text-[#8F6E28] rounded">
                  {product.number}
                </span>
              </div>
              <h1 id="product-name-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A1A] mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Pricing Display */}
              <div className="p-4 bg-white/80 backdrop-blur-sm border border-[#1A1A1A]/10 rounded-xl mb-6 shadow-sm">
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <span className="text-xs text-[#6B6B6B] block">Rate per unit:</span>
                    <span className="font-serif text-2xl font-bold text-[#1A1A1A]">
                      {formatINR(liveUnitPrice)}
                    </span>
                    <span className="text-xs text-[#6B6B6B] ml-1.5 font-sans">
                      / {product.unit?.replace('per ', '') || 'unit'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#6B6B6B] block">Estimated Total:</span>
                    <span className="font-serif text-xl font-bold text-[#8F6E28]">
                      {formatINR(liveTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#8F6E28] mt-2 pt-2 border-t border-[#1A1A1A]/5">
                  <Info size={12} className="shrink-0" />
                  <span>{product.priceNote || 'Final price may vary after site measurement.'}</span>
                </div>
              </div>

              {/* Variant Selectors: Finish */}
              {finishes.length > 1 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                    Select Finish: <span className="text-[#8F6E28] normal-case">{selectedFinish.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {finishes.map((f) => {
                      const isSelected = selectedFinish.name === f.name;
                      return (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => setSelectedFinish(f)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                            isSelected
                              ? 'bg-[#0A1F1A] text-[#EFEBDD] border-[#0A1F1A] shadow'
                              : 'bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/15 hover:border-[#C9A15A]'
                          }`}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variant Selectors: Material */}
              {materials.length > 1 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                    Select Material Grade: <span className="text-[#8F6E28] normal-case">{selectedMaterial.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m) => {
                      const isSelected = selectedMaterial.name === m.name;
                      return (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => setSelectedMaterial(m)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                            isSelected
                              ? 'bg-[#0A1F1A] text-[#EFEBDD] border-[#0A1F1A] shadow'
                              : 'bg-white/60 text-[#1A1A1A] border-[#1A1A1A]/15 hover:border-[#C9A15A]'
                          }`}
                        >
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mb-8 flex items-center gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Quantity ({product.unit?.replace('per ', '') || 'unit'})
                  </label>
                  <div className="flex items-center border border-[#1A1A1A]/20 rounded-lg bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(product.minQty || 1, q - 1))}
                      className="px-3 py-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={product.minQty || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minQty || 1, parseInt(e.target.value) || (product.minQty || 1)))}
                      className="w-16 text-center font-semibold text-sm py-1.5 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-[#6B6B6B] pt-5">
                  Min order: {product.minQty || 1} {product.unit?.replace('per ', '')}
                </div>
              </div>

              {/* Action buttons: Add to Cart & Get a Quote */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="btn-gold shadow-lg flex items-center gap-2 px-6 py-3"
                  id="add-to-cart-btn"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart ({formatINR(liveTotal)})</span>
                </button>

                <button
                  onClick={() => setQuoteOpen(true)}
                  className="btn-outline-gold px-5 py-3"
                  id="get-quote-btn"
                >
                  Get a Quote <ArrowRight size={16} />
                </button>
              </div>

              {/* Feature icons */}
              <div className="grid grid-cols-4 gap-3 mb-8 pt-4 border-t border-[#1A1A1A]/10">
                {product.features.map(({ icon, label }) => {
                  const Icon = iconMap[icon] || ShieldCheck;
                  return (
                    <div key={label} className="flex flex-col items-center text-center gap-2">
                      <div className="w-11 h-11 border border-[#1A1A1A]/10 rounded-lg flex items-center justify-center bg-white/40">
                        <Icon size={18} className="text-[#C9A15A]" />
                      </div>
                      <span className="text-[11px] text-[#6B6B6B] leading-tight">{label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Specs table */}
              <table className="w-full text-sm mb-4 border-t border-[#1A1A1A]/10" aria-label="Product specifications">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key} className="border-b border-[#1A1A1A]/10">
                      <td className="py-2.5 pr-4 font-medium text-[#1A1A1A] w-1/3 text-xs">{key}</td>
                      <td className="py-2.5 text-[#6B6B6B] text-xs">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Gallery Carousel Section ===== */}
      <section className="section-dark py-20 px-6 lg:px-10" aria-labelledby="gallery-heading">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[#C9A15A] mb-2">
                Project Gallery
              </p>
              <h2 id="gallery-heading" className="font-serif text-3xl md:text-4xl font-semibold text-white">
                Recent Installations
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevGallery}
                disabled={galleryIdx === 0}
                className="circle-arrow-btn disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous gallery slides"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextGallery}
                disabled={galleryIdx >= product.gallery.length - galleryVisible}
                className="circle-arrow-btn disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next gallery slides"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Gallery grid */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${galleryIdx * 25}%` }}
              transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            >
              {product.gallery.map((item, i) => (
                <div key={i} className="flex-none w-full sm:w-1/2 lg:w-1/4">
                  <div className="relative overflow-hidden group rounded-xl" style={{ height: '220px' }}>
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                      <p className="font-serif text-sm text-white">{item.caption}</p>
                      <div className="circle-arrow-btn !border-white/40 !text-white hover:!bg-[#C9A15A] hover:!border-[#C9A15A]">
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Related Products ===== */}
      <section className="section-cream py-16 px-6 lg:px-10" aria-labelledby="related-heading">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[#6B6B6B] mb-2">
                You May Also Like
              </p>
              <h2 id="related-heading" className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
                Related Products
              </h2>
            </div>
            <Link to="/products" className="btn-outline-gold" id="related-view-all-btn">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <AnimatePresence>
        {quoteOpen && (
          <QuoteModal
            product={product}
            onClose={() => setQuoteOpen(false)}
            selectedVariant={`${selectedFinish.name} • ${selectedMaterial.name}`}
            currentPrice={liveUnitPrice}
            quantity={quantity}
          />
        )}
      </AnimatePresence>
    </>
  );
}
