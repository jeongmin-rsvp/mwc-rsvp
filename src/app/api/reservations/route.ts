import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { reservationSchema } from '@/lib/validations';

function authCheck(req: NextRequest): boolean {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

// GET: admin only
export async function GET(req: NextRequest) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: public RSVP submission
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  const supabase = getSupabaseAdmin();

  // Check slot availability for pending (informational — actual lock happens on approve)
  // We still allow multiple pending on same slot; just validate format
  const { data: inserted, error } = await supabase
    .from('reservations')
    .insert({
      company: data.company,
      mwc_participation: data.mwc_participation,
      lead_name: data.lead_name ?? null,
      lead_email: data.lead_email ?? null,
      meeting_type: data.meeting_type ?? null,
      docent_date: data.docent_date ?? null,
      docent_time: data.docent_time ?? null,
      docent_language: data.docent_language ?? null,
      biz_date: data.biz_date ?? null,
      biz_time: data.biz_time ?? null,
      biz_attendees: data.biz_attendees ?? null,
      biz_agenda: data.biz_agenda ?? null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(inserted, { status: 201 });
}
