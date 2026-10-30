// src/utils/pricing.js
// Single source of truth for pricing calculations across Cart, Checkout, and Invoice

import { businessConfig } from '../config/business';

/**
 * Format a number into Indian Rupee representation (e.g. ₹1,18,000 or ₹1,18,000.50)
 */
export function formatINR(amount, includeDecimals = false) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const numericAmount = Number(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  return formatted;
}

/**
 * Convert a number to Indian Words (e.g., 118000 -> "One Lakh Eighteen Thousand Rupees Only")
 * Supports Crores, Lakhs, Thousands, Hundreds, Units and Paise.
 */
export function amountInWords(num) {
  if (num === 0 || num === '0') return 'Zero Rupees Only';
  if (!num || isNaN(num)) return '';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return b[tens] + (units ? ' ' + a[units] : '');
  }

  function convertThreeDigits(n) {
    let str = '';
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    if (hundreds > 0) {
      str += a[hundreds] + ' Hundred';
      if (rest > 0) str += ' and ';
    }
    if (rest > 0) {
      str += convertTwoDigits(rest);
    }
    return str.trim();
  }

  const rounded = Math.round(Number(num) * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  let remaining = rupees;
  const parts = [];

  // Crores (1,00,00,000)
  if (remaining >= 10000000) {
    const crores = Math.floor(remaining / 10000000);
    remaining %= 10000000;
    parts.push(convertThreeDigits(crores) + ' Crore');
  }

  // Lakhs (1,00,000)
  if (remaining >= 100000) {
    const lakhs = Math.floor(remaining / 100000);
    remaining %= 100000;
    parts.push(convertThreeDigits(lakhs) + ' Lakh');
  }

  // Thousands (1,000)
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    remaining %= 1000;
    parts.push(convertThreeDigits(thousands) + ' Thousand');
  }

  // Hundreds & rest
  if (remaining > 0) {
    parts.push(convertThreeDigits(remaining));
  }

  let result = parts.filter(Boolean).join(' ');
  if (!result) result = 'Zero';
  result += ' Rupees';

  if (paise > 0) {
    result += ' and ' + convertTwoDigits(paise) + ' Paise';
  }

  return result.trim() + ' Only';
}

/**
 * Calculate pricing totals from items, discount coupon/percent, and destination state
 * Single source of truth used in Cart, Checkout, and Invoice.
 * 
 * @param {Object} params
 * @param {Array} params.items - Cart items with quantity and unitPrice
 * @param {number} [params.discountPercent=0] - Percentage discount
 * @param {string} [params.state='Gujarat'] - Customer state for GST split
 */
export function calculatePricing({ items = [], discountPercent = 0, state = 'Gujarat' }) {
  // 1. Calculate raw subtotal
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = Number(item.unitPrice || 0) * Number(item.quantity || 1);
    return sum + itemTotal;
  }, 0);

  const roundedSubtotal = Math.round(subtotal * 100) / 100;

  // 2. Discount amount
  const validDiscountPercent = Math.min(Math.max(Number(discountPercent) || 0, 0), 100);
  const discountAmount = Math.round((roundedSubtotal * (validDiscountPercent / 100)) * 100) / 100;

  // 3. Taxable amount
  const taxableAmount = Math.max(0, Math.round((roundedSubtotal - discountAmount) * 100) / 100);

  // 4. GST Calculation
  const isGujarat = (state || 'Gujarat').trim().toLowerCase() === businessConfig.homeState.toLowerCase();

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isGujarat) {
    cgst = Math.round((taxableAmount * businessConfig.tax.cgstRate) * 100) / 100;
    sgst = Math.round((taxableAmount * businessConfig.tax.sgstRate) * 100) / 100;
  } else {
    igst = Math.round((taxableAmount * businessConfig.tax.igstRate) * 100) / 100;
  }

  const gstTotal = Math.round((cgst + sgst + igst) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + gstTotal) * 100) / 100;

  return {
    subtotal: roundedSubtotal,
    discountPercent: validDiscountPercent,
    discount: discountAmount,
    taxableAmount,
    isGujarat,
    cgstRate: isGujarat ? businessConfig.tax.cgstRate * 100 : 0,
    sgstRate: isGujarat ? businessConfig.tax.sgstRate * 100 : 0,
    igstRate: !isGujarat ? businessConfig.tax.igstRate * 100 : 0,
    cgst,
    sgst,
    igst,
    gstTotal,
    grandTotal,
    amountInWords: amountInWords(grandTotal),
  };
}
