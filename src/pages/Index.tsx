import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import TestimonialsSection from '@/components/TestimonialsSection';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Globe, Dumbbell, Home, Mail } from 'lucide-react';

const Index = () => {
  // Reveal animations on scroll
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal-up');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample products data
  const featuredProducts = [
    {
      id: '1',
      title: 'Premium Skincare Set',
      description: 'Luxurious anti-aging skincare collection with natural ingredients for radiant, youthful skin.',
      price: '$149',
      rating: 5,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
      category: 'Beauty',
      affiliateUrl: 'https://example.com/skincare',
      isNew: true
    },
    {
      id: '2',
      title: 'Travel Essentials Kit',
      description: 'Complete travel companion with premium luggage, organizers, and comfort accessories.',
      price: '$299',
      rating: 5,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      category: 'Travel',
      affiliateUrl: 'https://example.com/travel',
      discount: '20% OFF'
    },
    {
      id: '3',
      title: 'Wellness Meditation Bundle',
      description: 'Complete mindfulness package with meditation cushions, aromatherapy, and guidance.',
      price: '$199',
      rating: 5,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      category: 'Wellness',
      affiliateUrl: 'https://example.com/wellness'
    }
  ];

  const categories = [
    {
      icon: Sparkles,
      title: 'Beauty',
      description: 'Premium skincare, makeup, and beauty tools',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Globe,
      title: 'Travel',
      description: 'Luxury travel gear and experiences',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Dumbbell,
      title: 'Wellness',
      description: 'Fitness, nutrition, and mindfulness products',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Home,
      title: 'Lifestyle',
      description: 'Home decor, gadgets, and living essentials',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Explore Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover curated collections across lifestyle categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.title}
                  className={`glass-card p-8 text-center group cursor-pointer transition-all duration-500 hover:scale-105 reveal-up stagger-${index + 1}`}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${category.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked premium products that define modern lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={`reveal-up stagger-${index + 1}`}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal-up">
            <Button size="lg" className="btn-premium text-lg px-8 py-4 rounded-full">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 text-center space-y-8 reveal-up">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Stay in the Loop
              </h2>
              <p className="text-lg text-muted-foreground">
                Get exclusive access to new products, deals, and lifestyle tips
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-input rounded-full text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="btn-premium px-8 py-3 rounded-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" 
                  alt="VibeNiche Logo" 
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold gradient-text">
                  VibeNiche
                </span>
              </div>
              <p className="text-muted-foreground">
                Your modern lifestyle hub for premium products and experiences.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Categories</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#beauty" className="hover:text-primary transition-colors">Beauty</a></li>
                <li><a href="#travel" className="hover:text-primary transition-colors">Travel</a></li>
                <li><a href="#wellness" className="hover:text-primary transition-colors">Wellness</a></li>
                <li><a href="#lifestyle" className="hover:text-primary transition-colors">Lifestyle</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Connect</h4>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="w-10 h-10 p-0 rounded-full">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="w-10 h-10 p-0 rounded-full">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="w-10 h-10 p-0 rounded-full">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VibeNiche. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;