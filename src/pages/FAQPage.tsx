import SEO from '../components/SEO';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export default function FAQPage() {
  // Define an array of FAQ items
  const faqItems: FAQItem[] = [
    {
      question: "What is the best time to visit Sifnos?",
      answer: "The best time to visit Sifnos is from late May to early October. During these months, the weather is warm and pleasant, perfect for swimming and enjoying outdoor activities. July and August are the busiest months with higher prices, while June and September offer a nice balance of good weather and fewer crowds."
    },
    {
      question: "How do I get to Sifnos?",
      answer: "Sifnos does not have an airport, so the only way to reach the island is by ferry from Athens. Ferries to Sifnos depart from the ports of Piraeus and Lavrion. The journey takes between 2.5 to 5 hours depending on the type of ferry (high-speed or conventional). During the summer season, there are also connections from other Cycladic islands."
    },
    {
      question: "Where should I stay in Sifnos?",
      answer: "The best place to stay in Sifnos depends on your preferences. Apollonia is the island's capital and offers a vibrant atmosphere with many restaurants and shops. Kamares, the main port, has a nice beach and is convenient for arrivals and departures. Platis Gialos has one of the best beaches, while Kastro offers a more authentic experience in a medieval setting."
    },
    {
      question: "What are the must-see attractions in Sifnos?",
      answer: "Must-see attractions in Sifnos include the Church of the Seven Martyrs in Kastro, the ancient acropolis at Agios Andreas, the Monastery of Chrysopigi, the traditional pottery workshops, and the picturesque villages of Kastro, Apollonia, and Artemonas. Don't miss hiking the ancient stone paths that connect the villages."
    },
    {
      question: "What is Sifnos known for?",
      answer: "Sifnos is known for its exceptional cuisine, traditional pottery, well-preserved Cycladic architecture, and beautiful hiking trails. The island has a rich culinary tradition and is considered one of the gastronomic capitals of Greece. It's also famous for its numerous blue-domed churches and monasteries."
    },
    {
      question: "What are the best beaches in Sifnos?",
      answer: "Some of the best beaches in Sifnos include Platis Gialos (a long sandy beach with amenities), Vathi (a sheltered bay with calm waters), Kamares (the main port beach with facilities), Chrissopigi (a picturesque small beach near the monastery), and Faros (a family-friendly beach). For more seclusion, try Vroulidia or Apokofto."
    },
    {
      question: "Is Sifnos suitable for families?",
      answer: "Yes, Sifnos is very suitable for families. The island has several safe, shallow beaches like Vathi and Kamares. The relaxed pace of life, friendly locals, and lack of intense nightlife make it perfect for family vacations. There are also plenty of family-friendly accommodations and restaurants across the island."
    },
    {
      question: "How can I book a hotel in Sifnos?",
      answer: "You can book hotels in Sifnos through our website HotelsSifnos.com, which offers a comprehensive selection of accommodations across the island. We provide detailed information, photos, and reviews to help you make an informed choice. You can also book directly through hotel websites or global booking platforms."
    }
  ];

  // Convert FAQ items to the format needed for structured data
  const faqSchemaQuestions = faqItems.map(item => ({
    question: item.question,
    answer: typeof item.answer === 'string' 
      ? item.answer 
      : 'Please visit our FAQ page for a detailed answer.'
  }));

  return (
    <div className="bg-white min-h-screen py-16">
      {/* SEO with FAQ Schema */}
      <SEO 
        title="Frequently Asked Questions About Sifnos - Hotels Sifnos"
        description="Find answers to the most common questions about visiting Sifnos, booking accommodations, island attractions, beaches, and travel tips on our comprehensive FAQ page."
        keywords={['sifnos faq', 'sifnos questions', 'sifnos travel guide', 'sifnos hotels faq', 'how to visit sifnos']}
        schemaType="FAQPage"
        canonical="/faq"
        faqData={{ questions: faqSchemaQuestions }}
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
              {faqItems.map((faq, index) => (
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
    </div>
  );
}
