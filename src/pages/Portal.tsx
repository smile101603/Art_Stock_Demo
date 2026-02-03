import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CreditCard, 
  HelpCircle, 
  User, 
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Portal KPI Card
function PortalKPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default' 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning';
}) {
  const variantClasses = {
    default: 'from-primary/20 to-info/20',
    success: 'from-status-active/20 to-status-active/10',
    warning: 'from-status-expiring/20 to-status-expiring/10',
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${variantClasses[variant]} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>
    </div>
  );
}

// Quick action card
function QuickAction({ 
  title, 
  description, 
  icon: Icon, 
  to 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  to: string;
}) {
  return (
    <Link 
      to={to}
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:bg-accent/20 hover:border-primary/30 group"
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

export default function Portal() {
  const { session } = useAuth();

  return (
    <div className="dark min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">AS</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Art Stock</h1>
              <p className="text-xs text-muted-foreground">Portal de Cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session.user?.name}
            </span>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Bienvenido, {session.user?.name?.split(' ')[0]}
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus suscripciones y pagos desde aquí.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <PortalKPICard
            title="Suscripciones Activas"
            value={3}
            icon={FileText}
            variant="success"
          />
          <PortalKPICard
            title="Próximo Pago"
            value="$45.00"
            subtitle="Vence en 5 días"
            icon={Clock}
            variant="warning"
          />
          <PortalKPICard
            title="Pagos al Día"
            value="100%"
            icon={CheckCircle}
            variant="success"
          />
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <QuickAction
              title="Mis Suscripciones"
              description="Ver todas tus suscripciones activas"
              icon={FileText}
              to="/portal/subscriptions"
            />
            <QuickAction
              title="Historial de Pagos"
              description="Consulta tus pagos y comprobantes"
              icon={CreditCard}
              to="/portal/payments"
            />
            <QuickAction
              title="Mi Perfil"
              description="Edita tu información personal"
              icon={User}
              to="/profile"
            />
            <QuickAction
              title="Soporte"
              description="¿Necesitas ayuda? Contáctanos"
              icon={HelpCircle}
              to="/portal/support"
            />
          </div>
        </div>

        {/* Recent subscriptions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Tus Suscripciones</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-muted-foreground">Producto</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-muted-foreground">Vencimiento</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">ChatGPT Plus</p>
                    <p className="text-xs text-muted-foreground">Plan Mensual</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">2025-02-15</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-status-active/15 px-2 py-0.5 text-xs font-medium text-status-active">
                      Activa
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">Canva Pro</p>
                    <p className="text-xs text-muted-foreground">Plan Mensual</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">2025-02-20</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-status-active/15 px-2 py-0.5 text-xs font-medium text-status-active">
                      Activa
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-accent/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">Netflix Premium</p>
                    <p className="text-xs text-muted-foreground">Plan Mensual</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">2025-01-25</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-status-expiring/15 px-2 py-0.5 text-xs font-medium text-status-expiring">
                      Por vencer
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
