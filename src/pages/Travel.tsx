import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, MapPin } from 'lucide-react';
import travelHero1 from '@/assets/travel-hero-1.jpg';

const Travel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'travel')
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

  const handleProductClick = (product) => {
    if (product.affiliate_url) {
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <CategoryHero
        title="Travel Essentials"
        subtitle="Premium travel gear and accessories for the modern explorer and digital nomad"
        images={[travelHero1]}
        ctaText="Explore Travel Gear"
        onCtaClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Travel Stats Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center reveal-up">
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">195+</div>
              <p className="text-muted-foreground">Countries Covered</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">50K+</div>
              <p className="text-muted-foreground">Happy Travelers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">99.8%</div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
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
                Premium Travel Gear
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need for your next adventure
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search travel products..."
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
                  Filter
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
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`reveal-up stagger-${(index % 4) + 1} cursor-pointer`}
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard 
                    id={product.id}
                    title={product.name}
                    description={product.short_description || product.description}
                    rating={product.rating || 4.5}
                    reviews={product.reviews_count || 0}
                    image={product.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop'}
                    category="Travel"
                    affiliateUrl={product.affiliate_url}
                    isNew={product.is_featured}
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 reveal-up">
              <p className="text-xl text-muted-foreground">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Travel;