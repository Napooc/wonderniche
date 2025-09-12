import React, { useState } from 'react';
import { Shield, Eye, Target, Sliders, Info, Clock, Globe, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCookieConsent, CookieConsent } from '@/contexts/CookieConsentContext';
import { useTranslation } from '@/contexts/TranslationContext';

interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  expiry: string;
  type: 'HTTP' | 'LocalStorage' | 'SessionStorage';
}

const cookieDetails: Record<string, CookieInfo[]> = {
  essential: [
    {
      name: 'wonderniche_session',
      provider: 'WonderNiche',
      purpose: 'Session management and security',
      expiry: 'Session',
      type: 'HTTP'
    },
    {
      name: 'wonderniche_cookie_consent',
      provider: 'WonderNiche',
      purpose: 'Remember cookie preferences',
      expiry: '1 year',
      type: 'LocalStorage'
    }
  ],
  analytics: [
    {
      name: '_ga',
      provider: 'Google Analytics',
      purpose: 'Distinguish unique users',
      expiry: '2 years',
      type: 'HTTP'
    },
    {
      name: '_ga_*',
      provider: 'Google Analytics',
      purpose: 'Session tracking',
      expiry: '2 years',
      type: 'HTTP'
    }
  ],
  marketing: [
    {
      name: '_fbp',
      provider: 'Facebook',
      purpose: 'Facebook Pixel tracking',
      expiry: '3 months',
      type: 'HTTP'
    },
    {
      name: 'ads_data',
      provider: 'Google Ads',
      purpose: 'Ad targeting and measurement',
      expiry: '1 year',
      type: 'HTTP'
    }
  ],
  preferences: [
    {
      name: 'preferred-language',
      provider: 'WonderNiche',
      purpose: 'Remember language preference',
      expiry: '1 year',
      type: 'LocalStorage'
    },
    {
      name: 'theme-preference',
      provider: 'WonderNiche',
      purpose: 'Remember dark/light mode',
      expiry: '1 year',
      type: 'LocalStorage'
    }
  ]
};

export const CookieSettingsModal: React.FC = () => {
  const { showModal, closeModal, consent, updateConsent } = useCookieConsent();
  const { t } = useTranslation();
  const [tempConsent, setTempConsent] = useState<CookieConsent>(consent);

  React.useEffect(() => {
    if (showModal) {
      setTempConsent(consent);
    }
  }, [showModal, consent]);

  const handleToggle = (category: keyof CookieConsent, value: boolean) => {
    setTempConsent(prev => ({
      ...prev,
      [category]: category === 'essential' ? true : value // Essential cannot be disabled
    }));
  };

  const handleSave = () => {
    updateConsent(tempConsent);
  };

  const handleAcceptSelected = () => {
    updateConsent(tempConsent);
  };

  const CookieCategory = ({ 
    category, 
    title, 
    description, 
    icon: Icon, 
    enabled, 
    onToggle, 
    cookies,
    isEssential = false 
  }: {
    category: keyof CookieConsent;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    enabled: boolean;
    onToggle: (value: boolean) => void;
    cookies: CookieInfo[];
    isEssential?: boolean;
  }) => (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <h4 className="font-medium text-sm sm:text-base">{title}</h4>
              {isEssential && (
                <Badge variant="outline" className="text-xs w-fit">
                  {t('cookies.modal.essential.alwaysOn')}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">{description}</p>
            
            {/* Cookie Details */}
            <div className="space-y-2">
              {cookies.map((cookie, index) => (
                <div key={`${category}-${index}`} className="text-xs bg-muted/50 p-2 sm:p-3 rounded">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2 mb-2">
                    <span className="font-mono font-medium text-xs break-all">{cookie.name}</span>
                    <Badge variant="secondary" className="text-xs w-fit">
                      {cookie.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-0">
                      <Globe className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{cookie.provider}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{cookie.expiry}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Info className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{cookie.purpose}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end">
          <span className="text-sm font-medium sm:hidden">{enabled ? 'Enabled' : 'Disabled'}</span>
          <div className="flex items-center space-x-2">
            <Switch
              id={category}
              checked={enabled}
              onCheckedChange={onToggle}
              disabled={isEssential}
            />
            <Label htmlFor={category} className="sr-only">
              {title}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={showModal} onOpenChange={closeModal}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0 pb-2 sm:pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('cookies.modal.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('cookies.modal.description')}
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            <CookieCategory
              category="essential"
              title={t('cookies.modal.essential.title')}
              description={t('cookies.modal.essential.description')}
              icon={Shield}
              enabled={tempConsent.essential}
              onToggle={(value) => handleToggle('essential', value)}
              cookies={cookieDetails.essential}
              isEssential
            />
            
            <CookieCategory
              category="analytics"
              title={t('cookies.modal.analytics.title')}
              description={t('cookies.modal.analytics.description')}
              icon={Eye}
              enabled={tempConsent.analytics}
              onToggle={(value) => handleToggle('analytics', value)}
              cookies={cookieDetails.analytics}
            />
            
            <CookieCategory
              category="marketing"
              title={t('cookies.modal.marketing.title')}
              description={t('cookies.modal.marketing.description')}
              icon={Target}
              enabled={tempConsent.marketing}
              onToggle={(value) => handleToggle('marketing', value)}
              cookies={cookieDetails.marketing}
            />
            
            <CookieCategory
              category="preferences"
              title={t('cookies.modal.preferences.title')}
              description={t('cookies.modal.preferences.description')}
              icon={Sliders}
              enabled={tempConsent.preferences}
              onToggle={(value) => handleToggle('preferences', value)}
              cookies={cookieDetails.preferences}
            />
          </div>
          
          <Separator className="my-4 sm:my-6" />
          
          <div className="flex flex-col gap-3 pb-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={closeModal} 
                className="w-full sm:w-auto text-sm"
              >
                {t('cookies.modal.close')}
              </Button>
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 sm:ml-auto">
                <Button 
                  variant="outline" 
                  onClick={handleSave}
                  className="w-full xs:w-auto text-sm"
                >
                  {t('cookies.modal.savePreferences')}
                </Button>
                <Button 
                  onClick={handleAcceptSelected}
                  className="w-full xs:w-auto text-sm"
                >
                  {t('cookies.modal.acceptSelected')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};