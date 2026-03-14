'use client';

import type { Translations } from '@/lib/translations';

interface Props {
  tr: Translations;
}

export default function ThankYouMessage({ tr }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-50">{tr.thankYouTitle}</h2>
      <p className="max-w-sm text-sm text-slate-400">{tr.thankYouBody}</p>
    </div>
  );
}
