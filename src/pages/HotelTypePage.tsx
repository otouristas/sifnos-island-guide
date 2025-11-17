
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHotelTypeBySlug, HotelType, hotelTypes } from '../data/hotelTypes';
import { supabase } from '@/integrations/supabase/client';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import HotelCard from '../components/HotelCard';
import { getHotelTypeIcon } from '../components/icons/HotelTypeIcons';
import { getProsConsBySlug } from '../data/hotelTypeProsCons';
import { blogPosts } from '../data/blogPosts';
import SchemaGenerator from '../components/SchemaGenerator';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

export default function HotelTypePage() {
  const { slug } = useParams<{ slug: string }>();
  const [hotelType, setHotelType] = useState<HotelType | null>(null);
  const [relatedHotelTypes, setRelatedHotelTypes] = useState<HotelType[]>([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!slug) return;
    
    const typeData = getHotelTypeBySlug(slug);
    if (!typeData) {
      navigate('/not-found');
      return;
    }
    
    setHotelType(typeData);
    
    // Find related hotel types (excluding current one)
    const related = hotelTypes
      .filter(type => type.slug !== slug)
      .sort(() => 0.5 - Math.random()) // Randomly sort
      .slice(0, 3); // Get 3 related types
    
    setRelatedHotelTypes(related);
    
    const fetchHotels = async () => {
      try {
        let query;
        
        // Special handling for villas page - specifically fetch Filadaki Villas and Villa Olivia Clara
        if (slug === 'villas') {
          query = supabase
            .from('hotels')
            .select(`
              *,
              hotel_amenities(amenity),
              hotel_photos(id, photo_url, is_main_photo)
            `)
            .or('name.ilike.%Filadaki%,name.ilike.%Villa Olivia Clara%')
            .limit(9);
        } else {
          // Standard filtering for other hotel types
          query = supabase
            .from('hotels')
            .select(`
              *,
              hotel_amenities(amenity),
              hotel_photos(id, photo_url, is_main_photo)
            `)
            .contains('hotel_types', [slug])
            .limit(9);
        }
        
        const { data, error } = await query;
            
        if (error) throw error;
        setHotels(data || []);
        console.log(`Found ${data?.length || 0} hotels for hotel type: ${slug}`);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, [slug, navigate]);
  
  if (!hotelType) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // SEO Plan optimized titles and descriptions
  const getSeoMeta = () => {
    const metaMap: Record<string, { title: string; description: string }> = {
      'boutique-hotels': {
        title: '12 Best Boutique Hotels in Sifnos | Curated by Local Experts',
        description: "Discover Sifnos' most charming boutique hotels with authentic Cycladic design. Verina Terra, traditional guesthouses, and hidden gems locals recommend."
      },
      'villas': {
        title: 'Sifnos Villas with Private Pools | Rental Homes 2026',
        description: 'Rent an entire villa in Sifnos: private pools, sea views, full kitchens. Perfect for families & groups. From budget to luxury. Check availability now.'
      },
      'luxury-hotels': {
        title: 'Luxury Hotels Sifnos: Infinity Pools & Caldera Views',
        description: 'Indulge in Sifnos luxury: private infinity pools, sunset terraces, gourmet dining. Top-rated 5-star properties with exclusive amenities. View collection.'
      },
      'beach-hotels': {
        title: 'Beachfront Hotels Sifnos | Steps from the Best Beaches',
        description: 'Wake up to Aegean waves at Sifnos\' best beachfront hotels. Platis Gialos, Kamares, Vathi locations. Direct beach access, watersports, sunset views.'
      },
      'family-friendly-hotels': {
        title: 'Family Hotels Sifnos: Kids Clubs, Pools & Beach Access',
        description: 'Safe, family-friendly Sifnos hotels with shallow beaches, children\'s pools, connecting rooms. Activities for kids + relaxation for parents. Book worry-free.'
      },
      'traditional-hotels': {
        title: 'Traditional Sifnos Guesthouses | Authentic Cycladic Stays',
        description: 'Stay in restored Sifnos guesthouses with original architecture, local hospitality, village charm. Experience authentic Greek island life. Browse properties.'
      },
      'budget-hotels': {
        title: 'Budget Hotels Sifnos | Affordable Accommodation 2026',
        description: 'Find affordable Sifnos hotels and guesthouses without compromising on quality. Clean rooms, great locations, excellent value. Perfect for budget-conscious travelers.'
      }
    };
    
    return metaMap[slug || ''] || {
      title: `${hotelType.title} in Sifnos - Best Places to Stay`,
      description: `Discover ${hotelType.title.toLowerCase()} in Sifnos - hand-selected accommodations offering ${hotelType.shortDescription.toLowerCase()}. Compare amenities, read verified guest reviews, and secure the best rates with our price-match guarantee.`
    };
  };
  
  const seoMeta = getSeoMeta();
  const pageTitle = seoMeta.title;
  const seoDescription = seoMeta.description;
  
  // Use the appropriate schema type for villas
  const schemaType = slug === 'villas' ? 'Villa' : 'Hotel';
  
  // Get pros/cons for this hotel type
  const prosCons = slug ? getProsConsBySlug(slug) : null;
  
  // Get FAQ data for this hotel type
  const getFAQ = () => {
    if (!slug) return [];
    
    const faqs: Record<string, Array<{ question: string; answer: string }>> = {
      'luxury-hotels': [
        {
          question: 'Who should book luxury hotels in Sifnos?',
          answer: 'Luxury hotels are perfect for couples seeking a romantic getaway, honeymooners, travelers celebrating special occasions, and those who value premium amenities, exceptional service, and exclusive experiences. They\'re ideal if you want spa facilities, fine dining, and concierge services.'
        },
        {
          question: 'What\'s the typical price range for luxury hotels?',
          answer: 'Luxury hotels in Sifnos typically range from €150-€500+ per night during peak season (July-August), with prices dropping to €100-€300 in shoulder seasons (May-June, September-October). Prices vary based on location, amenities, and room type.'
        },
        {
          question: 'Best areas for luxury hotels in Sifnos?',
          answer: 'Platis Gialos offers beachfront luxury resorts, Kamares has upscale port-side properties, and Apollonia features boutique luxury hotels. For ultimate privacy, consider luxury villas in secluded locations with private pools.'
        }
      ],
      'villas': [
        {
          question: 'Who should book villas in Sifnos?',
          answer: 'Villas are perfect for families, groups of friends, couples seeking privacy, and travelers planning extended stays. They\'re ideal if you want complete independence, private pools, kitchen facilities, and more space than a hotel room.'
        },
        {
          question: 'What\'s the typical price range for villas?',
          answer: 'Villa prices range from €250-€1,200+ per night depending on size, location, and amenities. Smaller 2-bedroom villas start around €250-€400, while large 4-6 bedroom villas with private pools can cost €600-€1,200+ per night.'
        },
        {
          question: 'Best areas for villas in Sifnos?',
          answer: 'Platis Gialos and Vathi offer beachfront villas, while areas near Apollonia and Kastro provide hilltop villas with stunning views. For complete seclusion, consider villas in Exambela, Kato Petali, or other traditional villages.'
        }
      ],
      'beach-hotels': [
        {
          question: 'Who should book beach hotels in Sifnos?',
          answer: 'Beach hotels are perfect for beach lovers, families with children, water sports enthusiasts, and travelers who want direct beach access. They\'re ideal if you plan to spend most of your time by the sea.'
        },
        {
          question: 'What\'s the typical price range for beach hotels?',
          answer: 'Beach hotels range from €90-€300 per night during peak season, with prices typically €60-€200 in shoulder seasons. Beachfront properties command higher prices, while those a short walk from the beach offer better value.'
        },
        {
          question: 'Best areas for beach hotels in Sifnos?',
          answer: 'Platis Gialos has the best organized beach with numerous beachfront hotels. Kamares offers port-side beach hotels with easy ferry access. Vathi provides a quieter beachfront experience in a sheltered bay.'
        }
      ],
      'boutique-hotels': [
        {
          question: 'Who should book boutique hotels in Sifnos?',
          answer: 'Boutique hotels suit travelers seeking unique experiences, design enthusiasts, couples wanting intimate settings, and those who appreciate personalized service and local character over large chain amenities.'
        },
        {
          question: 'What\'s the typical price range for boutique hotels?',
          answer: 'Boutique hotels typically range from €100-€250 per night during peak season, with prices around €70-€180 in shoulder seasons. Prices reflect the unique design, personalized service, and prime locations.'
        },
        {
          question: 'Best areas for boutique hotels in Sifnos?',
          answer: 'Apollonia has the highest concentration of boutique hotels, especially along Steno street. Kastro offers historic boutique properties, while Artemonas features neoclassical boutique accommodations.'
        }
      ],
      'family-friendly-hotels': [
        {
          question: 'Who should book family-friendly hotels in Sifnos?',
          answer: 'Family-friendly hotels are designed for families with children of all ages. They offer family rooms, kid-safe facilities, pools, and convenient locations. Perfect for parents who want peace of mind and child-appropriate amenities.'
        },
        {
          question: 'What\'s the typical price range for family hotels?',
          answer: 'Family hotels range from €80-€200 per night for family rooms during peak season, with prices around €60-€150 in shoulder seasons. Many offer family packages and discounts for children.'
        },
        {
          question: 'Best areas for family hotels in Sifnos?',
          answer: 'Platis Gialos is the top choice with its safe, shallow beach and family-oriented atmosphere. Kamares offers convenience and beach access. Apollonia provides central location with easy access to restaurants and activities.'
        }
      ],
      'traditional-hotels': [
        {
          question: 'Who should book traditional hotels in Sifnos?',
          answer: 'Traditional hotels suit travelers seeking authentic Cycladic experiences, budget-conscious visitors, culture enthusiasts, and those who want to connect with local hospitality and traditions.'
        },
        {
          question: 'What\'s the typical price range for traditional hotels?',
          answer: 'Traditional hotels offer the best value, typically €50-€120 per night during peak season, and €40-€90 in shoulder seasons. They provide authentic experiences at reasonable prices.'
        },
        {
          question: 'Best areas for traditional hotels in Sifnos?',
          answer: 'Kastro and Artemonas feature the most traditional architecture. Apollonia offers traditional guesthouses in the capital. Smaller villages like Exambela and Kato Petali have authentic traditional accommodations.'
        }
      ],
      'budget-hotels': [
        {
          question: 'Who should book budget hotels in Sifnos?',
          answer: 'Budget hotels are perfect for backpackers, solo travelers, students, and anyone seeking affordable accommodations without sacrificing essential amenities. Great for travelers who prioritize experiences over luxury.'
        },
        {
          question: 'What\'s the typical price range for budget hotels?',
          answer: 'Budget hotels range from €40-€80 per night during peak season, with prices as low as €30-€60 in shoulder seasons. They offer excellent value for basic, clean accommodations.'
        },
        {
          question: 'Best areas for budget hotels in Sifnos?',
          answer: 'Kamares and Apollonia have the most budget options due to higher competition. Look for rooms and small guesthouses rather than full hotels. Booking early and traveling in shoulder season helps secure the best rates.'
        }
      ]
    };
    
    return faqs[slug] || [];
  };
  
  const faqData = getFAQ();
  
  // Get related blog posts by matching categories
  const getRelatedBlogPosts = () => {
    if (!slug) return [];
    
    // Map hotel types to blog categories
    const categoryMap: Record<string, string[]> = {
      'luxury-hotels': ['Luxury', 'Hotels', 'Accommodation'],
      'villas': ['Villas', 'Accommodation', 'Luxury'],
      'beach-hotels': ['Beaches', 'Hotels', 'Accommodation'],
      'boutique-hotels': ['Hotels', 'Accommodation', 'Culture'],
      'family-friendly-hotels': ['Family Travel', 'Hotels', 'Accommodation'],
      'traditional-hotels': ['Culture', 'Hotels', 'Accommodation'],
      'budget-hotels': ['Budget Travel', 'Hotels', 'Accommodation']
    };
    
    const relevantCategories = categoryMap[slug] || ['Hotels', 'Accommodation'];
    
    // Find posts that match any of the relevant categories
    const related = blogPosts.filter(post =>
      post.categories.some(cat =>
        relevantCategories.some(relCat =>
          cat.toLowerCase().includes(relCat.toLowerCase()) ||
          relCat.toLowerCase().includes(cat.toLowerCase())
        )
      )
    ).slice(0, 3);
    
    return related;
  };
  
  const relatedBlogPosts = getRelatedBlogPosts();
  
  return (
    <>
      <SEO 
        title={pageTitle}
        description={seoDescription}
        keywords={hotelType.keywords}
        schemaType={schemaType}
        canonical={`https://hotelssifnos.com/hotel-types/${slug}`}
        imageUrl={hotelType.imageUrl}
      />
      
      {/* FAQ Schema Markup */}
      {faqData.length > 0 && (
        <SchemaGenerator
          pageType="FAQ"
          data={{
            faq: faqData
          }}
        />
      )}
      
      {/* ItemList Schema for Hotel Type */}
      {hotels.length > 0 && (
        <SchemaGenerator
          pageType="HotelListing"
          data={{
            hotels: hotels.map((hotel, index) => ({
              name: hotel.name,
              url: `https://hotelssifnos.com/hotels/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`,
              position: index + 1
            }))
          }}
        />
      )}
      
      <div className="container mx-auto px-4">
        <Breadcrumbs 
          items={[
            { label: 'Hotels', href: '/hotels' },
            { label: 'Hotel Types', href: '/hotel-types' }
          ]}
          currentPage={hotelType.title}
        />
        
        {/* Hero Section with SVG Icon */}
        <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-sifnos-deep-blue to-sifnos-turquoise"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 text-white opacity-20">
              {slug && getHotelTypeIcon(slug)}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black to-transparent">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {slug === 'villas' ? 'Best Villas in Sifnos 2026' : `${hotelType.title} in Sifnos Island`}
            </h1>
          </div>
        </div>
        
        {/* Introduction - Updated spacing and padding */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg space-y-6">
            <p className="lead text-xl text-gray-700 font-medium mb-6">{hotelType.shortDescription}</p>
            <p className="text-gray-600">{hotelType.description}</p>
          </div>
        </div>
        
        {/* Pros & Cons Section */}
        {prosCons && (
          <section className="my-12 bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
              Pros & Cons of {hotelType.title} in Sifnos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-sifnos-deep-blue">Advantages</h3>
                </div>
                <ul className="space-y-2">
                  {prosCons.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-sifnos-deep-blue">Considerations</h3>
                </div>
                <ul className="space-y-2">
                  {prosCons.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
        
        {/* FAQ Section */}
        {faqData.length > 0 && (
          <section className="my-12 bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-6 w-6 text-sifnos-deep-blue" />
              <h2 className="text-2xl font-bold text-sifnos-deep-blue">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white p-5 rounded-lg border border-gray-200 hover:border-sifnos-deep-blue/30 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-sifnos-deep-blue text-lg list-none">
                    <span>{faq.question}</span>
                    <span className="text-2xl text-sifnos-deep-blue group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed pl-2">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
        
        {/* Hotels Section */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
            Top {hotelType.title} in Sifnos Island
          </h2>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
            </div>
          )}
          
          {/* Hotels Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.length > 0 ? (
                hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} showLogo={true} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <h3 className="font-medium text-xl text-gray-700">No properties found in this category</h3>
                  <p className="mt-2 text-gray-600">Check back soon as we add more {hotelType.title.toLowerCase()} to our collection.</p>
                </div>
              )}
            </div>
          )}
          {slug === 'villas' && !loading && hotels.length > 0 && (
            <div className="mt-10 max-w-2xl mx-auto text-center">
              <p className="text-sm text-gray-600 mb-4">
                Not sure which villa fits your group and budget?
              </p>
              <Link 
                to="/touristas-ai?vibe=villa-luxury"
                className="inline-block"
              >
                <button
                  className="px-6 py-3 rounded-full bg-sifnos-deep-blue text-white text-sm font-semibold hover:bg-sifnos-deep-blue/90 shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Let Touristas AI pick the perfect villa for you
                </button>
              </Link>
            </div>
          )}
        </section>
        
        {/* Related Hotel Types Section */}
        <section className="my-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-4">
            Explore Other Accommodation Types in Sifnos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {relatedHotelTypes.map((type) => (
              <Link 
                key={type.slug} 
                to={`/hotel-types/${type.slug}`}
                className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 text-sifnos-turquoise mr-4">
                  {getHotelTypeIcon(type.slug)}
                </div>
                <div>
                  <h3 className="font-semibold text-sifnos-deep-blue">{type.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{type.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Related Blog Posts Section */}
        {relatedBlogPosts.length > 0 && (
          <section className="my-12 bg-gradient-to-br from-sifnos-beige/10 to-sifnos-deep-blue/5 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-6">
              Related Articles About {hotelType.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sifnos-deep-blue mb-2 group-hover:text-sifnos-beige transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-sifnos-deep-blue font-medium">
                      <span>Read more</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {/* Why Choose Section */}
        <section className="my-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sifnos-deep-blue mb-4">
            Why Choose {hotelType.title} in Sifnos
          </h2>
          <div className="prose max-w-none">
            <p>
              Sifnos offers some of the most exceptional {hotelType.title.toLowerCase()} in the Cyclades, 
              combining the island's natural beauty, culture, and hospitality with outstanding accommodations.
            </p>
            <p>
              When selecting your perfect {hotelType.title.toLowerCase()} in Sifnos, consider factors like 
              location, amenities, and your specific preferences to ensure a memorable stay on this 
              beautiful Greek island.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
