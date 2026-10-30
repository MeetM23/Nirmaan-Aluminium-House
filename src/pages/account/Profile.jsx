// src/pages/account/Profile.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, Building, ShieldCheck, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    gstNumber: user?.gstNumber || '',
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // Change password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateUserProfile(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    setChangingPass(true);
    try {
      await profileService.changePassword(user.id, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully.');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="space-y-8">
        {/* Profile Details Form */}
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Client Profile</h2>
              <p className="text-xs text-white/50">Keep your billing and corporate contact details up to date</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C9A15A] text-[#061411] font-bold text-sm flex items-center justify-center">
              {user?.avatar || 'U'}
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Phone size={15} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  Company / Firm Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Building size={15} />
                  </div>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  Registered GSTIN Number
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white uppercase focus:border-[#C9A15A] focus:outline-none font-mono"
                  placeholder="24AAPCP5678Q1Z2"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-gold px-6 py-2.5 text-xs uppercase tracking-wider font-bold flex items-center gap-2"
              >
                <Save size={15} />
                <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h2 className="font-serif text-xl font-semibold text-white">Security &amp; Password</h2>
            <p className="text-xs text-white/50">Manage your authentication credentials</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={changingPass}
                className="px-6 py-2.5 rounded-xl border border-[#C9A15A]/40 text-[#C9A15A] hover:bg-[#C9A15A]/10 text-xs uppercase tracking-wider font-semibold transition"
              >
                {changingPass ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
