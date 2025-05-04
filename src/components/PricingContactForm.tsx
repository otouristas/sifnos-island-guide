
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Define form schema
const formSchema = z.object({
  hotelName: z.string().min(2, {
    message: "Hotel name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(6, {
    message: "Please enter a valid phone number.",
  }),
  location: z.string({
    required_error: "Please select a location.",
  }),
  selectedPlan: z.string({
    required_error: "Please select a plan.",
  }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PricingContactFormProps {
  selectedPlan: string | null;
}

const PricingContactForm = ({ selectedPlan }: PricingContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const defaultValues: Partial<FormValues> = {
    selectedPlan: selectedPlan || 'Basic',
    message: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form when selectedPlan prop changes
  if (selectedPlan && form.getValues("selectedPlan") !== selectedPlan) {
    form.setValue("selectedPlan", selectedPlan);
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting registration form:', values);
      
      // Insert the registration into Supabase
      const { data, error } = await supabase
        .from('hotel_registrations')
        .insert({
          hotel_name: values.hotelName,
          contact_name: values.contactName,
          email: values.email,
          phone: values.phone,
          location: values.location,
          selected_plan: values.selectedPlan,
          message: values.message || null,
          status: 'pending',
        })
        .select();

      if (error) {
        console.error('Error storing registration in database:', error);
        throw error;
      }
      
      console.log('Registration stored in database, sending email notification...');
      
      // Call edge function to send email notification
      try {
        const response = await fetch('/api/send-registration-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotel: values.hotelName,
            contactName: values.contactName,
            email: values.email,
            phone: values.phone,
            location: values.location,
            plan: values.selectedPlan,
            message: values.message || '',
            registrationId: data[0].id
          }),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error('Failed to send notification email:', responseData);
          // Continue with success flow even if email fails, but log the error
        } else {
          console.log('Email sent successfully:', responseData);
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Continue with success flow even if email fails
      }

      toast({
        title: "Registration submitted!",
        description: "Thank you for your interest. We'll be in touch soon.",
      });
      
      // Redirect to thank you page
      navigate('/thank-you', { 
        state: { 
          plan: values.selectedPlan,
          hotelName: values.hotelName
        } 
      });
      
    } catch (error: any) {
      console.error('Error submitting registration form:', error);
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to submit your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="hotelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your hotel name" {...field} />
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
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+30 123 456 7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location in Sifnos</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Apollonia">Apollonia</SelectItem>
                    <SelectItem value="Kamares">Kamares</SelectItem>
                    <SelectItem value="Platis Gialos">Platis Gialos</SelectItem>
                    <SelectItem value="Vathi">Vathi</SelectItem>
                    <SelectItem value="Kastro">Kastro</SelectItem>
                    <SelectItem value="Faros">Faros</SelectItem>
                    <SelectItem value="Cheronissos">Cheronissos</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="selectedPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selected Plan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Basic">Basic Listing (€0)</SelectItem>
                    <SelectItem value="Premium">Premium Listing (€249)</SelectItem>
                    <SelectItem value="Professional">Professional Package (€499)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us more about your property or any specific requirements..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          By submitting this form, you agree to our{" "}
          <a href="/terms-of-service" className="text-sifnos-teal hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="text-sifnos-teal hover:underline">
            Privacy Policy
          </a>.
        </p>
      </form>
    </Form>
  );
};

export default PricingContactForm;
