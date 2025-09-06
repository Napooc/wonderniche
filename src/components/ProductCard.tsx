import { useState } from 'react';
import { Star, ExternalLink, Heart, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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
  discount
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleAffiliateClick = () => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent card click
    const productUrl = `${window.location.origin}/product/${id}`;
    
    try {
      await navigator.clipboard.writeText(productUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard!", {
        description: "Product link has been copied successfully.",
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      toast.success("Link copied to clipboard!", {
        description: "Product link has been copied successfully.",
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
  };
  return <div 
    className={`glass-card rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-[500px] sm:h-[550px] lg:h-[600px] flex flex-col border border-border/20 ${isHovered ? 'transform-gpu shadow-2xl shadow-primary/10' : ''}`} 
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}
  >
      {/* Image Container */}
      <div className="relative overflow-hidden flex-shrink-0 h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-card/50 to-card/30 rounded-t-3xl border-b border-border/10">
        <img src={image} alt={title} className={`w-full h-full object-cover transition-all duration-700 rounded-t-3xl ${isHovered ? 'scale-102' : 'scale-100'}`} />
        
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/20"
            onClick={handleCopyLink}
            title={isCopied ? "Link copied!" : "Copy product link"}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
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
          <Button 
            className="btn-premium group w-full"
          >
            View Details
            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 rounded-2xl animate-glow-pulse" />
      </div>
    </div>;
};
export default ProductCard;