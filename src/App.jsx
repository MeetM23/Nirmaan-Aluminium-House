// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import WhyUs from './pages/WhyUs';
import Services from './pages/Services';
import Contact from './pages/Contact';

// E-commerce & Checkout pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import InvoicePage from './pages/InvoicePage';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Account pages
import AccountLayout from './pages/account/AccountLayout';
import Dashboard from './pages/account/Dashboard';
import Profile from './pages/account/Profile';
import Addresses from './pages/account/Addresses';
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import Wishlist from './pages/account/Wishlist';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  // Don't show footer on invoice printable page for ultra-clean view
  const isInvoicePage = location.pathname.includes('/invoice');

  return (
    <>
      <ScrollToTop />
      {!isInvoicePage && <Navbar />}
      <CartDrawer />

      <Routes>
        {/* Core Marketing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* E-Commerce Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* Invoice Page */}
        <Route
          path="/account/orders/:orderId/invoice"
          element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Account Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
      </Routes>

      {!isInvoicePage && <Footer />}
      {!isInvoicePage && <WhatsAppButton />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#0A1F1A',
                  color: '#EFEBDD',
                  border: '1px solid rgba(201, 161, 90, 0.4)',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
            <AppLayout />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
