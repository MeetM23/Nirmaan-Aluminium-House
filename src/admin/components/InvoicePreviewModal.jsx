// src/admin/components/InvoicePreviewModal.jsx
import { useState } from 'react';
import { X, Printer, Download, Check, Loader2, FileText, Layers } from 'lucide-react';
import InvoicePrintView from './InvoicePrintView';
import { printInvoice, downloadInvoicePDF } from '../services/pdfExport';

export default function InvoicePreviewModal({
  isOpen,
  onClose,
  invoice,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewLayout, setPreviewLayout] = useState(() => invoice?.layoutMode || 'single');

  if (!isOpen || !invoice) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const safeInvoiceNum = (invoice.invoiceNumber || 'Invoice').replace(/[/\\?%*:|"<>]/g, '-');
      await downloadInvoicePDF('modal-printable-invoice', `${safeInvoiceNum}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Could not generate PDF. Please try printing to PDF instead.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    printInvoice();
  };

  const totalItems = invoice.calculation?.items?.length || invoice.items?.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col max-h-[96vh] overflow-hidden border border-neutral-700">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-neutral-800 text-white flex flex-wrap items-center justify-between gap-3 border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-sm text-neutral-100 flex items-center gap-2">
              <span>Invoice Preview:</span>
              <span className="font-mono text-[#E2C285]">{invoice.invoiceNumber}</span>
            </h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-neutral-700 text-neutral-300 font-mono">
              {totalItems} items
            </span>
          </div>

          {/* Layout Mode Switcher in Preview */}
          <div className="flex items-center bg-neutral-900/80 p-0.5 rounded-lg border border-neutral-700 text-xs">
            <button
              type="button"
              onClick={() => setPreviewLayout('single')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition text-[11px] font-semibold ${
                previewLayout === 'single'
                  ? 'bg-[#C9A15A] text-[#061411]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText size={12} />
              <span>Single A4</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewLayout('multipage')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition text-[11px] font-semibold ${
                previewLayout === 'multipage'
                  ? 'bg-[#C9A15A] text-[#061411]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers size={12} />
              <span>Multi-page</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Action */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              title="Print directly or save as PDF"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print Invoice</span>
            </button>

            {/* Download PDF Action */}
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-[#C9A15A] hover:brightness-105 text-[#061411] text-xs font-bold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check size={14} className="text-green-900" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition ml-2"
              aria-label="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-950 flex justify-center">
          <div className="w-full max-w-[820px] shadow-2xl rounded-sm">
            <InvoicePrintView
              invoice={invoice}
              id="modal-printable-invoice"
              layoutMode={previewLayout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
