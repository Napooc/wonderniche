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
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="p-0 h-auto font-normal hover:text-primary">
              Home
            </Button>
            <span>/</span>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/${category?.slug || ''}`)} className="p-0 h-auto font-normal hover:text-primary">
              {category?.name || 'Products'}
            </Button>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative group">
                <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-2xl">
                  <img src={product.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=800&fit=crop'} alt={product.name} className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105" onError={e => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=800&fit=crop';
                }} />
                  
                  {/* Product Status Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.is_featured && <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg animate-pulse">
                        ✨ FEATURED
                      </Badge>}
                    {product.original_price && product.price && product.original_price > product.price && <Badge className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg">
                        🔥 -{Math.round((product.original_price - product.price) / product.original_price * 100)}% OFF
                      </Badge>}
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                      <Check className="w-3 h-3 mr-1" />
                      IN STOCK
                    </Badge>
                  </div>

                  {/* Favorite & Share Buttons */}
                  

                  {/* Price Overlay */}
                  {product.price && <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        {product.original_price && product.original_price > product.price && <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>}
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        {product.original_price && product.original_price > product.price && <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                            Save ${(product.original_price - product.price).toFixed(2)}
                          </span>}
                      </div>
                    </div>}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 px-4 py-2">
                  {category?.name || 'Product'}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating || 4.5)}
                    </div>
                    <span className="font-semibold text-lg">{product.rating || 4.5}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviews_count || 0} reviews)
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {product.short_description || product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>)}
                  </ul>
                </Card>}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => <Badge key={index} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">
                        #{tag}
                      </Badge>)}
                  </div>
                </div>}

              {/* Purchase Section */}
              <div className="space-y-6 pt-6 border-t border-border/30">
                <Button onClick={handleAffiliateClick} size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:scale-[1.02]">
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Purchase Now From Original Site
                  <ExternalLink className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <p className="text-sm text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
                  🔒 Secure checkout • You'll be redirected to the original retailer to complete your purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Product Details
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about this product
            </p>
          </div>

          <div className="grid gap-8">
            {/* Full Description */}
            {product.description && <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-center">Description</h3>
                <div className="max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                  <p className="text-base leading-7">{product.description}</p>
                </div>
              </Card>}

            {/* Trust Badges */}
            
          </div>
        </div>
      </section>
    </div>;
};
export default ProductDetail;