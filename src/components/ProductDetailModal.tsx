import { useState } from 'react';
import { X, Star, Heart, Share2, ShoppingBag, ExternalLink, Truck, Shield, RotateCcw, Sparkles, CheckCircle, ChevronLeft, ChevronRight, Award, Zap, Users } from 'lucide-react';
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
  const [imageLoading, setImageLoading] = useState(false);

  if (!isOpen) return null;

  const handleAffiliateClick = () => {
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
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
      {/* Clean Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modern Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] animate-scale-in">
        <div className="bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Clean Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center group"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="grid lg:grid-cols-5 max-h-[90vh] overflow-y-auto">
            
            {/* Left Side - Enhanced Product Images */}
            <div className="lg:col-span-2 relative">
              <div className="aspect-[4/5] lg:h-[90vh] relative overflow-hidden rounded-r-3xl lg:rounded-r-none">
                <img
                  src={product.images[currentImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onLoad={() => setImageLoading(false)}
                  onLoadStart={() => setImageLoading(true)}
                />
                
                {/* Image Loading Overlay */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Image Navigation - Only show if multiple images */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/70 hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/70 hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                    
                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'bg-white w-6' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Enhanced Status Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.isNew && (
                    <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full text-sm font-bold text-white shadow-xl flex items-center gap-2 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                      NEW ARRIVAL
                    </div>
                  )}
                  {product.discount && (
                    <div className="px-4 py-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full text-sm font-bold text-white shadow-xl flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {product.discount} OFF
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:scale-110 group"
                  >
                    <Heart className={`w-5 h-5 transition-all duration-300 ${
                      isFavorited 
                        ? 'fill-red-500 text-red-500 animate-pulse' 
                        : 'text-white group-hover:scale-110'
                    }`} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:scale-110 group">
                    <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Product Information */}
            <div className="lg:col-span-3 p-8 lg:p-12 space-y-8">
              
              {/* Enhanced Category Badge */}
              <div className="inline-flex px-6 py-3 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 text-primary rounded-full text-sm font-bold border border-primary/50 backdrop-blur-sm shadow-lg animate-glow-pulse">
                <Award className="w-4 h-4 mr-2" />
                {product.category}
              </div>

              {/* Enhanced Product Title */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                  {product.title}
                </h1>

                {/* Enhanced Rating Section */}
                <div className="flex items-center gap-6 bg-gradient-to-r from-yellow-500/30 via-amber-500/20 to-yellow-500/30 px-8 py-4 rounded-3xl border border-yellow-500/40 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-3xl font-black text-yellow-400 drop-shadow-lg">{product.rating}</span>
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">
                      {product.reviews} verified reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="space-y-6 bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ℹ️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Product Details</h3>
                </div>
                <p className="text-white/90 text-lg leading-relaxed font-medium">
                  {product.fullDescription || product.description}
                </p>
              </div>

              {/* Enhanced Features Section */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Key Features</h3>
                  </div>
                  <div className="grid gap-4">
                    {product.features.slice(0, 6).map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/95 font-medium text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Purchase Section */}
              <div className="space-y-8 pt-8 border-t border-white/20">
                
                {/* Enhanced Main CTA Button */}
                <button 
                  onClick={handleAffiliateClick}
                  className="w-full bg-gradient-to-r from-orange-500 via-red-500 via-pink-500 to-purple-500 text-white py-8 px-10 rounded-3xl font-black text-xl shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group animate-glow-pulse"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-4">
                    <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Purchase Now From Original Site</span>
                    <ExternalLink className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </button>

                {/* Enhanced Trust Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-white text-lg mb-1">Fast Delivery</p>
                    <p className="text-sm text-white/70">2-3 Business Days</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl border border-green-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-white text-lg mb-1">Secure Payment</p>
                    <p className="text-sm text-white/70">SSL Protected</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <RotateCcw className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-white text-lg mb-1">Easy Returns</p>
                    <p className="text-sm text-white/70">30-Day Policy</p>
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