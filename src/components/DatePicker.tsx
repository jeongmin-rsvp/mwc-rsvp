'use client';

import { MWC_DATES, MWC_DATE_LABELS } from '@/lib/constants';
import type { Lang } from '@/types';

interface Props {
  lang: Lang;
  value: string | undefined;
  onChange: (date: string) => void;
  error?: string;
}

export default function DatePicker({ lang, value, onChange, error }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {MWC_DATES.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => onChange(date)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              value === date
                ? 'border-sky-500 bg-sky-500 text-slate-950'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500/60 hover:text-slate-100'
            }`}
          >
            {MWC_DATE_LABELS[date][lang]}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
