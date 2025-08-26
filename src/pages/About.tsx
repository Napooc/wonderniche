import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Globe,
  Star,
  CheckCircle2,
  Zap
} from 'lucide-react';

const About = () => {
  // Reveal animations on scroll
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal-up');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Authentic Connections",
      description: "We believe in building genuine relationships with brands and customers through honest recommendations.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Star,
      title: "Quality First", 
      description: "Every product we feature meets our rigorous standards for excellence and customer satisfaction.",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Innovation Driven",
      description: "We stay ahead of trends to bring you the latest and greatest in lifestyle innovation.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Our platform connects lifestyle enthusiasts worldwide with premium brands they'll love.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      quote: "Building bridges between lifestyle dreamers and premium brands."
    },
    {
      name: "Marcus Chen", 
      role: "Head of Partnerships",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      quote: "Curating relationships that create authentic value."
    },
    {
      name: "Elena Rodriguez",
      role: "Creative Director", 
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      quote: "Design is the language that speaks to the soul."
    }
  ];

  const milestones = [
    { year: "2022", event: "VibeNiche Founded", description: "Started with a vision to revolutionize affiliate marketing" },
    { year: "2023", event: "50K+ Community", description: "Reached our first major milestone of happy customers" },
    { year: "2024", event: "Premium Partnerships", description: "Established exclusive relationships with top lifestyle brands" },
    { year: "2025", event: "Global Expansion", description: "Expanding our reach to serve lifestyle enthusiasts worldwide" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '-3s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-float" style={{animationDelay: '-6s'}}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center reveal-up">
            {/* Logo Integration */}
            <div className="flex justify-center mb-8">
              <div className="glass-card p-6 rounded-3xl">
                <img 
                  src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" 
                  alt="VibeNiche Logo" 
                  className="h-20 w-auto mx-auto animate-pulse"
                />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8">
              <span className="gradient-text">About</span>
              <br />
              <span className="text-foreground">VibeNiche</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              We're not just another affiliate marketplace. We're <span className="text-primary font-semibold">lifestyle curators</span>, 
              <span className="text-primary font-semibold"> trend discoverers</span>, and <span className="text-primary font-semibold">dream enablers</span> 
              connecting you with products that transform ordinary moments into extraordinary experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="btn-premium text-lg px-10 py-4 rounded-full">
                <Sparkles className="w-5 h-5 mr-2" />
                Our Story
              </Button>
              <Button size="lg" variant="outline" className="btn-glass text-lg px-10 py-4 rounded-full">
                <Users className="w-5 h-5 mr-2" />
                Meet The Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Our Origin Story</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black gradient-text mb-8">
                Born from Passion
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  It started with a simple frustration: endless hours scrolling through countless products, 
                  never knowing what truly delivered on its promises. We believed there had to be a better way.
                </p>
                <p>
                  <span className="text-primary font-semibold">VibeNiche</span> was born from the vision of creating 
                  an authentic space where lifestyle enthusiasts could discover genuinely amazing products through 
                  transparent, honest affiliate partnerships.
                </p>
                <p>
                  Today, we're proud to be the bridge between dreamers and premium brands, creating value for 
                  both our community and our partners through meaningful connections.
                </p>
              </div>

              <div className="flex items-center gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">2022</div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">50K+</div>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">200+</div>
                  <p className="text-sm text-muted-foreground">Brand Partners</p>
                </div>
              </div>
            </div>

            <div className="reveal-up stagger-1">
              <div className="relative">
                <div className="glass-card p-8 rounded-3xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                    alt="Team collaboration" 
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold gradient-text">Verified Quality</div>
                      <p className="text-sm text-muted-foreground">Every product tested</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20 reveal-up">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide every decision we make and every partnership we forge
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={value.title} className={`glass-card p-8 rounded-3xl group hover:scale-[1.02] transition-all duration-500 reveal-up stagger-${index + 1}`}>
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20 reveal-up">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The passionate individuals behind VibeNiche's success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className={`text-center group reveal-up stagger-${index + 1}`}>
                <div className="relative mb-6">
                  <div className="glass-card p-2 rounded-3xl group-hover:scale-105 transition-all duration-500">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 glass-card px-6 py-2 rounded-full">
                    <Award className="w-5 h-5 text-primary mx-auto" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-card-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-semibold mb-4">{member.role}</p>
                <p className="text-muted-foreground italic">"{member.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-20 reveal-up">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our mission to revolutionize affiliate marketing
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary rounded-full"></div>
            
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className={`relative mb-16 reveal-up stagger-${index + 1}`}>
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="text-3xl font-bold gradient-text mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-card-foreground mb-3">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full border-4 border-background relative z-10 animate-pulse"></div>
                  
                  <div className="flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 text-center space-y-8 reveal-up relative">
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-xl animate-float"></div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                Join Our Mission
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Be part of a community that values authenticity, quality, and meaningful connections. 
                Discover your next favorite product today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium text-lg px-10 py-4 rounded-full">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="btn-glass text-lg px-10 py-4 rounded-full">
                <Heart className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <img src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" alt="VibeNiche Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold gradient-text">VibeNiche</span>
            </div>
            <p className="text-muted-foreground">
              Curating premium lifestyle experiences through authentic affiliate partnerships.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;