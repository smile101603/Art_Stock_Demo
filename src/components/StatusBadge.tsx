import { cn } from '@/lib/utils';

type StatusVariant = 'active' | 'expiring' | 'overdue' | 'suspended' | 'pending' | 'paid' | 'partial' | 'cancelled' | 'revoked';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  active: {
    label: 'Activo',
    className: 'bg-status-active/15 text-status-active border-status-active/30',
  },
  expiring: {
    label: 'Por vencer',
    className: 'bg-status-expiring/15 text-status-expiring border-status-expiring/30',
  },
  overdue: {
    label: 'Vencido',
    className: 'bg-status-overdue/15 text-status-overdue border-status-overdue/30',
  },
  suspended: {
    label: 'Suspendido',
    className: 'bg-status-suspended/15 text-status-suspended border-status-suspended/30',
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-status-pending/15 text-status-pending border-status-pending/30',
  },
  paid: {
    label: 'Pagado',
    className: 'bg-status-active/15 text-status-active border-status-active/30',
  },
  partial: {
    label: 'Parcial',
    className: 'bg-status-expiring/15 text-status-expiring border-status-expiring/30',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-muted text-muted-foreground border-border',
  },
  revoked: {
    label: 'Revocado',
    className: 'bg-status-overdue/15 text-status-overdue border-status-overdue/30',
  },
};

export function StatusBadge({ status, label, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.className,
        className
      )}
    >
      {label || config.label}
    </span>
  );
}
