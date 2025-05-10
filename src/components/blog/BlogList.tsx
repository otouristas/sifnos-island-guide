
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, User, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';

const BlogList = () => {
  return (
    <div className="space-y-10">
      {blogPosts.map((post) => (
        <div key={post.id} className="border-b border-gray-200 pb-10 last:border-0">
          <Link to={`/blog/${post.slug}`} className="block group">
            <div className="relative mb-6 overflow-hidden rounded-lg">
              <img 
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex gap-4 text-white text-sm">
                  <div className="flex items-center">
                    <CalendarIcon size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-sifnos-deep-blue mb-3 group-hover:text-sifnos-turquoise transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category) => (
              <span key={category} className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                {category}
              </span>
            ))}
          </div>
          
          <Button asChild variant="outline" className="group">
            <Link to={`/blog/${post.slug}`} className="flex items-center">
              Read Full Article
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
