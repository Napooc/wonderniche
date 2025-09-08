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
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">
                {t('privacy.title')}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p className="text-sm">
                {t('privacy.lastUpdated').replace('{{date}}', lastUpdated)}
              </p>
            </div>
          </div>

          {/* Introduction */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {t('privacy.introduction.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacy.introduction.content')}
                </p>
              </div>
            </div>
          </Card>

          {/* Cookie Information */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <Cookie className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {t('privacy.cookies.title')}
                </h2>
              </div>
            </div>

            {/* What are cookies */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-3">
                {t('privacy.cookies.whatAre.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('privacy.cookies.whatAre.content')}
              </p>
            </div>

            {/* Types of cookies */}
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">
                {t('privacy.cookies.types.title')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-green-100 text-green-700">
                      أساسية
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t('privacy.cookies.types.essential')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-blue-100 text-blue-700">
                      تحليلات
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t('privacy.cookies.types.analytics')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-purple-100 text-purple-700">
                      تسويق
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t('privacy.cookies.types.marketing')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <Sliders className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <Badge variant="outline" className="mb-2 bg-orange-100 text-orange-700">
                      تفضيلات
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t('privacy.cookies.types.preferences')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing cookies */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">
                {t('privacy.cookies.manage.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('privacy.cookies.manage.content')}
              </p>
              <Button onClick={openModal} className="flex items-center gap-2">
                <Cookie className="h-4 w-4" />
                إدارة ملفات تعريف الارتباط
              </Button>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {t('privacy.rights.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacy.rights.content')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('privacy.rights.contact')}
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {t('privacy.contact.title')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('privacy.contact.dpo')}</p>
                    <p className="text-sm text-muted-foreground">VibeNiche</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('privacy.contact.email')}</p>
                    <p className="text-sm text-muted-foreground">للاستفسارات حول البيانات</p>
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