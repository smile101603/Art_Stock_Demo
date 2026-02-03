import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  CreditCard,
  Search,
  User,
  Receipt,
  Boxes,
} from 'lucide-react';
import { mockCustomers, mockSubscriptions, mockInvoices } from '@/data/mockData';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar clientes, suscripciones, facturas..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        <CommandGroup heading="Navegación rápida">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/subscriptions'))}>
            <FileText className="mr-2 h-4 w-4" />
            Suscripciones
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/inventory'))}>
            <Boxes className="mr-2 h-4 w-4" />
            Inventario
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/customers'))}>
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Clientes recientes">
          {mockCustomers.slice(0, 5).map((customer) => (
            <CommandItem
              key={customer.id}
              onSelect={() => runCommand(() => navigate(`/customers/${customer.id}`))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>{customer.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{customer.phone}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Suscripciones">
          {mockSubscriptions.slice(0, 5).map((sub) => (
            <CommandItem
              key={sub.id}
              onSelect={() => runCommand(() => navigate(`/subscriptions?id=${sub.id}`))}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>{sub.product}</span>
              <span className="ml-2 text-xs text-muted-foreground">{sub.customerName}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Facturas pendientes">
          {mockInvoices.filter(i => i.status !== 'paid').slice(0, 3).map((invoice) => (
            <CommandItem
              key={invoice.id}
              onSelect={() => runCommand(() => navigate(`/billing?id=${invoice.id}`))}
            >
              <Receipt className="mr-2 h-4 w-4" />
              <span>{invoice.id}</span>
              <span className="ml-2 text-xs text-muted-foreground">${invoice.amount} - {invoice.customerName}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
