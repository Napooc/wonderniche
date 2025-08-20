import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, Sparkles } from 'lucide-react';
import lifestyleHero1 from '@/assets/lifestyle-hero-1.jpg';

const Lifestyle = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Lifestyle products data
  const lifestyleProducts = [
    {
      id: '1',
      title: 'Smart Home Hub System',
      description: 'Complete smart home automation with voice control and app integration.',
      fullDescription: 'Transform your living space into a smart home with this comprehensive hub system. Control lighting, temperature, security, and entertainment systems all from one central command center.',
      price: '$299',
      originalPrice: '$399',
      rating: 5,
      reviews: 234,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&h=600&fit=crop'
      ],
      category: 'Lifestyle',
      affiliateUrl: 'https://example.com/smart-home',
      discount: '25% OFF',
      features: [
        'Compatible with 1000+ smart devices',
        'Voice control with built-in assistant',
        'Mobile app for remote access',
        'Energy monitoring and optimization',
        'Advanced security integration',
        'Easy setup and configuration'
      ],
      specifications: {
        'Connectivity': 'Wi-Fi, Zigbee, Z-Wave, Bluetooth',
        'Voice Control': 'Built-in assistant + compatibility',
        'Range': 'Up to 150 feet indoor',
        'Power': 'AC adapter included',
        'Dimensions': '6" x 6" x 2"',
        'Compatibility': '1000+ smart home brands'
      }
    },
    {
      id: '2',
      title: 'Premium Coffee Making Set',
      description: 'Professional barista kit with pour-over dripper, grinder, and accessories.',
      fullDescription: 'Elevate your coffee experience with this premium barista set. Includes everything needed to brew café-quality coffee at home, from precision grinder to temperature-controlled kettle.',
      price: '$249',
      rating: 5,
      reviews: 187,
      images: [
        'https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop'
      ],
      category: 'Lifestyle',
      affiliateUrl: 'https://example.com/coffee-set',
      isNew: true,
      features: [
        'Precision burr grinder with 40 settings',
        'Temperature-controlled pour-over kettle',
        'Borosilicate glass dripper and carafe',
        'Premium stainless steel filters',
        'Digital scale with timer',
        'Comprehensive brewing guide'
      ],
      specifications: {
        'Grinder': 'Conical burr, 40 grind settings',
        'Kettle': '1.2L capacity, temperature control',
        'Dripper': 'Borosilicate glass, V60 style',
        'Scale': '0.1g precision, 2kg capacity',
        'Filters': 'Stainless steel, reusable',
        'Power': '110-240V universal'
      }
    },
    {
      id: '3',
      title: 'Luxury Plant Collection',
      description: 'Curated set of air-purifying plants with modern planters and care kit.',
      fullDescription: 'Bring nature indoors with this carefully selected collection of air-purifying plants. Each plant comes in a modern ceramic planter with a complete care kit for effortless maintenance.',
      price: '$179',
      rating: 4,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&h=600&fit=crop'
      ],
      category: 'Lifestyle',
      affiliateUrl: 'https://example.com/plant-collection',
      features: [
        '5 air-purifying plants included',
        'Modern ceramic planters in 3 sizes',
        'Self-watering system for easy care',
        'Plant care kit with fertilizer',
        'Detailed care instructions',
        'Perfect for beginners'
      ],
      specifications: {
        'Plants Included': 'Snake Plant, Pothos, Peace Lily, Spider Plant, ZZ Plant',
        'Planter Material': 'Ceramic with drainage',
        'Sizes': '4", 6", 8" diameter planters',
        'Watering System': 'Self-watering inserts included',
        'Care Level': 'Beginner friendly',
        'Air Purification': 'NASA approved species'
      }
    },
    {
      id: '4',
      title: 'Modern Desk Organization System',
      description: 'Minimalist desk organizer with wireless charging and USB hub.',
      fullDescription: 'Keep your workspace clean and productive with this all-in-one desk organizer. Features wireless charging pad, USB hub, and beautifully designed compartments for all your essentials.',
      price: '$149',
      rating: 5,
      reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'
      ],
      category: 'Lifestyle',
      affiliateUrl: 'https://example.com/desk-organizer',
      isNew: true,
      features: [
        'Wireless charging pad (15W fast charging)',
        '4-port USB 3.0 hub',
        'Multiple compartments for organization',
        'Premium bamboo construction',
        'Cable management system',
        'Non-slip base'
      ],
      specifications: {
        'Charging': '15W wireless charging pad',
        'USB Ports': '4x USB 3.0 (5Gbps)',
        'Material': 'Sustainable bamboo',
        'Dimensions': '12" x 8" x 4"',
        'Cable Length': '6 feet USB-C',
        'Compatibility': 'Qi-enabled devices'
      }
    },
    {
      id: '5',
      title: 'Premium Candle Collection',
      description: 'Hand-poured soy candles with luxury scents and elegant glass containers.',
      fullDescription: 'Create the perfect ambiance with this collection of premium hand-poured candles. Made from natural soy wax with carefully crafted scent profiles that transform any space.',
      price: '$89',
      rating: 5,
      reviews: 203,
      images: [
        'https://images.unsplash.com/photo-1602874801006-2bd84d09f7a4?w=600&h=600&fit=crop'
      ],
      category: 'Lifestyle',
      affiliateUrl: 'https://example.com/candle-collection',
      features: [
        '6 unique scent profiles',
        '100% natural soy wax',
        'Hand-poured in small batches',
        'Lead-free cotton wicks',
        'Reusable glass containers',
        '40+ hours burn time each'
      ],
      specifications: {
        'Collection Size': '6 candles',
        'Wax Type': '100% natural soy wax',
        'Container': 'Premium glass with lids',
        'Burn Time': '40-45 hours per candle',
        'Size': '3.5" x 4" each',
        'Scents': 'Vanilla, Eucalyptus, Sandalwood, Ocean, Lavender, Citrus'
      }
    },
    {
      id: '6',
      title: 'Smart Mirror with LED Lighting',
      description: 'Intelligent bathroom mirror with adjustable lighting and touch controls.',
      fullDescription: 'Upgrade your daily routine with this smart mirror featuring adjustable LED lighting, anti-fog technology, and touch controls. Perfect for makeup application and grooming.',
      price: '$399',
      rating: 5,
      reviews: 145,
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'
      ],
      category: 'Lifestyle',
      affiliateUrl: 'https://example.com/smart-mirror',
      features: [
        'Adjustable LED lighting (3 modes)',
        'Anti-fog heating technology',
        'Touch-sensitive controls',
        'Memory function for settings',
        'Energy-efficient LED strip',
        'Easy wall mounting system'
      ],
      specifications: {
        'Size': '24" x 32" rectangular',
        'Lighting': 'LED strip, 3 color temperatures',
        'Power': '25W energy efficient',
        'Features': 'Anti-fog, touch control, memory',
        'Installation': 'Wall mount hardware included',
        'Warranty': '2-year manufacturer warranty'
      }
    }
  ];

  // Filter products based on search term
  useEffect(() => {
    const filtered = lifestyleProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(lifestyleProducts);
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
        title="Modern Lifestyle"
        subtitle="Elevate your daily life with premium lifestyle products designed for the contemporary home"
        images={[lifestyleHero1]}
        ctaText="Discover Lifestyle"
        onCtaClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Lifestyle Categories */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Lifestyle Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated products for every aspect of modern living
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-4 reveal-up stagger-1">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <Sparkles className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-semibold">Smart Home</h3>
              <p className="text-sm text-muted-foreground">
                Automate and optimize your living space
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <Sparkles className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-semibold">Kitchen & Dining</h3>
              <p className="text-sm text-muted-foreground">
                Premium tools for culinary excellence
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <Sparkles className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-semibold">Home Decor</h3>
              <p className="text-sm text-muted-foreground">
                Beautiful pieces to personalize your space
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-4">
                <Sparkles className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-semibold">Organization</h3>
              <p className="text-sm text-muted-foreground">
                Streamline and organize your daily life
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
                Lifestyle Essentials
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Products that enhance your everyday living experience
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search lifestyle products..."
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

export default Lifestyle;