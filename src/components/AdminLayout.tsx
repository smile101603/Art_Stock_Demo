import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  CreditCard, 
  Package, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User, 
  LogOut, 
  Command, 
  Boxes, 
  Receipt, 
  AlertTriangle, 
  BarChart3, 
  Shield,
  ChevronDown,
  Moon,
  Sun,
  UserCog,
  HelpCircle,
  ShoppingCart,
  Wallet,
  ClipboardList,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CommandPalette } from '@/components/CommandPalette';
import { useAuth, logAudit, getTheme, setTheme, type UserRole } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles?: UserRole[]; // Which roles can see this item
}

interface NavSection {
  section: string;
  roles?: UserRole[]; // Which roles can see this section
  items: NavItem[];
}

// Full navigation tree with role restrictions
const navigation: NavSection[] = [
  {
    section: 'Principal',
    roles: ['super_admin', 'admin'],
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Operaciones',
    roles: ['super_admin', 'admin'],
    items: [
      { name: 'Consultar', href: '/ops/consultar', icon: Search },
      { name: 'Nueva Venta', href: '/ops/nueva-venta', icon: ShoppingCart },
      { name: 'Registrar Pago', href: '/ops/registrar-pago', icon: Wallet },
      { name: 'Alertas / Tareas', href: '/alerts', icon: AlertTriangle, badge: 5 },
    ],
  },
  {
    section: 'Gestión',
    roles: ['super_admin', 'admin'],
    items: [
      { name: 'Clientes', href: '/customers', icon: Users },
      { name: 'Suscripciones', href: '/subscriptions', icon: FileText, badge: 3 },
      { name: 'Inventario', href: '/inventory', icon: Boxes },
      { name: 'Productos', href: '/products', icon: Package },
    ],
  },
  {
    section: 'Finanzas',
    roles: ['super_admin', 'admin'],
    items: [
      { name: 'Cobranza', href: '/billing', icon: CreditCard, badge: 2 },
      { name: 'Pagos', href: '/payments', icon: Receipt },
      { name: 'Reportes', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    section: 'Sistema',
    roles: ['super_admin', 'admin'],
    items: [
      { name: 'Configuración', href: '/settings', icon: Settings, roles: ['super_admin', 'admin'] },
      { name: 'Sistema', href: '/system', icon: Shield, roles: ['super_admin', 'admin'] },
      { name: 'Auditoría', href: '/audit', icon: ClipboardList, roles: ['super_admin'] },
    ],
  },
  // User portal navigation
  {
    section: 'Portal',
    roles: ['user'],
    items: [
      { name: 'Inicio', href: '/portal', icon: LayoutDashboard },
      { name: 'Mis Suscripciones', href: '/portal/subscriptions', icon: FileText },
      { name: 'Pagos', href: '/portal/payments', icon: CreditCard },
      { name: 'Soporte', href: '/portal/support', icon: HelpCircle },
    ],
  },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut, hasRole, isLoading } = useAuth();
  const user = session.user;

  // Show loading state if auth is still initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Demo role switcher state (only for super_admin)
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);
  const effectiveRole = demoRole || user?.role;

  // Keyboard shortcut for command palette
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSignOut = () => {
    signOut();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const handleDemoRoleSwitch = (role: UserRole) => {
    setDemoRole(role);
    if (user) {
      logAudit(user, 'role_switched_demo', 'session', user.id, `Demo: Rol cambiado a ${role}`);
    }
    toast.info(`Demo: Ahora viendo como ${role.replace('_', ' ')}`);
  };

  // Filter navigation based on effective role
  const visibleNavigation = navigation
    .filter(section => {
      if (!section.roles) return true;
      return effectiveRole && section.roles.includes(effectiveRole);
    })
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (!item.roles) return true;
        return effectiveRole && item.roles.includes(effectiveRole);
      }),
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="dark min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300 ease-out",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="h-16 border-b border-border px-4 bg-[hsl(222,47%,11%)] flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">AS</span>
              </div>
              <span className="font-semibold text-foreground">Art Stock</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {visibleNavigation.map(group => (
            <div key={group.section} className="mb-4">
              {!collapsed && (
                <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group.section}
                </p>
              )}
              <ul className="space-y-1 px-2">
                {group.items.map(item => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link 
                        to={item.href} 
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-sidebar-accent",
                collapsed && "justify-center"
              )}>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/50 to-info/50 flex items-center justify-center">
                  <User className="h-4 w-4 text-foreground" />
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ') || 'Guest'}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <span>{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">• {user?.role?.replace('_', ' ')}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              {hasRole(['super_admin', 'admin']) && (
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          {/* Search bar */}
          <button 
            onClick={() => setCommandOpen(true)} 
            className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Buscar clientes, suscripciones, facturas...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          <div className="flex-1" />

          {/* Demo role switcher (super_admin only) */}
          {user?.role === 'super_admin' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">Demo:</span>
              <Select 
                value={demoRole || 'actual'} 
                onValueChange={(v) => handleDemoRoleSwitch(v === 'actual' ? user.role : v as UserRole)}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="Ver como..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actual">Mi rol</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
