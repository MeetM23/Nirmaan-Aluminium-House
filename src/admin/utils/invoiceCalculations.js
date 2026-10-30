// src/admin/utils/invoiceCalculations.js
import { amountToWords } from './amountToWords';
import { companyConfig } from '../config/companyConfig';

/**
 * Calculates item totals, taxes, and final payable amount.
 * 
 * @param {Array} items - List of invoice items
 * @param {string} placeOfSupply - State name or state code
 * @param {boolean} applyRoundOff - Whether to round off grand total to nearest integer
 * @returns {Object} Complete calculation summary
 */
export function calculateInvoice({
  items = [],
  placeOfSupply = 'Gujarat',
  applyRoundOff = true,
}) {
  const isGujarat =
    placeOfSupply.toLowerCase().includes('gujarat') ||
    placeOfSupply.includes('24');

  let subtotal = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const processedItems = items.map((item, index) => {
    const qty = Math.max(0, Number(item.qty) || 0);
    const rate = Math.max(0, Number(item.rate) || 0);
    const gross = qty * rate;

    // Discount: either percentage (e.g. 5%) or flat amount
    let discountAmount = 0;
    if (item.discountType === 'percent') {
      const pct = Math.min(100, Math.max(0, Number(item.discountValue) || 0));
      discountAmount = (gross * pct) / 100;
    } else {
      discountAmount = Math.min(gross, Math.max(0, Number(item.discountValue) || 0));
    }

    const itemTaxable = Math.max(0, gross - discountAmount);
    const gstRate = Math.max(0, Number(item.gstRate !== undefined ? item.gstRate : companyConfig.defaultGstRate));

    let itemCgst = 0;
    let itemSgst = 0;
    let itemIgst = 0;

    if (isGujarat) {
      const halfRate = gstRate / 2;
      itemCgst = (itemTaxable * halfRate) / 100;
      itemSgst = (itemTaxable * halfRate) / 100;
    } else {
      itemIgst = (itemTaxable * gstRate) / 100;
    }

    const itemTotal = itemTaxable + itemCgst + itemSgst + itemIgst;

    subtotal += gross;
    totalDiscount += discountAmount;
    taxableAmount += itemTaxable;
    totalCgst += itemCgst;
    totalSgst += itemSgst;
    totalIgst += itemIgst;

    return {
      ...item,
      srNo: index + 1,
      qty,
      rate,
      gross,
      discountAmount,
      taxableAmount: itemTaxable,
      gstRate,
      cgst: itemCgst,
      sgst: itemSgst,
      igst: itemIgst,
      total: itemTotal,
    };
  });

  const totalGst = isGujarat ? totalCgst + totalSgst : totalIgst;
  const rawGrandTotal = taxableAmount + totalGst;

  let roundOff = 0;
  let finalPayable = rawGrandTotal;

  if (applyRoundOff) {
    const rounded = Math.round(rawGrandTotal);
    roundOff = Math.round((rounded - rawGrandTotal) * 100) / 100;
    finalPayable = rounded;
  }

  const words = amountToWords(finalPayable);

  return {
    items: processedItems,
    isGujarat,
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    cgst: Math.round(totalCgst * 100) / 100,
    sgst: Math.round(totalSgst * 100) / 100,
    igst: Math.round(totalIgst * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    rawGrandTotal: Math.round(rawGrandTotal * 100) / 100,
    roundOff,
    finalPayable,
    amountInWords: words,
  };
}

/**
 * Builds standard UPI Payment URI embedding exact amount and invoice number.
 */
export function buildUpiUri({
  upiId = companyConfig.payment.upiId,
  payeeName = companyConfig.payment.upiPayeeName,
  amount = 0,
  invoiceNumber = '',
}) {
  if (!upiId) return '';
  const cleanAmount = Number(amount).toFixed(2);
  const encodedName = encodeURIComponent(payeeName);
  const note = encodeURIComponent(`Invoice ${invoiceNumber || ''}`.trim());
  return `upi://pay?pa=${upiId}&pn=${encodedName}&am=${cleanAmount}&cu=INR&tn=${note}`;
}

