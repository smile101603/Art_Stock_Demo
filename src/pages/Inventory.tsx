import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package,
  Users,
  Key,
  Layers,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  AlertTriangle,
  Check,
  Clock,
  ChevronRight,
  Send,
  Shield,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { CredentialReveal } from '@/components/CredentialReveal';
import { mockInventory, mockIndividualLicenses, type Inventory, type InventorySlot } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

// Type tabs data
const typeTabs = [
  { id: '1:1', label: 'Individual', icon: Package },
  { id: '1:N', label: 'Compartida', icon: Users },
];

// Slot status badge component
function SlotStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    available: { label: 'Disponible', className: 'bg-status-active/15 text-status-active border-status-active/30' },
    assigned: { label: 'Asignado', className: 'bg-primary/15 text-primary border-primary/30' },
    expiring: { label: 'Por vencer', className: 'bg-status-expiring/15 text-status-expiring border-status-expiring/30' },
    overdue: { label: 'Vencido', className: 'bg-status-overdue/15 text-status-overdue border-status-overdue/30' },
  };

  const config = statusMap[status] || statusMap.available;

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}

// Slot Grid Component
function SlotGrid({ slots }: { slots: InventorySlot[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
      {slots.map((slot) => {
        const statusColors: Record<string, string> = {
          available: 'border-status-active/50 bg-status-active/5',
          assigned: 'border-primary/50 bg-primary/5',
          expiring: 'border-status-expiring/50 bg-status-expiring/5',
          overdue: 'border-status-overdue/50 bg-status-overdue/5',
        };
        
        return (
          <div 
            key={slot.id}
            className={cn(
              "rounded-lg border-2 p-3 transition-all hover:scale-[1.02]",
              statusColors[slot.status]
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Slot {slot.slotNumber}</span>
              <SlotStatusBadge status={slot.status} />
            </div>
            {slot.customerName ? (
              <>
                <p className="text-sm font-medium text-foreground truncate">{slot.customerName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {slot.expiryDate ? `Vence: ${slot.expiryDate}` : 'Sin vencimiento'}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sin asignar</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Rotation Modal Component
function RotationModal({ 
  inventory, 
  open, 
  onOpenChange 
}: { 
  inventory: Inventory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  // Pre-select active slots, deselect overdue/suspended
  useEffect(() => {
    if (inventory?.slots) {
      const preSelected = new Set<string>();
      inventory.slots.forEach(slot => {
        if (slot.status === 'assigned' || slot.status === 'expiring') {
          preSelected.add(slot.id);
        }
      });
      setSelectedSlots(preSelected);
    }
    setStep('select');
  }, [inventory, open]);

  const handleToggleSlot = (slotId: string) => {
    const newSelected = new Set(selectedSlots);
    if (newSelected.has(slotId)) {
      newSelected.delete(slotId);
    } else {
      newSelected.add(slotId);
    }
    setSelectedSlots(newSelected);
  };

  const handleConfirm = () => {
    toast.success(`Credenciales rotadas y notificación enviada a ${selectedSlots.size} usuarios`);
    onOpenChange(false);
    setStep('select');
  };

  if (!inventory) return null;

  const occupiedSlots = inventory.slots?.filter(s => s.status !== 'available') || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Rotar Credenciales - {inventory.product}
          </DialogTitle>
          <DialogDescription>
            Selecciona los usuarios que recibirán las nuevas credenciales.
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <>
            {/* Warning banner */}
            <div className="rounded-lg border border-status-expiring/30 bg-status-expiring/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-status-expiring mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-status-expiring">Control de concurrencia activo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Las transacciones atómicas previenen sobreventa. Solo usuarios seleccionados reciben nuevas credenciales.
                  </p>
                </div>
              </div>
            </div>

            {/* New credentials preview */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Nuevas credenciales (preview)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Usuario:</span>
                  <code className="block rounded bg-background px-2 py-1 text-xs font-mono mt-1">
                    artstock.new@gmail.com
                  </code>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Contraseña:</span>
                  <code className="block rounded bg-background px-2 py-1 text-xs font-mono mt-1">
                    NewSecure@2025!
                  </code>
                </div>
              </div>
            </div>

            {/* Slots list */}
            <div className="max-h-[300px] overflow-y-auto rounded-lg border border-border">
              <table className="w-full">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr className="border-b border-border">
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground w-10">
                      <Checkbox 
                        checked={selectedSlots.size === occupiedSlots.length && occupiedSlots.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSlots(new Set(occupiedSlots.map(s => s.id)));
                          } else {
                            setSelectedSlots(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">Slot</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">Cliente</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">Vencimiento</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {occupiedSlots.map((slot) => {
                    const isExpiringSoon = slot.status === 'expiring';
                    const isOverdue = slot.status === 'overdue';
                    
                    return (
                      <tr 
                        key={slot.id} 
                        className={cn(
                          "border-b border-border/50 transition-colors",
                          selectedSlots.has(slot.id) && "bg-primary/5"
                        )}
                      >
                        <td className="p-3">
                          <Checkbox 
                            checked={selectedSlots.has(slot.id)}
                            onCheckedChange={() => handleToggleSlot(slot.id)}
                          />
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-sm">Slot {slot.slotNumber}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-foreground">{slot.customerName || '-'}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{slot.expiryDate || '-'}</span>
                            {isExpiringSoon && (
                              <span className="flex items-center gap-1 rounded bg-status-expiring/15 px-1.5 py-0.5 text-xs text-status-expiring">
                                <Clock className="h-3 w-3" />
                                &lt;3d
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <SlotStatusBadge status={slot.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selection summary */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">
                {selectedSlots.size} de {occupiedSlots.length} usuarios seleccionados
              </span>
              <Button 
                variant="default" 
                onClick={() => setStep('confirm')}
                disabled={selectedSlots.size === 0}
                className="btn-primary-glow"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation step */}
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-medium text-foreground mb-2">Resumen de la acción</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-status-active" />
                    Se actualizarán las credenciales de la cuenta maestra
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-status-active" />
                    {selectedSlots.size} usuarios recibirán notificación por WhatsApp/Email
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-status-active" />
                    Usuarios no seleccionados NO recibirán las nuevas credenciales
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Operación protegida por transacción atómica
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                  Volver
                </Button>
                <Button onClick={handleConfirm} className="flex-1 btn-primary-glow">
                  <Send className="mr-2 h-4 w-4" />
                  Confirmar y Notificar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Inventory Card Component for 1:N
function SharedAccountCard({ inventory }: { inventory: Inventory }) {
  const [expanded, setExpanded] = useState(false);
  const [rotationOpen, setRotationOpen] = useState(false);

  const availableSlots = inventory.slots?.filter(s => s.status === 'available').length || 0;
  const occupiedSlots = (inventory.totalSlots || 0) - availableSlots;
  const expiringSlots = inventory.slots?.filter(s => s.status === 'expiring').length || 0;
  const overdueSlots = inventory.slots?.filter(s => s.status === 'overdue').length || 0;
  const occupancyPercent = inventory.totalSlots ? (occupiedSlots / inventory.totalSlots) * 100 : 0;

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md">
        {/* Header */}
        <div 
          className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{inventory.product}</h3>
              <p className="text-xs text-muted-foreground font-mono">{inventory.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setRotationOpen(true);
              }}
              className="h-8"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Rotar
            </Button>
            <ChevronRight className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              expanded && "rotate-90"
            )} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 p-4 border-b border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">{inventory.totalSlots}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Ocupados</p>
            <p className="text-lg font-bold text-primary">{occupiedSlots}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Disponibles</p>
            <p className="text-lg font-bold text-status-active">{availableSlots}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Por vencer</p>
            <p className="text-lg font-bold text-status-expiring">{expiringSlots}</p>
          </div>
        </div>

        {/* Occupancy bar */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Ocupación</span>
            <span className="text-xs font-semibold text-foreground">{occupancyPercent.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all duration-500"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          {overdueSlots > 0 && (
            <p className="text-xs text-status-overdue mt-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {overdueSlots} slot(s) vencidos
            </p>
          )}
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="animate-accordion-down">
            {/* Credentials */}
            <div className="p-4 border-b border-border">
              <CredentialReveal 
                username={inventory.username || ''} 
                password={inventory.password || ''} 
              />
            </div>

            {/* Slot Grid */}
            {inventory.slots && <SlotGrid slots={inventory.slots} />}

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
              <div className="text-xs text-muted-foreground">
                Vence: {inventory.expiryDate}
              </div>
              <div className="text-xs text-muted-foreground">
                Proveedor: {inventory.provider}
              </div>
            </div>
          </div>
        )}
      </div>

      <RotationModal 
        inventory={inventory} 
        open={rotationOpen} 
        onOpenChange={setRotationOpen} 
      />
    </>
  );
}

// Individual License Card
function IndividualLicenseRow({ license }: { license: Inventory }) {
  const statusColors: Record<string, string> = {
    available: 'text-status-active',
    assigned: 'text-primary',
    blocked: 'text-status-overdue',
    cleaning: 'text-status-expiring',
  };

  return (
    <tr className="border-b border-border/50 hover:bg-accent/20 transition-colors">
      <td className="py-3 px-4">
        <span className="font-mono text-xs text-primary">{license.id}</span>
      </td>
      <td className="py-3 px-4">
        <span className="font-medium text-foreground">{license.product}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">{license.provider}</span>
      </td>
      <td className="py-3 px-4">
        <span className={cn("capitalize text-sm font-medium", statusColors[license.status])}>
          {license.status === 'available' ? 'Disponible' : 
           license.status === 'assigned' ? 'Asignado' :
           license.status === 'blocked' ? 'Bloqueado' : 'Limpieza'}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">{license.expiryDate}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <Button variant="ghost" size="sm" className="h-7">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  );
}

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<'1:1' | '1:N'>('1:N');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const sharedAccounts = mockInventory.filter(inv => inv.type === '1:N');
  const individualLicenses = mockIndividualLicenses;

  const filteredShared = sharedAccounts.filter(acc => {
    if (searchQuery && !acc.product.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredIndividual = individualLicenses.filter(lic => {
    if (searchQuery && !lic.product.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && lic.status !== statusFilter) return false;
    return true;
  });

  const individualStatusChips: FilterChip[] = [
    { value: 'all', label: 'Todos', count: individualLicenses.length },
    { value: 'available', label: 'Disponibles', count: individualLicenses.filter(l => l.status === 'available').length, color: 'success' },
    { value: 'assigned', label: 'Asignados', count: individualLicenses.filter(l => l.status === 'assigned').length },
    { value: 'blocked', label: 'Bloqueados', count: individualLicenses.filter(l => l.status === 'blocked').length, color: 'danger' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de licencias individuales y cuentas compartidas
          </p>
        </div>
        <Button className="btn-primary-glow">
          <Plus className="mr-2 h-4 w-4" />
          Agregar inventario
        </Button>
      </div>

      {/* Type tabs */}
      <Tabs value={activeType} onValueChange={(v) => setActiveType(v as '1:1' | '1:N')}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="bg-muted/50 p-1">
            {typeTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9"
            />
          </div>
        </div>

        {/* 1:N Shared Accounts */}
        <TabsContent value="1:N" className="mt-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredShared.map((inventory) => (
                <SharedAccountCard key={inventory.id} inventory={inventory} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* 1:1 Individual Licenses */}
        <TabsContent value="1:1" className="mt-6 space-y-4">
          <FilterChips 
            chips={individualStatusChips} 
            value={statusFilter} 
            onChange={setStatusFilter} 
          />
          
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-muted/70 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                    <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                    <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proveedor</th>
                    <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                    <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencimiento</th>
                    <th className="py-2.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="py-3 px-4">
                            <Skeleton className="h-4 w-full max-w-[100px]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    filteredIndividual.map((license) => (
                      <IndividualLicenseRow key={license.id} license={license} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
