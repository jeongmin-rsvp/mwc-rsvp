'use client';

import type { Lang } from '@/types';

interface Props {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export default function LanguageToggle({ lang, onChange }: Props) {
  return (
    <div className="flex rounded-full border border-slate-700 bg-slate-900 p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => onChange('ko')}
        className={`rounded-full px-3 py-1 transition ${
          lang === 'ko'
            ? 'bg-sky-500 text-slate-950'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        KO
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`rounded-full px-3 py-1 transition ${
          lang === 'en'
            ? 'bg-sky-500 text-slate-950'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}
