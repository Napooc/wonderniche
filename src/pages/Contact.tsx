import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Globe, MessageCircle, Users, Award, Shield, Heart, Instagram, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';
const Contact = () => {
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
  const contactInfo = [{
    icon: Mail,
    title: 'Email Us',
    details: 'hello@vibeniche.com',
    subtitle: 'We reply within 24 hours',
    action: 'mailto:hello@vibeniche.com'
  }, {
    icon: Clock,
    title: '24/7 Support',
    details: 'Always Available',
    subtitle: 'Round-the-clock assistance',
    action: null
  }];
  const socialLinks = [{
    icon: Instagram,
    name: 'Instagram',
    url: '#',
    followers: '125K'
  }, {
    icon: Twitter,
    name: 'Twitter',
    url: '#',
    followers: '89K'
  }, {
    icon: Facebook,
    name: 'Facebook',
    url: '#',
    followers: '156K'
  }, {
    icon: Linkedin,
    name: 'LinkedIn',
    url: '#',
    followers: '45K'
  }, {
    icon: Youtube,
    name: 'YouTube',
    url: '#',
    followers: '78K'
  }];
  const companyStats = [{
    icon: Users,
    label: 'Happy Customers',
    value: '50,000+'
  }, {
    icon: Award,
    label: 'Products Curated',
    value: '2,500+'
  }, {
    icon: Shield,
    label: 'Years of Trust',
    value: '8+'
  }, {
    icon: Heart,
    label: 'Customer Satisfaction',
    value: '98%'
  }];
  const faqs = [{
    question: "What is affiliate marketing and how does VibeNiche work?",
    answer: "VibeNiche is a premium affiliate marketing platform that connects you with the best lifestyle products. We earn commissions when you purchase through our curated recommendations, allowing us to provide honest reviews and maintain our platform at no cost to you."
  }, {
    question: "What beauty products and brands do you recommend?",
    answer: "Our beauty category features premium skincare, makeup, and beauty tools from top-rated brands. We focus on products with proven results, clean ingredients, and excellent customer reviews across anti-aging, skincare routines, makeup essentials, and beauty devices."
  }, {
    question: "How do you curate travel gear and experiences?",
    answer: "Our travel experts test and review luggage, travel accessories, booking platforms, and travel experiences. We partner with trusted travel brands to bring you exclusive deals on everything from luxury accommodations to essential travel gear for modern explorers."
  }, {
    question: "What wellness and lifestyle products do you feature?",
    answer: "We specialize in fitness equipment, nutrition supplements, mindfulness products, home decor, and smart gadgets. Our wellness category focuses on scientifically-backed products that enhance mental clarity, physical strength, and overall wellbeing for a balanced lifestyle."
  }, {
    question: "How do I know if a product recommendation is genuine?",
    answer: "Every product we feature goes through rigorous testing by our expert team. We only recommend products we genuinely believe in and would use ourselves. Our affiliate partnerships never influence our honest reviews and ratings."
  }, {
    question: "Do you offer exclusive deals through your affiliate partnerships?",
    answer: "Yes! We negotiate exclusive discounts, early access to sales, and special bundles with our brand partners. Subscribers get first access to these premium deals across all our lifestyle categories."
  }];
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        
        {/* Floating Particles */}
        <div className="particles">
          {Array.from({
          length: 20
        }, (_, i) => <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${8 + Math.random() * 4}s`
        }} />)}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight gradient-text">
              Connect With VibeNiche
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in discovering the finest lifestyle products. 
              We're here to help you live your best life with curated excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" className="btn-premium text-lg px-8 py-4 rounded-full" onClick={() => window.location.href = 'mailto:hello@vibeniche.com'}>
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-primary/20 hover:border-primary/40" onClick={() => window.location.href = 'tel:+15551234567'}>
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/20 blur-xl animate-float" style={{
        animationDelay: '-2s'
      }} />
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return <div key={index} className={`text-center group reveal-up stagger-${index + 1}`}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary to-primary-glow p-3 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-full h-full text-primary-foreground" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the method that works best for you. We're here to help with any questions about our products or services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return <Card key={index} className={`glass-card p-6 text-center group hover:scale-105 cursor-pointer transition-all duration-300 reveal-up stagger-${index + 1}`} onClick={() => info.action && window.open(info.action, '_blank')}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow p-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-full h-full text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-foreground font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {info.subtitle}
                  </p>
                </Card>;
          })}
          </div>

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="glass-card p-8 reveal-up">
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold">About VibeNiche</h3>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2016, VibeNiche has been your trusted curator of lifestyle excellence. 
                  We specialize in discovering and sharing the finest products across beauty, travel, 
                  wellness, and lifestyle categories.
                </p>
                <p>
                  Our team of experts carefully selects each product to ensure it meets our high 
                  standards for quality, innovation, and value. We believe everyone deserves access 
                  to products that enhance their daily life.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Beauty</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Travel</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Wellness</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Lifestyle</span>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-8 reveal-up">
              <div className="flex items-center mb-6">
                <MessageCircle className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold">Customer Support</h3>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Need help? We’ve got you. Our support team is always available via email, making sure you get quick, clear, and caring assistance every time — because your experience matters.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Average response time: Under 2 hours</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Customer satisfaction: 98% positive ratings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>Multi-language support available</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 px-4 bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Follow Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay connected and discover the latest products, tips, and lifestyle inspiration
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return <Card key={index} className={`glass-card p-6 text-center group hover:scale-105 cursor-pointer transition-all duration-300 reveal-up stagger-${index + 1}`} onClick={() => window.open(social.url, '_blank')}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary to-primary-glow p-3 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-full h-full text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {social.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {social.followers}
                  </p>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => <Card key={index} className={`glass-card p-6 reveal-up stagger-${index + 1}`}>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust VibeNiche for their lifestyle needs. 
              Discover products that will transform your daily routine.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-primary/20 hover:border-primary/40" onClick={() => window.location.href = 'mailto:hello@vibeniche.com?subject=Partnership Inquiry'}>
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Contact;