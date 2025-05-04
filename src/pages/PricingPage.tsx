
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PricingContactForm from '../components/PricingContactForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'standard' | 'premium' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  
  const handlePlanSelection = (plan: 'free' | 'standard' | 'premium') => {
    setSelectedPlan(plan);
    setShowForm(true);
  };
  
  const pricingPlans = [
    {
      id: 'free',
      name: 'Basic Listing',
      price: '0',
      description: 'Simple hotel information for hotels just getting started',
      features: [
        'Basic hotel information',
        'Hotel address & contact details',
        'Single photo',
        'Basic location information'
      ]
    },
    {
      id: 'standard',
      name: 'Popular',
      price: '249',
      description: 'Everything in Basic plus enhanced visibility features',
      features: [
        'Everything in Basic',
        'Multiple hotel photos',
        'Detailed description',
        'Room types & amenities',
        'Related hotels display',
        'Priority in search results'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '499',
      description: 'Maximum visibility and exclusive promotional benefits',
      features: [
        'Everything in Popular',
        'Sponsored placement on homepage',
        'Featured across the website',
        'Google Ads campaigns',
        'Instagram & Facebook promotion',
        'SEO boost package',
        'Priority customer support'
      ]
    }
  ];
  
  return (
    <>
      <SEO
        title="Pricing & Plans - List Your Hotel in Sifnos"
        description="Choose the perfect plan to showcase your hotel on Hotels Sifnos. From free basic listings to premium promotion packages with maximum visibility and marketing support."
        keywords={['sifnos hotel listing', 'hotel promotion sifnos', 'advertise hotel cyclades', 'hotel marketing greece']}
        schemaType="Organization"
        canonical="https://hotelssifnos.com/pricing"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sifnos-deep-blue mb-4">List Your Hotel on Hotels Sifnos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan to showcase your property to thousands of visitors planning their stay in Sifnos.
          </p>
        </div>
        
        {/* Annual renewal notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-12 max-w-3xl mx-auto">
          <p className="text-center text-blue-700">
            All plans are one-time payments with annual renewal. Save up to 20% with multi-year subscriptions.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-2 border-sifnos-turquoise shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-sifnos-turquoise text-white px-4 py-1 rounded-bl-lg rounded-tr-md text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{plan.price}</span>
                  <span className="text-gray-500 ml-2">/year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePlanSelection(plan.id as 'free' | 'standard' | 'premium')}
                  className={`w-full ${plan.popular ? 'bg-sifnos-turquoise hover:bg-sifnos-turquoise/90' : ''}`}
                >
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Trusted by Hotels Across Sifnos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">"Joining Hotels Sifnos was one of our best marketing decisions. Our bookings increased by 30% within the first three months."</p>
              <p className="font-semibold">- Maria Georgiou, Verina Astra</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">"The Premium plan's SEO boost helped us reach international travelers we couldn't before. Well worth the investment."</p>
              <p className="font-semibold">- Nikos Papadopoulos, Elies Resort</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">"Excellent support team and great visibility across the platform. We've renewed for a second year without hesitation."</p>
              <p className="font-semibold">- Elena Christou, Niriedes Hotel</p>
            </div>
          </div>
        </div>
        
        {/* Contact form dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Complete Your Registration</DialogTitle>
              <DialogDescription>
                Please provide your hotel details to get started with the {selectedPlan === 'free' ? 'Basic' : selectedPlan === 'standard' ? 'Popular' : 'Premium'} plan.
              </DialogDescription>
            </DialogHeader>
            <PricingContactForm 
              selectedPlan={selectedPlan || 'free'} 
              onSubmitSuccess={() => {
                setShowForm(false);
                navigate('/thank-you');
              }} 
            />
          </DialogContent>
        </Dialog>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How do renewals work?</h3>
              <p className="text-gray-600">All plans are billed annually. You'll receive a renewal notice 30 days before your subscription ends with an option to continue or upgrade your plan.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Can I upgrade my plan later?</h3>
              <p className="text-gray-600">Yes, you can upgrade your plan at any time. The price difference will be prorated for the remaining subscription period.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What happens after I select a plan?</h3>
              <p className="text-gray-600">After selecting a plan and completing the registration form, our team will contact you within 24 hours to collect your hotel information and set up your listing.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How do I make payments?</h3>
              <p className="text-gray-600">After form submission, you'll be guided through a secure payment process. We accept major credit cards and bank transfers.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
