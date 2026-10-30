// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, ArrowLeft, MapPin, CreditCard, ShieldCheck,
  Building, Phone, Mail, QrCode, AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import profileService from '../services/profileService';
import { businessConfig } from '../config/business';
import { calculatePricing, formatINR } from '../utils/pricing';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, clearCart, coupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [submitting, setSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Billing address state
  const [billingAddress, setBillingAddress] = useState({
    name: user?.name || '',
    company: user?.company || '',
    phone: user?.phone || '',
    email: user?.email || '',
    line1: '',
    line2: '',
    city: 'Anand',
    state: 'Gujarat',
    pincode: '388001',
    gstNumber: user?.gstNumber || '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    line1: '',
    line2: '',
    city: 'Anand',
    state: 'Gujarat',
    pincode: '388001',
    gstNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // Cash, UPI, Bank Transfer, Cash on Delivery
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Load saved addresses on mount
  useEffect(() => {
    async function loadAddresses() {
      if (!user) return;
      try {
        const addrs = await profileService.getAddresses(user.id);
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
        if (defaultAddr) {
          setBillingAddress({
            name: defaultAddr.name || user.name || '',
            company: defaultAddr.company || user.company || '',
            phone: defaultAddr.phone || user.phone || '',
            email: defaultAddr.email || user.email || '',
            line1: defaultAddr.line1 || '',
            line2: defaultAddr.line2 || '',
            city: defaultAddr.city || 'Anand',
            state: defaultAddr.state || 'Gujarat',
            pincode: defaultAddr.pincode || '388001',
            gstNumber: defaultAddr.gstNumber || user.gstNumber || '',
          });
        }
      } catch (e) {
        console.error('Error loading addresses:', e);
      }
    }
    loadAddresses();
  }, [user]);

  // Recalculate pricing with the exact state selected in the billing address
  const checkoutPricing = calculatePricing({
    items,
    discountPercent: coupon?.discountPercent || 0,
    state: billingAddress.state || 'Gujarat',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !submitting) {
      toast.error('Your cart is empty.');
      navigate('/cart');
    }
  }, [items, submitting, navigate]);

  // Form Validation
  const validateAddress = () => {
    const newErrors = {};

    if (!billingAddress.name.trim()) newErrors.name = 'Full name is required';

    const cleanPhone = billingAddress.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }

    if (!billingAddress.email.trim() || !/\S+@\S+\.\S+/.test(billingAddress.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!billingAddress.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!billingAddress.city.trim()) newErrors.city = 'City is required';

    const cleanPin = billingAddress.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      newErrors.pincode = 'Valid 6-digit Indian PIN code required';
    }

    if (billingAddress.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(billingAddress.gstNumber.trim().toUpperCase())) {
      newErrors.gstNumber = 'Invalid GSTIN format (e.g. 24AAACN1234F1Z5)';
    }

    if (!sameAsBilling) {
      if (!shippingAddress.name.trim()) newErrors.shipName = 'Recipient name is required';
      if (!shippingAddress.line1.trim()) newErrors.shipLine1 = 'Shipping address is required';
      if (!shippingAddress.city.trim()) newErrors.shipCity = 'Shipping city is required';
      const shipPin = shippingAddress.pincode.replace(/\D/g, '');
      if (!shipPin || shipPin.length !== 6) {
        newErrors.shipPin = 'Valid 6-digit PIN code required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateAddress()) {
        toast.error('Please resolve the errors before proceeding.');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setSubmitting(true);
      const order = await orderService.createOrder({
        userId: user?.id,
        items,
        billingAddress,
        shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
        paymentMethod,
        couponCode: coupon?.code,
        discountPercent: coupon?.discountPercent || 0,
        notes: orderNotes,
      });

      // Clear the active cart
      await clearCart();
      toast.success('Order placed successfully! Generated invoice.');
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
      setSubmitting(false);
    }
  };

  // UPI deep link for step 2 preview
  const upiDeepLink = `upi://pay?pa=${businessConfig.upi.upiId}&pn=${encodeURIComponent(businessConfig.upi.payeeName)}&am=${checkoutPricing.grandTotal}&cu=INR&tn=Fabrication%20Estimate`;

  return (
    <>
      <Helmet>
        <title>Checkout – Nirmaan Aluminium House</title>
        <meta name="description" content="Secure checkout for luxury architectural fabrication orders." />
      </Helmet>

      <div className="pt-28 pb-24 px-6 lg:px-10 min-h-screen bg-[#061411] text-[#EFEBDD]">
        <div className="max-w-[1200px] mx-auto">
          {/* Checkout Steps Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-xl mx-auto relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C9A15A] transition-all duration-300 z-0"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              />

              {[
                { num: 1, label: 'Address' },
                { num: 2, label: 'Payment' },
                { num: 3, label: 'Review & Order' },
              ].map((s) => {
                const isPassed = step > s.num;
                const isCurrent = step === s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-[#C9A15A] text-[#061411]'
                          : isCurrent
                          ? 'bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] ring-4 ring-[#C9A15A]/30 scale-110'
                          : 'bg-[#0A1F1A] border border-white/20 text-white/50'
                      }`}
                    >
                      {isPassed ? <Check size={16} strokeWidth={3} /> : s.num}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium tracking-wide ${
                        isCurrent ? 'text-[#E2C285] font-semibold' : 'text-white/50'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main Form (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 1: Address Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-white">Billing Details</h2>
                      <p className="text-xs text-white/50">Used for official GST bill & invoice generation</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#C9A15A]/15 text-[#E2C285]">
                      Step 1 of 3
                    </span>
                  </div>

                  {/* Saved Address Quick-Picker */}
                  {savedAddresses.length > 0 && (
                    <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                      <p className="text-xs font-medium text-white/70 mb-2">Select from your saved addresses:</p>
                      <div className="flex flex-wrap gap-2">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() =>
                              setBillingAddress({
                                name: addr.name,
                                company: addr.company || '',
                                phone: addr.phone,
                                email: addr.email || user?.email || '',
                                line1: addr.line1,
                                line2: addr.line2 || '',
                                city: addr.city,
                                state: addr.state,
                                pincode: addr.pincode,
                                gstNumber: addr.gstNumber || '',
                              })
                            }
                            className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#C9A15A] text-xs text-white/80 hover:text-white transition flex items-center gap-1.5 bg-[#061411]"
                          >
                            <MapPin size={12} className="text-[#C9A15A]" />
                            <span>{addr.name} ({addr.city})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Full Name / Contact Person *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.name}
                        onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white focus:outline-none ${
                          errors.name ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="e.g. Rajesh Patel"
                      />
                      {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Company / Firm Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={billingAddress.company}
                        onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                        placeholder="e.g. Patel Residency LLP"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={billingAddress.phone}
                        onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white focus:outline-none ${
                          errors.phone ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white focus:outline-none ${
                          errors.email ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="rajesh@example.com"
                      />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Address Line 1 (Street / Society / Building) *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.line1}
                        onChange={(e) => setBillingAddress({ ...billingAddress, line1: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white focus:outline-none ${
                          errors.line1 ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="e.g. Bunglow No. 14, Gokul Villa Society"
                      />
                      {errors.line1 && <p className="text-[11px] text-red-400 mt-1">{errors.line1}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Address Line 2 (Landmark / Area)
                      </label>
                      <input
                        type="text"
                        value={billingAddress.line2}
                        onChange={(e) => setBillingAddress({ ...billingAddress, line2: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                        placeholder="e.g. Near Bhaikaka Statue, Mota Bazaar"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">City *</label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white focus:outline-none ${
                          errors.city ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="Anand"
                      />
                      {errors.city && <p className="text-[11px] text-red-400 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        State (Determines GST: Gujarat = CGST+SGST, Others = IGST) *
                      </label>
                      <select
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#061411] border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                      >
                        {businessConfig.indianStates.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">PIN Code (6 digits) *</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={billingAddress.pincode}
                        onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white focus:outline-none ${
                          errors.pincode ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="388001"
                      />
                      {errors.pincode && <p className="text-[11px] text-red-400 mt-1">{errors.pincode}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        GSTIN Number (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={billingAddress.gstNumber}
                        onChange={(e) => setBillingAddress({ ...billingAddress, gstNumber: e.target.value.toUpperCase() })}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-sm text-white uppercase focus:outline-none ${
                          errors.gstNumber ? 'border-red-500' : 'border-white/15 focus:border-[#C9A15A]'
                        }`}
                        placeholder="24AAPCP5678Q1Z2"
                      />
                      {errors.gstNumber && <p className="text-[11px] text-red-400 mt-1">{errors.gstNumber}</p>}
                    </div>
                  </div>

                  {/* Shipping toggle */}
                  <div className="pt-4 border-t border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsBilling}
                        onChange={(e) => setSameAsBilling(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#C9A15A]"
                      />
                      <span className="text-sm font-medium text-white/90">
                        Shipping / Site Installation address is the same as billing address
                      </span>
                    </label>
                  </div>

                  {/* Shipped to form if different */}
                  {!sameAsBilling && (
                    <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-4">
                      <h4 className="font-serif text-lg font-semibold text-[#E2C285]">
                        Shipped To / Installation Site Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Site Contact Person *</label>
                          <input
                            type="text"
                            value={shippingAddress.name}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#061411] border border-white/15 text-sm text-white"
                            placeholder="Site Engineer or Owner"
                          />
                          {errors.shipName && <p className="text-[11px] text-red-400 mt-1">{errors.shipName}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Site Phone Number</label>
                          <input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#061411] border border-white/15 text-sm text-white"
                            placeholder="+91 98250 12345"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-white/70 mb-1">Site Address Line 1 *</label>
                          <input
                            type="text"
                            value={shippingAddress.line1}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#061411] border border-white/15 text-sm text-white"
                            placeholder="Plot / Survey No., Site Project Name"
                          />
                          {errors.shipLine1 && <p className="text-[11px] text-red-400 mt-1">{errors.shipLine1}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Site City *</label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#061411] border border-white/15 text-sm text-white"
                            placeholder="Anand / Vadodara"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Site PIN Code *</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={shippingAddress.pincode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#061411] border border-white/15 text-sm text-white"
                            placeholder="388001"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-gold px-8 py-3 flex items-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-white">Payment Method</h2>
                      <p className="text-xs text-white/50">Choose your preferred transaction option</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#C9A15A]/15 text-[#E2C285]">
                      Step 2 of 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'UPI',
                        title: 'UPI / QR Code',
                        desc: 'Scan with Google Pay, PhonePe, Paytm, or BHIM',
                        badge: 'Fastest',
                      },
                      {
                        id: 'Bank Transfer',
                        title: 'Direct Bank Transfer / NEFT / RTGS',
                        desc: 'Official company bank account payment',
                        badge: 'Recommended for High Value',
                      },
                      {
                        id: 'Cash on Delivery',
                        title: 'Cash on Delivery / Survey',
                        desc: 'Pay cash to surveyor upon site measurement',
                      },
                      {
                        id: 'Cash',
                        title: 'Cash at Anand Workshop',
                        desc: 'Pay in person at our Anand fabrication office',
                      },
                    ].map((m) => {
                      const isSelected = paymentMethod === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#061411] border-[#C9A15A] ring-2 ring-[#C9A15A]/20'
                              : 'bg-black/30 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-serif font-semibold text-white text-base">{m.title}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                                isSelected ? 'border-[#C9A15A] bg-[#C9A15A]' : 'border-white/30'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#061411]" />}
                            </div>
                          </div>
                          <p className="text-xs text-white/50 mt-2">{m.desc}</p>
                          {m.badge && (
                            <span className="self-start mt-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A15A]/15 text-[#E2C285]">
                              {m.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Details Preview based on selection */}
                  {paymentMethod === 'UPI' && (
                    <div className="p-5 rounded-xl bg-black/40 border border-[#C9A15A]/30 flex flex-col md:flex-row items-center gap-6">
                      <div className="p-3 bg-white rounded-xl shadow-lg shrink-0">
                        <QRCodeSVG value={upiDeepLink} size={130} />
                      </div>
                      <div className="space-y-1.5 text-xs text-white/80">
                        <p className="font-serif font-semibold text-sm text-[#E2C285]">
                          Instant UPI Scan &amp; Pay
                        </p>
                        <p>UPI ID: <strong className="text-white font-mono">{businessConfig.upi.upiId}</strong></p>
                        <p>Payee: <strong className="text-white">{businessConfig.upi.payeeName}</strong></p>
                        <p>Amount: <strong className="text-white font-bold">{formatINR(checkoutPricing.grandTotal)}</strong></p>
                        <p className="text-[11px] text-white/40 pt-1">
                          You can also complete payment after placing the order using the QR on your official invoice.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="p-5 rounded-xl bg-black/40 border border-[#C9A15A]/30 space-y-2 text-xs">
                      <h4 className="font-serif text-sm font-semibold text-[#E2C285]">
                        Company Beneficiary Account Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-white/80">
                        <div>Account Name: <strong className="text-white block">{businessConfig.bankDetails.accountName}</strong></div>
                        <div>Account Number: <strong className="text-white block font-mono">{businessConfig.bankDetails.accountNumber}</strong></div>
                        <div>IFSC Code: <strong className="text-white block font-mono">{businessConfig.bankDetails.ifsc}</strong></div>
                        <div>Bank &amp; Branch: <strong className="text-white block">{businessConfig.bankDetails.bankName}, {businessConfig.bankDetails.branch}</strong></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-gold px-8 py-3 flex items-center gap-2"
                    >
                      <span>Review Order</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review & Place Order */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-white">Review &amp; Place Order</h2>
                      <p className="text-xs text-white/50">Verify all items and confirm invoice generation</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#C9A15A]/15 text-[#E2C285]">
                      Step 3 of 3
                    </span>
                  </div>

                  {/* Address & Payment Summary Pills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between text-white/50 font-semibold mb-1">
                        <span>BILLING &amp; SITE ADDRESS</span>
                        <button onClick={() => setStep(1)} className="text-[#C9A15A] hover:underline">Edit</button>
                      </div>
                      <p className="font-semibold text-white">{billingAddress.name}</p>
                      {billingAddress.company && <p className="text-white/70">{billingAddress.company}</p>}
                      <p className="text-white/70">{billingAddress.line1}, {billingAddress.city}, {billingAddress.state} - {billingAddress.pincode}</p>
                      <p className="text-white/60">Phone: {billingAddress.phone}</p>
                      {billingAddress.gstNumber && <p className="text-[#E2C285]">GSTIN: {billingAddress.gstNumber}</p>}
                    </div>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between text-white/50 font-semibold mb-1">
                        <span>PAYMENT PREFERENCE</span>
                        <button onClick={() => setStep(2)} className="text-[#C9A15A] hover:underline">Edit</button>
                      </div>
                      <p className="font-semibold text-white text-sm">{paymentMethod}</p>
                      <p className="text-white/60">Official invoice generated with QR code &amp; bank transfer details.</p>
                      <p className="text-[11px] text-[#C9A15A] pt-1">Due within {businessConfig.paymentDueDays} days.</p>
                    </div>
                  </div>

                  {/* Items Review List */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-serif text-base font-semibold text-white">Order Items ({items.length})</h3>
                    {items.map((item) => (
                      <div
                        key={item.variantKey || item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-white text-sm block">{item.name}</span>
                            <span className="text-[#C9A15A]">{item.variant}</span>
                            <span className="text-white/40 ml-2">Qty: {item.quantity} {item.unit?.replace('per ', '')}</span>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-sm text-[#E2C285]">
                          {formatINR((item.unitPrice || 0) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes / Special Site Instructions */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Special Site Instructions / Fabrication Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#C9A15A] focus:outline-none resize-none"
                      placeholder="e.g. Please arrange site visit before Wednesday; gate frame height should be 8 feet..."
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handlePlaceOrder}
                      className="btn-gold px-10 py-3.5 flex items-center gap-2 shadow-xl shadow-[#C9A15A]/30 text-sm font-bold disabled:opacity-50"
                      id="place-order-btn"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#061411] border-t-transparent rounded-full animate-spin" />
                          <span>Generating Invoice...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm &amp; Place Order ({formatINR(checkoutPricing.grandTotal)})</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar Pricing Summary (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="font-serif text-lg font-semibold text-white pb-3 border-b border-white/10">
                  Total Summary
                </h3>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">{formatINR(checkoutPricing.subtotal)}</span>
                  </div>

                  {checkoutPricing.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon ({checkoutPricing.discountPercent}%)</span>
                      <span>-{formatINR(checkoutPricing.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Taxable Amount</span>
                    <span className="font-medium text-white">{formatINR(checkoutPricing.taxableAmount)}</span>
                  </div>

                  {checkoutPricing.isGujarat ? (
                    <>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>CGST (9%)</span>
                        <span>{formatINR(checkoutPricing.cgst)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>SGST (9%)</span>
                        <span>{formatINR(checkoutPricing.sgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-xs text-white/60">
                      <span>IGST (18%)</span>
                      <span>{formatINR(checkoutPricing.igst)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <span className="font-serif text-base font-semibold text-white">Grand Total</span>
                    <span className="font-serif text-2xl font-bold text-[#E2C285]">
                      {formatINR(checkoutPricing.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-white/60">
                  <span className="text-[#C9A15A] block font-semibold mb-0.5 uppercase tracking-wider">
                    In Words:
                  </span>
                  <span>{checkoutPricing.amountInWords}</span>
                </div>

                <div className="text-[11px] text-white/40 pt-2 flex items-start gap-2">
                  <ShieldCheck size={16} className="text-[#C9A15A] shrink-0 mt-0.5" />
                  <span>
                    Official GST tax invoice will be generated immediately with verifiable UPI and bank payment identifiers.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
