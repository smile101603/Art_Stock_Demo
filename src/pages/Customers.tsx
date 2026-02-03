import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Building2, 
  Store,
  MoreHorizontal,
  Eye,
  FileText,
  CreditCard,
  Phone,
  Mail,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterChips, type FilterChip } from '@/components/FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
import { mockCustomers } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const typeIcons = {
  contact: Users,
  company: Building2,
  reseller: Store,
};

const typeLabels = {
  contact: 'Contacto',
  company: 'Empresa',
  reseller: 'Reseller',
};

const behaviorBadges: Record<string, { label: string; className: string }> = {
  punctual: { label: 'Puntual', className: 'bg-status-active/15 text-status-active' },
  mixed: { label: 'Mixto', className: 'bg-status-expiring/15 text-status-expiring' },
  defaulter: { label: 'Moroso', className: 'bg-status-overdue/15 text-status-overdue' },
};

export default function Customers() {
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredCustomers = mockCustomers.filter(customer => {
    if (typeFilter !== 'all' && customer.type !== typeFilter) return false;
    if (statusFilter !== 'all' && customer.status !== statusFilter) return false;
    if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !customer.phone.includes(searchQuery) &&
        !customer.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const typeChips: FilterChip[] = [
    { value: 'all', label: 'Todos', count: mockCustomers.length },
    { value: 'contact', label: 'Contactos', count: mockCustomers.filter(c => c.type === 'contact').length },
    { value: 'company', label: 'Empresas', count: mockCustomers.filter(c => c.type === 'company').length, color: 'info' },
    { value: 'reseller', label: 'Resellers', count: mockCustomers.filter(c => c.type === 'reseller').length, color: 'success' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de contactos, empresas y resellers
          </p>
        </div>
        <Button className="btn-primary-glow">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips 
          chips={typeChips} 
          value={typeFilter} 
          onChange={setTypeFilter} 
        />

        {/* Search and additional filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[280px] pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-muted/70 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contacto</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">País</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suscripciones</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comportamiento</th>
                <th className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total pagado</th>
                <th className="py-2.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No se encontraron clientes</p>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => {
                  const Icon = typeIcons[customer.type];
                  const behavior = behaviorBadges[customer.paymentBehavior];
                  
                  return (
                    <tr key={customer.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-info/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-foreground">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{customer.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                          <Icon className="h-3 w-3" />
                          {typeLabels[customer.type]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-sm text-foreground">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">
                            {customer.country === 'PE' ? '🇵🇪' : 
                             customer.country === 'MX' ? '🇲🇽' : 
                             customer.country === 'CO' ? '🇨🇴' : '🌍'}
                          </span>
                          <span className="text-sm text-muted-foreground">{customer.country}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">{customer.activeSubscriptions}</span>
                        <span className="ml-1 text-xs text-muted-foreground">activas</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          behavior.className
                        )}>
                          {behavior.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">
                          ${customer.totalPaid.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver ficha
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver suscripciones
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Estado de cuenta
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} de {filteredCustomers.length}
            </p>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => {
                setItemsPerPage(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Anterior
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              {currentPage} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
