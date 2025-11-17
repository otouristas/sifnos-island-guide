import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { FileText, Video, BookOpen, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OwnerResourcesPage() {
  const guides = [
    {
      title: 'Getting Started Guide',
      description: 'Complete walkthrough for setting up your hotel listing',
      icon: BookOpen,
      type: 'PDF',
      downloadLink: '#'
    },
    {
      title: 'Photography Best Practices',
      description: 'How to capture stunning photos that convert browsers into bookers',
      icon: FileText,
      type: 'PDF',
      downloadLink: '#'
    },
    {
      title: 'Pricing Strategy Guide',
      description: 'Optimize your pricing for maximum occupancy and revenue',
      icon: FileText,
      type: 'PDF',
      downloadLink: '#'
    },
    {
      title: 'Guest Communication Templates',
      description: 'Pre-written messages for common guest inquiries',
      icon: FileText,
      type: 'PDF',
      downloadLink: '#'
    }
  ];

  const videoTutorials = [
    {
      title: 'Dashboard Overview',
      description: 'Learn to navigate your owner dashboard',
      duration: '5 min',
      thumbnail: '/placeholder.svg'
    },
    {
      title: 'Managing Bookings',
      description: 'Handle reservations and guest requests',
      duration: '8 min',
      thumbnail: '/placeholder.svg'
    },
    {
      title: 'Using Analytics',
      description: 'Understanding your performance metrics',
      duration: '6 min',
      thumbnail: '/placeholder.svg'
    }
  ];

  return (
    <>
      <SEO
        title="Hotel Owner Resources - Guides & Tutorials"
        description="Access guides, tutorials, and best practices to maximize your hotel's success on HotelsSifnos.com"
        schemaType="WebPage"
      />

      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Owner Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed as a hotel owner on our platform
            </p>
          </div>

          {/* Downloadable Guides */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl font-bold mb-8">Downloadable Guides</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <guide.icon className="h-10 w-10 text-primary" />
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                        {guide.type}
                      </span>
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Video Tutorials */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl font-bold mb-8">Video Tutorials</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative group cursor-pointer">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Video className="h-12 w-12 text-white" />
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl font-bold mb-8">Best Practices</h2>
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="font-heading text-xl font-semibold mb-4">Optimize Your Listing</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Upload at least 10 high-quality photos showcasing different areas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Write detailed descriptions highlighting unique features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Keep your calendar updated to avoid double bookings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Respond to inquiries within 24 hours for better visibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Encourage satisfied guests to leave reviews</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Help & Support CTA */}
          <section className="text-center bg-primary/5 rounded-2xl p-12">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Need More Help?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/owner-support">
                  Contact Support <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/hotel-owner-portal">View All Features</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
