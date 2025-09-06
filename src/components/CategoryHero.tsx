import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface CategoryHeroProps {
  title: string;
  subtitle: string;
  images: string[];
  ctaText?: string;
  onCtaClick?: () => void;
}
const CategoryHero = ({
  title,
  subtitle,
  images,
  ctaText = "Explore Products",
  onCtaClick
}: CategoryHeroProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typing animation
  useEffect(() => {
    if (isTyping && displayText.length < title.length) {
      const timeout = setTimeout(() => {
        setDisplayText(title.slice(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (displayText.length === title.length) {
      setIsTyping(false);
    }
  }, [displayText, isTyping, title]);

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Floating particles
  const particles = Array.from({
    length: 15
  }, (_, i) => <div key={i} className="particle" style={{
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${8 + Math.random() * 4}s`
  }} />);
  return <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Images with Smooth Transitions */}
      <div className="absolute inset-0">
        {images.map((image, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-2000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}>
            <img src={image} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>)}
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {particles}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-6 animate-fade-in">
          {/* Main Heading with Typing Effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="gradient-text block">
              {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-yellow-100">
            {subtitle}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 py-4 rounded-full" onClick={onCtaClick}>
              {ctaText}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/20 blur-xl animate-float" style={{
      animationDelay: '-2s'
    }} />
    </section>;
};
export default CategoryHero;