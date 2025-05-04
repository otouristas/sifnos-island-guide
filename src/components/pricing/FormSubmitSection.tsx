
import { Button } from "@/components/ui/button";

interface FormSubmitSectionProps {
  isSubmitting: boolean;
}

export const FormSubmitSection = ({ isSubmitting }: FormSubmitSectionProps) => {
  return (
    <div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Registration"}
      </Button>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        By submitting this form, you agree to our{" "}
        <a href="/terms-of-service" className="text-sifnos-teal hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-sifnos-teal hover:underline">
          Privacy Policy
        </a>.
      </p>
    </div>
  );
};
