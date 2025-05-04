
import { Input } from "@/components/ui/input";
import { ValidationError } from "@formspree/react";

interface BasicInformationProps {
  state: any;
}

export const BasicInformationSection = ({ state }: BasicInformationProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="hotelName" className="block text-gray-700 font-medium mb-2">
          Hotel Name *
        </label>
        <Input
          id="hotelName"
          name="hotelName"
          placeholder="Your hotel name"
          required
          className="w-full"
        />
        <ValidationError prefix="Hotel Name" field="hotelName" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
      
      <div>
        <label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">
          Contact Person *
        </label>
        <Input
          id="contactName"
          name="contactName"
          placeholder="Your name"
          required
          className="w-full"
        />
        <ValidationError prefix="Contact Person" field="contactName" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          className="w-full"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
          Phone Number *
        </label>
        <Input
          id="phone"
          name="phone"
          placeholder="+30 123 456 7890"
          required
          className="w-full"
        />
        <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
    </div>
  );
};
