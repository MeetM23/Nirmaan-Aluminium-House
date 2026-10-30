// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#061411]">
        <div className="w-12 h-12 border-3 border-[#C9A15A]/30 border-t-[#C9A15A] rounded-full animate-spin mb-4" />
        <p className="text-[#C9A15A] font-serif tracking-wider">Securing session...</p>
      </div>
    );
  }

  if (!user) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  return children;
}
