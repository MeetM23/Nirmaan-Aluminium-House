# Nirmaan Aluminium House — Architectural Fabrication E-Commerce Platform

> **Crafting Spaces. Building Trust.**
> Premium aluminium & stainless steel fabrication platform based in Anand, Gujarat, India.

---

## 🏗️ Architecture & Features

This platform is built with **React 18 + Vite**, **Tailwind CSS**, and **Framer Motion**. It includes a full end-to-end e-commerce, checkout, tax invoice, and customer account experience running **100% on the frontend** with zero initial backend dependencies.

### Key Capabilities
- **Backend-Ready Service Layer (`src/services/*`)**: Simulates asynchronous API latency (~300ms) and returns Promises. Swapping to real REST endpoints requires **zero UI refactoring**.
- **Unified Persistence (`src/services/storage.js`)**: Single localStorage adapter managing users, carts, orders, addresses, and wishlist.
- **Single Source of Truth Pricing (`src/utils/pricing.js`)**:
  - Handles subtotal, coupons, taxable amounts, and state-based GST rules:
    - **Gujarat (Intra-State)**: CGST 9% + SGST 9%
    - **Other Indian States (Inter-State)**: IGST 18%
  - `formatINR()`: Indian digit grouping (e.g. `₹1,18,000`).
  - `amountInWords()`: Indian numbering conversion (Crores, Lakhs, Thousands, Paise).
- **Interactive Cart & Slide-in Drawer**:
  - Live variant selection (Finish, Material grade) on product detail pages with real-time price preview.
  - Quantity stepper with unit awareness (`per sq ft`, `per running ft`, `per piece`) and minimum order thresholds.
  - Navbar cart icon with animated count badge and slide-in drawer.
  - Coupon system (`NIRMAAN10` for 10% off, `WELCOME5` for 5% off).
- **3-Step Checkout (`/checkout`)**:
  1. **Address**: Billing details, PIN code validation, phone formatting, optional GSTIN, and saved address picker.
  2. **Payment**: UPI with inline QR code, Bank Transfer with company account details, Cash on Delivery, or Cash at workshop.
  3. **Review**: Item summary, tax calculation, amount in words, and order confirmation.
- **Official A4 Tax Invoice / Bill (`<Invoice order={order} />`)**:
  - Exact match to reference: warm cream paper (`#EFEBDD`), black hairline borders, red **INVOICE** badge (`#E10600`), and generous margins.
  - Auto-generated **UPI QR code** (`qrcode.react`) with dynamic deep link embedding exact invoice total & invoice number:
    `upi://pay?pa=nirmaanaluminium@upi&pn=Nirmaan%20Aluminium%20House&am=<TOTAL>&cu=INR&tn=<INVOICE_NUMBER>`
  - Single-page A4 PDF export using `html2canvas` + `jsPDF`, plus browser print support (`@media print` with exact color reproduction).
- **Customer Account Portal (`/account`)**:
  - **Dashboard**: Order count, investment summary, recent jobs, quick navigation.
  - **My Profile**: Update personal/firm details, GSTIN, and change password.
  - **Saved Addresses**: Manage site installation and billing addresses with default toggle.
  - **My Orders**: Search by invoice #, filter by status (`Placed`, `Confirmed`, `In Production`, `Installed`, `Delivered`), timeline tracking, reorder action, and invoice download.
  - **Wishlist**: Bookmark architectural designs with quick Add to Cart.

---

## 🔑 Demo Account Credentials

A demo account is pre-seeded on first load with 2 completed orders and 2 saved addresses for instant testing:

- **Email**: `demo@nirmaan.com`
- **Password**: `demo123`
- *(Quick "Fill Demo" button is also provided on `/login`)*

---

## 🏷️ Test Coupons

- `NIRMAAN10` — 10% discount on entire fabrication order
- `WELCOME5` — 5% welcome discount
- `FESTIVE15` — 15% discount on orders above ₹25,000

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 🔌 Connecting a Real Backend

Refer to [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for the exact mapping of every service function to recommended REST API endpoints, request/response contracts, and database schemas.
