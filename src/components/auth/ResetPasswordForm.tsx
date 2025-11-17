import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

// Define form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ResetPasswordFormProps {
  onBack?: () => void;
}

export default function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(values.email);
      
      if (!error) {
        setIsSubmitted(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('common.checkYourEmail')}</h3>
        <p className="text-gray-600 mb-4">
          {t('common.passwordResetSent')}
        </p>
        <Button variant="outline" onClick={onBack} className="w-full">
          {t('common.backToSignIn')}
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('common.backToSignIn')}
      </Button>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.email')}</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.sendingResetLink')}
              </>
            ) : (
              t('common.sendResetLink')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}