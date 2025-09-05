import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Heart, Share2, ShoppingCart, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const ProductDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const {
          data: productData,
          error
        } = await supabase.from('products').select(`
            *,
            categories (
              name,
              slug
            )
          `).eq('id', id).eq('is_active', true).single();
        if (error) {
          console.error('Error fetching product:', error);
          navigate('/404');
          return;
        }
        if (productData) {
          setProduct(productData);
          setCategory(productData.categories);
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);
  const handleAffiliateClick = () => {
    if (product?.affiliate_url) {
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
      toast({
        title: "Redirecting to retailer",
        description: "You're being redirected to complete your purchase."
      });
    }
  };
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Product removed from your favorites" : "Product added to your favorites"
    });
  };
  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.short_description || product?.description,
        url: window.location.href
      });
    } catch (error) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard"
      });
    }
  };
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
  };
  const nextImage = () => {
    if (product?.image_url) {
      const images = [product.image_url];
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }
  };
  const prevImage = () => {
    if (product?.image_url) {
      const images = [product.image_url];
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="p-0 h-auto font-normal hover:text-primary text-xs sm:text-sm whitespace-nowrap">
              Home
            </Button>
            <span>/</span>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/${category?.slug || ''}`)} className="p-0 h-auto font-normal hover:text-primary text-xs sm:text-sm whitespace-nowrap">
              {category?.name || 'Products'}
            </Button>
            <span>/</span>
            <span className="text-foreground font-medium text-xs sm:text-sm truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Product Images */}
            <div className="order-1 lg:order-1">
              {/* Main Image */}
              <div className="relative group">
                <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-xl sm:shadow-2xl border border-border/20">
                  <div className="w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] relative bg-gradient-to-br from-card/50 to-card/30 rounded-3xl overflow-hidden">
                    <img 
                      src={product.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=800&fit=crop'} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 rounded-3xl" 
                      onError={e => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=800&fit=crop';
                      }} 
                    />
                    
                    {/* Gradient overlay for better badge/text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 pointer-events-none"></div>
                  </div>
                  
                  {/* Product Status Badges */}
                  <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex flex-col gap-2">
                    {product.is_featured && <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg animate-pulse text-xs sm:text-sm">
                        ✨ FEATURED
                      </Badge>}
                    {product.original_price && product.price && product.original_price > product.price && <Badge className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg text-xs sm:text-sm">
                        🔥 -{Math.round((product.original_price - product.price) / product.original_price * 100)}% OFF
                      </Badge>}
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg text-xs sm:text-sm">
                      <Check className="w-3 h-3 mr-1" />
                      IN STOCK
                    </Badge>
                  </div>

                  {/* Price Overlay */}
                  {product.price && <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto bg-background/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {product.original_price && product.original_price > product.price && <span className="text-xs sm:text-sm text-muted-foreground line-through">${product.original_price}</span>}
                        <span className="text-xl sm:text-2xl font-bold text-primary">${product.price}</span>
                        {product.original_price && product.original_price > product.price && <span className="text-xs sm:text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                            Save ${(product.original_price - product.price).toFixed(2)}
                          </span>}
                      </div>
                    </div>}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="order-2 lg:order-2 space-y-6 sm:space-y-8">
              {/* Header */}
              <div className="space-y-3 sm:space-y-4">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                  {category?.name || 'Product'}
                </Badge>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className="font-semibold text-base sm:text-lg">{product.rating || 4.5}</span>
                  </div>
                  <span className="text-sm sm:text-base text-muted-foreground">
                    ({product.reviews_count || 0} reviews)
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  {product.short_description || product.description}
                </p>
              </div>

              {/* Product Description - Modern & Creative */}
              {product.description && (
                <div className="relative group">
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/95 via-card to-card/90 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border border-border/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative p-6 sm:p-8 lg:p-10">
                      {/* Header with animated underline */}
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                          <div className="w-1 h-8 sm:h-10 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                            Product Description
                          </h3>
                          <div className="w-1 h-8 sm:h-10 bg-gradient-to-b from-primary/50 to-primary rounded-full"></div>
                        </div>
                        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Description Content */}
                      <div className="max-w-none mx-auto">
                        <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-4 sm:space-y-6">
                          {product.description.split('\n\n').map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-3 sm:space-y-4">
                              {section.split('\n').map((paragraph, paragraphIndex) => 
                                paragraph.trim() ? (
                                  <p 
                                    key={paragraphIndex} 
                                    className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground/85 transition-colors duration-300 group-hover:text-foreground/95"
                                    style={{
                                      wordBreak: 'break-word',
                                      overflowWrap: 'break-word',
                                      whiteSpace: 'pre-wrap',
                                      lineHeight: '1.8',
                                      textAlign: 'justify',
                                      hyphens: 'auto'
                                    }}
                                  >
                                    {paragraph.trim()}
                                  </p>
                                ) : null
                              )}
                              {sectionIndex < product.description.split('\n\n').length - 1 && (
                                <div className="flex items-center gap-4 my-6 sm:my-8">
                                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                  <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle animated border */}
                    <div className="absolute inset-0 rounded-lg border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {product.features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span className="text-sm sm:text-base text-muted-foreground">{feature}</span>
                      </li>)}
                  </ul>
                </Card>}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => <Badge key={index} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors text-xs sm:text-sm">
                        #{tag}
                      </Badge>)}
                  </div>
                </div>}

              {/* Purchase Section */}
              <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-border/30">
                <Button onClick={handleAffiliateClick} size="lg" className="w-full text-sm sm:text-base lg:text-lg py-4 sm:py-6 bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-[1.02]">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Purchase Now From Original Site
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <p className="text-xs sm:text-sm text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
                  🔒 Secure checkout • You'll be redirected to the original retailer to complete your purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>;
};
export default ProductDetail;