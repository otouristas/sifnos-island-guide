
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Heart, Check, Users, Building, Award, MapPin, Clock } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <>
      <SEO 
        title="About Hotels Sifnos - Your Guide to Accommodation in Sifnos Island" 
        description="Learn about Hotels Sifnos, the leading accommodation guide for Sifnos Island. Discover our mission, expert team, and commitment to providing curated hotel recommendations and travel advice."
        keywords={['about hotels sifnos', 'sifnos accommodation experts', 'sifnos travel guide', 'sifnos hotel recommendations', 'cyclades accommodation']}
        schemaType="Organization"
        canonical="https://hotelssifnos.com/about-us"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-20">
        <div className="page-container">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About Hotels Sifnos
            </h1>
            <p className="text-lg md:text-xl">
              Your trusted guide to finding the perfect accommodation in the captivating island of Sifnos
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Hotels Sifnos was born from a deep love for the enchanting island of Sifnos and a desire to help travelers discover its unparalleled beauty and hospitality. Founded in 2018 by a team of travel enthusiasts with strong connections to the island, our platform has evolved into the definitive resource for finding the perfect accommodation in Sifnos.
                </p>
                <p>
                  What began as a simple directory has grown into a comprehensive guide, connecting visitors with carefully curated hotels, villas, and traditional accommodations that showcase the authentic Cycladic charm and warm hospitality that Sifnos is known for.
                </p>
                <p>
                  Unlike generic booking platforms, we specialize exclusively in Sifnos, allowing us to provide detailed insights and personalized recommendations based on intimate knowledge of the island's diverse regions, beaches, and villages. Our team personally visits and evaluates each property, ensuring that our listings maintain the highest standards of quality and authenticity.
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 bg-sifnos-teal/10 rounded-lg h-80 flex items-center justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Hotels Sifnos Team"
                className="max-h-full max-w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission & Values */}
      <div className="py-20 bg-gray-50">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-6">
              Our Mission & Values
            </h2>
            <p className="text-lg text-gray-700">
              At Hotels Sifnos, we're guided by a commitment to authentic hospitality and sustainable tourism that benefits both visitors and the local community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="cycladic-card text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                <Heart size={28} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-4">Authentic Experiences</h3>
              <p className="text-gray-700">
                We're committed to promoting accommodations that offer genuine Cycladic experiences, respecting local culture, architecture, and traditions. We believe in showcasing the authentic character of Sifnos that makes it a truly special destination.
              </p>
            </div>
            
            <div className="cycladic-card text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                <Check size={28} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-4">Quality & Reliability</h3>
              <p className="text-gray-700">
                Every property on our platform is carefully selected and regularly reviewed to ensure it meets our standards for quality, cleanliness, service, and value. We only recommend accommodations we would personally stay in and enjoy.
              </p>
            </div>
            
            <div className="cycladic-card text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                <Users size={28} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-4">Community Support</h3>
              <p className="text-gray-700">
                We prioritize family-owned properties and local businesses, supporting the island's economy and helping preserve its unique cultural identity. We believe sustainable tourism should benefit the communities that make Sifnos special.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="py-20">
        <div className="page-container">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-center mb-16">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="cycladic-card text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src="/placeholder.svg"
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Eleni Papadopoulos</h3>
              <p className="text-sifnos-turquoise mb-4">Founder & Managing Director</p>
              <p className="text-gray-700 mb-4">
                Born and raised in Sifnos, Eleni combines her deep knowledge of the island with 15+ years in the hospitality industry to ensure Hotels Sifnos delivers exceptional value to visitors and property partners.
              </p>
            </div>
            
            <div className="cycladic-card text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src="/placeholder.svg"
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Nikos Antoniou</h3>
              <p className="text-sifnos-turquoise mb-4">Head of Partnerships</p>
              <p className="text-gray-700 mb-4">
                With extensive experience in hotel management across the Cyclades, Nikos oversees our relationships with property owners and ensures all listings meet our quality standards.
              </p>
            </div>
            
            <div className="cycladic-card text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src="/placeholder.svg"
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">Marina Roussou</h3>
              <p className="text-sifnos-turquoise mb-4">Travel Content Specialist</p>
              <p className="text-gray-700 mb-4">
                A travel writer and Sifnos enthusiast, Marina creates our detailed guides and property descriptions, bringing the magic of the island to life through her engaging content.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="page-container">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-center mb-16">
            Why Choose Hotels Sifnos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="cycladic-card p-8">
              <h3 className="flex items-center text-xl font-montserrat font-semibold mb-5">
                <Building size={22} className="text-sifnos-turquoise mr-3" />
                Local Expertise
              </h3>
              <p className="text-gray-700">
                Our team lives and breathes Sifnos. We have personal connections with property owners and intimate knowledge of each village and beach area, allowing us to match you with the perfect accommodation for your preferences.
              </p>
            </div>
            
            <div className="cycladic-card p-8">
              <h3 className="flex items-center text-xl font-montserrat font-semibold mb-5">
                <Award size={22} className="text-sifnos-turquoise mr-3" />
                Curated Selection
              </h3>
              <p className="text-gray-700">
                Unlike mass-market booking sites, we personally evaluate each property before listing it. Our selective approach ensures quality and authenticity, saving you hours of research and preventing disappointment.
              </p>
            </div>
            
            <div className="cycladic-card p-8">
              <h3 className="flex items-center text-xl font-montserrat font-semibold mb-5">
                <MapPin size={22} className="text-sifnos-turquoise mr-3" />
                Destination Insights
              </h3>
              <p className="text-gray-700">
                Beyond accommodation, we provide detailed information about Sifnos attractions, dining, beaches, and activities. Our comprehensive travel guides help you plan the perfect island experience.
              </p>
            </div>
            
            <div className="cycladic-card p-8">
              <h3 className="flex items-center text-xl font-montserrat font-semibold mb-5">
                <Clock size={22} className="text-sifnos-turquoise mr-3" />
                Seasonal Expertise
              </h3>
              <p className="text-gray-700">
                Sifnos changes with the seasons, and our recommendations adapt accordingly. We help you choose the ideal time to visit and the best accommodation options for your selected travel dates.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="py-20">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-700 mb-10">
              Have questions about Sifnos accommodations or need personalized recommendations? Our team is here to help you plan the perfect stay.
            </p>
            
            <div className="cycladic-card text-center mb-10 inline-block px-12 py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-sifnos-deep-blue" />
              </div>
              <h3 className="font-medium">Email Us</h3>
              <p className="text-sifnos-turquoise">info@hotelssifnos.com</p>
            </div>
            
            <div className="mt-8">
              <Link 
                to="/contact" 
                className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-8 py-4 rounded-lg transition-colors font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-20 bg-sifnos-deep-blue text-white">
        <div className="page-container text-center">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-8">
            Start Planning Your Sifnos Experience
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            Discover our curated selection of hotels, villas, and traditional accommodations across Sifnos Island.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/hotels" 
              className="bg-white text-sifnos-deep-blue px-10 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Hotels
            </Link>
            <Link 
              to="/travel-guide" 
              className="border border-white text-white px-10 py-4 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Explore Travel Guide
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
