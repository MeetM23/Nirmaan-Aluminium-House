// src/services/authService.js
// Authentication service simulating backend endpoints with Promise delays and localStorage persistence.
// NOTE: In production, passwords must be securely hashed on the server side with bcrypt/argon2.

import storage, { STORAGE_KEYS } from './storage';

const simulateLatency = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const DEMO_USER = {
  id: 'usr_demo_001',
  name: 'Rajesh Patel',
  email: 'demo@nirmaan.com',
  password: 'demo123', // NOTE: Mock only. In production passwords must be hashed server-side.
  phone: '+91 98250 12345',
  company: 'Patel Residency & Developers',
  gstNumber: '24AAPCP5678Q1Z2',
  avatar: 'RP',
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const DEMO_ADDRESSES = [
  {
    id: 'addr_demo_1',
    userId: 'usr_demo_001',
    name: 'Rajesh Patel',
    company: 'Patel Residency',
    phone: '+91 98250 12345',
    email: 'demo@nirmaan.com',
    line1: 'Bunglow No. 14, Gokul Villa Society',
    line2: 'Opp. Bhaikaka Statue, Mota Bazaar',
    city: 'Vallabh Vidyanagar, Anand',
    state: 'Gujarat',
    pincode: '388120',
    gstNumber: '24AAPCP5678Q1Z2',
    isDefault: true,
  },
  {
    id: 'addr_demo_2',
    userId: 'usr_demo_001',
    name: 'Rajesh Patel (Site Office)',
    company: 'Patel Developers Project Site',
    phone: '+91 98250 12345',
    email: 'demo@nirmaan.com',
    line1: 'Plot 88, Near Express Highway Crossing',
    line2: 'Samarkha Road',
    city: 'Anand',
    state: 'Gujarat',
    pincode: '388001',
    gstNumber: '24AAPCP5678Q1Z2',
    isDefault: false,
  },
];

export const DEMO_ORDERS = [
  {
    id: 'ord_demo_101',
    userId: 'usr_demo_001',
    orderNumber: 'ORD-2026-101',
    invoiceNumber: 'INV-2026-001',
    status: 'Installed', // Placed, Confirmed, In Production, Installed, Delivered, Cancelled
    createdAt: '2026-09-21T11:30:00.000Z',
    dueDate: '2026-09-28',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    billingAddress: DEMO_ADDRESSES[0],
    shippingAddress: DEMO_ADDRESSES[0],
    items: [
      {
        id: 1,
        productId: 1,
        slug: 'stainless-steel-railing',
        name: 'Stainless Steel Railing',
        variant: 'Satin Finish • SS 304',
        finish: 'Satin',
        material: 'SS 304',
        unit: 'per running ft',
        unitPrice: 850,
        quantity: 120,
        lineTotal: 102000,
        image: '/images/products/ss-railing.jpg',
      },
      {
        id: 2,
        productId: 2,
        slug: 'aluminium-balcony',
        name: 'Aluminium Balcony Glass Frame',
        variant: 'Powder Coated Matt Black',
        finish: 'Powder Coated',
        material: 'Alum 6063 T5',
        unit: 'per sq ft',
        unitPrice: 1200,
        quantity: 40,
        lineTotal: 48000,
        image: '/images/products/alum-balcony.jpg',
      },
    ],
    pricing: {
      subtotal: 150000,
      discountPercent: 10,
      discount: 15000,
      taxableAmount: 135000,
      isGujarat: true,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgst: 12150,
      sgst: 12150,
      igst: 0,
      gstTotal: 24300,
      grandTotal: 159300,
      amountInWords: 'One Lakh Fifty Nine Thousand Three Hundred Rupees Only',
    },
    timeline: [
      { status: 'Placed', timestamp: '2026-09-21T11:30:00.000Z', note: 'Order placed by client.' },
      { status: 'Confirmed', timestamp: '2026-09-22T09:15:00.000Z', note: 'Site measurement confirmed.' },
      { status: 'In Production', timestamp: '2026-09-24T14:00:00.000Z', note: 'Fabrication completed in Anand workshop.' },
      { status: 'Installed', timestamp: '2026-09-27T16:45:00.000Z', note: 'Handed over on site.' },
    ],
  },
  {
    id: 'ord_demo_102',
    userId: 'usr_demo_001',
    orderNumber: 'ORD-2026-102',
    invoiceNumber: 'INV-2026-002',
    status: 'In Production',
    createdAt: '2026-10-18T14:20:00.000Z',
    dueDate: '2026-10-25',
    paymentMethod: 'UPI',
    paymentStatus: 'Pending',
    billingAddress: DEMO_ADDRESSES[0],
    shippingAddress: DEMO_ADDRESSES[1],
    items: [
      {
        id: 6,
        productId: 6,
        slug: 'stainless-steel-pvd-work',
        name: 'Stainless Steel PVD Work',
        variant: 'Mirror Gold PVD • SS 316',
        finish: 'PVD Gold',
        material: 'SS 316',
        unit: 'per sq ft',
        unitPrice: 3200,
        quantity: 25,
        lineTotal: 80000,
        image: '/images/products/pvd-work.jpg',
      },
      {
        id: 7,
        productId: 7,
        slug: 'stainless-steel-cnc-work',
        name: 'Stainless Steel CNC Jali Work',
        variant: 'Geometric Pattern • SS 304',
        finish: 'Brushed Gold',
        material: 'SS 304',
        unit: 'per sq ft',
        unitPrice: 1800,
        quantity: 20,
        lineTotal: 36000,
        image: '/images/products/cnc-work.jpg',
      },
    ],
    pricing: {
      subtotal: 116000,
      discountPercent: 5,
      discount: 5800,
      taxableAmount: 110200,
      isGujarat: true,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgst: 9918,
      sgst: 9918,
      igst: 0,
      gstTotal: 19836,
      grandTotal: 130036,
      amountInWords: 'One Lakh Thirty Thousand Thirty Six Rupees Only',
    },
    timeline: [
      { status: 'Placed', timestamp: '2026-10-18T14:20:00.000Z', note: 'Order placed online.' },
      { status: 'Confirmed', timestamp: '2026-10-19T10:00:00.000Z', note: 'CNC pattern and CAD drawings approved.' },
      { status: 'In Production', timestamp: '2026-10-22T11:00:00.000Z', note: 'Laser cutting & PVD chamber coating underway.' },
    ],
  },
];

// Initialize storage with demo data if empty
export function initSeedData() {
  const users = storage.getItem('nirmaan_registered_users', []);
  if (!users.some((u) => u.email === DEMO_USER.email)) {
    users.push(DEMO_USER);
    storage.setItem('nirmaan_registered_users', users);
  }

  const existingOrders = storage.getItem(STORAGE_KEYS.ORDERS, null);
  if (!existingOrders || existingOrders.length === 0) {
    storage.setItem(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  }

  const existingAddresses = storage.getItem(STORAGE_KEYS.ADDRESSES, null);
  if (!existingAddresses || existingAddresses.length === 0) {
    storage.setItem(STORAGE_KEYS.ADDRESSES, DEMO_ADDRESSES);
  }

  const existingCounter = storage.getItem(STORAGE_KEYS.ORDER_COUNTER, null);
  if (!existingCounter) {
    storage.setItem(STORAGE_KEYS.ORDER_COUNTER, 3); // next invoice will be INV-2026-003
  }
}

// TODO: replace with API call → POST /api/auth/login
export async function login({ email, password }) {
  await simulateLatency(300);
  initSeedData();

  const users = storage.getItem('nirmaan_registered_users', [DEMO_USER]);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password. Try demo@nirmaan.com / demo123');
  }

  // Safe user profile without raw password
  const safeUser = { ...user };
  delete safeUser.password;

  storage.setItem(STORAGE_KEYS.USER, safeUser);
  return safeUser;
}

// TODO: replace with API call → POST /api/auth/register
export async function register({ name, email, password, phone = '', company = '', gstNumber = '' }) {
  await simulateLatency(300);
  initSeedData();

  const users = storage.getItem('nirmaan_registered_users', [DEMO_USER]);
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    throw new Error('An account with this email address already exists.');
  }

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    password, // NOTE: In real app, passwords must be hashed server-side.
    phone,
    company,
    gstNumber,
    avatar: initials,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  storage.setItem('nirmaan_registered_users', users);

  const safeUser = { ...newUser };
  delete safeUser.password;
  storage.setItem(STORAGE_KEYS.USER, safeUser);
  return safeUser;
}

// TODO: replace with API call → GET /api/auth/me
export async function getCurrentUser() {
  await simulateLatency(150);
  initSeedData();
  return storage.getItem(STORAGE_KEYS.USER, null);
}

// TODO: replace with API call → POST /api/auth/logout
export async function logout() {
  await simulateLatency(150);
  storage.removeItem(STORAGE_KEYS.USER);
  return true;
}

export default {
  login,
  register,
  getCurrentUser,
  logout,
  initSeedData,
  DEMO_USER,
};
