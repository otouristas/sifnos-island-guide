
import { motion } from 'framer-motion';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
      {tips.map((tip, index) => (
        <motion.div 
          key={index} 
          className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-7 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center mb-5 text-[#0EA5E9]">
              {tip.icon}
            </div>
            <h3 className="font-montserrat font-semibold text-xl mb-3">{tip.title}</h3>
            <p className="text-gray-600">{tip.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FerryTravelTips;
