import { useState } from 'react';
import { Star, ExternalLink, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  affiliateUrl: string;
  isNew?: boolean;
  discount?: string;
}

const ProductCard = ({ 
  title, 
  description, 
  price, 
  rating, 
  reviews, 
  image, 
  category, 
  affiliateUrl,
  isNew = false,
  discount
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAffiliateClick = () => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isHovered ? 'transform-gpu' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-64 object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-accent text-accent-foreground animate-pulse">
              NEW
            </Badge>
          )}
          {discount && (
            <Badge className="bg-destructive text-destructive-foreground animate-bounce">
              {discount}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0 glass"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0 glass"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
          {category}
        </Badge>

        {/* Title */}
        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
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

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-2xl font-bold gradient-text">
              {price}
            </p>
            {discount && (
              <p className="text-sm text-muted-foreground line-through">
                {price.replace(/\d+/, (match) => String(parseInt(match) * 1.3))}
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleAffiliateClick}
            className="btn-premium group"
          >
            Buy Now
            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl animate-glow-pulse" />
      </div>
    </div>
  );
};

export default ProductCard;