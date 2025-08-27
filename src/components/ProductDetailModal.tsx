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
            
            {/* Left Side - Product Image */}
            <div className="lg:col-span-2 relative">
              <div className="aspect-[4/5] lg:h-[90vh] relative overflow-hidden">
                <img
                  src={product.images[currentImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badges - Clean Design */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.isNew && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      NEW ARRIVAL
                    </div>
                  )}
                  {product.discount && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-sm font-bold text-white shadow-lg">
                      🔥 {product.discount} OFF
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/50"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/50">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Product Information */}
            <div className="lg:col-span-3 p-8 lg:p-12 space-y-8">
              
              {/* Category Badge */}
              <div className="inline-flex px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full text-sm font-semibold border border-primary/30">
                {product.category}
              </div>

              {/* Product Title */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                  {product.title}
                </h1>

                {/* Rating Section - Clean & Prominent */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-6 py-3 rounded-2xl border border-yellow-500/30">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{product.rating}</span>
                  <span className="text-white/70 text-sm">
                    ({product.reviews} verified reviews)
                  </span>
                </div>
              </div>

              {/* Description - Clean Typography */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>

              {/* Features - If Available */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Key Features</h3>
                  <div className="grid gap-3">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase Section */}
              <div className="space-y-6 pt-6 border-t border-white/20">
                
                {/* Main CTA Button - Modern Design */}
                <button 
                  onClick={handleAffiliateClick}
                  className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-6 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <span>Now From Original Site</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                {/* Trust Indicators - Clean Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-3">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-white text-sm">Fast Delivery</p>
                    <p className="text-xs text-white/60">2-3 Business Days</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-white text-sm">Secure Payment</p>
                    <p className="text-xs text-white/60">SSL Protected</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
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
  );
};

export default ProductDetailModal;