import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useTranslation } from '@/contexts/TranslationContext';

export const ManageCookiesButton: React.FC = () => {
  const { openModal, hasConsented, consent } = useCookieConsent();
  const { t } = useTranslation();

  const getLastUpdated = () => {
    try {
      const logs = localStorage.getItem('vibewonder_consent_logs');
      if (logs) {
        const parsedLogs = JSON.parse(logs);
        const lastLog = parsedLogs[parsedLogs.length - 1];
        if (lastLog) {
          return new Date(lastLog.timestamp).toLocaleDateString();
        }
      }
    } catch (error) {
      console.error('Error retrieving last consent date:', error);
    }
    return null;
  };

  const lastUpdated = getLastUpdated();

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={openModal}
        className="text-xs hover:bg-muted/50 flex items-center gap-1"
      >
        <Settings className="h-3 w-3" />
        {t('cookies.manage')}
      </Button>
      
      {hasConsented && lastUpdated && (
        <p className="text-xs text-muted-foreground text-center">
          {t('cookies.lastUpdated').replace('{{date}}', lastUpdated)}
        </p>
      )}
      
      {hasConsented && (
        <div className="flex gap-1 flex-wrap justify-center">
          {consent.analytics && (
            <div className="w-2 h-2 bg-blue-500 rounded-full" title="Analytics enabled" />
          )}
          {consent.marketing && (
            <div className="w-2 h-2 bg-purple-500 rounded-full" title="Marketing enabled" />
          )}
          {consent.preferences && (
            <div className="w-2 h-2 bg-orange-500 rounded-full" title="Preferences enabled" />
          )}
          <div className="w-2 h-2 bg-green-500 rounded-full" title="Essential always enabled" />
        </div>
      )}
    </div>
  );
};