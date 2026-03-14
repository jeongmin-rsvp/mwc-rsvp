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
}

export default function BusinessSection({ lang, tr, bookedSlots }: Props) {
  const {
    control,
    watch,
    register,
    formState: { errors },
  } = useFormContext<ReservationFormValues>();

  const meetingType = watch('meeting_type');
  const docentTime = watch('docent_time');
  const suggestedBiz =
    meetingType === 'both' && docentTime ? getSuggestedBizSlot(docentTime) : null;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5">
      <h3 className="text-sm font-semibold text-slate-200">{tr.bizSection}</h3>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.bizDate}</label>
        <Controller
          control={control}
          name="biz_date"
          render={({ field }) => (
            <DatePicker
              lang={lang}
              value={field.value}
              onChange={field.onChange}
              error={errors.biz_date?.message ? tr.required : undefined}
            />
          )}
        />
      </div>

      {/* Time */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.bizTime}</label>
        <Controller
          control={control}
          name="biz_time"
          render={({ field }) => (
            <TimeSlotGrid
              slotType="business"
              selectedDate={watch('biz_date')}
              value={field.value}
              onChange={field.onChange}
              bookedSlots={bookedSlots}
              suggestedSlot={suggestedBiz}
              suggestedLabel={suggestedBiz ? `${tr.suggestedSlot}: ${suggestedBiz}` : undefined}
              error={errors.biz_time?.message ? tr.required : undefined}
            />
          )}
        />
      </div>

      {/* Attendees */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.bizAttendees}</label>
        <input
          type="number"
          min={1}
          placeholder={tr.bizAttendeesPlaceholder}
          {...register('biz_attendees', { valueAsNumber: true })}
          className="w-28 rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
        />
        {errors.biz_attendees && (
          <p className="text-xs text-red-400">{tr.required}</p>
        )}
      </div>

      {/* Agenda */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">{tr.bizAgenda}</label>
        <textarea
          rows={3}
          placeholder={tr.bizAgendaPlaceholder}
          {...register('biz_agenda')}
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500 resize-none"
        />
      </div>
    </div>
  );
}
