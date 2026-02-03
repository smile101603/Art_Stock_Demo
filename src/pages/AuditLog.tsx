import React, { useState, useEffect } from 'react';
import { getAuditLogs, type AuditLog } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Shield, 
  Clock,
  User,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Action labels and colors
const actionLabels: Record<string, { label: string; color: string }> = {
  login_success: { label: 'Inicio de sesión', color: 'bg-status-active/15 text-status-active' },
  logout: { label: 'Cierre de sesión', color: 'bg-muted text-muted-foreground' },
  profile_updated: { label: 'Perfil actualizado', color: 'bg-primary/15 text-primary' },
  settings_updated: { label: 'Configuración', color: 'bg-info/15 text-info' },
  role_changed: { label: 'Cambio de rol', color: 'bg-status-expiring/15 text-status-expiring' },
  user_status_changed: { label: 'Estado de usuario', color: 'bg-status-suspended/15 text-status-suspended' },
  password_change_requested: { label: 'Cambio de contraseña', color: 'bg-status-overdue/15 text-status-overdue' },
  '2fa_enabled': { label: '2FA habilitado', color: 'bg-status-active/15 text-status-active' },
  role_switched_demo: { label: 'Demo: Rol cambiado', color: 'bg-primary/15 text-primary' },
};

export default function AuditLog() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Load logs
  useEffect(() => {
    const timer = setTimeout(() => {
      const auditLogs = getAuditLogs();
      setLogs(auditLogs);
      setFilteredLogs(auditLogs);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.actorEmail.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query)
      );
    }

    setFilteredLogs(filtered);
  }, [logs, actionFilter, searchQuery]);

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const actionChips: FilterChip[] = [
    { value: 'all', label: 'Todos', count: logs.length },
    { value: 'login_success', label: 'Inicios', count: logs.filter(l => l.action === 'login_success').length, color: 'success' },
    { value: 'settings_updated', label: 'Config', count: logs.filter(l => l.action === 'settings_updated').length, color: 'info' },
    { value: 'role_changed', label: 'Roles', count: logs.filter(l => l.action === 'role_changed').length, color: 'warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
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
        <FilterChips 
          chips={actionChips} 
          value={actionFilter} 
          onChange={setActionFilter} 
        />
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por actor, detalle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[280px] pl-9"
            />
          </div>
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
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entidad</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Shield className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No hay registros de auditoría</p>
                    <p className="text-xs mt-1">Las acciones del sistema se registrarán aquí</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actionConfig = actionLabels[log.action] || { label: log.action, color: 'bg-muted text-muted-foreground' };
                  
                  return (
                    <tr 
                      key={log.id} 
                      className="border-b border-border/50 hover:bg-accent/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center flex-shrink-0">
                            <User className="h-3.5 w-3.5 text-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{log.actorEmail}</p>
                            <p className="text-xs text-muted-foreground capitalize">{log.actorRole.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', actionConfig.color)}>
                          {actionConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">{log.entityType}</span>
                        <span className="ml-1 text-xs text-muted-foreground font-mono">({log.entityId})</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">{log.details}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Detalle de Auditoría
            </DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha/Hora</p>
                  <p className="text-sm font-medium text-foreground">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actor</p>
                  <p className="text-sm font-medium text-foreground">{selectedLog.actorEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rol</p>
                  <p className="text-sm font-medium text-foreground capitalize">{selectedLog.actorRole.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Acción</p>
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    actionLabels[selectedLog.action]?.color || 'bg-muted text-muted-foreground'
                  )}>
                    {actionLabels[selectedLog.action]?.label || selectedLog.action}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Detalle</p>
                <p className="text-sm text-foreground mt-1">{selectedLog.details}</p>
              </div>

              {/* Before / After */}
              {(selectedLog.before || selectedLog.after) && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-3">Cambios</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLog.before && (
                      <div>
                        <p className="text-xs font-medium text-status-overdue mb-1">Antes</p>
                        <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-[120px]">
                          {JSON.stringify(selectedLog.before, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedLog.after && (
                      <div>
                        <p className="text-xs font-medium text-status-active mb-1">Después</p>
                        <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-[120px]">
                          {JSON.stringify(selectedLog.after, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
