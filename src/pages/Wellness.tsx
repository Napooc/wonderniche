import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import SEOComponent from '@/components/SEOComponent';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, Heart } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { generateWellnessSEO } from '@/utils/seo';
import wellnessHero1 from '@/assets/wellness-hero-1.jpg';

const Wellness = () => {
  const { currentLanguage, t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const seoData = generateWellnessSEO(currentLanguage);

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'wellness')
        .single();

      if (categoriesData) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoriesData.id)
          .eq('is_active', true);

        if (productsData) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

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

  return (
    <div className="min-h-screen">
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
      <CategoryHero
        title={t('wellness.title')}
        subtitle={t('wellness.subtitle')}
        images={[wellnessHero1]}
        ctaText={t('wellness.startJourney')}
        onCtaClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Wellness Benefits Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              {t('wellness.whyChoose')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('wellness.investInHealth')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 reveal-up stagger-1">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <Heart className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold">{t('wellness.mentalClarity')}</h3>
              <p className="text-muted-foreground">
                {t('wellness.mentalClarityDesc')}
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <Heart className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold">{t('wellness.physicalStrength')}</h3>
              <p className="text-muted-foreground">
                {t('wellness.physicalStrengthDesc')}
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <Heart className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold">{t('wellness.innerPeace')}</h3>
              <p className="text-muted-foreground">
                {t('wellness.innerPeaceDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header with Search and Filters */}
          <div className="mb-12 space-y-6 reveal-up">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                {t('wellness.essentials')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('wellness.curatedProducts')}
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('wellness.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input rounded-full text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {t('common.filter')}
                </Button>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('common.loadingProducts')}</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`reveal-up stagger-${(index % 4) + 1} block transition-transform hover:scale-[1.02]`}
                >
                  <ProductCard 
                    id={product.id}
                    title={product.name}
                    description={product.short_description || product.description}
                    rating={product.rating || 4.5}
                    reviews={product.reviews_count || 0}
                    image={product.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop'}
                    category="Wellness"
                    affiliateUrl={product.affiliate_url}
                    isNew={product.is_featured}
                  />
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 reveal-up">
              <p className="text-xl text-muted-foreground">
                {t('common.noProductsFound')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wellness;