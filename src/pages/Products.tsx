import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package,
  Plus,
  Eye,
  Edit,
  Archive,
  Tag,
  MoreHorizontal,
  X,
  Users,
  Key,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data for products
interface Product {
  id: string;
  name: string;
  sku: string;
  type: '1:1' | '1:N';
  totalQty: number;
  available: number;
  expiryPolicy: string;
  tags: string[];
  status: 'active' | 'inactive';
  defaultPrice: number;
  currency: 'USD' | 'PEN';
  sold: number;
  expiring: number;
}

const mockProducts: Product[] = [
  { id: 'PROD-001', name: 'Adobe Creative Cloud', sku: 'ADOBE-CC-2024', type: '1:1', totalQty: 50, available: 12, expiryPolicy: '12 meses', tags: ['Software', 'Diseño'], status: 'active', defaultPrice: 54.99, currency: 'USD', sold: 38, expiring: 5 },
  { id: 'PROD-002', name: 'ChatGPT Plus', sku: 'OPENAI-GPT-PLUS', type: '1:N', totalQty: 25, available: 8, expiryPolicy: 'Mensual', tags: ['AI', 'Productividad'], status: 'active', defaultPrice: 20.00, currency: 'USD', sold: 17, expiring: 3 },
  { id: 'PROD-003', name: 'Netflix Premium', sku: 'NETFLIX-PREM', type: '1:N', totalQty: 30, available: 5, expiryPolicy: 'Mensual', tags: ['Streaming', 'Entretenimiento'], status: 'active', defaultPrice: 15.99, currency: 'USD', sold: 25, expiring: 8 },
  { id: 'PROD-004', name: 'Canva Pro', sku: 'CANVA-PRO-2024', type: '1:N', totalQty: 40, available: 15, expiryPolicy: '12 meses', tags: ['Diseño', 'Productividad'], status: 'active', defaultPrice: 12.99, currency: 'USD', sold: 25, expiring: 2 },
  { id: 'PROD-005', name: 'Microsoft 365', sku: 'MS365-FAM', type: '1:1', totalQty: 60, available: 20, expiryPolicy: '12 meses', tags: ['Software', 'Productividad'], status: 'active', defaultPrice: 99.99, currency: 'USD', sold: 40, expiring: 10 },
  { id: 'PROD-006', name: 'Spotify Family', sku: 'SPOTIFY-FAM', type: '1:N', totalQty: 35, available: 10, expiryPolicy: 'Mensual', tags: ['Streaming', 'Música'], status: 'active', defaultPrice: 14.99, currency: 'USD', sold: 25, expiring: 4 },
  { id: 'PROD-007', name: 'Figma Organization', sku: 'FIGMA-ORG', type: '1:N', totalQty: 20, available: 6, expiryPolicy: 'Mensual', tags: ['Diseño', 'Colaboración'], status: 'active', defaultPrice: 45.00, currency: 'USD', sold: 14, expiring: 1 },
  { id: 'PROD-008', name: 'Grammarly Premium', sku: 'GRAM-PREM', type: '1:1', totalQty: 25, available: 8, expiryPolicy: '12 meses', tags: ['Productividad', 'Escritura'], status: 'inactive', defaultPrice: 12.00, currency: 'USD', sold: 17, expiring: 0 },
];

// Product Detail Panel
function ProductDetailPanel({ product, open, onOpenChange }: { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {product.name}
          </SheetTitle>
          <SheetDescription className="font-mono">{product.sku}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Información básica</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <span className="ml-2 font-medium">{product.type === '1:1' ? 'Individual' : 'Compartida'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <span className={cn("ml-2 font-medium", product.status === 'active' ? 'text-status-active' : 'text-muted-foreground')}>
                  {product.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Política expiración:</span>
                <span className="ml-2 font-medium">{product.expiryPolicy}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Precio:</span>
                <span className="ml-2 font-medium">${product.defaultPrice} {product.currency}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Etiquetas</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Estadísticas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-background p-3 text-center">
                <TrendingUp className="mx-auto h-5 w-5 text-status-active mb-1" />
                <p className="text-2xl font-bold text-foreground">{product.sold}</p>
                <p className="text-xs text-muted-foreground">Vendidos</p>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <Package className="mx-auto h-5 w-5 text-primary mb-1" />
                <p className="text-2xl font-bold text-foreground">{product.totalQty - product.sold}</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <Clock className="mx-auto h-5 w-5 text-status-expiring mb-1" />
                <p className="text-2xl font-bold text-foreground">{product.expiring}</p>
                <p className="text-xs text-muted-foreground">Por vencer</p>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <AlertTriangle className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
                <p className="text-2xl font-bold text-foreground">{product.available}</p>
                <p className="text-xs text-muted-foreground">Disponibles</p>
              </div>
            </div>
          </div>

          {/* Inventory Slots */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Inventario vinculado</h4>
            <div className="text-sm text-muted-foreground">
              <p>{product.totalQty} slots totales</p>
              <p>{product.available} slots disponibles</p>
              <p>{product.totalQty - product.available} slots ocupados</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Add Product Modal
function AddProductModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    type: '1:1',
    expiryPolicy: '',
    tags: '',
    defaultPrice: '',
  });

  const handleSubmit = () => {
    toast.success("Producto creado exitosamente");
    onOpenChange(false);
    setFormData({ name: '', sku: '', type: '1:1', expiryPolicy: '', tags: '', defaultPrice: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Nuevo Producto
          </DialogTitle>
          <DialogDescription>
            Agrega un nuevo producto al catálogo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adobe Creative Cloud"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU / ID</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="ADOBE-CC-2024"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Individual (1:1)</SelectItem>
                <SelectItem value="1:N">Compartida (1:N)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">Política de expiración</Label>
            <Input
              id="expiry"
              value={formData.expiryPolicy}
              onChange={(e) => setFormData({ ...formData, expiryPolicy: e.target.value })}
              placeholder="12 meses"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Software, Diseño"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio por defecto (USD)</Label>
            <Input
              id="price"
              type="number"
              value={formData.defaultPrice}
              onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
              placeholder="54.99"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="btn-primary-glow">
            Crear producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = mockProducts.filter(product => {
    if (typeFilter !== 'all' && product.type !== typeFilter) return false;
    if (statusFilter !== 'all' && product.status !== statusFilter) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const typeChips: FilterChip[] = [
    { value: 'all', label: 'Todos', count: mockProducts.length },
    { value: '1:1', label: 'Individual', count: mockProducts.filter(p => p.type === '1:1').length },
    { value: '1:N', label: 'Compartida', count: mockProducts.filter(p => p.type === '1:N').length, color: 'info' },
  ];

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleArchive = (product: Product) => {
    toast.success(`Producto ${product.name} archivado`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de licencias y activos digitales
          </p>
        </div>
        <Button className="btn-primary-glow" onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips 
          chips={typeChips} 
          value={typeFilter} 
          onChange={setTypeFilter} 
        />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
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
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponible</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expiración</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</th>
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
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className={cn("text-xs", product.status === 'active' ? 'text-status-active' : 'text-muted-foreground')}>
                            {product.status === 'active' ? 'Activo' : 'Inactivo'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                        product.type === '1:1' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'
                      )}>
                        {product.type === '1:1' ? <Key className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {product.type === '1:1' ? 'Individual' : 'Compartida'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{product.totalQty}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-sm font-medium",
                        product.available < 5 ? 'text-status-overdue' : 'text-status-active'
                      )}>
                        {product.available}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{product.expiryPolicy}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(product)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchive(product)} className="text-status-overdue">
                            <Archive className="mr-2 h-4 w-4" />
                            Archivar
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

      {/* Modals */}
      <AddProductModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <ProductDetailPanel product={selectedProduct} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
