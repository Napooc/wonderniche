import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid, List, MapPin } from 'lucide-react';
import travelHero1 from '@/assets/travel-hero-1.jpg';

const Travel = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Travel products data
  const travelProducts = [
    {
      id: '1',
      title: 'Premium Travel Luggage Set',
      description: 'Complete 4-piece luggage collection with TSA locks and 360° spinner wheels.',
      fullDescription: 'Travel in style with this premium luggage set featuring hard-shell construction, TSA-approved locks, and smooth-rolling spinner wheels. Perfect for business trips, vacations, and extended travel adventures.',
      price: '$399',
      originalPrice: '$599',
      rating: 5,
      reviews: 287,
      images: [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=600&fit=crop'
      ],
      category: 'Travel',
      affiliateUrl: 'https://example.com/luxury-luggage',
      discount: '33% OFF',
      features: [
        '4-piece set: 28", 24", 20" cases + toiletry bag',
        'Hard-shell polycarbonate construction',
        'TSA-approved combination locks',
        '360° spinner wheels for easy maneuverability',
        'Expandable design for extra packing space',
        'Interior organization compartments'
      ],
      specifications: {
        'Set Includes': '4 pieces (28", 24", 20" + toiletry bag)',
        'Material': 'Premium polycarbonate shell',
        'Weight': '6.5 lbs (20"), 8.2 lbs (24"), 10.1 lbs (28")',
        'Wheels': '8-wheel spinner system',
        'Lock': 'TSA-approved combination lock',
        'Warranty': '10-year manufacturer warranty'
      }
    },
    {
      id: '2',
      title: 'Travel Tech Organizer',
      description: 'Premium cable organizer and tech accessories case for digital nomads.',
      fullDescription: 'Keep your tech gear organized with this premium travel organizer. Features multiple compartments for cables, chargers, adapters, and devices. Perfect for business travelers and digital nomads.',
      price: '$79',
      rating: 5,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
      ],
      category: 'Travel',
      affiliateUrl: 'https://example.com/tech-organizer',
      isNew: true,
      features: [
        'Multiple compartments for cables and chargers',
        'Elastic loops and mesh pockets',
        'Padded protection for devices',
        'Water-resistant nylon construction',
        'Compact and lightweight design',
        'Includes cable ties and labels'
      ],
      specifications: {
        'Dimensions': '10" x 7" x 3"',
        'Material': 'Water-resistant nylon',
        'Compartments': '12 organized sections',
        'Weight': '0.8 lbs',
        'Color Options': 'Black, Navy, Gray',
        'Capacity': 'Fits laptop chargers, cables, adapters'
      }
    },
    {
      id: '3',
      title: 'Travel Comfort Kit',
      description: 'Complete travel wellness set with neck pillow, eye mask, and compression socks.',
      fullDescription: 'Arrive refreshed with this comprehensive travel comfort kit. Includes ergonomic neck pillow, blackout eye mask, noise-reducing earplugs, and compression socks for optimal comfort during long flights.',
      price: '$59',
      rating: 4,
      reviews: 203,
      images: [
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=600&fit=crop'
      ],
      category: 'Travel',
      affiliateUrl: 'https://example.com/comfort-kit',
      features: [
        'Memory foam neck pillow with washable cover',
        'Contoured blackout eye mask',
        'Noise-reducing foam earplugs',
        'Compression socks for circulation',
        'Compact carrying pouch',
        'Breathable, hypoallergenic materials'
      ],
      specifications: {
        'Kit Includes': 'Neck pillow, eye mask, earplugs, socks, pouch',
        'Pillow Material': 'Memory foam with cotton cover',
        'Mask Material': 'Silk with foam padding',
        'Sock Material': '85% nylon, 15% spandex',
        'Size Options': 'One size fits most',
        'Care': 'Machine washable components'
      }
    },
    {
      id: '4',
      title: 'Adventure Camera Bundle',
      description: 'Waterproof action camera with accessories for capturing travel memories.',
      fullDescription: 'Document your adventures with this complete camera bundle. Features 4K recording, waterproof housing, and multiple mounting accessories for any adventure scenario.',
      price: '$299',
      rating: 5,
      reviews: 412,
      images: [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop'
      ],
      category: 'Travel',
      affiliateUrl: 'https://example.com/camera-bundle',
      isNew: true,
      features: [
        '4K Ultra HD video recording',
        'Waterproof up to 30 meters',
        'Built-in image stabilization',
        'Wide-angle lens for landscapes',
        '20+ mounting accessories included',
        'Wi-Fi connectivity for easy sharing'
      ],
      specifications: {
        'Video Resolution': '4K Ultra HD at 30fps',
        'Photo Resolution': '20MP still photos',
        'Waterproof': 'Up to 30 meters without housing',
        'Battery Life': 'Up to 2 hours recording',
        'Storage': 'MicroSD up to 256GB',
        'Connectivity': 'Wi-Fi, Bluetooth'
      }
    },
    {
      id: '5',
      title: 'Travel Security Set',
      description: 'Complete security bundle with RFID-blocking wallet and portable safe.',
      fullDescription: 'Protect your valuables while traveling with this comprehensive security set. Includes RFID-blocking wallet, portable safe, and TSA-approved locks for complete peace of mind.',
      price: '$89',
      rating: 5,
      reviews: 178,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'
      ],
      category: 'Travel',
      affiliateUrl: 'https://example.com/security-set',
      features: [
        'RFID-blocking technology',
        'Portable combination safe',
        'TSA-approved locks (set of 3)',
        'Anti-theft wallet with chain',
        'Hidden money belt',
        'Emergency whistle'
      ],
      specifications: {
        'Wallet Capacity': '12 cards + cash compartment',
        'Safe Size': '8" x 6" x 2"',
        'Lock Type': '3-digit TSA combination',
        'RFID Protection': 'Blocks 13.56 MHz frequency',
        'Material': 'Durable nylon and metal',
        'Weight': '1.2 lbs total'
      }
    }
  ];

  // Filter products based on search term
  useEffect(() => {
    const filtered = travelProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(travelProducts);
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

export default Travel;