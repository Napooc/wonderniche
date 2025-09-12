import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';
import { Heart, Sparkles, Target, Users, Award, TrendingUp, Globe, Star, CheckCircle2, Zap } from 'lucide-react';
const About = () => {
  const { t } = useTranslation();
  
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
  const values = [{
    icon: Heart,
    title: t('about.authenticConnections'),
    description: t('about.genuineRelationships'),
    color: "from-pink-500 to-rose-500"
  }, {
    icon: Star,
    title: t('about.qualityFirst'),
    description: t('about.rigorousStandards'),
    color: "from-amber-500 to-yellow-500"
  }, {
    icon: TrendingUp,
    title: t('about.innovationDriven'),
    description: t('about.stayAhead'),
    color: "from-blue-500 to-cyan-500"
  }, {
    icon: Globe,
    title: t('about.globalImpact'),
    description: t('about.connectsWorldwide'),
    color: "from-green-500 to-emerald-500"
  }];
  const team = [{
    name: t('about.team.sarah.name'),
    role: t('about.team.sarah.role'),
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    quote: t('about.team.sarah.quote')
  }, {
    name: t('about.team.marcus.name'),
    role: t('about.team.marcus.role'),
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    quote: t('about.team.marcus.quote')
  }, {
    name: t('about.team.elena.name'),
    role: t('about.team.elena.role'),
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    quote: t('about.team.elena.quote')
  }];
  const milestones = [{
    year: "2016",
    event: t('about.vibeNicheFounded'),
    description: t('about.startedVision')
  }, {
    year: "2023",
    event: t('about.communityMilestone'),
    description: t('about.firstMajor')
  }, {
    year: "2024",
    event: t('about.premiumPartnerships'),
    description: t('about.exclusiveRelationships')
  }, {
    year: "2025",
    event: t('about.globalExpansion'),
    description: t('about.expandingReach')
  }];
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{
          animationDelay: '-3s'
        }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-float" style={{
          animationDelay: '-6s'
        }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center reveal-up">
            {/* Logo Integration */}
            <div className="flex justify-center mb-8">
              <div className="glass-card p-6 rounded-3xl">
                <img src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" alt="VibeWonder Logo" className="h-20 w-auto mx-auto animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8">
              <span className="gradient-text">{t('about.title')}</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              {t('about.subtitle')}
            </p>

            
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
                <span className="text-sm font-medium text-muted-foreground">{t('about.originStory')}</span>
              </div>
              
              <h2 id="born-from-passion" className="text-5xl md:text-6xl font-black gradient-text mb-8">
                {t('about.bornFromPassion')}
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>{t('about.simpleFrustration')}</p>
                <p>
                  {t('about.vibeNicheBorn')}
                </p>
                <p>
                  {t('about.todayProud')}
                </p>
              </div>

              <div className="flex items-center gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">2016</div>
                  <p className="text-sm text-muted-foreground">{t('about.founded')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">50K+</div>
                  <p className="text-sm text-muted-foreground">{t('about.customers')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">200+</div>
                  <p className="text-sm text-muted-foreground">{t('about.brandPartners')}</p>
                </div>
              </div>
            </div>

            <div className="reveal-up stagger-1">
              <div className="relative">
                <div className="glass-card p-8 rounded-3xl">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" alt="Team collaboration" className="w-full h-80 object-cover rounded-2xl" />
                </div>
                <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold gradient-text">{t('about.verifiedQuality')}</div>
                      <p className="text-sm text-muted-foreground">{t('about.everyProductTested')}</p>
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
              {t('about.ourValues')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('about.principlesGuide')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
            const IconComponent = value.icon;
            return <div key={value.title} className={`glass-card p-8 rounded-3xl group hover:scale-[1.02] transition-all duration-500 reveal-up stagger-${index + 1}`}>
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
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      

      {/* Timeline Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-20 reveal-up">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              {t('about.ourJourney')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('about.keyMilestones')}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary rounded-full"></div>
            
            {milestones.map((milestone, index) => <div key={milestone.year} className={`relative mb-16 reveal-up stagger-${index + 1}`}>
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
              </div>)}
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
                {t('about.joinMission')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.bePartCommunity')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-glass text-lg px-10 py-4 rounded-full"
                onClick={() => window.location.href = '/contact'}
              >
                <Heart className="w-5 h-5 mr-2" />
                {t('about.contactUs')}
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
              <img src="/lovable-uploads/5f3da360-a14f-4461-a422-f31e7978ecc0.png" alt="VibeWonder Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold gradient-text">VibeWonder</span>
            </div>
            <p className="text-muted-foreground mb-4">
              {t('about.curatingPremium')}
            </p>
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default About;