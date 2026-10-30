// src/services/storage.js
// Single storage adapter wrapping localStorage
// Centralized key management — localStorage is ONLY accessed through this module.

export const STORAGE_KEYS = {
  USER: 'nirmaan_user',
  CART: 'nirmaan_cart',
  ORDERS: 'nirmaan_orders',
  ADDRESSES: 'nirmaan_addresses',
  WISHLIST: 'nirmaan_wishlist',
  ORDER_COUNTER: 'nirmaan_order_counter',
};

class StorageAdapter {
  getItem(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      if (data === null || data === undefined) return defaultValue;
      return JSON.parse(data);
    } catch (error) {
      console.error(`[StorageAdapter] Failed reading key "${key}":`, error);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageAdapter] Failed writing key "${key}":`, error);
      return false;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[StorageAdapter] Failed removing key "${key}":`, error);
      return false;
    }
  }

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (error) {
      console.error('[StorageAdapter] Failed clearing storage:', error);
      return false;
    }
  }
}

export const storage = new StorageAdapter();
export default storage;
