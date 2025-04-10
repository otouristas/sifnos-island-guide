
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, Utensils, Sun, Anchor, Waves, Umbrella, Ship } from 'lucide-react';

export default function TravelGuidePage() {
  // Sample travel guide categories
  const guideCategories = [
    {
      title: "Getting to Sifnos",
      icon: <Ship size={24} />,
      content: "Sifnos is accessible by ferry from Piraeus port in Athens. During the summer months, there are frequent ferry connections to Sifnos from Athens and other Cycladic islands. The journey from Piraeus takes approximately 2.5 to 5 hours depending on the type of ferry (high-speed or conventional). There is no airport on Sifnos, so sea travel is the only option to reach the island.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Best Time to Visit",
      icon: <Calendar size={24} />,
      content: "The best time to visit Sifnos is from May to October when the weather is warm and ideal for swimming and outdoor activities. July and August are the peak tourist months with higher temperatures and more crowds. For a more peaceful experience with pleasant weather, consider visiting in June or September when the sea is still warm but the crowds have thinned out.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Getting Around",
      icon: <Compass size={24} />,
      content: "The local bus network connects all major villages and beaches on Sifnos. Taxis are available but limited in number. Renting a car, scooter, or ATV is recommended for exploring the island at your own pace. The island also has well-marked hiking trails that connect many of its charming villages and offer spectacular views.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Beaches",
      icon: <Umbrella size={24} />,
      content: "Sifnos boasts a variety of beautiful beaches catering to different preferences. From organized beaches with facilities like Platis Gialos and Kamares to more secluded coves like Vroulidia and Fassolou. Some beaches offer water sports facilities, while others are ideal for quiet relaxation against stunning backdrops.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Cuisine",
      icon: <Utensils size={24} />,
      content: "Sifnos is renowned for its rich culinary tradition and is considered the gastronomic capital of the Cyclades. Don't miss trying local specialties such as chickpea soup (revithada), mastelo (lamb or goat cooked in red wine), and traditional sweets like honey pie (melopita) and almond cookies (amygdalota). The island is also famous for its pottery, used in traditional slow-cooking methods.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Cultural Highlights",
      icon: <Waves size={24} />,
      content: "Sifnos has a rich cultural heritage with numerous blue-domed churches and monasteries scattered across the island. Visit the Archaeological Museum in Kastro to learn about the island's ancient history. Don't miss the annual cultural festivals, particularly during summer months, where you can experience traditional music, dance, and local celebrations.",
      imageUrl: "/placeholder.svg"
    }
  ];
  
  return (
    <>
      <SEO 
        title="Sifnos Island Travel Guide - Essential Information For Visitors" 
        description="Plan your perfect trip to Sifnos with our comprehensive travel guide. Discover the best beaches, villages, restaurants, activities, and local tips for an authentic Cycladic experience."
        keywords={['sifnos travel guide', 'sifnos island guide', 'sifnos attractions', 'sifnos beaches', 'sifnos restaurants', 'things to do in sifnos', 'sifnos greek island']}
        schemaType="TravelAgency"
        canonical="https://hotelssifnos.com/travel-guide"
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-16">
        <div className="page-container">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Sifnos Island Travel Guide
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Your comprehensive guide to exploring the authentic beauty, rich traditions, and hidden gems of Sifnos Island
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#getting-around" className="bg-white text-sifnos-deep-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Getting Around
              </a>
              <a href="#beaches" className="bg-white text-sifnos-deep-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Beaches
              </a>
              <a href="#dining" className="bg-white text-sifnos-deep-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Dining
              </a>
              <a href="#attractions" className="bg-white text-sifnos-deep-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Attractions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="py-16">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-6 text-center">
              Welcome to Sifnos
            </h2>
            <div className="prose prose-lg mx-auto">
              <p>Nestled in the heart of the Cyclades, Sifnos is a treasure trove of authentic Greek experiences waiting to be discovered. With its whitewashed villages, golden beaches, vibrant culinary scene, and rich pottery tradition, this island offers a perfect blend of relaxation, culture, and adventure.</p>
              
              <p>Unlike its more famous neighbors Mykonos and Santorini, Sifnos has maintained its traditional charm and provides visitors with a more authentic Greek island experience. The island's landscape is a captivating mix of terraced hills, olive groves, and dramatic coastlines dotted with enchanting villages that seem to tumble down to the sea.</p>
              
              <p>This travel guide aims to help you navigate the island's many delights, from its pristine beaches and hiking trails to its celebrated restaurants and cultural landmarks. Whether you're planning a family vacation, a romantic getaway, or a solo adventure, Sifnos offers something special for every type of traveler.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Guide Categories */}
      <div className="bg-gray-50 py-16">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-12 text-center">
            Essential Sifnos Travel Information
          </h2>
          
          <div className="space-y-16">
            {guideCategories.map((category, index) => (
              <div 
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8`}
              >
                <div className="w-full md:w-1/2">
                  <div className="cycladic-card h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-sifnos-turquoise/20 rounded-full mr-3">
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-montserrat font-semibold">{category.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-grow">
                      {category.content}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-64">
                  <div className="bg-sifnos-teal/20 h-full rounded-lg overflow-hidden">
                    <img 
                      src={category.imageUrl} 
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Villages Section */}
      <div className="py-16">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-8 text-center">
            Charming Villages of Sifnos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="cycladic-card overflow-hidden">
              <div className="h-48 bg-sifnos-teal/20">
                <img 
                  src="/placeholder.svg"
                  alt="Apollonia, the capital of Sifnos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-montserrat font-semibold mb-2">Apollonia</h3>
                <p className="text-gray-700 mb-4">
                  The capital and main hub of Sifnos, Apollonia is a charming village with narrow alleys, white Cycladic houses, and a vibrant nightlife. Here you'll find many shops, restaurants, and the island's administration.
                </p>
                <div className="flex items-center text-sifnos-deep-blue">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Central Sifnos</span>
                </div>
              </div>
            </div>
            
            <div className="cycladic-card overflow-hidden">
              <div className="h-48 bg-sifnos-teal/20">
                <img 
                  src="/placeholder.svg"
                  alt="Kastro, medieval village in Sifnos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-montserrat font-semibold mb-2">Kastro</h3>
                <p className="text-gray-700 mb-4">
                  A medieval settlement built on top of ancient Sifnos, Kastro features well-preserved Venetian architecture, ancient ruins, and breathtaking views of the Aegean Sea. Don't miss the Archaeological Museum.
                </p>
                <div className="flex items-center text-sifnos-deep-blue">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Eastern Sifnos</span>
                </div>
              </div>
            </div>
            
            <div className="cycladic-card overflow-hidden">
              <div className="h-48 bg-sifnos-teal/20">
                <img 
                  src="/placeholder.svg"
                  alt="Artemonas village in Sifnos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-montserrat font-semibold mb-2">Artemonas</h3>
                <p className="text-gray-700 mb-4">
                  Known for its neoclassical mansions and traditional architecture, Artemonas is one of the most elegant villages on the island. Enjoy walking through its narrow streets and beautiful gardens.
                </p>
                <div className="flex items-center text-sifnos-deep-blue">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Northern Sifnos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seasonal Travel Tips */}
      <div className="bg-gray-50 py-16">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-8 text-center">
            Seasonal Travel Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cycladic-card">
              <h3 className="text-xl font-montserrat font-semibold mb-4 text-center">Summer (June - September)</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Sun size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Book accommodations well in advance as this is the peak season.</span>
                </li>
                <li className="flex items-start">
                  <Sun size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Temperatures range from 25°C to 35°C (77°F to 95°F). Bring lightweight clothing, sun protection, and plenty of swimwear.</span>
                </li>
                <li className="flex items-start">
                  <Sun size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Visit popular beaches early in the morning or late afternoon to avoid crowds.</span>
                </li>
                <li className="flex items-start">
                  <Sun size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Make restaurant reservations, especially in Apollonia and at popular seaside tavernas.</span>
                </li>
              </ul>
            </div>
            
            <div className="cycladic-card">
              <h3 className="text-xl font-montserrat font-semibold mb-4 text-center">Spring & Autumn (April-May, Oct-Nov)</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Waves size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Perfect for hiking and exploring the island's nature as temperatures are mild (18°C to 25°C).</span>
                </li>
                <li className="flex items-start">
                  <Waves size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Less crowded, with better rates on accommodations.</span>
                </li>
                <li className="flex items-start">
                  <Waves size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Spring offers beautiful wildflowers, while autumn provides warmer sea temperatures.</span>
                </li>
                <li className="flex items-start">
                  <Waves size={16} className="text-sifnos-turquoise mr-2 mt-1 flex-shrink-0" />
                  <span>Be prepared for reduced ferry schedules and some closed businesses, especially in late autumn.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-sifnos-deep-blue text-white">
        <div className="page-container text-center">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-6">
            Ready to Experience Sifnos?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Begin your Sifnos adventure by finding the perfect accommodation that suits your needs and preferences.
          </p>
          <Link 
            to="/hotels" 
            className="bg-white text-sifnos-deep-blue px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Browse Sifnos Hotels
          </Link>
        </div>
      </div>
    </>
  );
}
