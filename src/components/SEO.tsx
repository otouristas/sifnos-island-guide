
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  schemaType?: 'Hotel' | 'TravelAgency' | 'Organization';
  canonical?: string;
}

type SchemaData = {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  [key: string]: any; // Allow for additional properties based on schema type
}

export default function SEO({ title, description, keywords, schemaType = 'Organization', canonical }: SEOProps) {
  const baseSchema: SchemaData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": "Hotels Sifnos",
    "url": "https://hotelssifnos.com"
  };
  
  // Add additional schema data based on type
  let schemaData = {...baseSchema};
  if (schemaType === 'Hotel') {
    schemaData = {
      ...schemaData,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Apollonia",
        "addressRegion": "Sifnos",
        "addressCountry": "Greece"
      }
    };
  } else if (schemaType === 'TravelAgency') {
    schemaData = {
      ...schemaData,
      "description": "Find the best hotels and accommodations in Sifnos Island, Greece"
    };
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || "https://hotelssifnos.com"} />
      {canonical && <link rel="canonical" href={canonical} />}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
