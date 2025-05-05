
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import SEO from '@/components/SEO';

export default function RegistrationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: '',
    ownerName: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    agreeToTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Please agree to the terms",
        description: "You must agree to the terms and conditions to register.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here we would normally submit the data to an API
      // For now we'll just simulate a request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration successful!",
        description: "We'll review your hotel information and get back to you soon."
      });
      
      // Reset form
      setFormData({
        hotelName: '',
        ownerName: '',
        email: '',
        phone: '',
        location: '',
        description: '',
        agreeToTerms: false
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Register Your Hotel - Hotels in Sifnos" 
        description="Register your accommodation in Sifnos with our platform to gain more visibility and bookings."
        keywords={['sifnos hotel registration', 'list property sifnos', 'accommodation registration greece']}
        canonical="https://hotelssifnos.com/register"
      />
      
      <div className="bg-sifnos-deep-blue">
        <div className="page-container">
          <div className="text-center text-white py-6">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Register Your Hotel
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Join our platform to increase your visibility and bookings
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-12">
        <div className="page-container">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Hotel Registration</CardTitle>
              <CardDescription>
                Fill out the form below to register your hotel or accommodation on our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotelName">Hotel/Accommodation Name *</Label>
                      <Input 
                        id="hotelName"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleChange}
                        placeholder="Enter your hotel name" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner/Manager Name *</Label>
                      <Input 
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Enter owner or manager name" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location in Sifnos *</Label>
                      <Input 
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Apollonia, Kamares, Platis Gialos" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Brief Description</Label>
                      <Input 
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Briefly describe your accommodation" 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox 
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions and privacy policy
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Register Hotel'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-col space-y-4 text-sm text-gray-500">
              <p>
                After submission, our team will review your information and contact you 
                within 48 hours to discuss the next steps.
              </p>
              <p>
                By registering, you'll be listed on our platform and become eligible for our 
                promotion services across Sifnos and Greece.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
