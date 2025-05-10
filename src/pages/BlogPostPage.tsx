
import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPost from '@/components/blog/BlogPost';
import SEO from '@/components/SEO';
import { blogPosts } from '@/data/blogPosts';
import { slugify } from '@/lib/url-utils';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Find the blog post by slug
  const post = blogPosts.find(post => post.slug === slug);
  
  // Ensure URLs are canonical - redirect if needed
  useEffect(() => {
    if (post && slug !== post.slug) {
      console.log('Non-canonical URL detected, redirecting to:', post.slug);
      navigate(`/blog/${post.slug}`, { replace: true });
    }
  }, [slug, post, navigate]);
  
  // If post not found, redirect to blog index
  if (!post && slug) {
    console.log('Post not found, redirecting to blog index');
    return <Navigate to="/blog" replace />;
  }
  
  return (
    <div>
      <SEO
        title={post ? `${post.title} | Hotels in Sifnos 2025 Guide` : 'Blog Post | Sifnos Travel'}
        description={post?.excerpt || "Read our detailed guide and insights about Sifnos island, accommodations, beaches, and local culture."}
        schemaType="Article"
        canonical={post ? `/blog/${post.slug}` : undefined}
        imageUrl={post?.featuredImage}
        datePublished={post?.date}
        author="Touristas AI"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sifnos-beige to-blue-50 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6 hover:bg-gray-100">
            <Link to="/blog" className="flex items-center gap-2">
              <ChevronLeft size={16} />
              <span>Back to Blog</span>
            </Link>
          </Button>
          
          {post && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sifnos-deep-blue max-w-4xl">
              {post.title}
            </h1>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">        
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <BlogPost slug={slug} />
            </div>
          </div>
          
          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
