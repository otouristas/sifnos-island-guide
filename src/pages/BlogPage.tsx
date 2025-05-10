
import React from 'react';
import { Helmet } from 'react-helmet';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogList from '@/components/blog/BlogList';
import SEO from '@/components/SEO';
import { blogPosts } from '@/data/blogPosts';

const BlogPage = () => {
  // Create schema markup for the blog posts
  const createBlogSchema = () => {
    const blogSchema = blogPosts.map(post => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": `https://hotelssifnos.com${post.featuredImage}`,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Hotels Sifnos",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hotelssifnos.com/lovable-uploads/18f3243f-e98a-4341-8b0a-e7ea71ce61bf.png"
        }
      },
      "datePublished": post.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://hotelssifnos.com/blog/${post.slug}`
      }
    }));
    
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": blogSchema.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": item
      }))
    };
  };

  return (
    <div>
      <SEO
        title="Sifnos Travel Blog | Tips, Guides & Hotel Insights for 2025"
        description="Discover where to stay in Sifnos in 2025—from boutique hotels to beach resorts. Find top-rated stays, travel tips & book smart with Touristas AI."
        keywords={['sifnos blog', 'sifnos hotels guide', 'where to stay in sifnos', 'sifnos travel tips', 'greek island accommodation']}
        schemaType="Article"
        canonical="/blog" // Fixed canonical URL to point to the blog page
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(createBlogSchema())}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sifnos-beige to-blue-50 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-sifnos-deep-blue mb-6">
            Sifnos Island Blog
          </h1>
          <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto">
            Discover the magic of Sifnos through our travel guides, local tips, and insider recommendations
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-8">
                Welcome to our Sifnos travel blog, your ultimate guide to discovering the beauty, culture, and hidden gems of this enchanting Cycladic island. All content is curated by Touristas AI to provide you with the most accurate and helpful information for your perfect Greek island getaway.
              </p>
              
              <BlogList />
            </div>
          </div>
          
          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
