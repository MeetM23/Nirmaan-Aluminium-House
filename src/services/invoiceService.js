// src/services/invoiceService.js
// Invoice generation, retrieval, and PDF download service.

import orderService from './orderService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const simulateLatency = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: replace with API call → GET /api/invoices/:orderId
export async function getInvoiceByOrderId(orderId) {
  await simulateLatency(200);
  const order = await orderService.getOrderById(orderId);
  return order;
}

// TODO: replace with API call → POST /api/invoices/:invoiceNumber/generate-pdf
/**
 * Render the HTML invoice element to a crisp A4 single-page PDF and trigger download.
 */
export async function generateInvoicePdf(invoiceElement, filename = 'Nirmaan-Invoice.pdf') {
  if (!invoiceElement) {
    throw new Error('Invoice container element not provided.');
  }

  // Optimize canvas settings for crisp text and print fidelity
  const canvas = await html2canvas(invoiceElement, {
    scale: 2.5, // High resolution for clear text and sharp QR
    useCORS: true,
    logging: false,
    backgroundColor: '#EFEBDD', // Match invoice warm cream background
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));
  pdf.save(filename);

  return true;
}

export default {
  getInvoiceByOrderId,
  generateInvoicePdf,
};
