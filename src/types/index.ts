export type Lang = 'ko' | 'en';

export type MeetingType = 'docent' | 'business' | 'both';

export type ReservationStatus = 'pending' | 'approved' | 'rejected';

export interface Reservation {
  id: string;
  company: string;
  mwc_participation: 'yes' | 'no';
  lead_name: string | null;
  lead_email: string | null;
  meeting_type: MeetingType | null;
  docent_date: string | null;
  docent_time: string | null;
  docent_language: 'ko' | 'en' | null;
  biz_date: string | null;
  biz_time: string | null;
  biz_attendees: number | null;
  biz_agenda: string | null;
  status: ReservationStatus;
  created_at: string;
}

export interface BookedSlot {
  id: string;
  reservation_id: string;
  slot_type: 'docent' | 'business';
  slot_date: string;
  slot_time: string;
}

export interface RSVPFormValues {
  company: string;
  mwc_participation: 'yes' | 'no';
  lead_name?: string;
  lead_email?: string;
  meeting_type?: MeetingType;
  docent_date?: string;
  docent_time?: string;
  docent_language?: 'ko' | 'en';
  biz_date?: string;
  biz_time?: string;
  biz_attendees?: number;
  biz_agenda?: string;
}
