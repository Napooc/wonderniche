import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import LanguagePicker from '@/components/LanguagePicker';
import MobileLanguagePicker from '@/components/MobileLanguagePicker';
import { Menu, X, Settings, LogIn } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, userRole } = useAuth();
  const { t } = useTranslation();

  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.beauty'), href: '/beauty' },
    { name: t('nav.travel'), href: '/travel' },
    { name: t('nav.wellness'), href: '/wellness' },
    { name: t('nav.advice'), href: '/advice' },
    { name: t('nav.contact'), href: '/contact' }
  ];

  const isHomePage = location.pathname === '/';
  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || isProductPage ? 'glass py-3' : 'py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lovable-uploads/3e265e91-4f05-4564-9470-0de4e6039156.png" 
              alt="VibeNiche Logo" 
              className="h-24 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${scrolled || isProductPage ? 'text-foreground' : 'text-white'} hover:text-primary transition-all duration-300 relative group ${
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
            <LanguagePicker />
            {(user && userRole === 'admin') && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  {user?.username}
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
                className={`md:hidden ${scrolled || isProductPage ? 'text-foreground' : 'text-white'} hover:text-primary`}
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card w-80 max-w-[90vw]">
              <div className="flex items-center space-x-3 mb-8">
                <img 
                  src="/lovable-uploads/3e265e91-4f05-4564-9470-0de4e6039156.png" 
                  alt="VibeNiche Logo" 
                  className="h-16 w-auto"
                />
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

              {/* Mobile Language Picker and Auth Links */}
              <div className="pt-6 border-t border-border/30 mt-6 space-y-4">
                <div className="px-4">
                  <span className="text-sm font-medium text-muted-foreground mb-3 block">Language</span>
                  <MobileLanguagePicker onLanguageChange={() => setIsOpen(false)} />
                </div>
                
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
                      Signed in as {user?.username}
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