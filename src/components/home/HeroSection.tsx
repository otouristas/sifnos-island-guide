
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sifnosLocations } from '../../data/locations';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/i18n/LanguageContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const { t } = useTranslation('home');
  const { currentLanguage } = useLanguage();

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prevAmenities =>
      prevAmenities.includes(amenity) 
        ? prevAmenities.filter(a => a !== amenity)
        : [...prevAmenities, amenity]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
    
    navigate(`/${currentLanguage}/hotels?${params.toString()}`);
  };

  return (
    <div className="relative h-[70vh] flex items-center justify-center bg-sifnos-deep-blue overflow-hidden">
      <img 
        src="/uploads/homepage-hero.jpg" 
        alt="Chrysopigi Monastery in Sifnos" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {t('heroTitle')}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8">
          {t('heroSubtitle')}
        </p>
        
        {/* Minimal Search Form */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-5 rounded-lg shadow-lg">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full bg-white/90 border-0">
                  <SelectValue placeholder={t('whereInSifnos')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">{t('anyLocation')}</SelectItem>
                  {sifnosLocations.map((location) => (
                    <SelectItem key={location.id} value={location.slug}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative col-span-1 md:col-span-2">
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="pl-10 bg-white/90 border-0 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center md:justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                {selectedAmenities.length > 0 && selectedAmenities.map(amenity => (
                  <span key={amenity} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    {amenity}
                    <button 
                      type="button" 
                      onClick={() => toggleAmenity(amenity)} 
                      className="ml-1 text-white hover:text-white/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <Button 
                type="submit" 
                className="bg-white hover:bg-white/90 text-sifnos-deep-blue"
              >
                <Search className="mr-2 h-4 w-4" />
                {t('searchButton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
