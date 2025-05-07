
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface HotelFAQsProps {
  hotelName: string;
}

export default function HotelFAQs({ hotelName }: HotelFAQsProps) {
  // Determine which FAQ set to use based on hotel name
  const getFAQsByHotelName = (name: string) => {
    if (/Filladaki/i.test(name)) {
      return [
        {
          question: "Where is Filladaki Villas located?",
          answer: "In Kamares, Sifnos – just 550 meters from the beach, overlooking the Aegean Sea."
        },
        {
          question: "What types of villas are available?",
          answer: "• Gregos: 65m², 4 guests\n• Levantes: 70m², 4 guests\n• Ostria: 100m², 5 guests\n• Maistros: 50m², 2 guests"
        },
        {
          question: "Is there a swimming pool?",
          answer: "Yes, with a bar and panoramic sea view."
        },
        {
          question: "Are the villas family-friendly?",
          answer: "Absolutely. Spacious layouts, private verandas, and full amenities make them ideal for families or groups."
        },
        {
          question: "What amenities are included?",
          answer: "Full kitchens, washing machines, dishwashers, smart TVs, free Wi-Fi, private parking, and sea-view balconies."
        },
        {
          question: "Is breakfast included?",
          answer: "Breakfast items are provided upon arrival."
        },
        {
          question: "Are pets allowed?",
          answer: "No, pets are not permitted."
        },
      ];
    } else if (/Morpheas/i.test(name)) {
      return [
        {
          question: "How close is it to the beach?",
          answer: "Just 80 meters from Kamares Beach."
        },
        {
          question: "What room types are available?",
          answer: "• Studio (2 guests)\n• Double Room\n• Triple Room\n• Apartment for 4\n• Apartment for 5"
        },
        {
          question: "Do rooms have kitchenettes?",
          answer: "Studios and apartments do. Double and triple rooms include light refreshment facilities."
        },
        {
          question: "Is air conditioning available?",
          answer: "Yes, in all rooms."
        },
        {
          question: "Is Wi-Fi provided?",
          answer: "Yes, complimentary Wi-Fi is available in all areas."
        },
        {
          question: "Is there private parking?",
          answer: "Free public parking is available nearby."
        },
        {
          question: "Do rooms have private bathrooms?",
          answer: "Yes, all rooms include private bathrooms with shower and toiletries."
        },
        {
          question: "Are pets allowed?",
          answer: "Not specified—contact property directly."
        },
      ];
    } else if (/Villa Olivia Clara/i.test(name)) {
      return [
        {
          question: "Where is the villa located?",
          answer: "In Platis Gialos, Sifnos – 7 minutes' walk from the beach."
        },
        {
          question: "How many guests can it accommodate?",
          answer: "Up to 8 guests, with 4 bedrooms and 4.5 bathrooms."
        },
        {
          question: "What amenities are included?",
          answer: "• Private 12m x 5m pool\n• Garden, terraces, BBQ\n• Fully equipped kitchen\n• Smart TV, books, games\n• Washing machine, baby crib\n• High-speed Wi-Fi"
        },
        {
          question: "Are extra services available?",
          answer: "Yes – private chef, childcare, boat tours, transfers, and event hosting (on request)."
        },
        {
          question: "Is parking provided?",
          answer: "Yes, for up to 5 cars."
        },
        {
          question: "Is there housekeeping?",
          answer: "Yes, twice a week with linen and towel changes."
        },
      ];
    } else if (/ALK HOTEL/i.test(name)) {
      return [
        {
          question: "Where is ALK HOTEL™ located?",
          answer: "In Agia Marina – Kamares, Sifnos, just 150 meters from Agia Marina Beach."
        },
        {
          question: "What types of rooms are available?",
          answer: "• Comfort Double\n• Comfort Triple\n• Superior Sea View\n• Superior Plus (1–3 guests)"
        },
        {
          question: "What services are offered?",
          answer: "• Concierge & travel desk\n• Daily housekeeping\n• Massage services (on request)\n• Car/bike/boat rental\n• Front desk (16 hours)\n• Wake-up calls & welcome drink"
        },
        {
          question: "Are there dining options?",
          answer: "Yes – breakfast buffet, early breakfast, and a 24h self-service bar with sunset views."
        },
        {
          question: "What amenities are included?",
          answer: "A/C, Smart TVs, minibars, safety deposit boxes, deluxe bath items, beach towels, and free Wi-Fi."
        },
        {
          question: "Is the hotel child-friendly?",
          answer: "Yes, for children over 9 years old."
        },
        {
          question: "What is the cancellation policy?",
          answer: "• Cancel ≥30 days: Free\n• Cancel <30 days: 50% charge\n• No-show: 100% charge\n• Prepayment: 50% required 30 days prior"
        },
      ];
    } else if (/Meropi/i.test(name)) {
      return [
        {
          question: "Where is Meropi Rooms located?",
          answer: "In Kamares, Sifnos, only 100 meters from the beach and steps from the port and local shops."
        },
        {
          question: "What room types are offered?",
          answer: "• Double Room\n• Triple Room\n• Studio with Sea View"
        },
        {
          question: "Do rooms have private balconies?",
          answer: "Yes, all rooms include a private balcony – many with sea views."
        },
        {
          question: "Is there air conditioning?",
          answer: "Yes, in every room."
        },
        {
          question: "Is Wi-Fi available?",
          answer: "Yes, free Wi-Fi in all areas."
        },
        {
          question: "Are there private bathrooms?",
          answer: "Yes, all rooms feature private bathrooms with shower, hairdryer, and toiletries."
        },
        {
          question: "Do rooms include kitchens?",
          answer: "Studios include a small kitchen. All rooms have a kettle and fridge."
        },
        {
          question: "Is parking available?",
          answer: "Yes, free public parking nearby."
        },
        {
          question: "Is daily cleaning provided?",
          answer: "Yes, with excellent reviews for cleanliness."
        },
        {
          question: "Are pets allowed?",
          answer: "Not mentioned – contact the property to confirm."
        },
        {
          question: "Is breakfast available?",
          answer: "No formal breakfast is provided, but many cafes are nearby."
        },
      ];
    }
    
    // Default FAQs if hotel name doesn't match any specific set
    return [
      {
        question: "What time is check-in and check-out?",
        answer: "Check-in is typically at 14:00 and check-out is at 12:00, but this may vary. We recommend confirming directly with the property."
      },
      {
        question: "Is breakfast included?",
        answer: "Breakfast options vary by property. Please check the property details or contact them directly."
      },
      {
        question: "Is there free Wi-Fi?",
        answer: "Most properties in Sifnos offer complimentary Wi-Fi for guests."
      },
      {
        question: "How do I get to the property from the port?",
        answer: "Many properties offer transfer services from Kamares port. Alternatively, taxis are available. The distance will depend on the property's location."
      },
      {
        question: "Are there restaurants nearby?",
        answer: "Sifnos is known for its culinary offerings. Most properties are located close to tavernas and restaurants."
      }
    ];
  };
  
  const faqs = getFAQsByHotelName(hotelName);
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>
            {faq.answer.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
