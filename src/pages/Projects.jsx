// src/pages/Projects.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { projects } from '../data/products';

export default function Projects() {
  return (
    <>
      <Helmet>
        <title>Projects – Nirmaan Aluminium House | Our Work Gallery</title>
        <meta name="description" content="View our portfolio of completed aluminium and stainless steel fabrication projects across Gujarat — railings, balconies, gates and more." />
      </Helmet>

      <section
        className="pt-36 pb-16 px-6 lg:px-10"
        style={{ background: 'linear-gradient(135deg, #061411, #0A1F1A)' }}
        aria-labelledby="projects-page-heading"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="eyebrow mb-4">Our Work</p>
          <h1 id="projects-page-heading" className="font-serif text-5xl md:text-6xl font-semibold text-white mb-5">
            Recent Projects
          </h1>
          <p className="text-sm text-white/55 max-w-lg mx-auto">
            A showcase of our finest aluminium and stainless steel installations across residential, commercial and industrial spaces.
          </p>
        </div>
      </section>

      <section className="section-cream py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group relative overflow-hidden cursor-pointer" style={{ height: '280px' }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[10px] text-[#C9A15A] font-medium tracking-wider uppercase">{project.category}</span>
                  <p className="font-serif text-base text-white mt-1">{project.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
