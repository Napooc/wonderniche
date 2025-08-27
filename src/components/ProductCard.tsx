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
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
  };
  return (
    <>
      <div 
        className={`glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl h-[600px] flex flex-col ${isHovered ? 'transform-gpu' : ''}`} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
      {/* Image Container */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img src={image} alt={title} className={`w-full h-64 object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && <Badge className="bg-accent text-accent-foreground animate-pulse">
              NEW
            </Badge>}
          {discount && <Badge className="bg-destructive text-destructive-foreground animate-bounce">
              {discount}
            </Badge>}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          
          
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Category */}
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            {category}
          </Badge>

          {/* Title */}
          <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed min-h-[4.5rem]">
            {description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews} reviews)
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-4 mt-auto">
          <Button onClick={handleCardClick} className="btn-premium group w-full">
            View Details
            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 rounded-2xl animate-glow-pulse" />
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