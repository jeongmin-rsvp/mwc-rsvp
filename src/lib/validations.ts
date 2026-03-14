import { z } from 'zod';

export const reservationSchema = z
  .object({
    company: z.string().min(1, 'required'),
    mwc_participation: z.enum(['yes', 'no']),
    lead_name: z.string().optional(),
    lead_email: z.string().email('invalidEmail').optional().or(z.literal('')),
    meeting_type: z.enum(['docent', 'business', 'both']).optional(),
    // Docent fields
    docent_date: z.string().optional(),
    docent_time: z.string().optional(),
    docent_language: z.enum(['ko', 'en']).optional(),
    // Business fields
    biz_date: z.string().optional(),
    biz_time: z.string().optional(),
    biz_attendees: z.coerce.number().int().positive().optional(),
    biz_agenda: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mwc_participation === 'yes') {
      if (!data.meeting_type) {
        ctx.addIssue({ code: 'custom', path: ['meeting_type'], message: 'required' });
      }
      if (data.meeting_type === 'docent' || data.meeting_type === 'both') {
        if (!data.docent_date) ctx.addIssue({ code: 'custom', path: ['docent_date'], message: 'required' });
        if (!data.docent_time) ctx.addIssue({ code: 'custom', path: ['docent_time'], message: 'required' });
        if (!data.docent_language) ctx.addIssue({ code: 'custom', path: ['docent_language'], message: 'required' });
      }
      if (data.meeting_type === 'business' || data.meeting_type === 'both') {
        if (!data.biz_date) ctx.addIssue({ code: 'custom', path: ['biz_date'], message: 'required' });
        if (!data.biz_time) ctx.addIssue({ code: 'custom', path: ['biz_time'], message: 'required' });
        if (!data.biz_attendees) ctx.addIssue({ code: 'custom', path: ['biz_attendees'], message: 'required' });
      }
    }
  });

export type ReservationFormValues = z.infer<typeof reservationSchema>;
