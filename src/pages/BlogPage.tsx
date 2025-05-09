
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogList from '@/components/blog/BlogList';
import SEO from '@/components/SEO';

const BlogPage = () => {
  return (
    <div>
      <SEO
        title="Sifnos Travel Blog | Tips, Guides & Stories"
        description="Explore our Sifnos travel blog for insider tips, local guides, and stories to help plan your perfect Greek island getaway."
        keywords={['sifnos blog', 'greek island blog', 'cyclades travel guide', 'sifnos travel tips']}
        schemaType="Article"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-sifnos-deep-blue mb-4">
            Sifnos Island Blog
          </h1>
          <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto">
            Discover the magic of Sifnos through our travel stories, local tips, and insider guides
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
          {/* Main content */}
          <div className="w-full md:w-2/3 bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-8">
              Welcome to our Sifnos travel blog, your guide to discovering the beauty, culture, and hidden gems of this enchanting Cycladic island. All content is curated by Touristas AI to provide you with the most accurate and helpful information.
            </p>
            
            <BlogList />
          </div>
          
          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
