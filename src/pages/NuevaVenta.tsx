import React, { useState } from 'react';
import { 
  ShoppingCart,
  User,
  Package,
  Calendar,
  DollarSign,
  Plus,
  X,
  Search,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { mockCustomers } from '@/data/mockData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductSelection {
  id: string;
  product: string;
  plan: string;
  type: '1:1' | '1:N' | 'teams' | 'profile' | 'key';
  amount: number;
  currency: 'USD' | 'PEN';
  quantity: number;
}

const availableProducts = [
  { id: 'prod-001', name: 'Adobe Creative Cloud', plans: ['Mensual', 'Trimestral', 'Anual'], types: ['1:1', '1:N'], basePrice: { USD: 52.99, PEN: 180 } },
  { id: 'prod-002', name: 'ChatGPT Plus', plans: ['Mensual'], types: ['1:1', '1:N'], basePrice: { USD: 20, PEN: 75 } },
  { id: 'prod-003', name: 'Microsoft 365', plans: ['Mensual', 'Anual'], types: ['1:1', '1:N', 'teams'], basePrice: { USD: 6.99, PEN: 25 } },
  { id: 'prod-004', name: 'Canva Pro', plans: ['Mensual', 'Anual'], types: ['1:N', 'teams'], basePrice: { USD: 12.99, PEN: 45 } },
  { id: 'prod-005', name: 'Netflix Premium', plans: ['Mensual'], types: ['1:N'], basePrice: { USD: 15.99, PEN: 55 } },
];

export default function NuevaVenta() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductSelection[]>([]);
  const [addProductModal, setAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product: '',
    plan: '',
    type: '1:1' as ProductSelection['type'],
    currency: 'USD' as 'USD' | 'PEN',
    quantity: 1,
  });

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.id.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const selectedCustomerData = selectedCustomer 
    ? mockCustomers.find(c => c.id === selectedCustomer)
    : null;

  const calculateTotal = () => {
    return products.reduce((sum, p) => {
      const multiplier = p.plan === 'Anual' ? 10 : p.plan === 'Trimestral' ? 3 : 1;
      return sum + (p.amount * multiplier * p.quantity);
    }, 0);
  };

  const handleAddProduct = () => {
    const productData = availableProducts.find(p => p.id === newProduct.product);
    if (!productData) return;

    const planMultiplier = newProduct.plan === 'Anual' ? 10 : newProduct.plan === 'Trimestral' ? 3 : 1;
    const basePrice = productData.basePrice[newProduct.currency];
    const amount = basePrice * planMultiplier;

    const productSelection: ProductSelection = {
      id: `temp-${Date.now()}`,
      product: productData.name,
      plan: newProduct.plan,
      type: newProduct.type,
      amount: amount,
      currency: newProduct.currency,
      quantity: newProduct.quantity,
    };

    setProducts([...products, productSelection]);
    setNewProduct({
      product: '',
      plan: '',
      type: '1:1',
      currency: 'USD',
      quantity: 1,
    });
    setAddProductModal(false);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    if (!selectedCustomer) {
      toast.error('Selecciona un cliente');
      return;
    }
    if (products.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }

    toast.success(`Venta creada para ${selectedCustomerData?.name}`);
    // Reset form
    setSelectedCustomer(null);
    setProducts([]);
    setStep(1);
    navigate('/subscriptions');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva Venta</h1>
          <p className="text-sm text-muted-foreground">
            Crear nueva orden de venta y suscripciones
          </p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-2",
          step >= 1 ? "text-primary" : "text-muted-foreground"
        )}>
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center font-semibold",
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
          </div>
          <span className="hidden sm:block">Cliente</span>
        </div>
        <div className={cn(
          "h-1 flex-1",
          step >= 2 ? "bg-primary" : "bg-muted"
        )} />
        <div className={cn(
          "flex items-center gap-2",
          step >= 2 ? "text-primary" : "text-muted-foreground"
        )}>
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center font-semibold",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {step > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
          </div>
          <span className="hidden sm:block">Productos</span>
        </div>
        <div className={cn(
          "h-1 flex-1",
          step >= 3 ? "bg-primary" : "bg-muted"
        )} />
        <div className={cn(
          "flex items-center gap-2",
          step >= 3 ? "text-primary" : "text-muted-foreground"
        )}>
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center font-semibold",
            step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            3
          </div>
          <span className="hidden sm:block">Confirmar</span>
        </div>
      </div>

      {/* Step 1: Select Customer */}
      {step === 1 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Seleccionar Cliente
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nombre, email o ID..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
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
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredCustomers.slice(0, 10).map(customer => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer.id)}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all",
                  selectedCustomer === customer.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{customer.id}</p>
                  </div>
                  {selectedCustomer === customer.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <Button
            className="w-full btn-primary-glow"
            onClick={() => selectedCustomer && setStep(2)}
            disabled={!selectedCustomer}
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Add Products */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Productos y Suscripciones
              </h2>
              <Button onClick={() => setAddProductModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No hay productos agregados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{product.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.plan} • {product.type} • Cantidad: {product.quantity}
                      </p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        ${product.amount.toFixed(2)} {product.currency}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button
                className="flex-1 btn-primary-glow"
                onClick={() => products.length > 0 && setStep(3)}
                disabled={products.length === 0}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Confirmar Venta
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Cliente</Label>
              <p className="font-semibold text-foreground">{selectedCustomerData?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCustomerData?.email}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Productos</Label>
              <div className="mt-2 space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {product.product} ({product.plan}) × {product.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      ${product.amount.toFixed(2)} {product.currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              Volver
            </Button>
            <Button className="flex-1 btn-primary-glow" onClick={handleSubmit}>
              Confirmar Venta
            </Button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <Dialog open={addProductModal} onOpenChange={setAddProductModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
            <DialogDescription>
              Selecciona un producto y configura la suscripción
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Producto</Label>
              <Select value={newProduct.product} onValueChange={(v) => setNewProduct({ ...newProduct, product: v, plan: '' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map(prod => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newProduct.product && (
              <>
                <div>
                  <Label>Plan</Label>
                  <Select value={newProduct.plan} onValueChange={(v) => setNewProduct({ ...newProduct, plan: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.find(p => p.id === newProduct.product)?.plans.map(plan => (
                        <SelectItem key={plan} value={plan}>
                          {plan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <Select value={newProduct.type} onValueChange={(v) => setNewProduct({ ...newProduct, type: v as ProductSelection['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.find(p => p.id === newProduct.product)?.types.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Moneda</Label>
                  <Select value={newProduct.currency} onValueChange={(v) => setNewProduct({ ...newProduct, currency: v as 'USD' | 'PEN' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="PEN">PEN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProduct} disabled={!newProduct.product || !newProduct.plan}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
