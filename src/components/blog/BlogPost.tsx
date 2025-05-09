
import React from 'react';
import { CalendarIcon, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogPosts';
import { Link } from 'react-router-dom';
import { slugify } from '@/lib/url-utils';

interface BlogPostProps {
  slug?: string;
}

const BlogPost = ({ slug }: BlogPostProps) => {
  // Find the blog post by slug
  const post = blogPosts.find(post => post.slug === slug);
  
  if (!post) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="mb-4">Sorry, the blog post you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="text-blue-600 hover:underline">
          Return to Blog
        </Link>
      </div>
    );
  }
  
  return (
    <article className="prose prose-slate lg:prose-lg max-w-none">
      {/* Post meta */}
      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <CalendarIcon size={16} className="mr-1" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center">
          <User size={16} className="mr-1" />
          <span>Touristas AI</span>
        </div>
      </div>
      
      {/* Featured image */}
      <img 
        src={post.featuredImage} 
        alt={post.title} 
        className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-8"
      />
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.categories.map((category) => (
          <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Link to={`/blog/category/${slugify(category)}`}>
              {category}
            </Link>
          </Badge>
        ))}
      </div>
      
      {/* Post content */}
      <div className="mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* Author note */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="italic text-gray-600 text-sm">
          This article was curated by Touristas AI, bringing you the most accurate and helpful information about Sifnos Island.
        </p>
      </div>
    </article>
  );
};

export default BlogPost;
