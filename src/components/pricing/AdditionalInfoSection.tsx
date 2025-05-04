
import { Textarea } from "@/components/ui/textarea";
import { ValidationError } from "@formspree/react";

interface AdditionalInfoSectionProps {
  state: any;
}

export const AdditionalInfoSection = ({ state }: AdditionalInfoSectionProps) => {
  return (
    <div>
      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
        Additional Information
      </label>
      <Textarea
        id="message"
        name="message"
        placeholder="Tell us more about your property or any specific requirements..."
        className="min-h-[120px]"
      />
      <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
    </div>
  );
};
