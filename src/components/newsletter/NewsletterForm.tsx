
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { subscribeToNewsletter } from '@/services/newsletter';
import { Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  buttonText?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  inputClassName?: string;
  formClassName?: string;
  showName?: boolean;
  horizontal?: boolean;
}

export const NewsletterForm = ({
  buttonText = 'Subscribe',
  placeholder = 'Your email address',
  className = '',
  buttonClassName = '',
  inputClassName = '',
  formClassName = '',
  showName = false,
  horizontal = false,
}: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setLoading(true);
    
    try {
      await subscribeToNewsletter({
        email,
        name: name || undefined,
      });
      
      // Reset form fields
      setEmail('');
      setName('');
    } catch (error) {
      // Error is already handled in the service
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`${formClassName} ${horizontal ? 'flex' : 'space-y-3'}`}
    >
      {showName && (
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClassName}
        />
      )}
      <div className={horizontal ? 'flex flex-1' : ''}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${inputClassName} ${horizontal ? 'rounded-r-none' : ''}`}
        />
        <Button 
          type="submit" 
          disabled={loading} 
          className={`${buttonClassName} ${horizontal ? 'rounded-l-none' : 'w-full'}`}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {buttonText}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterForm;
