
import { useState } from "react";
import { z } from "zod";
import { useForm as useReactHookForm } from "react-hook-form";
import { useForm as useFormspreeForm, ValidationError } from "@formspree/react";
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
import { Globe, Mail, MapPin, ExternalLink } from "lucide-react";
import { Facebook, Instagram, Twitter } from "../components/icons/SocialIcons";
import { supabase, logSupabaseResponse } from "@/integrations/supabase/client";

interface PricingContactFormProps {
  selectedPlan: string | null;
}

// Define a type for the registration data response from Supabase
interface RegistrationData {
  id: string;
  [key: string]: any; // Allow other properties
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
        // Insert into Supabase
        const { data, error } = await supabase.from('hotel_registrations').insert({
          hotel_name: formData.get('hotelName') as string,
          contact_name: formData.get('contactName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          location: formData.get('location') as string,
          selected_plan: formData.get('selectedPlan') as string,
          message: formData.get('message') as string || null,
          website: formData.get('website') as string || null,
          google_maps_url: formData.get('googleMaps') as string || null,
          booking_url: formData.get('bookingUrl') as string || null,
          airbnb_url: formData.get('airbnbUrl') as string || null,
          social_facebook: formData.get('socialFacebook') as string || null,
          social_instagram: formData.get('socialInstagram') as string || null,
          social_twitter: formData.get('socialTwitter') as string || null,
          address: formData.get('address') as string || null
        });
        
        logSupabaseResponse('register hotel', data, error);
        
        if (!error) {
          // Send email notification via edge function
          try {
            // Safely extract registration ID with proper type checking
            let registrationId = 'unknown';
            if (data && Array.isArray(data) && data.length > 0) {
              const registration = data[0] as RegistrationData;
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
    return (
      <div className="p-8 bg-green-50 border border-green-200 rounded-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Submitted Successfully!</h3>
        <p className="text-green-700 mb-6">
          Thank you for registering your hotel with us. Our team will review your information and contact you soon.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-green-600 hover:bg-green-700"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <label htmlFor="hotelName" className="block text-gray-700 font-medium mb-2">
            Hotel Name *
          </label>
          <Input
            id="hotelName"
            name="hotelName"
            placeholder="Your hotel name"
            required
            className="w-full"
          />
          <ValidationError prefix="Hotel Name" field="hotelName" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">
            Contact Person *
          </label>
          <Input
            id="contactName"
            name="contactName"
            placeholder="Your name"
            required
            className="w-full"
          />
          <ValidationError prefix="Contact Person" field="contactName" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className="w-full"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Phone Number *
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="+30 123 456 7890"
            required
            className="w-full"
          />
          <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
      </div>
      
      {/* Hotel Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location in Sifnos *
          </label>
          <select
            id="location"
            name="location"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select location</option>
            <option value="Agios Loukas">Agios Loukas</option>
            <option value="Apollonia">Apollonia</option>
            <option value="Artemonas">Artemonas</option>
            <option value="Vathi">Vathi</option>
            <option value="Exambela">Exambela</option>
            <option value="Kamares">Kamares</option>
            <option value="Kastro">Kastro</option>
            <option value="Katavati">Katavati</option>
            <option value="Kato Petali">Kato Petali</option>
            <option value="Pano Petali">Pano Petali</option>
            <option value="Platis Gialos">Platis Gialos</option>
            <option value="Troullaki">Troullaki</option>
            <option value="Faros">Faros</option>
            <option value="Herronisos">Herronisos</option>
            <option value="Chrysopigi">Chrysopigi</option>
          </select>
          <ValidationError prefix="Location" field="location" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="selectedPlan" className="block text-gray-700 font-medium mb-2">
            Selected Plan *
          </label>
          <select
            id="selectedPlan"
            name="selectedPlan"
            required
            defaultValue={selectedPlan || ""}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select a plan</option>
            <option value="Basic">Basic Listing (€0)</option>
            <option value="Premium">Premium Listing (€249)</option>
            <option value="Professional">Professional Package (€499)</option>
          </select>
          <ValidationError prefix="Selected Plan" field="selectedPlan" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
      </div>
      
      {/* Hotel Address */}
      <div>
        <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
          Full Address
        </label>
        <Textarea
          id="address"
          name="address"
          placeholder="Street, Number, Postal Code, etc."
          className="min-h-[80px]"
        />
        <ValidationError prefix="Address" field="address" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
      
      {/* Online Presence Fields */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Online Presence</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Globe className="h-4 w-4" /> Website URL
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://your-hotel-website.com"
            />
            <ValidationError prefix="Website" field="website" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
          
          <div>
            <label htmlFor="googleMaps" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <MapPin className="h-4 w-4" /> Google Maps URL
            </label>
            <Input
              id="googleMaps"
              name="googleMaps"
              type="url"
              placeholder="https://maps.google.com/?q=your-hotel"
            />
            <ValidationError prefix="Google Maps" field="googleMaps" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
          
          <div>
            <label htmlFor="bookingUrl" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <ExternalLink className="h-4 w-4" /> Booking.com URL
            </label>
            <Input
              id="bookingUrl"
              name="bookingUrl"
              type="url"
              placeholder="https://www.booking.com/your-property"
            />
            <ValidationError prefix="Booking URL" field="bookingUrl" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
          
          <div>
            <label htmlFor="airbnbUrl" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <ExternalLink className="h-4 w-4" /> Airbnb URL
            </label>
            <Input
              id="airbnbUrl"
              name="airbnbUrl"
              type="url"
              placeholder="https://www.airbnb.com/your-property"
            />
            <ValidationError prefix="Airbnb URL" field="airbnbUrl" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
        </div>
      </div>
      
      {/* Social Media */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Social Media</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="socialFacebook" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Facebook className="h-4 w-4" /> Facebook
            </label>
            <Input
              id="socialFacebook"
              name="socialFacebook"
              type="url"
              placeholder="https://facebook.com/your-page"
            />
            <ValidationError prefix="Facebook" field="socialFacebook" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
          
          <div>
            <label htmlFor="socialInstagram" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Instagram className="h-4 w-4" /> Instagram
            </label>
            <Input
              id="socialInstagram"
              name="socialInstagram"
              type="url"
              placeholder="https://instagram.com/your-handle"
            />
            <ValidationError prefix="Instagram" field="socialInstagram" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
          
          <div>
            <label htmlFor="socialTwitter" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Twitter className="h-4 w-4" /> Twitter/X
            </label>
            <Input
              id="socialTwitter"
              name="socialTwitter"
              type="url"
              placeholder="https://twitter.com/your-handle"
            />
            <ValidationError prefix="Twitter" field="socialTwitter" errors={state.errors} className="text-red-500 text-sm mt-1" />
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      <div>
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Additional Information
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us more about your property or any specific requirements..."
          className="min-h-[120px]"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
      
      {/* Submit Button */}
      <div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={state.submitting}
        >
          {state.submitting ? "Submitting..." : "Submit Registration"}
        </Button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          By submitting this form, you agree to our{" "}
          <a href="/terms-of-service" className="text-sifnos-teal hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="text-sifnos-teal hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
      
      {state.errors && Object.keys(state.errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Please correct the errors above and try again.</p>
        </div>
      )}
    </form>
  );
};

export default PricingContactForm;
