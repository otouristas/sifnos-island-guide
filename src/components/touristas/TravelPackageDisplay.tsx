import React from 'react';
import { Clock, MapPin, Star, Ship, Calendar, Users, Euro, Sparkles, ArrowRight } from 'lucide-react';
import type { TravelPackage } from './enhanced/TouristasAITypes';

interface TravelPackageDisplayProps {
  travelPackage: TravelPackage;
}

export function TravelPackageDisplay({ travelPackage }: TravelPackageDisplayProps): JSX.Element {
  const formatCurrency = (amount: number): string => {
    return `€${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200/50 p-6 shadow-xl overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
      
      {/* Header - Mobile Optimized */}
      <div className="relative z-10 mb-6">
        {/* Mobile: Stacked Layout */}
        <div className="flex flex-col space-y-4 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{travelPackage.name}</h3>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(travelPackage.totalPrice)}</div>
              <div className="text-xs text-gray-500">Complete Package</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">{travelPackage.description}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{travelPackage.duration}</span>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Save {formatCurrency(travelPackage.savings)}!
            </div>
          </div>
        </div>

        {/* Desktop: Original Layout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{travelPackage.name}</h3>
            <p className="text-gray-600">{travelPackage.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{travelPackage.duration}</span>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Save {formatCurrency(travelPackage.savings)}!
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{formatCurrency(travelPackage.totalPrice)}</div>
            <div className="text-sm text-gray-500">Complete Package</div>
          </div>
        </div>
      </div>

      {/* Package Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Outbound Ferry */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Ship className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-bold text-gray-800">Outbound Ferry</h4>
              <p className="text-sm text-gray-600">Piraeus → Sifnos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={travelPackage.outboundFerry.logo} 
              alt={travelPackage.outboundFerry.company}
              className="w-10 h-10 object-contain bg-white rounded-lg border p-1"
              onError={(e) => {
                e.currentTarget.src = '/uploads/ferries/seajets.png';
              }}
            />
            <div>
              <div className="font-medium text-gray-800">{travelPackage.outboundFerry.company}</div>
              <div className="text-sm text-gray-600">{travelPackage.outboundFerry.vessel}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{travelPackage.outboundFerry.departure}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{travelPackage.outboundFerry.arrival}</span>
            </div>
            <div className="text-sm text-gray-600">{travelPackage.outboundFerry.duration}</div>
          </div>
        </div>

        {/* Return Ferry (if exists) */}
        {travelPackage.returnFerry && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200/50 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Ship className="w-6 h-6 text-blue-600 transform scale-x-[-1]" />
              <div>
                <h4 className="font-bold text-gray-800">Return Ferry</h4>
                <p className="text-sm text-gray-600">Sifnos → Piraeus</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={travelPackage.returnFerry.logo} 
                alt={travelPackage.returnFerry.company}
                className="w-10 h-10 object-contain bg-white rounded-lg border p-1"
                onError={(e) => {
                  e.currentTarget.src = '/uploads/ferries/seajets.png';
                }}
              />
              <div>
                <div className="font-medium text-gray-800">{travelPackage.returnFerry.company}</div>
                <div className="text-sm text-gray-600">{travelPackage.returnFerry.vessel}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{travelPackage.returnFerry.departure}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{travelPackage.returnFerry.arrival}</span>
              </div>
              <div className="text-sm text-gray-600">{travelPackage.returnFerry.duration}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hotel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200/50 p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <img 
            src={travelPackage.hotel.image} 
            alt={travelPackage.hotel.name}
            className="w-full h-48 md:w-24 md:h-24 object-cover rounded-lg border-2 border-white shadow-md"
          />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-800">{travelPackage.hotel.name}</h4>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{travelPackage.hotel.location}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(travelPackage.hotel.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({travelPackage.hotel.rating})</span>
                </div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <div className="text-xl font-bold text-purple-600">
                  {formatCurrency(travelPackage.hotel.price)}
                </div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {travelPackage.hotel.amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200"
                >
                  {amenity}
                </span>
              ))}
              {travelPackage.hotel.amenities.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{travelPackage.hotel.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-xl">
          Book Complete Package
        </button>
        <button className="px-6 py-4 bg-white border-2 border-purple-300 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-all duration-200">
          Customize Package
        </button>
      </div>

      {/* Package Benefits */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200/50">
        <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Package Benefits:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-green-600">
          <p>✓ Guaranteed ferry seats</p>
          <p>✓ Best price guarantee</p>
          <p>✓ 24/7 travel support</p>
          <p>✓ Flexible cancellation</p>
        </div>
        
        {/* FerryScanner Attribution */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-green-200">
          <span className="text-xs text-gray-500">Ferry data powered by</span>
          <a 
            href="https://www.ferryscanner.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img 
              src="https://www.ferryscanner.com/webpack-assets/4011d3808f1a509c8626.svg" 
              alt="FerryScanner" 
              className="h-4 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
} 