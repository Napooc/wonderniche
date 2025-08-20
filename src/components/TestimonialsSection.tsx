import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Beauty Enthusiast",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "VibeNiche has completely transformed my lifestyle routine. The curated products are incredible and the visual experience is absolutely stunning. I've discovered so many amazing brands!",
      highlight: "Transformed my lifestyle routine"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Travel Blogger",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a frequent traveler, I need products that work. VibeNiche's travel recommendations are spot-on, and the smooth animations make browsing a pure joy. Highly recommend!",
      highlight: "Travel recommendations are spot-on"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Wellness Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The wellness section is my go-to for discovering new products. The modern design and smooth user experience make it feel like browsing through a luxury magazine.",
      highlight: "Like browsing a luxury magazine"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Tech Executive",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Impressed by the attention to detail and modern design. The site loads fast, looks beautiful, and the product recommendations are always relevant. Great work!",
      highlight: "Attention to detail and modern design"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 reveal-up">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their lifestyle with VibeNiche
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <Card className="glass-card max-w-4xl mx-auto p-8 md:p-12 reveal-up stagger-1">
            <div className="relative">
              {/* Quote Icon */}
              <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/30" />
              
              <div className="text-center space-y-8">
                {/* Testimonial Text */}
                <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-card-foreground">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>

                {/* Rating */}
                <div className="flex justify-center items-center gap-2">
                  {renderStars(testimonials[activeTestimonial].rating)}
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-20 h-20 ring-4 ring-primary/30 ring-offset-4 ring-offset-background">
                    <AvatarImage 
                      src={testimonials[activeTestimonial].image} 
                      alt={testimonials[activeTestimonial].name}
                    />
                    <AvatarFallback className="text-xl font-semibold">
                      {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-card-foreground">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <p className="text-primary">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Testimonial Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Secondary Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {testimonials.filter((_, index) => index !== activeTestimonial).slice(0, 3).map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className={`glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 reveal-up stagger-${index + 2}`}
              onClick={() => setActiveTestimonial(testimonials.findIndex(t => t.id === testimonial.id))}
            >
              <div className="space-y-4">
                {/* Mini Rating */}
                <div className="flex items-center gap-1">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Preview */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-3 pt-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-primary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent/10 blur-2xl animate-float" style={{ animationDelay: '-3s' }} />
    </section>
  );
};

export default TestimonialsSection;