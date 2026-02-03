import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

interface CredentialRevealProps {
  username: string;
  password: string;
  className?: string;
}

export function CredentialReveal({ username, password, className }: CredentialRevealProps) {
  const [showCredentials, setShowCredentials] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [copied, setCopied] = useState<'user' | 'pass' | null>(null);

  const handleRevealClick = () => {
    if (!showCredentials) {
      setConfirmDialogOpen(true);
    } else {
      setShowCredentials(false);
    }
  };

  const handleConfirmReveal = () => {
    setShowCredentials(true);
    setConfirmDialogOpen(false);
    toast.info("Credenciales reveladas - datos sensibles visibles");
  };

  const handleCopy = async (text: string, type: 'user' | 'pass') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(type === 'user' ? "Usuario copiado" : "Contraseña copiada");
    setTimeout(() => setCopied(null), 2000);
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return `${local.substring(0, 2)}${'•'.repeat(Math.max(local.length - 2, 4))}@${domain}`;
  };

  return (
    <>
      <div className={cn("rounded-lg border border-border bg-muted/30 p-4", className)}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Credenciales</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleRevealClick}
            >
              {showCredentials ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 group">
            <span className="text-xs text-muted-foreground w-12">User:</span>
            <code className="flex-1 rounded bg-background px-2 py-1.5 text-xs font-mono transition-colors">
              {showCredentials ? username : maskEmail(username)}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopy(username, 'user')}
            >
              {copied === 'user' ? (
                <Check className="h-3.5 w-3.5 text-status-active" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 group">
            <span className="text-xs text-muted-foreground w-12">Pass:</span>
            <code className="flex-1 rounded bg-background px-2 py-1.5 text-xs font-mono transition-colors">
              {showCredentials ? password : '••••••••••••'}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopy(password, 'pass')}
            >
              {copied === 'pass' ? (
                <Check className="h-3.5 w-3.5 text-status-active" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-expiring" />
              Datos Sensibles
            </DialogTitle>
            <DialogDescription>
              Estás a punto de revelar credenciales de acceso. Esta información es confidencial y debe manejarse con cuidado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-lg border border-status-expiring/30 bg-status-expiring/10 p-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-status-expiring">•</span>
                No compartas estas credenciales por canales inseguros
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-expiring">•</span>
                Esta acción queda registrada en el log de auditoría
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-expiring">•</span>
                Las credenciales se ocultarán automáticamente al cambiar de vista
              </li>
            </ul>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmReveal}
              className="bg-status-expiring text-black hover:bg-status-expiring/90"
            >
              Confirmar y Revelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
