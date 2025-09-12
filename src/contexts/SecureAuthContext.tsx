import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface SecureAuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'admin' | 'user' | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, options?: { displayName?: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  loading: boolean;
  isAdmin: boolean;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role fetching to avoid potential auth state conflicts
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
          
          // Log auth events
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              logAuditEvent('user_signin', { 
                event, 
                user_id: session.user.id,
                email: session.user.email 
              });
            }, 0);
          }
        } else {
          setUserRole(null);
          if (event === 'SIGNED_OUT') {
            setTimeout(() => {
              logAuditEvent('user_signout', { event });
            }, 0);
          }
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Rate limiting check
      const canProceed = await checkRateLimit('login', email);
      if (!canProceed) {
        return { error: 'Too many login attempts. Please try again later.' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await logAuditEvent('login_failed', { 
          email, 
          error: error.message,
          timestamp: new Date().toISOString()
        });
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      await logAuditEvent('login_error', { 
        email, 
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return { error: error.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: { displayName?: string }) => {
    try {
      setLoading(true);
      
      // Rate limiting check
      const canProceed = await checkRateLimit('signup', email);
      if (!canProceed) {
        return { error: 'Too many signup attempts. Please try again later.' };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: options?.displayName || email.split('@')[0]
          }
        }
      });

      if (error) {
        await logAuditEvent('signup_failed', { 
          email, 
          error: error.message,
          timestamp: new Date().toISOString()
        });
        return { error: error.message };
      }

      await logAuditEvent('signup_success', { 
        email,
        timestamp: new Date().toISOString()
      });

      return { error: null };
    } catch (error: any) {
      await logAuditEvent('signup_error', { 
        email, 
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return { error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: error.message };
      }

      // Clear local state
      setUser(null);
      setSession(null);
      setUserRole(null);

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
      session,
      userRole,
      signIn,
      signUp,
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