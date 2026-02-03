import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Role types
export type UserRole = 'super_admin' | 'admin' | 'user';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Session interface
export interface Session {
  isAuthenticated: boolean;
  user: User | null;
  loginTime?: string;
}

// Auth context interface
interface AuthContextType {
  session: Session;
  signIn: (email: string, role: UserRole, name?: string) => void;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  hasRole: (roles: UserRole[]) => boolean;
  isLoading: boolean;
}

// Audit log interface
export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

// Storage keys
const SESSION_KEY = 'artstock_session';
const AUDIT_LOG_KEY = 'artstock_audit_log';
const THEME_KEY = 'artstock_theme';

// Default session
const defaultSession: Session = {
  isAuthenticated: false,
  user: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate realistic user data
function generateUserData(email: string, role: UserRole, customName?: string): User {
  const names: Record<string, string> = {
    'superadmin@artstock.demo': 'Carlos Mendoza',
    'admin@artstock.demo': 'María García',
    'user@artstock.demo': 'Pedro Torres',
  };

  const name = customName || names[email] || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    id: `USR-${Date.now().toString(36).toUpperCase()}`,
    name,
    email,
    role,
  };
}

// Audit logger helper
export function logAudit(
  user: User | null,
  action: string,
  entityType: string,
  entityId: string,
  details: string,
  before?: Record<string, unknown>,
  after?: Record<string, unknown>
) {
  if (!user) return;

  const logs: AuditLog[] = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
  
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    actorEmail: user.email,
    actorRole: user.role,
    action,
    entityType,
    entityId,
    details,
    before,
    after,
  };

  logs.unshift(newLog);
  
  // Keep last 500 logs
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 500)));
}

// Get audit logs
export function getAuditLogs(): AuditLog[] {
  return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
}

// Theme helper
export function getTheme(): 'dark' | 'light' {
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
}

export function setTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(defaultSession);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Session;
        if (parsed.isAuthenticated && parsed.user) {
          setSession(parsed);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    
    // Initialize theme
    const theme = getTheme();
    setTheme(theme);
    
    setIsLoading(false);
  }, []);

  // Sign in
  const signIn = useCallback((email: string, role: UserRole, name?: string) => {
    const user = generateUserData(email, role, name);
    const newSession: Session = {
      isAuthenticated: true,
      user,
      loginTime: new Date().toISOString(),
    };

    setSession(newSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));

    // Log audit
    logAudit(user, 'login_success', 'session', user.id, `Usuario ${email} inició sesión como ${role}`);
  }, []);

  // Sign out
  const signOut = useCallback(() => {
    const user = session.user;
    
    if (user) {
      logAudit(user, 'logout', 'session', user.id, `Usuario ${user.email} cerró sesión`);
    }

    setSession(defaultSession);
    localStorage.removeItem(SESSION_KEY);
  }, [session.user]);

  // Update user
  const updateUser = useCallback((updates: Partial<User>) => {
    if (!session.user) return;

    const before = { ...session.user };
    const updatedUser = { ...session.user, ...updates };
    const newSession = { ...session, user: updatedUser };

    setSession(newSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));

    logAudit(
      updatedUser,
      'profile_updated',
      'user',
      updatedUser.id,
      'Perfil de usuario actualizado',
      before,
      updatedUser
    );
  }, [session]);

  // Has role check
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!session.user) return false;
    return roles.includes(session.user.role);
  }, [session.user]);

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, updateUser, hasRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Route guard components
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !session.isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [session.isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session.isAuthenticated) {
    // Return null - navigation will happen via useEffect
    // This prevents rendering children when not authenticated
    return null;
  }
  
  return <>{children}</>;
}

export function RequireRole({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) {
  const { session, hasRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session.isAuthenticated && !hasRole(roles)) {
      navigate('/unauthorized', { replace: true });
    }
  }, [session.isAuthenticated, hasRole, roles, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasRole(roles)) {
    return null;
  }
  
  return <>{children}</>;
}
