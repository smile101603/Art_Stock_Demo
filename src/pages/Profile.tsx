import React, { useState } from 'react';
import { useAuth, logAudit, getTheme, setTheme as setGlobalTheme } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import { User, Shield, Moon, Sun, Globe, Lock, Key, Save } from 'lucide-react';

export default function Profile() {
  const { session, updateUser } = useAuth();
  const user = session.user;

  const [name, setName] = useState(user?.name || '');
  const [theme, setThemeState] = useState<'dark' | 'light'>(getTheme());
  const [language, setLanguage] = useState('es');
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    updateUser({ name });
    setGlobalTheme(theme);

    // Store language preference
    localStorage.setItem('artstock_language', language);

    toast.success('Perfil actualizado correctamente');
    setIsSaving(false);
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setThemeState(newTheme);
    setGlobalTheme(newTheme);
  };

  const handlePasswordChange = () => {
    if (user) {
      logAudit(user, 'password_change_requested', 'user', user.id, 'Usuario solicitó cambio de contraseña');
    }
    toast.success('Demo: Contraseña actualizada');
    setPasswordModalOpen(false);
  };

  const handleEnable2FA = () => {
    if (user) {
      logAudit(user, '2fa_enabled', 'user', user.id, 'Usuario habilitó autenticación de dos factores');
    }
    toast.success('Demo: 2FA habilitado correctamente');
    setTwoFAModalOpen(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User info card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center">
              <User className="h-8 w-8 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                <Shield className="h-3 w-3" />
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">El email no puede modificarse</p>
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground capitalize">
                  {user.role.replace('_', ' ')}
                </span>
                <span className="text-xs text-muted-foreground">Asignado por administrador</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Preferencias</h3>
          </div>

          <div className="space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-status-expiring" />
                )}
                <div>
                  <p className="font-medium text-foreground">Tema</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={handleThemeChange}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Security card */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Seguridad</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="font-medium text-foreground">Contraseña</p>
                <p className="text-xs text-muted-foreground">Última actualización hace 30 días</p>
              </div>
              <Button variant="outline" onClick={() => setPasswordModalOpen(true)}>
                <Key className="mr-2 h-4 w-4" />
                Cambiar
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="font-medium text-foreground">Autenticación 2FA</p>
                <p className="text-xs text-muted-foreground">No configurada</p>
              </div>
              <Button variant="outline" onClick={() => setTwoFAModalOpen(true)}>
                <Shield className="mr-2 h-4 w-4" />
                Activar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="btn-primary-glow">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Guardando...
            </div>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      {/* Password Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Contraseña actual</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Nueva contraseña</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirmar contraseña</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange}>
              Cambiar contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Modal */}
      <Dialog open={twoFAModalOpen} onOpenChange={setTwoFAModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activar autenticación de dos factores</DialogTitle>
            <DialogDescription>
              Escanea el código QR con tu aplicación autenticadora.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center gap-4">
            <div className="h-48 w-48 rounded-lg bg-muted flex items-center justify-center border border-border">
              <p className="text-sm text-muted-foreground text-center px-4">
                [QR Code Placeholder]<br/>Demo: Código simulado
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Código de respaldo:</p>
              <code className="text-lg font-mono font-bold text-primary">DEMO-2FA-XXXX-YYYY</code>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwoFAModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnable2FA} className="btn-primary-glow">
              Activar 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
