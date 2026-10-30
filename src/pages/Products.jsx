// src/pages/Products.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Products() {
  const row1 = products.slice(0, 4);
  const row2 = products.slice(4, 7);

  return (
    <>
      <Helmet>
        <title>Products – Nirmaan Aluminium House | Aluminium & Steel Fabrication</title>
        <meta name="description" content="Explore our complete range of premium aluminium and stainless steel products including railings, balconies, gates, PVD work and CNC panels." />
      </Helmet>

      {/* Page Hero */}
      <section
        className="pt-36 pb-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #061411 0%, #0A1F1A 100%)' }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow mb-4">Our Products</p>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-5">
              Complete Fabrication Solutions
            </h1>
            <p className="text-sm text-white/55 max-w-lg mx-auto leading-relaxed">
              From modern homes to commercial spaces, we provide premium aluminium and stainless steel solutions designed for strength, style and lasting value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-cream py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {row1.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {row2.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
