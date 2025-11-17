
import React from 'react';
import { Helmet } from 'react-helmet';
import { CalendarIcon, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogPosts';
import { Link, useNavigate } from 'react-router-dom';
import { slugify } from '@/lib/url-utils';
import { toast } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';

interface BlogPostProps {
  slug?: string;
}

const BlogPost = ({ slug }: BlogPostProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  // Find the blog post by slug
  const post = blogPosts.find(post => post.slug === slug);
  
  if (!post) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('blog.postNotFound')}</h2>
        <p className="mb-4">{t('blog.postNotFoundDescription')}</p>
        <Link to="/blog" className="text-blue-600 hover:underline">
          {t('blog.returnToBlog')}
        </Link>
      </div>
    );
  }
  
  // Process content for specific blog post updates
  let processedContent = post.content;
  
  // Special handling for the Sifnian cuisine guide
  if (post.slug === 'sifnian-cuisine-guide-2026') {
    console.log("Processing Sifnian cuisine guide content - removing specified sections");
    
    // More thorough removal of DOSA in Faros references
    processedContent = processedContent.replace(/DOSA in Faros|Dosa in Faros|or Dosa in Faros/g, '');
    
    // More thorough removal of the sections with full HTML context
    
    // Remove Marathotiganites (Fennel Fritters) section completely with any surrounding div
    processedContent = processedContent.replace(/<div[^>]*>[\s\S]*?Marathotiganites[\s\S]*?Exampela[\s\S]*?<\/div>/g, '');
    
    // Remove Kakavia (Fisherman's Soup) section completely with any surrounding div
    processedContent = processedContent.replace(/<div[^>]*>[\s\S]*?Kakavia[\s\S]*?Platis Gialos[\s\S]*?<\/div>/g, '');
    
    // Remove Savoro (Sweet and Sour Fish) section completely with any surrounding div
    processedContent = processedContent.replace(/<div[^>]*>[\s\S]*?Savoro[\s\S]*?Kamares[\s\S]*?<\/div>/g, '');
    
    // Remove Skepastaria and Fournaki descriptions
    processedContent = processedContent.replace(/<p[^>]*>[\s\S]*?Skepastaria[\s\S]*?<\/p>/g, '');
    processedContent = processedContent.replace(/<p[^>]*>[\s\S]*?Fournaki[\s\S]*?<\/p>/g, '');
    
    // Add Cantina fine dining if not already present
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
    
    // Show a toast notification to inform the user about the content update
    // Note: BlogPost doesn't have i18n context, keeping English for now
    // This is a less critical UI element
    toast.success("Blog content updated with latest information", {
      description: "Removed outdated content and added new restaurant information",
      duration: 5000
    });
  }
  
  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (content: string): number => {
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);
    return readingTime;
  };
  
  const readingTime = calculateReadingTime(post.content);
  
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
    "wordCount": post.content.split(' ').length.toString(),
    "timeRequired": `PT${readingTime}M`
  };
  
  return (
    <article className="prose prose-slate lg:prose-lg max-w-none">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(postSchema)}
        </script>
      </Helmet>
      
      {/* Post meta with reading time */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <CalendarIcon size={16} className="mr-1.5" />
          <span>{post.date}</span>
        </div>
        <div className="flex items-center">
          <User size={16} className="mr-1.5" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-1.5" />
          <span>{readingTime} min read</span>
        </div>
      </div>
      
      {/* Featured image */}
      <img 
        src={post.featuredImage} 
        alt={post.title} 
        className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-6"
      />
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {post.categories.map((category) => (
          <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1">
            <Link to={`/blog/category/${slugify(category)}`}>
              {category}
            </Link>
          </Badge>
        ))}
      </div>
      
      {/* Post content */}
      <div className="mt-8 space-y-6" dangerouslySetInnerHTML={{ __html: post.slug === 'sifnian-cuisine-guide-2026' ? processedContent : post.content }} />
      
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
