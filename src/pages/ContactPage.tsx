
import { useEffect } from 'react';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { useForm, ValidationError } from '@formspree/react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xovdeojl");
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-16">
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
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-6">Send Us a Message</h2>
              
              {state.succeeded ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                  <h3 className="text-xl font-semibold text-green-800">Message Sent!</h3>
                  <p className="text-green-700 mt-2">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                    />
                    <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                      {state.submitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send size={18} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                    
                    {state.errors && Object.keys(state.errors).length > 0 && (
                      <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" size={18} />
                        There are errors in your submission. Please check the form and try again.
                      </div>
                    )}
                  </div>
                </form>
              )}
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
