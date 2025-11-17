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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 shadow-2xl rounded-full h-12 sm:h-14 px-4 sm:px-6 gap-2 bg-[#1E2E48] hover:bg-[#1E2E48]/90 text-white"
      aria-label="Open Touristas AI chat"
    >
      <TouristasLogo size="md" className="sm:mr-2" />
      <span className="font-heading font-bold text-sm sm:text-base hidden xs:inline">
        Touristas AI
      </span>
    </Button>
  );
}
