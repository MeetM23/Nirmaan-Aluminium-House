// src/pages/Services.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, Ruler, Palette, Shield, Layers, Cpu } from 'lucide-react';

const services = [
  {
    icon: Ruler,
    title: 'Custom Design & Consultation',
    desc: 'Our design team works with you to create bespoke aluminium and stainless steel solutions tailored to your architectural vision and budget. We offer free site visits and consultations.',
  },
  {
    icon: Cpu,
    title: 'CNC & Laser Cutting',
    desc: 'State-of-the-art CNC and laser cutting technology enables us to create intricate jali screens, decorative panels, and geometric gate designs with millimetre precision.',
  },
  {
    icon: Palette,
    title: 'PVD Coating Services',
    desc: 'Transform ordinary stainless steel into luxury surfaces with our gold, rose-gold, black titanium and champagne PVD coatings — scratch-resistant and long-lasting.',
  },
  {
    icon: Wrench,
    title: 'Professional Installation',
    desc: 'Our skilled installation team handles everything from site preparation to final anchoring and finishing — ensuring a flawless result every time.',
  },
  {
    icon: Shield,
    title: 'Waterproofing & Treatment',
    desc: 'All our outdoor products undergo anti-corrosion treatment and weather-resistant coating to ensure they withstand Gujarat\'s harsh climate for decades.',
  },
  {
    icon: Layers,
    title: 'Maintenance & Repair',
    desc: 'We offer annual maintenance contracts and rapid repair services for all products we supply, ensuring your investment stays pristine for years.',
  },
];

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Services – Nirmaan Aluminium House | Fabrication & Installation</title>
        <meta name="description" content="Explore Nirmaan's complete range of services including custom design, CNC cutting, PVD coating, professional installation and maintenance." />
      </Helmet>

      <section
        className="pt-36 pb-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #061411, #0A1F1A)' }}
        aria-labelledby="services-heading"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="eyebrow mb-4">Our Services</p>
          <h1 id="services-heading" className="font-serif text-5xl md:text-6xl font-semibold text-white mb-5">
            End-to-End Fabrication Services
          </h1>
          <p className="text-sm text-white/55 max-w-lg mx-auto">
            From design consultation to installation and maintenance, we provide a complete solution for all your aluminium and stainless steel needs.
          </p>
        </div>
      </section>

      <section className="section-cream py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 bg-white border border-[#1A1A1A]/[0.06] hover:shadow-xl transition-shadow group"
              >
                <div className="w-12 h-12 bg-[#C9A15A]/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-[#C9A15A]/20 transition-colors">
                  <Icon size={22} className="text-[#C9A15A]" />
                </div>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">{title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-gold" id="services-cta-btn">
              Request a Service Quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
