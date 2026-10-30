// src/pages/WhyUs.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle, Users, Clock, Headphones, MapPin } from 'lucide-react';
import { whyUsPoints } from '../data/products';

const iconMap = { Award, CheckCircle, Users, Clock, Headphones, MapPin };

export default function WhyUs() {
  return (
    <>
      <Helmet>
        <title>Why Choose Us – Nirmaan Aluminium House</title>
        <meta name="description" content="Discover why Nirmaan Aluminium House is Gujarat's trusted choice for premium aluminium and stainless steel fabrication." />
      </Helmet>

      {/* Hero */}
      <section
        className="pt-36 pb-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #061411, #0A1F1A)' }}
        aria-labelledby="why-us-page-heading"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="eyebrow mb-4">Why Choose Us</p>
          <h1 id="why-us-page-heading" className="font-serif text-5xl md:text-6xl font-semibold text-white mb-5">
            The Nirmaan Difference
          </h1>
          <p className="text-sm text-white/55 max-w-lg mx-auto">
            Here's why hundreds of homeowners, builders and architects across Gujarat trust Nirmaan for their fabrication needs.
          </p>
        </div>
      </section>

      {/* Why Us Grid */}
      <section className="section-cream py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUsPoints.map(({ icon, title, desc }, i) => {
              const Icon = iconMap[icon] || CheckCircle;
              return (
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section
        className="py-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #C9A15A, #E2C285)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Projects Completed' },
              { num: '10+', label: 'Years Experience' },
              { num: '50+', label: 'Product Variants' },
              { num: '100%', label: 'Client Satisfaction' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-serif text-5xl font-semibold text-[#1A1A1A] mb-2">{num}</div>
                <div className="text-sm text-[#1A1A1A]/65 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #0A1F1A, #061411)' }}
      >
        <div className="max-w-[600px] mx-auto text-center">
          <p className="eyebrow mb-4">Ready to Start?</p>
          <h2 className="font-serif text-4xl text-white mb-5">Let's Build Something Together</h2>
          <p className="text-sm text-white/55 mb-8">Contact us today for a free consultation and experience the Nirmaan difference firsthand.</p>
          <Link to="/contact" className="btn-gold" id="why-us-cta-btn">
            Get a Free Quote <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
