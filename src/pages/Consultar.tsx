import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  FileText,
  Building2,
  Store,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Eye,
  ArrowRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { mockCustomers, mockSubscriptions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

type SearchResult = {
  type: 'customer' | 'subscription';
  id: string;
  title: string;
  subtitle: string;
  metadata: string[];
  icon: React.ElementType;
  data: any;
};

const typeIcons = {
  contact: Users,
  company: Building2,
  reseller: Store,
};

export default function Consultar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'customer' | 'subscription'>('all');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const searchResults: SearchResult[] = [];

      // Search customers
      if (selectedCategory === 'all' || selectedCategory === 'customer') {
        mockCustomers.forEach(customer => {
          const matches = 
            customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            customer.phone.includes(query) ||
            customer.id.toLowerCase().includes(query);

          if (matches) {
            const Icon = typeIcons[customer.type];
            searchResults.push({
              type: 'customer',
              id: customer.id,
              title: customer.name,
              subtitle: customer.email,
              metadata: [
                customer.phone,
                `${customer.activeSubscriptions} suscripciones activas`,
                `Total pagado: $${customer.totalPaid.toFixed(2)}`
              ],
              icon: Icon,
              data: customer,
            });
          }
        });
      }

      // Search subscriptions
      if (selectedCategory === 'all' || selectedCategory === 'subscription') {
        mockSubscriptions.forEach(sub => {
          const matches = 
            sub.customerName.toLowerCase().includes(query) ||
            sub.product.toLowerCase().includes(query) ||
            sub.id.toLowerCase().includes(query) ||
            sub.customerId.toLowerCase().includes(query);

          if (matches) {
            searchResults.push({
              type: 'subscription',
              id: sub.id,
              title: `${sub.product} - ${sub.customerName}`,
              subtitle: `Plan: ${sub.plan} • ${sub.type}`,
              metadata: [
                `Vence: ${new Date(sub.expiryDate).toLocaleDateString('es-PE')}`,
                `Monto: $${sub.amount.toFixed(2)} ${sub.currency}`,
                `Estado: ${sub.status}`
              ],
              icon: FileText,
              data: sub,
            });
          }
        });
      }

      setResults(searchResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'customer') {
      navigate(`/customers/${result.id}`);
    } else {
      navigate(`/subscriptions?id=${result.id}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultar</h1>
          <p className="text-sm text-muted-foreground">
            Búsqueda 360° de clientes y suscripciones
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email, teléfono, ID de cliente o suscripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 pl-11 pr-10 text-base"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category filter */}
      {searchQuery && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrar:</span>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Todos ({results.length})
          </Button>
          <Button
            variant={selectedCategory === 'customer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('customer')}
          >
            Clientes ({mockCustomers.filter(c => 
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.phone.includes(searchQuery) ||
              c.id.toLowerCase().includes(searchQuery.toLowerCase())
            ).length})
          </Button>
          <Button
            variant={selectedCategory === 'subscription' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('subscription')}
          >
            Suscripciones ({mockSubscriptions.filter(s => 
              s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.id.toLowerCase().includes(searchQuery.toLowerCase())
            ).length})
          </Button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      ) : searchQuery && results.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-sm text-muted-foreground">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : !searchQuery ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Búsqueda 360°
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Busca clientes y suscripciones por nombre, email, teléfono o ID
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{mockCustomers.length} clientes</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{mockSubscriptions.length} suscripciones</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result) => {
            const Icon = result.icon;
            return (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-accent/20"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {result.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {result.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {result.metadata.map((meta, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                          {meta}
                        </span>
                      ))}
                    </div>
                    {result.type === 'subscription' && (
                      <div className="mt-2">
                        <StatusBadge status={result.data.status} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Results count */}
      {searchQuery && results.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
