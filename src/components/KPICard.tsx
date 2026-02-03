import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'border-border hover:border-primary/30',
  success: 'border-status-active/30 hover:border-status-active/50',
  warning: 'border-status-expiring/30 hover:border-status-expiring/50',
  danger: 'border-status-overdue/30 hover:border-status-overdue/50',
  info: 'border-info/30 hover:border-info/50',
};

const iconVariantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-status-active/10 text-status-active',
  warning: 'bg-status-expiring/10 text-status-expiring',
  danger: 'bg-status-overdue/10 text-status-overdue',
  info: 'bg-info/10 text-info',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        'kpi-card group',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-status-active' : 'text-status-overdue'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs mes anterior</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110',
            iconVariantStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
