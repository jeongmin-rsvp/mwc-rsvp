import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendStatusEmail } from '@/lib/resend';
import type { Reservation } from '@/types';

function authCheck(req: NextRequest): boolean {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authCheck(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: { status: 'approved' | 'rejected' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.status !== 'approved' && body.status !== 'rejected') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch reservation
  const { data: reservation, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !reservation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // If approving, attempt to lock slots
  if (body.status === 'approved') {
    const slotsToInsert: {
      reservation_id: string;
      slot_type: string;
      slot_date: string;
      slot_time: string;
    }[] = [];

    if (
      reservation.meeting_type === 'docent' ||
      reservation.meeting_type === 'both'
    ) {
      if (reservation.docent_date && reservation.docent_time) {
        slotsToInsert.push({
          reservation_id: id,
          slot_type: 'docent',
          slot_date: reservation.docent_date,
          slot_time: reservation.docent_time,
        });
      }
    }

    if (
      reservation.meeting_type === 'business' ||
      reservation.meeting_type === 'both'
    ) {
      if (reservation.biz_date && reservation.biz_time) {
        slotsToInsert.push({
          reservation_id: id,
          slot_type: 'business',
          slot_date: reservation.biz_date,
          slot_time: reservation.biz_time,
        });
      }
    }

    if (slotsToInsert.length > 0) {
      const { error: slotError } = await supabase
        .from('booked_slots')
        .insert(slotsToInsert);

      if (slotError) {
        // UNIQUE violation = slot already taken
        if (slotError.code === '23505') {
          return NextResponse.json(
            { error: 'Slot conflict: already booked by another reservation.' },
            { status: 409 }
          );
        }
        return NextResponse.json({ error: slotError.message }, { status: 500 });
      }
    }
  }

  // Update status
  const { data: updated, error: updateError } = await supabase
    .from('reservations')
    .update({ status: body.status })
    .eq('id', id)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Send email (non-blocking — don't fail the response if email fails)
  try {
    await sendStatusEmail(updated as Reservation, body.status);
  } catch (emailErr) {
    console.error('Email send failed:', emailErr);
  }

  return NextResponse.json(updated);
}
