import { useState } from 'react';
import { Star, ExternalLink, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductDetailModal from '@/components/ProductDetailModal';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  affiliateUrl: string;
  isNew?: boolean;
  discount?: string;
  fullProduct?: any;
}
const ProductCard = ({
  id,
  title,
  description,
  rating,
  reviews,
  image,
  category,
  affiliateUrl,
  isNew = false,
  discount,
  fullProduct
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`} 
      />
    ));
  };

  return (
    <>
      <div 
        className="relative group cursor-pointer transition-all duration-500 hover:scale-[1.02]" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Modern Card Container */}
        <div className="relative bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-primary/20 transition-all duration-500">
          
          {/* Premium Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleFavoriteClick}
                className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/50 hover:scale-110"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-black/50 hover:scale-110">
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isNew && (
                <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                  ✨ NEW
                </div>
              )}
              {discount && (
                <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg">
                  🔥 {discount}
                </div>
              )}
            </div>

            {/* Rating Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
              <div className="flex items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="text-sm font-bold text-white">{rating}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Category Tag */}
            <div className="inline-flex px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold border border-primary/30 backdrop-blur-sm">
              {category}
            </div>

            {/* Product Name */}
            <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>

            {/* Reviews Count */}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>{reviews} verified reviews</span>
            </div>

            {/* Modern CTA Button */}
            <button 
              onClick={handleCardClick}
              className="w-full mt-6 bg-gradient-to-r from-primary via-accent to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-primary-foreground py-4 rounded-2xl font-bold text-sm transition-all duration-500 shadow-lg hover:shadow-primary/30 hover:scale-[1.02] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span>View Full Details</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Subtle Border Glow */}
          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 rounded-3xl border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"></div>
          </div>
        </div>
      </div>
      
      {fullProduct && (
        <ProductDetailModal
          product={{
            id: fullProduct.id,
            title: fullProduct.name,
            description: fullProduct.short_description || fullProduct.description,
            fullDescription: fullProduct.description,
            rating: fullProduct.rating || 4.5,
            reviews: fullProduct.reviews_count || 0,
            images: fullProduct.image_url ? [fullProduct.image_url] : [],
            category: category,
            affiliateUrl: fullProduct.affiliate_url,
            isNew: isNew,
            discount: discount,
            features: fullProduct.features || [],
            specifications: {},
            price: fullProduct.price,
            originalPrice: fullProduct.original_price
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
export default ProductCard;