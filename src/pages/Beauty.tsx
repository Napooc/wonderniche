import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List } from 'lucide-react';
import beautyHero1 from '@/assets/beauty-hero-1.jpg';

const Beauty = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Beauty products data
  const beautyProducts = [
    {
      id: '1',
      title: 'Luxury Anti-Aging Serum',
      description: 'Premium vitamin C serum with hyaluronic acid for radiant, youthful skin.',
      fullDescription: 'This luxurious anti-aging serum combines powerful vitamin C with hyaluronic acid to deliver intense hydration and brightening effects. Formulated with premium ingredients, it helps reduce fine lines, dark spots, and promotes collagen production for firmer, more youthful-looking skin.',
      price: '$89',
      originalPrice: '$120',
      rating: 5,
      reviews: 342,
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'
      ],
      category: 'Beauty',
      affiliateUrl: 'https://example.com/luxury-serum',
      isNew: true,
      discount: '25% OFF',
      features: [
        'Contains 20% Vitamin C for maximum potency',
        'Hyaluronic acid for deep hydration',
        'Reduces fine lines and wrinkles',
        'Brightens and evens skin tone',
        'Suitable for all skin types',
        'Cruelty-free and vegan formula'
      ],
      specifications: {
        'Size': '30ml / 1 fl oz',
        'Skin Type': 'All skin types',
        'Key Ingredients': 'Vitamin C, Hyaluronic Acid, Niacinamide',
        'Application': 'Morning and evening',
        'Shelf Life': '12 months after opening'
      }
    },
    {
      id: '2',
      title: 'Professional Makeup Brush Set',
      description: 'Complete 15-piece professional makeup brush collection with premium synthetic bristles.',
      fullDescription: 'Elevate your makeup game with this professional-grade brush set. Each brush is crafted with ultra-soft synthetic bristles that blend seamlessly and provide flawless application. Perfect for both beginners and professional makeup artists.',
      price: '$149',
      rating: 5,
      reviews: 198,
      images: [
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
      ],
      category: 'Beauty',
      affiliateUrl: 'https://example.com/makeup-brushes',
      features: [
        '15 professional brushes for complete makeup application',
        'Premium synthetic bristles - vegan and cruelty-free',
        'Includes foundation, concealer, eyeshadow, and blending brushes',
        'Elegant rose gold ferrules',
        'Comes with luxury travel case',
        'Easy to clean and maintain'
      ],
      specifications: {
        'Pieces': '15 brushes + travel case',
        'Bristle Type': 'Premium synthetic',
        'Handle Material': 'Sustainable bamboo',
        'Ferrule': 'Rose gold aluminum',
        'Case': 'Vegan leather travel case'
      }
    },
    {
      id: '3',
      title: 'Hydrating Face Mask Collection',
      description: 'Set of 6 premium sheet masks with different active ingredients for various skin concerns.',
      fullDescription: 'Transform your skincare routine with this curated collection of hydrating face masks. Each mask targets specific skin concerns with concentrated active ingredients, providing spa-quality treatment at home.',
      price: '$45',
      rating: 4,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=600&h=600&fit=crop'
      ],
      category: 'Beauty',
      affiliateUrl: 'https://example.com/face-masks',
      features: [
        '6 different mask formulations',
        'Hyaluronic acid for deep hydration',
        'Vitamin E for antioxidant protection',
        'Collagen boosting peptides',
        'Suitable for sensitive skin',
        'Biodegradable sheet material'
      ],
      specifications: {
        'Quantity': '6 masks per pack',
        'Mask Types': 'Hydrating, Brightening, Anti-aging',
        'Material': 'Biodegradable bamboo fiber',
        'Usage': '2-3 times per week',
        'Treatment Time': '15-20 minutes'
      }
    },
    {
      id: '4',
      title: 'Organic Lip Care Set',
      description: 'Natural lip balm and scrub duo made with organic ingredients for soft, smooth lips.',
      fullDescription: 'Pamper your lips with this organic lip care set featuring a gentle exfoliating scrub and nourishing balm. Made with natural ingredients like shea butter, coconut oil, and vitamin E for ultimate lip health.',
      price: '$28',
      rating: 5,
      reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1583001308067-30854c86d7e0?w=600&h=600&fit=crop'
      ],
      category: 'Beauty',
      affiliateUrl: 'https://example.com/lip-care',
      isNew: true,
      features: [
        '100% organic and natural ingredients',
        'Gentle sugar scrub for exfoliation',
        'Nourishing balm with shea butter',
        'Long-lasting moisture protection',
        'Cruelty-free and vegan',
        'Recyclable packaging'
      ],
      specifications: {
        'Set Includes': 'Lip scrub (15g) + Lip balm (4.5g)',
        'Key Ingredients': 'Shea butter, Coconut oil, Vitamin E',
        'Scent': 'Natural vanilla',
        'Shelf Life': '18 months',
        'Certification': 'USDA Organic'
      }
    }
  ];

  // Filter products based on search term
  useEffect(() => {
    const filtered = beautyProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(beautyProducts);
  }, []);

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
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <CategoryHero
        title="Beauty Essentials"
        subtitle="Discover premium skincare, makeup, and beauty tools curated for the modern lifestyle"
        images={[beautyHero1]}
        ctaText="Shop Beauty"
        onCtaClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header with Search and Filters */}
          <div className="mb-12 space-y-6 reveal-up">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Premium Beauty Products
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Curated collection of high-quality beauty essentials
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search beauty products..."
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
          <div className={`grid gap-8 ${
            viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`reveal-up stagger-${(index % 4) + 1} cursor-pointer`}
                onClick={() => handleProductClick(product)}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 reveal-up">
              <p className="text-xl text-muted-foreground">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Beauty;