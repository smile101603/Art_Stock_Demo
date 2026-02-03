import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CreditCard,
  Calendar,
  FileText,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Send,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock invoices for billing
interface BillingInvoice {
  id: string;
  customer: string;
  customerId: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: 'USD' | 'PEN';
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  product: string;
}

const mockBillingInvoices: BillingInvoice[] = [
  { id: 'INV-2025-001', customer: 'María García López', customerId: 'CLI-001', date: '2025-01-15', dueDate: '2025-01-30', amount: 54.99, currency: 'USD', status: 'pending', product: 'Adobe Creative Cloud' },
  { id: 'INV-2025-002', customer: 'TechSoft SAC', customerId: 'CLI-002', date: '2025-01-10', dueDate: '2025-01-25', amount: 199.99, currency: 'USD', status: 'overdue', product: 'Microsoft 365' },
  { id: 'INV-2025-003', customer: 'Carlos Mendoza', customerId: 'CLI-003', date: '2025-01-12', dueDate: '2025-01-27', amount: 20.00, currency: 'USD', status: 'paid', product: 'ChatGPT Plus' },
  { id: 'INV-2025-004', customer: 'Digital Reseller Pro', customerId: 'CLI-004', date: '2025-01-08', dueDate: '2025-01-23', amount: 350.00, currency: 'USD', status: 'partial', paidAmount: 200.00, product: 'Multiple Products' },
  { id: 'INV-2025-005', customer: 'Andrea Ruiz', customerId: 'CLI-005', date: '2025-01-14', dueDate: '2025-01-29', amount: 15.99, currency: 'USD', status: 'pending', product: 'Netflix Premium' },
  { id: 'INV-2025-006', customer: 'Innovate Solutions', customerId: 'CLI-006', date: '2025-01-05', dueDate: '2025-01-20', amount: 89.99, currency: 'USD', status: 'overdue', product: 'Canva Pro' },
  { id: 'INV-2025-007', customer: 'Juan Pablo Torres', customerId: 'CLI-007', date: '2025-01-16', dueDate: '2025-01-31', amount: 45.00, currency: 'USD', status: 'pending', product: 'Figma Organization' },
  { id: 'INV-2025-008', customer: 'Creative Studio Lima', customerId: 'CLI-008', date: '2025-01-11', dueDate: '2025-01-26', amount: 120.00, currency: 'PEN', status: 'paid', product: 'Adobe Photoshop' },
];

// KPI calculations
const totalInvoices = mockBillingInvoices.length;
const pendingInvoices = mockBillingInvoices.filter(i => i.status === 'pending').length;
const overdueInvoices = mockBillingInvoices.filter(i => i.status === 'overdue').length;
const collectedThisMonth = mockBillingInvoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);

// Payment Modal
function PaymentModal({ invoice, open, onOpenChange }: { invoice: BillingInvoice | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'transfer',
    reference: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData(prev => ({
        ...prev,
        amount: String(invoice.amount - (invoice.paidAmount || 0)),
      }));
    }
  }, [invoice]);

  const handleSubmit = () => {
    toast.success("Pago registrado exitosamente");
    onOpenChange(false);
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-status-active" />
            Registrar Pago
          </DialogTitle>
          <DialogDescription>
            Factura: {invoice.id} - {invoice.customer}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto total:</span>
              <span className="font-medium">${invoice.amount.toFixed(2)} {invoice.currency}</span>
            </div>
            {invoice.paidAmount && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Ya pagado:</span>
                <span className="font-medium text-status-active">${invoice.paidAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mt-1 pt-1 border-t border-border">
              <span className="text-muted-foreground">Pendiente:</span>
              <span className="font-bold text-foreground">${(invoice.amount - (invoice.paidAmount || 0)).toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha de pago</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Método de pago</Label>
            <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Transferencia</SelectItem>
                <SelectItem value="card">Tarjeta</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="yape">Yape/Plin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referencia / Comprobante</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Número de operación"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="btn-primary-glow">
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirmar pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Billing() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredInvoices = mockBillingInvoices.filter(invoice => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
    if (searchQuery && !invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !invoice.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusChips: FilterChip[] = [
    { value: 'all', label: 'Todas', count: mockBillingInvoices.length },
    { value: 'pending', label: 'Pendientes', count: pendingInvoices, color: 'warning' },
    { value: 'overdue', label: 'Vencidas', count: overdueInvoices, color: 'danger' },
    { value: 'partial', label: 'Parciales', count: mockBillingInvoices.filter(i => i.status === 'partial').length, color: 'info' },
    { value: 'paid', label: 'Pagadas', count: mockBillingInvoices.filter(i => i.status === 'paid').length, color: 'success' },
  ];

  const handleRegisterPayment = (invoice: BillingInvoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalOpen(true);
  };

  const handleResend = (invoice: BillingInvoice) => {
    toast.success(`Factura ${invoice.id} reenviada a ${invoice.customer}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cobranza</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de facturación y pagos pendientes
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          <>
            <KPICard
              title="Total Facturas"
              value={totalInvoices}
              icon={FileText}
              variant="info"
            />
            <KPICard
              title="Pendientes"
              value={pendingInvoices}
              icon={Clock}
              variant="warning"
            />
            <KPICard
              title="Vencidas"
              value={overdueInvoices}
              icon={AlertTriangle}
              variant="danger"
            />
            <KPICard
              title="Recaudado"
              value={`$${collectedThisMonth.toFixed(2)}`}
              subtitle="Este mes"
              icon={TrendingUp}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips 
          chips={statusChips} 
          value={statusFilter} 
          onChange={setStatusFilter} 
        />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o factura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9"
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
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Factura</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencimiento</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="py-2.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <CreditCard className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron facturas</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-primary">{invoice.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                          <span className="text-xs font-medium">{invoice.customer.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-foreground">{invoice.customer}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.product}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.date}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{invoice.dueDate}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">${invoice.amount.toFixed(2)}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{invoice.currency}</span>
                      {invoice.paidAmount && (
                        <p className="text-xs text-status-active">Pagado: ${invoice.paidAmount.toFixed(2)}</p>
                      )}
                    </td>
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
                            Ver
                          </DropdownMenuItem>
                          {invoice.status !== 'paid' && (
                            <DropdownMenuItem onClick={() => handleRegisterPayment(invoice)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Registrar pago
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleResend(invoice)}>
                            <Send className="mr-2 h-4 w-4" />
                            Reenviar factura
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
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        invoice={selectedInvoice} 
        open={paymentModalOpen} 
        onOpenChange={setPaymentModalOpen} 
      />
    </div>
  );
}
