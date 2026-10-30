// src/admin/config/companyConfig.js
// Centralized company profile, tax defaults, and banking/UPI details for Admin Invoicing.
// Editable by the business owner.

export const companyConfig = {
  name: 'Nirmaan Aluminium House',
  legalName: 'M/S.NIRMAAN THE ALUMINIUM HOUSE',
  tagline: 'Crafting Spaces. Building Trust.',
  logoUrl: '/images/logo-horizontal-light.png',
  logoMarkUrl: '/images/logo-mark.png',
  address: {
    line1: 'Plot No. 42, GIDC Industrial Estate',
    line2: 'Near Amul Dairy Road',
    city: 'Anand',
    state: 'Gujarat',
    stateCode: '24', // Gujarat GST code
    country: 'India',
    pincode: '388001',
    full: 'Plot No. 42, GIDC Industrial Estate, Near Amul Dairy Road, Anand, Gujarat - 388001',
  },
  contact: {
    phone: '+91 95584 19617',
    alternatePhone: '+91 98765 43210',
    email: 'info@nirmaanaluminium.com',
    website: 'www.nirmaanaluminium.com',
  },
  // Placeholders clearly marked until official GST certificate details are inputted
  gstin: '24AAACN1234F1Z5 (PROVISIONAL)',
  pan: 'AAACN1234F',
  
  // Official ICICI Payment Details (From official merchant standee)
  payment: {
    bankName: 'ICICI Bank',
    accountName: 'M/S.NIRMAAN THE ALUMINIUM HOUSE',
    accountNumber: 'xxxxxxxx1217 (ICICI Collection A/C)',
    ifscCode: 'ICIC0000108',
    branch: 'Anand Main Branch, Gujarat',
    upiId: '9558419617.eazypay@icici',
    upiPayeeName: 'M/S.NIRMAAN THE ALUMINIUM HOUSE',
  },

  defaultPaymentDueDays: 7,
  defaultGstRate: 18, // 18% standard fabrication GST
  invoicePrefix: 'NAH',
};

export const INDIAN_STATES = [
  { name: 'Gujarat', code: '24' },
  { name: 'Maharashtra', code: '27' },
  { name: 'Rajasthan', code: '08' },
  { name: 'Madhya Pradesh', code: '23' },
  { name: 'Delhi', code: '07' },
  { name: 'Karnataka', code: '29' },
  { name: 'Telangana', code: '36' },
  { name: 'Tamil Nadu', code: '33' },
  { name: 'Uttar Pradesh', code: '09' },
  { name: 'Haryana', code: '06' },
  { name: 'Punjab', code: '03' },
  { name: 'Goa', code: '30' },
  { name: 'Andhra Pradesh', code: '37' },
  { name: 'West Bengal', code: '19' },
  { name: 'Kerala', code: '32' },
  { name: 'Other State / UT', code: '99' },
];

export const FABRICATION_UNITS = [
  'Sq. Ft.',
  'Running Ft.',
  'Piece',
  'Set',
  'Kg.',
  'Nos.',
  'Job',
  'Lot',
];

