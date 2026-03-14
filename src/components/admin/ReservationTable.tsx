'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';
import type { Reservation } from '@/types';
import type { Translations } from '@/lib/translations';

interface Props {
  reservations: Reservation[];
  tr: Translations;
  adminPassword: string;
  onUpdate: (updated: Reservation) => void;
}

export default function ReservationTable({ reservations, tr, adminPassword, onUpdate }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusLabels = {
    pending: tr.statusPending,
    approved: tr.statusApproved,
    rejected: tr.statusRejected,
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    setErrors((prev) => ({ ...prev, [id]: '' }));
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ status }),
      });

      if (res.status === 409) {
        setErrors((prev) => ({ ...prev, [id]: tr.slotTaken }));
        return;
      }
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, [id]: tr.fetchError }));
        return;
      }
      const updated: Reservation = await res.json();
      onUpdate(updated);
    } catch {
      setErrors((prev) => ({ ...prev, [id]: tr.fetchError }));
    } finally {
      setLoadingId(null);
    }
  };

  if (reservations.length === 0) {
    return <p className="text-sm text-slate-400">{tr.noData}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="w-full text-sm text-slate-300">
        <thead className="bg-slate-900 text-xs text-slate-400">
          <tr>
            {[
              tr.colCompany,
              tr.colMwc,
              tr.colContact,
              tr.colMeetingType,
              tr.colDocent,
              tr.colBiz,
              tr.colStatus,
              tr.colActions,
            ].map((h) => (
              <th key={h} className="whitespace-nowrap px-4 py-3 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {reservations.map((r) => (
            <tr key={r.id} className="hover:bg-slate-900/50 transition">
              <td className="px-4 py-3 font-medium text-slate-100">{r.company}</td>
              <td className="px-4 py-3">{r.mwc_participation}</td>
              <td className="px-4 py-3">
                <p>{r.lead_name ?? '-'}</p>
                <p className="text-xs text-slate-500">{r.lead_email ?? '-'}</p>
              </td>
              <td className="px-4 py-3">{r.meeting_type ?? '-'}</td>
              <td className="px-4 py-3 text-xs">
                {r.docent_date ? `${r.docent_date} ${r.docent_time} (${r.docent_language})` : '-'}
              </td>
              <td className="px-4 py-3 text-xs">
                {r.biz_date ? `${r.biz_date} ${r.biz_time} (${r.biz_attendees}명)` : '-'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} labels={statusLabels} />
              </td>
              <td className="px-4 py-3">
                {r.status === 'pending' ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(r.id, 'approved')}
                        disabled={loadingId === r.id}
                        className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-500 disabled:opacity-50 transition"
                      >
                        {loadingId === r.id ? tr.approving : tr.approve}
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'rejected')}
                        disabled={loadingId === r.id}
                        className="rounded-lg bg-red-700 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        {loadingId === r.id ? tr.approving : tr.reject}
                      </button>
                    </div>
                    {errors[r.id] && (
                      <p className="text-xs text-red-400">{errors[r.id]}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
