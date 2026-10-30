// src/admin/services/invoiceStorage.js
// Dedicated persistence service for Admin Invoices in localStorage.
// Easily replaceable with a REST/GraphQL backend in the future.

const STORAGE_KEYS = {
  INVOICES: 'nirmaan_admin_invoices',
  COUNTER: 'nirmaan_admin_invoice_counter',
};

/**
 * Gets financial year string, e.g. "2026-27"
 */
export function getFinancialYearString(date = new Date()) {
  const d = new Date(date);
  const month = d.getMonth() + 1; // 1 to 12
  const fullYear = d.getFullYear();
  if (month >= 4) {
    const nextYearShort = String((fullYear + 1) % 100).padStart(2, '0');
    return `${fullYear}-${nextYearShort}`;
  } else {
    const prevYear = fullYear - 1;
    const currYearShort = String(fullYear % 100).padStart(2, '0');
    return `${prevYear}-${currYearShort}`;
  }
}

/**
 * Generates the next sequential invoice number, e.g. NAH/2026-27/001
 */
export function generateNextInvoiceNumber() {
  try {
    const rawCount = localStorage.getItem(STORAGE_KEYS.COUNTER);
    const count = rawCount ? parseInt(rawCount, 10) : 0;
    const nextCount = count + 1;
    const fy = getFinancialYearString();
    const formattedNum = String(nextCount).padStart(3, '0');
    return `NAH/${fy}/${formattedNum}`;
  } catch {
    return `NAH/${getFinancialYearString()}/001`;
  }
}

/**
 * Increments the saved counter if this invoice used the latest sequence.
 */
function updateCounter(invoiceNumber) {
  try {
    const match = invoiceNumber?.match(/\/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const rawCount = localStorage.getItem(STORAGE_KEYS.COUNTER);
      const current = rawCount ? parseInt(rawCount, 10) : 0;
      if (num >= current) {
        localStorage.setItem(STORAGE_KEYS.COUNTER, String(num));
      }
    }
  } catch (e) {
    console.error('Failed to update invoice sequence counter:', e);
  }
}

export const invoiceStorage = {
  /**
   * Retrieves all saved invoices sorted by newest first
   */
  getAllInvoices() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!data) {
        // Seed initial reference invoice on first visit for instant review
        const seedInvoice = {
          id: 'inv_demo_001',
          invoiceNumber: 'NAH/2026-27/001',
          invoiceDate: '2026-10-30',
          dueDate: '2026-11-06',
          placeOfSupply: 'Gujarat',
          paymentMethod: 'UPI',
          customerType: 'Individual',
          customer: {
            customerName: 'Mr. Arvindbhai Patel',
            companyName: 'Patel Residency & Bungalows',
            billingAddress: 'Bungalow No. 12, Amul Dairy Road',
            shippingAddress: 'Bungalow No. 12, Amul Dairy Road',
            city: 'Anand',
            state: 'Gujarat',
            pincode: '388001',
            phone: '+91 98250 12345',
            email: 'arvind.patel@gmail.com',
            gstin: '24AABCP5678Q1Z2',
          },
          items: [
            {
              srNo: 1,
              description: 'Stainless Steel Railing',
              variant: 'Satin • SS 304',
              customNote: 'Balcony railing (30 running ft) with 12mm glass infill',
              unit: 'Running Ft.',
              qty: 30,
              rate: 1200,
              discountAmount: 0,
              taxableAmount: 36000,
              gstRate: 18,
              cgst: 3240,
              sgst: 3240,
              igst: 0,
              total: 42480,
            },
            {
              srNo: 2,
              description: 'Aluminium Balcony Glazing',
              variant: 'Powder Coated Matt Black • Heavy Duty 6061 T6',
              customNote: 'East facing master bedroom balcony',
              unit: 'Sq. Ft.',
              qty: 45,
              rate: 1400,
              discountAmount: 0,
              taxableAmount: 63000,
              gstRate: 18,
              cgst: 5670,
              sgst: 5670,
              igst: 0,
              total: 74340,
            },
            {
              srNo: 3,
              description: 'Site Installation & Alignment Labor',
              variant: 'Turnkey Installation',
              customNote: 'Anchoring and structural level certification by expert team',
              unit: 'Job',
              qty: 1,
              rate: 5000,
              discountAmount: 0,
              taxableAmount: 5000,
              gstRate: 18,
              cgst: 450,
              sgst: 450,
              igst: 0,
              total: 5900,
            },
          ],
          calculation: {
            isGujarat: true,
            subtotal: 104000,
            totalDiscount: 0,
            taxableAmount: 104000,
            cgst: 9360,
            sgst: 9360,
            igst: 0,
            totalGst: 18720,
            rawGrandTotal: 122720,
            roundOff: 0,
            finalPayable: 122720,
            amountInWords: 'One Lakh Twenty Two Thousand Seven Hundred Twenty Rupees Only',
            items: [
              {
                srNo: 1,
                description: 'Stainless Steel Railing',
                variant: 'Satin • SS 304',
                customNote: 'Balcony railing (30 running ft) with 12mm glass infill',
                unit: 'Running Ft.',
                qty: 30,
                rate: 1200,
                discountAmount: 0,
                taxableAmount: 36000,
                gstRate: 18,
                total: 42480,
              },
              {
                srNo: 2,
                description: 'Aluminium Balcony Glazing',
                variant: 'Powder Coated Matt Black • Heavy Duty 6061 T6',
                customNote: 'East facing master bedroom balcony',
                unit: 'Sq. Ft.',
                qty: 45,
                rate: 1400,
                discountAmount: 0,
                taxableAmount: 63000,
                gstRate: 18,
                total: 74340,
              },
              {
                srNo: 3,
                description: 'Site Installation & Alignment Labor',
                variant: 'Turnkey Installation',
                customNote: 'Anchoring and structural level certification by expert team',
                unit: 'Job',
                qty: 1,
                rate: 5000,
                discountAmount: 0,
                taxableAmount: 5000,
                gstRate: 18,
                total: 5900,
              },
            ],
          },
          notes: '50% advance received via NEFT. Balance payable on completion of site installation.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([seedInvoice]));
        localStorage.setItem(STORAGE_KEYS.COUNTER, '1');
        return [seedInvoice];
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed reading invoices from storage:', e);
      return [];
    }
  },

  /**
   * Find an invoice by its invoiceNumber or id
   */
  getInvoiceById(idOrNumber) {
    const all = this.getAllInvoices();
    return all.find(
      (inv) => inv.id === idOrNumber || inv.invoiceNumber === idOrNumber
    ) || null;
  },

  /**
   * Saves a new invoice. Throws error if duplicate invoiceNumber exists.
   */
  saveInvoice(invoiceData) {
    const all = this.getAllInvoices();

    // Prevent duplicate invoice numbers
    const existingIndex = all.findIndex(
      (inv) => inv.invoiceNumber === invoiceData.invoiceNumber
    );

    if (existingIndex !== -1) {
      throw new Error(
        `Invoice number "${invoiceData.invoiceNumber}" already exists. Please use a unique invoice number.`
      );
    }

    const newRecord = {
      ...invoiceData,
      id: invoiceData.id || `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(all));
    updateCounter(newRecord.invoiceNumber);
    return newRecord;
  },

  /**
   * Deletes an invoice by id
   */
  deleteInvoice(id) {
    const all = this.getAllInvoices();
    const filtered = all.filter((inv) => inv.id !== id && inv.invoiceNumber !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(filtered));
    return true;
  },
};

export default invoiceStorage;
