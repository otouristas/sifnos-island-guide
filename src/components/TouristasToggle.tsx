import { Button } from '@/components/ui/button';
import { useTouristas } from '@/contexts/TouristasContext';
import TouristasLogo from '@/components/TouristasLogo';

export function TouristasToggle() {
  const { isOpen, openChat } = useTouristas();

  if (isOpen) {
    return null;
  }

  return (
    <Button
      onClick={openChat}
      size="lg"
      className="fixed bottom-6 right-6 z-50 shadow-2xl rounded-full h-14 px-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <TouristasLogo size="md" className="mr-2" />
      <span className="font-heading font-bold">Touristas AI</span>
    </Button>
  );
}
