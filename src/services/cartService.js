// src/services/cartService.js
// Cart data service simulating backend cart endpoints with Promises & localStorage persistence.

import storage, { STORAGE_KEYS } from './storage';

const simulateLatency = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: replace with API call → GET /api/cart
export async function getCart() {
  await simulateLatency(150);
  return storage.getItem(STORAGE_KEYS.CART, []);
}

// TODO: replace with API call → POST /api/cart/items
export async function addToCart(productItem) {
  await simulateLatency(200);
  const cart = storage.getItem(STORAGE_KEYS.CART, []);

  // Determine uniqueness by productId + variant identifier
  const variantKey = `${productItem.productId || productItem.id}-${productItem.finish || 'standard'}-${productItem.material || 'standard'}`;
  const existingIndex = cart.findIndex((item) => item.variantKey === variantKey);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += Number(productItem.quantity || 1);
  } else {
    cart.push({
      ...productItem,
      id: productItem.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      variantKey,
      quantity: Number(productItem.quantity || 1),
      unitPrice: Number(productItem.unitPrice || productItem.price || 0),
    });
  }

  storage.setItem(STORAGE_KEYS.CART, cart);
  return cart;
}

// TODO: replace with API call → PUT /api/cart/items/:id
export async function updateQuantity(variantKeyOrId, quantity) {
  await simulateLatency(150);
  let cart = storage.getItem(STORAGE_KEYS.CART, []);

  const numQty = Number(quantity);
  if (numQty <= 0) {
    cart = cart.filter((item) => item.variantKey !== variantKeyOrId && item.id !== variantKeyOrId);
  } else {
    cart = cart.map((item) => {
      if (item.variantKey === variantKeyOrId || item.id === variantKeyOrId) {
        return { ...item, quantity: numQty };
      }
      return item;
    });
  }

  storage.setItem(STORAGE_KEYS.CART, cart);
  return cart;
}

// TODO: replace with API call → DELETE /api/cart/items/:id
export async function removeFromCart(variantKeyOrId) {
  await simulateLatency(150);
  const cart = storage.getItem(STORAGE_KEYS.CART, []);
  const updatedCart = cart.filter(
    (item) => item.variantKey !== variantKeyOrId && item.id !== variantKeyOrId
  );
  storage.setItem(STORAGE_KEYS.CART, updatedCart);
  return updatedCart;
}

// TODO: replace with API call → DELETE /api/cart
export async function clearCart() {
  await simulateLatency(100);
  storage.setItem(STORAGE_KEYS.CART, []);
  return [];
}

export default {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
