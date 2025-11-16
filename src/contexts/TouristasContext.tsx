import { createContext, useContext, useState, ReactNode } from 'react';

interface TouristasContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const TouristasContext = createContext<TouristasContextType | undefined>(undefined);

export function TouristasProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <TouristasContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
    </TouristasContext.Provider>
  );
}

export function useTouristas() {
  const context = useContext(TouristasContext);
  if (context === undefined) {
    throw new Error('useTouristas must be used within a TouristasProvider');
  }
  return context;
}
