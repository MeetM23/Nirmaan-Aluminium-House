// src/admin/components/CustomerDetailsCard.jsx
import { User, MapPin } from 'lucide-react';
import { INDIAN_STATES } from '../config/companyConfig';

export default function CustomerDetailsCard({
  customer,
  sameAsBilling,
  onUpdateCustomer,
  onToggleSameAsBilling,
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
      <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
            <User size={18} className="text-[#C9A15A]" />
            <span>Customer &amp; Site Installation Details</span>
          </h3>
          <p className="text-xs text-neutral-500">Billing details and site delivery address</p>
        </div>
      </div>

      {/* Basic Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Customer / Contact Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh Patel"
            value={customer.customerName || ''}
            onChange={(e) => onUpdateCustomer('customerName', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Company / Firm Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Patel Builders &amp; Architects"
            value={customer.companyName || ''}
            onChange={(e) => onUpdateCustomer('companyName', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={customer.phone || ''}
            onChange={(e) => onUpdateCustomer('phone', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="client@example.com"
            value={customer.email || ''}
            onChange={(e) => onUpdateCustomer('email', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Customer GSTIN (Optional)
          </label>
          <input
            type="text"
            placeholder="24ABCDE1234F1Z5"
            value={customer.gstin || ''}
            onChange={(e) => onUpdateCustomer('gstin', e.target.value.toUpperCase())}
            className="w-full text-xs font-mono p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            State
          </label>
          <select
            value={customer.state || 'Gujarat'}
            onChange={(e) => onUpdateCustomer('state', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st.name} value={st.name}>{st.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="e.g. Anand"
            value={customer.city || ''}
            onChange={(e) => onUpdateCustomer('city', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            placeholder="388001"
            value={customer.pincode || ''}
            onChange={(e) => onUpdateCustomer('pincode', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Billing Address */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-[#C9A15A]" />
            <span>Billing Address *</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Full billing address (Plot/Flat, Society/Road, Landmark)..."
            value={customer.billingAddress || ''}
            onChange={(e) => onUpdateCustomer('billingAddress', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A] resize-none"
          />
        </div>

        {/* Shipping / Site Address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
              <MapPin size={12} className="text-neutral-400" />
              <span>Site / Shipping Address</span>
            </label>
            <label className="flex items-center gap-1 text-[11px] text-[#885500] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={onToggleSameAsBilling}
                className="rounded text-[#C9A15A] focus:ring-[#C9A15A]"
              />
              <span>Same as Billing</span>
            </label>
          </div>
          <textarea
            rows={3}
            disabled={sameAsBilling}
            placeholder="Site installation address..."
            value={sameAsBilling ? customer.billingAddress : (customer.shippingAddress || '')}
            onChange={(e) => onUpdateCustomer('shippingAddress', e.target.value)}
            className={`w-full text-xs p-2 border rounded-lg focus:outline-none resize-none ${
              sameAsBilling
                ? 'bg-neutral-100 text-neutral-500 border-neutral-200 cursor-not-allowed'
                : 'bg-white border-neutral-300 focus:border-[#C9A15A]'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

