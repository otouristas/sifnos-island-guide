
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Heart, Check, Users, Building, Award, MapPin, Clock, Brain, Sparkles, Zap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

export default function AboutUsPage() {
  return (
    <>
      <SEO 
        title="About Hotels Sifnos - AI-Powered Accommodation Guide for Sifnos Island" 
        description="Discover Hotels Sifnos, the first AI-powered accommodation platform dedicated to Sifnos Island. Find your perfect stay with our Touristas AI technology that delivers personalized recommendations in minutes."
        keywords={['AI-powered accommodation', 'Sifnos hotels', 'Touristas AI', 'Sifnos villas', 'personalized booking', 'Greek islands accommodation']}
        schemaType="Organization"
        canonical="https://hotelssifnos.com/about-us"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-20">
        <div className="page-container">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              🏝️ Hotels Sifnos – The AI-Powered Guide to Your Perfect Stay
            </h1>
            <p className="text-lg md:text-xl">
              The first and only AI-powered accommodation discovery platform dedicated exclusively to the captivating island of Sifnos, Greece.
            </p>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className="py-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              About Hotels Sifnos
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="font-medium text-xl">
                <strong>Hotels Sifnos</strong> is the first and only <strong>AI-powered accommodation discovery platform</strong> dedicated exclusively to the captivating island of <strong>Sifnos, Greece</strong>. Our mission? To make booking the right accommodation <strong>faster, smarter, and deeply local</strong>.
              </p>
              <p>
                Whether you're looking for a luxury villa, a cozy seaside studio, or a traditional Cycladic pension, we connect you with the best available stays on the island—<strong>in one place</strong>.
              </p>
              
              <blockquote className="bg-sifnos-turquoise/10 p-6 rounded-lg border-l-4 border-sifnos-turquoise my-8">
                <p className="text-lg font-medium text-sifnos-deep-blue">
                  ⏱️ <strong>Cut your booking time. Maximize relevance. Powered by Touristas AI.</strong>
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      
      {/* What Makes Us Different */}
      <div className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              🚀 What Makes Us Different
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Unlike generic booking sites, Hotels Sifnos is laser-focused on <strong>one destination</strong>: Sifnos. Our curated platform leverages the <strong>Touristas AI Engine</strong> to instantly match travelers with personalized accommodation results based on:
              </p>
              
              <ul className="my-6 space-y-2">
                <li className="flex items-start">
                  <Check size={20} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                  <span>Traveler type & group size</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                  <span>Preferred location or beach</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                  <span>Amenity requirements</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                  <span>Seasonal availability</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="mt-1 mr-2 text-sifnos-turquoise flex-shrink-0" />
                  <span>Authenticity & local charm</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Touristas AI Section */}
      <div className="py-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8 flex items-center">
              <Brain size={30} className="text-sifnos-turquoise mr-3" />
              Touristas AI: Personalized Search, Smarter Choices
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                At the heart of our platform is <strong>Touristas</strong>, our proprietary AI engine developed specifically for tourism and local accommodation discovery. Here's what it does:
              </p>
              
              <ul className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <Zap size={20} className="mt-1 mr-3 text-sifnos-turquoise flex-shrink-0" />
                  <span>Instantly understands user intent</span>
                </li>
                <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <Sparkles size={20} className="mt-1 mr-3 text-sifnos-turquoise flex-shrink-0" />
                  <span>Filters and ranks properties with smart algorithms</span>
                </li>
                <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <Brain size={20} className="mt-1 mr-3 text-sifnos-turquoise flex-shrink-0" />
                  <span>Adapts to seasonality, availability, and user preferences</span>
                </li>
                <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <Clock size={20} className="mt-1 mr-3 text-sifnos-turquoise flex-shrink-0" />
                  <span>Reduces booking time from hours to minutes</span>
                </li>
              </ul>
              
              <blockquote className="bg-sifnos-deep-blue/5 p-6 rounded-lg border-l-4 border-sifnos-deep-blue my-8">
                <p className="text-lg font-medium text-sifnos-deep-blue">
                  With Touristas AI, you don't browse. You find.
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission & Values */}
      <div className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              🌟 Our Mission & Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="cycladic-card text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                  <Heart size={28} className="text-sifnos-deep-blue" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-4">Authenticity</h3>
                <p className="text-gray-700">
                  We feature properties that reflect the soul of Sifnos—Cycladic architecture, warm hospitality, and true local experiences.
                </p>
              </div>
              
              <div className="cycladic-card text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                  <Check size={28} className="text-sifnos-deep-blue" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-4">Quality & Trust</h3>
                <p className="text-gray-700">
                  Every listing is handpicked, reviewed, and updated regularly. We showcase only the places we'd stay in ourselves.
                </p>
              </div>
              
              <div className="cycladic-card text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-sifnos-turquoise/20 rounded-full flex items-center justify-center">
                  <Users size={28} className="text-sifnos-deep-blue" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-4">Local Impact</h3>
                <p className="text-gray-700">
                  We prioritize family-owned businesses and help support Sifnos's economy through sustainable, community-first tourism.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="py-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              🧠 Our Story
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                <strong>Founded in 2025</strong> by a team of professionals passionate about the Cyclades, <strong>Hotels Sifnos</strong> was created to solve a simple yet widespread problem: finding the right accommodation in a sea of generic booking platforms.
              </p>
              <p>
                Led by <strong>George Kasiotis</strong>, a globally recognized <strong>SEO Manager & Data Analyst</strong>, the platform combines cutting-edge AI technology with hands-on knowledge of Sifnos to deliver a booking experience that's faster, smarter, and genuinely local.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Meet the Founder */}
      <div className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              👤 Meet the Founder
            </h2>
            
            <div className="cycladic-card p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                  <img 
                    src="/uploads/seo-kasiotis-manager.jpg" 
                    alt="George Kasiotis - Founder of Hotels Sifnos" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-2xl font-montserrat font-semibold mb-2">George Kasiotis</h3>
                  <p className="text-sifnos-turquoise font-medium mb-4">Founder | SEO Manager & Data Analyst</p>
                  <p className="text-gray-700">
                    The architect behind Touristas AI and the vision for Hotels Sifnos. With a career built on delivering SEO and data performance for global brands like JD Sports, Bvlgari, Mindvalley, Cosmos Sport, and multiple travel-tech ventures, George brings enterprise-level strategy to the heart of Sifnian hospitality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="py-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-montserrat font-semibold mb-8">
              📬 Get in Touch
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Need help planning your stay in Sifnos? Want to recommend a property? Looking for the perfect villa or hidden gem?
              </p>
              
              <div className="flex flex-col md:flex-row items-start gap-6 my-8">
                <div className="cycladic-card p-6 flex items-center">
                  <Mail size={20} className="text-sifnos-turquoise mr-3" />
                  <span>Email us: <a href="mailto:hello@hotelssifnos.com" className="text-sifnos-turquoise">hello@hotelssifnos.com</a></span>
                </div>
                
                <div className="cycladic-card p-6 flex items-center">
                  <MapPin size={20} className="text-sifnos-turquoise mr-3" />
                  <span>Visit: <a href="https://hotelssifnos.com" className="text-sifnos-turquoise">hotelssifnos.com</a></span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
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
      
      {/* Closing Quote */}
      <div className="py-16 bg-sifnos-deep-blue text-white">
        <div className="page-container text-center">
          <blockquote className="max-w-3xl mx-auto text-xl md:text-2xl font-light italic">
            🧿 <span className="font-medium">Hotels Sifnos</span> – One island. Every stay. AI-personalized.
          </blockquote>
        </div>
      </div>
    </>
  );
}
