// src/admin/components/InvoiceItemsTable.jsx
import { Plus, Trash2, Package } from 'lucide-react';
import { FABRICATION_UNITS } from '../config/companyConfig';
import { formatNumberOnly } from '../utils/formatINR';

export default function InvoiceItemsTable({
  items,
  onUpdateItem,
  onRemoveItem,
  onOpenProductModal,
  onAddCustomItem,
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
            <Package size={18} className="text-[#C9A15A]" />
            <span>Invoice Items &amp; Services</span>
          </h3>
          <p className="text-xs text-neutral-500">
            Add architectural fabrication products from the catalogue or add custom service charges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddCustomItem}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus size={14} />
            <span>Add Custom Service</span>
          </button>

          <button
            type="button"
            onClick={onOpenProductModal}
            className="px-3.5 py-1.5 rounded-lg bg-[#061411] text-[#EFEBDD] hover:bg-[#0A1F1A] text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus size={14} className="text-[#C9A15A]" />
            <span>Select Product</span>
          </button>
        </div>
      </div>

      {/* Items Table */}
      {items.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-neutral-200 rounded-xl text-center flex flex-col items-center justify-center bg-neutral-50/50">
          <Package size={36} className="text-neutral-300 mb-2" />
          <p className="text-sm font-semibold text-neutral-700">No items added yet</p>
          <p className="text-xs text-neutral-400 max-w-sm mt-0.5 mb-4">
            Click "Select Product" to pick items from your architectural catalog or "Add Custom Service" for labor/transportation.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOpenProductModal}
              className="px-4 py-2 rounded-lg bg-[#C9A15A] text-[#061411] font-bold text-xs hover:brightness-105 transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" aria-label="Invoice Item Editor">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold bg-neutral-50">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3 min-w-[220px]">Item Description</th>
                <th className="py-2.5 px-2 w-28">Unit</th>
                <th className="py-2.5 px-2 w-24">Qty</th>
                <th className="py-2.5 px-2 w-28">Rate (₹)</th>
                <th className="py-2.5 px-2 w-20">GST %</th>
                <th className="py-2.5 px-2 w-24">Discount (₹)</th>
                <th className="py-2.5 px-3 w-28 text-right">Amount (₹)</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item, index) => {
                const qty = Math.max(0, Number(item.qty) || 0);
                const rate = Math.max(0, Number(item.rate) || 0);
                const gross = qty * rate;
                const disc = Math.min(gross, Math.max(0, Number(item.discountValue) || 0));
                const taxable = Math.max(0, gross - disc);
                const gstRate = Number(item.gstRate !== undefined ? item.gstRate : 18);
                const gstAmt = (taxable * gstRate) / 100;
                const rowTotal = taxable + gstAmt;

                return (
                  <tr key={item.id || index} className="hover:bg-neutral-50/60 transition">
                    <td className="py-2.5 px-3 font-mono text-neutral-400">{index + 1}</td>

                    {/* Description & Variant */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                        placeholder="Item or service name"
                        className="w-full font-semibold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-[#C9A15A] focus:outline-none py-0.5"
                      />
                      <input
                        type="text"
                        value={item.customNote || ''}
                        onChange={(e) => onUpdateItem(index, 'customNote', e.target.value)}
                        placeholder="Specifications / site dimensions (optional)"
                        className="w-full text-[11px] text-neutral-500 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-[#C9A15A] focus:outline-none py-0.5 mt-0.5"
                      />
                      {item.variant && (
                        <span className="text-[10px] text-[#885500] bg-[#C9A15A]/10 px-1.5 py-0.5 rounded inline-block mt-1">
                          {item.variant}
                        </span>
                      )}
                    </td>

                    {/* Unit */}
                    <td className="py-2.5 px-2">
                      <select
                        value={item.unit || 'Sq. Ft.'}
                        onChange={(e) => onUpdateItem(index, 'unit', e.target.value)}
                        className="w-full text-xs p-1 bg-white border border-neutral-200 rounded focus:border-[#C9A15A] focus:outline-none"
                      >
                        {FABRICATION_UNITS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </td>

                    {/* Quantity */}
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={item.qty ?? ''}
                        onChange={(e) => onUpdateItem(index, 'qty', e.target.value)}
                        className="w-full text-xs font-mono p-1 bg-white border border-neutral-200 rounded focus:border-[#C9A15A] focus:outline-none"
                      />
                    </td>

                    {/* Rate */}
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.rate ?? ''}
                        onChange={(e) => onUpdateItem(index, 'rate', e.target.value)}
                        placeholder="0.00"
                        className="w-full text-xs font-mono font-semibold p-1 bg-white border border-neutral-200 rounded focus:border-[#C9A15A] focus:outline-none"
                      />
                    </td>

                    {/* GST % */}
                    <td className="py-2.5 px-2">
                      <select
                        value={item.gstRate ?? 18}
                        onChange={(e) => onUpdateItem(index, 'gstRate', Number(e.target.value))}
                        className="w-full text-xs font-mono p-1 bg-white border border-neutral-200 rounded focus:border-[#C9A15A] focus:outline-none"
                      >
                        <option value={18}>18%</option>
                        <option value={12}>12%</option>
                        <option value={5}>5%</option>
                        <option value={0}>0%</option>
                      </select>
                    </td>

                    {/* Discount */}
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.discountValue ?? ''}
                        onChange={(e) => onUpdateItem(index, 'discountValue', e.target.value)}
                        placeholder="0"
                        className="w-full text-xs font-mono p-1 bg-white border border-neutral-200 rounded focus:border-[#C9A15A] focus:outline-none"
                      />
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {formatNumberOnly(rowTotal)}
                    </td>

                    {/* Remove Action */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded hover:bg-red-50 transition"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

