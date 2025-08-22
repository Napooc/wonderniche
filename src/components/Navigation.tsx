import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Settings, LogIn } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, userRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Beauty', href: '/beauty' },
    { name: 'Travel', href: '/travel' },
    { name: 'Wellness', href: '/wellness' },
    { name: 'Lifestyle', href: '/lifestyle' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" 
              alt="VibeNiche Logo" 
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-2xl font-bold gradient-text hidden sm:block">
              VibeNiche
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-foreground hover:text-primary transition-all duration-300 relative group ${
                  location.pathname === item.href ? 'text-primary' : ''
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-premium transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth and Admin Links */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                {userRole === 'admin' && (
                  <Link 
                    to="/admin"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  {user.email}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-foreground hover:text-primary"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card w-72">
              <div className="flex items-center space-x-3 mb-8">
                <img 
                  src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" 
                  alt="VibeNiche Logo" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold gradient-text">
                  VibeNiche
                </span>
              </div>

              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block py-2 px-4 text-foreground hover:text-primary hover:bg-card/50 rounded-lg transition-all duration-300 ${
                      location.pathname === item.href ? 'text-primary bg-card/50' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Links */}
              <div className="pt-6 border-t border-border/30 mt-6">
                {user && (
                  <div className="space-y-4">
                    {userRole === 'admin' && (
                      <Link 
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors py-2 px-4 hover:bg-card/50 rounded-lg"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <div className="text-sm text-muted-foreground px-4 py-2">
                      Signed in as {user.email}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;