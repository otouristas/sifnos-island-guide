
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPost from '@/components/blog/BlogPost';
import SEO from '@/components/SEO';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={`Blog | ${slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
        description="Read our detailed guide and insights about Sifnos island, accommodations, beaches, and local culture."
        schemaType="Article"
      />
      
      <Button variant="ghost" asChild className="mb-4 hover:bg-gray-100">
        <Link to="/blog" className="flex items-center gap-2">
          <ChevronLeft size={16} />
          <span>Back to Blog</span>
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content */}
        <div className="w-full md:w-2/3">
          <BlogPost slug={slug} />
        </div>
        
        {/* Sidebar */}
        <BlogSidebar />
      </div>
    </div>
  );
};

export default BlogPostPage;
