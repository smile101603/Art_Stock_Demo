import React, { useState, useEffect } from 'react';
import { 
  Settings,
  Shield,
  Mail,
  Key,
  Webhook,
  Copy,
  Trash2,
  Plus,
  Check,
  AlertTriangle,
  Play,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock roles data
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    view_customers: boolean;
    edit_customers: boolean;
    view_subscriptions: boolean;
    edit_subscriptions: boolean;
    view_inventory: boolean;
    edit_inventory: boolean;
    view_billing: boolean;
    manage_payments: boolean;
    view_reports: boolean;
    system_settings: boolean;
  };
}

const mockRoles: Role[] = [
  { 
    id: 'admin', 
    name: 'Administrador', 
    description: 'Acceso completo al sistema',
    permissions: { view_customers: true, edit_customers: true, view_subscriptions: true, edit_subscriptions: true, view_inventory: true, edit_inventory: true, view_billing: true, manage_payments: true, view_reports: true, system_settings: true }
  },
  { 
    id: 'ops', 
    name: 'Operaciones', 
    description: 'Gestión de suscripciones e inventario',
    permissions: { view_customers: true, edit_customers: false, view_subscriptions: true, edit_subscriptions: true, view_inventory: true, edit_inventory: true, view_billing: true, manage_payments: false, view_reports: true, system_settings: false }
  },
  { 
    id: 'support', 
    name: 'Soporte', 
    description: 'Atención al cliente',
    permissions: { view_customers: true, edit_customers: false, view_subscriptions: true, edit_subscriptions: false, view_inventory: true, edit_inventory: false, view_billing: true, manage_payments: false, view_reports: false, system_settings: false }
  },
  { 
    id: 'client', 
    name: 'Cliente', 
    description: 'Acceso a panel de cliente',
    permissions: { view_customers: false, edit_customers: false, view_subscriptions: false, edit_subscriptions: false, view_inventory: false, edit_inventory: false, view_billing: false, manage_payments: false, view_reports: false, system_settings: false }
  },
];

// Mock API keys
interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

const mockAPIKeys: APIKey[] = [
  { id: 'key-1', name: 'Production API', key: 'prod_api_xxxxxxxxxxxxxxxxxxxxxxxx', createdAt: '2024-12-01', lastUsed: '2025-01-15', status: 'active' },
  { id: 'key-2', name: 'Development API', key: 'dev_api_xxxxxxxxxxxxxxxxxxxxxxxx', createdAt: '2024-11-15', lastUsed: '2025-01-14', status: 'active' },
  { id: 'key-3', name: 'Legacy Integration', key: 'legacy_api_xxxxxxxxxxxxxxxxxxxxxxxxx', createdAt: '2024-06-01', lastUsed: '2024-10-20', status: 'revoked' },
];

// Mock webhooks
interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastTriggered?: string;
}

const mockWebhooks: Webhook[] = [
  { id: 'wh-1', url: 'https://api.example.com/webhooks/artstock', events: ['subscription.created', 'subscription.expired', 'payment.received'], status: 'active', lastTriggered: '2025-01-15 10:30' },
  { id: 'wh-2', url: 'https://erp.company.com/integrations', events: ['invoice.created', 'payment.received'], status: 'active', lastTriggered: '2025-01-14 16:45' },
];

const permissionLabels: Record<string, string> = {
  view_customers: 'Ver clientes',
  edit_customers: 'Editar clientes',
  view_subscriptions: 'Ver suscripciones',
  edit_subscriptions: 'Editar suscripciones',
  view_inventory: 'Ver inventario',
  edit_inventory: 'Editar inventario',
  view_billing: 'Ver cobranza',
  manage_payments: 'Gestionar pagos',
  view_reports: 'Ver reportes',
  system_settings: 'Configuración sistema',
};

export default function System() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>(mockAPIKeys);
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
  const [newWebhookModalOpen, setNewWebhookModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveRoles = () => {
    toast.success("Permisos guardados exitosamente");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API Key copiada al portapapeles");
  };

  const handleRevokeKey = (keyId: string) => {
    setAPIKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: 'revoked' as const } : k));
    toast.success("API Key revocada");
  };

  const handleCreateKey = () => {
    toast.success("Nueva API Key creada");
    setNewKeyModalOpen(false);
  };

  const handleTestWebhook = (webhookId: string) => {
    toast.success("Webhook de prueba enviado");
  };

  const togglePermission = (roleId: string, permission: keyof Role['permissions']) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [permission]: !role.permissions[permission]
          }
        };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Configuración avanzada y seguridad
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="roles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="mr-2 h-4 w-4" />
            Roles y Permisos
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="mr-2 h-4 w-4" />
            Plantillas Email
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Webhook className="mr-2 h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="mt-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permiso</th>
                    {roles.map(role => (
                      <th key={role.id} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                        {roles.map((_, j) => (
                          <td key={j} className="py-3 px-4 text-center"><Skeleton className="h-6 w-10 mx-auto" /></td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    Object.keys(permissionLabels).map((permission) => (
                      <tr key={permission} className="border-b border-border/50 hover:bg-accent/20">
                        <td className="py-3 px-4 text-sm text-foreground">{permissionLabels[permission]}</td>
                        {roles.map(role => (
                          <td key={role.id} className="py-3 px-4 text-center">
                            <Switch
                              checked={role.permissions[permission as keyof Role['permissions']]}
                              onCheckedChange={() => togglePermission(role.id, permission as keyof Role['permissions'])}
                              disabled={role.id === 'admin'}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-4 border-t border-border bg-muted/20">
              <Button className="btn-primary-glow" onClick={handleSaveRoles}>
                <Check className="mr-2 h-4 w-4" />
                Guardar cambios
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="email" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Plantillas de Email</h3>
              <p className="text-sm">Editor de plantillas próximamente</p>
            </div>
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button className="btn-primary-glow" onClick={() => setNewKeyModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear API Key
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Key</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Creada</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Último uso</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    apiKeys.map((apiKey) => (
                      <tr key={apiKey.id} className="border-b border-border/50 hover:bg-accent/20">
                        <td className="py-3 px-4 font-medium text-foreground">{apiKey.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {showKey === apiKey.id ? apiKey.key : apiKey.key.replace(/./g, '•').slice(0, 20) + '...'}
                            </code>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}>
                              {showKey === apiKey.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyKey(apiKey.key)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{apiKey.createdAt}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{apiKey.lastUsed}</td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            apiKey.status === 'active' ? 'bg-status-active/15 text-status-active' : 'bg-muted text-muted-foreground'
                          )}>
                            {apiKey.status === 'active' ? 'Activa' : 'Revocada'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {apiKey.status === 'active' && (
                            <Button variant="ghost" size="sm" className="text-status-overdue hover:text-status-overdue" onClick={() => handleRevokeKey(apiKey.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Revocar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button className="btn-primary-glow" onClick={() => setNewWebhookModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Webhook
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
              ))
            ) : (
              webhooks.map((webhook) => (
                <div key={webhook.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-primary">{webhook.url}</code>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          webhook.status === 'active' ? 'bg-status-active/15 text-status-active' : 'bg-muted text-muted-foreground'
                        )}>
                          {webhook.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {webhook.events.map((event) => (
                          <span key={event} className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {event}
                          </span>
                        ))}
                      </div>
                      {webhook.lastTriggered && (
                        <p className="text-xs text-muted-foreground mt-2">Último disparo: {webhook.lastTriggered}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleTestWebhook(webhook.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Probar
                      </Button>
                      <Button variant="ghost" size="icon" className="text-status-overdue hover:text-status-overdue">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create API Key Modal */}
      <Dialog open={newKeyModalOpen} onOpenChange={setNewKeyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva API Key</DialogTitle>
            <DialogDescription>Crea una nueva clave de API para integraciones</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Nombre</Label>
              <Input id="keyName" placeholder="Mi integración" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewKeyModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateKey} className="btn-primary-glow">Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Modal */}
      <Dialog open={newWebhookModalOpen} onOpenChange={setNewWebhookModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Webhook</DialogTitle>
            <DialogDescription>Configura un endpoint para recibir eventos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL</Label>
              <Input id="webhookUrl" placeholder="https://api.example.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label>Eventos</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription.created">subscription.created</SelectItem>
                  <SelectItem value="subscription.expired">subscription.expired</SelectItem>
                  <SelectItem value="payment.received">payment.received</SelectItem>
                  <SelectItem value="invoice.created">invoice.created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewWebhookModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => { toast.success("Webhook creado"); setNewWebhookModalOpen(false); }} className="btn-primary-glow">Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
