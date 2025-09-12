import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import TestimonialsSection from '@/components/TestimonialsSection';
import SEOComponent from '@/components/SEOComponent';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Globe, Dumbbell, Home, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/TranslationContext';
import { generateHomeSEO } from '@/utils/seo';
const Index = () => {
  const { t, currentLanguage } = useTranslation();
  const seoData = generateHomeSEO(currentLanguage);
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
    title: t('home.beauty.title'),
    description: t('home.beauty.description'),
    color: 'from-pink-500 to-rose-500',
    href: '/beauty'
  }, {
    icon: Globe,
    title: t('home.travel.title'),
    description: t('home.travel.description'),
    color: 'from-blue-500 to-cyan-500',
    href: '/travel'
  }, {
    icon: Dumbbell,
    title: t('home.wellness.title'),
    description: t('home.wellness.description'),
    color: 'from-green-500 to-emerald-500',
    href: '/wellness'
  }, {
    icon: Home,
    title: t('home.lifestyle.title'),
    description: t('home.lifestyle.description'),
    color: 'from-purple-500 to-indigo-500',
    href: '/lifestyle'
  }];
  return <div className="min-h-screen">
      <SEOComponent 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        structuredData={seoData.structuredData}
        alternateUrls={seoData.alternateUrls}
        locale={currentLanguage}
      />
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              {t('home.exploreCategories')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.discoverCurated')}
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

      {/* Ultra Modern Trust & Impact Section */}
      <section className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-background via-background/50 to-background">
        {/* Advanced Animated Background */}
        <div className="absolute inset-0 opacity-20">
          {/* Morphing Grid Pattern */}
          <div className="absolute inset-0" style={{
          backgroundImage: `
              radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)
            `,
          backgroundSize: '60px 60px, 40px 40px',
          animation: 'morphGrid 15s ease-in-out infinite alternate'
        }}></div>
          
          {/* Flowing Lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(5)].map((_, i) => <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" style={{
            top: `${20 + i * 15}%`,
            width: '100%',
            animation: `flowLine ${8 + i * 2}s linear infinite`,
            animationDelay: `${i * 2}s`
          }} />)}
          </div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Revolutionary Header */}
          <div className="text-center mb-24 reveal-up">
            {/* Floating Status Badge */}
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-card mb-8 border border-primary/20">
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('home.liveMetrics')}
              </span>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
            </div>
            
            {/* Dynamic Title with Morphing Text */}
            <div className="relative mb-8">
              <h2 className="text-6xl md:text-8xl font-black mb-4">
                <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x bg-300%">
                  {t('home.trustedBy')}
                </span>
              </h2>
              <div className="text-6xl md:text-8xl font-black">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {t('home.thousands')}
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                </span>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t('home.realMetrics')}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
                  curated marketplace
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent animate-pulse"></div>
              </span>
            </p>
          </div>

          {/* Revolutionary Stats Architecture */}
          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            {/* Hero Statistics */}
            <div className="space-y-8">
              {/* Primary Stat - Enhanced */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative glass-card p-10 rounded-3xl hover:scale-[1.02] transition-all duration-500 border border-white/10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                      <div className="text-7xl md:text-9xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 bg-clip-text text-transparent group-hover:animate-pulse">
                        50K+
                      </div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-3">{t('home.happyCustomers')}</h3>
                      <p className="text-muted-foreground">{t('home.growingDaily')}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-500 font-medium">{t('home.thisMonth')}</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('home.satisfactionRate')}</span>
                      <span className="text-pink-500 font-semibold">98.7%</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full animate-pulse relative" style={{
                      width: '98.7%'
                    }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Stat - Enhanced */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative glass-card p-10 rounded-3xl hover:scale-[1.02] transition-all duration-500 border border-white/10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                      <div className="text-7xl md:text-9xl font-black mb-4 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent group-hover:animate-pulse">
                        4.9★
                      </div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-3">{t('home.trustRating')}</h3>
                      <p className="text-muted-foreground">{t('home.basedOnReviews')}</p>
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Sparkles className="w-10 h-10 text-amber-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map(star => <div key={star} className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-bounce flex items-center justify-center" style={{
                    animationDelay: `${star * 0.1}s`
                  }}>
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[{
              icon: '🛍️',
              value: '1,200+',
              label: t('home.premiumProducts'),
              color: 'from-blue-500 to-cyan-500'
            }, {
              icon: '✨',
              value: '98%',
              label: t('home.satisfactionRate'),
              color: 'from-purple-500 to-pink-500'
            }, {
              icon: '🚀',
              value: '24/7',
              label: t('home.supportAvailable'),
              color: 'from-green-500 to-emerald-500'
            }, {
              icon: '💰',
              value: '$2M+',
              label: t('home.affiliateRewards'),
              color: 'from-orange-500 to-red-500'
            }, {
              icon: '🌍',
              value: '40+',
              label: t('home.countriesServed'),
              color: 'from-indigo-500 to-purple-500'
            }, {
              icon: '⚡',
              value: '99.9%',
              label: t('home.uptimeGuarantee'),
              color: 'from-yellow-500 to-orange-500'
            }].map((stat, i) => <div key={i} className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}></div>
                  <div className="relative glass-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 border border-white/5">
                    <div className="text-center space-y-3">
                      <div className="text-3xl animate-bounce" style={{
                    animationDelay: `${i * 0.2}s`
                  }}>
                        {stat.icon}
                      </div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <p className="text-sm text-card-foreground font-medium leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Revolutionary Trust Indicators */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-xl"></div>
            <div className="relative glass-card p-12 rounded-3xl border border-white/10 reveal-up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t('home.verifiedExcellence')}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black gradient-text mb-4">{t('home.whyTrustUs')}</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t('home.certifiedPartnerships')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8">
                {[{
                icon: '🛡️',
                title: t('home.verifiedPartner'),
                desc: t('home.officialMember'),
                color: 'from-green-500 to-emerald-500',
                badge: t('home.certified')
              }, {
                icon: '🔒',
                title: t('home.securePlatform'),
                desc: t('home.sslEncrypted'),
                color: 'from-blue-500 to-cyan-500',
                badge: t('home.secure')
              }, {
                icon: '👑',
                title: t('home.premiumBrands'),
                desc: t('home.exclusivePartnerships'),
                color: 'from-purple-500 to-pink-500',
                badge: t('home.premium')
              }, {
                icon: '📊',
                title: t('home.realReviews'),
                desc: t('home.authenticFeedback'),
                color: 'from-orange-500 to-red-500',
                badge: t('home.verified')
              }].map((trust, i) => <div key={i} className="text-center group relative">
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${trust.color}/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10`}>
                        <div className="text-3xl animate-bounce" style={{
                      animationDelay: `${i * 0.3}s`
                    }}>
                          {trust.icon}
                        </div>
                      </div>
                      <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${trust.color} text-white opacity-90`}>
                        {trust.badge}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {trust.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {trust.desc}
                    </p>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dynamic Background Elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '-5s'
      }}></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-float" style={{
        animationDelay: '-2s'
      }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-xl animate-pulse"></div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.handPicked')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => <Link key={product.id} to={`/product/${product.id}`} className={`reveal-up stagger-${index + 1} block`}>
                  <ProductCard id={product.id} title={product.name} description={product.short_description || product.description} rating={product.rating || 4.5} reviews={product.reviews_count || 0} image={product.image_url} category={product.categories?.name || 'Product'} affiliateUrl={product.affiliate_url} isNew={false} />
                </Link>) : <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No featured products available at the moment.
                </p>
              </div>}
          </div>

          <div className="text-center mt-12 reveal-up">
            <Link to="/products">
              
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/lovable-uploads/0234c9d7-4173-4733-ba24-291b13595244.png" alt="WonderNiche Logo" className="h-12 w-auto" />
                <span className="text-xl font-bold gradient-text">
                  WonderNiche
                </span>
              </div>
              <p className="text-muted-foreground">
                {t('home.modernHub')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">{t('home.categories')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#beauty" className="hover:text-primary transition-colors">{t('nav.beauty')}</a></li>
                <li><a href="#travel" className="hover:text-primary transition-colors">{t('nav.travel')}</a></li>
                <li><a href="#wellness" className="hover:text-primary transition-colors">{t('nav.wellness')}</a></li>
                <li><a href="#lifestyle" className="hover:text-primary transition-colors">Lifestyle</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">{t('home.company')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">{t('nav.about')}</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">{t('home.connect')}</h4>
              <div className="flex space-x-3">
                {/* Pinterest */}
                <a href="https://www.pinterest.com/09kk7c443mtcjbobzv4evm2w6kv3mt/" target="_blank" rel="noopener noreferrer" className="group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/30 hover:bg-gradient-to-br hover:from-red-500 hover:to-pink-500 hover:border-red-500 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-red-500 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.541.1.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                    </svg>
                  </div>
                </a>

              </div>
              
              
            </div>
          </div>

          <div className="border-t border-border/30 mt-8 pt-8 text-center text-muted-foreground">
            <p>{t('home.allRights')}</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;