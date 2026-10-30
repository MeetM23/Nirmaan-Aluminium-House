// src/admin/components/InvoiceSummaryCard.jsx
import { Calculator } from 'lucide-react';
import { formatNumberOnly, formatINR } from '../utils/formatINR';

export default function InvoiceSummaryCard({
  calculation,
  applyRoundOff,
  onToggleRoundOff,
  notes,
  onChangeNotes,
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
      <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
        <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
          <Calculator size={18} className="text-[#C9A15A]" />
          <span>Tax &amp; Amount Breakdown</span>
        </h3>
        <span className="text-xs text-neutral-500 font-mono">
          {calculation.isGujarat ? 'Intra-State GST (CGST + SGST)' : 'Inter-State GST (IGST)'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
        {/* Left: Notes & Words (Col 7) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Invoice Terms / Delivery Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 50% advance received, balance payable upon site completion. 5-year workmanship warranty included."
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-[#C9A15A] resize-none"
            />
          </div>

          <div className="bg-[#EFEBDD]/60 p-3.5 rounded-lg border border-[#C9A15A]/30">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
              Amount in Indian Words:
            </span>
            <p className="font-serif text-sm font-semibold text-neutral-900 leading-snug italic">
              {calculation.amountInWords}
            </p>
          </div>
        </div>

        {/* Right: Calculations (Col 5) */}
        <div className="md:col-span-5 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-2 text-right">
          <div className="flex justify-between py-1 border-b border-neutral-200/50">
            <span className="text-neutral-500 font-medium">Sub Total:</span>
            <span className="font-mono font-semibold text-neutral-800">
              {formatNumberOnly(calculation.subtotal)}
            </span>
          </div>

          {calculation.totalDiscount > 0 && (
            <div className="flex justify-between py-1 text-green-700 border-b border-neutral-200/50">
              <span className="font-medium">Total Discount:</span>
              <span className="font-mono font-semibold">
                - {formatNumberOnly(calculation.totalDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-neutral-200/50">
            <span className="text-neutral-500 font-medium">Taxable Amount:</span>
            <span className="font-mono font-semibold text-neutral-900">
              {formatNumberOnly(calculation.taxableAmount)}
            </span>
          </div>

          {calculation.isGujarat ? (
            <>
              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500 font-medium">CGST (9%):</span>
                <span className="font-mono text-neutral-800">
                  {formatNumberOnly(calculation.cgst)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500 font-medium">SGST (9%):</span>
                <span className="font-mono text-neutral-800">
                  {formatNumberOnly(calculation.sgst)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between py-1 border-b border-neutral-200/50">
              <span className="text-neutral-500 font-medium">IGST (18%):</span>
              <span className="font-mono text-neutral-800">
                {formatNumberOnly(calculation.igst)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-1 text-neutral-600">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={applyRoundOff}
                onChange={onToggleRoundOff}
                className="rounded text-[#C9A15A] focus:ring-[#C9A15A]"
              />
              <span>Round Off</span>
            </label>
            <span className="font-mono text-[11px]">
              {calculation.roundOff !== 0
                ? calculation.roundOff > 0
                  ? `+${calculation.roundOff}`
                  : calculation.roundOff
                : '0.00'}
            </span>
          </div>

          <div className="border-t-2 border-neutral-900 pt-2.5 mt-2 flex justify-between items-baseline">
            <span className="text-sm font-bold text-neutral-900">Grand Total:</span>
            <span className="font-mono text-lg font-extrabold text-[#885500]">
              {formatINR(calculation.finalPayable)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

