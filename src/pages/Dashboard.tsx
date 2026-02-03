import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  DollarSign,
  Boxes,
  MoreHorizontal,
  Eye,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardKPIs, mockInvoices } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Skeleton loader for KPI cards
function KPICardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [currency, setCurrency] = useState('USD');
  const [invoiceFilter, setInvoiceFilter] = useState('all');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const allPendingInvoices = mockInvoices.filter(i => i.status !== 'paid');
  
  const filteredInvoices = allPendingInvoices.filter(inv => {
    if (invoiceFilter === 'all') return true;
    return inv.status === invoiceFilter;
  });

  const invoiceChips: FilterChip[] = [
    { value: 'all', label: 'Todas', count: allPendingInvoices.length },
    { value: 'pending', label: 'Pendientes', count: allPendingInvoices.filter(i => i.status === 'pending').length, color: 'warning' },
    { value: 'overdue', label: 'Vencidas', count: allPendingInvoices.filter(i => i.status === 'overdue').length, color: 'danger' },
    { value: 'partial', label: 'Parciales', count: allPendingInvoices.filter(i => i.status === 'partial').length, color: 'info' },
  ];

  const handleRecordPayment = (invoiceId: string) => {
    toast.success(`Pago registrado para ${invoiceId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumen operativo de Art Stock
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="PEN">PEN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards Grid - Row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            <KPICard
              title="Suscripciones Activas"
              value={dashboardKPIs.activeSubscriptions}
              icon={FileText}
              trend={{ value: 12, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Por Vencer"
              value={dashboardKPIs.expiringSubscriptions}
              subtitle="Próximos 7 días"
              icon={Clock}
              variant="warning"
            />
            <KPICard
              title="Vencidas"
              value={dashboardKPIs.overdueSubscriptions}
              subtitle="Requieren atención"
              icon={AlertTriangle}
              variant="danger"
            />
            <KPICard
              title="Clientes Activos"
              value={dashboardKPIs.activeCustomers}
              icon={Users}
              trend={{ value: 8, isPositive: true }}
              variant="info"
            />
          </>
        )}
      </div>

      {/* KPI Cards Grid - Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            <KPICard
              title="Facturas Pendientes"
              value={dashboardKPIs.pendingInvoices}
              icon={CreditCard}
              variant="warning"
            />
            <KPICard
              title="Por Cobrar"
              value={`$${currency === 'USD' ? dashboardKPIs.totalToCollect.USD.toLocaleString() : dashboardKPIs.totalToCollect.PEN.toLocaleString()}`}
              subtitle={currency}
              icon={DollarSign}
              variant="danger"
            />
            <KPICard
              title="Cobrado este mes"
              value={`$${currency === 'USD' ? dashboardKPIs.collectedThisMonth.USD.toLocaleString() : dashboardKPIs.collectedThisMonth.PEN.toLocaleString()}`}
              subtitle={currency}
              icon={TrendingUp}
              trend={{ value: 15, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Proyectado"
              value={`$${currency === 'USD' ? dashboardKPIs.projectedRevenue.USD.toLocaleString() : dashboardKPIs.projectedRevenue.PEN.toLocaleString()}`}
              subtitle="Renovaciones del mes"
              icon={ArrowUpRight}
              variant="info"
            />
          </>
        )}
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Facturas por Cobrar</h2>
            <p className="text-sm text-muted-foreground">
              {allPendingInvoices.length} facturas pendientes de pago
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FilterChips 
              chips={invoiceChips} 
              value={invoiceFilter} 
              onChange={setInvoiceFilter} 
            />
            <Button variant="default" size="sm" className="h-8 btn-primary-glow">
              Ver todas
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-muted/70 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Período</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencimiento</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="py-2.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <CreditCard className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No hay facturas en este estado</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-foreground">
                            {invoice.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{invoice.customerName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{invoice.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{invoice.product}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.period}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground text-sm">
                        ${invoice.amount.toFixed(2)}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">{invoice.currency}</span>
                      {invoice.paidAmount && (
                        <p className="text-xs text-status-active">
                          Pagado: ${invoice.paidAmount.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRecordPayment(invoice.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Registrar pago
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            Marcar seguimiento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3 bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Mostrando {Math.min(10, filteredInvoices.length)} de {filteredInvoices.length} facturas
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <span className="px-3 text-sm text-muted-foreground">1 de 1</span>
            <Button variant="outline" size="sm" disabled>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
