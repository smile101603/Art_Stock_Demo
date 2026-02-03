import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Download,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/KPICard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock data for charts
const revenueData = [
  { month: 'Ago', revenue: 4200 },
  { month: 'Sep', revenue: 4800 },
  { month: 'Oct', revenue: 5100 },
  { month: 'Nov', revenue: 5600 },
  { month: 'Dic', revenue: 6200 },
  { month: 'Ene', revenue: 5850 },
];

const subscriptionsByType = [
  { name: 'Individual (1:1)', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Compartida (1:N)', value: 35, color: 'hsl(var(--info))' },
  { name: 'Teams', value: 15, color: 'hsl(var(--status-active))' },
  { name: 'Profile', value: 5, color: 'hsl(var(--status-expiring))' },
];

const invoiceStatus = [
  { name: 'Pagadas', value: 65, color: 'hsl(var(--status-active))' },
  { name: 'Pendientes', value: 20, color: 'hsl(var(--status-expiring))' },
  { name: 'Vencidas', value: 15, color: 'hsl(var(--status-overdue))' },
];

const newSubscriptions = [
  { month: 'Ago', count: 12 },
  { month: 'Sep', count: 18 },
  { month: 'Oct', count: 15 },
  { month: 'Nov', count: 22 },
  { month: 'Dic', count: 28 },
  { month: 'Ene', count: 24 },
];

// KPI data
const kpiData = {
  monthlyRevenue: 5850,
  newSubscriptions: 24,
  churnRate: 2.3,
  activeCustomers: 156,
};

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6months');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadCSV = () => {
    toast.success("Descargando reporte CSV...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Datos actualizados");
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Análisis y métricas del negocio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mes</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          
          <Button className="btn-primary-glow" onClick={handleDownloadCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          <>
            <KPICard
              title="Ingresos del Mes"
              value={`$${kpiData.monthlyRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 8, isPositive: true }}
              variant="success"
            />
            <KPICard
              title="Nuevas Suscripciones"
              value={kpiData.newSubscriptions}
              subtitle="Este mes"
              icon={FileText}
              trend={{ value: 12, isPositive: true }}
              variant="info"
            />
            <KPICard
              title="Tasa de Churn"
              value={`${kpiData.churnRate}%`}
              icon={TrendingUp}
              trend={{ value: 0.5, isPositive: false }}
              variant="warning"
            />
            <KPICard
              title="Clientes Activos"
              value={kpiData.activeCustomers}
              icon={Users}
              trend={{ value: 5, isPositive: true }}
              variant="success"
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue over time */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Ingresos Mensuales</h3>
          {loading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`$${value}`, 'Ingresos']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* New subscriptions by month */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Nuevas Suscripciones</h3>
          {loading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newSubscriptions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Subscriptions by type */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Suscripciones por Tipo</h3>
          {loading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {subscriptionsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Invoices status */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Estado de Facturas</h3>
          {loading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {invoiceStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
