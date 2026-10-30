// src/admin/pages/InvoiceHistoryTab.jsx
import { useState } from 'react';
import { Search, Eye, Trash2, History, Package } from 'lucide-react';
import { invoiceStorage } from '../services/invoiceStorage';
import { formatINR } from '../utils/formatINR';
import InvoicePreviewModal from '../components/InvoicePreviewModal';

export default function InvoiceHistoryTab() {
  const [invoices, setInvoices] = useState(() => invoiceStorage.getAllInvoices());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const loadInvoices = () => {
    setInvoices(invoiceStorage.getAllInvoices());
  };

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchTerm.toLowerCase();
    return (
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.customer?.customerName?.toLowerCase().includes(q) ||
      inv.customer?.companyName?.toLowerCase().includes(q) ||
      inv.invoiceDate?.includes(q) ||
      inv.customer?.phone?.includes(q)
    );
  });

  const handleDelete = (id, invoiceNumber) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`)) {
      invoiceStorage.deleteInvoice(id);
      loadInvoices();
    }
  };

  const handleOpenPreview = (inv) => {
    setSelectedInvoice(inv);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Search */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <History size={18} className="text-[#C9A15A]" />
            <span>Invoice History &amp; Records</span>
          </h2>
          <p className="text-xs text-neutral-500">
            {invoices.length} invoices saved in local workshop registry
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by invoice #, customer name, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A15A]/30 focus:border-[#C9A15A]"
          />
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white py-16 px-6 rounded-xl border border-neutral-200 text-center flex flex-col items-center justify-center">
          <Package size={40} className="text-neutral-300 mb-3" />
          <h3 className="text-sm font-bold text-neutral-800">No invoices found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mt-1">
            {searchTerm
              ? 'No invoices match your search term. Try searching with invoice number or client name.'
              : 'You have not created any invoices yet. Switch to the "Create Invoice" tab to generate your first invoice.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" aria-label="Invoice History">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold bg-neutral-50">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer / Site</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {inv.invoiceDate}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-900">{inv.customer?.customerName || 'Cash Client'}</p>
                      {inv.customer?.companyName && (
                        <p className="text-[11px] text-neutral-400">{inv.customer.companyName}</p>
                      )}
                      <p className="text-[10px] text-neutral-400">{inv.customer?.city || 'Anand'}, {inv.customer?.state || 'Gujarat'}</p>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 font-mono">
                      {inv.items?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {formatINR(inv.calculation?.finalPayable)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                        {inv.paymentMethod || 'UPI'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(inv)}
                          className="p-1.5 text-neutral-600 hover:text-[#061411] hover:bg-neutral-100 rounded-lg transition"
                          title="View / Print Invoice"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete invoice"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
