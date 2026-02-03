import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedAdminLayout } from "./components/ProtectedAdminLayout";
import { AuthProvider, RequireAuth, RequireRole } from "./contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import Alerts from "./pages/Alerts";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import System from "./pages/System";
import Configuration from "./pages/Configuration";
import Audit from "./pages/Audit";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Portal from "./pages/Portal";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuditLog from "./pages/AuditLog";

// Operational flows
import Consultar from "./pages/Consultar";
import NuevaVenta from "./pages/NuevaVenta";
import RegistrarPago from "./pages/RegistrarPago";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* User portal (role: user) */}
            <Route path="/portal" element={
              <RequireAuth>
                <Portal />
              </RequireAuth>
            } />
            <Route path="/portal/*" element={
              <RequireAuth>
                <Portal />
              </RequireAuth>
            } />

            {/* Admin routes (roles: super_admin, admin) */}
            <Route element={<ProtectedAdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/system" element={<System />} />
              <Route path="/configuration" element={<Configuration />} />
              
              {/* Profile (all authenticated) */}
              <Route path="/profile" element={<Profile />} />
              
              {/* Settings (super_admin, admin) */}
              <Route path="/settings" element={<Settings />} />
              
              {/* Audit (super_admin only) */}
              <Route
                path="/audit"
                element={
                  <RequireRole roles={['super_admin']}>
                    <AuditLog />
                  </RequireRole>
                }
              />

              {/* Operational flows */}
              <Route path="/ops/consultar" element={<Consultar />} />
              <Route path="/ops/nueva-venta" element={<NuevaVenta />} />
              <Route path="/ops/registrar-pago" element={<RegistrarPago />} />
              
              {/* Search redirect */}
              <Route path="/search" element={<Dashboard />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
