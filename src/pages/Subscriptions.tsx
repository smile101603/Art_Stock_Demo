import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  RefreshCw,
  History,
  Receipt,
  FileText,
  Clock,
  Key,
  Users,
  Package,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { CredentialReveal } from '@/components/CredentialReveal';
import { mockSubscriptions, mockAccessHistory, mockInvoices } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

// Type mapping
const typeLabels: Record<string, string> = {
  '1:1': 'Individual',
  '1:N': 'Compartida',
  'teams': 'Teams',
  'profile': 'Perfil',
  'key': 'Key',
};

const typeIcons: Record<string, React.ElementType> = {
  '1:1': Package,
  '1:N': Users,
  'teams': Users,
  'profile': Key,
  'key': Key,
};

// Event labels and colors
const eventLabels: Record<string, string> = {
  'assignment': 'Asignación',
  'replacement': 'Reposición',
  'reassignment': 'Reasignación',
  'update': 'Actualización',
  'suspension': 'Suspensión',
  'reactivation': 'Reactivación',
  'revocation': 'Revocación',
};

const eventColors: Record<string, string> = {
  'assignment': 'bg-status-active/15 text-status-active',
  'replacement': 'bg-status-expiring/15 text-status-expiring',
  'reassignment': 'bg-status-pending/15 text-status-pending',
  'update': 'bg-info/15 text-info',
  'suspension': 'bg-status-overdue/15 text-status-overdue',
  'reactivation': 'bg-status-active/15 text-status-active',
  'revocation': 'bg-status-overdue/15 text-status-overdue',
};

// Skeleton loader
function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-border/50">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="py-2.5 px-3">
          <Skeleton className="h-4 w-full max-w-[100px]" />
        </td>
      ))}
    </tr>
  );
}

// Expanded row detail component
function SubscriptionDetail({ subscription }: { subscription: typeof mockSubscriptions[0] }) {
  const [activeTab, setActiveTab] = useState('access');
  
  const accessHistory = mockAccessHistory.filter(h => 
    h.subscriptionId === subscription.id || 
    h.subscriptionId.includes(subscription.id.split('-')[1])
  ).slice(0, 10);
  
  const subscriptionInvoices = mockInvoices.filter(inv => 
    inv.customerId === subscription.customerId
  ).slice(0, 5);

  const TypeIcon = typeIcons[subscription.type] || Package;

  const handleRecordPayment = () => {
    toast.success("Pago registrado exitosamente");
  };

  return (
    <div className="border-t border-border bg-muted/10 animate-accordion-down">
      <div className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 bg-muted/50 p-1">
            <TabsTrigger 
              value="access" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Key className="mr-2 h-4 w-4" />
              Acceso
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <History className="mr-2 h-4 w-4" />
              Historial
            </TabsTrigger>
            <TabsTrigger 
              value="invoices" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Receipt className="mr-2 h-4 w-4" />
              Facturas
            </TabsTrigger>
          </TabsList>

          {/* Access Tab */}
          <TabsContent value="access" className="mt-0 animate-fade-in">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-muted-foreground">Tipo de licencia</span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      <TypeIcon className="h-3 w-3" />
                      {typeLabels[subscription.type]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-muted-foreground">Inventario ID</span>
                    <button className="text-sm font-mono font-medium text-primary hover:underline">
                      {subscription.inventoryId || 'Sin asignar'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-muted-foreground">Asignado el</span>
                    <span className="text-sm text-foreground">{subscription.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-muted-foreground">Vencimiento</span>
                    <span className="text-sm text-foreground">{subscription.expiryDate}</span>
                  </div>
                  {subscription.slots && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-muted-foreground">Slots</span>
                      <span className="text-sm text-foreground">
                        {subscription.slots.used} / {subscription.slots.total} ocupados
                      </span>
                    </div>
                  )}
                </div>

                <CredentialReveal 
                  username="artstock.user@gmail.com" 
                  password="SecureP@ss123!" 
                />
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0 animate-fade-in">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b border-border">
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Fecha/Hora</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Evento</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Inventario</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Cambio</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Ejecutor</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessHistory.length > 0 ? (
                      accessHistory.map((event) => (
                        <tr key={event.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                          <td className="py-2.5 px-3 text-muted-foreground text-xs">{event.timestamp}</td>
                          <td className="py-2.5 px-3">
                            <span className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                              eventColors[event.event]
                            )}>
                              {eventLabels[event.event]}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-xs">
                            {event.previousInventoryId ? (
                              <span>
                                <span className="text-muted-foreground">{event.previousInventoryId}</span>
                                <span className="mx-1">→</span>
                                <span className="text-primary">{event.inventoryId}</span>
                              </span>
                            ) : (
                              <span className="text-primary">{event.inventoryId}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-foreground text-sm">{event.change}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-xs">{event.executor}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-xs max-w-[200px] truncate">{event.note || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          <History className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          <p>Sin historial de acceso</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-0 animate-fade-in">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b border-border">
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Factura ID</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Período</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Vencimiento</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Estado</th>
                      <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase text-muted-foreground">Monto</th>
                      <th className="py-2.5 px-3 text-right text-xs font-semibold uppercase text-muted-foreground">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionInvoices.length > 0 ? (
                      subscriptionInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-xs text-primary">{invoice.id}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-sm">{invoice.period}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-sm">{invoice.dueDate}</td>
                          <td className="py-2.5 px-3"><StatusBadge status={invoice.status} /></td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-foreground">${invoice.amount.toFixed(2)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">{invoice.currency}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {invoice.status !== 'paid' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={handleRecordPayment}
                              >
                                <CreditCard className="mr-1.5 h-3 w-3" />
                                Registrar pago
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          <Receipt className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          <p>Sin facturas asociadas</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Subscriptions() {
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('expiry');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter and sort
  const filteredSubscriptions = mockSubscriptions
    .filter(sub => {
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
      if (searchQuery && !sub.product.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !sub.customerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'expiry') {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status quick filters
  const statusChips: FilterChip[] = [
    { value: 'all', label: 'Todas', count: mockSubscriptions.length },
    { value: 'active', label: 'Activas', count: mockSubscriptions.filter(s => s.status === 'active').length, color: 'success' },
    { value: 'expiring', label: 'Por vencer', count: mockSubscriptions.filter(s => s.status === 'expiring').length, color: 'warning' },
    { value: 'overdue', label: 'Vencidas', count: mockSubscriptions.filter(s => s.status === 'overdue').length, color: 'danger' },
    { value: 'suspended', label: 'Suspendidas', count: mockSubscriptions.filter(s => s.status === 'suspended').length, color: 'info' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suscripciones</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de suscripciones activas e historial
          </p>
        </div>
        <Button className="btn-primary-glow">
          <FileText className="mr-2 h-4 w-4" />
          Nueva suscripción
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips 
          chips={statusChips} 
          value={statusFilter} 
          onChange={setStatusFilter} 
        />

        {/* Search and filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Próx. vencimiento</SelectItem>
              <SelectItem value="status">Estado</SelectItem>
              <SelectItem value="amount">Monto</SelectItem>
              <SelectItem value="created">Creación</SelectItem>
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
                <th className="w-10 py-2.5 px-3"></th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto / Plan</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inicio</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencimiento</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cobranza</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                <th className="py-2.5 px-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <TableRowSkeleton cols={10} />
                  <TableRowSkeleton cols={10} />
                  <TableRowSkeleton cols={10} />
                  <TableRowSkeleton cols={10} />
                  <TableRowSkeleton cols={10} />
                </>
              ) : (
                paginatedSubscriptions.map((subscription) => {
                  const isExpanded = expandedRows.has(subscription.id);
                  const TypeIcon = typeIcons[subscription.type] || Package;
                  
                  return (
                    <React.Fragment key={subscription.id}>
                      <tr 
                        className={cn(
                          "border-b border-border/50 transition-all duration-150 cursor-pointer",
                          "hover:bg-accent/30",
                          isExpanded && "bg-accent/20"
                        )}
                        onClick={() => toggleRow(subscription.id)}
                      >
                        <td className="py-2.5 px-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(subscription.id);
                            }}
                          >
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded && "rotate-90 text-primary"
                            )} />
                          </Button>
                        </td>
                        <td className="py-2.5 px-3">
                          <div>
                            <p className="font-medium text-foreground">{subscription.product}</p>
                            <p className="text-xs text-muted-foreground">{subscription.plan}</p>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-foreground">
                                {subscription.customerName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-foreground truncate max-w-[120px]">{subscription.customerName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            <TypeIcon className="h-3 w-3" />
                            {typeLabels[subscription.type]}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground">{subscription.startDate}</td>
                        <td className="py-2.5 px-3 text-sm text-foreground">{subscription.expiryDate}</td>
                        <td className="py-2.5 px-3"><StatusBadge status={subscription.status} /></td>
                        <td className="py-2.5 px-3"><StatusBadge status={subscription.paymentStatus} /></td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-foreground">${subscription.amount.toFixed(2)}</span>
                          <span className="ml-1 text-xs text-muted-foreground">{subscription.currency}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalle
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Registrar pago
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Suspender
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reasignar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} className="p-0">
                            <SubscriptionDetail subscription={subscription} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredSubscriptions.length)} de {filteredSubscriptions.length}
            </p>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => {
                setItemsPerPage(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              Primera
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Anterior
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Siguiente
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              Última
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
