import SEO from '../components/SEO';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SchemaGenerator from '@/components/SchemaGenerator';

export default function FAQPage() {
  const faqs = [
    {
      question: "Where should I stay in Sifnos?",
      answer: "The best places to stay in Sifnos depend on your preferences. Apollonia is the island's capital and offers a central location with easy access to restaurants and shops. Kamares is near the main port with beautiful beaches. Platis Gialos and Vathi offer beachfront accommodations. For a more traditional feel, consider Kastro or Artemonas for their authentic Cycladic charm."
    },
    {
      question: "How do I get from Athens to Sifnos?",
      answer: "The most common way to reach Sifnos from Athens is by ferry from the port of Piraeus. High-speed ferries take approximately 2.5-3 hours, while conventional ferries take 5-6 hours. Ferries run daily during the summer season and less frequently during winter. It's advisable to book tickets in advance, especially during the peak summer months."
    },
    {
      question: "What's the weather like in Sifnos?",
      answer: "Sifnos enjoys a typical Mediterranean climate with hot, dry summers and mild winters. From June to September, temperatures typically range from 25-30°C (77-86°F) with very little rainfall. Spring (April-May) and autumn (September-October) offer pleasant temperatures around 20-25°C (68-77°F). Winter months (November-March) are mild with temperatures rarely dropping below 10°C (50°F), though this is the rainy season."
    },
    {
      question: "Which is better, Serifos or Sifnos?",
      answer: "Both islands offer unique experiences. Sifnos is known for its gastronomy, well-developed tourist infrastructure, picturesque villages, and pottery tradition. It offers more dining options and a slightly more cosmopolitan atmosphere. Serifos is more rugged and less developed, offering a more laid-back experience with beautiful beaches and fewer tourists. Sifnos might be better for first-time visitors or those seeking more amenities, while Serifos appeals to travelers looking for a quieter, more authentic experience."
    },
    {
      question: "What are the best beaches in Sifnos?",
      answer: "Sifnos has several stunning beaches: Platis Gialos is a long, sandy beach with shallow waters, perfect for families. Vathi is a sheltered bay with calm waters and beachfront tavernas. Kamares is the main port beach with facilities and restaurants nearby. Chrysopigi offers crystal-clear waters near the iconic monastery. Faros and Glyfo are smaller, more secluded options for those seeking tranquility."
    },
    {
      question: "What is Sifnos known for?",
      answer: "Sifnos is renowned for its exceptional cuisine and is considered one of Greece's gastronomic capitals. The island is famous for its pottery tradition, with many workshops producing distinctive ceramics. Sifnos is also known for its beautiful Cycladic architecture featuring whitewashed buildings with blue details, its well-maintained hiking trails, and the iconic Chrysopigi Monastery built on a rocky promontory."
    },
    {
      question: "Do I need a car in Sifnos?",
      answer: "While not absolutely necessary, having a car or scooter in Sifnos is recommended to fully explore the island. The public bus service connects major villages and beaches but runs on a limited schedule. Taxis are available but can be expensive and hard to find during peak season. Renting a vehicle gives you the freedom to discover secluded beaches, mountain villages, and scenic viewpoints at your own pace."
    },
    {
      question: "What are the must-try foods in Sifnos?",
      answer: "Don't miss mastelo (lamb or goat slow-cooked in a special clay pot), revithada (chickpea stew baked in a wood-fired oven overnight), manoura (local cheese aged in wine dregs), melopita (honey cheese pie), and amygdalota (almond cookies). Sifnos is known for its slow-cooked dishes in ceramic pots, reflecting the island's pottery tradition. Many restaurants serve these traditional dishes with a modern twist."
    },
    {
      question: "When is the best time to visit Sifnos?",
      answer: "The best times to visit Sifnos are late May to June and September to early October. During these periods, you'll enjoy warm temperatures ideal for swimming, fewer crowds than in peak summer, and more reasonable accommodation prices. July and August are the hottest and busiest months with higher prices. Winter visits (November-March) offer an authentic glimpse of island life, but many tourist facilities are closed and ferry connections are limited."
    }
  ];

  return (
    <>
      <SEO 
        title="Sifnos Hotels FAQ - Everything You Need to Know | Booking, Travel & Island Guide"
        description="Get answers to all your Sifnos travel questions. Comprehensive guide covering hotel bookings, island transportation, best areas to stay, seasonal tips & travel requirements. Plan your perfect Sifnos vacation with expert advice."
        keywords={[
          'sifnos faq', 'sifnos travel questions', 'sifnos accommodation faq', 'how to get to sifnos', 
          'best time to visit sifnos', 'sifnos travel tips', 'sifnos island guide', 'cyclades travel faq',
          'sifnos accommodation guide', 'sifnos vacation planning', 'greece travel faq'
        ]}
        pageType="faq"
        schemaType="Organization"
        canonical="https://hotelssifnos.com/faq"
        imageUrl="/uploads/sifnos-og-image.jpg"
      />
      
      {/* Add FAQ Schema */}
      <SchemaGenerator 
        pageType="FAQ"
        data={{
          faq: faqs
        }}
      />
      
      {/* Hero Section */}
      <div className="bg-sifnos-deep-blue py-12">
        <div className="page-container">
          <div className="text-center text-white">
            <h1 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Find answers to common questions about traveling to and staying in Sifnos Island
            </p>
          </div>
        </div>
      </div>
      
      {/* FAQ Content */}
      <div className="py-12">
        <div className="page-container max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-montserrat font-semibold text-sifnos-deep-blue hover:text-sifnos-turquoise text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pt-2 pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Ask a Question */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6 md:p-8">
            <h2 className="font-montserrat font-semibold text-2xl mb-6 text-center">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Send us your question and we'll get back to you as soon as possible
            </p>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">Your Name</label>
                <input 
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
                <input 
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                />
              </div>
              <div>
                <label htmlFor="question" className="block font-medium mb-1">Your Question</label>
                <textarea
                  id="question"
                  rows={5}
                  placeholder="Type your question here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sifnos-turquoise"
                ></textarea>
              </div>
              <div className="text-center">
                <button 
                  type="submit"
                  className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white font-medium px-8 py-3 rounded-lg transition-colors duration-300"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
