import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, Utensils, Sun, Anchor, Waves, Umbrella, Ship, Clock, Euro, Luggage, ArrowUp, CheckCircle } from 'lucide-react';
import SchemaGenerator from '@/components/SchemaGenerator';
import { getAllItineraries } from '../data/itineraries';
import { Button } from '@/components/ui/button';

export default function TravelGuidePage() {
  const itineraries = getAllItineraries();
  
  // Table of Contents items
  const tocItems = [
    { id: 'getting-there', label: 'Getting to Sifnos', icon: Ship },
    { id: 'best-time', label: 'Best Time to Visit', icon: Calendar },
    { id: 'getting-around', label: 'Getting Around', icon: Compass },
    { id: 'beaches', label: 'Beaches', icon: Umbrella },
    { id: 'cuisine', label: 'Cuisine', icon: Utensils },
    { id: 'cultural', label: 'Cultural Highlights', icon: Waves },
    { id: 'itineraries', label: 'Sample Itineraries', icon: Clock },
    { id: 'budget', label: 'Budget Breakdown', icon: Euro },
    { id: 'packing', label: 'Packing List', icon: Luggage }
  ];
  
  // Sample travel guide categories with updated image paths
  const guideCategories = [
    {
      title: "Getting to Sifnos",
      icon: <Ship size={24} />,
      content: "Sifnos is accessible by ferry from Piraeus port in Athens. During the summer months, there are frequent ferry connections to Sifnos from Athens and other Cycladic islands. The journey from Piraeus takes approximately 2.5 to 5 hours depending on the type of ferry (high-speed or conventional). There is no airport on Sifnos, so sea travel is the only option to reach the island.",
      imageUrl: "/uploads/beaches/kamares.webp" // Ferry port at Kamares
    },
    {
      title: "Best Time to Visit",
      icon: <Calendar size={24} />,
      content: "The best time to visit Sifnos is from May to October when the weather is warm and ideal for swimming and outdoor activities. July and August are the peak tourist months with higher temperatures and more crowds. For a more peaceful experience with pleasant weather, consider visiting in June or September when the sea is still warm but the crowds have thinned out.",
      imageUrl: "/uploads/beaches/plats-gialos.webp" // Platis Gialos beach
    },
    {
      title: "Getting Around",
      icon: <Compass size={24} />,
      content: "The local bus network connects all major villages and beaches on Sifnos. Taxis are available but limited in number. Renting a car, scooter, or ATV is recommended for exploring the island at your own pace. The island also has well-marked hiking trails that connect many of its charming villages and offer spectacular views.",
      imageUrl: "/uploads/beaches/kastro.webp" // Kastro for scenic paths
    },
    {
      title: "Beaches",
      icon: <Umbrella size={24} />,
      content: "Sifnos boasts a variety of beautiful beaches catering to different preferences. From organized beaches with facilities like Platis Gialos and Kamares to more secluded coves like Vroulidia and Fassolou. Some beaches offer water sports facilities, while others are ideal for quiet relaxation against stunning backdrops.",
      imageUrl: "/uploads/beaches/vathi.webp" // Vathi beach
    },
    {
      title: "Cuisine",
      icon: <Utensils size={24} />,
      content: "Sifnos is renowned for its rich culinary tradition and is considered the gastronomic capital of the Cyclades. Don't miss trying local specialties such as chickpea soup (revithada), mastelo (lamb or goat cooked in red wine), and traditional sweets like honey pie (melopita) and almond cookies (amygdalota). The island is also famous for its pottery, used in traditional slow-cooking methods.",
      imageUrl: "/uploads/beaches/apollonia.webp" // Apollonia village with restaurants
    },
    {
      title: "Cultural Highlights",
      icon: <Waves size={24} />,
      content: "Sifnos has a rich cultural heritage with numerous blue-domed churches and monasteries scattered across the island. Visit the Archaeological Museum in Kastro to learn about the island's ancient history. Don't miss the annual cultural festivals, particularly during summer months, where you can experience traditional music, dance, and local celebrations.",
      imageUrl: "/uploads/beaches/chrysopigi.webp" // Chrysopigi monastery
    }
  ];
  
  return (
    <>
      <SEO 
        title="Complete Sifnos Travel Guide 2026 | Plan Your Trip"
        description="Everything you need for Sifnos: hotels, beaches, restaurants, hiking, pottery, 365 churches, local culture. Your comprehensive island planning resource."
        keywords={[
          'sifnos travel guide 2026', 'sifnos tourism', 'things to do sifnos', 
          'sifnos vacation planning', 'sifnos hidden gems', 'authentic greek island experience',
          'sifnos beaches guide', 'sifnos restaurants', 'sifnos local tips', 
          'best time to visit sifnos', 'cyclades travel guide', 'greece island hopping'
        ]}
        pageType="general"
        schemaType="TouristDestination"
        canonical="https://hotelssifnos.com/travel-guide"
        imageUrl="/uploads/beaches/faros.webp"
      />
      
      {/* Add TouristDestination Schema */}
      <SchemaGenerator 
        pageType="TravelGuide"
        data={{
          name: "Sifnos Island Travel Guide",
          description: "Comprehensive guide to exploring the authentic beauty, rich traditions, and hidden gems of Sifnos Island",
          image: "/uploads/beaches/faros.webp"
        }}
      />
      
      {/* Hero Section - Modern Design */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/uploads/beaches/faros.webp')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sifnos-deep-blue/95 via-sifnos-deep-blue/85 to-sifnos-deep-blue/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(227,215,195,0.15),transparent_70%)]" />
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Sifnos Island
              <span className="block text-sifnos-beige mt-2">Travel Guide 2026</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Your complete guide to exploring authentic beauty, rich traditions, and hidden gems
            </p>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
      
      {/* Table of Contents - Edge to Edge Minimal Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200">
        <div className="overflow-x-auto w-full">
          <nav className="flex items-center gap-0.5 pt-2.5 pb-1.5 px-4 min-w-max">
            {tocItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:text-sifnos-deep-blue hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <Icon size={12} className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Introduction - More breathing room */}
      <div className="py-20">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-8 text-center">
              Welcome to Sifnos
            </h2>
            <div className="prose prose-lg mx-auto space-y-6">
              <p>Nestled in the heart of the Cyclades, Sifnos is a treasure trove of authentic Greek experiences waiting to be discovered. With its whitewashed villages, golden beaches, vibrant culinary scene, and rich pottery tradition, this island offers a perfect blend of relaxation, culture, and adventure.</p>
              
              <p>Unlike its more famous neighbors Mykonos and Santorini, Sifnos has maintained its traditional charm and provides visitors with a more authentic Greek island experience. The island's landscape is a captivating mix of terraced hills, olive groves, and dramatic coastlines dotted with enchanting villages that seem to tumble down to the sea.</p>
              
              <p>This travel guide aims to help you navigate the island's many delights, from its pristine beaches and hiking trails to its celebrated restaurants and cultural landmarks. Whether you're planning a family vacation, a romantic getaway, or a solo adventure, Sifnos offers something special for every type of traveler.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Guide Categories - Better spacing between elements */}
      <div className="bg-gray-50 py-20">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-16 text-center">
            Essential Sifnos Travel Information
          </h2>
          
          <div className="space-y-24">
            {guideCategories.map((category, index) => {
              const categoryId = category.title.toLowerCase().replace(/\s+/g, '-').replace('getting-to-sifnos', 'getting-there').replace('best-time-to-visit', 'best-time').replace('cultural-highlights', 'cultural');
              return (
                <div 
                  key={index}
                  id={categoryId}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center gap-10 scroll-mt-24`}
                >
                  <div className="w-full md:w-1/2">
                    <div className="cycladic-card h-full flex flex-col p-8">
                      <div className="flex items-center mb-6">
                        <div className="p-4 bg-sifnos-turquoise/20 rounded-full mr-4">
                          {category.icon}
                        </div>
                        <h3 className="text-2xl font-montserrat font-semibold">{category.title}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-grow text-lg">
                        {category.content}
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 h-72">
                    <div className="h-full rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={category.imageUrl} 
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Villages Section - Improved card spacing and updated images */}
      <div className="py-20">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-12 text-center">
            Charming Villages of Sifnos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="cycladic-card overflow-hidden h-full">
              <div className="h-56">
                <img 
                  src="/uploads/beaches/apollonia.webp"
                  alt="Apollonia, the capital of Sifnos"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-montserrat font-semibold mb-4">Apollonia</h3>
                <p className="text-gray-700 mb-6">
                  The capital and main hub of Sifnos, Apollonia is a charming village with narrow alleys, white Cycladic houses, and a vibrant nightlife. Here you'll find many shops, restaurants, and the island's administration.
                </p>
                <div className="flex items-center text-sifnos-deep-blue">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">Central Sifnos</span>
                </div>
              </div>
            </div>
            
            <div className="cycladic-card overflow-hidden h-full">
              <div className="h-56">
                <img 
                  src="/uploads/beaches/kastro.webp"
                  alt="Kastro, medieval village in Sifnos"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-montserrat font-semibold mb-4">Kastro</h3>
                <p className="text-gray-700 mb-6">
                  A medieval settlement built on top of ancient Sifnos, Kastro features well-preserved Venetian architecture, ancient ruins, and breathtaking views of the Aegean Sea. Don't miss the Archaeological Museum.
                </p>
                <div className="flex items-center text-sifnos-deep-blue">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">Eastern Sifnos</span>
                </div>
              </div>
            </div>
            
            <div className="cycladic-card overflow-hidden h-full">
              <div className="h-56">
                <img 
                  src="/uploads/beaches/artemonas.webp"
                  alt="Artemonas village in Sifnos"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-montserrat font-semibold mb-4">Artemonas</h3>
                <p className="text-gray-700 mb-6">
                  Known for its neoclassical mansions and traditional architecture, Artemonas is one of the most elegant villages on the island. Enjoy walking through its narrow streets and beautiful gardens.
                </p>
                <div className="flex items-center text-sifnos-deep-blue">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">Northern Sifnos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sample Itineraries Section */}
      <div id="itineraries" className="py-20 bg-white scroll-mt-24">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <Clock className="h-8 w-8 text-sifnos-deep-blue" />
            <h2 className="font-montserrat text-2xl md:text-3xl font-semibold text-center">
              Sample Itineraries for Sifnos
            </h2>
          </div>
          
          <div className="space-y-12">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="cycladic-card p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-montserrat font-semibold text-sifnos-deep-blue mb-2">
                      {itinerary.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{itinerary.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.bestFor.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-sifnos-beige/20 text-sifnos-deep-blue rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sifnos-deep-blue">{itinerary.duration}</div>
                    <div className="text-sm text-gray-600">days</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {itinerary.days.map((day) => (
                    <div key={day.day} className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-sifnos-deep-blue text-white flex items-center justify-center font-bold">
                          {day.day}
                        </span>
                        <h4 className="font-semibold text-sifnos-deep-blue">{day.title}</h4>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {day.activities.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            <span className="font-medium text-sifnos-deep-blue">{activity.time}:</span> {activity.activity}
                            {activity.location && (
                              <span className="text-gray-500 ml-1">({activity.location})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Meals:</p>
                          <div className="text-xs text-gray-600 space-y-1">
                            {day.meals.breakfast && <div>Breakfast: {day.meals.breakfast}</div>}
                            {day.meals.lunch && <div>Lunch: {day.meals.lunch}</div>}
                            {day.meals.dinner && <div>Dinner: {day.meals.dinner}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Estimated cost per person:</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-700 font-medium">Low: €{itinerary.estimatedCost.low}</span>
                        <span className="text-blue-700 font-medium">Mid: €{itinerary.estimatedCost.mid}</span>
                        <span className="text-purple-700 font-medium">High: €{itinerary.estimatedCost.high}</span>
                      </div>
                    </div>
                    <Link to="/hotels">
                      <Button variant="outline" className="border-sifnos-deep-blue text-sifnos-deep-blue hover:bg-sifnos-deep-blue hover:text-white">
                        Find Hotels for This Itinerary
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Budget Breakdown Section */}
      <div id="budget" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <Euro className="h-8 w-8 text-sifnos-deep-blue" />
            <h2 className="font-montserrat text-2xl md:text-3xl font-semibold text-center">
              Budget Breakdown for Sifnos 2026
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Low Budget */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Low Budget (Backpacker)</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accommodation</span>
                  <span className="font-semibold">€30-€60/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food</span>
                  <span className="font-semibold">€25-€40/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport</span>
                  <span className="font-semibold">€5-€15/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities</span>
                  <span className="font-semibold">€10-€20/day</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-green-700">
                  <span>Daily Total:</span>
                  <span>€70-€135</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">For 7 days: €490-€945</p>
              </div>
            </div>
            
            {/* Mid-Range Budget */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-300 relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                Most Popular
              </span>
              <h3 className="text-xl font-semibold text-blue-700 mb-4 mt-2">Mid-Range Budget</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accommodation</span>
                  <span className="font-semibold">€80-€150/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food</span>
                  <span className="font-semibold">€50-€80/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport</span>
                  <span className="font-semibold">€15-€40/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities</span>
                  <span className="font-semibold">€20-€40/day</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-blue-700">
                  <span>Daily Total:</span>
                  <span>€165-€310</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">For 7 days: €1,155-€2,170</p>
              </div>
            </div>
            
            {/* High/Luxury Budget */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">High/Luxury Budget</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accommodation</span>
                  <span className="font-semibold">€200-€500+/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food</span>
                  <span className="font-semibold">€100-€200/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport</span>
                  <span className="font-semibold">€40-€80/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities</span>
                  <span className="font-semibold">€50-€150/day</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-purple-700">
                  <span>Daily Total:</span>
                  <span>€390-€930+</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">For 7 days: €2,730-€6,510+</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-600 text-sm max-w-3xl mx-auto">
            <p>Note: Prices are per person and include ferry tickets (€70-€140 round trip). Accommodation prices vary significantly by season, location, and type. Book early for best rates.</p>
          </div>
        </div>
      </div>
      
      {/* Packing List Section */}
      <div id="packing" className="py-20 bg-white scroll-mt-24">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <Luggage className="h-8 w-8 text-sifnos-deep-blue" />
            <h2 className="font-montserrat text-2xl md:text-3xl font-semibold text-center">
              Packing List for Sifnos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Essentials */}
            <div className="cycladic-card p-6">
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">Essentials</h3>
              <ul className="space-y-2">
                {[
                  'Valid passport/ID',
                  'Travel insurance documents',
                  'Credit/debit cards',
                  'Cash (Euros)',
                  'Phone and charger',
                  'Power adapter (Type C/F)',
                  'Camera or smartphone',
                  'Copies of important documents'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Clothing */}
            <div className="cycladic-card p-6">
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">Clothing</h3>
              <ul className="space-y-2">
                {[
                  'Lightweight, breathable fabrics',
                  'Swimwear (multiple sets)',
                  'Beach cover-ups',
                  'Comfortable walking shoes',
                  'Sandals/flip-flops',
                  'Sun hat and sunglasses',
                  'Light jacket for evenings',
                  'Evening wear (optional)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Beach & Activities */}
            <div className="cycladic-card p-6">
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">Beach & Activities</h3>
              <ul className="space-y-2">
                {[
                  'Beach towel',
                  'Reef-safe sunscreen (SPF 30+)',
                  'After-sun lotion',
                  'Beach bag',
                  'Water bottle',
                  'Snorkel gear (optional)',
                  'Hiking shoes (if planning trails)',
                  'Beach umbrella (optional)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Seasonal Recommendations */}
            <div className="cycladic-card p-6">
              <h3 className="text-lg font-semibold text-sifnos-deep-blue mb-3">Summer (June-September)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Extra sunscreen and sun protection</li>
                <li>• Light, loose-fitting clothing</li>
                <li>• Multiple swimsuits</li>
                <li>• Cooling accessories (fan, cooling towel)</li>
              </ul>
            </div>
            
            {/* Spring/Autumn */}
            <div className="cycladic-card p-6">
              <h3 className="text-lg font-semibold text-sifnos-deep-blue mb-3">Spring/Autumn (April-May, Oct-Nov)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Warmer layers for evenings</li>
                <li>• Light rain jacket</li>
                <li>• Closed-toe shoes</li>
                <li>• Long pants for hiking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seasonal Travel Tips - Better list spacing */}
      <div className="bg-gray-50 py-20">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-12 text-center">
            Seasonal Travel Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="cycladic-card p-8">
              <h3 className="text-xl font-montserrat font-semibold mb-6 text-center">Summer (June - September)</h3>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <Sun size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Book accommodations well in advance as this is the peak season.</span>
                </li>
                <li className="flex items-start">
                  <Sun size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Temperatures range from 25°C to 35°C (77°F to 95°F). Bring lightweight clothing, sun protection, and plenty of swimwear.</span>
                </li>
                <li className="flex items-start">
                  <Sun size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Visit popular beaches early in the morning or late afternoon to avoid crowds.</span>
                </li>
                <li className="flex items-start">
                  <Sun size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Make restaurant reservations, especially in Apollonia and at popular seaside tavernas.</span>
                </li>
              </ul>
            </div>
            
            <div className="cycladic-card p-8">
              <h3 className="text-xl font-montserrat font-semibold mb-6 text-center">Spring & Autumn (April-May, Oct-Nov)</h3>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <Waves size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Perfect for hiking and exploring the island's nature as temperatures are mild (18°C to 25°C).</span>
                </li>
                <li className="flex items-start">
                  <Waves size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Less crowded, with better rates on accommodations.</span>
                </li>
                <li className="flex items-start">
                  <Waves size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Spring offers beautiful wildflowers, while autumn provides warmer sea temperatures.</span>
                </li>
                <li className="flex items-start">
                  <Waves size={18} className="text-sifnos-turquoise mr-3 mt-1 flex-shrink-0" />
                  <span>Be prepared for reduced ferry schedules and some closed businesses, especially in late autumn.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section for Featured Snippets */}
      <div id="faq" className="py-20 bg-white scroll-mt-24">
        <div className="page-container">
          <h2 className="font-montserrat text-2xl md:text-3xl font-semibold mb-12 text-center">
            Frequently Asked Questions About Sifnos
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <details className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-sifnos-deep-blue/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg list-none">
                <h3>What is the best time to visit Sifnos?</h3>
                <span className="text-2xl text-sifnos-deep-blue group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed pl-2">
                The best time to visit Sifnos is from May to October when the weather is warm and ideal for swimming. July and August are peak months with higher temperatures and crowds. For a more peaceful experience with pleasant weather, consider visiting in June or September when the sea is still warm but the crowds have thinned out.
              </p>
            </details>
            <details className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-sifnos-deep-blue/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg list-none">
                <h3>How do I get around Sifnos?</h3>
                <span className="text-2xl text-sifnos-deep-blue group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed pl-2">
                The local bus network connects all major villages and beaches on Sifnos. Taxis are available but limited in number. Renting a car, scooter, or ATV is recommended for exploring the island at your own pace. The island also has well-marked hiking trails that connect many of its charming villages and offer spectacular views.
              </p>
            </details>
            <details className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-sifnos-deep-blue/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg list-none">
                <h3>What are the best beaches in Sifnos?</h3>
                <span className="text-2xl text-sifnos-deep-blue group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed pl-2">
                Sifnos boasts a variety of beautiful beaches catering to different preferences. From organized beaches with facilities like Platis Gialos and Kamares to more secluded coves like Vroulidia and Fassolou. Some beaches offer water sports facilities, while others are ideal for quiet relaxation against stunning backdrops.
              </p>
            </details>
            <details className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-sifnos-deep-blue/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg list-none">
                <h3>What is Sifnos cuisine known for?</h3>
                <span className="text-2xl text-sifnos-deep-blue group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-gray-700 leading-relaxed pl-2">
                Sifnos is renowned for its rich culinary tradition and is considered the gastronomic capital of the Cyclades. Don't miss trying local specialties such as chickpea soup (revithada), mastelo (lamb or goat cooked in red wine), and traditional sweets like honey pie (melopita) and almond cookies (amygdalota). The island is also famous for its pottery, used in traditional slow-cooking methods.
              </p>
            </details>
          </div>
        </div>
      </div>
      
      {/* FAQ Schema for Travel Guide */}
      <SchemaGenerator
        pageType="FAQ"
        data={{
          faq: [
            {
              question: 'What is the best time to visit Sifnos?',
              answer: 'The best time to visit Sifnos is from May to October when the weather is warm and ideal for swimming. July and August are peak months with higher temperatures and crowds. For a more peaceful experience with pleasant weather, consider visiting in June or September when the sea is still warm but the crowds have thinned out.'
            },
            {
              question: 'How do I get around Sifnos?',
              answer: 'The local bus network connects all major villages and beaches on Sifnos. Taxis are available but limited in number. Renting a car, scooter, or ATV is recommended for exploring the island at your own pace. The island also has well-marked hiking trails that connect many of its charming villages and offer spectacular views.'
            },
            {
              question: 'What are the best beaches in Sifnos?',
              answer: 'Sifnos boasts a variety of beautiful beaches catering to different preferences. From organized beaches with facilities like Platis Gialos and Kamares to more secluded coves like Vroulidia and Fassolou. Some beaches offer water sports facilities, while others are ideal for quiet relaxation against stunning backdrops.'
            },
            {
              question: 'What is Sifnos cuisine known for?',
              answer: 'Sifnos is renowned for its rich culinary tradition and is considered the gastronomic capital of the Cyclades. Don\'t miss trying local specialties such as chickpea soup (revithada), mastelo (lamb or goat cooked in red wine), and traditional sweets like honey pie (melopita) and almond cookies (amygdalota). The island is also famous for its pottery, used in traditional slow-cooking methods.'
            }
          ]
        }}
      />
      
      {/* Back to Top Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="icon"
          className="rounded-full h-12 w-12 bg-sifnos-deep-blue text-white shadow-lg hover:bg-sifnos-deep-blue/90 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </Button>
      </div>

      {/* Call to Action - Modern Design */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/uploads/beaches/vathi.webp')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sifnos-deep-blue/95 via-sifnos-deep-blue/90 to-[#0b1626]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(227,215,195,0.1),transparent_60%)]" />
        
        <div className="relative z-10 page-container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6">
              <span className="text-sm font-semibold tracking-wider uppercase">Start Your Journey</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Experience
              <span className="block text-sifnos-beige mt-2">Sifnos?</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find your perfect stay and start planning an unforgettable Greek island adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/hotels"
                className="group inline-flex items-center gap-2 bg-sifnos-beige text-sifnos-deep-blue px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[0_20px_60px_rgba(227,215,195,0.4)] transition-all duration-300 hover:-translate-y-1"
              >
                <span>Browse Sifnos Hotels</span>
                <ArrowUp size={20} className="rotate-90 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/touristas-ai"
                className="inline-flex items-center gap-2 border-2 border-white/90 text-white bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-sifnos-deep-blue transition-all duration-300 hover:-translate-y-1"
              >
                <span>Ask Touristas AI</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
