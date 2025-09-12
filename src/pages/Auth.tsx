import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  // All hooks must be called before any conditional logic or early returns
  const { signIn, user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  // Reset panel state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Check for reset mode from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') === '1') {
      setIsResetMode(true);
    }
  }, [location]);

  // Redirect if already logged in as admin
  if (user && userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleResetAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetToken.trim()) {
      toast({
        title: 'Reset token required',
        description: 'Please enter the admin reset token.',
        variant: 'destructive'
      });
      return;
    }

    setIsResetting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'reset_admin_from_secrets' },
        headers: {
          'x-admin-reset-token': resetToken
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Clear any stored admin tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      toast({
        title: 'Admin credentials reset successfully',
        description: 'You can now log in with the new credentials.',
        duration: 5000
      });

      // Reset form and exit reset mode
      setResetToken('');
      setIsResetMode(false);
      
      // Remove reset parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

    } catch (error: any) {
      console.error('Reset error:', error);
      toast({
        title: 'Reset failed',
        description: error.message || 'Failed to reset admin credentials',
        variant: 'destructive'
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if currently locked out
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000);
      toast({
        title: 'Access temporarily restricted',
        description: `Please wait ${remainingTime} seconds before trying again.`,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Call custom authentication
      const { error } = await signIn(formData.username, formData.password);
      
      if (error) {
        throw new Error(error);
      }

      // Reset failed attempts on successful login
      setFailedAttempts(0);
      setLockoutEndTime(null);

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.'
      });

      navigate('/admin', { replace: true });
    } catch (error: any) {
      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // Implement progressive lockout
      if (newFailedAttempts >= 5) {
        const lockoutDuration = Math.min(60000 * Math.pow(2, Math.floor((newFailedAttempts - 5) / 3)), 300000); // Max 5 minutes
        setLockoutEndTime(Date.now() + lockoutDuration);
      }

      toast({
        title: 'Access denied',
        description: 'Invalid credentials',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glass-card border-card-border shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold gradient-text">
              {isResetMode ? 'Reset Admin Credentials' : 'Admin Login'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isResetMode ? 'Enter the one-time reset token' : 'Authorized access only'}
            </p>
          </CardHeader>

          <CardContent>
            {isResetMode ? (
              <form onSubmit={handleResetAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-token">Admin Reset Token</Label>
                  <Input
                    id="reset-token"
                    name="resetToken"
                    type="password"
                    placeholder="Enter one-time reset token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 btn-premium"
                    disabled={isResetting}
                  >
                    {isResetting ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Credentials
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsResetMode(false);
                      setResetToken('');
                      // Remove reset parameter from URL
                      const newUrl = window.location.pathname;
                      window.history.replaceState({}, document.title, newUrl);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    name="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="bg-input border-border pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-premium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}