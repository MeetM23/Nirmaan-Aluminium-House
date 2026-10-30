// src/admin/pages/CreateInvoiceTab.jsx
import { useState, useMemo } from 'react';
import { ArrowRight, AlertCircle, FilePlus2, Sparkles, FileText, Layers } from 'lucide-react';
import CompanyInfoCard from '../components/CompanyInfoCard';
import InvoiceDetailsCard from '../components/InvoiceDetailsCard';
import CustomerDetailsCard from '../components/CustomerDetailsCard';
import InvoiceItemsTable from '../components/InvoiceItemsTable';
import ProductSelectorModal from '../components/ProductSelectorModal';
import InvoiceSummaryCard from '../components/InvoiceSummaryCard';
import InvoicePreviewModal from '../components/InvoicePreviewModal';

import { calculateInvoice } from '../utils/invoiceCalculations';
import { generateNextInvoiceNumber, invoiceStorage } from '../services/invoiceStorage';
import { businessProfileStorage } from '../services/businessProfileStorage';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getDefaultDueDateString(dueDays = 7) {
  const d = new Date();
  d.setDate(d.getDate() + dueDays);
  return d.toISOString().split('T')[0];
}

export default function CreateInvoiceTab({ onInvoiceCreated, onNavigateToProfile }) {
  const activeProfile = businessProfileStorage.getProfile();

  // Form State initialized from active profile defaults
  const [formData, setFormData] = useState(() => ({
    invoiceNumber: generateNextInvoiceNumber(),
    invoiceDate: getTodayString(),
    dueDate: getDefaultDueDateString(activeProfile.defaultPaymentDueDays || 7),
    placeOfSupply: activeProfile.state || 'Gujarat',
    paymentMethod: activeProfile.defaultPaymentMethod || 'UPI',
    customerType: 'Individual',
  }));

  const [customer, setCustomer] = useState({
    customerName: '',
    companyName: '',
    phone: '',
    email: '',
    gstin: '',
    state: activeProfile.state || 'Gujarat',
    city: 'Anand',
    pincode: '388001',
    billingAddress: '',
    shippingAddress: '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [items, setItems] = useState([]);
  const [applyRoundOff, setApplyRoundOff] = useState(true);
  const [notes, setNotes] = useState(activeProfile.defaultNotes || '');
  const [layoutMode, setLayoutMode] = useState('single'); // 'single' | 'multipage'
  const [validationError, setValidationError] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Field change handlers
  const handleInvoiceFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const handleCustomerFieldChange = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
      ...(sameAsBilling && field === 'billingAddress' ? { shippingAddress: value } : {}),
    }));
    setValidationError('');
  };

  const handleToggleSameAsBilling = () => {
    const nextVal = !sameAsBilling;
    setSameAsBilling(nextVal);
    if (nextVal) {
      setCustomer((prev) => ({ ...prev, shippingAddress: prev.billingAddress }));
    }
  };

  // Item Handlers
  const handleAddProductFromModal = (productItem) => {
    setItems((prev) => [...prev, { ...productItem, id: `item_${Date.now()}_${Math.random()}` }]);
    setValidationError('');
  };

  const handleAddCustomService = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}_${Math.random()}`,
        description: 'Site Installation & Fabrication Labor',
        variant: '',
        customNote: '',
        unit: 'Job',
        qty: 1,
        rate: 5000,
        discountType: 'amount',
        discountValue: 0,
        gstRate: activeProfile.defaultGstRate || 18,
      },
    ]);
    setValidationError('');
  };

  const handleUpdateItem = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic calculation
  const calculation = useMemo(() => {
    return calculateInvoice({
      items,
      placeOfSupply: formData.placeOfSupply,
      applyRoundOff,
    });
  }, [items, formData.placeOfSupply, applyRoundOff]);

  // Submit & Validation
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!customer.customerName.trim()) {
      setValidationError('Please enter Customer Name.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (!customer.billingAddress.trim()) {
      setValidationError('Please enter Customer Billing Address.');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    if (items.length === 0) {
      setValidationError('Please add at least one fabrication product or service to the invoice.');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.description?.trim()) {
        setValidationError(`Item #${i + 1} has an empty description.`);
        return;
      }
      if (Number(it.qty) <= 0) {
        setValidationError(`Item #${i + 1} (${it.description}) must have quantity greater than 0.`);
        return;
      }
      if (Number(it.rate) < 0) {
        setValidationError(`Item #${i + 1} (${it.description}) cannot have negative rate.`);
        return;
      }
    }

    // Capture an immutable snapshot of current business profile at creation time
    const companySnapshot = businessProfileStorage.getProfile();

    const completeInvoiceRecord = {
      invoiceNumber: formData.invoiceNumber.trim(),
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      placeOfSupply: formData.placeOfSupply,
      paymentMethod: formData.paymentMethod,
      customerType: formData.customerType,
      customer: {
        ...customer,
        shippingAddress: sameAsBilling ? customer.billingAddress : (customer.shippingAddress || customer.billingAddress),
      },
      items,
      calculation,
      notes,
      layoutMode,
      companySnapshot,
    };

    try {
      const saved = invoiceStorage.saveInvoice(completeInvoiceRecord);
      setPreviewInvoice(saved);
      setIsPreviewOpen(true);

      if (onInvoiceCreated) {
        onInvoiceCreated(saved);
      }
    } catch (err) {
      setValidationError(err.message || 'Failed to save invoice.');
    }
  };

  const handleFillSampleClient = () => {
    setCustomer({
      customerName: 'Mr. Arvindbhai Patel',
      companyName: 'Patel Residency & Bungalows',
      phone: '+91 98250 12345',
      email: 'arvind.patel@gmail.com',
      gstin: '24AABCP5678Q1Z2',
      state: 'Gujarat',
      city: 'Anand',
      pincode: '388001',
      billingAddress: 'Bungalow No. 12, Amul Dairy Road, Anand',
      shippingAddress: 'Bungalow No. 12, Amul Dairy Road, Anand',
    });
    setSameAsBilling(true);
  };

  return (
    <form onSubmit={handleCreateInvoice} className="space-y-6">
      {/* Top Banner with Quick Sample autofill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-100 p-4 rounded-xl border border-neutral-200">
        <div>
          <h2 className="text-sm font-bold text-neutral-900">New Architectural Fabrication Invoice</h2>
          <p className="text-xs text-neutral-500">Configure customer, units, and custom rates matching official reference</p>
        </div>
        <button
          type="button"
          onClick={handleFillSampleClient}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-[#C9A15A] text-xs font-semibold text-neutral-700 hover:text-[#885500] transition flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles size={13} className="text-[#C9A15A]" />
          <span>Fill Sample Anand Client</span>
        </button>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* 1. Company Information */}
      <CompanyInfoCard onNavigateToProfile={onNavigateToProfile} />

      {/* 2. Invoice Metadata */}
      <InvoiceDetailsCard
        formData={formData}
        onChangeField={handleInvoiceFieldChange}
      />

      {/* 3. Customer Details */}
      <CustomerDetailsCard
        customer={customer}
        sameAsBilling={sameAsBilling}
        onUpdateCustomer={handleCustomerFieldChange}
        onToggleSameAsBilling={handleToggleSameAsBilling}
      />

      {/* 4. Products Table */}
      <InvoiceItemsTable
        items={items}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
        onOpenProductModal={() => setIsProductModalOpen(true)}
        onAddCustomItem={handleAddCustomService}
      />

      {/* 5. A4 Page Layout Handling Option */}
      <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-3">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <Layers size={16} className="text-[#C9A15A]" />
            <span>A4 Document Layout Format</span>
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">Consolidated Single Invoice</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              layoutMode === 'single'
                ? 'border-[#C9A15A] bg-[#C9A15A]/5 ring-1 ring-[#C9A15A]'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="layoutMode"
              value="single"
              checked={layoutMode === 'single'}
              onChange={() => setLayoutMode('single')}
              className="mt-0.5 text-[#C9A15A] focus:ring-[#C9A15A]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <FileText size={14} className="text-[#C9A15A]" />
                <span className="text-xs font-bold text-neutral-900">Option 1: Single A4 Page (Default)</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                Fits complete invoice onto one A4 sheet. Dynamically adjusts table row spacing for up to 10-12 items.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              layoutMode === 'multipage'
                ? 'border-[#C9A15A] bg-[#C9A15A]/5 ring-1 ring-[#C9A15A]'
                : 'border-neutral-200 hover:border-neutral-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="layoutMode"
              value="multipage"
              checked={layoutMode === 'multipage'}
              onChange={() => setLayoutMode('multipage')}
              className="mt-0.5 text-[#C9A15A] focus:ring-[#C9A15A]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <Layers size={14} className="text-[#C9A15A]" />
                <span className="text-xs font-bold text-neutral-900">Option 2: Automatic Multi-page</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                If items exceed one page, continues the SAME invoice onto page 2+ with repeated table headers and page numbers.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 6. Summary & Taxation */}
      <InvoiceSummaryCard
        calculation={calculation}
        applyRoundOff={applyRoundOff}
        onToggleRoundOff={() => setApplyRoundOff(!applyRoundOff)}
        notes={notes}
        onChangeNotes={setNotes}
      />

      {/* 7. Bottom Submission Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-neutral-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-neutral-500 block">Final Payable Bill Amount:</span>
          <span className="font-mono text-xl font-black text-neutral-900">
            ₹{calculation.finalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-neutral-500 ml-2 font-medium">
            ({items.length} items configured • {layoutMode === 'single' ? 'Single A4 Page' : 'Multi-page'})
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#C9A15A] text-[#061411] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition shadow flex items-center justify-center gap-2"
            id="create-invoice-submit-btn"
          >
            <FilePlus2 size={16} />
            <span>Create &amp; Preview Invoice</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Product Selection Modal */}
      <ProductSelectorModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelectProduct={handleAddProductFromModal}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: generateNextInvoiceNumber(),
          }));
        }}
        invoice={previewInvoice}
      />
    </form>
  );
}
