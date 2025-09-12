import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface ConsentLog {
  timestamp: string;
  consent: CookieConsent;
  ip?: string;
  userAgent?: string;
}

interface CookieConsentContextType {
  hasConsented: boolean;
  consent: CookieConsent;
  showBanner: boolean;
  showModal: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (newConsent: CookieConsent) => void;
  openModal: () => void;
  closeModal: () => void;
  getConsentLogs: () => ConsentLog[];
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

const CONSENT_STORAGE_KEY = 'wonderniche_cookie_consent';
const CONSENT_LOG_KEY = 'wonderniche_consent_logs';

const defaultConsent: CookieConsent = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  preferences: false,
};

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has previously given consent
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
        setHasConsented(true);
        setShowBanner(false);
        
        // Apply cookie policies based on saved consent
        applyCookiePolicies(parsedConsent);
      } catch (error) {
        console.error('Error parsing saved consent:', error);
        setShowBanner(true);
      }
    } else {
      // First visit - show banner
      setShowBanner(true);
      // Block all non-essential cookies by default
      blockNonEssentialCookies();
    }
  }, []);

  const logConsent = (newConsent: CookieConsent) => {
    const log: ConsentLog = {
      timestamp: new Date().toISOString(),
      consent: newConsent,
      userAgent: navigator.userAgent,
    };

    const existingLogs = getConsentLogs();
    const updatedLogs = [...existingLogs, log];
    
    // Keep only last 10 logs to prevent excessive storage
    const limitedLogs = updatedLogs.slice(-10);
    
    localStorage.setItem(CONSENT_LOG_KEY, JSON.stringify(limitedLogs));
  };

  const saveConsent = (newConsent: CookieConsent) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setHasConsented(true);
    setShowBanner(false);
    logConsent(newConsent);
    applyCookiePolicies(newConsent);
  };

  const acceptAll = () => {
    const allAccepted: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsent(allAccepted);
    setShowModal(false);
  };

  const rejectAll = () => {
    saveConsent(defaultConsent);
    setShowModal(false);
  };

  const updateConsent = (newConsent: CookieConsent) => {
    // Ensure essential cookies are always enabled
    const validatedConsent = { ...newConsent, essential: true };
    saveConsent(validatedConsent);
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getConsentLogs = (): ConsentLog[] => {
    try {
      const logs = localStorage.getItem(CONSENT_LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error retrieving consent logs:', error);
      return [];
    }
  };

  const applyCookiePolicies = (consentData: CookieConsent) => {
    // Google Analytics
    if (consentData.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    // Marketing/Advertising cookies
    if (consentData.marketing) {
      enableMarketingCookies();
    } else {
      disableMarketingCookies();
    }

    // Preferences cookies
    if (consentData.preferences) {
      enablePreferencesCookies();
    } else {
      disablePreferencesCookies();
    }
  };

  const blockNonEssentialCookies = () => {
    disableGoogleAnalytics();
    disableMarketingCookies();
    disablePreferencesCookies();
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsented,
        consent,
        showBanner,
        showModal,
        acceptAll,
        rejectAll,
        updateConsent,
        openModal,
        closeModal,
        getConsentLogs,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

// Cookie management utilities
const enableGoogleAnalytics = () => {
  // Initialize Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
};

const disableGoogleAnalytics = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
};

const enableMarketingCookies = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
  }
};

const disableMarketingCookies = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }
};

const enablePreferencesCookies = () => {
  // Enable preference-based cookies (language settings, theme, etc.)
  // These are typically handled by the application itself
};

const disablePreferencesCookies = () => {
  // Disable non-essential preference cookies
  // Keep only essential ones like language (if needed for accessibility)
};
