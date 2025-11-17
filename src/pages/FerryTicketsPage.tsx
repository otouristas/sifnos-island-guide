
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { 
  Calendar, 
  MapPin, 
  Ship, 
  Clock, 
  Star, 
  ArrowRight, 
  Phone, 
  Mail,
  Ticket,
  Building2,
  Gem,
  Home,
  Waves,
  Users,
  Car,
  Compass
} from 'lucide-react';

import FerryScheduleWidget from '@/components/shared/FerryScheduleWidget';

export default function FerryTicketsPage() {
  const [fromPort, setFromPort] = useState('');
  const [toPort, setToPort] = useState('sifnos');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  return (
    <>
      <SEO 
        title="Sifnos Ferry Tickets: Schedules & Booking from Athens"
        description="Book Sifnos ferries from Piraeus, Milos, Serifos, and more. Current 2026 schedules, prices, travel tips. Fast ferries and slow boats explained. Reserve now."
        keywords={[
          'sifnos ferry tickets', 'book ferry sifnos', 'sifnos transport 2026',
          'greece ferry booking', 'cyclades ferry', 'piraeus sifnos ferry',
          'sifnos ferry schedule', 'sifnos hotels ferry package', 'athens sifnos ferry',
          'sifnos ferry prices', 'online ferry booking greece', 'sifnos travel packages'
        ]}
        pageType="ferry-tickets"
        canonical="https://hotelssifnos.com/ferry-tickets"
        imageUrl="/uploads/sifnos-ferry-port.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sifnos-deep-blue mb-6">
            Sifnos Ferry Tickets & Hotel Packages 2026
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Book your ferry to Sifnos with guaranteed best prices. Complete travel packages with premium hotels, 
            car rentals, and exclusive island experiences. Start your perfect Greek island getaway today.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-sifnos-turquoise">15+</div>
              <div className="text-sm text-gray-600">Daily Ferries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sifnos-turquoise">2.5h</div>
              <div className="text-sm text-gray-600">From Piraeus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sifnos-turquoise">24/7</div>
              <div className="text-sm text-gray-600">Booking Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sifnos-turquoise">100%</div>
              <div className="text-sm text-gray-600">Best Prices</div>
            </div>
          </div>
        </div>

        {/* Ferry Booking Form - Enhanced */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-6">
            <Ship className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Book Your Sifnos Ferry Tickets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Port</label>
              <select 
                value={fromPort} 
                onChange={(e) => setFromPort(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select departure</option>
                <option value="piraeus">Piraeus (Athens)</option>
                <option value="lavrio">Lavrio</option>
                <option value="kimolos">Kimolos</option>
                <option value="milos">Milos</option>
                <option value="serifos">Serifos</option>
                <option value="paros">Paros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Port</label>
              <select 
                value={toPort} 
                onChange={(e) => setToPort(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              >
                <option value="sifnos">Sifnos (Kamares)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
              <input 
                type="date" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifnos-turquoise focus:border-sifnos-turquoise"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Date (Optional)</label>
              <input 
                type="date" 
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifnos-turquoise focus:border-sifnos-turquoise"
                min={departureDate}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
              <select 
                value={passengers} 
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifnos-turquoise focus:border-sifnos-turquoise"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="https://www.ferryhopper.com/en/ferries/greece/athens/sifnos?aid=YOUR_AFFILIATE_ID"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
              onClick={() => {
                // Track abandoned booking if user has filled form data
                if (fromPort && toPort && departureDate) {
                  import('@/utils/abandonedBookingTracker').then(({ abandonedBookingTracker }) => {
                    abandonedBookingTracker.startTracking({
                      bookingType: 'ferry',
                      ferryRoute: `${fromPort} - ${toPort}`,
                      checkInDate: departureDate,
                      checkOutDate: returnDate || departureDate,
                      guests: passengers,
                      bookingData: { from: fromPort, to: toPort, date: departureDate, passengers }
                    });
                  });
                }
              }}
            >
              <Ticket className="h-5 w-5" />
              Search & Book Ferry Tickets
            </a>
            <p className="text-sm text-muted-foreground mt-3">
              ✅ Best price guarantee • 🎟️ Instant confirmation • 🔄 Free cancellation available
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Ferryhopper - Greece's #1 ferry booking platform
            </p>
          </div>
        </div>

        {/* Real-Time Ferry Schedule Widget */}
        <div className="mb-12">
          <FerryScheduleWidget />
        </div>

        {/* Ferry Routes & Schedule */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Compass className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Popular Ferry Routes to Sifnos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-sifnos-deep-blue">Piraeus → Sifnos</h3>
                <Ship className="text-sifnos-turquoise" size={24} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: 2.5 - 5 hours</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Daily departures: 3-5 ferries</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span>Distance: 80 nautical miles</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sifnos-turquoise mb-2">From €35</div>
                <div className="text-sm text-gray-600">Economy class</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-sifnos-deep-blue">Lavrio → Sifnos</h3>
                <Ship className="text-sifnos-turquoise" size={24} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: 3 - 4 hours</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Daily departures: 1-2 ferries</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span>Distance: 65 nautical miles</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sifnos-turquoise mb-2">From €32</div>
                <div className="text-sm text-gray-600">Economy class</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-sifnos-deep-blue">Island Hopping</h3>
                <Ship className="text-sifnos-turquoise" size={24} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Milos, Kimolos, Serifos</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Seasonal connections</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span>Perfect for island hopping</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sifnos-turquoise mb-2">From €15</div>
                <div className="text-sm text-gray-600">Inter-island routes</div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Where to Stay in Sifnos Section */}
        <div className="mb-12 bg-gray-50 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Building2 className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Where to Stay in Sifnos - Premium Hotels & Villas</h2>
          </div>
          <p className="text-lg text-gray-700 text-center mb-8 max-w-3xl mx-auto">
            Complete your ferry booking with our exclusive hotel packages. From luxury beachfront resorts to traditional Cycladic villas, 
            we offer the finest accommodations with special ferry + hotel deals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/hotel-types/luxury-hotels" className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sifnos-beige/40 text-sifnos-deep-blue">
                  <Gem className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sifnos-deep-blue mb-2">Luxury Hotels</h3>
                <p className="text-sm text-gray-600 mb-3">Premium resorts with spa, pools & fine dining</p>
                <div className="text-xs text-sifnos-deep-blue font-medium">From €150/night</div>
              </div>
            </Link>
            
            <Link to="/hotel-types/villas" className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sifnos-beige/40 text-sifnos-deep-blue">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sifnos-deep-blue mb-2">Private Villas</h3>
                <p className="text-sm text-gray-600 mb-3">Exclusive properties with sea views & pools</p>
                <div className="text-xs text-sifnos-deep-blue font-medium">From €200/night</div>
              </div>
            </Link>
            
            <Link to="/hotel-types/beach-hotels" className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sifnos-beige/40 text-sifnos-deep-blue">
                  <Waves className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sifnos-deep-blue mb-2">Beach Hotels</h3>
                <p className="text-sm text-gray-600 mb-3">Waterfront locations with beach access</p>
                <div className="text-xs text-sifnos-deep-blue font-medium">From €90/night</div>
              </div>
            </Link>
            
            <Link to="/hotel-types/family-friendly-hotels" className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sifnos-beige/40 text-sifnos-deep-blue">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sifnos-deep-blue mb-2">Family Hotels</h3>
                <p className="text-sm text-gray-600 mb-3">Kid-friendly with pools & activities</p>
                <div className="text-xs text-sifnos-deep-blue font-medium">From €80/night</div>
              </div>
            </Link>
          </div>
          
          <div className="text-center">
            <Link to="/where-to-stay-sifnos" className="inline-flex items-center px-6 py-3 bg-sifnos-beige text-sifnos-deep-blue rounded-lg hover:bg-[#d7cab7] transition-colors font-medium mr-4">
              Complete Where to Stay Guide <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link to="/hotels" className="inline-flex items-center px-6 py-3 border-2 border-sifnos-deep-blue text-sifnos-deep-blue rounded-lg hover:bg-sifnos-deep-blue hover:text-white transition-colors font-medium">
              Browse All Hotels <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* NEW: Rent a Car in Sifnos Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center gap-3 text-sifnos-deep-blue mb-8">
            <Car className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Rent a Car in Sifnos - Complete Island Exploration</h2>
          </div>
          <p className="text-lg text-gray-700 text-center mb-8 max-w-3xl mx-auto">
            Discover every corner of Sifnos with our trusted car rental partner. From scenic coastal drives to hidden village gems, 
            having your own transport unlocks the true beauty of this enchanting Cycladic island.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sifnos-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-7 w-7 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Reach Every Beach</h3>
              <p className="text-sm text-gray-600">Access remote beaches like Chrysopigi, Faros, and hidden coves that buses don't reach</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sifnos-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-7 w-7 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Explore Villages</h3>
              <p className="text-sm text-gray-600">Visit traditional settlements like Exambela, Kato Petali, and mountain villages at your pace</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sifnos-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-sifnos-deep-blue" />
              </div>
              <h3 className="font-semibold text-sifnos-deep-blue mb-2">Ultimate Freedom</h3>
              <p className="text-sm text-gray-600">No bus schedules, no waiting. Explore sunset spots, late-night tavernas, and early morning beaches</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-sifnos-deep-blue to-[#0b1626] rounded-xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Car className="h-5 w-5" />
              <h3 className="text-xl font-bold">Book with Cyclades Rent A Car</h3>
            </div>
            <p className="mb-4 opacity-90">Island's most trusted car rental service • Free delivery to port • Best rates guaranteed</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://cycladesrentacar.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-sifnos-deep-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Book Car Rental Now <ArrowRight size={16} className="ml-2" />
              </a>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="flex items-center">
                  <Phone size={14} className="mr-1" />
                  +30 22840 71234
                </span>
                <span className="flex items-center">
                  <Mail size={14} className="mr-1" />
                  info@cycladesrentacar.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Package Deals */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-sifnos-deep-blue mb-8 text-center">
            💎 Complete Sifnos Travel Packages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-sifnos-turquoise to-blue-500 p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Essential Sifnos</h3>
                <div className="text-3xl font-bold">€189</div>
                <div className="text-sm opacity-90">per person</div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Return ferry tickets</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 3 nights hotel accommodation</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Port transfers included</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Island map & travel guide</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 24/7 support</li>
                </ul>
                <button className="w-full mt-6 px-6 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium">
                  Book Essential Package
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-sifnos-turquoise relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="bg-gradient-to-r from-sifnos-deep-blue to-purple-600 p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Luxury Experience</h3>
                <div className="text-3xl font-bold">€459</div>
                <div className="text-sm opacity-90">per person</div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Premium ferry cabin tickets</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5 nights luxury hotel</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Private port transfers</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Car rental (3 days)</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Welcome dinner included</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Concierge service</li>
                </ul>
                <button className="w-full mt-6 px-6 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium">
                  Book Luxury Package
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Family Adventure</h3>
                <div className="text-3xl font-bold">€279</div>
                <div className="text-sm opacity-90">per person</div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Family ferry tickets</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 4 nights family hotel</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Kids activities included</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Beach equipment rental</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Family travel guide</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Child-friendly support</li>
                </ul>
                <button className="w-full mt-6 px-6 py-3 bg-sifnos-turquoise text-white rounded-lg hover:bg-sifnos-deep-blue transition-colors font-medium">
                  Book Family Package
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Tips & FAQ */}
        <div className="mb-12 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-sifnos-deep-blue mb-8 text-center">
            🎯 Essential Travel Tips for Sifnos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">🚢 Ferry Travel Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span>Book early during summer (June-August) for better prices and seat selection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span>High-speed ferries are faster but more expensive than conventional ones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span>Arrive at port 30-45 minutes before departure time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span>Sea conditions can affect schedules - check weather forecasts</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-sifnos-deep-blue mb-4">🏨 Hotel Booking Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span><Link to="/locations/kamares" className="text-sifnos-turquoise hover:underline">Kamares port area</Link> offers convenience for ferry arrivals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span><Link to="/locations/platis-gialos" className="text-sifnos-turquoise hover:underline">Platis Gialos</Link> is perfect for beach lovers and families</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span><Link to="/locations/apollonia" className="text-sifnos-turquoise hover:underline">Apollonia</Link> offers the best nightlife and dining options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sifnos-turquoise mr-2 mt-1">•</span>
                  <span>Book <Link to="/hotel-types/villas" className="text-sifnos-turquoise hover:underline">private villas</Link> for groups and extended stays</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="text-center bg-sifnos-deep-blue text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Need Help Planning Your Trip?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our local experts are here to help you plan the perfect Sifnos getaway
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/contact" className="px-8 py-3 bg-white text-sifnos-deep-blue rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Contact Our Experts
            </Link>
            <Link to="/touristas-ai" className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-sifnos-deep-blue transition-colors font-medium">
              Get AI Recommendations
            </Link>
          </div>
          <div className="text-sm opacity-75">
            📞 24/7 Support: +30-2284-031370 | 📧 info@hotelssifnos.com
          </div>
        </div>
      </div>
    </>
  );
}
