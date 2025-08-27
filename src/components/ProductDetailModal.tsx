import { useState } from 'react';
import { X, Star, Heart, Share2, ShoppingCart, ExternalLink, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailModalProps {
  product: {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    rating: number;
    reviews: number;
    images: string[];
    category: string;
    affiliateUrl: string;
    isNew?: boolean;
    discount?: string;
    features?: string[];
    specifications?: Record<string, string>;
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
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
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
      <div className="relative glass-card rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 p-8 max-h-[90vh] overflow-y-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-accent text-accent-foreground animate-pulse">
                    NEW
                  </Badge>
                )}
                {product.discount && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    {product.discount}
                  </Badge>
                )}
              </div>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass"
                    onClick={() => setCurrentImageIndex(
                      currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
                    )}
                  >
                    ←
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass"
                    onClick={() => setCurrentImageIndex(
                      currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1
                    )}
                  >
                    →
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {product.category}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-card-foreground">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>

            </div>

            {/* Tabs for Details */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.fullDescription}
                </p>
              </TabsContent>
              
              <TabsContent value="features" className="mt-4">
                <ul className="space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="specs" className="mt-4">
                <div className="space-y-3">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/30">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Quantity and Purchase */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAffiliateClick}
                className="btn-premium w-full text-lg py-6 group"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now on Original Site
                <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
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