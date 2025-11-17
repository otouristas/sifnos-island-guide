import { createContext, useContext, useState, ReactNode } from 'react';

interface TouristasContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  openChatWithPrompt: (prompt: string) => void;
  initialPrompt: string | null;
}

const TouristasContext = createContext<TouristasContextType | undefined>(undefined);

export function TouristasProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  const openChat = () => {
    setIsOpen(true);
  };

  const openChatWithPrompt = (prompt: string) => {
    setInitialPrompt(prompt);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setInitialPrompt(null);
  };

  return (
    <TouristasContext.Provider value={{ isOpen, openChat, closeChat, openChatWithPrompt, initialPrompt }}>
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
