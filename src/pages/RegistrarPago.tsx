import React, { useState, useEffect } from 'react';
import { 
  Wallet,
  Search,
  FileText,
  User,
  DollarSign,
  Calendar,
  Upload,
  CheckCircle,
  X,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
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
import { mockCustomers, mockInvoices } from '@/data/mockData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PaymentForm {
  invoiceId: string;
  customerId: string;
  amount: string;
  currency: 'USD' | 'PEN';
  method: 'transfer' | 'card' | 'cash' | 'yape' | 'plin';
  reference: string;
  paymentDate: string;
  notes: string;
  receiptFile: File | null;
}

const paymentMethods = {
  transfer: { label: 'Transferencia Bancaria', icon: Building2 },
  card: { label: 'Tarjeta', icon: CreditCard },
  cash: { label: 'Efectivo', icon: DollarSign },
  yape: { label: 'Yape', icon: Wallet },
  plin: { label: 'Plin', icon: Wallet },
};

export default function RegistrarPago() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentForm>({
    invoiceId: '',
    customerId: '',
    amount: '',
    currency: 'USD',
    method: 'transfer',
    reference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
    receiptFile: null,
  });
  const [showForm, setShowForm] = useState(false);

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomerData = selectedCustomer 
    ? mockCustomers.find(c => c.id === selectedCustomer)
    : null;

  const customerInvoices = selectedCustomer
    ? mockInvoices.filter(inv => inv.customerId === selectedCustomer && inv.status !== 'paid')
    : [];

  const selectedInvoiceData = selectedInvoice
    ? mockInvoices.find(inv => inv.id === selectedInvoice)
    : null;

  useEffect(() => {
    if (selectedCustomer) {
      setFormData(prev => ({ ...prev, customerId: selectedCustomer }));
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedInvoice && selectedInvoiceData) {
      setFormData(prev => ({
        ...prev,
        invoiceId: selectedInvoice,
        amount: selectedInvoiceData.amount.toString(),
        currency: selectedInvoiceData.currency,
      }));
    }
  }, [selectedInvoice, selectedInvoiceData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, receiptFile: file }));
    }
  };

  const handleSubmit = () => {
    if (!formData.customerId) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (!formData.invoiceId) {
      toast.error('Selecciona una factura');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }
    if (!formData.reference) {
      toast.error('Ingresa una referencia o número de comprobante');
      return;
    }

    toast.success(`Pago registrado: ${formData.reference}`);
    
    // Reset form
    setFormData({
      invoiceId: '',
      customerId: '',
      amount: '',
      currency: 'USD',
      method: 'transfer',
      reference: '',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: '',
      receiptFile: null,
    });
    setSelectedCustomer(null);
    setSelectedInvoice(null);
    setShowForm(false);
    navigate('/billing');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registrar Pago</h1>
          <p className="text-sm text-muted-foreground">
            Registrar pagos manuales y comprobantes
          </p>
        </div>
      </div>

      {/* Customer Search */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Buscar Cliente
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente por nombre, email o ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {selectedCustomerData && (
          <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedCustomerData.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomerData.email}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomerData.phone}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                setSelectedCustomer(null);
                setSelectedInvoice(null);
                setShowForm(false);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {!selectedCustomerData && (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredCustomers.slice(0, 10).map(customer => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer.id)}
                className="w-full rounded-lg border border-border p-4 text-left transition-all hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{customer.id}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Selection */}
      {selectedCustomerData && customerInvoices.length > 0 && !showForm && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Facturas Pendientes
          </h2>
          
          <div className="space-y-2">
            {customerInvoices.map(invoice => (
              <button
                key={invoice.id}
                onClick={() => {
                  setSelectedInvoice(invoice.id);
                  setShowForm(true);
                }}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all",
                  selectedInvoice === invoice.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{invoice.id}</p>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.product}</p>
                    <p className="text-xs text-muted-foreground">
                      Vence: {new Date(invoice.dueDate).toLocaleDateString('es-PE')} • 
                      Monto: ${invoice.amount.toFixed(2)} {invoice.currency}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Payment Form */}
      {showForm && selectedInvoiceData && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Registrar Pago
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Factura</Label>
              <p className="font-semibold text-foreground">{selectedInvoiceData.id}</p>
              <p className="text-sm text-muted-foreground">{selectedInvoiceData.product}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Cliente</Label>
              <p className="font-semibold text-foreground">{selectedCustomerData?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCustomerData?.email}</p>
            </div>

            <div>
              <Label htmlFor="amount">Monto</Label>
              <div className="flex gap-2">
                <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v as 'USD' | 'PEN' })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="PEN">PEN</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="flex-1"
                />
              </div>
              {selectedInvoiceData && (
                <p className="text-xs text-muted-foreground mt-1">
                  Monto pendiente: ${selectedInvoiceData.amount.toFixed(2)} {selectedInvoiceData.currency}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentDate">Fecha de Pago</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>

            <div>
              <Label>Método de Pago</Label>
              <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v as PaymentForm['method'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentMethods).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reference">Referencia / Número de Operación</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Número de transferencia, operación, etc."
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionales sobre el pago"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="receipt">Subir Comprobante (opcional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {formData.receiptFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{formData.receiptFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setFormData({ ...formData, receiptFile: null })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 btn-primary-glow" onClick={handleSubmit}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Registrar Pago
            </Button>
          </div>
        </div>
      )}

      {selectedCustomerData && customerInvoices.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay facturas pendientes
          </h3>
          <p className="text-sm text-muted-foreground">
            Este cliente no tiene facturas pendientes de pago
          </p>
        </div>
      )}
    </div>
  );
}
