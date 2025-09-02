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
      name: 'vibeniche_session',
      provider: 'VibeNiche',
      purpose: 'Session management and security',
      expiry: 'Session',
      type: 'HTTP'
    },
    {
      name: 'vibeniche_cookie_consent',
      provider: 'VibeNiche',
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
      provider: 'VibeNiche',
      purpose: 'Remember language preference',
      expiry: '1 year',
      type: 'LocalStorage'
    },
    {
      name: 'theme-preference',
      provider: 'VibeNiche',
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
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 text-primary" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{title}</h4>
              {isEssential && (
                <Badge variant="outline" className="text-xs">
                  {t('cookies.modal.essential.alwaysOn')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            {/* Cookie Details */}
            <div className="space-y-2">
              {cookies.map((cookie, index) => (
                <div key={`${category}-${index}`} className="text-xs bg-muted/50 p-2 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-medium">{cookie.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {cookie.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {cookie.provider}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cookie.expiry}
                    </div>
                    <div className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {cookie.purpose}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  );

  return (
    <Dialog open={showModal} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('cookies.modal.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {t('cookies.modal.description')}
          </p>
          
          <div className="space-y-4">
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
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button variant="outline" onClick={closeModal}>
              {t('cookies.modal.close')}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                {t('cookies.modal.savePreferences')}
              </Button>
              <Button onClick={handleAcceptSelected}>
                {t('cookies.modal.acceptSelected')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};