
import { Textarea } from "@/components/ui/textarea";
import { ValidationError } from "@formspree/react";

interface AddressSectionProps {
  state: any;
}

export const AddressSection = ({ state }: AddressSectionProps) => {
  return (
    <div>
      <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
        Full Address
      </label>
      <Textarea
        id="address"
        name="address"
        placeholder="Street, Number, Postal Code, etc."
        className="min-h-[80px]"
      />
      <ValidationError prefix="Address" field="address" errors={state.errors} className="text-red-500 text-sm mt-1" />
    </div>
  );
};
