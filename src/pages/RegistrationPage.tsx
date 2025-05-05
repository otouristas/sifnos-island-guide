
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const RegistrationPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration submitted",
      description: "Thank you for registering. We will be in touch soon.",
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Register Your Hotel</h1>
      <p className="text-gray-600 mb-8 text-center">
        Join our platform and showcase your hotel to travelers visiting Sifnos Island.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Hotel Registration</CardTitle>
          <CardDescription>
            Please fill out the form below with your hotel information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input id="hotelName" placeholder="Enter your hotel name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter your phone number" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter hotel location on Sifnos" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Hotel Description</Label>
              <textarea 
                id="description" 
                className="w-full min-h-[100px] px-3 py-2 border rounded-md border-input bg-background" 
                placeholder="Tell us about your hotel"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">Submit Registration</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-gray-500">
            By submitting this form, you agree to our <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationPage;
