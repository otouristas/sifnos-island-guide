import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import { determineHotelLogoUrl } from '@/utils/image-utils';
import { useI18n } from '@/contexts/I18nContext';

export default function FeaturedTouristasAI() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <section className="relative py-20 bg-gradient-to-br from-accent-light/20 via-background to-accent-light/10 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Side - Chat Preview (60%) */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl shadow-elegant border border-border/50 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-primary to-primary-accent p-4 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white">Touristas AI</h3>
                  <p className="text-xs text-white/80">{t('touristasAI.title')}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80">{t('touristasAI.online')}</span>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-6 space-y-4 bg-muted/30 min-h-[400px]">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm">
                    <p className="font-body text-sm">
                      {t('touristasAI.chatPlaceholder')}
                    </p>
                  </div>
                </div>
                
                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="font-body text-xs font-medium text-muted-foreground">Touristas AI</span>
                    </div>
                    <p className="font-body text-sm text-foreground mb-3">
                      Perfect! I found <span className="font-semibold text-primary">3 luxury beachfront hotels</span> that match your criteria:
                    </p>
                    
                    {/* Mini Hotel Cards */}
                    <div className="space-y-2">
                      <div className="bg-background/80 rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img 
                              src="/uploads/hotels/alk-hotel-sifnos/logo.png" 
                              alt="ALK Hotel" 
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-heading font-semibold text-sm text-foreground truncate">ALK Hotel</h4>
                            <p className="text-xs text-muted-foreground">Kamares Beach</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">⭐ 4.8 (127)</span>
                              <span className="font-semibold text-sm text-primary">€120/night</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-background/80 rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {(() => {
                              const meropiHotel = { name: 'Meropi Rooms and Apartments', logo_path: 'meropi-logo.svg' };
                              const logoUrl = determineHotelLogoUrl(meropiHotel);
                              return logoUrl ? (
                                <img 
                                  src={logoUrl} 
                                  alt="Meropi Rooms" 
                                  className="w-12 h-12 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded" />
                              );
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-heading font-semibold text-sm text-foreground truncate">Meropi Rooms</h4>
                            <p className="text-xs text-muted-foreground">Platis Gialos Beach</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">⭐ 4.9 (89)</span>
                              <span className="font-semibold text-sm text-primary">€95/night</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Input (Disabled/Demo) */}
              <div className="p-4 border-t border-border bg-background/50">
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-muted-foreground text-sm font-body">
                    Type your preferences...
                  </div>
                  <Button size="sm" className="rounded-full" disabled>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Benefits & CTA (40%) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                {t('touristasAI.badge')}
              </div>
              
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {t('touristasAI.title')}
              </h2>
              
              <p className="font-body text-lg text-muted-foreground mb-6">
                {t('touristasAI.subtitle')}
              </p>
            </div>
            
            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full flex-shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1">{t('touristasAI.benefit1Title')}</h4>
                  <p className="font-body text-sm text-muted-foreground">{t('touristasAI.benefit1Desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full flex-shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1">{t('touristasAI.benefit2Title')}</h4>
                  <p className="font-body text-sm text-muted-foreground">{t('touristasAI.benefit2Desc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1">{t('touristasAI.benefit3Title')}</h4>
                  <p className="font-body text-sm text-muted-foreground">{t('touristasAI.benefit3Desc')}</p>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="pt-6">
              <Button
                onClick={() => navigate('/touristas-ai')}
                size="lg"
                variant="premium"
                className="w-full text-base shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105"
              >
                <Bot className="mr-2 h-5 w-5" />
                {t('touristasAI.tryNow')}
              </Button>
              
              <p className="text-center text-xs text-muted-foreground mt-3">
                {t('touristasAI.tryNowSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
