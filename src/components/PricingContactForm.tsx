
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  hotelName: z.string().min(2, { message: 'Hotel name must be at least 2 characters' }),
  contactName: z.string().min(2, { message: 'Contact name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  location: z.string().min(1, { message: 'Please select a location' }),
  message: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' })
});

type FormValues = z.infer<typeof formSchema>;

type PricingContactFormProps = {
  selectedPlan: 'free' | 'standard' | 'premium';
  onSubmitSuccess: () => void;
};

export default function PricingContactForm({ selectedPlan, onSubmitSuccess }: PricingContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelName: '',
      contactName: '',
      email: '',
      phone: '',
      location: '',
      message: '',
      acceptTerms: false,
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Store the hotel registration in Supabase
      const { error } = await supabase
        .from('hotel_registrations')
        .insert({
          hotel_name: data.hotelName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          message: data.message,
          selected_plan: selectedPlan,
          status: 'new'
        });
        
      if (error) throw error;
      
      // Send email notification through the edge function
      const { error: emailError } = await supabase.functions.invoke('send-registration-email', {
        body: {
          hotelName: data.hotelName,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          message: data.message,
          selectedPlan
        }
      });
      
      if (emailError) {
        console.error('Error sending email:', emailError);
        // Continue even if email fails, as we've stored the data
      }
      
      toast({
        title: 'Registration submitted successfully!',
        description: 'We will contact you shortly to complete your registration.',
      });
      
      onSubmitSuccess();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error submitting registration',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const planName = selectedPlan === 'free' ? 'Basic' : selectedPlan === 'standard' ? 'Popular' : 'Premium';
  const planPrice = selectedPlan === 'free' ? '0' : selectedPlan === 'standard' ? '249' : '499';
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="font-medium">Selected Plan: <span className="text-sifnos-deep-blue">{planName}</span></p>
          <p>Price: €{planPrice}/year</p>
        </div>
        
        <FormField
          control={form.control}
          name="hotelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person*</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number*</FormLabel>
                <FormControl>
                  <Input placeholder="+30 123 456 7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Location*</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apollonia">Apollonia</SelectItem>
                  <SelectItem value="artemonas">Artemonas</SelectItem>
                  <SelectItem value="kamares">Kamares</SelectItem>
                  <SelectItem value="kastro">Kastro</SelectItem>
                  <SelectItem value="vathy">Vathy</SelectItem>
                  <SelectItem value="platis_gialos">Platis Gialos</SelectItem>
                  <SelectItem value="faros">Faros</SelectItem>
                  <SelectItem value="other">Other location</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please share any specific requirements or questions about listing your hotel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the terms and conditions and privacy policy*
                </FormLabel>
                <FormDescription>
                  By submitting this form, you agree to be contacted about your hotel listing.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Info className="h-4 w-4 mr-2" />
            <span>We'll contact you within 24 hours</span>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
