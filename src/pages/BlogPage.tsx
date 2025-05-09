
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogList from '@/components/blog/BlogList';
import SEO from '@/components/SEO';

const BlogPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Sifnos Travel Blog | Tips, Guides & Stories"
        description="Explore our Sifnos travel blog for insider tips, local guides, and stories to help plan your perfect Greek island getaway."
        keywords={['sifnos blog', 'greek island blog', 'cyclades travel guide', 'sifnos travel tips']}
        schemaType="Article"
      />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Sifnos Island Blog</h1>
          <p className="text-gray-600 mb-8">
            Welcome to our Sifnos travel blog, your guide to discovering the beauty, culture, and hidden gems of this enchanting Cycladic island.
          </p>
          
          <BlogList />
        </div>
        
        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </div>
  );
};

export default BlogPage;
