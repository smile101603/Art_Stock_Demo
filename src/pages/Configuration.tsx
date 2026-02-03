import React, { useState, useEffect } from 'react';
import { Settings, Building2, Receipt, Bell, Globe, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
export default function Configuration() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('company');

  // Company profile state
  const [companyData, setCompanyData] = useState({
    name: 'Art Stock SAC',
    address: 'Av. La Marina 1234, San Miguel',
    city: 'Lima',
    country: 'PE',
    phone: '+51 1 234 5678',
    email: 'admin@artstock.com',
    website: 'https://artstock.com',
    taxId: '20123456789'
  });

  // Fiscal settings state
  const [fiscalData, setFiscalData] = useState({
    invoiceTerms: 'Pago a 15 días',
    defaultCurrency: 'USD',
    taxRate: '18',
    invoicePrefix: 'INV',
    invoiceNotes: 'Gracias por su preferencia. El pago debe realizarse dentro de los 15 días siguientes a la fecha de emisión.'
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNewSubscription: true,
    emailExpiringSubscription: true,
    emailPaymentReceived: true,
    emailInvoiceOverdue: true,
    whatsappAlerts: false,
    slackIntegration: false,
    dailyReport: true,
    weeklyReport: true
  });
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);
  const handleSaveCompany = () => {
    toast.success("Perfil de empresa guardado");
  };
  const handleSaveFiscal = () => {
    toast.success("Configuración fiscal guardada");
  };
  const handleSaveNotifications = () => {
    toast.success("Preferencias de notificaciones guardadas");
  };
  return <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Ajustes generales del sistema
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="company" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="mr-2 h-4 w-4" />
            Perfil Empresa
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Receipt className="mr-2 h-4 w-4" />
            Configuración Fiscal
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Company Profile */}
        <TabsContent value="company" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-secondary">
            {loading ? <div className="space-y-4">
                {[...Array(6)].map((_, i) => <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>)}
              </div> : <div className="space-y-6">
                {/* Logo upload */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-secondary">
                    <Label htmlFor="companyName">Nombre de la empresa</Label>
                    <Input id="companyName" value={companyData.name} onChange={e => setCompanyData({
                  ...companyData,
                  name: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">RUC / NIF</Label>
                    <Input id="taxId" value={companyData.taxId} onChange={e => setCompanyData({
                  ...companyData,
                  taxId: e.target.value
                })} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={companyData.address} onChange={e => setCompanyData({
                  ...companyData,
                  address: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" value={companyData.city} onChange={e => setCompanyData({
                  ...companyData,
                  city: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label>País</Label>
                    <Select value={companyData.country} onValueChange={v => setCompanyData({
                  ...companyData,
                  country: v
                })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PE">🇵🇪 Perú</SelectItem>
                        <SelectItem value="MX">🇲🇽 México</SelectItem>
                        <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                        <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                        <SelectItem value="CL">🇨🇱 Chile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={companyData.phone} onChange={e => setCompanyData({
                  ...companyData,
                  phone: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={companyData.email} onChange={e => setCompanyData({
                  ...companyData,
                  email: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio web</Label>
                    <Input id="website" value={companyData.website} onChange={e => setCompanyData({
                  ...companyData,
                  website: e.target.value
                })} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button className="btn-primary-glow" onClick={handleSaveCompany}>
                    <Check className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </div>}
          </div>
        </TabsContent>

        {/* Fiscal Settings */}
        <TabsContent value="fiscal" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            {loading ? <div className="space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>)}
              </div> : <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoicePrefix">Prefijo de factura</Label>
                    <Input id="invoicePrefix" value={fiscalData.invoicePrefix} onChange={e => setFiscalData({
                  ...fiscalData,
                  invoicePrefix: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Moneda por defecto</Label>
                    <Select value={fiscalData.defaultCurrency} onValueChange={v => setFiscalData({
                  ...fiscalData,
                  defaultCurrency: v
                })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                        <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                        <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                        <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceTerms">Términos de pago</Label>
                    <Input id="invoiceTerms" value={fiscalData.invoiceTerms} onChange={e => setFiscalData({
                  ...fiscalData,
                  invoiceTerms: e.target.value
                })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tasa de impuesto (%)</Label>
                    <Input id="taxRate" type="number" value={fiscalData.taxRate} onChange={e => setFiscalData({
                  ...fiscalData,
                  taxRate: e.target.value
                })} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="invoiceNotes">Notas en factura</Label>
                    <Textarea id="invoiceNotes" value={fiscalData.invoiceNotes} onChange={e => setFiscalData({
                  ...fiscalData,
                  invoiceNotes: e.target.value
                })} rows={3} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button className="btn-primary-glow" onClick={handleSaveFiscal}>
                    <Check className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </div>}
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            {loading ? <div className="space-y-4">
                {[...Array(6)].map((_, i) => <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-6 w-10" />
                  </div>)}
              </div> : <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Notificaciones por Email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Nueva suscripción</p>
                        <p className="text-xs text-muted-foreground">Recibir email cuando se crea una nueva suscripción</p>
                      </div>
                      <Switch checked={notifications.emailNewSubscription} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    emailNewSubscription: checked
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Suscripción por vencer</p>
                        <p className="text-xs text-muted-foreground">Alertas de suscripciones próximas a vencer</p>
                      </div>
                      <Switch checked={notifications.emailExpiringSubscription} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    emailExpiringSubscription: checked
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Pago recibido</p>
                        <p className="text-xs text-muted-foreground">Confirmación de pagos registrados</p>
                      </div>
                      <Switch checked={notifications.emailPaymentReceived} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    emailPaymentReceived: checked
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Factura vencida</p>
                        <p className="text-xs text-muted-foreground">Alertas de facturas con mora</p>
                      </div>
                      <Switch checked={notifications.emailInvoiceOverdue} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    emailInvoiceOverdue: checked
                  })} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">Integraciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">WhatsApp Alerts</p>
                        <p className="text-xs text-muted-foreground">Enviar alertas críticas por WhatsApp</p>
                      </div>
                      <Switch checked={notifications.whatsappAlerts} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    whatsappAlerts: checked
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Slack Integration</p>
                        <p className="text-xs text-muted-foreground">Enviar notificaciones a canal de Slack</p>
                      </div>
                      <Switch checked={notifications.slackIntegration} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    slackIntegration: checked
                  })} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">Reportes Automáticos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Reporte diario</p>
                        <p className="text-xs text-muted-foreground">Resumen diario de operaciones</p>
                      </div>
                      <Switch checked={notifications.dailyReport} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    dailyReport: checked
                  })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Reporte semanal</p>
                        <p className="text-xs text-muted-foreground">Resumen semanal con métricas clave</p>
                      </div>
                      <Switch checked={notifications.weeklyReport} onCheckedChange={checked => setNotifications({
                    ...notifications,
                    weeklyReport: checked
                  })} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button className="btn-primary-glow" onClick={handleSaveNotifications}>
                    <Check className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>;
}