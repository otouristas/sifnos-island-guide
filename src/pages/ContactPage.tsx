
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use a type assertion to bypass TypeScript errors with Supabase types
      const { error } = await (supabase as any)
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }]);
      
      if (error) throw error;
      
      setSubmitStatus('success');
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });

      // Reset the form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Hotels Sifnos" 
        description="Get in touch with Hotels Sifnos for inquiries about accommodations, special requests, or general information about staying in Sifnos."
        keywords={['contact hotels sifnos', 'sifnos accommodation contact', 'sifnos hotel inquiry', 'contact us']}
        schemaType="Organization"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-12">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Have questions about accommodations in Sifnos? We're here to help.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Information Section */}
      <div className="bg-white py-16">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="cycladic-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-5 bg-sifnos-teal/10 rounded-full flex items-center justify-center">
                <Phone className="text-sifnos-turquoise w-7 h-7" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">Phone</h3>
              <p className="text-gray-600 mb-2">Customer Support</p>
              <a href="tel:+302284071234" className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors">
                +30 22840 71234
              </a>
            </div>
            
            <div className="cycladic-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-5 bg-sifnos-teal/10 rounded-full flex items-center justify-center">
                <Mail className="text-sifnos-turquoise w-7 h-7" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">Email</h3>
              <p className="text-gray-600 mb-2">Send us a message</p>
              <a href="mailto:info@hotelssifnos.com" className="text-sifnos-turquoise font-medium hover:text-sifnos-deep-blue transition-colors">
                info@hotelssifnos.com
              </a>
            </div>
            
            <div className="cycladic-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-5 bg-sifnos-teal/10 rounded-full flex items-center justify-center">
                <MapPin className="text-sifnos-turquoise w-7 h-7" />
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-3">Office</h3>
              <p className="text-gray-600 mb-2">Apollonia</p>
              <address className="not-italic text-gray-700">
                Main Street, Apollonia<br />
                Sifnos, 84003, Greece
              </address>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                  
                  {/* Form submission status messages */}
                  {submitStatus === 'success' && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
                      <CheckCircle className="mr-2" size={18} />
                      Your message has been sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
                      <AlertCircle className="mr-2" size={18} />
                      There was an error sending your message. Please try again later.
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            {/* Map */}
            <div>
              <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-6">Find Us</h2>
              <div className="h-[400px] w-full bg-gray-200 rounded-lg overflow-hidden">
                {/* Replace with actual Google Maps embed */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25606.15345672878!2d24.6975!3d36.9764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1498d563b0000001%3A0xc30a53094dbc41d1!2sApollonia%2C%20Greece!5e0!3m2!1sen!2sus!4v1644856547222!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Office location map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="page-container">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="cycladic-card p-6">
              <h3 className="font-montserrat font-semibold text-xl mb-3">What is the best time to visit Sifnos?</h3>
              <p className="text-gray-700">
                The best time to visit Sifnos is between May and October when the weather is warm and pleasant. 
                June to September is peak tourist season with the hottest temperatures, while May and October 
                offer milder weather and fewer crowds.
              </p>
            </div>
            
            <div className="cycladic-card p-6">
              <h3 className="font-montserrat font-semibold text-xl mb-3">How do I get to Sifnos?</h3>
              <p className="text-gray-700">
                Sifnos doesn't have an airport. You can reach the island by ferry from Athens' ports 
                (Piraeus or Lavrion). The trip takes between 2.5 to 5 hours depending on the type of ferry. 
                We can arrange transfers from the port to your hotel.
              </p>
            </div>
            
            <div className="cycladic-card p-6">
              <h3 className="font-montserrat font-semibold text-xl mb-3">Do I need to rent a car on Sifnos?</h3>
              <p className="text-gray-700">
                While not essential, renting a car, scooter, or ATV will give you more flexibility to explore 
                the island's villages and beaches. Sifnos also has a reliable public bus system connecting major 
                towns and beaches during the tourist season.
              </p>
            </div>
            
            <div className="cycladic-card p-6">
              <h3 className="font-montserrat font-semibold text-xl mb-3">What are the must-see places on Sifnos?</h3>
              <p className="text-gray-700">
                Don't miss Kastro (the medieval capital), Apollonia (the main town), the pottery workshops in 
                Vathi, hiking trails, and beaches like Platis Gialos, Vathi, and Chrissopigi with its iconic 
                monastery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
