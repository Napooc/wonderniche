import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';
const HeroSection = () => {
  const {
    t
  } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [textKey, setTextKey] = useState(0); // Force re-render when text changes

  const images = [hero1, hero2, hero3];
  const fullText = t('hero.title');

  // Reset typing animation when language/text changes
  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    setTextKey(prev => prev + 1);
  }, [fullText]);

  // Typing animation
  useEffect(() => {
    if (isTyping && displayText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (displayText.length === fullText.length) {
      setIsTyping(false);
    }
  }, [displayText, isTyping, fullText, textKey]);

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Floating particles
  const particles = Array.from({
    length: 20
  }, (_, i) => <div key={i} className="particle" style={{
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${8 + Math.random() * 4}s`
  }} />);
  return <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Smooth Transitions */}
      <div className="absolute inset-0">
        {images.map((image, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-2000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}>
            <img src={image} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          </div>)}
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {particles}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          {/* Main Heading with Typing Effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="gradient-text block">
              {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in text-amber-50">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button size="lg" className="btn-premium text-lg px-8 py-4 rounded-full" onClick={() => {
            window.location.href = '/about#born-from-passion';
          }}>
              {t('hero.ourStoryButton')}
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
      <div className="absolute top-1/2 left-5 w-16 h-16 rounded-full bg-primary-glow/30 blur-lg animate-float" style={{
      animationDelay: '-4s'
    }} />
    </section>;
};
export default HeroSection;