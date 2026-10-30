# Backend Integration Guide — Nirmaan Aluminium House

This document outlines the entire data layer for **Nirmaan Aluminium House**. The application currently runs 100% on the frontend using asynchronous service modules (`src/services/*`) and a unified localStorage persistence adapter (`src/services/storage.js`).

To replace the mock layer with a real production backend (e.g. Node.js / Express / NestJS / Django / FastAPI / Go), **zero UI changes** are needed. Simply update the functions in `src/services/` to call real HTTP/REST or GraphQL endpoints.

---

## 1. Storage Keys Reference

All keys are managed exclusively in `src/services/storage.js`:

| Key Name | Storage Key | Description |
|---|---|---|
| `USER` | `nirmaan_user` | Current active authenticated user session profile |
| `CART` | `nirmaan_cart` | Active shopping cart items with selected variants and quantities |
| `ORDERS` | `nirmaan_orders` | List of all customer orders, status timelines, and invoice numbers |
| `ADDRESSES` | `nirmaan_addresses` | Saved customer billing and site installation addresses |
| `WISHLIST` | `nirmaan_wishlist` | Array of product IDs saved to customer wishlist |
| `ORDER_COUNTER` | `nirmaan_order_counter` | Auto-increment counter for invoice IDs (`INV-YYYY-###`) |
| `REGISTERED_USERS` | `nirmaan_registered_users` | Local mock registry of user accounts |

---

## 2. Services & Suggested REST Endpoints

### 2.1. Authentication Service (`src/services/authService.js`)

| Function | Storage Key | Method & Suggested Endpoint | Request Payload | Response Shape |
|---|---|---|---|---|
| `login({ email, password })` | `nirmaan_user` | `POST /api/auth/login` | `{ email, password }` | `{ user: UserObject, token: string }` |
| `register(data)` | `nirmaan_user` | `POST /api/auth/register` | `{ name, email, password, phone, company?, gstNumber? }` | `{ user: UserObject, token: string }` |
| `getCurrentUser()` | `nirmaan_user` | `GET /api/auth/me` | *Headers: Bearer Token* | `UserObject` |
| `logout()` | `nirmaan_user` | `POST /api/auth/logout` | *Headers: Bearer Token* | `{ success: true }` |

> **Security Note:** In production, passwords must be securely hashed on the server side using **Argon2** or **bcrypt**. JWT / HTTP-only cookies should replace raw user objects.

---

### 2.2. Cart Service (`src/services/cartService.js`)

| Function | Storage Key | Method & Suggested Endpoint | Request Payload | Response Shape |
|---|---|---|---|---|
| `getCart()` | `nirmaan_cart` | `GET /api/cart` | *Headers: Bearer Token or Session* | `CartItem[]` |
| `addToCart(item)` | `nirmaan_cart` | `POST /api/cart/items` | `CartItem` | `CartItem[]` |
| `updateQuantity(key, qty)` | `nirmaan_cart` | `PUT /api/cart/items/:id` | `{ quantity: number }` | `CartItem[]` |
| `removeFromCart(key)` | `nirmaan_cart` | `DELETE /api/cart/items/:id` | — | `CartItem[]` |
| `clearCart()` | `nirmaan_cart` | `DELETE /api/cart` | — | `[]` |

---

### 2.3. Order & Invoice Service (`src/services/orderService.js`)

| Function | Storage Key | Method & Suggested Endpoint | Request Payload | Response Shape |
|---|---|---|---|---|
| `getOrders(userId)` | `nirmaan_orders` | `GET /api/orders?userId=:id` | — | `OrderObject[]` |
| `getOrderById(orderId)` | `nirmaan_orders` | `GET /api/orders/:orderId` | — | `OrderObject` |
| `createOrder(orderData)` | `nirmaan_orders`, `nirmaan_order_counter` | `POST /api/orders` | `CreateOrderInput` | `OrderObject` (includes generated `invoiceNumber`) |
| `updateOrderStatus(id, status, note)` | `nirmaan_orders` | `PATCH /api/orders/:id/status` | `{ status, note }` | `OrderObject` |

---

### 2.4. Customer Profile & Addresses (`src/services/profileService.js`)

| Function | Storage Key | Method & Suggested Endpoint | Request Payload | Response Shape |
|---|---|---|---|---|
| `getProfile(userId)` | `nirmaan_user` | `GET /api/users/:userId/profile` | — | `UserProfile` |
| `updateProfile(userId, data)` | `nirmaan_user` | `PUT /api/users/:userId/profile` | `UpdateProfileInput` | `UserProfile` |
| `getAddresses(userId)` | `nirmaan_addresses` | `GET /api/users/:userId/addresses` | — | `AddressObject[]` |
| `addAddress(userId, addr)` | `nirmaan_addresses` | `POST /api/users/:userId/addresses` | `AddressInput` | `AddressObject` |
| `updateAddress(userId, id, addr)` | `nirmaan_addresses` | `PUT /api/users/:userId/addresses/:id` | `AddressInput` | `AddressObject` |
| `deleteAddress(userId, id)` | `nirmaan_addresses` | `DELETE /api/users/:userId/addresses/:id` | — | `{ success: true }` |
| `setDefaultAddress(userId, id)` | `nirmaan_addresses` | `PATCH /api/users/:userId/addresses/:id/default` | — | `AddressObject[]` |
| `changePassword(userId, data)` | `nirmaan_registered_users` | `POST /api/users/:userId/change-password` | `{ oldPassword, newPassword }` | `{ success: true }` |
| `getWishlist()` | `nirmaan_wishlist` | `GET /api/wishlist` | — | `number[]` (product IDs) |
| `toggleWishlist(productId)` | `nirmaan_wishlist` | `POST /api/wishlist/:productId/toggle` | — | `number[]` |

---

### 2.5. Invoice Generation (`src/services/invoiceService.js`)

| Function | Method & Suggested Endpoint | Description |
|---|---|---|
| `getInvoiceByOrderId(orderId)` | `GET /api/invoices/:orderId` | Retrieves order data used to populate `<Invoice />` |
| `generateInvoicePdf(el, filename)` | `POST /api/invoices/:invoiceNumber/generate-pdf` *(optional server-side Puppeteer)* | Client-side uses `html2canvas` + `jsPDF`; can be redirected to a server-side PDF generator if desired |

---

## 3. Core Data Schemas

### 3.1. Order & Invoice Object Schema

```json
{
  "id": "ord_1730278912345",
  "userId": "usr_demo_001",
  "orderNumber": "ORD-2026-412",
  "invoiceNumber": "INV-2026-003",
  "status": "Placed",
  "createdAt": "2026-10-30T10:15:00.000Z",
  "dueDate": "2026-11-06",
  "paymentMethod": "UPI",
  "paymentStatus": "Pending",
  "couponCode": "NIRMAAN10",
  "notes": "Please arrange survey visit before Tuesday.",
  "billingAddress": {
    "name": "Rajesh Patel",
    "company": "Patel Residency & Developers",
    "phone": "+91 98250 12345",
    "email": "demo@nirmaan.com",
    "line1": "Bunglow No. 14, Gokul Villa Society",
    "line2": "Opp. Bhaikaka Statue, Mota Bazaar",
    "city": "Vallabh Vidyanagar, Anand",
    "state": "Gujarat",
    "pincode": "388120",
    "gstNumber": "24AAPCP5678Q1Z2"
  },
  "shippingAddress": {
    "name": "Rajesh Patel",
    "line1": "Plot 88, Near Express Highway Crossing",
    "city": "Anand",
    "state": "Gujarat",
    "pincode": "388001"
  },
  "items": [
    {
      "id": "item_1",
      "productId": 1,
      "slug": "stainless-steel-railing",
      "name": "Stainless Steel Railing",
      "variant": "Satin • SS 304",
      "finish": "Satin",
      "material": "SS 304",
      "unit": "per running ft",
      "unitPrice": 850,
      "quantity": 120,
      "lineTotal": 102000,
      "image": "/images/products/ss-railing.jpg"
    }
  ],
  "pricing": {
    "subtotal": 102000,
    "discountPercent": 10,
    "discount": 10200,
    "taxableAmount": 91800,
    "isGujarat": true,
    "cgstRate": 9,
    "sgstRate": 9,
    "igstRate": 0,
    "cgst": 8262,
    "sgst": 8262,
    "igst": 0,
    "gstTotal": 16524,
    "grandTotal": 108324,
    "amountInWords": "One Lakh Eight Thousand Three Hundred Twenty Four Rupees Only"
  },
  "timeline": [
    {
      "status": "Placed",
      "timestamp": "2026-10-30T10:15:00.000Z",
      "note": "Order placed online via UPI."
    }
  ]
}
```

---

## 4. UPI Deep Link Specification

The invoice QR code conforms to standard NPCI UPI specifications:

```
upi://pay?pa=nirmaanaluminium@upi&pn=Nirmaan%20Aluminium%20House&am=108324&cu=INR&tn=INV-2026-003
```

- `pa`: Payee Virtual Payment Address (VPA) from `src/config/business.js`
- `pn`: Payee business display name
- `am`: Exact order grand total calculated by `src/utils/pricing.js`
- `cu`: Currency code (`INR`)
- `tn`: Invoice reference number (pre-fills the payment remark in Google Pay, PhonePe, Paytm, or BHIM)
