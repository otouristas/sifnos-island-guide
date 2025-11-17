import SEO from '@/components/SEO';
import { Mail, Phone, MessageCircle, Clock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function OwnerSupportPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@hotelssifnos.com',
      response: 'Response within 24 hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak to our team',
      contact: '+30 123 456 7890',
      response: 'Mon-Fri, 9am-6pm EEST'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with support',
      contact: 'Available in dashboard',
      response: 'Average response: 5 minutes'
    }
  ];

  const faqs = [
    {
      question: 'How do I update my hotel listing?',
      answer: 'Log in to your dashboard, go to "My Hotels", select your property, and click "Edit Details". You can update photos, descriptions, amenities, and pricing anytime.'
    },
    {
      question: 'What are the commission rates?',
      answer: 'We offer competitive commission rates starting at 15% for standard listings. Premium plans have lower rates. Check our Pricing page for detailed information.'
    },
    {
      question: 'How do I manage bookings?',
      answer: 'All bookings appear in your dashboard under "Bookings". You can view details, communicate with guests, and manage check-ins/check-outs from there.'
    },
    {
      question: 'Can I sync my calendar with other platforms?',
      answer: 'Yes, we support iCal integration with major booking platforms to prevent double bookings. Set this up in Settings > Calendar Sync.'
    },
    {
      question: 'How do I get paid?',
      answer: 'Payments are processed automatically and deposited to your registered bank account within 3-5 business days after guest check-in.'
    },
    {
      question: 'What if a guest cancels?',
      answer: 'Cancellation policies are set by you. Refunds are processed according to your policy, and you receive payment for any non-refundable portion.'
    }
  ];

  return (
    <>
      <SEO
        title="Hotel Owner Support - 24/7 Help & Assistance"
        description="Get help managing your hotel on HotelsSifnos.com. 24/7 support via email, phone, and live chat."
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Hotel Owner Support
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to help you succeed. Get support 24/7 from our dedicated team.
            </p>
          </div>

          {/* Contact Methods */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl font-bold text-center mb-12">
              Get in Touch
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <method.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground mb-2">{method.contact}</p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      {method.response}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h2 className="font-heading text-3xl font-bold">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Resources Link */}
          <section className="text-center bg-muted/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Looking for Guides & Tutorials?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Check out our comprehensive resource library with guides, videos, and best practices
            </p>
            <Button asChild size="lg">
              <a href="/owner-resources">
                Browse Resources
              </a>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
