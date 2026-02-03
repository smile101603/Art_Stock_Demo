import React from 'react';
import { RequireAuth, RequireRole } from '@/contexts/AuthContext';
import { AdminLayout } from './AdminLayout';

/**
 * Protected Admin Layout wrapper that ensures auth context is available
 * before rendering AdminLayout component
 * 
 * This component wraps AdminLayout with RequireAuth and RequireRole guards
 * to ensure proper authentication and authorization before rendering.
 * 
 * The nested structure ensures:
 * 1. RequireAuth checks if user is authenticated
 * 2. RequireRole checks if user has admin/super_admin role
 * 3. Only then AdminLayout is rendered with access to auth context
 */
export function ProtectedAdminLayout() {
  return (
    <RequireAuth>
      <RequireRole roles={['super_admin', 'admin']}>
        <AdminLayout />
      </RequireRole>
    </RequireAuth>
  );
}
