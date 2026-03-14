'use client';

import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from './DatePicker';
import TimeSlotGrid from './TimeSlotGrid';
import { getSuggestedBizSlot } from '@/lib/constants';
import type { Lang, BookedSlot } from '@/types';
import type { Translations } from '@/lib/translations';
import type { ReservationFormValues } from '@/lib/validations';

interface Props {
  lang: Lang;
  tr: Translations;
  bookedSlots: BookedSlot[];
  showBizSuggestion?: boolean; // pass false for business section usage
}

export default function DocentSection({ lang, tr, bookedSlots }: Props) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<ReservationFormValues>();

  const docentTime = watch('docent_time');
  const meetingType = watch('meeting_type');
  const suggestedBiz = meetingType === 'both' && docentTime ? getSuggestedBizSlot(docentTime) : null;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5">
      <h3 className="text-sm font-semibold text-slate-200">{tr.docentSection}</h3>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.docentDate}</label>
        <Controller
          control={control}
          name="docent_date"
          render={({ field }) => (
            <DatePicker
              lang={lang}
              value={field.value}
              onChange={field.onChange}
              error={errors.docent_date?.message ? tr.required : undefined}
            />
          )}
        />
      </div>

      {/* Time */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.docentTime}</label>
        <Controller
          control={control}
          name="docent_time"
          render={({ field }) => (
            <TimeSlotGrid
              slotType="docent"
              selectedDate={watch('docent_date')}
              value={field.value}
              onChange={field.onChange}
              bookedSlots={bookedSlots}
              suggestedSlot={null}
              error={errors.docent_time?.message ? tr.required : undefined}
            />
          )}
        />
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.docentLanguage}</label>
        <Controller
          control={control}
          name="docent_language"
          render={({ field }) => (
            <div className="flex gap-3">
              {(['ko', 'en'] as const).map((l) => (
                <label key={l} className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input
                    type="radio"
                    value={l}
                    checked={field.value === l}
                    onChange={() => field.onChange(l)}
                    className="accent-sky-500"
                  />
                  {l === 'ko' ? tr.docentLangKo : tr.docentLangEn}
                </label>
              ))}
            </div>
          )}
        />
        {errors.docent_language && (
          <p className="text-xs text-red-400">{tr.required}</p>
        )}
      </div>
    </div>
  );
}
