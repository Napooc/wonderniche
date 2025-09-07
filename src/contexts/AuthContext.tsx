import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Lightweight retry wrapper for edge function calls (handles transient failures)
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 300;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function invokeWithRetry<T>(payload: any, action: string): Promise<{ data: T | null; error: any }> {
  let attempt = 0;
  let lastErr: any = null;
  while (attempt <= MAX_RETRIES) {
    try {
      const { data, error }: { data: any; error: any } = await supabase.functions.invoke('admin-auth', {
        body: { action, ...payload },
      });
      if (error) {
        if ((error.status && error.status >= 500) && attempt < MAX_RETRIES) {
          attempt++;
          await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }
        return { data: null, error };
      }
      return { data: data as T, error: null };
    } catch (e: any) {
      lastErr = e;
      if (attempt < MAX_RETRIES) {
        attempt++;
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      return { data: null, error: e };
    }
  }
  return { data: null, error: lastErr };
}

interface CustomUser {
  id: string;
  username: string;
  role: 'admin';
}

interface AuthContextType {
  user: CustomUser | null;
  userRole: 'admin' | null;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [userRole, setUserRole] = useState<'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session with validation and expiry
    const checkExistingSession = async () => {
      // Clear any legacy token keys
      localStorage.removeItem('admin_token');
      
      const tokenData = sessionStorage.getItem('adminToken');
      if (tokenData) {
        try {
          const { token, expiry } = JSON.parse(tokenData);
          
          // Check if token is expired
          if (Date.now() > expiry) {
            sessionStorage.removeItem('adminToken');
            setLoading(false);
            return;
          }

          console.debug('[Auth] Verifying existing admin token');
          const { data, error } = await invokeWithRetry<{ valid: boolean; user: CustomUser }>(
            { token },
            'verify'
          );
          if (!error && data?.valid) {
            setUser(data.user);
            setUserRole('admin');
          } else {
            console.warn('[Auth] Token invalid or verification failed', error ?? data);
            sessionStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          sessionStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      console.debug('[Auth] Sign-in attempt', { username, origin: window.location.origin });
      // Clear any existing tokens to avoid stale sessions
      sessionStorage.removeItem('adminToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin_token');

      const { data, error } = await invokeWithRetry<{ success: boolean; token: string; user: CustomUser; error?: string }>(
        { username, password },
        'login'
      );

      if (error || !data?.success) {
        console.warn('[Auth] Login failed', { error, data });
        return { error: data?.error || 'Authentication failed' };
      }

      const tokenData = {
        token: data.token,
        expiry: Date.now() + (24 * 60 * 60 * 1000)
      };
      sessionStorage.setItem('adminToken', JSON.stringify(tokenData));
      setUser(data.user);
      setUserRole('admin');

      // Optional: verify right after login to ensure token works in this environment
      const verifyResult = await invokeWithRetry<{ valid: boolean; user: CustomUser }>(
        { token: data.token },
        'verify'
      );
      if (verifyResult.error || !verifyResult.data?.valid) {
        console.warn('[Auth] Post-login verify failed', verifyResult.error ?? verifyResult.data);
      }

      return { error: null };
    } catch (err) {
      console.error('[Auth] Sign-in error', err);
      return { error: 'Authentication failed' };
    }
  };

  const signOut = async () => {
    try {
      // Clear all possible token storage locations
      sessionStorage.removeItem('adminToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin_token');
      setUser(null);
      setUserRole(null);
      return { error: null };
    } catch (error) {
      return { error: 'Sign out failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}