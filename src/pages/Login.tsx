import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Lock, Mail, User, Shield, Users, ChevronRight } from 'lucide-react';

const demoUsers = [
  { email: 'superadmin@artstock.demo', role: 'super_admin' as UserRole, label: 'Super Admin', icon: Shield },
  { email: 'admin@artstock.demo', role: 'admin' as UserRole, label: 'Admin', icon: Users },
  { email: 'user@artstock.demo', role: 'user' as UserRole, label: 'Usuario', icon: User },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    signIn(email, role);
    toast.success(`Bienvenido a Art Stock`);

    // Redirect based on role
    if (role === 'user') {
      navigate('/portal', { replace: true });
    } else {
      navigate(from === '/login' ? '/' : from, { replace: true });
    }

    setIsLoading(false);
  };

  const handleDemoUserClick = (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setRole(demoUser.role);
    toast.info(`Demo: ${demoUser.label} seleccionado`);
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-primary-foreground">AS</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Art Stock</h1>
          <p className="mt-2 text-muted-foreground">Sistema de gestión de suscripciones</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">Demo: cualquier contraseña funciona</p>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <Label>Rol (demo)</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-status-active" />
                      Super Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Usuario
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Recordarme
                </Label>
              </div>
              <button type="button" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full btn-primary-glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Iniciando sesión...
                </div>
              ) : (
                <>
                  Iniciar sesión
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Usuarios demo</span>
            </div>
          </div>

          {/* Demo users */}
          <div className="space-y-2">
            {demoUsers.map((demoUser) => (
              <button
                key={demoUser.email}
                type="button"
                onClick={() => handleDemoUserClick(demoUser)}
                className="w-full flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-left text-sm transition-all hover:bg-muted/50 hover:border-primary/30"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <demoUser.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{demoUser.label}</p>
                  <p className="text-xs text-muted-foreground">{demoUser.email}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2025 Art Stock. Sistema ERP de gestión de suscripciones.
        </p>
      </div>
    </div>
  );
}
