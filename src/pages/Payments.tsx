import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  Eye,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KPICard } from '@/components/KPICard';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock payments
interface Payment {
  id: string;
  customer: string;
  customerId: string;
  amount: number;
  currency: 'USD' | 'PEN';
  method: 'card' | 'transfer' | 'cash' | 'yape';
  status: 'confirmed' | 'pending';
  date: string;
  reference?: string;
  invoiceId?: string;
}

const mockPayments: Payment[] = [
  { id: 'PAY-001', customer: 'María García López', customerId: 'CLI-001', amount: 54.99, currency: 'USD', method: 'card', status: 'confirmed', date: '2025-01-15', reference: 'TXN-123456', invoiceId: 'INV-2025-001' },
  { id: 'PAY-002', customer: 'TechSoft SAC', customerId: 'CLI-002', amount: 199.99, currency: 'USD', method: 'transfer', status: 'confirmed', date: '2025-01-14', reference: 'BCP-789012', invoiceId: 'INV-2025-002' },
  { id: 'PAY-003', customer: 'Carlos Mendoza', customerId: 'CLI-003', amount: 20.00, currency: 'USD', method: 'yape', status: 'confirmed', date: '2025-01-14', reference: 'YAPE-345678' },
  { id: 'PAY-004', customer: 'Digital Reseller Pro', customerId: 'CLI-004', amount: 200.00, currency: 'USD', method: 'transfer', status: 'pending', date: '2025-01-13', reference: 'BN-901234' },
  { id: 'PAY-005', customer: 'Andrea Ruiz', customerId: 'CLI-005', amount: 15.99, currency: 'USD', method: 'card', status: 'confirmed', date: '2025-01-13', reference: 'TXN-567890' },
  { id: 'PAY-006', customer: 'Innovate Solutions', customerId: 'CLI-006', amount: 89.99, currency: 'USD', method: 'transfer', status: 'confirmed', date: '2025-01-12', reference: 'IBK-123789' },
  { id: 'PAY-007', customer: 'Juan Pablo Torres', customerId: 'CLI-007', amount: 45.00, currency: 'USD', method: 'cash', status: 'pending', date: '2025-01-12' },
  { id: 'PAY-008', customer: 'Creative Studio Lima', customerId: 'CLI-008', amount: 120.00, currency: 'PEN', method: 'yape', status: 'confirmed', date: '2025-01-11', reference: 'YAPE-456123' },
];

// Chart data
const weeklyPayments = [
  { day: 'Lun', amount: 320 },
  { day: 'Mar', amount: 450 },
  { day: 'Mié', amount: 280 },
  { day: 'Jue', amount: 520 },
  { day: 'Vie', amount: 380 },
  { day: 'Sáb', amount: 150 },
  { day: 'Dom', amount: 90 },
];

const methodIcons: Record<string, React.ElementType> = {
  card: CreditCard,
  transfer: Banknote,
  cash: Wallet,
  yape: Wallet,
};

const methodLabels: Record<string, string> = {
  card: 'Tarjeta',
  transfer: 'Transferencia',
  cash: 'Efectivo',
  yape: 'Yape/Plin',
};

// KPI calculations
const totalPayments = mockPayments.length;
const confirmedPayments = mockPayments.filter(p => p.status === 'confirmed').length;
const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
const totalAmount = mockPayments.filter(p => p.status === 'confirmed').reduce((acc, p) => acc + p.amount, 0);

// Receipt Modal
function ReceiptModal({ payment, open, onOpenChange }: { payment: Payment | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!payment) return null;

  const Icon = methodIcons[payment.method];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recibo de Pago
          </DialogTitle>
          <DialogDescription>
            {payment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground">Monto</p>
            <p className="text-3xl font-bold text-foreground">${payment.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{payment.currency}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Cliente</span>
              <span className="text-sm font-medium text-foreground">{payment.customer}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Método</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Icon className="h-4 w-4" />
                {methodLabels[payment.method]}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Fecha</span>
              <span className="text-sm font-medium text-foreground">{payment.date}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Estado</span>
              <span className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                payment.status === 'confirmed' ? 'text-status-active' : 'text-status-expiring'
              )}>
                {payment.status === 'confirmed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {payment.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
              </span>
            </div>
            {payment.reference && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Referencia</span>
                <span className="text-sm font-mono text-foreground">{payment.reference}</span>
              </div>
            )}
            {payment.invoiceId && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Factura</span>
                <span className="text-sm font-mono text-primary">{payment.invoiceId}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredPayments = mockPayments.filter(payment => {
    if (methodFilter !== 'all' && payment.method !== methodFilter) return false;
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (searchQuery && !payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !payment.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const methodChips: FilterChip[] = [
    { value: 'all', label: 'Todos', count: mockPayments.length },
    { value: 'card', label: 'Tarjeta', count: mockPayments.filter(p => p.method === 'card').length },
    { value: 'transfer', label: 'Transferencia', count: mockPayments.filter(p => p.method === 'transfer').length },
    { value: 'yape', label: 'Yape/Plin', count: mockPayments.filter(p => p.method === 'yape').length, color: 'info' },
    { value: 'cash', label: 'Efectivo', count: mockPayments.filter(p => p.method === 'cash').length },
  ];

  const handleViewReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setReceiptOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pagos</h1>
          <p className="text-sm text-muted-foreground">
            Historial de pagos registrados
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
              title="Total Pagos"
              value={totalPayments}
              icon={CreditCard}
              variant="info"
            />
            <KPICard
              title="Confirmados"
              value={confirmedPayments}
              icon={CheckCircle}
              variant="success"
            />
            <KPICard
              title="Pendientes"
              value={pendingPayments}
              icon={Clock}
              variant="warning"
            />
            <KPICard
              title="Monto Total"
              value={`$${totalAmount.toFixed(2)}`}
              icon={TrendingUp}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pagos por Semana</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyPayments}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips 
          chips={methodChips} 
          value={methodFilter} 
          onChange={setMethodFilter} 
        />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
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
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pago ID</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Método</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                <th className="py-2.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <CreditCard className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron pagos</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const Icon = methodIcons[payment.method];

                  return (
                    <tr key={payment.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-primary">{payment.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
                            <span className="text-xs font-medium">{payment.customer.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-foreground">{payment.customer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">${payment.amount.toFixed(2)}</span>
                        <span className="ml-1 text-xs text-muted-foreground">{payment.currency}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          <Icon className="h-3 w-3" />
                          {methodLabels[payment.method]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          payment.status === 'confirmed' 
                            ? 'bg-status-active/15 text-status-active' 
                            : 'bg-status-expiring/15 text-status-expiring'
                        )}>
                          {payment.status === 'confirmed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {payment.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{payment.date}</td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleViewReceipt(payment)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver recibo
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal 
        payment={selectedPayment} 
        open={receiptOpen} 
        onOpenChange={setReceiptOpen} 
      />
    </div>
  );
}
