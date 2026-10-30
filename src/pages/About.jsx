// src/pages/About.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, CheckCircle, Users, Clock, Award, Target } from 'lucide-react';

const milestones = [
  { year: '2014', event: 'Founded in Anand, Gujarat with a small team of 5 fabricators.' },
  { year: '2017', event: 'Expanded to serve commercial clients across Vadodara and Ahmedabad.' },
  { year: '2020', event: 'Introduced PVD coating and CNC laser-cut services.' },
  { year: '2022', event: 'Completed 500+ residential and commercial projects across Gujarat.' },
  { year: '2024', event: 'Expanded operations with a new manufacturing facility in Anand.' },
];

const values = [
  { icon: Gem, title: 'Quality First', desc: 'We never compromise on material grade or finish quality — every product meets international standards.' },
  { icon: Target, title: 'Precision Engineering', desc: 'Our CAD-designed, CNC-fabricated products ensure precise fit and finish every time.' },
  { icon: Users, title: 'Customer Focus', desc: 'We listen, design, and deliver solutions tailored to each client\'s unique vision and budget.' },
  { icon: Award, title: 'Integrity', desc: 'Transparent pricing, honest timelines and post-installation accountability define our work ethic.' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us – Nirmaan Aluminium House | Anand, Gujarat</title>
        <meta name="description" content="Learn about Nirmaan Aluminium House — 10+ years of premium aluminium and stainless steel fabrication in Anand, Gujarat." />
      </Helmet>

      {/* Hero */}
      <section
        className="pt-36 pb-20 px-6 lg:px-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061411 0%, #0A1F1A 100%)' }}
        aria-labelledby="about-page-heading"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <p className="eyebrow mb-4">About Nirmaan</p>
              <h1 id="about-page-heading" className="font-serif text-5xl md:text-6xl font-semibold text-white leading-[1.08] mb-6">
                A Decade of Crafting Premium Spaces
              </h1>
              <p className="text-sm text-white/55 leading-relaxed mb-6">
                Nirmaan Aluminium House was founded in 2014 with a singular mission — to bring world-class aluminium and stainless steel fabrication to homes and businesses across Gujarat. Over a decade, we have grown from a small workshop to a full-service fabrication company trusted by hundreds of clients.
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-8">
                Every railing, balcony, gate and decorative panel we craft reflects our commitment to precision, aesthetics and lasting durability. Based in Anand, we serve residential, commercial and industrial clients across Gujarat.
              </p>
              <Link to="/contact" className="btn-gold" id="about-contact-btn">
                Get in Touch <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative overflow-hidden" style={{ height: '420px' }}
            >
              <img
                src="/images/about/balcony.jpg"
                alt="Premium modern villa with aluminium fins and glass railing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061411]/30 to-transparent" />
              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                {[
                  { num: '500+', label: 'Projects Completed' },
                  { num: '10+', label: 'Years Experience' },
                  { num: '100%', label: 'Client Satisfaction' },
                ].map(({ num, label }) => (
                  <div key={label} className="bg-black/60 backdrop-blur-sm p-3 text-center">
                    <div className="font-serif text-xl text-[#C9A15A] font-semibold">{num}</div>
                    <div className="text-[10px] text-white/60 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-cream py-16 px-6 lg:px-10" aria-labelledby="values-heading">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Our Values</p>
            <h2 id="values-heading" className="font-serif text-4xl font-semibold text-[#1A1A1A]">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-white border border-[#1A1A1A]/[0.06] hover:shadow-lg transition-shadow"
              >
                <Icon size={24} className="text-[#C9A15A] mb-4" />
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">{title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        className="py-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #0A1F1A, #061411)' }}
        aria-labelledby="journey-heading"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Our Journey</p>
            <h2 id="journey-heading" className="font-serif text-4xl font-semibold text-white">Milestones That Define Us</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-[#C9A15A]/20" />
            <div className="space-y-8">
              {milestones.map(({ year, event }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-[60px] text-right">
                    <span className="font-mono text-[#C9A15A] text-xs font-medium">{year}</span>
                  </div>
                  {/* Dot */}
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-[#C9A15A] mt-0.5 relative z-10" />
                  <p className="text-sm text-white/60 leading-relaxed pt-0.5">{event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
