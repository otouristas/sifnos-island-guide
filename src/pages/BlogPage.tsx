
import React from 'react';
import { Helmet } from 'react-helmet';
import SEO from '@/components/SEO';
import { blogPosts } from '@/data/blogPosts';
import BlogPageContent from '@/components/blog/BlogPageContent';

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
        title="Sifnos Travel Blog | Hotel Guides, Beaches & Local Tips for 2025"
        description="Plan your perfect Sifnos vacation with our expert travel guides, hotel reviews, beach recommendations, and local insights. Get insider tips for your 2025 Greek island getaway."
        keywords={['sifnos blog', 'sifnos travel guide', 'sifnos hotels guide', 'where to stay in sifnos', 'sifnos beaches', 'greek island travel']}
        schemaType="Article"
        canonical="/blog"
      />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(createBlogSchema())}
        </script>
      </Helmet>
      
      <BlogPageContent />
    </div>
  );
};

export default BlogPage;
