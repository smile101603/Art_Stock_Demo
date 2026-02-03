import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleBack = () => {
    if (session.user?.role === 'user') {
      navigate('/portal');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto h-20 w-20 rounded-2xl bg-status-overdue/10 flex items-center justify-center">
          <ShieldX className="h-10 w-10 text-status-overdue" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Acceso Restringido</h1>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-border bg-card p-4 text-left">
          <p className="text-sm text-muted-foreground">
            Tu rol actual: <span className="font-medium text-foreground capitalize">{session.user?.role?.replace('_', ' ') || 'No autenticado'}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Contacta al administrador si necesitas acceso adicional.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button onClick={handleBack} className="btn-primary-glow">
            <Home className="mr-2 h-4 w-4" />
            {session.user?.role === 'user' ? 'Ir al Portal' : 'Ir al Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
}
