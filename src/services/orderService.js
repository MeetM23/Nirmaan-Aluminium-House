// src/services/orderService.js
// Order management service with Promise delays, auto-incrementing invoice numbers, and storage persistence.

import storage, { STORAGE_KEYS } from './storage';
import { calculatePricing } from '../utils/pricing';
import { businessConfig } from '../config/business';

const simulateLatency = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate next invoice number in format INV-YYYY-###
export function getNextInvoiceNumber() {
  const currentYear = new Date().getFullYear();
  let counter = storage.getItem(STORAGE_KEYS.ORDER_COUNTER, 3);
  const formattedCounter = String(counter).padStart(3, '0');
  const invoiceNumber = `INV-${currentYear}-${formattedCounter}`;
  storage.setItem(STORAGE_KEYS.ORDER_COUNTER, counter + 1);
  return invoiceNumber;
}

// TODO: replace with API call → GET /api/orders?userId=:userId
export async function getOrders(userId) {
  await simulateLatency(300);
  const allOrders = storage.getItem(STORAGE_KEYS.ORDERS, []);
  if (!userId) return allOrders;
  return allOrders.filter((order) => order.userId === userId || order.userId === 'usr_demo_001');
}

// TODO: replace with API call → GET /api/orders/:orderId
export async function getOrderById(orderId) {
  await simulateLatency(250);
  const allOrders = storage.getItem(STORAGE_KEYS.ORDERS, []);
  const order = allOrders.find(
    (o) => o.id === orderId || o.invoiceNumber === orderId || o.orderNumber === orderId
  );
  if (!order) {
    throw new Error(`Order with ID "${orderId}" was not found.`);
  }
  return order;
}

// TODO: replace with API call → POST /api/orders
export async function createOrder({
  userId,
  items,
  billingAddress,
  shippingAddress,
  paymentMethod = 'Bank Transfer',
  couponCode = null,
  discountPercent = 0,
  notes = '',
}) {
  await simulateLatency(400);

  if (!items || items.length === 0) {
    throw new Error('Cannot place an order with an empty cart.');
  }

  const currentYear = new Date().getFullYear();
  const timestamp = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + businessConfig.paymentDueDays);

  const invoiceNumber = getNextInvoiceNumber();
  const orderId = `ord_${Date.now()}`;
  const orderNumber = `ORD-${currentYear}-${Math.floor(100 + Math.random() * 900)}`;

  // Calculate pricing using the single source of truth
  const destinationState = billingAddress?.state || shippingAddress?.state || 'Gujarat';
  const pricing = calculatePricing({
    items,
    discountPercent,
    state: destinationState,
  });

  const newOrder = {
    id: orderId,
    userId: userId || 'usr_guest',
    orderNumber,
    invoiceNumber,
    status: 'Placed',
    createdAt: timestamp.toISOString(),
    dueDate: dueDate.toISOString().split('T')[0],
    paymentMethod,
    paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending Verification',
    couponCode,
    billingAddress,
    shippingAddress: shippingAddress || billingAddress,
    notes,
    items: items.map((item) => ({
      id: item.id || `item_${Math.random()}`,
      productId: item.productId || item.id,
      slug: item.slug,
      name: item.name,
      variant: item.variant || `${item.finish || 'Standard'} • ${item.material || 'Standard'}`,
      finish: item.finish || 'Standard',
      material: item.material || 'Standard',
      unit: item.unit || 'per sq ft',
      unitPrice: Number(item.unitPrice || item.price || 0),
      quantity: Number(item.quantity || 1),
      lineTotal: Math.round(Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1) * 100) / 100,
      image: item.image,
    })),
    pricing,
    timeline: [
      {
        status: 'Placed',
        timestamp: timestamp.toISOString(),
        note: `Order placed online via ${paymentMethod}.`,
      },
    ],
  };

  const existingOrders = storage.getItem(STORAGE_KEYS.ORDERS, []);
  existingOrders.unshift(newOrder); // newest first
  storage.setItem(STORAGE_KEYS.ORDERS, existingOrders);

  return newOrder;
}

// TODO: replace with API call → PATCH /api/orders/:orderId/status
export async function updateOrderStatus(orderId, newStatus, note = '') {
  await simulateLatency(250);
  const allOrders = storage.getItem(STORAGE_KEYS.ORDERS, []);
  const index = allOrders.findIndex((o) => o.id === orderId);

  if (index === -1) {
    throw new Error('Order not found.');
  }

  allOrders[index].status = newStatus;
  allOrders[index].timeline.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Order status updated to ${newStatus}.`,
  });

  storage.setItem(STORAGE_KEYS.ORDERS, allOrders);
  return allOrders[index];
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getNextInvoiceNumber,
};
