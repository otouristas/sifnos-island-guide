import SEO from '@/components/SEO';
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function GuestSupportPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a message',
      contact: 'guests@hotelssifnos.com',
      response: 'Response within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak to our team',
      contact: '+30 123 456 7890',
      response: 'Available 24/7'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us now',
      contact: 'Click the chat icon',
      response: 'Instant support'
    }
  ];

  const faqs = [
    {
      question: 'How do I make a booking?',
      answer: 'Browse our hotels, select your preferred property and dates, then click "Book Now". Fill in your details and complete payment to receive instant confirmation.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and select digital payment methods.'
    },
    {
      question: 'Can I cancel or modify my booking?',
      answer: 'Cancellation and modification policies vary by hotel. Check your confirmation email or the hotel\'s policy page for specific terms. Most bookings offer free cancellation up to 48 hours before check-in.'
    },
    {
      question: 'Will I receive a confirmation email?',
      answer: 'Yes! You\'ll receive instant confirmation via email with all booking details, including check-in instructions and hotel contact information.'
    },
    {
      question: 'How do I access the digital guest guide?',
      answer: 'After booking, you\'ll receive a unique guest link via email. Click it to access your personalized guest portal with hotel information, area guides, and special requests.'
    },
    {
      question: 'What if I need to contact my hotel directly?',
      answer: 'All hotel contact details are included in your confirmation email and guest portal. You can call or email them directly for any specific requests.'
    },
    {
      question: 'How do I get to Sifnos?',
      answer: 'Sifnos is accessible by ferry from Piraeus (Athens) or other Cycladic islands. Check our Ferry Tickets page for schedules and booking information.'
    },
    {
      question: 'Can I leave a review after my stay?',
      answer: 'Yes! We encourage guests to share their experience. You\'ll receive a review request email after check-out. Your feedback helps future travelers and hotels improve.'
    }
  ];

  return (
    <>
      <SEO
        title="Guest Support - Help & Assistance"
        description="Need help with your booking or have questions? Our support team is available 24/7 to assist you."
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Guest Support
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to help make your stay in Sifnos unforgettable
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
                    <p className="text-sm text-muted-foreground">{method.response}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="max-w-4xl mx-auto">
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
        </div>
      </div>
    </>
  );
}
