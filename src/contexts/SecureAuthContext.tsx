import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface SecureAuthContextType {
  user: { id: string; username: string; email: string } | null;
  userRole: 'admin' | 'user' | null;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  loading: boolean;
  isAdmin: boolean;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  // Audit logging function
  const logAuditEvent = async (action: string, details?: any) => {
    try {
      await supabase.rpc('log_audit_event', {
        p_action: action,
        p_resource_type: 'auth',
        p_new_values: details,
        p_ip_address: await getClientIP(),
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  };

  // Get client IP (fallback method)
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Rate limiting check
  const checkRateLimit = async (action: string, identifier?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: identifier || (await getClientIP()),
        p_action: action,
        p_max_requests: action === 'login' ? 5 : 10,
        p_window_minutes: 15
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to prevent blocking legitimate users
    }
  };

  // Fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_current_user_role');
      if (error) throw error;
      
      setUserRole(data || 'user');
      
      // Update admin profile session
      if (data === 'admin') {
        await supabase.rpc('manage_admin_session', {
          p_user_id: userId,
          p_ip_address: await getClientIP(),
          p_user_agent: navigator.userAgent
        });
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setUserRole('user');
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Check for existing admin session
    const checkAdminSession = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-auth', {
          body: { action: 'verify' }
        });

        if (!error && data?.user) {
          setUser(data.user);
          setUserRole('admin');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Rate limiting check
      const canProceed = await checkRateLimit('admin_login', username);
      if (!canProceed) {
        return { error: 'Too many login attempts. Please try again later.' };
      }

      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'login',
          username,
          password,
          ip: await getClientIP(),
          userAgent: navigator.userAgent
        }
      });

      if (error || !data?.success) {
        await logAuditEvent('admin_login_failed', { 
          username, 
          error: error?.message || data?.error,
          timestamp: new Date().toISOString()
        });
        return { error: data?.error || error?.message || 'Invalid credentials' };
      }

      // Set admin user session
      const adminUser = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email
      };
      
      setUser(adminUser);
      setUserRole('admin');

      await logAuditEvent('admin_login_success', { 
        username,
        timestamp: new Date().toISOString()
      });

      return { error: null };
    } catch (error: any) {
      await logAuditEvent('admin_login_error', { 
        username, 
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return { error: error.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };


  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear admin session
      await supabase.functions.invoke('admin-auth', {
        body: { action: 'logout' }
      });

      // Clear local state
      setUser(null);
      setUserRole(null);

      await logAuditEvent('admin_logout', { 
        timestamp: new Date().toISOString()
      });

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Sign out failed' };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <SecureAuthContext.Provider value={{
      user,
      userRole,
      signIn,
      signOut,
      loading,
      isAdmin
    }}>
      {children}
    </SecureAuthContext.Provider>
  );
}

export function useSecureAuth() {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
}