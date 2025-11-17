import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts, BlogPost } from '@/data/blogPosts';

interface RelatedContentCarouselProps {
  currentPost: BlogPost;
  maxItems?: number;
}

export default function RelatedContentCarousel({ currentPost, maxItems = 6 }: RelatedContentCarouselProps) {
  const relatedPosts = blogPosts
    .filter(post => 
      post.slug !== currentPost.slug &&
      post.categories.some(cat => currentPost.categories.includes(cat))
    )
    .slice(0, maxItems);

  if (relatedPosts.length === 0) {
    // Fallback to any other posts if no related found
    const otherPosts = blogPosts
      .filter(post => post.slug !== currentPost.slug)
      .slice(0, maxItems);
    
    if (otherPosts.length === 0) return null;
    
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-sifnos-deep-blue mb-2">
              More from Our Blog
            </h2>
            <p className="text-gray-600">
              Discover more travel guides and tips for Sifnos
            </p>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {otherPosts.map((post) => (
                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link to={`/blog/${post.slug}`}>
                    <Card className="h-full border-2 border-gray-100 hover:border-sifnos-turquoise/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="font-heading font-bold text-lg text-sifnos-deep-blue mb-2 group-hover:text-sifnos-turquoise transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sifnos-deep-blue font-medium text-sm group-hover:text-sifnos-turquoise transition-colors">
                          <span>Read More</span>
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-sifnos-deep-blue mb-2">
            Related Articles
          </h2>
          <p className="text-gray-600">
            Continue reading about Sifnos with these related guides
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {relatedPosts.map((post) => (
              <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                <Link to={`/blog/${post.slug}`}>
                  <Card className="h-full border-2 border-gray-100 hover:border-sifnos-turquoise/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-heading font-bold text-lg text-sifnos-deep-blue mb-2 group-hover:text-sifnos-turquoise transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sifnos-deep-blue font-medium text-sm group-hover:text-sifnos-turquoise transition-colors">
                        <span>Read More</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

