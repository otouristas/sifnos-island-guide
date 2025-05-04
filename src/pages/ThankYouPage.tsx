
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import SEO from "../components/SEO";

interface LocationState {
  plan?: string;
  hotelName?: string;
}

const ThankYouPage = () => {
  const location = useLocation();
  const state = location.state as LocationState || {};
  const { plan, hotelName } = state;
  
  const isPaidPlan = plan === 'Premium' || plan === 'Professional';
  
  return (
    <>
      <SEO 
        title="Thank You for Your Registration | HotelsSifnos"
        description="Thank you for registering your hotel on HotelsSifnos. We'll be in touch soon to complete your listing."
        canonical="https://hotelssifnos.com/thank-you"
        noIndex={true}
      />

      <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-sifnos-deep-blue mb-4">
          Thank You for Your Registration!
        </h1>
        
        {hotelName ? (
          <p className="text-xl text-gray-600 mb-8">
            We've received your registration for {hotelName}.
          </p>
        ) : (
          <p className="text-xl text-gray-600 mb-8">
            We've received your registration.
          </p>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
          
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <p className="font-medium">Our team will review your registration</p>
              <p className="text-gray-600">We'll check the details you've provided to ensure everything is complete.</p>
            </li>
            
            <li>
              <p className="font-medium">We'll be in touch within 1-2 business days</p>
              <p className="text-gray-600">A team member will contact you via email or phone to confirm your listing details.</p>
            </li>
            
            {isPaidPlan && (
              <li>
                <p className="font-medium">Payment information</p>
                <p className="text-gray-600">We'll provide payment instructions to activate your {plan} plan.</p>
              </li>
            )}
            
            <li>
              <p className="font-medium">Your hotel listing goes live</p>
              <p className="text-gray-600">Once approved, your property will be visible to travelers planning their Sifnos vacation.</p>
            </li>
          </ol>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            If you have any questions in the meantime, please don't hesitate to contact us.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button asChild variant="default">
              <Link to="/">Return to Homepage</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;
