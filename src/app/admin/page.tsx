'use client';

import { useState, useEffect, useCallback } from 'react';
import { t } from '@/lib/translations';
import type { Lang, Reservation } from '@/types';
import AdminGate from '@/components/admin/AdminGate';
import ReservationTable from '@/components/admin/ReservationTable';
import LanguageToggle from '@/components/LanguageToggle';

export default function AdminPage() {
  const [lang, setLang] = useState<Lang>('ko');
  const [password, setPassword] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const tr = t[lang];

  const fetchReservations = useCallback(
    async (pw: string) => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await fetch('/api/reservations', {
          headers: { 'x-admin-password': pw },
        });
        if (res.status === 401) {
          setAuthError(true);
          setPassword(null);
          return;
        }
        if (!res.ok) {
          setFetchError(true);
          return;
        }
        const data: Reservation[] = await res.json();
        setReservations(data);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleAuth = (pw: string) => {
    setPassword(pw);
    // Store in session so refresh works
    sessionStorage.setItem('adminToken', pw);
    fetchReservations(pw);
  };

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('adminToken');
    if (stored) {
      setPassword(stored);
      fetchReservations(stored);
    }
  }, [fetchReservations]);

  const handleUpdate = (updated: Reservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  if (!password || authError) {
    return <AdminGate tr={tr} onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-50">{tr.adminTitle}</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle lang={lang} onChange={setLang} />
            <button
              onClick={() => {
                sessionStorage.removeItem('adminToken');
                setPassword(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : fetchError ? (
          <p className="text-sm text-red-400">{tr.fetchError}</p>
        ) : (
          <ReservationTable
            reservations={reservations}
            tr={tr}
            adminPassword={password}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
