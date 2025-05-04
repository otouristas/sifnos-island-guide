
import { ValidationError } from "@formspree/react";

interface LocationPlanSectionProps {
  state: any;
  selectedPlan: string | null;
}

export const LocationPlanSection = ({ state, selectedPlan }: LocationPlanSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
          Location in Sifnos *
        </label>
        <select
          id="location"
          name="location"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="">Select location</option>
          <option value="Agios Loukas">Agios Loukas</option>
          <option value="Apollonia">Apollonia</option>
          <option value="Artemonas">Artemonas</option>
          <option value="Vathi">Vathi</option>
          <option value="Exambela">Exambela</option>
          <option value="Kamares">Kamares</option>
          <option value="Kastro">Kastro</option>
          <option value="Katavati">Katavati</option>
          <option value="Kato Petali">Kato Petali</option>
          <option value="Pano Petali">Pano Petali</option>
          <option value="Platis Gialos">Platis Gialos</option>
          <option value="Troullaki">Troullaki</option>
          <option value="Faros">Faros</option>
          <option value="Herronisos">Herronisos</option>
          <option value="Chrysopigi">Chrysopigi</option>
        </select>
        <ValidationError prefix="Location" field="location" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
      
      <div>
        <label htmlFor="selectedPlan" className="block text-gray-700 font-medium mb-2">
          Selected Plan *
        </label>
        <select
          id="selectedPlan"
          name="selectedPlan"
          required
          defaultValue={selectedPlan || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="">Select a plan</option>
          <option value="Basic">Basic Listing (€0)</option>
          <option value="Premium">Premium Listing (€249)</option>
          <option value="Professional">Professional Package (€499)</option>
        </select>
        <ValidationError prefix="Selected Plan" field="selectedPlan" errors={state.errors} className="text-red-500 text-sm mt-1" />
      </div>
    </div>
  );
};
