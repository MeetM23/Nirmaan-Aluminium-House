// src/pages/account/Addresses.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, MapPin, Trash2, Edit2, Check, X, Building, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import { businessConfig } from '../../config/business';
import toast from 'react-hot-toast';

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    line1: '',
    line2: '',
    city: 'Anand',
    state: 'Gujarat',
    pincode: '388001',
    gstNumber: '',
    isDefault: false,
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const addrs = await profileService.getAddresses(user?.id);
      setAddresses(addrs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: user?.name || '',
      company: user?.company || '',
      phone: user?.phone || '',
      line1: '',
      line2: '',
      city: 'Anand',
      state: 'Gujarat',
      pincode: '388001',
      gstNumber: user?.gstNumber || '',
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr.id);
    setForm({ ...addr });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await profileService.updateAddress(user.id, editingId, form);
        toast.success('Address updated.');
      } else {
        await profileService.addAddress(user.id, form);
        toast.success('Address added.');
      }
      setModalOpen(false);
      await loadAddresses();
    } catch (err) {
      toast.error(err.message || 'Failed to save address.');
    }
  };

  const handleDelete = async (addrId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await profileService.deleteAddress(user.id, addrId);
      toast.success('Address removed.');
      await loadAddresses();
    } catch (err) {
      toast.error('Failed to delete address.');
    }
  };

  const handleSetDefault = async (addrId) => {
    try {
      await profileService.setDefaultAddress(user.id, addrId);
      toast.success('Default address updated.');
      await loadAddresses();
    } catch (err) {
      toast.error('Failed to set default.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Saved Addresses – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="space-y-6">
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Saved Addresses &amp; Sites</h2>
              <p className="text-xs text-white/50">Residential properties, project sites &amp; billing addresses</p>
            </div>
            <button
              onClick={openAddModal}
              className="btn-gold px-4 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Add New Address</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-white/50 text-xs">Loading saved addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="py-12 text-center text-white/50 text-xs">No saved addresses yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-xl border transition flex flex-col justify-between ${
                    addr.isDefault
                      ? 'bg-black/40 border-[#C9A15A] shadow-md ring-1 ring-[#C9A15A]/20'
                      : 'bg-black/25 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1.5 text-xs text-white/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C9A15A]/20 text-[#E2C285] text-[10px] font-bold uppercase tracking-wider">
                          Default Billing
                        </span>
                      )}
                    </div>
                    {addr.company && (
                      <p className="text-white/60 font-medium flex items-center gap-1.5">
                        <Building size={13} className="text-[#C9A15A]" />
                        <span>{addr.company}</span>
                      </p>
                    )}
                    <p className="text-white/70">{addr.line1}</p>
                    {addr.line2 && <p className="text-white/70">{addr.line2}</p>}
                    <p className="text-white/70">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-white/60 flex items-center gap-1.5 pt-1">
                      <Phone size={13} className="text-[#C9A15A]" />
                      <span>{addr.phone}</span>
                    </p>
                    {addr.gstNumber && (
                      <p className="text-[#E2C285] font-mono text-[11px] pt-1">
                        GSTIN: {addr.gstNumber}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[11px] text-[#C9A15A] hover:underline font-semibold"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <Check size={12} className="text-green-400" /> Default
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(addr)}
                        className="p-1.5 text-white/50 hover:text-white transition"
                        title="Edit address"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-1.5 text-white/50 hover:text-red-400 transition"
                        title="Delete address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1F1A] border border-[#C9A15A]/30 w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-semibold text-white">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={form.gstNumber}
                    onChange={(e) => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  placeholder="Street / Society"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  placeholder="Landmark"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-2 py-2 rounded-lg bg-[#061411] border border-white/15 text-xs text-white"
                  >
                    {businessConfig.indianStates.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="accent-[#C9A15A]"
                  />
                  <span className="text-xs text-white/90">Set as default billing address</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/15 text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
