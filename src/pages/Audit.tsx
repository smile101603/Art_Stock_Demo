import React, { useState, useEffect } from 'react';
import { Search, Shield, Eye, Calendar, User, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

// Mock audit logs
interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'export';
  resource: string;
  resourceId: string;
  status: 'success' | 'failed';
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    before: string;
    after: string;
  }[];
}
const mockAuditLogs: AuditLog[] = [{
  id: 'LOG-001',
  timestamp: '2025-01-15 14:30:25',
  actor: 'Admin',
  actorEmail: 'admin@artstock.com',
  action: 'Actualizó suscripción',
  actionType: 'update',
  resource: 'Subscription',
  resourceId: 'SUB-001',
  status: 'success',
  ipAddress: '192.168.1.100',
  userAgent: 'Chrome 120.0',
  changes: [{
    field: 'status',
    before: 'active',
    after: 'expiring'
  }, {
    field: 'expiryDate',
    before: '2025-01-30',
    after: '2025-01-20'
  }]
}, {
  id: 'LOG-002',
  timestamp: '2025-01-15 13:15:10',
  actor: 'Soporte',
  actorEmail: 'soporte@artstock.com',
  action: 'Registró pago',
  actionType: 'create',
  resource: 'Payment',
  resourceId: 'PAY-005',
  status: 'success',
  ipAddress: '192.168.1.105',
  userAgent: 'Firefox 121.0'
}, {
  id: 'LOG-003',
  timestamp: '2025-01-15 12:00:00',
  actor: 'Admin',
  actorEmail: 'admin@artstock.com',
  action: 'Exportó reporte CSV',
  actionType: 'export',
  resource: 'Report',
  resourceId: 'RPT-JAN-2025',
  status: 'success',
  ipAddress: '192.168.1.100',
  userAgent: 'Chrome 120.0'
}, {
  id: 'LOG-004',
  timestamp: '2025-01-15 11:45:30',
  actor: 'Ops',
  actorEmail: 'ops@artstock.com',
  action: 'Rotó credenciales',
  actionType: 'update',
  resource: 'Inventory',
  resourceId: 'INV-NF001',
  status: 'success',
  ipAddress: '192.168.1.110',
  userAgent: 'Chrome 120.0',
  changes: [{
    field: 'password',
    before: '••••••••',
    after: '••••••••'
  }]
}, {
  id: 'LOG-005',
  timestamp: '2025-01-15 10:30:15',
  actor: 'Admin',
  actorEmail: 'admin@artstock.com',
  action: 'Creó cliente',
  actionType: 'create',
  resource: 'Customer',
  resourceId: 'CLI-031',
  status: 'success',
  ipAddress: '192.168.1.100',
  userAgent: 'Chrome 120.0'
}, {
  id: 'LOG-006',
  timestamp: '2025-01-15 09:15:00',
  actor: 'Sistema',
  actorEmail: 'system@artstock.com',
  action: 'Suspendió suscripción',
  actionType: 'update',
  resource: 'Subscription',
  resourceId: 'SUB-015',
  status: 'success',
  ipAddress: '127.0.0.1',
  userAgent: 'System Cron',
  changes: [{
    field: 'status',
    before: 'overdue',
    after: 'suspended'
  }]
}, {
  id: 'LOG-007',
  timestamp: '2025-01-15 08:00:00',
  actor: 'Admin',
  actorEmail: 'admin@artstock.com',
  action: 'Inicio de sesión',
  actionType: 'login',
  resource: 'Session',
  resourceId: 'SES-001',
  status: 'success',
  ipAddress: '192.168.1.100',
  userAgent: 'Chrome 120.0'
}, {
  id: 'LOG-008',
  timestamp: '2025-01-14 18:30:00',
  actor: 'Unknown',
  actorEmail: 'unknown@external.com',
  action: 'Intento de acceso',
  actionType: 'login',
  resource: 'Session',
  resourceId: '-',
  status: 'failed',
  ipAddress: '203.0.113.50',
  userAgent: 'Unknown'
}, {
  id: 'LOG-009',
  timestamp: '2025-01-14 16:45:20',
  actor: 'Ops',
  actorEmail: 'ops@artstock.com',
  action: 'Eliminó producto',
  actionType: 'delete',
  resource: 'Product',
  resourceId: 'PROD-OLD-001',
  status: 'success',
  ipAddress: '192.168.1.110',
  userAgent: 'Chrome 120.0'
}, {
  id: 'LOG-010',
  timestamp: '2025-01-14 15:00:00',
  actor: 'Soporte',
  actorEmail: 'soporte@artstock.com',
  action: 'Visualizó credenciales',
  actionType: 'view',
  resource: 'Inventory',
  resourceId: 'INV-C001',
  status: 'success',
  ipAddress: '192.168.1.105',
  userAgent: 'Firefox 121.0'
}];
const actionTypeColors: Record<string, string> = {
  create: 'bg-status-active/15 text-status-active',
  update: 'bg-primary/15 text-primary',
  delete: 'bg-status-overdue/15 text-status-overdue',
  view: 'bg-muted text-muted-foreground',
  login: 'bg-info/15 text-info',
  export: 'bg-status-expiring/15 text-status-expiring'
};
const actionTypeLabels: Record<string, string> = {
  create: 'Crear',
  update: 'Actualizar',
  delete: 'Eliminar',
  view: 'Ver',
  login: 'Login',
  export: 'Exportar'
};

// Detail Modal
function AuditDetailModal({
  log,
  open,
  onOpenChange
}: {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!log) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Detalle de Auditoría
          </DialogTitle>
          <DialogDescription>
            {log.id} - {log.timestamp}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Actor</p>
              <p className="font-medium text-foreground">{log.actor}</p>
              <p className="text-xs text-muted-foreground">{log.actorEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estado</p>
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", log.status === 'success' ? 'bg-status-active/15 text-status-active' : 'bg-status-overdue/15 text-status-overdue')}>
                {log.status === 'success' ? 'Exitoso' : 'Fallido'}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground">Acción</p>
              <p className="font-medium text-foreground">{log.action}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Recurso</p>
              <p className="font-medium text-foreground">{log.resource}</p>
              <p className="text-xs font-mono text-primary">{log.resourceId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">IP</p>
              <p className="font-mono text-foreground">{log.ipAddress}</p>
            </div>
            <div>
              <p className="text-muted-foreground">User Agent</p>
              <p className="text-foreground text-xs">{log.userAgent}</p>
            </div>
          </div>

          {/* Changes */}
          {log.changes && log.changes.length > 0 && <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Cambios realizados</h4>
              <div className="space-y-2">
                {log.changes.map((change, index) => <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{change.field}:</span>
                    <code className="rounded bg-status-overdue/10 px-1.5 py-0.5 text-xs text-status-overdue">
                      {change.before}
                    </code>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <code className="rounded bg-status-active/10 px-1.5 py-0.5 text-xs text-status-active">
                      {change.after}
                    </code>
                  </div>)}
              </div>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
}
export default function Audit() {
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);
  const filteredLogs = mockAuditLogs.filter(log => {
    if (actionFilter !== 'all' && log.actionType !== actionFilter) return false;
    if (actorFilter !== 'all' && log.actor !== actorFilter) return false;
    if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) && !log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) && !log.actor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const actionChips: FilterChip[] = [{
    value: 'all',
    label: 'Todas',
    count: mockAuditLogs.length
  }, {
    value: 'create',
    label: 'Crear',
    count: mockAuditLogs.filter(l => l.actionType === 'create').length,
    color: 'success'
  }, {
    value: 'update',
    label: 'Actualizar',
    count: mockAuditLogs.filter(l => l.actionType === 'update').length
  }, {
    value: 'delete',
    label: 'Eliminar',
    count: mockAuditLogs.filter(l => l.actionType === 'delete').length,
    color: 'danger'
  }, {
    value: 'login',
    label: 'Login',
    count: mockAuditLogs.filter(l => l.actionType === 'login').length,
    color: 'info'
  }];
  const uniqueActors = [...new Set(mockAuditLogs.map(l => l.actor))];
  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };
  return <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auditoría</h1>
          <p className="text-sm text-muted-foreground">
            Registro de actividades del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips chips={actionChips} value={actionFilter} onChange={setActionFilter} />

        <div className="flex items-center gap-3">
          <div className="relative text-secondary">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar acción o recurso..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-[250px] pl-9" />
          </div>
          <Select value={actorFilter} onValueChange={setActorFilter}>
            <SelectTrigger className="w-[140px]">
              <User className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueActors.map(actor => <SelectItem key={actor} value={actor}>{actor}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-muted/70 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha/Hora</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actor</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recurso</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="py-2.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(8)].map((_, i) => <tr key={i} className="border-b border-border/50">
                    {[...Array(6)].map((_, j) => <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>)}
                  </tr>) : filteredLogs.length === 0 ? <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Shield className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron registros</p>
                  </td>
                </tr> : filteredLogs.map(log => <tr key={log.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                          <span className="text-xs font-medium">{log.actor.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{log.actor}</p>
                          <p className="text-xs text-muted-foreground">{log.actorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", actionTypeColors[log.actionType])}>
                          {actionTypeLabels[log.actionType]}
                        </span>
                        <span className="text-sm text-foreground">{log.action}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-foreground">{log.resource}</p>
                        <p className="text-xs font-mono text-primary">{log.resourceId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", log.status === 'success' ? 'bg-status-active/15 text-status-active' : 'bg-status-overdue/15 text-status-overdue')}>
                        {log.status === 'success' ? 'Exitoso' : 'Fallido'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8" onClick={() => handleViewDetail(log)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AuditDetailModal log={selectedLog} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>;
}