import React from 'react';
import { cn } from '@/lib/utils';

export interface FilterChip {
  value: string;
  label: string;
  count?: number;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

interface FilterChipsProps {
  chips: FilterChip[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const colorClasses = {
  default: {
    active: 'bg-primary text-primary-foreground shadow-md',
    inactive: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
  },
  success: {
    active: 'bg-status-active text-white shadow-md',
    inactive: 'bg-status-active/10 text-status-active hover:bg-status-active/20',
  },
  warning: {
    active: 'bg-status-expiring text-black shadow-md',
    inactive: 'bg-status-expiring/10 text-status-expiring hover:bg-status-expiring/20',
  },
  danger: {
    active: 'bg-status-overdue text-white shadow-md',
    inactive: 'bg-status-overdue/10 text-status-overdue hover:bg-status-overdue/20',
  },
  info: {
    active: 'bg-status-suspended text-white shadow-md',
    inactive: 'bg-status-suspended/10 text-status-suspended hover:bg-status-suspended/20',
  },
};

export function FilterChips({ chips, value, onChange, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const isActive = value === chip.value;
        const colors = colorClasses[chip.color || 'default'];
        
        return (
          <button
            key={chip.value}
            onClick={() => onChange(chip.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
              "border border-transparent",
              isActive ? colors.active : colors.inactive,
              isActive && "scale-[1.02]"
            )}
          >
            {chip.label}
            {chip.count !== undefined && (
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                isActive 
                  ? "bg-white/20 text-inherit" 
                  : "bg-background/80 text-foreground"
              )}>
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
