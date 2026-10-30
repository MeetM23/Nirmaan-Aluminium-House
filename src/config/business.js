// src/config/business.js
// Central business configuration for Nirmaan Aluminium House
// All business details, GST rates, bank details, and coupons are kept here.

export const businessConfig = {
  name: 'Nirmaan Aluminium House',
  legalName: 'Nirmaan Aluminium House LLP',
  tagline: 'Crafting Spaces. Building Trust.',
  address: {
    line1: 'Plot No. 42, GIDC Industrial Estate',
    line2: 'Near Amul Dairy Road',
    city: 'Anand',
    state: 'Gujarat',
    country: 'India',
    pincode: '388001',
    full: 'Plot No. 42, GIDC Industrial Estate, Near Amul Dairy Road, Anand, Gujarat - 388001, India',
  },
  phone: '+91 98765 43210',
  phoneClean: '+919876543210',
  email: 'info@nirmaanaluminium.com',
  website: 'https://nirmaanaluminium.com',
  gstNumber: '24AAACN1234F1Z5', // Gujarat state code 24
  homeState: 'Gujarat',
  homeStateCode: '24',

  // Tax rates
  tax: {
    defaultGstRate: 0.18, // 18%
    cgstRate: 0.09,       // 9% intra-state
    sgstRate: 0.09,       // 9% intra-state
    igstRate: 0.18,       // 18% inter-state
  },

  // Bank transfer details
  bankDetails: {
    accountName: 'Nirmaan Aluminium House',
    accountNumber: '98765432101234',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branch: 'Anand Main Branch, Gujarat',
  },

  // UPI payment details for QR and direct payment
  upi: {
    upiId: 'nirmaanaluminium@upi',
    payeeName: 'Nirmaan Aluminium House',
  },

  // Invoice payment due duration
  paymentDueDays: 7,

  // Discount coupons
  coupons: {
    NIRMAAN10: {
      code: 'NIRMAAN10',
      discountPercent: 10,
      description: '10% discount on entire fabrication order',
      minOrderAmount: 0,
    },
    WELCOME5: {
      code: 'WELCOME5',
      discountPercent: 5,
      description: '5% welcome discount for new clients',
      minOrderAmount: 0,
    },
    FESTIVE15: {
      code: 'FESTIVE15',
      discountPercent: 15,
      description: '15% festive architectural discount',
      minOrderAmount: 25000,
    },
  },

  // Indian states for address selection & GST calculation
  indianStates: [
    'Gujarat',
    'Maharashtra',
    'Rajasthan',
    'Madhya Pradesh',
    'Delhi',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Haryana',
    'Punjab',
    'West Bengal',
    'Telangana',
    'Andhra Pradesh',
    'Kerala',
    'Goa',
    'Bihar',
    'Odisha',
    'Assam',
    'Chhattisgarh',
    'Jharkhand',
    'Uttarakhand',
    'Himachal Pradesh',
  ],
};

export default businessConfig;
