// src/pages/InvoicePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Printer, Download, Share2, Check } from 'lucide-react';
import orderService from '../services/orderService';
import invoiceService from '../services/invoiceService';
import Invoice from '../components/Invoice';
import toast from 'react-hot-toast';

export default function InvoicePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceContainerRef = useRef(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      } catch (err) {
        console.error('Invoice retrieval failed:', err);
        toast.error('Invoice could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const element = document.getElementById('nirmaan-invoice-sheet');
      if (!element) throw new Error('Invoice container not found.');
      await invoiceService.generateInvoicePdf(element, `${order.invoiceNumber}.pdf`);
      toast.success('Invoice PDF downloaded!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to generate PDF. You can also use the Print button to Save as PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center bg-[#061411]">
        <div className="w-12 h-12 border-3 border-[#C9A15A]/30 border-t-[#C9A15A] rounded-full animate-spin mb-4" />
        <p className="text-[#C9A15A] font-serif">Rendering official invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center bg-[#061411] text-[#EFEBDD]">
        <h2 className="font-serif text-2xl mb-4 text-white">Invoice Not Found</h2>
        <Link to="/account/orders" className="btn-gold">Back to Orders</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{order.invoiceNumber} – Invoice – Nirmaan Aluminium House</title>
      </Helmet>

      {/* Print styles injected for clean A4 printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #nirmaan-invoice-sheet, #nirmaan-invoice-sheet * {
            visibility: visible !important;
          }
          #nirmaan-invoice-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            width: 100% !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #EFEBDD !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="pt-24 pb-20 px-4 sm:px-6 bg-[#061411] min-h-screen">
        <div className="max-w-[1000px] mx-auto">
          {/* Action Toolbar (Screen Only) */}
          <div className="no-print bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-4 md:p-5 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/account/orders"
                className="p-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              >
                <ArrowLeft size={16} />
                <span>Back to Orders</span>
              </Link>
              <div>
                <span className="font-serif text-base md:text-lg font-bold text-white block">
                  {order.invoiceNumber}
                </span>
                <span className="text-[11px] text-white/50">
                  Status: <strong className="text-[#C9A15A]">{order.status}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl border border-[#C9A15A]/40 text-[#C9A15A] hover:bg-[#C9A15A]/10 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2"
                id="print-invoice-btn"
              >
                <Printer size={15} />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="btn-gold px-5 py-2.5 text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                id="download-pdf-btn"
              >
                {downloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#061411] border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Invoice Document Wrapper with Horizontal Scroll Container for Mobile */}
          <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-[#C9A15A]/30">
            <div className="min-w-[800px] flex justify-center py-2">
              <Invoice order={order} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
