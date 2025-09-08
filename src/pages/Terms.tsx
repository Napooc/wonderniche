import React from 'react';
import { FileText, Calendar, Shield, AlertCircle, Users, CreditCard, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';

const Terms: React.FC = () => {
  const { t } = useTranslation();
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">
                Terms of Service
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p className="text-sm">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          {/* Introduction */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Welcome to VibeNiche</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your use of VibeNiche's website and services. 
                  By accessing or using our platform, you agree to be bound by these Terms. 
                  Please read them carefully before using our services.
                </p>
              </div>
            </div>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By using VibeNiche, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                  If you do not agree to these Terms, please do not use our services.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Important</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    These Terms may be updated from time to time. Your continued use of our services after changes 
                    constitutes acceptance of the new Terms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Description of Service */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Globe className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  VibeNiche is a curated platform that helps you discover premium products across beauty, travel, 
                  wellness, and lifestyle categories. Our services include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-green-100 text-green-700 mt-1">Beauty</Badge>
                    <p className="text-sm text-muted-foreground">
                      Curated beauty and skincare products
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 mt-1">Travel</Badge>
                    <p className="text-sm text-muted-foreground">
                      Travel essentials and accessories
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 mt-1">Wellness</Badge>
                    <p className="text-sm text-muted-foreground">
                      Health and wellness products
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 mt-1">Lifestyle</Badge>
                    <p className="text-sm text-muted-foreground">
                      Lifestyle and home products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Responsibilities */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Users className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As a user of VibeNiche, you agree to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Use our services only for lawful purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Provide accurate information when making purchases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Respect intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span>Not interfere with the operation of our platform</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Purchases and Payments */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <CreditCard className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Purchases and Payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  VibeNiche may redirect you to third-party vendors for purchases. When making purchases:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-muted-foreground">All transactions are subject to the vendor's terms and conditions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-muted-foreground">Prices and availability are subject to change without notice</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span className="text-muted-foreground">VibeNiche may earn commissions from qualifying purchases</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Limitation of Liability */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  VibeNiche provides information and recommendations on an "as is" basis. We make no warranties 
                  about the accuracy, completeness, or suitability of the information provided.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Disclaimer</span>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    VibeNiche shall not be liable for any direct, indirect, incidental, or consequential damages 
                    arising from your use of our services or products purchased through our platform.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> hello@vibeniche.com
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Company:</span> VibeNiche
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Separator className="my-8" />

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              These Terms of Service are effective as of {lastUpdated}. 
              VibeNiche reserves the right to update these terms at any time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;