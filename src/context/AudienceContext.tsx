'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AudienceType = 'individual' | 'leader' | null;

interface AudienceContextType {
  audience: AudienceType;
  setAudience: (audience: AudienceType) => void;
  isIndividual: boolean;
  isLeader: boolean;
  hasSelected: boolean;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

const STORAGE_KEY = 'fourflow-audience';

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<AudienceType>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated on mount - don't restore from localStorage
  // (fresh start each visit, selection only persists during session)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Persist to localStorage when changed
  const setAudience = (newAudience: AudienceType) => {
    setAudienceState(newAudience);
    if (newAudience) {
      localStorage.setItem(STORAGE_KEY, newAudience);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value: AudienceContextType = {
    audience,
    setAudience,
    isIndividual: audience === 'individual',
    isLeader: audience === 'leader',
    hasSelected: audience !== null,
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <AudienceContext.Provider value={value}>
      {children}
    </AudienceContext.Provider>
  );
}

// Default context value for SSR/static generation
const defaultContextValue: AudienceContextType = {
  audience: null,
  setAudience: () => {},
  isIndividual: false,
  isLeader: false,
  hasSelected: false,
};

export function useAudience() {
  const context = useContext(AudienceContext);
  // Return default value during SSR/static generation when provider isn't available
  if (context === undefined) {
    return defaultContextValue;
  }
  return context;
}
