import { useMemo, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Shield, CheckCircle, MapPin, Sparkles, Search, Calendar, Users } from 'lucide-react';
import TouristasLogo from '@/components/TouristasLogo';
import { useI18n } from '@/contexts/I18nContext';

// Signature locations - titles are location names, descriptions will be translated
const getSignatureLocations = (t: (key: string) => string) => [
  { title: 'Kamares', description: t('homepage.signatureLocations.kamares') },
  { title: 'Platis Gialos', description: t('homepage.signatureLocations.platisGialos') },
  { title: 'Apollonia', description: t('homepage.signatureLocations.apollonia') },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const guarantees = useMemo(() => ([
    { icon: Star, label: t('homepage.guarantees.curatedHotels') },
    { icon: CheckCircle, label: t('homepage.guarantees.honestRecommendations') },
    { icon: Shield, label: t('homepage.guarantees.secureBooking') },
  ]), [t]);
  
  const signatureLocations = useMemo(() => getSignatureLocations(t), [t]);

  const [location, setLocation] = useState('any');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== 'any') params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    const query = params.toString();
    navigate(query ? `/hotels?${query}` : '/hotels');
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-sifnos-deep-blue via-[#1E2E48] to-[#0b1626]">
      {/* Background image with better overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/sifnos-hero.jpg')",
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sifnos-deep-blue/95 via-sifnos-deep-blue/85 to-sifnos-deep-blue/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(227,215,195,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Badge */}
          <div className="flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-sifnos-beige" />
              <span className="text-xs font-semibold tracking-wider uppercase text-white/90">
                {t('homepage.curatedCycladicStays')}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center space-y-4 sm:space-y-5 animate-fade-in-up">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight">
              {t('homepage.heroTitleLine1')}
              <span className="block text-sifnos-beige mt-2">{t('homepage.heroTitleLine2')}</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-3 text-white/90 font-normal">
                {t('homepage.heroTitleLine3')}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/85 max-w-3xl mx-auto leading-relaxed font-light px-4">
              {t('homepage.heroDescription')}
            </p>
          </div>

          {/* Search Form */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl border border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-sifnos-deep-blue uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5 text-sifnos-deep-blue/70" />
                    {t('homepage.searchForm.location')}
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 rounded-lg px-4 text-sm bg-white border border-gray-300 text-sifnos-deep-blue focus:outline-none focus:ring-2 focus:ring-sifnos-beige focus:border-sifnos-beige transition-all"
                  >
                    <option value="any">{t('homepage.searchForm.anywhereInSifnos')}</option>
                    <option value="kamares">Kamares</option>
                    <option value="platis-gialos">Platis Gialos</option>
                    <option value="apollonia">Apollonia</option>
                    <option value="vathi">Vathi</option>
                    <option value="faros">Faros</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-sifnos-deep-blue uppercase tracking-wide">
                    <Calendar className="h-3.5 w-3.5 text-sifnos-deep-blue/70" />
                    {t('homepage.searchForm.checkIn')}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="h-12 rounded-lg px-4 text-sm bg-white border border-gray-300 text-sifnos-deep-blue focus:outline-none focus:ring-2 focus:ring-sifnos-beige focus:border-sifnos-beige transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-sifnos-deep-blue uppercase tracking-wide">
                    <Calendar className="h-3.5 w-3.5 text-sifnos-deep-blue/70" />
                    {t('homepage.searchForm.checkOut')}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="h-12 rounded-lg px-4 text-sm bg-white border border-gray-300 text-sifnos-deep-blue focus:outline-none focus:ring-2 focus:ring-sifnos-beige focus:border-sifnos-beige transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-sifnos-deep-blue uppercase tracking-wide">
                    <Users className="h-3.5 w-3.5 text-sifnos-deep-blue/70" />
                    {t('homepage.searchForm.guests')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    className="h-12 rounded-lg px-4 text-sm bg-white border border-gray-300 text-sifnos-deep-blue focus:outline-none focus:ring-2 focus:ring-sifnos-beige focus:border-sifnos-beige transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                  <label className="text-xs font-semibold text-sifnos-deep-blue uppercase tracking-wide opacity-0">
                    Search
                  </label>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-sifnos-deep-blue text-white hover:bg-sifnos-deep-blue/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {t('homepage.searchForm.search')}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={() => navigate('/touristas-ai')}
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 h-auto bg-sifnos-beige text-sifnos-deep-blue hover:bg-sifnos-beige/90 font-bold shadow-2xl hover:shadow-[0_20px_60px_rgba(227,215,195,0.4)] transition-all duration-300 hover:-translate-y-1"
            >
              <TouristasLogo size="md" className="mr-2" />
              {t('homepage.askTouristasAI')}
            </Button>
            <Button
              onClick={() => navigate('/hotels')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 h-auto border-2 border-white/90 text-white bg-white/10 backdrop-blur-md hover:bg-white hover:text-sifnos-deep-blue font-semibold transition-all duration-300 hover:-translate-y-1"
            >
              {t('homepage.browseAllHotels')}
            </Button>
          </div>

          {/* Guarantees */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {guarantees.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Icon className="h-5 w-5 text-sifnos-beige" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Signature Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {signatureLocations.map((location) => (
              <div
                key={location.title}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                onClick={() => navigate(`/locations/${location.title.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sifnos-beige/20 text-sifnos-beige font-bold text-lg group-hover:bg-sifnos-beige group-hover:text-sifnos-deep-blue transition-all duration-300 flex-shrink-0">
                    {location.title.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">{location.title}</h3>
                    <p className="text-sm text-white/75">{location.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
