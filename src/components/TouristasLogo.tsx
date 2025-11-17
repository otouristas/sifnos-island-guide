import { cn } from '@/lib/utils';

interface TouristasLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export default function TouristasLogo({ 
  size = 'md', 
  className,
  variant = 'light'
}: TouristasLogoProps) {
  return (
    <img 
      src="/uploads/touristas-ai-logo.svg" 
      alt="Touristas AI" 
      className={cn(sizeMap[size], className)}
    />
  );
}

