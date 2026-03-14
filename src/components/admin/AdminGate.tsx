'use client';

import { useState } from 'react';
import type { Translations } from '@/lib/translations';

interface Props {
  tr: Translations;
  onAuth: (password: string) => void;
}

export default function AdminGate({ tr, onAuth }: Props) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) return;
    // We let the parent verify by attempting fetch; minimal client-side check
    setError(false);
    onAuth(pw);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >
        <h1 className="text-xl font-semibold text-slate-50">{tr.adminTitle}</h1>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">{tr.adminPasswordLabel}</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder={tr.adminPasswordPlaceholder}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
          />
          {error && <p className="text-xs text-red-400">{tr.adminLoginError}</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-sky-500 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400 transition"
        >
          {tr.adminLogin}
        </button>
      </form>
    </div>
  );
}
