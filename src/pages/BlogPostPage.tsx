
import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPost from '@/components/blog/BlogPost';
import SEO from '@/components/SEO';
import { blogPosts } from '@/data/blogPosts';
import { slugify } from '@/lib/url-utils';
import { toast } from "sonner";
import SchemaGenerator from '@/components/SchemaGenerator';

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
    
    // Special notification for the Sifnian cuisine guide
    if (slug === 'sifnian-cuisine-guide-2025') {
      console.log('Displaying updated Sifnian cuisine guide with removed content');
    }
  }, [slug, post, navigate]);
  
  // If post not found, redirect to blog index
  if (!post && slug) {
    console.log('Post not found, redirecting to blog index');
    return <Navigate to="/blog" replace />;
  }

  // Enhanced SEO title generation based on post content
  const generateSeoTitle = () => {
    if (!post) return 'Blog Post | Sifnos Travel Guide 2025';
    
    // Specific custom titles for certain blog posts
    if (post.slug === 'ultimate-guide-to-sifnos-hotels-2025') {
      return 'Sifnos Hotels Guide 2025 | Best Areas & Stays to Book | Hotels Sifnos';
    }
    
    if (post.slug === 'top-beaches-sifnos-2025') {
      return 'Best Beaches in Sifnos 2025 | Hidden Coves & Popular Shores | Sifnos Guide';
    }
    
    if (post.slug === 'family-friendly-sifnos-travel-guide') {
      return 'Family-Friendly Sifnos Guide 2025 | Activities, Hotels & Tips for Kids';
    }
    
    if (post.slug === 'luxury-stays-sifnos-island-2025') {
      return 'Luxury Sifnos Hotels & Villas 2025 | Premium Stays with Stunning Views';
    }
    
    if (post.slug === 'perfect-sifnos-itinerary-7-days') {
      return '7 Days in Sifnos | Perfect Itinerary 2025 | Day by Day Travel Guide';
    }
    
    if (post.slug === 'sifnos-food-guide-best-restaurants-cuisine') {
      return 'Sifnos Food Guide 2025 | Best Restaurants, Local Dishes & Culinary Experiences';
    }
    
    // Default title format for other posts
    return `${post.title} | Sifnos Island Travel Guide 2025`;
  };
  
  // Enhanced SEO description generation
  const generateSeoDescription = () => {
    if (!post) return "Read our detailed guide about Sifnos island, accommodations, beaches, and local culture.";
    
    // Create a more compelling and keyword-rich description based on post content
    if (post.categories.includes('Beaches')) {
      return `Discover the best beaches in Sifnos for 2025, from secluded coves to popular shores. Find information on facilities, access, water conditions, and nearby accommodations for your perfect beach day.`;
    }
    
    if (post.categories.includes('Family Travel')) {
      return `Plan your family vacation to Sifnos with our comprehensive 2025 guide. Find family-friendly hotels, kid-approved activities, safe beaches, and practical tips for traveling with children of all ages.`;
    }
    
    if (post.categories.includes('Luxury')) {
      return `Experience luxury in Sifnos with our exclusive guide to premium accommodations, upscale dining, private beaches, and bespoke experiences. Find the perfect high-end villa or 5-star hotel for your 2025 vacation.`;
    }
    
    if (post.categories.includes('Itineraries')) {
      return `Follow our perfect 7-day Sifnos itinerary for 2025. Day-by-day guide with the best beaches, villages, restaurants, and cultural experiences to make the most of your Greek island vacation.`;
    }
    
    if (post.categories.includes('Food')) {
      return `Explore Sifnos' renowned culinary scene with our 2025 food guide. Discover traditional dishes, award-winning restaurants, cooking classes, and the best places to experience authentic Greek cuisine.`;
    }
    
    // Default description using the post excerpt
    return post.excerpt || "Read our detailed guide about Sifnos island, accommodations, beaches, and local culture.";
  };
  
  return (
    <div>
      <SEO
        title={generateSeoTitle()}
        description={generateSeoDescription()}
        schemaType="Article"
        canonical={post ? `/blog/${post.slug}` : "/blog"} 
        imageUrl={post?.featuredImage}
        datePublished={post?.date}
        author={post?.author || "Touristas AI"}
        keywords={post?.categories.map(category => category.toLowerCase()) || ['sifnos travel', 'greek islands']}
      />
      
      {/* Enhanced Schema.org JSON-LD */}
      {post && (
        <SchemaGenerator 
          pageType="BlogPost"
          data={{
            name: post.title,
            description: generateSeoDescription(),
            image: post.featuredImage,
            datePublished: post.date,
            dateModified: post.lastUpdated || post.date,
            author: post.author,
            breadcrumbs: [
              { name: "Home", item: "https://hotelssifnos.com/" },
              { name: "Blog", item: "https://hotelssifnos.com/blog" },
              { name: post.title, item: `https://hotelssifnos.com/blog/${post.slug}` }
            ]
          }}
        />
      )}
      
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
