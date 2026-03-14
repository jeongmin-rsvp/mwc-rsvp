export const MWC_DATES = [
  '2027-03-01',
  '2027-03-02',
  '2027-03-03',
  '2027-03-04',
];

export const MWC_DATE_LABELS: Record<string, { ko: string; en: string }> = {
  '2027-03-01': { ko: '3월 1일 (월)', en: 'Mar 1 (Mon)' },
  '2027-03-02': { ko: '3월 2일 (화)', en: 'Mar 2 (Tue)' },
  '2027-03-03': { ko: '3월 3일 (수)', en: 'Mar 3 (Wed)' },
  '2027-03-04': { ko: '3월 4일 (목)', en: 'Mar 4 (Thu)' },
};

export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 9; h < 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots; // 09:00 ~ 17:30
})();

export function getSuggestedBizSlot(docentTime: string): string | null {
  const idx = TIME_SLOTS.indexOf(docentTime);
  if (idx === -1 || idx === TIME_SLOTS.length - 1) return null;
  return TIME_SLOTS[idx + 1];
}
