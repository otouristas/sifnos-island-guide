
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin, Phone, Clock, Shield, CheckCircle, Headphones, TrendingUp, Star, Award } from 'lucide-react';
import TouristasLogo from '@/components/TouristasLogo';
import { useI18n } from '@/contexts/I18nContext';

export default function Footer() {
  const { t } = useI18n();
  
  return (
    <footer className="bg-sifnos-deep-blue text-white">
      {/* Stats Section */}
      <div className="bg-sifnos-deep-blue/90 border-b border-sifnos-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-heading font-bold text-sifnos-beige mb-1">25+</div>
              <div className="text-sm text-white/70">Hotels</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-sifnos-beige mb-1">10</div>
              <div className="text-sm text-white/70">Locations</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-sifnos-beige mb-1">5K+</div>
              <div className="text-sm text-white/70">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-sifnos-beige mb-1">4.8★</div>
              <div className="text-sm text-white/70">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Company Info */}
          <div>
            <Link to="/" className="mb-6 inline-block">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-heading font-bold text-white">
                  Hotels<span className="text-sifnos-beige">Sifnos</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/60 font-medium">{t('footer.poweredBy')}</span>
                  <TouristasLogo size="sm" className="h-3 w-3" />
                  <span className="text-[10px] text-white/60 font-medium">{t('footer.touristasAI')}</span>
                </div>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t('footer.companyInfo')}
            </p>
            <div className="space-y-3 text-white/70 text-sm mb-6">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-sifnos-beige flex-shrink-0" />
                <span>Sifnos Island, Cyclades, Greece</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-sifnos-beige flex-shrink-0" />
                <span>hello@hotelssifnos.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-sifnos-beige flex-shrink-0" />
                <span>24/7 Support Available</span>
              </div>
            </div>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="text-white/70 hover:text-sifnos-beige transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-sifnos-beige transition-colors"
                aria-label="Visit our Instagram profile"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-sifnos-beige transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-sifnos-beige transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="font-heading font-semibold mb-6 text-sifnos-beige text-lg">{t('footer.popularLocations')}</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li><Link to="/locations/apollonia" className="hover:text-white transition-colors">Apollonia</Link></li>
              <li><Link to="/locations/kamares" className="hover:text-white transition-colors">Kamares</Link></li>
              <li><Link to="/locations/platis-gialos" className="hover:text-white transition-colors">Platis Gialos</Link></li>
              <li><Link to="/locations/kastro" className="hover:text-white transition-colors">Kastro</Link></li>
              <li><Link to="/locations/vathi" className="hover:text-white transition-colors">Vathi</Link></li>
              <li><Link to="/locations/faros" className="hover:text-white transition-colors">Faros</Link></li>
            </ul>
          </div>

          {/* Hotel Types */}
          <div>
            <h4 className="font-heading font-semibold mb-6 text-sifnos-beige text-lg">{t('footer.hotelTypes')}</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li><Link to="/hotels" className="hover:text-white transition-colors">{t('common.allHotels')}</Link></li>
              <li><Link to="/hotel-types/luxury-hotels" className="hover:text-white transition-colors">{t('common.luxuryHotels')}</Link></li>
              <li><Link to="/hotel-types/beach-hotels" className="hover:text-white transition-colors">{t('common.beachHotels')}</Link></li>
              <li><Link to="/hotel-types/villas" className="hover:text-white transition-colors">{t('common.villas')}</Link></li>
              <li><Link to="/hotel-types/boutique-hotels" className="hover:text-white transition-colors">Boutique Hotels</Link></li>
              <li><Link to="/hotel-types/budget-hotels" className="hover:text-white transition-colors">{t('common.budgetHotels')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold mb-6 text-sifnos-beige text-lg">{t('footer.resources')}</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li><Link to="/travel-guide" className="hover:text-white transition-colors">{t('common.travelGuide')}</Link></li>
              <li><Link to="/best-beaches-sifnos-guide" className="hover:text-white transition-colors">{t('common.beaches')} Guide</Link></li>
              <li><Link to="/ferry-tickets" className="hover:text-white transition-colors">{t('common.ferryTickets')}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t('common.blog')}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('common.contact')}</Link></li>
            </ul>
            <h5 className="font-heading font-semibold mt-6 mb-3 text-sifnos-beige">{t('footer.company')}</h5>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link to="/about-us" className="hover:text-white transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">{t('footer.listYourHotel')}</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-sifnos-beige/20 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-sifnos-beige mb-3" />
              <div className="text-sm font-medium mb-1">Secure Booking</div>
              <div className="text-xs text-white/60">SSL Protected</div>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-sifnos-beige mb-3" />
              <div className="text-sm font-medium mb-1">Best Price</div>
              <div className="text-xs text-white/60">Guaranteed</div>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="h-8 w-8 text-sifnos-beige mb-3" />
              <div className="text-sm font-medium mb-1">24/7 Support</div>
              <div className="text-xs text-white/60">Always Here</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-sifnos-beige mb-3" />
              <div className="text-sm font-medium mb-1">Top Rated</div>
              <div className="text-xs text-white/60">4.8/5 Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sifnos-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm text-center md:text-left">
              <p>© {new Date().getFullYear()} Hotels Sifnos. {t('footer.allRightsReserved')}.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-white/60">
              <Link to="/privacy-policy" className="hover:text-sifnos-beige transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-sifnos-beige transition-colors">Terms</Link>
              <Link to="/cookie-policy" className="hover:text-sifnos-beige transition-colors">Cookies</Link>
              <Link to="/sitemap" className="hover:text-sifnos-beige transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
