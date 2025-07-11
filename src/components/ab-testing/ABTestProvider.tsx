import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ABTestVariant {
  variant: string;
  configuration: Record<string, any>;
  existing: boolean;
}

interface ABTestContextType {
  getVariant: (testName: string) => Promise<ABTestVariant | null>;
  trackEvent: (testName: string, variant: string, event: string, metadata?: any) => Promise<void>;
  variants: Record<string, ABTestVariant>;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

interface ABTestProviderProps {
  children: ReactNode;
  userId?: string;
}

export const ABTestProvider: React.FC<ABTestProviderProps> = ({ children, userId }) => {
  const [variants, setVariants] = useState<Record<string, ABTestVariant>>({});
  const [sessionId] = useState(() => {
    let id = sessionStorage.getItem('ab_test_session_id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('ab_test_session_id', id);
    }
    return id;
  });

  const getVariant = async (testName: string): Promise<ABTestVariant | null> => {
    // Return cached variant if exists
    if (variants[testName]) {
      return variants[testName];
    }

    try {
      const params = new URLSearchParams({
        test: testName,
        ...(userId && { userId }),
        sessionId
      });

      const response = await fetch(`https://wdzlruiekcznbcicjgrz.supabase.co/functions/v1/ab-testing?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemxydWlla2N6bmJjaWNqZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODAyNzYsImV4cCI6MjA1OTg1NjI3Nn0.NaoVf3tU3Xz08CWCHpQtq7_9H6G6ES9EjtCvPHa0aRk`
        }
      });

      const variant = await response.json();

      if (variant && !variant.error) {
        setVariants(prev => ({
          ...prev,
          [testName]: variant
        }));
        return variant;
      }

      return null;
    } catch (error) {
      console.error('Error getting A/B test variant:', error);
      return null;
    }
  };

  const trackEvent = async (testName: string, variant: string, event: string, metadata?: any) => {
    try {
      await supabase.functions.invoke('ab-testing', {
        body: {
          testName,
          variant,
          event,
          userId,
          sessionId,
          metadata
        }
      });
    } catch (error) {
      console.error('Error tracking A/B test event:', error);
    }
  };

  const value: ABTestContextType = {
    getVariant,
    trackEvent,
    variants
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};

// Hook for easy variant usage
export const useABTestVariant = (testName: string) => {
  const { getVariant, trackEvent, variants } = useABTest();
  const [variant, setVariant] = useState<ABTestVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const result = await getVariant(testName);
        setVariant(result);
      } catch (error) {
        console.error('Error fetching variant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariant();
  }, [testName, getVariant]);

  const track = (event: string, metadata?: any) => {
    if (variant) {
      trackEvent(testName, variant.variant, event, metadata);
    }
  };

  return {
    variant: variant?.variant || 'control',
    config: variant?.configuration || {},
    isLoading,
    track
  };
};