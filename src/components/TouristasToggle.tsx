import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTouristas } from '@/contexts/TouristasContext';

export function TouristasToggle() {
  const { isOpen, openChat } = useTouristas();

  if (isOpen) {
    return null;
  }

  return (
    <Button
      onClick={openChat}
      size="lg"
      className="fixed bottom-6 right-6 z-40 shadow-2xl rounded-full h-14 px-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <MessageSquare className="h-5 w-5" />
      <span className="font-heading font-bold">Touristas AI</span>
    </Button>
  );
}
