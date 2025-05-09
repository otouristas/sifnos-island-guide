
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, User, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';
import { slugify } from '@/lib/url-utils';

const BlogList = () => {
  return (
    <div className="space-y-6">
      {blogPosts.map((post) => (
        <Card key={post.slug} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <Link 
              to={`/blog/${post.slug}`} 
              className="block md:w-1/3 h-64 md:h-auto overflow-hidden"
            >
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    <Link to={`/blog/category/${slugify(category)}`}>
                      {category}
                    </Link>
                  </Badge>
                ))}
              </div>
              <Link to={`/blog/${post.slug}`} className="hover:underline">
                <h2 className="text-xl font-bold mb-3">{post.title}</h2>
              </Link>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex items-center text-xs text-gray-500 space-x-4 mb-4">
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-1" />
                  <span>{post.author}</span>
                </div>
              </div>
              
              <Button asChild variant="outline" className="mt-2">
                <Link to={`/blog/${post.slug}`}>
                  Read More
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
