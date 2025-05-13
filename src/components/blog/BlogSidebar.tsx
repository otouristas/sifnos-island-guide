
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts } from '@/data/blogPosts';
import { slugify } from '@/lib/url-utils';
import MailerLiteForm from '@/components/newsletter/MailerLiteForm';

// Extract all unique categories from blog posts
const getCategories = () => {
  const categoryMap = new Map();
  
  blogPosts.forEach(post => {
    post.categories.forEach(category => {
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + 1);
      } else {
        categoryMap.set(category, 1);
      }
    });
  });
  
  return Array.from(categoryMap.entries()).map(([category, count]) => ({
    name: category,
    count: count as number,
    slug: slugify(category)
  }));
};

const BlogSidebar = () => {
  const categories = getCategories();
  
  return (
    <div className="w-full md:w-1/3 space-y-8">
      {/* Sponsored Hotel */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Sponsored Hotel</CardTitle>
        </CardHeader>
        <Link to="/hotels/alk-hotel">
          <img 
            src="/uploads/hotels/alk-hotel-sifnos/alk-hotel-feature.jpeg" 
            alt="ALK Hotel Sifnos" 
            className="w-full h-48 object-cover"
          />
        </Link>
        <CardContent className="pt-4">
          <h3 className="font-semibold">ALK Hotel Sifnos</h3>
          <p className="text-gray-500 text-sm">Kamares, Sifnos</p>
          <Link to="/hotels/alk-hotel" className="mt-2 block text-sm text-blue-600 hover:underline">
            View Details
          </Link>
        </CardContent>
      </Card>
      
      {/* Sifnos Quick Facts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Sifnos Quick Facts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium">Cyclades, Greece</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Population</span>
              <span className="font-medium">~2,600</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Area</span>
              <span className="font-medium">74 km²</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Known for</span>
              <span className="font-medium">Pottery, Gastronomy</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Best time to visit</span>
              <span className="font-medium">May-October</span>
            </li>
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
      
      {/* Newsletter Subscribe */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Subscribe to Updates</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 mb-4 text-sm">
            Get the latest travel tips, hotel offers, and Sifnos insights delivered to your inbox.
          </p>
          <MailerLiteForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
