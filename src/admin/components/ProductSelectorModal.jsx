// src/admin/components/ProductSelectorModal.jsx
import { useState } from 'react';
import { X, Search, Check, Plus } from 'lucide-react';
import { products } from '../../data/products';
import { FABRICATION_UNITS } from '../config/companyConfig';

export default function ProductSelectorModal({ isOpen, onClose, onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [customUnit, setCustomUnit] = useState('Sq. Ft.');
  const [unitRate, setUnitRate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.shortName?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  const handlePickProduct = (prod) => {
    setSelectedProduct(prod);
    const finishes = prod.variants?.finish || [];
    const materials = prod.variants?.material || [];
    setSelectedFinish(finishes[0]?.name || '');
    setSelectedMaterial(materials[0]?.name || '');
    setCustomUnit(prod.unit?.replace('Custom ', '') || 'Sq. Ft.');
    setUnitRate('');
    setQuantity(1);
    setCustomNote('');
  };

  const handleAddConfirmed = () => {
    if (!selectedProduct) return;

    let variantStr = '';
    if (selectedFinish || selectedMaterial) {
      variantStr = [selectedFinish, selectedMaterial].filter(Boolean).join(' • ');
    }

    onSelectProduct({
      productId: selectedProduct.id,
      description: selectedProduct.name,
      variant: variantStr,
      customNote,
      unit: customUnit || 'Sq. Ft.',
      qty: Number(quantity) || 1,
      rate: Number(unitRate) || 0,
      discountType: 'amount',
      discountValue: 0,
      gstRate: 18,
      image: selectedProduct.image,
    });

    // Reset and close
    setSelectedProduct(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Select Fabrication Product</h2>
            <p className="text-xs text-neutral-500">Pick from official Nirmaan catalogue and customize fabrication specifications</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Product List (Col 7) */}
          <div className="md:col-span-7 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products by name or specification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-100/70 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A15A]/30 focus:border-[#C9A15A]"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => handlePickProduct(prod)}
                    className={`p-3 rounded-xl border flex items-center gap-3.5 cursor-pointer transition ${
                      isSelected
                        ? 'border-[#C9A15A] bg-[#C9A15A]/5 ring-1 ring-[#C9A15A]'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-14 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-neutral-400 font-semibold">{prod.number}</span>
                        <h4 className="font-semibold text-sm text-neutral-900 truncate">{prod.name}</h4>
                      </div>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">{prod.tagline}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-600 font-medium">
                        Unit: {prod.unit}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#C9A15A] text-white flex items-center justify-center flex-shrink-0">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Customization Panel (Col 5) */}
          <div className="md:col-span-5 bg-neutral-50 p-5 rounded-xl border border-neutral-200 flex flex-col justify-between">
            {selectedProduct ? (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <span className="text-[11px] font-mono text-[#C9A15A] font-bold">CONFIGURE ITEM</span>
                  <h3 className="font-bold text-base text-neutral-900 mt-0.5">{selectedProduct.name}</h3>
                </div>

                {/* Finish Selection */}
                {selectedProduct.variants?.finish?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Finish
                    </label>
                    <select
                      value={selectedFinish}
                      onChange={(e) => setSelectedFinish(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
                    >
                      {selectedProduct.variants.finish.map((f) => (
                        <option key={f.name} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Material Grade Selection */}
                {selectedProduct.variants?.material?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Material Grade
                    </label>
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
                    >
                      {selectedProduct.variants.material.map((m) => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Unit of Measure
                    </label>
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
                    >
                      {FABRICATION_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rate per Unit */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Unit Rate (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 1200"
                    value={unitRate}
                    onChange={(e) => setUnitRate(e.target.value)}
                    className="w-full text-sm font-semibold p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A]"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Enter customized rate agreed for this site.
                  </span>
                </div>

                {/* Custom Note/Dimensions */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Specific Dimensions / Site Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 40ft balcony facing east, toughened glass 12mm"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-[#C9A15A] resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <Plus size={32} className="mb-2 text-neutral-300" />
                <p className="text-xs font-medium">Select a product from the list to customize rate and specifications</p>
              </div>
            )}

            {/* Bottom Add button */}
            <div className="pt-4 border-t border-neutral-200 mt-4">
              <button
                type="button"
                disabled={!selectedProduct || !unitRate || Number(unitRate) <= 0}
                onClick={handleAddConfirmed}
                className="w-full py-2.5 px-4 rounded-lg bg-[#C9A15A] text-[#061411] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={15} />
                <span>Add Item to Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

