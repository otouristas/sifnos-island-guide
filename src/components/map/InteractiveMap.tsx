import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Type declaration to fix TypeScript errors with Leaflet components
declare module 'react-leaflet' {
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    scrollWheelZoom?: boolean;
  }
  
  export interface TileLayerProps {
    attribution: string;
    url: string;
  }
  
  export interface MarkerProps {
    position: [number, number];
    icon?: L.Icon;
  }
}

// Fix Leaflet icon issue in React
const fixLeafletIcon = () => {
  // This is a known issue with Leaflet in React
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Define map points with real coordinates
const MAP_POINTS = [
  {
    id: '1',
    name: 'Kamares Port',
    type: 'port',
    description: 'Main port of Sifnos Island',
    slug: 'kamares',
    position: [36.9947, 24.6037] as [number, number]
  },
  {
    id: '2',
    name: 'Apollonia',
    type: 'town',
    description: 'The capital of Sifnos',
    slug: 'apollonia',
    position: [36.9775, 24.6741] as [number, number]
  },
  {
    id: '3',
    name: 'Platis Gialos Beach',
    type: 'beach',
    description: 'Popular sandy beach with crystal clear waters',
    slug: 'platis-gialos',
    position: [36.9356, 24.7428] as [number, number]
  },
  {
    id: '4',
    name: 'Kastro',
    type: 'town',
    description: 'Medieval settlement with amazing views',
    slug: 'kastro',
    position: [36.9775, 24.7069] as [number, number]
  },
  {
    id: '5',
    name: 'Vathi Beach',
    type: 'beach',
    description: 'Picturesque bay with sandy beach',
    slug: 'vathi',
    position: [36.9272, 24.6741] as [number, number]
  },
  {
    id: '6',
    name: 'Chrysopigi Monastery',
    type: 'attraction',
    description: 'Iconic monastery on a rocky peninsula',
    slug: 'chrysopigi',
    position: [36.9178, 24.7428] as [number, number]
  },
  {
    id: '7',
    name: 'Faros',
    type: 'town',
    description: 'Charming fishing village',
    slug: 'faros',
    position: [36.9272, 24.7264] as [number, number]
  },
  {
    id: '8',
    name: 'Artemonas',
    type: 'town',
    description: 'Traditional village with neoclassical architecture',
    slug: 'artemonas',
    position: [36.9822, 24.6796] as [number, number]
  }
];

// Define point type colors
const TYPE_COLORS = {
  town: 'bg-blue-500',
  beach: 'bg-yellow-500',
  port: 'bg-green-500',
  attraction: 'bg-purple-500'
};

interface MapPoint {
  id: string;
  name: string;
  type: string;
  description: string;
  slug: string;
  position: [number, number];
}

const InteractiveMap = () => {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [visibleTypes, setVisibleTypes] = useState({
    town: true,
    beach: true,
    port: true,
    attraction: true
  });
  const navigate = useNavigate();

  // Initialize Leaflet icons
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Toggle visibility of point types
  const togglePointType = (type: keyof typeof visibleTypes) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Navigate to location page
  const navigateToLocation = (slug: string) => {
    navigate(`/locations/${slug}`);
  };

  // Filter points based on visible types
  const filteredPoints = MAP_POINTS.filter(point => visibleTypes[point.type as keyof typeof visibleTypes]);

  // Helper function to get point color based on type
  const getPointColor = (type: string): string => {
    switch (type) {
      case 'town':
        return 'bg-blue-600';
      case 'beach':
        return 'bg-yellow-500';
      case 'port':
        return 'bg-green-600';
      case 'attraction':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Create custom icons for different point types
  const getMarkerIcon = (type: string): L.Icon => {
    // No need to use getPointColor here since we're using predefined colors
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${type === 'town' ? 'blue' : type === 'beach' ? 'gold' : type === 'port' ? 'green' : 'red'}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Filter controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={visibleTypes.town ? "default" : "outline"}
          onClick={() => togglePointType('town')}
          className="text-xs md:text-sm"
        >
          Towns & Villages
        </Button>
        <Button
          variant={visibleTypes.beach ? "default" : "outline"}
          onClick={() => togglePointType('beach')}
          className="text-xs md:text-sm"
        >
          Beaches
        </Button>
        <Button
          variant={visibleTypes.port ? "default" : "outline"}
          onClick={() => togglePointType('port')}
          className="text-xs md:text-sm"
        >
          Ports
        </Button>
        <Button
          variant={visibleTypes.attraction ? "default" : "outline"}
          onClick={() => togglePointType('attraction')}
          className="text-xs md:text-sm"
        >
          Attractions
        </Button>
      </div>
      
      {/* Map container */}
      <div className="w-full h-[500px] border rounded-lg overflow-hidden">
        <MapContainer 
          center={[36.9775, 24.6741] as [number, number]} // Center on Apollonia
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredPoints.map((point) => (
            <Marker 
              key={point.id} 
              position={point.position}
              icon={getMarkerIcon(point.type)}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm mb-1">{point.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{point.description}</p>
                  <button 
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors w-full"
                    onClick={() => navigateToLocation(point.slug)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        Click on any marker to see more information. Use the buttons above to filter what you see on the map.
      </div>
    </div>
  );
};

export default InteractiveMap;
