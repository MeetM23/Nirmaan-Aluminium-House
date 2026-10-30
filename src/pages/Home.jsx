// src/pages/Home.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, ChevronLeft, ChevronRight,
  Gem, ShieldCheck, Building2, CheckCircle,
  Users, Clock, Star, Quote
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, projects, testimonials, whyUsPoints } from '../data/products';

// ─── Hero Slides ─────────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/hero1.jpg',
    eyebrow: 'Crafting Spaces. Building Trust.',
    heading: ['Premium Aluminium &', 'Stainless Steel'],
    highlight: 'Solutions',
    sub: 'Modern designs. Superior quality. Lasting durability. Nirmaan Aluminium House brings elegance and strength to every space.',
  },
  {
    id: 2,
    image: '/images/hero/hero2.jpg',
    eyebrow: 'Precision Fabrication. Luxury Finish.',
    heading: ['Expert Steel &', 'Aluminium'],
    highlight: 'Fabrication',
    sub: 'From bespoke railings to sliding gates, our craftsmen deliver perfection on every project across Gujarat.',
  },
  {
    id: 3,
    image: '/images/hero/hero3.jpg',
    eyebrow: 'Strength in Every Detail.',
    heading: ['Elevate Your', 'Space with'],
    highlight: 'Premium Metal',
    sub: 'Discover Nirmaan\'s wide range of aluminium and stainless steel solutions designed for homes, offices and industrial spaces.',
  },
];

const heroFeatures = [
  { icon: Gem, label: 'Premium Quality' },
  { icon: ShieldCheck, label: 'Durable & Low Maintenance' },
  { icon: Building2, label: 'Modern Designs' },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [current, setCurrent] = useState(0);


  const goTo = useCallback((idx) => {

    setCurrent(idx);
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {

      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #061411 0%, #0A1F1A 100%)' }}
      aria-label="Hero section"
    >
      {/* Background image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="absolute right-0 top-0 h-full w-full lg:w-3/5 object-cover object-center"
            aria-hidden="true"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061411] via-[#061411]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061411]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full pt-24 pb-20">
        <div className="max-w-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Eyebrow */}
              <p className="eyebrow text-[#C9A15A] mb-5">{slide.eyebrow}</p>

              {/* Heading */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-semibold text-white leading-[1.08] mb-3">
                {slide.heading.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
                <span className="block gold-gradient-text">{slide.highlight}</span>
              </h1>

              {/* Sub */}
              <p className="mt-6 text-sm md:text-base text-white/65 leading-relaxed max-w-[440px]">
                {slide.sub}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/products" className="btn-gold" id="hero-explore-btn">
                  Explore Products <ArrowRight size={16} />
                </Link>
                <Link to="/projects" className="btn-outline-white" id="hero-projects-btn">
                  Our Projects
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Feature badges */}
          <div className="mt-14 flex flex-wrap gap-6">
            {heroFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={18} className="text-[#C9A15A]" />
                <span className="text-xs text-white/60 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`flex flex-col items-center transition-all ${
                i === current ? 'opacity-100' : 'opacity-30 hover:opacity-60'
              }`}
            >
              <span className="text-[10px] font-mono text-white/80 mb-1">
                0{i + 1}
              </span>
              <div className={`w-px transition-all duration-500 ${i === current ? 'h-8 bg-[#C9A15A]' : 'h-4 bg-white/40'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#C9A15A]' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Products Section ──────────────────────────────────────────────────────────
function ProductsSection() {
  const row1 = products.slice(0, 4);
  const row2 = products.slice(4, 7);

  return (
    <section className="section-cream py-20" id="products" aria-labelledby="products-heading">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">Our Products</p>
            <h2 id="products-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A]">
              Complete Fabrication<br />Solutions
            </h2>
          </div>
          <div className="lg:max-w-[400px] flex flex-col lg:items-end gap-4">
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              From modern homes to commercial spaces, we provide premium aluminium and stainless steel solutions designed for strength, style and lasting value.
            </p>
            <Link to="/products" className="btn-outline-gold self-start lg:self-auto" id="view-all-products-btn">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Row 1: 4 cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {row1.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>

        {/* Row 2: 3 wider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {row2.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ─────────────────────────────────────────────────────────────
function AboutSection() {
  const features = [
    { icon: Gem, title: 'Premium Materials', desc: 'Only the best for long-lasting performance.' },
    { icon: CheckCircle, title: 'Custom Solutions', desc: 'Tailored designs for every space.' },
    { icon: Users, title: 'Expert Team', desc: 'Skilled professionals with years of experience.' },
    { icon: Clock, title: 'On-Time Delivery', desc: 'Committed to quality and timelines.' },
  ];

  return (
    <section
      className="py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1F1A 0%, #061411 60%, #0A1F1A 100%)' }}
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 items-center">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-1"
          >
            <p className="eyebrow mb-4">About Nirmaan</p>
            <h2 id="about-heading" className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.1] mb-6">
              Designing Stronger Spaces for a Better Tomorrow
            </h2>
            <p className="text-sm text-white/55 leading-relaxed mb-8">
              Nirmaan Aluminium House is committed to delivering high-quality aluminium and stainless steel fabrication solutions with a perfect blend of aesthetics, functionality and durability.
            </p>
            <Link to="/about" className="btn-gold" id="about-know-more-btn">
              Know More <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Center: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="relative overflow-hidden" style={{ height: '480px' }}>
              <img
                src="/images/about/balcony.jpg"
                alt="Modern house balcony with glass railing and vertical metal fins"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061411]/40 to-transparent" />
            </div>
          </motion.div>

          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#C9A15A]/30 flex items-center justify-center flex-shrink-0 bg-[#C9A15A]/5">
                  <Icon size={18} className="text-[#C9A15A]" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-white mb-1">{title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const [idx, setIdx] = useState(0);
  const visible = 3;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(projects.length - visible, i + 1));

  return (
    <section className="section-cream py-20 overflow-hidden" id="projects" aria-labelledby="projects-heading">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow mb-3">Our Work</p>
            <h2 id="projects-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A] flex items-center gap-4">
              Recent Projects
              <span className="hidden md:block flex-1 h-px bg-[#1A1A1A]/15 max-w-[80px]" />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="circle-arrow-btn disabled:opacity-30"
              aria-label="Previous projects"
              id="projects-prev-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              disabled={idx >= projects.length - visible}
              className="circle-arrow-btn disabled:opacity-30"
              aria-label="Next projects"
              id="projects-next-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${idx * (100 / visible)}%` }}
            transition={{ type: 'spring', stiffness: 250, damping: 30 }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden group" style={{ height: '220px' }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] text-[#C9A15A] font-medium tracking-wider uppercase">{project.category}</span>
                    <p className="font-serif text-sm text-white mt-1">{project.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* View all link */}
        <div className="mt-8 flex justify-center">
          <Link to="/projects" className="btn-outline-gold" id="view-all-projects-btn">
            View All Projects <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Why Us Strip ─────────────────────────────────────────────────────────────
function WhyUsSection() {
  return (
    <section
      className="py-20"
      style={{ background: 'linear-gradient(135deg, #0A1F1A, #061411)' }}
      id="why-us"
      aria-labelledby="why-us-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Why Choose Us</p>
          <h2 id="why-us-heading" className="font-serif text-4xl md:text-5xl font-semibold text-white">
            The Nirmaan Difference
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUsPoints.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 border border-white/[0.07] hover:border-[#C9A15A]/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full border border-[#C9A15A]/30 flex items-center justify-center mb-5 group-hover:bg-[#C9A15A]/10 transition-colors">
                <span className="text-[#C9A15A] text-xs font-bold font-mono">0{i + 1}</span>
              </div>
              <h3 className="font-serif text-lg text-white mb-2">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/why-us" className="btn-outline-gold" id="why-us-learn-more-btn">
            Learn More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="section-cream py-20" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Testimonials</p>
          <h2 id="testimonials-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A]">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 border border-[#1A1A1A]/[0.06] hover:shadow-xl transition-shadow"
            >
              <Quote size={28} className="text-[#C9A15A]/40 mb-4" />
              <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A15A]/10 flex items-center justify-center">
                  <span className="font-serif text-[#C9A15A] font-semibold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{t.name}</p>
                  <p className="text-xs text-[#6B6B6B]">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="#C9A15A" className="text-[#C9A15A]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #C9A15A 0%, #E2C285 50%, #C9A15A 100%)' }}
      aria-labelledby="cta-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-[0.7rem] font-medium tracking-[0.2em] uppercase text-[#1A1A1A]/60 mb-4">
            Get Started Today
          </p>
          <h2 id="cta-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-6">
            Get a Free Quote
          </h2>
          <p className="text-sm text-[#1A1A1A]/65 mb-10 max-w-md mx-auto leading-relaxed">
            Ready to elevate your space? Contact us today for a free consultation and quote. Our expert team will design the perfect solution for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-[#1A1A1A] text-white px-8 py-3.5 text-sm font-medium flex items-center gap-2 hover:bg-[#0A1F1A] transition-colors"
              id="cta-contact-btn"
            >
              Contact Us Now <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+919876543210"
              className="border border-[#1A1A1A]/40 text-[#1A1A1A] px-8 py-3.5 text-sm font-medium flex items-center gap-2 hover:bg-[#1A1A1A]/10 transition-colors"
              id="cta-call-btn"
            >
              Call Us: +91 98765 43210
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Home Page ───────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Helmet>
        <title>Nirmaan Aluminium House – Premium Aluminium & Stainless Steel Fabrication, Anand Gujarat</title>
        <meta name="description" content="Nirmaan Aluminium House offers premium aluminium and stainless steel fabrication solutions — railings, balconies, gates, PVD work and CNC panels — crafted for residential and commercial spaces in Gujarat." />
        <meta property="og:title" content="Nirmaan Aluminium House – Crafting Spaces. Building Trust." />
      </Helmet>
      <main>
        <HeroSection />
        <ProductsSection />
        <AboutSection />
        <ProjectsSection />
        <WhyUsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
}
