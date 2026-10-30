// src/admin/utils/amountToWords.js
// Converts a numerical amount into Indian numbering words (Crores, Lakhs, Thousands, Rupees, Paise)

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertTwoDigits(num) {
  if (num === 0) return '';
  if (num < 20) return ONES[num];
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return `${TENS[ten]}${one > 0 ? ' ' + ONES[one] : ''}`;
}

function convertThreeDigits(num) {
  if (num === 0) return '';
  const hundred = Math.floor(num / 100);
  const rest = num % 100;
  let res = '';
  if (hundred > 0) {
    res += `${ONES[hundred]} Hundred`;
    if (rest > 0) res += ' ';
  }
  if (rest > 0) {
    res += convertTwoDigits(rest);
  }
  return res;
}

export function amountToWords(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Zero Rupees Only';
  }

  const num = Math.round(Number(amount) * 100) / 100;
  if (num === 0) return 'Zero Rupees Only';

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const rupees = Math.floor(absNum);
  const paise = Math.round((absNum - rupees) * 100);

  let words = '';

  // Indian breakdown: Crores, Lakhs, Thousands, Hundreds/Tens/Ones
  const crore = Math.floor(rupees / 10000000);
  let rem = rupees % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  const remainder = rem;

  if (crore > 0) {
    words += `${convertTwoDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    words += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    words += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (remainder > 0) {
    words += `${convertThreeDigits(remainder)} `;
  }

  words = words.trim();
  if (words === '') {
    words = 'Zero';
  }

  words += ' Rupees';

  if (paise > 0) {
    words += ` and ${convertTwoDigits(paise)} Paise`;
  }

  words += ' Only';

  return isNegative ? `Minus ${words}` : words;
}

export default amountToWords;

