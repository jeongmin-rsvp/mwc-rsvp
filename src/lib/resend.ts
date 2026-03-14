import { Resend } from 'resend';
import type { Reservation } from '@/types';

function formatSlot(date: string | null, time: string | null): string {
  if (!date || !time) return '-';
  return `${date} ${time}`;
}

function buildEmailHtml(reservation: Reservation, status: 'approved' | 'rejected'): string {
  const isApproved = status === 'approved';

  const docentInfo =
    reservation.meeting_type === 'docent' || reservation.meeting_type === 'both'
      ? `<tr><td style="padding:8px 0;color:#64748b;">VIP Docent Tour / VIP 도슨트 투어</td><td style="padding:8px 0;">${formatSlot(reservation.docent_date, reservation.docent_time)} (${reservation.docent_language === 'ko' ? '한국어' : 'English'})</td></tr>`
      : '';

  const bizInfo =
    reservation.meeting_type === 'business' || reservation.meeting_type === 'both'
      ? `<tr><td style="padding:8px 0;color:#64748b;">Business Meeting / 비즈니스 미팅</td><td style="padding:8px 0;">${formatSlot(reservation.biz_date, reservation.biz_time)} (${reservation.biz_attendees}명/pax)</td></tr>`
      : '';

  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:${isApproved ? '#0f172a' : '#ef4444'};padding:32px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:${isApproved ? '#94a3b8' : '#fecaca'};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">MWC 2027</p>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">
              ${isApproved ? '신청이 승인되었습니다 / RSVP Approved' : '신청이 거절되었습니다 / RSVP Rejected'}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;color:#0f172a;font-size:16px;">안녕하세요, ${reservation.lead_name ?? reservation.company}님 / Dear ${reservation.lead_name ?? reservation.company},</p>
            <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
              ${
                isApproved
                  ? 'MWC 2027 신청이 승인되었습니다. 아래 일정을 확인해주세요.<br>Your MWC 2027 request has been approved. Please see the confirmed schedule below.'
                  : '아쉽게도 이번 신청이 수락되지 않았습니다. 추후 다른 기회에 다시 만나 뵙기를 희망합니다.<br>Unfortunately, your request was not accepted this time. We hope to see you at another opportunity.'
              }
            </p>
            ${
              isApproved && (docentInfo || bizInfo)
                ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f8fafc;">
                <th style="padding:12px 16px;text-align:left;color:#0f172a;font-size:13px;font-weight:600;border-bottom:1px solid #e2e8f0;" colspan="2">확정 일정 / Confirmed Schedule</th>
              </tr>
              <tr><td colspan="2" style="padding:0 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${docentInfo}
                  ${bizInfo}
                </table>
              </td></tr>
            </table>`
                : ''
            }
            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;padding-top:16px;">
              This email was sent to ${reservation.lead_email ?? ''}.<br>
              삼성전자 MWC 2027 팀 / Samsung Electronics MWC 2027 Team
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendStatusEmail(
  reservation: Reservation,
  status: 'approved' | 'rejected'
): Promise<void> {
  if (!reservation.lead_email) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  const subject =
    status === 'approved'
      ? '[MWC 2027] 신청 승인 안내 / RSVP Approved'
      : '[MWC 2027] 신청 결과 안내 / RSVP Result';

  await resend.emails.send({
    from,
    to: reservation.lead_email,
    subject,
    html: buildEmailHtml(reservation, status),
  });
}
