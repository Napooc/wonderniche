import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

          const { data, error } = await supabase.functions.invoke('admin-auth', {
            body: { action: 'verify', token }
          });
          
          if (!error && data?.valid) {
            setUser(data.user);
            setUserRole('admin');
          } else {
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
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', username, password }
      });
      
      if (error || !data.success) {
        return { error: data?.error || 'Authentication failed' };
      }
      
      // Store token with expiry in sessionStorage
      const tokenData = {
        token: data.token,
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      sessionStorage.setItem('adminToken', JSON.stringify(tokenData));
      setUser(data.user);
      setUserRole('admin');
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
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