
import { Ship, Clock, Calendar, Wind, FileText } from 'lucide-react';

const tips = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Arrive Early",
    description: "Be at the port at least 1 hour before departure, especially during peak season."
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Have Your Ticket Ready",
    description: "Keep your e-ticket or printed boarding pass accessible for quick boarding."
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Book in Advance",
    description: "During July–August, ferries fill up quickly. Book at least 2 weeks ahead for popular routes."
  },
  {
    icon: <Wind className="h-6 w-6" />,
    title: "Weather Awareness",
    description: "Check ferry status before heading to the port, especially during Meltemi wind season."
  }
];

const FerryTravelTips = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {tips.map((tip, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#1E2E48]/10 flex items-center justify-center mb-4 text-[#1E2E48]">
              {tip.icon}
            </div>
            <h3 className="font-montserrat font-semibold text-lg mb-2">{tip.title}</h3>
            <p className="text-gray-600">{tip.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FerryTravelTips;
