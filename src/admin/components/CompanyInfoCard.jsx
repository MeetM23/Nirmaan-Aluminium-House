// src/admin/components/CompanyInfoCard.jsx
import { Building2, MapPin, Phone, Mail, Globe, Settings2 } from 'lucide-react';
import { businessProfileStorage } from '../services/businessProfileStorage';

export default function CompanyInfoCard({ onNavigateToProfile }) {
  const profile = businessProfileStorage.getProfile();

  const fullAddress = [
    profile.addressLine1,
    profile.addressLine2,
    `${profile.city}, ${profile.state} - ${profile.pincode}`,
    profile.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
          <Building2 size={18} className="text-[#C9A15A]" />
          <span>Biller Information (Your Business Profile)</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A15A]/15 text-[#885500]">
            Verified Anand Workshop
          </span>
          {onNavigateToProfile && (
            <button
              type="button"
              onClick={onNavigateToProfile}
              className="text-[11px] font-semibold text-[#885500] hover:text-[#553300] hover:underline flex items-center gap-1"
            >
              <Settings2 size={12} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <p className="font-bold text-sm text-neutral-900">{profile.companyName}</p>
          <p className="text-neutral-500 font-mono text-[11px]">{profile.legalName || profile.tagline}</p>
          <p className="text-neutral-600 flex items-start gap-1.5 mt-1">
            <MapPin size={13} className="text-[#C9A15A] shrink-0 mt-0.5" />
            <span>{fullAddress}</span>
          </p>
        </div>

        <div className="space-y-1.5 bg-neutral-50/70 p-3 rounded-lg border border-neutral-200/60">
          <p className="flex items-center gap-2 text-neutral-600">
            <Phone size={13} className="text-[#C9A15A]" />
            <span>{profile.primaryPhone} {profile.alternatePhone ? `/ ${profile.alternatePhone}` : ''}</span>
          </p>
          <p className="flex items-center gap-2 text-neutral-600">
            <Mail size={13} className="text-[#C9A15A]" />
            <span>{profile.email}</span>
          </p>
          <p className="flex items-center gap-2 text-neutral-600">
            <Globe size={13} className="text-[#C9A15A]" />
            <span>{profile.website}</span>
          </p>
          <p className="font-semibold text-neutral-900 pt-1 border-t border-neutral-200/60">
            GSTIN: <span className="font-mono">{profile.gstin}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
