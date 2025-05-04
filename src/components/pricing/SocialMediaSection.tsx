
import { Input } from "@/components/ui/input";
import { ValidationError } from "@formspree/react";
import { Facebook, Instagram, Twitter } from "../../components/icons/SocialIcons";

interface SocialMediaSectionProps {
  state: any;
}

export const SocialMediaSection = ({ state }: SocialMediaSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Social Media</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="socialFacebook" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Facebook className="h-4 w-4" /> Facebook
          </label>
          <Input
            id="socialFacebook"
            name="socialFacebook"
            type="url"
            placeholder="https://facebook.com/your-page"
          />
          <ValidationError prefix="Facebook" field="socialFacebook" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="socialInstagram" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Instagram className="h-4 w-4" /> Instagram
          </label>
          <Input
            id="socialInstagram"
            name="socialInstagram"
            type="url"
            placeholder="https://instagram.com/your-handle"
          />
          <ValidationError prefix="Instagram" field="socialInstagram" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
        
        <div>
          <label htmlFor="socialTwitter" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Twitter className="h-4 w-4" /> Twitter/X
          </label>
          <Input
            id="socialTwitter"
            name="socialTwitter"
            type="url"
            placeholder="https://twitter.com/your-handle"
          />
          <ValidationError prefix="Twitter" field="socialTwitter" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>
  );
};
