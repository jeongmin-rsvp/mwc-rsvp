'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormValues } from '@/lib/validations';
import { t } from '@/lib/translations';
import type { BookedSlot, Lang } from '@/types';
import LanguageToggle from './LanguageToggle';
import DocentSection from './DocentSection';
import BusinessSection from './BusinessSection';
import ThankYouMessage from './ThankYouMessage';

const MEETING_TYPES = ['docent', 'business', 'both'] as const;

export default function RSVPForm() {
  const [lang, setLang] = useState<Lang>('ko');
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tr = t[lang];

  const methods = useForm<ReservationFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reservationSchema) as Resolver<ReservationFormValues>,
    shouldUnregister: true,
    defaultValues: { mwc_participation: undefined },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const mwcParticipation = watch('mwc_participation');
  const meetingType = watch('meeting_type');

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBookedSlots(data);
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (values: ReservationFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setSubmitError(tr.slotTaken);
        } else {
          setSubmitError(err?.error ?? tr.submitError);
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(tr.submitError);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
        <main className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur">
          <ThankYouMessage tr={tr} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <main className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              {tr.eventLabel}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              {tr.formTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{tr.formSubtitle}</p>
          </div>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">{tr.company}</label>
              <input
                {...register('company')}
                placeholder={tr.companyPlaceholder}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
              />
              {errors.company && (
                <p className="text-xs text-red-400">{tr.required}</p>
              )}
            </div>

            {/* MWC Participation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">{tr.mwcParticipation}</label>
              <div className="grid grid-cols-2 gap-3">
                {(['yes', 'no'] as const).map((v) => (
                  <label
                    key={v}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 transition hover:border-sky-500/70 hover:bg-slate-900"
                  >
                    <input
                      type="radio"
                      value={v}
                      {...register('mwc_participation')}
                      className="accent-sky-500"
                    />
                    {v === 'yes' ? tr.mwcYes : tr.mwcNo}
                  </label>
                ))}
              </div>
              {errors.mwc_participation && (
                <p className="text-xs text-red-400">{tr.required}</p>
              )}
            </div>

            {/* If attending MWC */}
            {mwcParticipation === 'yes' && (
              <>
                {/* Lead contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">{tr.leadName}</label>
                    <input
                      {...register('lead_name')}
                      placeholder={tr.leadNamePlaceholder}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">{tr.leadEmail}</label>
                    <input
                      {...register('lead_email')}
                      type="email"
                      placeholder={tr.leadEmailPlaceholder}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-500"
                    />
                    {errors.lead_email && (
                      <p className="text-xs text-red-400">{tr.invalidEmail}</p>
                    )}
                  </div>
                </div>

                {/* Meeting type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-200">{tr.meetingType}</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {MEETING_TYPES.map((type) => {
                      const labels = {
                        docent: { title: tr.meetingDocent, desc: tr.meetingDocentDesc },
                        business: { title: tr.meetingBusiness, desc: tr.meetingBusinessDesc },
                        both: { title: tr.meetingBoth, desc: tr.meetingBothDesc },
                      };
                      return (
                        <label
                          key={type}
                          className="flex cursor-pointer gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 p-3 text-sm transition hover:border-sky-500/70"
                        >
                          <input
                            type="radio"
                            value={type}
                            {...register('meeting_type')}
                            className="mt-0.5 accent-sky-500 shrink-0"
                          />
                          <div>
                            <p className="font-medium text-slate-200">{labels[type].title}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{labels[type].desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.meeting_type && (
                    <p className="text-xs text-red-400">{tr.required}</p>
                  )}
                </div>

                {/* Docent section */}
                {(meetingType === 'docent' || meetingType === 'both') && (
                  <DocentSection lang={lang} tr={tr} bookedSlots={bookedSlots} />
                )}

                {/* Business section */}
                {(meetingType === 'business' || meetingType === 'both') && (
                  <BusinessSection lang={lang} tr={tr} bookedSlots={bookedSlots} />
                )}
              </>
            )}

            {/* Submit */}
            {submitError && (
              <p className="rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-2 text-sm text-red-400">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              {isSubmitting ? tr.submitting : tr.submit}
            </button>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}
