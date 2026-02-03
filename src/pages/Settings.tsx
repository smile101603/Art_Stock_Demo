import React, { useState } from 'react';
import { useAuth, logAudit, type UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { 
  Building2, 
  Receipt, 
  Bell, 
  Users, 
  Save, 
  MoreHorizontal,
  Shield,
  UserMinus,
  ChevronDown,
} from 'lucide-react';

// Mock users for demo
const mockUsers = [
  { id: 'USR-001', name: 'Carlos Mendoza', email: 'carlos@artstock.com', role: 'super_admin' as UserRole, status: 'active' },
  { id: 'USR-002', name: 'María García', email: 'maria@artstock.com', role: 'admin' as UserRole, status: 'active' },
  { id: 'USR-003', name: 'Pedro Torres', email: 'pedro@artstock.com', role: 'user' as UserRole, status: 'active' },
  { id: 'USR-004', name: 'Ana López', email: 'ana@artstock.com', role: 'user' as UserRole, status: 'inactive' },
];

export default function Settings() {
  const { session } = useAuth();
  const user = session.user;
  const isSuperAdmin = user?.role === 'super_admin';

  // Company settings
  const [companyName, setCompanyName] = useState('Art Stock SAC');
  const [country, setCountry] = useState('PE');
  const [currency, setCurrency] = useState('USD');
  const [billingEmail, setBillingEmail] = useState('facturacion@artstock.com');

  // Fiscal settings
  const [flujoDeclarable, setFlujoDeclarable] = useState(true);
  const [flujoInterno, setFlujoInterno] = useState(false);
  const [taxRate, setTaxRate] = useState('18');

  // Notification settings
  const [paymentOverdue, setPaymentOverdue] = useState(true);
  const [expiringSubscriptions, setExpiringSubscriptions] = useState(true);
  const [lowInventory, setLowInventory] = useState(true);

  // Users
  const [users, setUsers] = useState(mockUsers);

  const handleSaveCompany = () => {
    if (user) {
      logAudit(user, 'settings_updated', 'settings', 'company', 'Configuración de empresa actualizada');
    }
    toast.success('Configuración de empresa guardada');
  };

  const handleSaveFiscal = () => {
    if (user) {
      logAudit(user, 'settings_updated', 'settings', 'fiscal', 'Configuración fiscal actualizada');
    }
    toast.success('Configuración fiscal guardada');
  };

  const handleSaveNotifications = () => {
    if (user) {
      logAudit(user, 'settings_updated', 'settings', 'notifications', 'Preferencias de notificaciones actualizadas');
    }
    toast.success('Preferencias de notificaciones guardadas');
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin) {
      toast.error('Solo Super Admin puede cambiar roles');
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

    if (user) {
      logAudit(user, 'role_changed', 'user', userId, `Rol cambiado a ${newRole}`);
    }
    toast.success('Rol actualizado');
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));

    if (user) {
      logAudit(user, 'user_status_changed', 'user', userId, 'Estado de usuario cambiado');
    }
    toast.success('Estado de usuario actualizado');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Administra la configuración del sistema
        </p>
      </div>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="empresa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="mr-2 h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Receipt className="mr-2 h-4 w-4" />
            Fiscal
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mr-2 h-4 w-4" />
            Usuarios y Roles
          </TabsTrigger>
        </TabsList>

        {/* Empresa Tab */}
        <TabsContent value="empresa">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre de empresa</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>País</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PE">🇵🇪 Perú</SelectItem>
                    <SelectItem value="MX">🇲🇽 México</SelectItem>
                    <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                    <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Moneda predeterminada</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar americano</SelectItem>
                    <SelectItem value="PEN">PEN - Sol peruano</SelectItem>
                    <SelectItem value="MXN">MXN - Peso mexicano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email de facturación</Label>
                <Input type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveCompany} className="btn-primary-glow">
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Fiscal Tab */}
        <TabsContent value="fiscal">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="font-medium text-foreground">Flujo Declarable</p>
                  <p className="text-xs text-muted-foreground">Incluir en reportes fiscales</p>
                </div>
                <Switch checked={flujoDeclarable} onCheckedChange={setFlujoDeclarable} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="font-medium text-foreground">Flujo Interno</p>
                  <p className="text-xs text-muted-foreground">Transacciones internas no declarables</p>
                </div>
                <Switch checked={flujoInterno} onCheckedChange={setFlujoInterno} />
              </div>
              <div className="space-y-2">
                <Label>Tasa de impuesto (IGV/IVA %)</Label>
                <Input 
                  type="number" 
                  value={taxRate} 
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="max-w-[200px]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveFiscal} className="btn-primary-glow">
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notificaciones Tab */}
        <TabsContent value="notificaciones">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="font-medium text-foreground">Alertas de pagos vencidos</p>
                  <p className="text-xs text-muted-foreground">Recibir notificaciones cuando un pago se vence</p>
                </div>
                <Switch checked={paymentOverdue} onCheckedChange={setPaymentOverdue} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="font-medium text-foreground">Suscripciones por vencer</p>
                  <p className="text-xs text-muted-foreground">Alertas cuando una suscripción está por expirar</p>
                </div>
                <Switch checked={expiringSubscriptions} onCheckedChange={setExpiringSubscriptions} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="font-medium text-foreground">Inventario bajo</p>
                  <p className="text-xs text-muted-foreground">Notificar cuando el inventario esté bajo</p>
                </div>
                <Switch checked={lowInventory} onCheckedChange={setLowInventory} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="btn-primary-glow">
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Usuarios y Roles Tab */}
        <TabsContent value="usuarios">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-semibold text-foreground">Usuarios del Sistema</h3>
              <p className="text-sm text-muted-foreground">
                {isSuperAdmin ? 'Gestiona usuarios y sus permisos' : 'Solo Super Admin puede modificar roles'}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {isSuperAdmin ? (
                        <Select 
                          value={u.role} 
                          onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">Usuario</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                          {u.role.replace('_', ' ')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.status === 'active' 
                          ? 'bg-status-active/15 text-status-active' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {u.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDeactivateUser(u.id)}>
                            <UserMinus className="mr-2 h-4 w-4" />
                            {u.status === 'active' ? 'Desactivar' : 'Activar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
