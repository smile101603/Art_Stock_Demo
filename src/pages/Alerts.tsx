import React, { useState, useEffect } from 'react';
import { 
  Bell,
  AlertTriangle,
  Clock,
  CreditCard,
  Package,
  Check,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Alert types
interface Alert {
  id: string;
  type: 'subscription_expiring' | 'invoice_overdue' | 'payment_failed' | 'inventory_low';
  message: string;
  detail: string;
  date: string;
  read: boolean;
  severity: 'warning' | 'danger' | 'info';
}

const mockAlerts: Alert[] = [
  { id: 'ALT-001', type: 'subscription_expiring', message: 'Suscripción por vencer', detail: 'Adobe CC - María García vence en 3 días', date: '2025-01-15 10:30', read: false, severity: 'warning' },
  { id: 'ALT-002', type: 'invoice_overdue', message: 'Factura vencida', detail: 'INV-2025-002 - TechSoft SAC - $199.99 USD', date: '2025-01-15 09:15', read: false, severity: 'danger' },
  { id: 'ALT-003', type: 'payment_failed', message: 'Pago fallido', detail: 'Tarjeta rechazada - Digital Reseller Pro', date: '2025-01-14 16:45', read: false, severity: 'danger' },
  { id: 'ALT-004', type: 'inventory_low', message: 'Inventario bajo', detail: 'Netflix Premium - Solo 2 slots disponibles', date: '2025-01-14 14:20', read: true, severity: 'warning' },
  { id: 'ALT-005', type: 'subscription_expiring', message: 'Suscripción por vencer', detail: 'ChatGPT Plus - Carlos Mendoza vence en 5 días', date: '2025-01-14 11:00', read: true, severity: 'warning' },
  { id: 'ALT-006', type: 'invoice_overdue', message: 'Factura vencida', detail: 'INV-2025-006 - Innovate Solutions - $89.99 USD', date: '2025-01-13 18:30', read: false, severity: 'danger' },
  { id: 'ALT-007', type: 'inventory_low', message: 'Inventario bajo', detail: 'Spotify Family - Solo 1 slot disponible', date: '2025-01-13 15:10', read: true, severity: 'info' },
  { id: 'ALT-008', type: 'subscription_expiring', message: 'Suscripción por vencer', detail: 'Canva Pro - Andrea Ruiz vence en 7 días', date: '2025-01-12 09:00', read: true, severity: 'info' },
];

const alertTypeIcons: Record<string, React.ElementType> = {
  subscription_expiring: Clock,
  invoice_overdue: CreditCard,
  payment_failed: AlertTriangle,
  inventory_low: Package,
};

const alertTypeLabels: Record<string, string> = {
  subscription_expiring: 'Suscripción',
  invoice_overdue: 'Factura',
  payment_failed: 'Pago',
  inventory_low: 'Inventario',
};

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  const filteredAlerts = alerts.filter(alert => {
    if (typeFilter !== 'all' && alert.type !== typeFilter) return false;
    if (readFilter === 'unread' && alert.read) return false;
    if (readFilter === 'read' && !alert.read) return false;
    return true;
  });

  const typeChips: FilterChip[] = [
    { value: 'all', label: 'Todas', count: alerts.length },
    { value: 'subscription_expiring', label: 'Suscripciones', count: alerts.filter(a => a.type === 'subscription_expiring').length, color: 'warning' },
    { value: 'invoice_overdue', label: 'Facturas', count: alerts.filter(a => a.type === 'invoice_overdue').length, color: 'danger' },
    { value: 'payment_failed', label: 'Pagos', count: alerts.filter(a => a.type === 'payment_failed').length, color: 'danger' },
    { value: 'inventory_low', label: 'Inventario', count: alerts.filter(a => a.type === 'inventory_low').length, color: 'info' },
  ];

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
    toast.success("Alerta marcada como leída");
  };

  const handleMarkSelectedAsRead = () => {
    setAlerts(prev => prev.map(a => selectedAlerts.has(a.id) ? { ...a, read: true } : a));
    setSelectedAlerts(new Set());
    toast.success(`${selectedAlerts.size} alertas marcadas como leídas`);
  };

  const handleDelete = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success("Alerta eliminada");
  };

  const handleDeleteSelected = () => {
    setAlerts(prev => prev.filter(a => !selectedAlerts.has(a.id)));
    toast.success(`${selectedAlerts.size} alertas eliminadas`);
    setSelectedAlerts(new Set());
  };

  const toggleSelectAlert = (alertId: string) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId);
    } else {
      newSelected.add(alertId);
    }
    setSelectedAlerts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(a => a.id)));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-8 w-8 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount} alertas sin leer
            </p>
          </div>
        </div>

        {selectedAlerts.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedAlerts.size} seleccionadas</span>
            <Button variant="outline" size="sm" onClick={handleMarkSelectedAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Marcar leídas
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeleteSelected} className="text-status-overdue hover:text-status-overdue">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips 
          chips={typeChips} 
          value={typeFilter} 
          onChange={setTypeFilter} 
        />

        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="unread">No leídas</SelectItem>
            <SelectItem value="read">Leídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-muted/30">
          <Checkbox 
            checked={selectedAlerts.size === filteredAlerts.length && filteredAlerts.length > 0}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">Seleccionar todas</span>
        </div>

        {/* Alert items */}
        <div className="divide-y divide-border">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            ))
          ) : filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No hay alertas</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const Icon = alertTypeIcons[alert.type];
              const severityColors: Record<string, string> = {
                warning: 'bg-status-expiring/10 text-status-expiring',
                danger: 'bg-status-overdue/10 text-status-overdue',
                info: 'bg-primary/10 text-primary',
              };

              return (
                <div 
                  key={alert.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent/20",
                    !alert.read && "bg-primary/5"
                  )}
                >
                  <Checkbox 
                    checked={selectedAlerts.has(alert.id)}
                    onCheckedChange={() => toggleSelectAlert(alert.id)}
                  />

                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    severityColors[alert.severity]
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "font-medium text-foreground",
                        !alert.read && "font-semibold"
                      )}>
                        {alert.message}
                      </p>
                      {!alert.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{alert.detail}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.date}</span>
                    
                    <div className="flex items-center gap-1">
                      {!alert.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-status-overdue"
                        onClick={() => handleDelete(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
