
import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPost from '@/components/blog/BlogPost';
import SEO from '@/components/SEO';
import { blogPosts } from '@/data/blogPosts';
import { slugify } from '@/lib/url-utils';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the blog post by slug
  const post = blogPosts.find(post => post.slug === slug);
  
  // Ensure URLs are canonical - redirect if needed
  useEffect(() => {
    if (post && slug !== slugify(post.title)) {
      console.log('Non-canonical URL detected, should redirect to:', slugify(post.title));
      // Note: In a real SSR setup, we would handle this redirect on the server side
    }
  }, [slug, post]);
  
  return (
    <div>
      <SEO
        title={post ? `${post.title} | Sifnos Blog` : 'Blog Post | Sifnos Travel'}
        description={post?.excerpt || "Read our detailed guide and insights about Sifnos island, accommodations, beaches, and local culture."}
        schemaType="Article"
        canonical={post ? `/blog/${slugify(post.title)}` : undefined}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sifnos-beige to-blue-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4 hover:bg-gray-100">
            <Link to="/blog" className="flex items-center gap-2">
              <ChevronLeft size={16} />
              <span>Back to Blog</span>
            </Link>
          </Button>
          
          {post && (
            <h1 className="text-3xl md:text-4xl font-bold text-sifnos-deep-blue">
              {post.title}
            </h1>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">        
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
          {/* Main content */}
          <div className="w-full md:w-2/3 bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <BlogPost slug={slug} />
          </div>
          
          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
