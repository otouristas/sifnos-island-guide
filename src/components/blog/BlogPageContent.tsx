
import React from 'react';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogList from '@/components/blog/BlogList';

const BlogPageContent = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sifnos-beige to-blue-50 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-sifnos-deep-blue mb-6">
            Sifnos Travel & Hotel Blog
          </h1>
          <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Expert guides, local insights, and travel tips to help you plan the perfect Sifnos getaway
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-8">
                Welcome to the Hotels Sifnos travel blog, your ultimate resource for discovering the beauty, culture, and hidden gems of this enchanting Cycladic island. From the best beaches and traditional villages to luxury stays and culinary experiences, our expert guides will help you plan an unforgettable Greek island escape. All content is carefully curated to provide you with accurate, helpful information for your perfect Sifnos vacation.
              </p>
              
              <BlogList />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPageContent;
