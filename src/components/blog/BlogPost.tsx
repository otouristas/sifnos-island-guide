
import React from 'react';
import { Helmet } from 'react-helmet';
import { CalendarIcon, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogPosts';
import { Link, useNavigate } from 'react-router-dom';
import { slugify } from '@/lib/url-utils';

interface BlogPostProps {
  slug?: string;
}

const BlogPost = ({ slug }: BlogPostProps) => {
  const navigate = useNavigate();
  
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
  
  // Process content for specific blog post updates
  let processedContent = post.content;
  
  // Special handling for the Sifnian cuisine guide
  if (post.slug === 'sifnian-cuisine-guide-2025') {
    console.log("Processing Sifnian cuisine guide content");
    
    // Remove references to DOSA in Faros
    processedContent = processedContent.replace(/DOSA in Faros|Dosa in Faros/g, '');
    
    // Remove Marathotiganites (Fennel Fritters) section
    processedContent = processedContent.replace(/<h3>Marathotiganites \(Fennel Fritters\)<\/h3><p>[^<]*<\/p>/g, '');
    
    // Remove Kakavia (Fisherman's Soup) section
    processedContent = processedContent.replace(/<h3>Kakavia \(Fisherman's Soup\)<\/h3><p>[^<]*<\/p>/g, '');
    
    // Remove Savoro (Sweet and Sour Fish) section
    processedContent = processedContent.replace(/<h3>Savoro \(Sweet and Sour Fish\)<\/h3><p>[^<]*<\/p>/g, '');
    
    // Remove Skepastaria and Fournaki descriptions
    processedContent = processedContent.replace(/Skepastaria[^<]*<\/p>/g, '');
    processedContent = processedContent.replace(/Fournaki[^<]*<\/p>/g, '');
    
    // Add Cantina fine dining
    if (!processedContent.includes('Cantina fine dining')) {
      const restaurantsSection = '<h2>Top Restaurants in Sifnos</h2>';
      if (processedContent.includes(restaurantsSection)) {
        processedContent = processedContent.replace(
          restaurantsSection,
          `${restaurantsSection}
          <h3>Cantina fine dining</h3>
          <p>Located in the heart of Apollonia, Cantina offers a sophisticated dining experience with creative interpretations of traditional Greek dishes using local ingredients. Their menu changes seasonally, but always features the freshest seafood and locally sourced produce prepared with modern techniques.</p>`
        );
      }
    }
  }
  
  // Create enhanced schema markup for the blog post with more detailed metadata
  const postSchema = {
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
    "dateModified": post.date, // Ideally should track last modified date
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hotelssifnos.com/blog/${post.slug}`
    },
    "keywords": post.categories.join(', ').toLowerCase(),
    "articleSection": post.categories[0] || "Travel",
    "wordCount": post.content.split(' ').length.toString()
  };
  
  return (
    <article className="prose prose-slate lg:prose-lg max-w-none">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(postSchema)}
        </script>
      </Helmet>
      
      {/* Post meta */}
      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <CalendarIcon size={16} className="mr-1" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center">
          <User size={16} className="mr-1" />
          <span>{post.author}</span>
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
      <div className="mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: post.slug === 'sifnian-cuisine-guide-2025' ? processedContent : post.content }} />
      
      {/* Author note */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="italic text-gray-600 text-sm">
          This article was curated by {post.author}, bringing you the most accurate and helpful information about Sifnos Island.
        </p>
      </div>
    </article>
  );
};

export default BlogPost;
