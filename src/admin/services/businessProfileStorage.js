// src/admin/services/businessProfileStorage.js
// Centralized Single Source of Truth for Business Profile and Invoice Preferences.
// Stored in localStorage and snapshot into each generated invoice.

import { companyConfig } from '../config/companyConfig';

const PROFILE_STORAGE_KEY = 'nirmaan_business_profile';

export const defaultBusinessProfile = {
  // Business Information
  companyName: companyConfig.name,
  legalName: companyConfig.legalName,
  tagline: companyConfig.tagline,
  businessType: 'Partnership / LLP',
  logoUrl: companyConfig.logoUrl || '/images/logo-horizontal-light.png',
  logoMarkUrl: companyConfig.logoMarkUrl || '/images/logo-mark.png',
  gstin: companyConfig.gstin,
  pan: companyConfig.pan,

  // Address
  addressLine1: companyConfig.address.line1,
  addressLine2: companyConfig.address.line2,
  city: companyConfig.address.city,
  state: companyConfig.address.state,
  stateCode: companyConfig.address.stateCode,
  pincode: companyConfig.address.pincode,
  country: companyConfig.address.country,

  // Contact Information
  primaryPhone: companyConfig.contact.phone,
  alternatePhone: companyConfig.contact.alternatePhone,
  email: companyConfig.contact.email,
  website: companyConfig.contact.website,

  // Banking Information
  bankName: companyConfig.payment.bankName,
  accountName: companyConfig.payment.accountName,
  accountNumber: companyConfig.payment.accountNumber,
  ifscCode: companyConfig.payment.ifscCode,
  branch: companyConfig.payment.branch,

  // Payment Information (Fixed QR is static)
  upiId: companyConfig.payment.upiId,
  upiPayeeName: companyConfig.payment.upiPayeeName,
  qrCodeUrl: '/images/nirmaan-payment-qr.png',

  // Invoice Preferences
  defaultPaymentMethod: 'UPI',
  defaultGstRate: 18,
  invoicePrefix: 'NAH',
  defaultPaymentDueDays: 7,
  defaultNotes: '50% advance received. Balance payable on completion of site installation.',
  signatoryName: 'Nirmaan Aluminium House',
  signatoryDesignation: 'Authorised Signatory',
};

export const businessProfileStorage = {
  /**
   * Retrieves the current business profile. If none saved, returns default.
   */
  getProfile() {
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!data) {
        return { ...defaultBusinessProfile };
      }
      const parsed = JSON.parse(data);
      return { ...defaultBusinessProfile, ...parsed };
    } catch (e) {
      console.error('Failed reading business profile from storage:', e);
      return { ...defaultBusinessProfile };
    }
  },

  /**
   * Saves updated business profile to storage
   */
  saveProfile(updatedProfile) {
    try {
      const merged = {
        ...this.getProfile(),
        ...updatedProfile,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Failed saving business profile:', e);
      throw new Error('Could not save business profile to local storage.');
    }
  },

  /**
   * Resets profile back to default configuration
   */
  resetProfile() {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return { ...defaultBusinessProfile };
  },
};

export default businessProfileStorage;

