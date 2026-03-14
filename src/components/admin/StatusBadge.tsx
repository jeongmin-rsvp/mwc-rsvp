import type { ReservationStatus } from '@/types';

interface Props {
  status: ReservationStatus;
  labels: { pending: string; approved: string; rejected: string };
}

const styles: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function StatusBadge({ status, labels }: Props) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
