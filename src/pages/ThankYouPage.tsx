
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '../components/SEO';

export default function ThankYouPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Thank You - Registration Received"
        description="Thank you for registering your hotel with Hotels Sifnos. We've received your information and will be in touch soon."
        keywords={['hotel registration', 'sifnos hotel listing', 'thank you']}
        schemaType="Organization"
        canonical="https://hotelssifnos.com/thank-you"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="bg-green-50 rounded-full p-4 mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue mb-4">
          Thank You for Your Registration!
        </h1>
        
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-xl text-gray-600 mb-4">
            We've received your hotel registration information and we're excited to feature your property on Hotels Sifnos.
          </p>
          <p className="text-lg text-gray-600">
            Our team will review your submission and contact you within 24 hours to gather additional details and guide you through the next steps.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-2xl mb-8">
          <h2 className="text-xl font-semibold mb-3">What happens next?</h2>
          <ol className="text-left space-y-3">
            <li className="flex">
              <span className="font-bold mr-2">1.</span>
              <span>One of our team members will contact you via email or phone within 24 hours.</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-2">2.</span> 
              <span>We'll collect detailed information about your hotel, including photos and amenities.</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-2">3.</span> 
              <span>You'll receive payment instructions based on your selected plan (if applicable).</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-2">4.</span> 
              <span>Once payment is processed, we'll create your hotel listing and notify you when it's live.</span>
            </li>
          </ol>
        </div>
        
        <div className="space-x-4">
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Homepage
          </Button>
          <Button onClick={() => navigate('/contact')}>
            Contact Support
          </Button>
        </div>
      </div>
    </>
  );
}
