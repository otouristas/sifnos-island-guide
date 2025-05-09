
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { slugify } from '@/lib/url-utils';

const BlogSidebar = () => {
  // Blog categories
  const categories = [
    { name: 'Travel Tips', slug: 'travel-tips', count: 4 },
    { name: 'Beaches', slug: 'beaches', count: 6 },
    { name: 'Gastronomy', slug: 'gastronomy', count: 3 },
    { name: 'Culture', slug: 'culture', count: 2 },
    { name: 'Accommodation', slug: 'accommodation', count: 5 }
  ];
  
  // Sample sponsored hotel (would come from a database in a real app)
  const sponsoredHotel = {
    name: 'ALK Hotel Sifnos',
    location: 'Kamares, Sifnos',
    image: '/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg',
    slug: 'alk-hotel'
  };
  
  // Sifnos quick facts
  const quickFacts = [
    { fact: 'Location', value: 'Cyclades, Greece' },
    { fact: 'Population', value: '~2,600' },
    { fact: 'Area', value: '74 km²' },
    { fact: 'Known for', value: 'Pottery, Gastronomy' },
    { fact: 'Best time to visit', value: 'May-October' }
  ];

  return (
    <div className="w-full md:w-1/3 space-y-6">
      {/* Sponsored hotel card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Sponsored Hotel</CardTitle>
        </CardHeader>
        <Link to={`/hotels/${sponsoredHotel.slug}`}>
          <img 
            src={sponsoredHotel.image} 
            alt={sponsoredHotel.name} 
            className="w-full h-48 object-cover"
          />
        </Link>
        <CardContent className="pt-4">
          <h3 className="font-semibold">{sponsoredHotel.name}</h3>
          <p className="text-gray-500 text-sm">{sponsoredHotel.location}</p>
          <Link 
            to={`/hotels/${sponsoredHotel.slug}`}
            className="mt-2 block text-sm text-blue-600 hover:underline"
          >
            View Details
          </Link>
        </CardContent>
      </Card>

      {/* Sifnos Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Sifnos Quick Facts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {quickFacts.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-gray-500">{item.fact}</span>
                <span className="font-medium">{item.value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.slug} className="flex justify-between">
                <Link 
                  to={`/blog/category/${category.slug}`} 
                  className="hover:underline hover:text-blue-600"
                >
                  {category.name}
                </Link>
                <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                  {category.count}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Banner */}
      <div className="border rounded-lg overflow-hidden">
        <Link to="/locations">
          <img 
            src="/uploads/banners/greececyclades-banner.png" 
            alt="Greece Cyclades" 
            className="w-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default BlogSidebar;
