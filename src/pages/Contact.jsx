// src/pages/Contact.jsx
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { products } from '../data/products';

export default function Contact() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', product: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim() || !/^\+?[\d\s\-]{8,}$/.test(form.phone)) errs.phone = 'Valid phone required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSent(true);
  };

  const contactInfo = [
    { Icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210', sub: 'Mon–Sat, 9:00 AM–7:00 PM' },
    { Icon: Mail, label: 'Email', value: 'info@nirmaanaluminium.com', href: 'mailto:info@nirmaanaluminium.com' },
    { Icon: MapPin, label: 'Address', value: 'Anand, Gujarat, India', sub: 'Serving Residential, Commercial & Industrial Spaces' },
    { Icon: Clock, label: 'Hours', value: 'Mon–Sat: 9:00 AM–7:00 PM' },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us – Nirmaan Aluminium House | Get a Free Quote</title>
        <meta name="description" content="Contact Nirmaan Aluminium House for a free quote. Call +91 98765 43210 or email info@nirmaanaluminium.com. Located in Anand, Gujarat." />
      </Helmet>

      {/* Page Hero */}
      <section
        className="pt-36 pb-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #061411, #0A1F1A)' }}
        aria-labelledby="contact-heading"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="eyebrow mb-4">Contact Us</p>
          <h1 id="contact-heading" className="font-serif text-5xl md:text-6xl font-semibold text-white mb-5">
            Let's Build Something <span className="gold-gradient-text">Beautiful</span>
          </h1>
          <p className="text-sm text-white/55 max-w-md mx-auto">
            Reach out to us for a free consultation and quote. Our team is ready to bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-cream py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map(({ Icon, label, value, href, sub }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 bg-white border border-[#1A1A1A]/[0.06]"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-[#C9A15A]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#C9A15A]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B6B6B] mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-[#1A1A1A] hover:text-[#C9A15A] transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-medium text-[#1A1A1A]">{value}</p>
                    )}
                    {sub && <p className="text-xs text-[#6B6B6B] mt-0.5">{sub}</p>}
                  </div>
                </motion.div>
              ))}

              {/* Map */}
              <div className="overflow-hidden border border-[#1A1A1A]/[0.06]" style={{ height: '220px' }}>
                <iframe
                  title="Nirmaan Aluminium House location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59199.20994773478!2d72.92568!3d22.55632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4b0c85abf243%3A0xdb2b521f28cad63b!2sAnand%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1698670000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-[#C9A15A]/10 flex items-center justify-center mb-6">
                    <CheckCircle size={36} className="text-[#C9A15A]" />
                  </div>
                  <h2 className="font-serif text-3xl text-[#1A1A1A] mb-3">Message Sent!</h2>
                  <p className="text-sm text-[#6B6B6B] max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', product: '', message: '' }); }}
                    className="mt-8 btn-outline-gold"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-label="Contact form">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full border px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A15A] transition-colors bg-white ${errors.name ? 'border-red-400' : 'border-[#1A1A1A]/15'}`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    {/* Phone */}
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full border px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A15A] transition-colors bg-white ${errors.phone ? 'border-red-400' : 'border-[#1A1A1A]/15'}`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full border px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A15A] transition-colors bg-white ${errors.email ? 'border-red-400' : 'border-[#1A1A1A]/15'}`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Product */}
                  <div>
                    <label htmlFor="contact-product" className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                      Product of Interest
                    </label>
                    <select
                      id="contact-product"
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      className="w-full border border-[#1A1A1A]/15 px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A15A] transition-colors bg-white"
                    >
                      <option value="">Select a product...</option>
                      {products.map((p) => (
                        <option key={p.slug} value={p.slug}>{p.name}</option>
                      ))}
                      <option value="other">Other / Multiple Products</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-[#6B6B6B] mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      className={`w-full border px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#C9A15A] transition-colors resize-none bg-white ${errors.message ? 'border-red-400' : 'border-[#1A1A1A]/15'}`}
                      placeholder="Tell us about your project — size, location, preferred design..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button type="submit" className="btn-gold w-full sm:w-auto" id="contact-submit-btn">
                    Send Message <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
