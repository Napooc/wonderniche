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
      
      <main className="pt-24 pb-8 sm:pt-20 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                Terms of Service
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <p className="text-xs sm:text-sm">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          {/* Introduction */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Welcome to VibeWonder</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your use of VibeWonder's website and services. 
                  By accessing or using our platform, you agree to be bound by these Terms. 
                  Please read them carefully before using our services.
                </p>
              </div>
            </div>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Acceptance of Terms</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  By using VibeWonder, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                  If you do not agree to these Terms, please do not use our services.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">Important</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                    These Terms may be updated from time to time. Your continued use of our services after changes 
                    constitutes acceptance of the new Terms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Description of Service */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Description of Service</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  VibeWonder is a curated platform that helps you discover premium products across beauty, travel, 
                  wellness, and lifestyle categories. Our services include:
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-green-100 text-green-700 mt-1 text-xs sm:text-sm flex-shrink-0">Beauty</Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Curated beauty and skincare products
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 mt-1 text-xs sm:text-sm flex-shrink-0">Travel</Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Travel essentials and accessories
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 mt-1 text-xs sm:text-sm flex-shrink-0">Wellness</Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Health and wellness products
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 mt-1 text-xs sm:text-sm flex-shrink-0">Lifestyle</Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Lifestyle and home products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Responsibilities */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">User Responsibilities</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  As a user of VibeWonder, you agree to:
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use our services only for lawful purposes</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide accurate information when making purchases</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Respect intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Not interfere with the operation of our platform</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Purchases and Payments */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Purchases and Payments</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  VibeWonder may redirect you to third-party vendors for purchases. When making purchases:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-muted-foreground">All transactions are subject to the vendor's terms and conditions</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-muted-foreground">Prices and availability are subject to change without notice</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-muted-foreground">VibeWonder may earn commissions from qualifying purchases</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Limitation of Liability */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Limitation of Liability</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  VibeWonder provides information and recommendations on an "as is" basis. We make no warranties 
                  about the accuracy, completeness, or suitability of the information provided.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-300">Disclaimer</span>
                  </div>
                  <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                    VibeWonder shall not be liable for any direct, indirect, incidental, or consequential damages 
                    arising from your use of our services or products purchased through our platform.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Contact Us</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">Email:</span> info@wonderniche.com
                  </p>
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">Company:</span> VibeWonder
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Separator className="my-6 sm:my-8" />

          {/* Footer Note */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground px-2">
            <p>
              These Terms of Service are effective as of {lastUpdated}. 
              VibeWonder reserves the right to update these terms at any time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;