import React, { useEffect, useState } from "react";
import { useGuestContext } from "@/contexts/GuestContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Info, 
  Wifi, 
  Coffee, 
  Clock, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Luggage,
  Home,
  Sparkles,
  Car,
  Shield
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuideSection {
  id: string;
  section_title: string;
  section_content: string;
  section_order: number;
  icon_name: string | null;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  wifi: Wifi,
  coffee: Coffee,
  clock: Clock,
  phone: Phone,
  'map-pin': MapPin,
  'alert-circle': AlertCircle,
  luggage: Luggage,
  home: Home,
  sparkles: Sparkles,
  car: Car,
  shield: Shield,
};

export const GuestGuide: React.FC = () => {
  const { hotel } = useGuestContext();
  const { t } = useI18n();
  const [sections, setSections] = useState<GuideSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuideSections = async () => {
      if (!hotel) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('guest_guide_sections')
          .select('*')
          .eq('hotel_id', hotel.id)
          .eq('is_active', true)
          .order('section_order', { ascending: true });

        if (fetchError) throw fetchError;

        setSections(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error loading guide sections:', err);
        setError('Failed to load hotel guide');
      } finally {
        setLoading(false);
      }
    };

    loadGuideSections();
  }, [hotel]);

  if (!hotel) return null;

  if (loading) {
    return (
      <div className="space-y-3 max-w-2xl mx-auto">
        <div className="bg-card rounded-xl shadow p-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card rounded-xl shadow p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl shadow p-8 text-center">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-foreground">{t('guest.noGuideAvailable')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('guest.noGuideAvailableDescription')}
          </p>
          {hotel.phone && (
            <a 
              href={`tel:${hotel.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              Call Reception
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl shadow p-4">
        <h1 className="text-xl font-semibold text-foreground mb-1">Hotel Guide</h1>
        <p className="text-sm text-muted-foreground">
          Everything you need to know about your stay at {hotel.name}
        </p>
      </div>

      {/* Guide Sections Accordion */}
      <div className="bg-card rounded-xl shadow overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section, index) => {
            const IconComponent = section.icon_name 
              ? iconMap[section.icon_name] || Info 
              : Info;

            return (
              <AccordionItem 
                key={section.id} 
                value={section.id}
                className={index !== sections.length - 1 ? 'border-b border-border' : ''}
              >
                <AccordionTrigger className="px-4 py-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                      {section.section_title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="pl-[52px]">
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {section.section_content}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Contact Information Footer */}
      {(hotel.phone || hotel.email) && (
        <div className="bg-card rounded-xl shadow p-4">
          <h3 className="font-semibold text-sm mb-3 text-foreground">Need More Help?</h3>
          <div className="space-y-2">
            {hotel.phone && (
              <a 
                href={`tel:${hotel.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Call Reception</div>
                  <div className="text-sm font-medium text-foreground">{hotel.phone}</div>
                </div>
              </a>
            )}
            {hotel.email && (
              <a 
                href={`mailto:${hotel.email}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <AlertCircle className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Email Us</div>
                  <div className="text-sm font-medium text-foreground">{hotel.email}</div>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};