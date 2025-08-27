import { useState } from 'react';
import { X, Star, Heart, Share2, ShoppingCart, ExternalLink, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    description?: string;
    short_description?: string;
    rating: number;
    reviews_count: number;
    image_url?: string;
    category_name?: string;
    affiliate_url: string;
    is_featured?: boolean;
    features?: string[];
    tags?: string[];
    price?: number;
    original_price?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAffiliateClick = () => {
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in border border-border/50">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 p-8 max-h-[90vh] overflow-y-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop'}
                alt={product.name}
                className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop';
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground animate-pulse shadow-lg">
                    FEATURED
                  </Badge>
                )}
                {product.original_price && product.price && product.original_price > product.price && (
                  <Badge className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Price Overlay */}
              {product.price && (
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>
                    )}
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                  {product.category_name || 'Product'}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="font-semibold text-foreground">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews_count} reviews)
                </span>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Description</h3>
                <div className="bg-card/50 rounded-xl p-4 border border-border/30">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || product.short_description || 'No description available'}
                  </p>
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Features</h3>
                  <div className="bg-card/50 rounded-xl p-4 border border-border/30">
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Section */}
            <div className="space-y-4 pt-4 border-t border-border/30">
              <Button 
                onClick={handleAffiliateClick}
                className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Purchase Now From Original Site
                <ExternalLink className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                You'll be redirected to the original retailer to complete your purchase
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
              <div className="text-center space-y-2">
                <Truck className="w-6 h-6 mx-auto text-primary" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-6 h-6 mx-auto text-primary" />
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                </div>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw className="w-6 h-6 mx-auto text-primary" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;