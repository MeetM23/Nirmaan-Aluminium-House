// src/admin/components/InvoicePrintView.jsx
// Standalone Invoice Print View matching official #EFEBDD cream paper reference.
// Supports Single A4 Page (Default) with dynamic compact scaling, and Automatic Multi-page continuation.

import { formatNumberOnly, formatINR } from '../utils/formatINR';
import { businessProfileStorage } from '../services/businessProfileStorage';
import { companyConfig } from '../config/companyConfig';

export default function InvoicePrintView({
  invoice,
  id = 'printable-invoice-sheet',
  layoutMode: overrideLayoutMode,
}) {
  if (!invoice) return null;

  // Resolve company details from immutable invoice snapshot or current active business profile
  const company = invoice.companySnapshot || businessProfileStorage.getProfile() || companyConfig;

  const {
    invoiceNumber = 'NAH/2026-27/001',
    invoiceDate = '',
    dueDate = '',
    paymentMethod = company.defaultPaymentMethod || 'UPI',
    customer = {},
    calculation = {},
    notes = '',
    layoutMode: savedLayoutMode = 'single',
  } = invoice;

  const effectiveLayoutMode = overrideLayoutMode || savedLayoutMode || 'single';
  const allItems = calculation.items || [];
  const itemCount = allItems.length;

  // Single page dynamic spacing adjustments
  const isSinglePage = effectiveLayoutMode === 'single';
  const isCompact = isSinglePage && itemCount > 4;
  const isUltraCompact = isSinglePage && itemCount > 8;

  // For Multi-page layout mode:
  // If items > 6, paginate across pages cleanly: Page 1 holds up to 6 items, Page 2+ holds continuation & summary
  const shouldPaginate = !isSinglePage && itemCount > 6;
  const PAGE_1_CAPACITY = 6;
  const SUBSEQUENT_PAGE_CAPACITY = 10;

  const pages = [];
  if (shouldPaginate) {
    // Page 1
    pages.push({
      pageNumber: 1,
      items: allItems.slice(0, PAGE_1_CAPACITY),
      isFirst: true,
      isLast: allItems.length <= PAGE_1_CAPACITY,
    });

    let remaining = allItems.slice(PAGE_1_CAPACITY);
    let currentPageNum = 2;
    while (remaining.length > 0) {
      const slice = remaining.slice(0, SUBSEQUENT_PAGE_CAPACITY);
      remaining = remaining.slice(SUBSEQUENT_PAGE_CAPACITY);
      pages.push({
        pageNumber: currentPageNum,
        items: slice,
        isFirst: false,
        isLast: remaining.length === 0,
      });
      currentPageNum++;
    }
  } else {
    // Single consolidated page
    pages.push({
      pageNumber: 1,
      items: allItems,
      isFirst: true,
      isLast: true,
    });
  }

  const totalPages = pages.length;

  // Company address formatting
  const companyAddressLines = [
    company.addressLine1 || company.address?.line1,
    company.addressLine2 || company.address?.line2,
    `${company.city || company.address?.city || 'Anand'}, ${company.state || company.address?.state || 'Gujarat'} - ${company.pincode || company.address?.pincode || '388001'}`,
    company.country || company.address?.country || 'India',
  ].filter(Boolean);

  const bankName = company.bankName || company.payment?.bankName || 'ICICI Bank';
  const accountName = company.accountName || company.payment?.accountName || 'M/S.NIRMAAN THE ALUMINIUM HOUSE';
  const accountNumber = company.accountNumber || company.payment?.accountNumber || 'xxxxxxxx1217';
  const ifscCode = company.ifscCode || company.payment?.ifscCode || 'ICIC0000000';
  const branch = company.branch || company.payment?.branch || 'Anand Main Branch';

  const upiId = company.upiId || company.payment?.upiId || '9558419617.eazypay@icici';
  const upiPayeeName = company.upiPayeeName || company.payment?.upiPayeeName || 'M/S.NIRMAAN THE ALUMINIUM HOUSE';
  const staticQrSrc = company.qrCodeUrl || '/images/nirmaan-payment-qr.png';

  const signatoryName = company.signatoryName || company.companyName || companyConfig.name;
  const signatoryDesignation = company.signatoryDesignation || 'Authorised Signatory';

  return (
    <div id={id} className="invoice-container w-full mx-auto font-sans selection:bg-[#C9A15A]/30">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background-color: #EFEBDD !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-a4-page {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .invoice-a4-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>

      {pages.map((page) => (
        <div
          key={`invoice-page-${page.pageNumber}`}
          className="invoice-a4-page mx-auto bg-[#EFEBDD] text-[#111111] relative shadow-xl print:shadow-none print:m-0 flex flex-col justify-between"
          style={{
            width: '100%',
            maxWidth: '820px',
            minHeight: isSinglePage ? '1060px' : '1080px',
            padding: isUltraCompact
              ? '24px 36px'
              : isCompact
              ? '28px 40px'
              : '38px 46px',
            boxSizing: 'border-box',
            color: '#111111',
            marginBottom: totalPages > 1 && !page.isLast ? '24px' : '0px',
          }}
        >
          {/* ──── TOP CONTENT OF PAGE ──── */}
          <div>
            {/* Header: Full header on Page 1, Minimal repeated header on Page 2+ */}
            {page.isFirst ? (
              <>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <img
                      src={company.logoUrl || '/images/logo-horizontal-light.png'}
                      alt={company.companyName || 'Nirmaan Aluminium House'}
                      className={isUltraCompact ? 'h-9 w-auto object-contain' : 'h-11 w-auto object-contain'}
                    />
                  </div>
                  <div className="text-right">
                    <h1
                      className={`font-black tracking-widest text-[#E10600] ${
                        isUltraCompact ? 'text-2xl' : 'text-3xl'
                      }`}
                    >
                      INVOICE
                    </h1>
                    <p className="text-[10px] tracking-wider uppercase text-[#444444] font-medium mt-0.5">
                      Tax Invoice / Bill of Supply
                    </p>
                    {totalPages > 1 && (
                      <span className="text-[10px] font-mono text-[#666666] block mt-0.5">
                        Page {page.pageNumber} of {totalPages}
                      </span>
                    )}
                  </div>
                </div>

                {/* Company & Contact Info */}
                <div
                  className={`grid grid-cols-2 gap-8 text-xs leading-relaxed pt-1 ${
                    isUltraCompact ? 'pb-2' : 'pb-3'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-[#111111]">
                      {company.companyName || 'Nirmaan Aluminium House'}
                    </p>
                    {companyAddressLines.map((line, idx) => (
                      <p key={idx} className="text-[#333333] text-[11px] leading-tight">
                        {line}
                      </p>
                    ))}
                    <p className="text-[#111111] font-semibold mt-1 text-[11px]">
                      GSTIN: <span className="font-mono">{company.gstin || '24AABCN1234F1Z5'}</span>
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-[#111111]">Contact</p>
                    <p className="text-[#333333] text-[11px]">{company.website || 'nirmaanaluminium.com'}</p>
                    <p className="text-[#333333] text-[11px]">{company.primaryPhone || '+91 95584 19617'}</p>
                    <p className="text-[#333333] text-[11px]">{company.email || 'info@nirmaanaluminium.com'}</p>
                    <p className="text-[#555555] text-[11px] mt-1">
                      Place of Supply: {customer.state || 'Gujarat'} ({customer.stateCode || '24'})
                    </p>
                  </div>
                </div>

                <div className={`border-t border-[#111111]/70 ${isUltraCompact ? 'my-2' : 'my-2.5'}`} />

                {/* Invoice Meta Summary (4 Columns) */}
                <div className="grid grid-cols-4 gap-4 py-1 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#555555] block font-semibold">
                      Due Amount
                    </span>
                    <span className="font-bold text-sm text-[#111111]">
                      {formatINR(calculation.finalPayable)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#555555] block font-semibold">
                      Due Date
                    </span>
                    <span className="font-medium text-xs text-[#111111]">
                      {dueDate || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#555555] block font-semibold">
                      Invoice #
                    </span>
                    <span className="font-mono font-bold text-xs text-[#111111]">
                      {invoiceNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#555555] block font-semibold">
                      Invoice Date
                    </span>
                    <span className="font-medium text-xs text-[#111111]">
                      {invoiceDate || '—'}
                    </span>
                  </div>
                </div>

                <div className={`border-t border-[#111111]/70 ${isUltraCompact ? 'my-2' : 'my-2.5'}`} />

                {/* Invoice To & Shipped To */}
                <div className={`grid grid-cols-2 gap-8 py-1 text-xs leading-relaxed ${isUltraCompact ? 'mb-1' : 'mb-2'}`}>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">
                      Invoice To
                    </p>
                    <p className="font-bold text-sm text-[#111111]">
                      {customer.customerName || 'Cash Customer'}
                    </p>
                    {customer.companyName && (
                      <p className="font-semibold text-xs text-[#222222]">{customer.companyName}</p>
                    )}
                    <p className="text-[#333333] whitespace-pre-line text-[11px]">{customer.billingAddress || 'Anand, Gujarat'}</p>
                    <p className="text-[#333333] text-[11px]">
                      {customer.city ? `${customer.city}, ` : ''}{customer.state || 'Gujarat'} {customer.pincode ? `- ${customer.pincode}` : ''}
                    </p>
                    {customer.phone && <p className="text-[#333333] text-[11px]">Phone: {customer.phone}</p>}
                    {customer.gstin && (
                      <p className="text-[#111111] font-semibold mt-0.5 text-[11px]">
                        GSTIN: <span className="font-mono">{customer.gstin}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">
                      Shipped To (Site Location)
                    </p>
                    <p className="font-bold text-sm text-[#111111]">
                      {customer.companyName || customer.customerName || 'Site Installation'}
                    </p>
                    <p className="text-[#333333] whitespace-pre-line text-[11px]">
                      {customer.shippingAddress || customer.billingAddress || 'Same as billing address'}
                    </p>
                    <p className="text-[#333333] text-[11px]">
                      {customer.state || 'Gujarat'} {customer.pincode ? `- ${customer.pincode}` : ''}
                    </p>
                    <p className="text-[#555555] text-[11px] mt-0.5">Country: India</p>
                  </div>
                </div>

                <div className={`border-t border-[#111111]/70 ${isUltraCompact ? 'my-2' : 'my-2.5'}`} />
              </>
            ) : (
              /* Minimal Continuation Header for subsequent pages */
              <div className="border-b border-[#111111]/70 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={company.logoUrl || '/images/logo-horizontal-light.png'}
                    alt={company.companyName}
                    className="h-8 w-auto object-contain"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#111111]">{company.companyName}</span>
                    <span className="text-[#666666] ml-2">Invoice: <strong className="text-[#111111]">{invoiceNumber}</strong></span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-black text-[#E10600] tracking-wider text-sm mr-2">INVOICE (Contd.)</span>
                  <span className="font-mono text-[#555555]">Page {page.pageNumber} of {totalPages}</span>
                </div>
              </div>
            )}

            {/* Consolidated Products Table */}
            <table className="w-full text-xs text-[#111111] my-1 border-collapse" aria-label="Invoice items">
              <thead>
                <tr className="border-b border-[#111111]/70 text-[11px] font-bold">
                  <th className="py-2 pr-2 text-left w-7">#</th>
                  <th className="py-2 text-left">Desc. of Goods/Services</th>
                  <th className="py-2 px-2 text-right w-20">Qty.</th>
                  <th className="py-2 px-2 text-right w-24">Rate (₹)</th>
                  <th className="py-2 px-2 text-right w-16">Dis.</th>
                  <th className="py-2 px-2 text-right w-14">GST</th>
                  <th className="py-2 pl-2 text-right w-24">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/15">
                {page.items.map((item) => (
                  <tr key={item.srNo} className="align-top">
                    <td
                      className={`pr-2 font-mono text-[11px] text-[#555555] ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      {item.srNo}
                    </td>
                    <td
                      className={`pr-3 ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      <span className="font-semibold text-[#111111] block leading-snug">
                        {item.description}
                      </span>
                      {item.customNote && (
                        <span className="text-[10px] text-[#555555] block leading-tight mt-0.5">
                          {item.customNote}
                        </span>
                      )}
                      {item.variant && (
                        <span className="text-[10px] text-[#885500] block mt-0.5 font-medium">
                          {item.variant}
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-2 text-right whitespace-nowrap font-mono text-[11px] ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      {item.qty} <span className="text-[10px] font-sans text-[#555555]">{item.unit || 'U'}</span>
                    </td>
                    <td
                      className={`px-2 text-right font-mono text-[11px] ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      {formatNumberOnly(item.rate)}
                    </td>
                    <td
                      className={`px-2 text-right font-mono text-[11px] ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      {item.discountAmount > 0 ? formatNumberOnly(item.discountAmount) : '0'}
                    </td>
                    <td
                      className={`px-2 text-right font-mono text-[11px] ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      {item.gstRate}%
                    </td>
                    <td
                      className={`pl-2 text-right font-mono font-semibold text-[11px] ${
                        isUltraCompact ? 'py-1' : isCompact ? 'py-1.5' : 'py-2'
                      }`}
                    >
                      {formatNumberOnly(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ──── BOTTOM CONTENT OF LAST PAGE (Totals, Signatures, Static Payment QR) ──── */}
          {page.isLast && (
            <div className="pt-2">
              <div className={`border-t border-[#111111]/70 ${isUltraCompact ? 'my-2' : 'my-2.5'}`} />

              {/* Payment Method, Amount in Words & Totals Summary */}
              <div className="grid grid-cols-12 gap-6 pt-1 text-xs">
                {/* Left Column: Payment Method & Words */}
                <div className="col-span-7 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                      Payment Method
                    </p>
                    <p className="font-semibold text-sm text-[#111111] mt-0.5">
                      {paymentMethod}
                    </p>
                  </div>

                  <div className={isUltraCompact ? 'mt-2' : 'mt-3'}>
                    <p className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                      In Words
                    </p>
                    <p className="font-medium text-xs text-[#222222] italic mt-0.5 leading-relaxed">
                      {calculation.amountInWords}
                    </p>
                  </div>

                  {notes && (
                    <div className="mt-2 p-2 bg-black/[0.03] rounded border border-black/10">
                      <span className="text-[10px] uppercase font-bold text-[#555555] block">Notes:</span>
                      <p className="text-[11px] text-[#333333] leading-snug">{notes}</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Subtotal, GST Breakdown, Total */}
                <div className="col-span-5 space-y-1 text-right text-xs">
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#444444] font-medium">Sub Total:</span>
                    <span className="font-mono">{formatNumberOnly(calculation.subtotal)}</span>
                  </div>

                  {calculation.totalDiscount > 0 && (
                    <div className="flex justify-between py-0.5 text-green-800">
                      <span className="font-medium">Discount:</span>
                      <span className="font-mono">- {formatNumberOnly(calculation.totalDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-0.5">
                    <span className="text-[#444444] font-medium">Taxable Amount:</span>
                    <span className="font-mono">{formatNumberOnly(calculation.taxableAmount)}</span>
                  </div>

                  {calculation.isGujarat ? (
                    <>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#444444] font-medium">CGST (9%):</span>
                        <span className="font-mono">{formatNumberOnly(calculation.cgst)}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-[#444444] font-medium">SGST (9%):</span>
                        <span className="font-mono">{formatNumberOnly(calculation.sgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between py-0.5">
                      <span className="text-[#444444] font-medium">IGST (18%):</span>
                      <span className="font-mono">{formatNumberOnly(calculation.igst)}</span>
                    </div>
                  )}

                  {calculation.roundOff !== 0 && (
                    <div className="flex justify-between py-0.5 text-[#555555]">
                      <span>Round Off:</span>
                      <span className="font-mono">
                        {calculation.roundOff > 0 ? `+${calculation.roundOff}` : calculation.roundOff}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#111111]/60 pt-1.5 flex justify-between font-bold text-sm text-[#111111]">
                    <span>Total:</span>
                    <span className="font-mono text-base">{formatNumberOnly(calculation.finalPayable)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures Block */}
              <div
                className={`grid grid-cols-2 gap-8 text-xs ${
                  isUltraCompact ? 'pt-5 pb-2' : isCompact ? 'pt-7 pb-3' : 'pt-10 pb-4'
                }`}
              >
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                    Accepted By
                  </p>
                  <div className="mt-7 border-t border-[#111111]/40 pt-1">
                    <p className="text-[#333333] font-medium">{customer.customerName || 'Customer Signature'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                    Authorized Signature
                  </p>
                  <div className="mt-7 border-t border-[#111111]/40 pt-1">
                    <p className="text-[#111111] font-semibold">{signatoryName}</p>
                    <p className="text-[10px] text-[#555555]">{signatoryDesignation}</p>
                  </div>
                </div>
              </div>

              <div className={`border-t border-[#111111]/70 ${isUltraCompact ? 'my-2' : 'my-2.5'}`} />

              {/* Footer: Bank Details & Fixed Static "Scan to Pay" QR Code */}
              <div className="flex items-end justify-between pt-1 text-xs">
                {/* Left: Bank details */}
                <div className="space-y-1">
                  <p className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">
                    Payment Info
                  </p>
                  <div className="grid grid-cols-[70px_1fr] gap-x-2 text-[11px] leading-relaxed">
                    <span className="font-semibold text-[#444444]">Ac #:</span>
                    <span className="font-mono font-bold text-[#111111]">{accountNumber}</span>

                    <span className="font-semibold text-[#444444]">Ac Name:</span>
                    <span className="font-semibold text-[#111111]">{accountName}</span>

                    <span className="font-semibold text-[#444444]">IFSCcode:</span>
                    <span className="font-mono font-semibold text-[#111111]">{ifscCode}</span>

                    <span className="font-semibold text-[#444444]">Bank:</span>
                    <span className="text-[#333333]">{bankName}, {branch}</span>
                  </div>
                </div>

                {/* Right: Fixed Static "Scan to Pay" QR Code (No dynamic bill amount) */}
                <div className="flex flex-col items-center text-center pl-4">
                  <div className="p-1 bg-white border border-[#111111]/30 rounded shadow-xs">
                    <img
                      src={staticQrSrc}
                      alt="Scan to Pay QR Code"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#111111] tracking-wide mt-1">
                    Scan to Pay
                  </span>
                  <span className="text-[9px] font-bold text-[#333333] max-w-[140px] truncate leading-tight">
                    {upiPayeeName}
                  </span>
                  <span className="text-[9px] font-mono text-[#555555] leading-tight">
                    {upiId}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
