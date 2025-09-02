import React from 'react';
import { X, Settings, Shield, Eye, Target, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Link } from 'react-router-dom';

export const CookieConsentBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openModal } = useCookieConsent();
  const { t } = useTranslation();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background/95 to-background/90 backdrop-blur-sm border-t">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">
                {t('cookies.banner.title')}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t('cookies.banner.description')}
            </p>
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                <Shield className="h-3 w-3" />
                {t('cookies.modal.essential.title')}
              </div>
              <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                <Eye className="h-3 w-3" />
                {t('cookies.modal.analytics.title')}
              </div>
              <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                <Target className="h-3 w-3" />
                {t('cookies.modal.marketing.title')}
              </div>
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                <Sliders className="h-3 w-3" />
                {t('cookies.modal.preferences.title')}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              className="text-xs whitespace-nowrap"
            >
              {t('cookies.banner.rejectAll')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openModal}
              className="text-xs whitespace-nowrap"
            >
              <Settings className="h-3 w-3 mr-1" />
              {t('cookies.banner.customize')}
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="text-xs whitespace-nowrap bg-primary hover:bg-primary/90"
            >
              {t('cookies.banner.acceptAll')}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {t('cookies.banner.privacyPolicy')}: {' '}
            <Link 
              to="/privacy" 
              className="text-primary hover:underline font-medium"
            >
              سياسة الخصوصية وملفات تعريف الارتباط
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};