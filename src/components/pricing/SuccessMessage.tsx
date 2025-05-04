
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SuccessMessage = () => {
  const navigate = useNavigate();
  
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
};
