// src/admin/services/pdfExport.js
// A4 PDF Generation and Print Utility with multi-page support and on-demand library loading

/**
 * Triggers native browser print dialog for the invoice
 */
export function printInvoice() {
  window.print();
}

/**
 * Captures the A4 invoice element(s) and downloads a crisp multi-page or single-page PDF.
 * Uses dynamic import so html2canvas and jsPDF are loaded only when the user requests PDF download.
 * 
 * @param {HTMLElement|string} targetElement - DOM element or element ID
 * @param {string} filename - Output file name
 */
export async function downloadInvoicePDF(targetElement, filename = 'Invoice.pdf') {
  const container =
    typeof targetElement === 'string'
      ? document.getElementById(targetElement)
      : targetElement;

  if (!container) {
    throw new Error('Invoice container element not found for PDF generation.');
  }

  // Dynamic import of heavy libraries for fast initial load
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  // Check if container has multiple .invoice-a4-page elements
  const pageElements = container.querySelectorAll('.invoice-a4-page');

  // A4 portrait dimensions in mm
  const PDF_PAGE_WIDTH = 210;
  const PDF_PAGE_HEIGHT = 297;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const elementsToCapture = pageElements.length > 0 ? Array.from(pageElements) : [container];

  for (let i = 0; i < elementsToCapture.length; i++) {
    const el = elementsToCapture[i];

    // Capture at high resolution (scale 2) with exact background color
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#EFEBDD', // Match official cream paper
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const renderedHeight = (canvas.height * PDF_PAGE_WIDTH) / canvas.width;

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // If rendered height fits within A4 height or slightly exceeds (fit to page if single page)
    if (elementsToCapture.length === 1 && renderedHeight > PDF_PAGE_HEIGHT) {
      // Scale down slightly to ensure 100% fits onto single A4 page without clipping bottom
      const scaleFactor = PDF_PAGE_HEIGHT / renderedHeight;
      const fitWidth = PDF_PAGE_WIDTH * scaleFactor;
      const xOffset = (PDF_PAGE_WIDTH - fitWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, 0, fitWidth, PDF_PAGE_HEIGHT);
    } else {
      // Normal exact 1:1 page fit
      pdf.addImage(imgData, 'JPEG', 0, 0, PDF_PAGE_WIDTH, Math.min(renderedHeight, PDF_PAGE_HEIGHT));
    }
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
  return true;
}
