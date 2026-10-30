// src/components/Invoice.jsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { businessConfig } from '../config/business';
import { formatINR } from '../utils/pricing';

/**
 * Format date like "21 Sep, 2024"
 */
function formatInvoiceDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function Invoice({ order }) {
  if (!order) return null;

  const { pricing, billingAddress, shippingAddress, items = [] } = order;
  const isGujarat = pricing?.isGujarat !== false;

  // Build UPI URI for QR Code with exact pre-filled amount and invoice number
  const upiUrl = `upi://pay?pa=${businessConfig.upi.upiId}&pn=${encodeURIComponent(
    businessConfig.upi.payeeName
  )}&am=${pricing?.grandTotal || 0}&cu=INR&tn=${encodeURIComponent(order.invoiceNumber)}`;

  return (
    <div
      id="nirmaan-invoice-sheet"
      className="nirmaan-invoice-sheet mx-auto bg-[#EFEBDD] text-[#111111] font-sans shadow-2xl relative"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 18mm',
        boxSizing: 'border-box',
        backgroundColor: '#EFEBDD',
        color: '#111111',
      }}
    >
      {/* ── HEADER ── */}
      <div className="flex justify-between items-start pb-4 border-b border-[#111111]">
        {/* Left: Brand Monogram + Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border-2 border-[#111111] flex items-center justify-center font-serif text-2xl font-bold tracking-tight text-[#111111]">
            N
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider uppercase text-[#111111] leading-tight">
              NIRMAAN
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#333333] font-semibold">
              Aluminium House
            </p>
          </div>
        </div>

        {/* Right: Bold Red INVOICE Tag */}
        <div className="text-right">
          <span className="font-sans font-black text-3xl tracking-tight text-[#E10600] uppercase block">
            INVOICE
          </span>
          <span className="text-[10px] text-[#333333] uppercase tracking-widest font-semibold">
            Tax Invoice / Bill of Supply
          </span>
        </div>
      </div>

      {/* ── SECTION 1: BUSINESS & CONTACT INFO (2 Columns) ── */}
      <div className="grid grid-cols-2 gap-8 py-3.5 border-b border-[#111111] text-[11px] leading-snug">
        <div>
          <p className="font-bold text-xs text-[#111111] mb-0.5">{businessConfig.name}</p>
          <p className="text-[#222222]">{businessConfig.address.line1}</p>
          <p className="text-[#222222]">{businessConfig.address.line2}</p>
          <p className="text-[#222222]">
            {businessConfig.address.city}, {businessConfig.address.state} - {businessConfig.address.pincode}, India
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xs text-[#111111] mb-0.5">Contact</p>
          <p className="text-[#222222]">Website: {businessConfig.website}</p>
          <p className="text-[#222222]">Phone: {businessConfig.phone}</p>
          <p className="text-[#222222]">Email: {businessConfig.email}</p>
          <p className="text-[#222222] font-semibold">GSTIN: {businessConfig.gstNumber}</p>
        </div>
      </div>

      {/* ── SECTION 2: DUE AMOUNT, DUE DATE, INVOICE #, DATE (4 Columns) ── */}
      <div className="grid grid-cols-4 gap-4 py-3.5 border-b border-[#111111] text-[11px]">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#444444] block font-medium">Due Amount</span>
          <span className="font-bold text-sm text-[#111111]">
            {formatINR(pricing?.grandTotal, true)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#444444] block font-medium">Due Date</span>
          <span className="font-bold text-sm text-[#111111]">
            {formatInvoiceDate(order.dueDate || order.createdAt)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#444444] block font-medium">Invoice #</span>
          <span className="font-bold text-sm text-[#111111] font-mono">
            {order.invoiceNumber}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#444444] block font-medium">Invoice Date</span>
          <span className="font-bold text-sm text-[#111111]">
            {formatInvoiceDate(order.createdAt)}
          </span>
        </div>
      </div>

      {/* ── SECTION 3: INVOICE TO & SHIPPED TO (2 Columns) ── */}
      <div className="grid grid-cols-2 gap-8 py-3.5 border-b border-[#111111] text-[11px] leading-snug">
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-[#111111] block mb-1">
            Invoice To:
          </span>
          <p className="font-bold text-[#111111]">{billingAddress?.name}</p>
          {billingAddress?.company && <p className="font-medium text-[#222222]">{billingAddress.company}</p>}
          <p className="text-[#222222]">
            {billingAddress?.line1}
            {billingAddress?.line2 ? `, ${billingAddress.line2}` : ''}
          </p>
          <p className="text-[#222222]">
            {billingAddress?.city}, {billingAddress?.state} - {billingAddress?.pincode}
          </p>
          <p className="text-[#222222]">Phone: {billingAddress?.phone}</p>
          {billingAddress?.gstNumber && (
            <p className="text-[#111111] font-semibold mt-0.5">GSTIN: {billingAddress.gstNumber}</p>
          )}
        </div>
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-[#111111] block mb-1">
            Shipped / Installed To:
          </span>
          <p className="font-bold text-[#111111]">
            {shippingAddress?.name || billingAddress?.name}
          </p>
          {shippingAddress?.company && <p className="font-medium text-[#222222]">{shippingAddress.company}</p>}
          <p className="text-[#222222]">
            {shippingAddress?.line1 || billingAddress?.line1}
            {shippingAddress?.line2 ? `, ${shippingAddress.line2}` : ''}
          </p>
          <p className="text-[#222222]">
            {shippingAddress?.city || billingAddress?.city}, {shippingAddress?.state || billingAddress?.state} - {shippingAddress?.pincode || billingAddress?.pincode}
          </p>
          <p className="text-[#222222]">Phone: {shippingAddress?.phone || billingAddress?.phone}</p>
        </div>
      </div>

      {/* ── ITEMS TABLE ── */}
      <div className="py-2">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-[#111111] text-[10px] font-bold uppercase tracking-wider text-[#111111]">
              <th className="py-2 text-left w-7">#</th>
              <th className="py-2 text-left">Desc. of Goods / Services</th>
              <th className="py-2 text-center w-20">Qty.</th>
              <th className="py-2 text-right w-20">Rate (₹)</th>
              <th className="py-2 text-right w-14">Dis.</th>
              <th className="py-2 text-right w-14">GST</th>
              <th className="py-2 text-right w-24">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const itemTotal = Number(item.unitPrice || 0) * Number(item.quantity || 1);
              return (
                <tr key={index} className="border-b border-[#111111]/30">
                  <td className="py-2.5 text-left font-mono">{index + 1}</td>
                  <td className="py-2.5 text-left pr-2">
                    <p className="font-bold text-[#111111]">{item.name}</p>
                    <p className="text-[10px] text-[#444444] italic">
                      {item.variant || `${item.finish || ''} • ${item.material || ''}`}
                    </p>
                  </td>
                  <td className="py-2.5 text-center font-medium">
                    {item.quantity} {item.unit?.replace('per ', '') || ''}
                  </td>
                  <td className="py-2.5 text-right font-medium">
                    {Number(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 text-right text-[#444444]">
                    {pricing?.discountPercent ? `${pricing.discountPercent}%` : '0%'}
                  </td>
                  <td className="py-2.5 text-right text-[#444444]">
                    18%
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#111111]">
                    {itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── BELOW TABLE: PAYMENT METHOD + IN WORDS & TOTALS BREAKDOWN ── */}
      <div className="grid grid-cols-12 gap-6 py-3.5 border-b border-[#111111] text-[11px]">
        {/* Left (7 Cols): Payment Method & In Words */}
        <div className="col-span-7 space-y-3 pr-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#444444] font-medium block mb-0.5">
              Payment Method:
            </span>
            <span className="font-bold text-[#111111]">{order.paymentMethod || 'Bank Transfer'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#444444] font-medium block mb-0.5">
              In Words:
            </span>
            <span className="font-serif italic font-semibold text-[#111111] leading-tight block">
              {pricing?.amountInWords}
            </span>
          </div>

          <div className="pt-2 text-[10px] text-[#444444] leading-relaxed">
            <p><strong>Terms:</strong> Goods once fabricated as per site measurement cannot be returned. 1-year free maintenance on all stainless steel &amp; aluminium hardware fittings.</p>
          </div>
        </div>

        {/* Right (5 Cols): Sub Total, GST Split, Grand Total */}
        <div className="col-span-5 space-y-1.5 text-right border-l border-[#111111]/30 pl-4">
          <div className="flex justify-between py-1 border-b border-[#111111]/20">
            <span className="text-[#333333]">Sub Total:</span>
            <span className="font-semibold text-[#111111]">
              ₹ {pricing?.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {pricing?.discount > 0 && (
            <div className="flex justify-between py-1 border-b border-[#111111]/20 text-[#222222]">
              <span>Discount ({pricing.discountPercent}%):</span>
              <span className="font-semibold">
                - ₹ {pricing.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-[#111111]/20">
            <span className="text-[#333333]">Taxable Amount:</span>
            <span className="font-semibold text-[#111111]">
              ₹ {pricing?.taxableAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {isGujarat ? (
            <>
              <div className="flex justify-between py-1 border-b border-[#111111]/20 text-[#333333]">
                <span>CGST (9%):</span>
                <span className="font-medium text-[#111111]">
                  ₹ {pricing?.cgst?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#111111]/20 text-[#333333]">
                <span>SGST (9%):</span>
                <span className="font-medium text-[#111111]">
                  ₹ {pricing?.sgst?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between py-1 border-b border-[#111111]/20 text-[#333333]">
              <span>IGST (18%):</span>
              <span className="font-medium text-[#111111]">
                ₹ {pricing?.igst?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b border-[#111111] text-sm">
            <span className="font-bold text-[#111111] uppercase tracking-wide">Total:</span>
            <span className="font-bold text-base text-[#111111]">
              ₹ {pricing?.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* ── SIGNATURE ROW ── */}
      <div className="grid grid-cols-2 gap-8 py-5 border-b border-[#111111] text-[11px]">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#444444] font-medium block mb-8">
            Accepted By:
          </span>
          <div className="w-48 border-b border-[#111111]/60 mb-1" />
          <p className="font-bold text-[#111111]">{billingAddress?.name}</p>
          <p className="text-[10px] text-[#444444]">Client Signature / Authorized Stamp</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#444444] font-medium block mb-8">
            For {businessConfig.legalName || businessConfig.name}
          </span>
          <div className="w-48 border-b border-[#111111]/60 ml-auto mb-1" />
          <p className="font-bold text-[#111111]">Authorized Signatory</p>
          <p className="text-[10px] text-[#444444]">Fabrication Division • Anand, Gujarat</p>
        </div>
      </div>

      {/* ── FOOTER: PAYMENT INFO & QR CODE ── */}
      <div className="grid grid-cols-12 gap-4 pt-3.5 text-[11px] items-center">
        {/* Left: Bank Details */}
        <div className="col-span-8 space-y-1">
          <p className="font-bold text-xs text-[#111111] uppercase tracking-wider mb-1">
            Payment Info:
          </p>
          <p className="text-[#222222]">
            Ac #: <span className="font-mono font-bold text-[#111111]">{businessConfig.bankDetails.accountNumber}</span>
          </p>
          <p className="text-[#222222]">
            Ac Name: <span className="font-medium text-[#111111]">{businessConfig.bankDetails.accountName}</span>
          </p>
          <p className="text-[#222222]">
            IFSCode: <span className="font-mono font-bold text-[#111111]">{businessConfig.bankDetails.ifsc}</span>
          </p>
          <p className="text-[#222222]">
            Bank: <span className="text-[#111111]">{businessConfig.bankDetails.bankName} ({businessConfig.bankDetails.branch})</span>
          </p>
        </div>

        {/* Right: UPI QR CODE */}
        <div className="col-span-4 flex flex-col items-end text-right">
          <div className="p-1.5 bg-white border border-[#111111]/40 rounded shadow-sm inline-block mb-1">
            <QRCodeSVG value={upiUrl} size={74} level="M" />
          </div>
          <p className="text-[10px] font-semibold text-[#111111] leading-tight">
            Name: {businessConfig.upi.payeeName}
          </p>
          <p className="text-[9px] text-[#333333] font-mono leading-tight">
            UPI: {businessConfig.upi.upiId}
          </p>
        </div>
      </div>
    </div>
  );
}
