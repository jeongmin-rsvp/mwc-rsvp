'use client';

import { TIME_SLOTS } from '@/lib/constants';
import type { BookedSlot } from '@/types';

interface Props {
  slotType: 'docent' | 'business';
  selectedDate: string | undefined;
  value: string | undefined;
  onChange: (time: string) => void;
  bookedSlots: BookedSlot[];
  suggestedSlot?: string | null;
  suggestedLabel?: string;
  error?: string;
}

export default function TimeSlotGrid({
  slotType,
  selectedDate,
  value,
  onChange,
  bookedSlots,
  suggestedSlot,
  suggestedLabel,
  error,
}: Props) {
  if (!selectedDate) {
    return (
      <p className="text-xs text-slate-500">날짜를 먼저 선택해주세요. / Please select a date first.</p>
    );
  }

  const bookedTimes = new Set(
    bookedSlots
      .filter((s) => s.slot_type === slotType && s.slot_date === selectedDate)
      .map((s) => s.slot_time)
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {TIME_SLOTS.map((time) => {
          const isBooked = bookedTimes.has(time);
          const isSelected = value === time;
          const isSuggested = suggestedSlot === time && !isBooked;

          return (
            <button
              key={time}
              type="button"
              disabled={isBooked}
              onClick={() => !isBooked && onChange(time)}
              className={`relative rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                isBooked
                  ? 'cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600 line-through'
                  : isSelected
                  ? 'border-sky-500 bg-sky-500 text-slate-950'
                  : isSuggested
                  ? 'border-yellow-400 bg-slate-900 text-yellow-300 ring-2 ring-yellow-400/60'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-500/60 hover:text-slate-100'
              }`}
            >
              {isSuggested && (
                <span className="absolute -top-2 -right-1 text-[9px] leading-none">★</span>
              )}
              {time}
            </button>
          );
        })}
      </div>
      {suggestedSlot && suggestedLabel && (
        <p className="mt-2 text-xs text-yellow-400">{suggestedLabel}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
