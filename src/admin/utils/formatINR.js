// src/admin/utils/formatINR.js
// Formats numbers into standard Indian Rupee notation (e.g. ₹1,18,000.00)

export function formatINR(amount, includeDecimals = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeDecimals ? '₹0.00' : '₹0';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const fixed = absNum.toFixed(2);
  const [integerPart, decimalPart] = fixed.split('.');

  // Indian numbering pattern: last 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const sign = isNegative ? '-' : '';
  if (includeDecimals) {
    return `${sign}₹${formattedInteger}.${decimalPart}`;
  }
  return `${sign}₹${formattedInteger}`;
}

export function formatNumberOnly(amount, includeDecimals = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeDecimals ? '0.00' : '0';
  }
  return formatINR(amount, includeDecimals).replace('₹', '').trim();
}

export default formatINR;

