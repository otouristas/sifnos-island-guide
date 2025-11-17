import SEO from '@/components/SEO';
import { Shield, Calendar, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BookingPoliciesPage() {
  const policies = [
    {
      icon: Calendar,
      title: 'Cancellation Policy',
      content: [
        'Free cancellation up to 48 hours before check-in for most bookings',
        'Refunds processed within 5-7 business days',
        'Non-refundable rates clearly marked during booking',
        'Specific hotel policies may vary - always check your confirmation'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      content: [
        'Full payment required at time of booking',
        'Secure payment processing with SSL encryption',
        'All major credit and debit cards accepted',
        'Prices shown in EUR and include all applicable taxes'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Check-in & Check-out',
      content: [
        'Standard check-in time: 3:00 PM',
        'Standard check-out time: 11:00 AM',
        'Early check-in/late check-out subject to availability',
        'Valid ID and booking confirmation required at check-in'
      ]
    },
    {
      icon: Shield,
      title: 'Booking Guarantee',
      content: [
        'Best price guarantee on all bookings',
        'Instant confirmation via email',
        'Secure handling of personal information',
        '24/7 customer support for booking issues'
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Booking Policies - Cancellation, Payment & Check-in"
        description="Review our booking policies including cancellation terms, payment methods, check-in procedures, and booking guarantees."
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Booking Policies
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know before making a reservation
            </p>
          </div>

          {/* Policies Grid */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {policies.map((policy, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <policy.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{policy.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {policy.content.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Important Notice */}
          <section className="max-w-4xl mx-auto">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Important Information
                  </h3>
                  <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                    <li>• Individual hotels may have additional policies or requirements</li>
                    <li>• Always review the specific hotel's cancellation policy before booking</li>
                    <li>• Peak season dates may have different cancellation terms</li>
                    <li>• Contact the hotel directly for special requests or questions</li>
                    <li>• Keep your booking confirmation email for reference</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Terms */}
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold mb-6">Additional Terms</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3>Guest Responsibilities</h3>
              <p>
                Guests are responsible for providing accurate information during booking and 
                adhering to hotel rules and policies. Any damages or violations may result in 
                additional charges.
              </p>

              <h3>Modifications</h3>
              <p>
                Booking modifications (dates, room type, guest numbers) are subject to availability 
                and may incur fees. Contact us as soon as possible to request changes.
              </p>

              <h3>No-Shows</h3>
              <p>
                Failure to check in without prior cancellation will result in full charge for the 
                first night and potential cancellation of remaining nights.
              </p>

              <h3>Disputes</h3>
              <p>
                Any disputes should be raised with our support team within 30 days of check-out. 
                We'll work with you and the hotel to reach a fair resolution.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
