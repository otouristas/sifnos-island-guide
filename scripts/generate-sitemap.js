/**
 * Script to generate and update sitemap.xml
 * Run with: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const baseURL = 'https://hotelssifnos.com';
const currentDate = new Date().toISOString().split('T')[0];

// Static pages - all public routes
const staticPages = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/hotels', priority: 0.9, changefreq: 'daily' },
  { loc: '/touristas-ai', priority: 0.9, changefreq: 'daily' },
  { loc: '/beaches', priority: 0.8, changefreq: 'weekly' },
  { loc: '/where-to-stay-sifnos', priority: 0.9, changefreq: 'weekly' },
  { loc: '/ferry-tickets', priority: 0.9, changefreq: 'weekly' },
  { loc: '/best-beaches-sifnos-guide', priority: 0.8, changefreq: 'weekly' },
  { loc: '/luxury-hotels-sifnos', priority: 0.8, changefreq: 'weekly' },
  { loc: '/travel-guide', priority: 0.7, changefreq: 'monthly' },
  { loc: '/about', priority: 0.6, changefreq: 'monthly' },
  { loc: '/about-us', priority: 0.6, changefreq: 'monthly' },
  { loc: '/contact', priority: 0.5, changefreq: 'yearly' },
  { loc: '/faq', priority: 0.5, changefreq: 'monthly' },
  { loc: '/pricing', priority: 0.7, changefreq: 'monthly' },
  { loc: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/terms-of-service', priority: 0.3, changefreq: 'yearly' },
  { loc: '/cookie-policy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/blog', priority: 0.8, changefreq: 'weekly' },
  { loc: '/locations', priority: 0.8, changefreq: 'weekly' },
  { loc: '/hotel-types', priority: 0.8, changefreq: 'weekly' },
];

// Blog posts
const blogPosts = [
  { slug: 'ultimate-guide-to-sifnos-hotels-2025' },
  { slug: 'top-beaches-sifnos-2025' },
  { slug: 'family-friendly-sifnos-travel-guide' },
  { slug: 'luxury-stays-sifnos-island-2025' },
  { slug: 'perfect-sifnos-itinerary-7-days' },
  { slug: 'sifnos-food-guide-best-restaurants-cuisine' },
];

// Locations
const locations = [
  'apollonia', 'kamares', 'platis-gialos', 'kastro', 'vathi', 
  'faros', 'artemonas', 'herronisos', 'chrysopigi'
];

// Hotel types
const hotelTypes = [
  'luxury-hotels', 'boutique-hotels', 'beach-hotels', 
  'family-friendly-hotels', 'traditional-hotels', 'villas'
];

// Featured hotels (will be dynamically fetched, but include fallback)
const featuredHotels = [
  { slug: 'meropi-rooms-and-apartments', priority: 0.9 },
  { slug: 'filadaki-villas', priority: 0.9 },
  { slug: 'alk-hotel-sifnos', priority: 0.8 },
  { slug: 'villa-olivia-clara', priority: 0.8 },
  { slug: 'morpheas-pension-apartments', priority: 0.8 },
];

function generateSitemap() {
  let urls = [];

  // Add static pages
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseURL}${page.loc}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Add blog posts
  blogPosts.forEach(post => {
    urls.push({
      loc: `${baseURL}/blog/${post.slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    });
  });

  // Add location pages
  locations.forEach(location => {
    urls.push({
      loc: `${baseURL}/locations/${location}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Add hotel type pages
  hotelTypes.forEach(type => {
    urls.push({
      loc: `${baseURL}/hotel-types/${type}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Add featured hotels
  featuredHotels.forEach(hotel => {
    urls.push({
      loc: `${baseURL}/hotels/${hotel.slug}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: hotel.priority
    });
  });

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to file
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`   - Total URLs: ${urls.length}`);
  console.log(`   - Last modified: ${currentDate}`);
  console.log(`   - Saved to: ${sitemapPath}`);
}

generateSitemap();

