import React from 'react';
import { Clock, MapPin, Euro, AlertCircle, CheckCircle, Ship, Calendar } from 'lucide-react';
import type { FerrySearchResult } from './enhanced/TouristasAITypes';

interface FerryDisplayProps {
  ferryResult: FerrySearchResult;
}

export function FerryDisplay({ ferryResult }: FerryDisplayProps): JSX.Element {
  const formatRoute = (route: string): string => {
    return route.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' → ');
  };

  const getRefundableBadgeColor = (refundable: string): string => {
    switch (refundable) {
      case 'Fully Refundable': return 'bg-green-100 text-green-700 border-green-200';
      case 'Partially Refundable': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Non Refundable': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAvailabilityColor = (available: boolean): string => {
    return available ? 'text-green-600' : 'text-red-500';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-blue-200/50 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <Ship className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Ferry Routes Available</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{formatRoute(ferryResult.route)}</span>
            {ferryResult.date && (
              <>
                <Calendar className="w-4 h-4 ml-2" />
                <span>{ferryResult.date}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ferry Routes */}
      <div className="space-y-4">
        {ferryResult.ferries.map((ferry, index) => (
          <div 
            key={ferry.id} 
            className={`
              relative bg-gradient-to-r from-white to-blue-50/30 rounded-lg border-2 p-5 
              transition-all duration-300 hover:shadow-md hover:border-blue-300/50
              ${!ferry.available ? 'opacity-75 bg-gray-50/50' : ''}
            `}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* Badges */}
            {ferry.badges && ferry.badges.length > 0 && (
              <div className="absolute -top-2 -right-2 flex gap-1">
                {ferry.badges.map((badge, badgeIndex) => (
                  <span 
                    key={badgeIndex}
                    className={`
                      px-2 py-1 text-xs font-bold rounded-full shadow-sm
                      ${badge === 'Recommended' ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-white' : ''}
                      ${badge === 'Fastest' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}
                    `}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Company Logo & Info */}
              <div className="md:col-span-3 flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-lg border shadow-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src={ferry.logo} 
                    alt={ferry.company}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/uploads/ferries/seajets.png';
                    }}
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{ferry.company}</div>
                  <div className="text-gray-600 text-xs">{ferry.vessel}</div>
                </div>
              </div>

              {/* Schedule */}
              <div className="md:col-span-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-lg text-gray-800">{ferry.departure}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-bold text-lg text-gray-800">{ferry.arrival}</span>
                </div>
                <div className="text-sm text-gray-600">{ferry.duration}</div>
              </div>

              {/* Price */}
              <div className="md:col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Euro className="w-4 h-4 text-green-600" />
                  <div>
                    {ferry.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        {ferry.currency}{ferry.originalPrice.toFixed(2)}
                      </div>
                    )}
                    <div className="font-bold text-xl text-gray-800">
                      {ferry.currency}{ferry.price.toFixed(2)}
                    </div>
                    {ferry.discount && (
                      <div className="text-xs font-bold text-green-600">{ferry.discount}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability & Refund */}
              <div className="md:col-span-2 text-center">
                <div className={`flex items-center justify-center gap-1 mb-2 ${getAvailabilityColor(ferry.available)}`}>
                  {ferry.available ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {ferry.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full border ${getRefundableBadgeColor(ferry.refundable)}`}>
                  {ferry.refundable}
                </div>
              </div>

              {/* Book Button */}
              <div className="md:col-span-2">
                <button
                  disabled={!ferry.available}
                  className={`
                    w-full px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${ferry.available 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {ferry.available ? 'Select Ferry' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Travel Tips:</span>
        </div>
        <div className="mt-2 text-xs text-blue-600 space-y-1">
          <p>• Arrive at the port at least 30 minutes before departure</p>
          <p>• Prices may vary based on season and demand</p>
          <p>• Check weather conditions before traveling</p>
        </div>
        
        {/* FerryScanner Attribution */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-blue-200">
          <span className="text-xs text-gray-500">Ferry schedules powered by</span>
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