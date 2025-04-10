
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO 
        title="About Us - Hotels Sifnos" 
        description="Learn about Hotels Sifnos, the premier accommodation booking service for Sifnos Island, Greece."
        keywords={['about hotels sifnos', 'sifnos accommodation service', 'sifnos travel experts', 'hotels in sifnos']}
        schemaType="Organization"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-12">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              About Hotels Sifnos
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Your trusted guide to finding the perfect accommodation on Sifnos Island
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <div className="py-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                Founded in 2020, Hotels Sifnos was born from a love of this enchanting Cycladic island and a desire to help travelers find their perfect accommodation. Our team of local experts and travel enthusiasts are dedicated to showcasing the unique beauty and hospitality of Sifnos.
              </p>
              <p>
                With intimate knowledge of the island's villages, beaches, and hidden gems, we've curated a selection of the finest accommodations Sifnos has to offer - from luxury beachfront resorts to charming traditional guesthouses.
              </p>
              <p>
                What began as a small passion project has grown into the most trusted resource for travelers seeking authentic experiences on Sifnos. We pride ourselves on our personal approach, connecting visitors with accommodations that match their preferences and helping them create unforgettable memories on our beloved island.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="bg-gray-50 py-16">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-6 text-center">Our Mission</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                At Hotels Sifnos, our mission is to connect travelers with authentic, quality accommodation experiences that reflect the true spirit of the island. We believe in:
              </p>
              <ul>
                <li><strong>Local Expertise:</strong> Providing insider knowledge that only locals and island devotees can offer.</li>
                <li><strong>Quality Assurance:</strong> Personally vetting each property to ensure it meets our high standards.</li>
                <li><strong>Authentic Experiences:</strong> Highlighting accommodations that offer a genuine taste of Sifnian hospitality.</li>
                <li><strong>Community Support:</strong> Promoting local businesses and contributing to the island's sustainable tourism development.</li>
              </ul>
              <p>
                By bridging the gap between travelers and local accommodation providers, we aim to foster meaningful connections and support the local economy while helping visitors discover the magic of Sifnos.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="py-16">
        <div className="page-container">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-10 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="cycladic-card p-6 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4">
                {/* Team member photo placeholder */}
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-1">Maria Petridou</h3>
              <p className="text-sifnos-turquoise mb-3">Founder & CEO</p>
              <p className="text-gray-600">
                Born and raised on Sifnos, Maria combines local knowledge with years of experience in hospitality management.
              </p>
            </div>
            
            <div className="cycladic-card p-6 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4">
                {/* Team member photo placeholder */}
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-1">Yiannis Apostolou</h3>
              <p className="text-sifnos-turquoise mb-3">Property Relations</p>
              <p className="text-gray-600">
                With 15 years in hotel management across the Cyclades, Yiannis ensures our accommodation partners receive exceptional support.
              </p>
            </div>
            
            <div className="cycladic-card p-6 text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4">
                {/* Team member photo placeholder */}
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-1">Eleni Papadaki</h3>
              <p className="text-sifnos-turquoise mb-3">Customer Experience</p>
              <p className="text-gray-600">
                Dedicated to creating seamless experiences, Eleni ensures every visitor finds their perfect Sifnos accommodation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Work With Us CTA */}
      <div className="bg-sifnos-deep-blue text-white py-16">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-4">Join Our Network</h2>
            <p className="text-lg text-gray-200 mb-8">
              Are you a property owner in Sifnos? Partner with us to reach more travelers and showcase your accommodation to our engaged audience.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-sifnos-deep-blue hover:bg-sifnos-turquoise hover:text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Become a Partner
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
