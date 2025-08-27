import { useState } from 'react';
import { X, Star, Heart, Share2, ShoppingBag, ExternalLink, Truck, Shield, RotateCcw, Sparkles, CheckCircle } from 'lucide-react';
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
    price?: number;
    originalPrice?: number;
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
      {/* Enhanced Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content - Enhanced Design */}
      <div className="relative max-w-7xl w-full max-h-[95vh] overflow-hidden animate-scale-in">
        <div className="glass-card rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent">
          {/* Enhanced Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 group"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </Button>

          <div className="grid lg:grid-cols-5 gap-0 max-h-[95vh] overflow-y-auto">
            {/* Enhanced Image Gallery - Takes 3 columns */}
            <div className="lg:col-span-3 p-8 bg-gradient-to-br from-white/5 to-transparent">
              <div className="space-y-6">
                {/* Main Image with Enhanced Effects */}
                <div className="relative overflow-hidden rounded-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
                  <img
                    src={product.images[currentImageIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-[500px] object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                    {product.isNew && (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none shadow-lg animate-pulse">
                        <Sparkles className="w-3 h-3 mr-1" />
                        NEW ARRIVAL
                      </Badge>
                    )}
                    {product.discount && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-none shadow-lg">
                        🔥 {product.discount} OFF
                      </Badge>
                    )}
                  </div>

                  {/* Navigation Arrows with Enhanced Design */}
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 border border-white/20 backdrop-blur-sm transition-all duration-300"
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
                        )}
                      >
                        <span className="text-white text-lg">‹</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 border border-white/20 backdrop-blur-sm transition-all duration-300"
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1
                        )}
                      >
                        <span className="text-white text-lg">›</span>
                      </Button>
                    </>
                  )}
                </div>

                {/* Enhanced Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                          index === currentImageIndex 
                            ? 'border-primary scale-105 shadow-lg' 
                            : 'border-white/20 opacity-70 hover:opacity-100 hover:scale-105'
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
            </div>

            {/* Enhanced Product Details - Takes 2 columns */}
            <div className="lg:col-span-2 p-8 space-y-8">
              {/* Header Section */}
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <Badge 
                    variant="outline" 
                    className="border-primary/40 text-primary bg-primary/10 backdrop-blur-sm"
                  >
                    {product.category}
                  </Badge>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                      onClick={() => setIsFavorited(!isFavorited)}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    {product.title}
                  </h1>

                  {/* Enhanced Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                      {renderStars(product.rating)}
                      <span className="font-bold text-yellow-400">{product.rating}</span>
                    </div>
                    <span className="text-white/70">
                      ({product.reviews} verified reviews)
                    </span>
                  </div>

                  {/* Price Section */}
                  {(product.price || product.originalPrice) && (
                    <div className="flex items-center gap-4">
                      {product.price && (
                        <span className="text-3xl font-bold text-white">
                          ${product.price}
                        </span>
                      )}
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <span className="text-xl text-white/50 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                  <TabsTrigger 
                    value="description" 
                    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger 
                    value="features"
                    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Features
                  </TabsTrigger>
                  <TabsTrigger 
                    value="specs"
                    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Specifications
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                  <div className="space-y-4">
                    <p className="text-white/80 leading-relaxed text-lg">
                      {product.fullDescription}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="mt-6">
                  <div className="space-y-3">
                    {product.features && product.features.length > 0 ? (
                      product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-white/90">{feature}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60">No features listed for this product.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="specs" className="mt-6">
                  <div className="space-y-3">
                    {Object.entries(product.specifications || {}).length > 0 ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-3 px-4 bg-white/5 rounded-xl border border-white/10">
                          <span className="font-medium text-white">{key}</span>
                          <span className="text-white/70">{value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60">No specifications available for this product.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Stunning Purchase Button */}
              <div className="space-y-6">
                <Button 
                  onClick={handleAffiliateClick}
                  className="relative w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-white border-none rounded-2xl shadow-2xl transition-all duration-500 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Purchase Now From Original Site</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>

                {/* Trust Badges - Enhanced */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                  <div className="text-center space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Fast Delivery</p>
                      <p className="text-xs text-white/60">2-3 Business Days</p>
                    </div>
                  </div>
                  <div className="text-center space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Secure Payment</p>
                      <p className="text-xs text-white/60">SSL Protected</p>
                    </div>
                  </div>
                  <div className="text-center space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Easy Returns</p>
                      <p className="text-xs text-white/60">30-Day Policy</p>
                    </div>
                  </div>
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