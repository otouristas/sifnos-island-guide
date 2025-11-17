import { Helmet } from 'react-helmet';

interface HreflangProps {
  currentUrl: string;
  alternateLanguages?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export default function Hreflang({ currentUrl, alternateLanguages = [] }: HreflangProps) {
  // Default English version
  const defaultAlternates = [
    {
      hreflang: 'en',
      href: currentUrl
    },
    {
      hreflang: 'x-default',
      href: currentUrl
    }
  ];

  // Merge with provided alternates
  const allAlternates = [...defaultAlternates, ...alternateLanguages];

  return (
    <Helmet>
      {allAlternates.map((alt) => (
        <link
          key={alt.hreflang}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.href}
        />
      ))}
    </Helmet>
  );
}

