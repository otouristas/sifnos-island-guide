
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, User, ArrowRight, Search as SearchIcon } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = Array.from(
    new Set(blogPosts.flatMap((post) => post.categories))
  );

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.categories.includes(activeCategory);
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const matchesSearch =
      normalizedSearch === '' ||
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.excerpt.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Sifnos guides, hotels, beaches, family tips..."
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1 rounded-full border text-xs md:text-sm transition-colors ${
              activeCategory === 'All'
                ? 'bg-sifnos-deep-blue text-white border-sifnos-deep-blue'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All topics
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-full border text-xs md:text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-sifnos-deep-blue text-white border-sifnos-deep-blue'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.map((post) => (
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
