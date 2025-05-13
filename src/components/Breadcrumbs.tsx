
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { HomeIcon } from 'lucide-react';

interface BreadcrumbsProps {
  items?: Array<{
    label: string;
    href?: string;
  }>;
  currentPage?: string;
}

export default function Breadcrumbs({ items = [], currentPage }: BreadcrumbsProps) {
  const location = useLocation();
  
  // Generate schema.org breadcrumb structured data
  const generateBreadcrumbSchema = () => {
    const itemListElement = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://hotelssifnos.com'
      }
    ];
    
    let position = 2;
    
    // Add provided items to schema
    items.forEach(item => {
      if (item.href) {
        const itemUrl = item.href.startsWith('http') 
          ? item.href 
          : `https://hotelssifnos.com${item.href.startsWith('/') ? item.href : `/${item.href}`}`;
          
        itemListElement.push({
          '@type': 'ListItem',
          'position': position,
          'name': item.label,
          'item': itemUrl
        });
        position++;
      }
    });
    
    // Add current page if provided
    if (currentPage) {
      // For the last item (current page), ensure we have a valid URL
      const currentPageUrl = `https://hotelssifnos.com${location.pathname}`;
      
      itemListElement.push({
        '@type': 'ListItem',
        'position': position,
        'name': currentPage,
        'item': currentPageUrl
      });
    }
    
    // The core schema structure with required itemListElement
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': itemListElement
    };
  };
  
  const breadcrumbSchema = generateBreadcrumbSchema();
  
  return (
    <>
      {/* Inject schema.org structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Breadcrumb className="py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbSeparator />
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
          
          {currentPage && (
            <BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
