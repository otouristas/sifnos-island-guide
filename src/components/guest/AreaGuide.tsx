import React, { useEffect, useState, useRef } from "react";
import { useGuestContext } from "@/contexts/GuestContext";
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  UtensilsCrossed,
  Waves,
  Wine,
  Landmark,
  Store,
  Phone,
  Navigation,
  MapPin,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Category configuration
const CATEGORIES = [
  { value: "all", label: "All", icon: MapPin },
  { value: "restaurant", label: "Restaurants", icon: UtensilsCrossed },
  { value: "beach", label: "Beaches", icon: Waves },
  { value: "bar", label: "Bars & Cafes", icon: Wine },
  { value: "attraction", label: "Attractions", icon: Landmark },
  { value: "supermarket", label: "Services", icon: Store },
];

// Price range icons
const PRICE_ICONS: Record<string, string> = {
  "€": "Budget-friendly",
  "€€": "Moderate",
  "€€€": "Upscale",
};

interface POI {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string | null;
  google_maps_url: string | null;
  phone: string | null;
  website: string | null;
  image_url: string | null;
  distance_from_kamares: number | null;
  distance_from_apollonia: number | null;
  distance_from_platis_gialos: number | null;
  price_range: string | null;
  tags: string[] | null;
  featured: boolean;
}

// Sifnos center coordinates
const SIFNOS_CENTER: [number, number] = [24.7142, 36.9835];

// Location coordinates for distance calculation
const LOCATION_COORDS: Record<string, [number, number]> = {
  kamares: [24.7142, 36.9835],
  apollonia: [24.7303, 36.9742],
  "platis-gialos": [24.7089, 36.9550],
};

export const AreaGuide: React.FC = () => {
  const { hotel } = useGuestContext();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [pois, setPois] = useState<POI[]>([]);
  const [filteredPois, setFilteredPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(data.token);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };
    fetchToken();
  }, []);

  // Load POIs
  useEffect(() => {
    const loadPois = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('area_pois')
          .select('*')
          .order('featured', { ascending: false })
          .order('name', { ascending: true });

        if (error) throw error;

        setPois(data || []);
        setFilteredPois(data || []);
      } catch (error) {
        console.error('Error loading POIs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPois();
  }, []);

  // Filter POIs by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPois(pois);
    } else {
      setFilteredPois(pois.filter(poi => poi.category === selectedCategory));
    }
  }, [selectedCategory, pois]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: SIFNOS_CENTER,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update markers when filtered POIs change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for filtered POIs
    filteredPois.forEach(poi => {
      // Get approximate coordinates based on location
      const locationKey = poi.location.toLowerCase().replace(/\s+/g, '-');
      const coords = LOCATION_COORDS[locationKey] || SIFNOS_CENTER;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getCategoryColor(poi.category);
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Add icon
      const icon = getCategoryIcon(poi.category);
      el.innerHTML = `<svg width="16" height="16" fill="white" viewBox="0 0 24 24">${icon}</svg>`;

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        setSelectedPoi(poi);
        map.current?.flyTo({
          center: coords,
          zoom: 14,
          duration: 1000,
        });
      });

      markers.current.push(marker);
    });
  }, [filteredPois]);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      restaurant: '#10b981',
      beach: '#3b82f6',
      bar: '#f59e0b',
      attraction: '#8b5cf6',
      supermarket: '#ef4444',
      pharmacy: '#ec4899',
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryIcon = (category: string): string => {
    // SVG path data for icons
    const icons: Record<string, string> = {
      restaurant: '<path d="M12 2L2 7v15h20V7L12 2z"/>',
      beach: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
      bar: '<circle cx="12" cy="12" r="10"/>',
      attraction: '<path d="M12 2L2 7v15h20V7L12 2z"/>',
      supermarket: '<rect x="3" y="3" width="18" height="18" rx="2"/>',
    };
    return icons[category] || '<circle cx="12" cy="12" r="8"/>';
  };

  const getDistance = (poi: POI): number | null => {
    // Default to Kamares distance if hotel location not available
    return poi.distance_from_kamares;
  };

  const handleNavigate = (poi: POI) => {
    if (poi.google_maps_url) {
      window.open(poi.google_maps_url, '_blank');
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (!hotel) return null;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl shadow p-4">
        <h1 className="text-xl font-semibold text-foreground mb-1">Explore Sifnos</h1>
        <p className="text-sm text-muted-foreground">
          Discover the best restaurants, beaches, and attractions on the island
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-card rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filter by Category</span>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <div className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Map */}
      <div className="bg-card rounded-xl shadow overflow-hidden">
        <div 
          ref={mapContainer} 
          className="h-[300px] w-full"
          style={{ minHeight: '300px' }}
        />
        {!mapboxToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* POIs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-card rounded-xl shadow p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading places...</p>
          </div>
        ) : filteredPois.length === 0 ? (
          <div className="bg-card rounded-xl shadow p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No places found in this category</p>
          </div>
        ) : (
          filteredPois.map((poi) => {
            const distance = getDistance(poi);
            const CategoryIcon = CATEGORIES.find(c => c.value === poi.category)?.icon || MapPin;

            return (
              <div
                key={poi.id}
                className={`bg-card rounded-xl shadow p-4 transition-all ${
                  selectedPoi?.id === poi.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${getCategoryColor(poi.category)}20` }}
                  >
                    <CategoryIcon 
                      className="h-6 w-6" 
                      style={{ color: getCategoryColor(poi.category) }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{poi.name}</h3>
                      {poi.featured && (
                        <Badge variant="secondary" className="text-xs">Featured</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="capitalize">{poi.category}</span>
                      <span>•</span>
                      <span>{poi.location}</span>
                      {distance && (
                        <>
                          <span>•</span>
                          <span>{distance.toFixed(1)} km</span>
                        </>
                      )}
                      {poi.price_range && (
                        <>
                          <span>•</span>
                          <span title={PRICE_ICONS[poi.price_range]}>{poi.price_range}</span>
                        </>
                      )}
                    </div>
                    
                    {poi.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {poi.description}
                      </p>
                    )}
                    
                    {poi.tags && poi.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {poi.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {poi.google_maps_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNavigate(poi)}
                          className="text-xs"
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Navigate
                        </Button>
                      )}
                      {poi.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCall(poi.phone!)}
                          className="text-xs"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      {poi.website && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(poi.website!, '_blank')}
                          className="text-xs"
                        >
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};