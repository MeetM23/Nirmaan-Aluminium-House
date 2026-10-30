// src/admin/components/InvoiceDetailsCard.jsx
import { FileText, Calendar, CreditCard, MapPin } from 'lucide-react';
import { INDIAN_STATES } from '../config/companyConfig';

export default function InvoiceDetailsCard({
  formData,
  onChangeField,
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
          <FileText size={18} className="text-[#C9A15A]" />
          <span>Invoice Information</span>
        </h3>
        <p className="text-xs text-neutral-500">Numbering sequence, dates, and taxation place of supply</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        {/* Invoice Number */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Invoice Number *
          </label>
          <input
            type="text"
            required
            value={formData.invoiceNumber}
            onChange={(e) => onChangeField('invoiceNumber', e.target.value)}
            className="w-full text-xs font-mono font-bold p-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
          <span className="text-[10px] text-neutral-400 mt-1 block">Auto-generated serial sequence</span>
        </div>

        {/* Invoice Date */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <Calendar size={12} className="text-neutral-400" />
            <span>Invoice Date *</span>
          </label>
          <input
            type="date"
            required
            value={formData.invoiceDate}
            onChange={(e) => onChangeField('invoiceDate', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <Calendar size={12} className="text-neutral-400" />
            <span>Due Date *</span>
          </label>
          <input
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => onChangeField('dueDate', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          />
        </div>

        {/* Place of Supply */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-neutral-400" />
            <span>Place of Supply (GST State) *</span>
          </label>
          <select
            value={formData.placeOfSupply}
            onChange={(e) => onChangeField('placeOfSupply', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st.name} value={st.name}>
                {st.name} ({st.code})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-neutral-400 mt-1 block">
            {formData.placeOfSupply === 'Gujarat'
              ? 'Intra-state: CGST 9% + SGST 9%'
              : 'Inter-state: IGST 18%'}
          </span>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
            <CreditCard size={12} className="text-neutral-400" />
            <span>Payment Method *</span>
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => onChangeField('paymentMethod', e.target.value)}
            className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
          >
            <option value="UPI">UPI (Dynamic QR Code)</option>
            <option value="NEFT / RTGS">NEFT / RTGS (Bank Transfer)</option>
            <option value="Cash">Cash at Site / Workshop</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        {/* Customer Type */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Customer Type
          </label>
          <div className="flex gap-4 pt-1.5">
            <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
              <input
                type="radio"
                name="customerType"
                checked={formData.customerType === 'Individual'}
                onChange={() => onChangeField('customerType', 'Individual')}
                className="text-[#C9A15A] focus:ring-[#C9A15A]"
              />
              <span>Individual / Villa</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
              <input
                type="radio"
                name="customerType"
                checked={formData.customerType === 'Business'}
                onChange={() => onChangeField('customerType', 'Business')}
                className="text-[#C9A15A] focus:ring-[#C9A15A]"
              />
              <span>Business / Firm (GST)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

