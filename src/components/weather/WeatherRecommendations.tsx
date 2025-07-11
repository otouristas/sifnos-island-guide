import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  MapPin,
  Star,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WeatherRecommendationsProps {
  location?: string;
  className?: string;
}

const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({
  location = 'Sifnos',
  className = ''
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recommendedHotels, setRecommendedHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeatherRecommendations();
  }, [location]);

  const fetchWeatherRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weather-recommendations', {
        body: {
          location,
          date: new Date().toISOString()
        }
      });

      if (error) throw error;

      setWeatherData(data.weather);
      setRecommendations(data.recommendations);
      setRecommendedHotels(data.recommendedHotels);
    } catch (error) {
      console.error('Error fetching weather recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'windy':
        return <Wind className="h-6 w-6 text-gray-600" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'bg-yellow-50 border-yellow-200';
      case 'cloudy':
        return 'bg-gray-50 border-gray-200';
      case 'rainy':
        return 'bg-blue-50 border-blue-200';
      case 'windy':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Weather */}
      {weatherData && (
        <Card className={`${getWeatherColor(weatherData.condition)} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getWeatherIcon(weatherData.condition)}
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Weather in {location}</span>
                </div>
                <div className="text-sm font-normal text-muted-foreground">
                  {capitalizeFirst(weatherData.condition)} • {weatherData.temperature}°C
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span>{weatherData.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span>{weatherData.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
              <Badge variant="secondary">
                {capitalizeFirst(weatherData.condition)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Advice */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weather-Based Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="mt-1">
                    {getWeatherIcon(weatherData?.condition || 'sunny')}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Perfect for {rec.hotel_types?.join(' & ') || 'all accommodations'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Recommended based on current {weatherData?.condition} conditions
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Score: {rec.priority_score}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Hotels */}
      {recommendedHotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hotels Perfect for Today's Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedHotels.slice(0, 4).map((hotel) => (
                <div 
                  key={hotel.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{hotel.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {hotel.location}
                  </p>
                  
                  {hotel.hotel_types && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.hotel_types.slice(0, 2).map((type: string) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">€{hotel.price}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/hotels/${hotel.id}`, '_blank')}
                    >
                      View Hotel
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Weather Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {weatherData?.condition === 'sunny' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm">
                  ☀️ Perfect beach weather! Consider hotels with beach access or pools. 
                  Don't forget sunscreen and stay hydrated.
                </p>
              </div>
            )}
            {weatherData?.condition === 'cloudy' && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm">
                  ☁️ Great weather for exploring villages and hiking. 
                  Comfortable temperatures for outdoor activities.
                </p>
              </div>
            )}
            {weatherData?.condition === 'rainy' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm">
                  🌧️ Perfect time for spa treatments and indoor activities. 
                  Enjoy cozy restaurants and local cuisine.
                </p>
              </div>
            )}
            {weatherData?.condition === 'windy' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm">
                  💨 Great conditions for windsurfing and sailing! 
                  Consider sheltered accommodations for comfort.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherRecommendations;