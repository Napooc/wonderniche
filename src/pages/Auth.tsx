import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  // All hooks must be called before any conditional logic or early returns
  const { signIn, user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

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

const ADMIN_USERNAME = 'vibeniche_admin';
const ADMIN_EMAIL = 'admin@vibeniche.com';

const [failedAttempts, setFailedAttempts] = useState(0);
const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

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
    // Validate username first (client-side check)
    if (formData.username !== ADMIN_USERNAME) {
      throw new Error('Invalid credentials');
    }

    // If username is correct, attempt Supabase sign-in with admin email and entered password
    const { error } = await signIn(ADMIN_EMAIL, formData.password);
    
    if (error) {
      throw new Error('Invalid credentials');
    }

    // Reset failed attempts on successful login
    setFailedAttempts(0);
    setLockoutEndTime(null);

    toast({
      title: 'Welcome back!',
      description: 'Admin access granted.',
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
              Admin Login
            </CardTitle>
            <p className="text-muted-foreground">Authorized access only</p>
          </CardHeader>

          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}