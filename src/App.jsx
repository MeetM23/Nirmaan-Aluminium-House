// src/App.jsx
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Public pages (lazy loaded)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const WhyUs = lazy(() => import('./pages/WhyUs'));
const Contact = lazy(() => import('./pages/Contact'));

// Standalone Internal Admin Invoice Generator (Zero auth, isolated route)
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));

// Smooth scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Lightweight route transition fallback
function PageLoader({ isAdmin = false }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isAdmin ? 'bg-[#F5F2EB]' : 'bg-[#061411]'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full border-2 animate-spin ${
          isAdmin
            ? 'border-neutral-300 border-t-neutral-800'
            : 'border-[#C9A15A]/20 border-t-[#C9A15A]'
        }`}
      />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}

      <Suspense fallback={<PageLoader isAdmin={isAdmin} />}>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/contact" element={<Contact />} />

          {/* Standalone Internal Admin Invoice Generator */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Graceful 404 redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </HelmetProvider>
  );
}
