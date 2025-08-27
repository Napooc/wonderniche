import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import TestimonialsSection from '@/components/TestimonialsSection';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Globe, Dumbbell, Home, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch featured products from Supabase
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const {
          data: products,
          error
        } = await supabase.from('products').select(`
            id,
            name,
            description,
            short_description,
            rating,
            reviews_count,
            image_url,
            affiliate_url,
            is_featured,
            category_id,
            categories (
              name
            )
          `).eq('is_featured', true).eq('is_active', true).order('created_at', {
          ascending: false
        });
        if (error) {
          console.error('Error fetching featured products:', error);
          return;
        }
        setFeaturedProducts(products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Reveal animations on scroll
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal-up');
      reveals.forEach(element => {
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
  const staticCategories = [{
    icon: Sparkles,
    title: 'Beauty',
    description: 'Premium skincare, makeup, and beauty tools',
    color: 'from-pink-500 to-rose-500'
  }, {
    icon: Globe,
    title: 'Travel',
    description: 'Luxury travel gear and experiences',
    color: 'from-blue-500 to-cyan-500'
  }, {
    icon: Dumbbell,
    title: 'Wellness',
    description: 'Fitness, nutrition, and mindfulness products',
    color: 'from-green-500 to-emerald-500'
  }, {
    icon: Home,
    title: 'Lifestyle',
    description: 'Home decor, gadgets, and living essentials',
    color: 'from-purple-500 to-indigo-500'
  }];
  return <div className="min-h-screen">
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
            {staticCategories.map((category, index) => {
            const IconComponent = category.icon;
            return <Link key={category.title} to={`/${category.title.toLowerCase()}`} className={`glass-card p-8 text-center group cursor-pointer transition-all duration-500 hover:scale-105 reveal-up stagger-${index + 1} block`}>
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${category.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </Link>;
          })}
          </div>
        </div>
      </section>

      {/* Modern Trust & Impact Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 reveal-up">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">Live Impact Dashboard</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="gradient-text">Trusted by</span>
              <br />
              <span className="text-foreground">Thousands</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real numbers from real people who've transformed their lifestyle through our 
              <span className="text-primary font-semibold"> affiliate marketplace</span>
            </p>
          </div>

          {/* Dynamic Stats Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Left Side - Main Stats */}
            <div className="space-y-8">
              <div className="relative">
                <div className="glass-card p-8 hover:scale-[1.02] transition-all duration-500 group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-6xl md:text-8xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                        50K+
                      </div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-2">Happy Customers</h3>
                      <p className="text-muted-foreground text-sm">Growing daily across 40+ countries</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full animate-pulse" style={{
                    width: '87%'
                  }}></div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 hover:scale-[1.02] transition-all duration-500 group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-6xl md:text-8xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                      4.9★
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">Trust Rating</h3>
                    <p className="text-muted-foreground text-sm">Based on 12,847 verified reviews</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => <div key={star} className="w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-bounce" style={{
                  animationDelay: `${star * 0.1}s`
                }}></div>)}
                </div>
              </div>
            </div>

            {/* Right Side - Additional Stats */}
            <div className="space-y-6">
              <div className="glass-card p-6 group hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold gradient-text">1,200+</div>
                    <p className="text-card-foreground font-medium">Premium Products</p>
                  </div>
                  <div className="text-2xl">🛍️</div>
                </div>
              </div>

              <div className="glass-card p-6 group hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold gradient-text">98%</div>
                    <p className="text-card-foreground font-medium">Satisfaction Rate</p>
                  </div>
                  <div className="text-2xl">✨</div>
                </div>
              </div>

              <div className="glass-card p-6 group hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold gradient-text">24/7</div>
                    <p className="text-card-foreground font-medium">Support Available</p>
                  </div>
                  <div className="text-2xl">🚀</div>
                </div>
              </div>

              <div className="glass-card p-6 group hover:bg-primary/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold gradient-text">$2M+</div>
                    <p className="text-card-foreground font-medium">Affiliate Commissions</p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="glass-card p-8 reveal-up">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold gradient-text mb-2">Why Customers Trust Us</h3>
              <p className="text-muted-foreground">Verified credentials and partnerships</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Verified Partner</h4>
                <p className="text-sm text-muted-foreground">Official affiliate network member</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Secure Platform</h4>
                <p className="text-sm text-muted-foreground">SSL encrypted transactions</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Premium Brands</h4>
                <p className="text-sm text-muted-foreground">Exclusive partnerships</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                </div>
                <h4 className="font-semibold text-card-foreground mb-1">Real Reviews</h4>
                <p className="text-sm text-muted-foreground">100% authentic feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-xl animate-float" style={{
        animationDelay: '-3s'
      }}></div>
      </section>

      {/* Enhanced Featured Products Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Modern Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Premium Section Header */}
          <div className="text-center mb-20 reveal-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border border-white/10 rounded-full mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white/80">Hand-picked Premium Selection</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="gradient-text">Featured</span>
              <br />
              <span className="text-white">Products</span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Discover exclusive products that define modern lifestyle, curated by our experts and 
              <span className="text-primary font-semibold"> loved by thousands</span>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 reveal-up">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Fast Secure Delivery</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">SSL 30-Day Protection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Business Policy Days</span>
            </div>
          </div>

          {/* Modern Product Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => (
                <div key={product.id} className={`reveal-up stagger-${(index % 3) + 1}`}>
                  <ProductCard 
                    id={product.id} 
                    title={product.name} 
                    description={product.short_description || product.description} 
                    rating={product.rating || 4.5} 
                    reviews={product.reviews_count || 0} 
                    image={product.image_url} 
                    category={product.categories?.name || 'Product'} 
                    affiliateUrl={product.affiliate_url} 
                    isNew={index < 2}
                    discount={index === 0 ? "25%" : undefined}
                    fullProduct={product}
                  />
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🛍️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
                    <p className="text-white/60 text-lg">
                      Our team is carefully curating premium products for you.
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Premium CTA Section */}
          <div className="text-center mt-16 reveal-up">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-card/30 to-card/20 backdrop-blur-sm border border-white/10 rounded-2xl">
              <span className="text-white/80">Want to see more exclusive products?</span>
              <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-sm hover:scale-105 transition-transform duration-300">
                Explore All Categories
              </button>
            </div>
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
              <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-3 bg-input rounded-full text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
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
                <img src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" alt="VibeNiche Logo" className="h-10 w-auto" />
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
              <div className="flex space-x-3">
                {/* Pinterest */}
                <a href="https://www.pinterest.com/0l62gi2tbmb12b65d34zwbc4hpz6bh/?actingBusinessId=886576014053114714" target="_blank" rel="noopener noreferrer" className="group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:border-red-500 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-red-500 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.541.1.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </div>
                </a>

                {/* Telegram */}
                <a 
                  href="https://t.me/+212701420239" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://t.me/+212701420239', '_blank', 'noopener,noreferrer');
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 hover:border-blue-500 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                </a>
              </div>
              
              
            </div>
          </div>

          <div className="border-t border-border/30 mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 VibeNiche. All rights reserved. This site contains affiliate links.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;