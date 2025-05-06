
import { useState } from "react";
import { z } from "zod";
import { useForm as useReactHookForm } from "react-hook-form";
import { useForm as useFormspreeForm, ValidationError } from "@formspree/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { supabase, logSupabaseResponse } from "@/integrations/supabase/client";

// Import our new components
import { BasicInformationSection } from "./pricing/BasicInformationSection";
import { LocationPlanSection } from "./pricing/LocationPlanSection";
import { AddressSection } from "./pricing/AddressSection";
import { OnlinePresenceSection } from "./pricing/OnlinePresenceSection";
import { SocialMediaSection } from "./pricing/SocialMediaSection";
import { AdditionalInfoSection } from "./pricing/AdditionalInfoSection";
import { FormSubmitSection } from "./pricing/FormSubmitSection";
import { SuccessMessage } from "./pricing/SuccessMessage";
import { ErrorMessage } from "./pricing/ErrorMessage";

interface PricingContactFormProps {
  selectedPlan: string | null;
}

// Define a type for the registration data response from Supabase
interface RegistrationData {
  id: string;
  [key: string]: any; // Allow other properties
}

// Explicitly define the insert type for hotel_registrations
interface HotelRegistrationInsert {
  hotel_name: string;
  contact_name: string;
  email: string;
  phone: string;
  location: string;
  selected_plan: string;
  message?: string | null;
  website?: string | null;
  google_maps_url?: string | null;
  booking_url?: string | null;
  airbnb_url?: string | null;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_twitter?: string | null;
  address?: string | null;
}

const PricingContactForm = ({ selectedPlan }: PricingContactFormProps) => {
  const [state, handleSubmit] = useFormspreeForm("mvgakjzd");
  const navigate = useNavigate();
  
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Submit to Formspree first
    await handleSubmit(event);
    
    // If Formspree submission was successful, also save to Supabase
    if (state.succeeded) {
      const formData = new FormData(event.currentTarget);
      
      try {
        // Prepare data object with correct typing
        const registrationData: HotelRegistrationInsert = {
          hotel_name: formData.get('hotelName') as string,
          contact_name: formData.get('contactName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          location: formData.get('location') as string,
          selected_plan: formData.get('selectedPlan') as string,
          message: (formData.get('message') as string) || null,
          website: (formData.get('website') as string) || null,
          google_maps_url: (formData.get('googleMaps') as string) || null,
          booking_url: (formData.get('bookingUrl') as string) || null,
          airbnb_url: (formData.get('airbnbUrl') as string) || null,
          social_facebook: (formData.get('socialFacebook') as string) || null,
          social_instagram: (formData.get('socialInstagram') as string) || null,
          social_twitter: (formData.get('socialTwitter') as string) || null,
          address: (formData.get('address') as string) || null
        };
        
        // Insert into Supabase with proper typing
        const { data, error } = await supabase
          .from('hotel_registrations')
          .insert(registrationData)
          .select();
        
        if (!error) {
          // Send email notification via edge function
          try {
            // Safely extract registration ID with proper type checking
            let registrationId = 'unknown';
            if (data && Array.isArray(data) && data.length > 0) {
              const registration = data[0] as unknown as RegistrationData;
              registrationId = registration.id;
            }
            
            await supabase.functions.invoke('send-registration-email', {
              body: {
                hotel: formData.get('hotelName') as string,
                contactName: formData.get('contactName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                location: formData.get('location') as string,
                plan: formData.get('selectedPlan') as string,
                message: formData.get('message') as string || '',
                registrationId: registrationId,
                website: formData.get('website') as string || undefined,
                googleMapsUrl: formData.get('googleMaps') as string || undefined,
                bookingUrl: formData.get('bookingUrl') as string || undefined,
                airbnbUrl: formData.get('airbnbUrl') as string || undefined,
                socialFacebook: formData.get('socialFacebook') as string || undefined,
                socialInstagram: formData.get('socialInstagram') as string || undefined,
                socialTwitter: formData.get('socialTwitter') as string || undefined,
                address: formData.get('address') as string || undefined
              }
            });
            
            console.log('Registration email sent successfully');
          } catch (emailError) {
            console.error('Error sending registration email:', emailError);
            // Continue anyway as the registration was successful
          }
          
          // Redirect to thank you page
          navigate('/thank-you');
        }
      } catch (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError);
        // We don't need to show an error message as Formspree was successful
      }
    }
  };
  
  if (state.succeeded) {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Basic Information */}
      <BasicInformationSection state={state} />
      
      {/* Hotel Location and Plan */}
      <LocationPlanSection state={state} selectedPlan={selectedPlan} />
      
      {/* Hotel Address */}
      <AddressSection state={state} />
      
      {/* Online Presence Fields */}
      <OnlinePresenceSection state={state} />
      
      {/* Social Media */}
      <SocialMediaSection state={state} />
      
      {/* Additional Information */}
      <AdditionalInfoSection state={state} />
      
      {/* Submit Button */}
      <FormSubmitSection isSubmitting={state.submitting} />
      
      {/* Error Message */}
      {state.errors && Object.keys(state.errors).length > 0 && (
        <ErrorMessage errors={state.errors} />
      )}
    </form>
  );
};

export default PricingContactForm;
