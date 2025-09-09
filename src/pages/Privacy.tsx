import React from 'react';
import { Shield, Cookie, Eye, Target, Sliders, Mail, MapPin, Phone, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/contexts/TranslationContext';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import Navigation from '@/components/Navigation';
const Privacy: React.FC = () => {
  const {
    t
  } = useTranslation();
  const {
    openModal
  } = useCookieConsent();
  const lastUpdated = new Date().toLocaleDateString('ar-MA');
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      <main className="pt-32 pb-8 sm:pt-28 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                {t('privacy.title')}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <p className="text-xs sm:text-sm">
                {t('privacy.lastUpdated').replace('{{date}}', lastUpdated)}
              </p>
            </div>
          </div>

          {/* Introduction */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                  {t('privacy.introduction.title')}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('privacy.introduction.content')}
                </p>
              </div>
            </div>
          </Card>

          {/* Cookie Information */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                  {t('privacy.cookies.title')}
                </h2>
              </div>
            </div>

            {/* What are cookies */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-2 sm:mb-3">
                {t('privacy.cookies.whatAre.title')}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                {t('privacy.cookies.whatAre.content')}
              </p>
            </div>

            {/* Types of cookies */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-3 sm:mb-4">
                {t('privacy.cookies.types.title')}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-green-100 text-green-700 text-xs sm:text-sm">
                      أساسية
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('privacy.cookies.types.essential')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-blue-100 text-blue-700 text-xs sm:text-sm">
                      تحليلات
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('privacy.cookies.types.analytics')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-purple-100 text-purple-700 text-xs sm:text-sm">
                      تسويق
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('privacy.cookies.types.marketing')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <Sliders className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-orange-100 text-orange-700 text-xs sm:text-sm">
                      تفضيلات
                    </Badge>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {t('privacy.cookies.types.preferences')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing cookies */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-2 sm:mb-3">
                {t('privacy.cookies.manage.title')}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                {t('privacy.cookies.manage.content')}
              </p>
              <Button onClick={openModal} className="flex items-center gap-2 text-sm sm:text-base">
                <Cookie className="h-3 w-3 sm:h-4 sm:w-4" />
                إدارة ملفات تعريف الارتباط
              </Button>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                  {t('privacy.rights.title')}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  {t('privacy.rights.content')}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t('privacy.rights.contact')}
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                  {t('privacy.contact.title')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">{t('privacy.contact.dpo')}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">VibeNiche</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base font-medium">{t('privacy.contact.email')}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">للاستفسارات حول البيانات</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CNDP Compliance Notice */}
          
        </div>
      </main>
    </div>;
};
export default Privacy;