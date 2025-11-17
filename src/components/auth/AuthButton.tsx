import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import AuthModal from './AuthModal';
import { useI18n } from '@/contexts/I18nContext';

interface AuthButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export default function AuthButton({ 
  variant = 'default', 
  size = 'default',
  className = '',
  children
}: AuthButtonProps) {
  const { t } = useI18n();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className={className}
        onClick={() => setIsAuthModalOpen(true)}
      >
        {children || (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            {t('common.signIn')}
          </>
        )}
      </Button>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}