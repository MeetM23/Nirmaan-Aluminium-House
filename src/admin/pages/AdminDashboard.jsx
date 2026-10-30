// src/admin/pages/AdminDashboard.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FilePlus2, History, ExternalLink, ShieldCheck, Building2 } from 'lucide-react';
import CreateInvoiceTab from './CreateInvoiceTab';
import InvoiceHistoryTab from './InvoiceHistoryTab';
import BusinessProfilePage from './BusinessProfilePage';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab directly from URL pathname for clean single-source-of-truth routing
  const activeTab = location.pathname.includes('/history')
    ? 'history'
    : location.pathname.includes('/profile')
    ? 'profile'
    : 'create';

  const handleTabChange = (tab) => {
    if (tab === 'history') {
      navigate('/admin/history');
    } else if (tab === 'profile') {
      navigate('/admin/profile');
    } else {
      navigate('/admin');
    }
  };

  return (
    <>
      <Helmet>
        <title>Invoice Generator – Nirmaan Aluminium House Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#F5F2EB] text-neutral-800 font-sans selection:bg-[#C9A15A]/30">
        {/* ── TOP ADMIN HEADER ── */}
        <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-horizontal-light.png"
                alt="Nirmaan Aluminium House"
                className="h-9 w-auto object-contain"
              />
              <span className="hidden sm:inline-block w-px h-5 bg-neutral-200" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Invoice Management
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C9A15A]/15 text-[#885500]">
                  <ShieldCheck size={11} />
                  <span>Internal Admin</span>
                </span>
              </div>
            </div>

            {/* Public site link */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium transition"
              >
                <span>Live Website</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 border-t border-neutral-100 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTabChange('create')}
              className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                activeTab === 'create'
                  ? 'border-[#061411] text-[#061411]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FilePlus2 size={15} className={activeTab === 'create' ? 'text-[#C9A15A]' : ''} />
              <span>Create Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('history')}
              className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                activeTab === 'history'
                  ? 'border-[#061411] text-[#061411]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <History size={15} className={activeTab === 'history' ? 'text-[#C9A15A]' : ''} />
              <span>Invoice History</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className={`py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                activeTab === 'profile'
                  ? 'border-[#061411] text-[#061411]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Building2 size={15} className={activeTab === 'profile' ? 'text-[#C9A15A]' : ''} />
              <span>Business Profile</span>
            </button>
          </div>
        </header>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'create' && (
            <CreateInvoiceTab
              onInvoiceCreated={() => {}}
              onNavigateToProfile={() => handleTabChange('profile')}
            />
          )}

          {activeTab === 'history' && <InvoiceHistoryTab />}

          {activeTab === 'profile' && (
            <BusinessProfilePage onProfileUpdated={() => {}} />
          )}
        </main>
      </div>
    </>
  );
}
