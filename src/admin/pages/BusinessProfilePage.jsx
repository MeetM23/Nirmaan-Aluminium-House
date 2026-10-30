// src/admin/pages/BusinessProfilePage.jsx
import { useState } from 'react';
import { Building2, Phone, CreditCard, Sliders, CheckCircle2, AlertCircle, Upload, RotateCcw } from 'lucide-react';
import { businessProfileStorage } from '../services/businessProfileStorage';
import { INDIAN_STATES } from '../config/companyConfig';

export default function BusinessProfilePage({ onProfileUpdated }) {
  const [profile, setProfile] = useState(() => businessProfileStorage.getProfile());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
    setErrorMsg('');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Logo image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!profile.companyName?.trim()) {
      setErrorMsg('Company Name is required.');
      return;
    }
    if (!profile.primaryPhone?.trim()) {
      setErrorMsg('Primary Phone Number is required.');
      return;
    }

    try {
      const saved = businessProfileStorage.saveProfile(profile);
      setProfile(saved);
      setSavedSuccess(true);
      if (onProfileUpdated) onProfileUpdated(saved);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save changes.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all business details back to default values?')) {
      const reset = businessProfileStorage.resetProfile();
      setProfile(reset);
      setSavedSuccess(true);
      if (onProfileUpdated) onProfileUpdated(reset);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Building2 size={18} className="text-[#C9A15A]" />
            <span>Business Profile &amp; Settings</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Single Source of Truth for company details, bank accounts, and invoice defaults.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#C9A15A] text-[#061411] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition shadow-sm flex items-center gap-1.5"
            id="save-profile-btn"
          >
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="font-semibold">Business Profile saved successfully! Future invoices will automatically use these details.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* ── SECTION 1: BUSINESS IDENTITY ── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <Building2 size={16} className="text-[#C9A15A]" />
            <span>Company Identification &amp; Address</span>
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">Appears on Invoice Header</span>
        </div>

        {/* Logo preview & upload */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200/60">
          <div className="w-40 h-14 bg-white rounded-lg border border-neutral-200 p-2 flex items-center justify-center overflow-hidden">
            <img
              src={profile.logoUrl || '/images/logo-horizontal-light.png'}
              alt="Logo Preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-700 text-xs font-semibold hover:border-[#C9A15A] cursor-pointer shadow-2xs">
              <Upload size={13} className="text-[#C9A15A]" />
              <span>Upload Custom Logo</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-[10px] text-neutral-500">
              Recommended: Horizontal PNG with transparent or light background (max 2MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Company Display Name *</label>
            <input
              type="text"
              required
              value={profile.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Legal / Registered Firm Name</label>
            <input
              type="text"
              value={profile.legalName}
              onChange={(e) => handleChange('legalName', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Business Type</label>
            <input
              type="text"
              value={profile.businessType}
              onChange={(e) => handleChange('businessType', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">GSTIN Number</label>
            <input
              type="text"
              value={profile.gstin}
              onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
              className="w-full p-2 font-mono font-semibold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">PAN Number (Optional)</label>
            <input
              type="text"
              value={profile.pan || ''}
              onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
              className="w-full p-2 font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">State / GST Code</label>
            <select
              value={profile.state}
              onChange={(e) => {
                const found = INDIAN_STATES.find((s) => s.name === e.target.value);
                handleChange('state', e.target.value);
                if (found) handleChange('stateCode', found.code);
              }}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st.name} value={st.name}>{st.name} ({st.code})</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-neutral-700 mb-1">Address Line 1</label>
            <input
              type="text"
              value={profile.addressLine1}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Address Line 2 / Landmark</label>
            <input
              type="text"
              value={profile.addressLine2}
              onChange={(e) => handleChange('addressLine2', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">PIN Code</label>
            <input
              type="text"
              value={profile.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Country</label>
            <input
              type="text"
              value={profile.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: CONTACT INFORMATION ── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <Phone size={16} className="text-[#C9A15A]" />
            <span>Contact Information</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Primary Phone *</label>
            <input
              type="tel"
              required
              value={profile.primaryPhone}
              onChange={(e) => handleChange('primaryPhone', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Alternate Phone</label>
            <input
              type="tel"
              value={profile.alternatePhone || ''}
              onChange={(e) => handleChange('alternatePhone', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Business Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Website URL</label>
            <input
              type="text"
              value={profile.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>
        </div>
      </div>

      {/* ── SECTION 3: BANKING & STATIC PAYMENT QR ── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <CreditCard size={16} className="text-[#C9A15A]" />
            <span>Banking Details &amp; Payment QR</span>
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">Appears on Invoice Bottom</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Bank Fields (Col 8) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={profile.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={profile.accountName}
                onChange={(e) => handleChange('accountName', e.target.value)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Account Number / Collection A/C</label>
              <input
                type="text"
                value={profile.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                className="w-full p-2 font-mono font-bold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={profile.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                className="w-full p-2 font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Branch Name</label>
              <input
                type="text"
                value={profile.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={profile.upiId}
                onChange={(e) => handleChange('upiId', e.target.value)}
                className="w-full p-2 font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">UPI Display Name</label>
              <input
                type="text"
                value={profile.upiPayeeName}
                onChange={(e) => handleChange('upiPayeeName', e.target.value)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
              />
            </div>
          </div>

          {/* Fixed Static QR Display (Col 4) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#EFEBDD]/50 rounded-xl border border-[#C9A15A]/30 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Fixed Merchant Payment QR
            </span>
            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-neutral-300">
              <img
                src="/images/nirmaan-payment-qr.png"
                alt="Fixed Payment Standee QR"
                className="w-24 h-24 object-contain"
              />
            </div>
            <span className="text-[11px] font-bold text-neutral-800 mt-2">
              ICICI Standee QR (Permanent)
            </span>
            <span className="text-[10px] text-neutral-500 max-w-[200px] leading-tight mt-0.5">
              Exact scannable QR embedded consistently on all printed and PDF invoices.
            </span>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: INVOICE PREFERENCES & SIGNATORY ── */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <Sliders size={16} className="text-[#C9A15A]" />
            <span>Invoice Defaults &amp; Authorisation</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Default Payment Method</label>
            <select
              value={profile.defaultPaymentMethod}
              onChange={(e) => handleChange('defaultPaymentMethod', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            >
              <option value="UPI">UPI</option>
              <option value="NEFT / RTGS">NEFT / RTGS (Bank Transfer)</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Default GST Rate</label>
            <select
              value={profile.defaultGstRate}
              onChange={(e) => handleChange('defaultGstRate', Number(e.target.value))}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            >
              <option value={18}>18% Standard Fabrication</option>
              <option value={12}>12% Construction Service</option>
              <option value={5}>5% Raw Material</option>
              <option value={0}>0% Non-GST / Exempt</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Invoice Number Prefix</label>
            <input
              type="text"
              value={profile.invoicePrefix}
              onChange={(e) => handleChange('invoicePrefix', e.target.value.toUpperCase())}
              className="w-full p-2 font-mono font-bold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Default Payment Due Days</label>
            <input
              type="number"
              min="0"
              value={profile.defaultPaymentDueDays}
              onChange={(e) => handleChange('defaultPaymentDueDays', Number(e.target.value))}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Authorized Signatory Name</label>
            <input
              type="text"
              value={profile.signatoryName}
              onChange={(e) => handleChange('signatoryName', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Signatory Designation</label>
            <input
              type="text"
              value={profile.signatoryDesignation}
              onChange={(e) => handleChange('signatoryDesignation', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block font-semibold text-neutral-700 mb-1">Default Invoice Notes / Terms</label>
            <textarea
              rows={2}
              value={profile.defaultNotes}
              onChange={(e) => handleChange('defaultNotes', e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-2 pb-8">
        <button
          type="submit"
          className="px-8 py-3 rounded-lg bg-[#C9A15A] text-[#061411] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition shadow flex items-center gap-2"
        >
          <span>Save All Profile Changes</span>
        </button>
      </div>
    </form>
  );
}

