// src/services/profileService.js
// Customer profile, addresses, and wishlist service with Promises and localStorage persistence.

import storage, { STORAGE_KEYS } from './storage';

const simulateLatency = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: replace with API call → GET /api/users/:userId/profile
export async function getProfile(userId) {
  await simulateLatency(200);
  const user = storage.getItem(STORAGE_KEYS.USER, null);
  if (!user) throw new Error('User not logged in.');
  return user;
}

// TODO: replace with API call → PUT /api/users/:userId/profile
export async function updateProfile(userId, profileData) {
  await simulateLatency(300);
  const currentUser = storage.getItem(STORAGE_KEYS.USER, {});
  
  const initials = (profileData.name || currentUser.name || 'User')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const updatedUser = {
    ...currentUser,
    ...profileData,
    avatar: initials,
  };

  storage.setItem(STORAGE_KEYS.USER, updatedUser);

  // Update in registered users list as well
  const users = storage.getItem('nirmaan_registered_users', []);
  const uIndex = users.findIndex((u) => u.id === userId || u.email === updatedUser.email);
  if (uIndex > -1) {
    users[uIndex] = { ...users[uIndex], ...updatedUser };
    storage.setItem('nirmaan_registered_users', users);
  }

  return updatedUser;
}

// TODO: replace with API call → GET /api/users/:userId/addresses
export async function getAddresses(userId) {
  await simulateLatency(200);
  const allAddresses = storage.getItem(STORAGE_KEYS.ADDRESSES, []);
  if (!userId) return allAddresses;
  return allAddresses.filter((a) => a.userId === userId || a.userId === 'usr_demo_001');
}

// TODO: replace with API call → POST /api/users/:userId/addresses
export async function addAddress(userId, addressData) {
  await simulateLatency(300);
  const allAddresses = storage.getItem(STORAGE_KEYS.ADDRESSES, []);

  const newAddress = {
    ...addressData,
    id: `addr_${Date.now()}`,
    userId: userId || 'usr_demo_001',
    isDefault: allAddresses.length === 0 || addressData.isDefault,
  };

  // If this address is set to default, unset others
  if (newAddress.isDefault) {
    allAddresses.forEach((a) => {
      if (a.userId === newAddress.userId) a.isDefault = false;
    });
  }

  allAddresses.unshift(newAddress);
  storage.setItem(STORAGE_KEYS.ADDRESSES, allAddresses);
  return newAddress;
}

// TODO: replace with API call → PUT /api/users/:userId/addresses/:addressId
export async function updateAddress(userId, addressId, updatedData) {
  await simulateLatency(250);
  const allAddresses = storage.getItem(STORAGE_KEYS.ADDRESSES, []);
  const index = allAddresses.findIndex((a) => a.id === addressId);

  if (index === -1) {
    throw new Error('Address not found.');
  }

  if (updatedData.isDefault) {
    allAddresses.forEach((a) => {
      if (a.userId === userId) a.isDefault = false;
    });
  }

  allAddresses[index] = {
    ...allAddresses[index],
    ...updatedData,
    id: addressId,
    userId,
  };

  storage.setItem(STORAGE_KEYS.ADDRESSES, allAddresses);
  return allAddresses[index];
}

// TODO: replace with API call → DELETE /api/users/:userId/addresses/:addressId
export async function deleteAddress(userId, addressId) {
  await simulateLatency(200);
  const allAddresses = storage.getItem(STORAGE_KEYS.ADDRESSES, []);
  const filtered = allAddresses.filter((a) => a.id !== addressId);
  storage.setItem(STORAGE_KEYS.ADDRESSES, filtered);
  return true;
}

// TODO: replace with API call → PATCH /api/users/:userId/addresses/:addressId/default
export async function setDefaultAddress(userId, addressId) {
  await simulateLatency(200);
  const allAddresses = storage.getItem(STORAGE_KEYS.ADDRESSES, []);
  allAddresses.forEach((a) => {
    if (a.userId === userId || a.userId === 'usr_demo_001') {
      a.isDefault = a.id === addressId;
    }
  });
  storage.setItem(STORAGE_KEYS.ADDRESSES, allAddresses);
  return allAddresses;
}

// TODO: replace with API call → POST /api/users/:userId/change-password
export async function changePassword(userId, { oldPassword, newPassword }) {
  await simulateLatency(300);
  const users = storage.getItem('nirmaan_registered_users', []);
  const user = users.find((u) => u.id === userId);

  if (user && user.password && user.password !== oldPassword) {
    throw new Error('Current password does not match.');
  }

  if (user) {
    user.password = newPassword;
    storage.setItem('nirmaan_registered_users', users);
  }

  return true;
}

// TODO: replace with API call → GET /api/wishlist
export async function getWishlist() {
  await simulateLatency(150);
  return storage.getItem(STORAGE_KEYS.WISHLIST, []);
}

// TODO: replace with API call → POST /api/wishlist/:productId
export async function toggleWishlist(productId) {
  await simulateLatency(150);
  const wishlist = storage.getItem(STORAGE_KEYS.WISHLIST, []);
  const index = wishlist.indexOf(productId);
  let updated;
  if (index > -1) {
    updated = wishlist.filter((id) => id !== productId);
  } else {
    updated = [...wishlist, productId];
  }
  storage.setItem(STORAGE_KEYS.WISHLIST, updated);
  return updated;
}

export default {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  changePassword,
  getWishlist,
  toggleWishlist,
};
