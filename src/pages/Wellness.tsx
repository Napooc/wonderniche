import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, Heart } from 'lucide-react';
import wellnessHero1 from '@/assets/wellness-hero-1.jpg';

const Wellness = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Wellness products data
  const wellnessProducts = [
    {
      id: '1',
      title: 'Premium Yoga Mat & Accessories',
      description: 'Complete yoga set with eco-friendly mat, blocks, strap, and carry bag.',
      fullDescription: 'Transform your yoga practice with this premium eco-friendly yoga set. Made from natural materials, this complete kit includes everything you need for a comprehensive yoga and meditation practice at home or in the studio.',
      price: '$129',
      originalPrice: '$179',
      rating: 5,
      reviews: 324,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
      ],
      category: 'Wellness',
      affiliateUrl: 'https://example.com/yoga-set',
      discount: '28% OFF',
      features: [
        'Eco-friendly natural rubber mat',
        'Superior grip and cushioning',
        'Includes 2 yoga blocks and strap',
        'Alignment guides printed on mat',
        'Carrying bag with shoulder strap',
        'Free online yoga classes included'
      ],
      specifications: {
        'Mat Size': '72" x 24" x 6mm',
        'Material': 'Natural rubber with microfiber top',
        'Weight': '4.5 lbs',
        'Accessories': '2 blocks, 1 strap, carrying bag',
        'Certification': 'Eco-friendly and biodegradable',
        'Colors': 'Purple, Teal, Coral'
      }
    },
    {
      id: '2',
      title: 'Meditation Cushion Set',
      description: 'Organic meditation pillows with buckwheat hull filling for perfect posture.',
      fullDescription: 'Enhance your meditation practice with this premium cushion set. Made with organic materials and filled with buckwheat hulls, these cushions provide the perfect support for extended meditation sessions.',
      price: '$89',
      rating: 5,
      reviews: 187,
      images: [
        'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=600&fit=crop'
      ],
      category: 'Wellness',
      affiliateUrl: 'https://example.com/meditation-cushions',
      isNew: true,
      features: [
        'Organic cotton outer cover',
        'Buckwheat hull filling for support',
        'Removable and washable covers',
        'Traditional zafu and zabuton design',
        'Carrying handle for portability',
        'Available in multiple colors'
      ],
      specifications: {
        'Set Includes': 'Zafu cushion + Zabuton mat',
        'Filling': '100% organic buckwheat hulls',
        'Cover Material': 'Organic cotton',
        'Zafu Size': '14" diameter x 6" height',
        'Zabuton Size': '30" x 28" x 2"',
        'Weight': '6 lbs total'
      }
    },
    {
      id: '3',
      title: 'Essential Oils Starter Kit',
      description: 'Premium aromatherapy collection with diffuser and 12 pure essential oils.',
      fullDescription: 'Create a calming atmosphere with this complete aromatherapy starter kit. Features a sleek ultrasonic diffuser and 12 therapeutic-grade essential oils for relaxation, energy, and wellness.',
      price: '$159',
      rating: 5,
      reviews: 298,
      images: [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop'
      ],
      category: 'Wellness',
      affiliateUrl: 'https://example.com/essential-oils',
      features: [
        '12 therapeutic-grade essential oils',
        'Ultrasonic diffuser with LED lights',
        'Auto shut-off and timer functions',
        'Whisper-quiet operation',
        'Includes lavender, eucalyptus, peppermint',
        'Complete aromatherapy guide included'
      ],
      specifications: {
        'Oil Volume': '10ml per bottle (12 bottles)',
        'Diffuser Capacity': '300ml water tank',
        'Runtime': 'Up to 10 hours continuous',
        'Coverage': 'Up to 1,000 sq ft',
        'Materials': 'BPA-free plastic and wood grain',
        'Power': 'AC adapter included'
      }
    },
    {
      id: '4',
      title: 'Fitness Resistance Band Set',
      description: 'Complete resistance training system with multiple bands and door anchor.',
      fullDescription: 'Get a full-body workout anywhere with this comprehensive resistance band set. Perfect for strength training, rehabilitation, and staying fit while traveling or at home.',
      price: '$49',
      rating: 4,
      reviews: 145,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
      ],
      category: 'Wellness',
      affiliateUrl: 'https://example.com/resistance-bands',
      features: [
        '5 resistance levels from light to extra heavy',
        'Door anchor and ankle straps included',
        'Comfortable foam handles',
        'Protective sleeves prevent snapping',
        'Workout guide with 30+ exercises',
        'Compact travel bag included'
      ],
      specifications: {
        'Resistance Levels': '10, 15, 20, 25, 30 lbs',
        'Material': 'Natural latex',
        'Handles': 'Comfortable foam grip',
        'Accessories': 'Door anchor, ankle straps, carabiners',
        'Weight': '3 lbs total',
        'Warranty': '1-year replacement guarantee'
      }
    },
    {
      id: '5',
      title: 'Smart Water Bottle',
      description: 'Intelligent hydration tracker with temperature control and app connectivity.',
      fullDescription: 'Stay perfectly hydrated with this smart water bottle that tracks your intake, maintains ideal temperature, and syncs with your fitness apps for complete wellness monitoring.',
      price: '$199',
      rating: 5,
      reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
      ],
      category: 'Wellness',
      affiliateUrl: 'https://example.com/smart-bottle',
      isNew: true,
      features: [
        'Tracks daily water intake automatically',
        'Keeps drinks cold for 24 hours',
        'LED reminder lights',
        'Smartphone app connectivity',
        'UV-C self-cleaning technology',
        'Leak-proof and dishwasher safe'
      ],
      specifications: {
        'Capacity': '17 oz (500ml)',
        'Battery Life': '7 days per charge',
        'Temperature Retention': '24 hours cold, 12 hours hot',
        'Material': 'Stainless steel with smart lid',
        'App Compatibility': 'iOS and Android',
        'Charging': 'USB-C cable included'
      }
    }
  ];

  // Filter products based on search term
  useEffect(() => {
    const filtered = wellnessProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(wellnessProducts);
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
        title="Wellness & Fitness"
        subtitle="Transform your health and wellbeing with premium wellness products and mindful living essentials"
        images={[wellnessHero1]}
        ctaText="Start Your Wellness Journey"
        onCtaClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Wellness Benefits Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Why Choose Wellness?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invest in your health and happiness with scientifically-backed wellness products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 reveal-up stagger-1">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <Heart className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold">Mental Clarity</h3>
              <p className="text-muted-foreground">
                Improve focus, reduce stress, and enhance cognitive performance through mindful practices.
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <Heart className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold">Physical Strength</h3>
              <p className="text-muted-foreground">
                Build muscle, increase flexibility, and boost energy levels with the right fitness tools.
              </p>
            </div>

            <div className="text-center space-y-4 reveal-up stagger-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <Heart className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-semibold">Inner Peace</h3>
              <p className="text-muted-foreground">
                Find balance and tranquility through meditation, aromatherapy, and mindful living.
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
                Wellness Essentials
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Curated products for your mind, body, and soul
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search wellness products..."
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

export default Wellness;