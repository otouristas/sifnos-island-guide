# Image Optimization Guide for Hotels Sifnos

## Overview
This guide explains how to optimize images for the Hotels Sifnos website to achieve optimal PageSpeed scores.

## Current Implementation

### 1. OptimizedImage Component
Located at `src/components/OptimizedImage.tsx`, this component automatically:
- Serves WebP format with JPG/PNG fallbacks
- Generates responsive srcset for different screen sizes
- Implements lazy loading (except for priority images)
- Adds proper width/height to prevent CLS (Cumulative Layout Shift)

### 2. Usage Examples

```tsx
// Hero Image (priority loading)
import { HeroImage } from '@/components/OptimizedImage';

<HeroImage
  src="/sifnos-hero.jpg"
  alt="Beautiful Sifnos coastline"
  width={1920}
  height={1080}
/>

// Card/Grid Image
import { CardImage } from '@/components/OptimizedImage';

<CardImage
  src="/hotel-image.jpg"
  alt="Hotel exterior"
  width={800}
  height={600}
/>
```

## Image Conversion Required

### Critical Images to Convert

1. **Hero Image** (`/public/sifnos-hero.jpg`)
   - Current size: ~2.5 MB
   - Target formats: WebP + original
   - Responsive sizes needed: 640w, 768w, 1024w, 1280w, 1536w, 1920w
   - Expected savings: ~595 KiB per PageSpeed report

2. **Hotel Images** (`/public/uploads/hotels/`)
   - Filadaki Hotel images
   - Villa Olivia images
   - ALK Hotel images
   - Morpheas Hotel images
   - All other hotel photos

### Conversion Tools

#### Option 1: Using Sharp (Node.js - Recommended)

Install Sharp:
```bash
npm install sharp --save-dev
```

Create conversion script `scripts/convert-images.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [640, 768, 1024, 1280, 1536, 1920];
const inputDir = './public';
const quality = 85;

async function convertImage(inputPath, filename) {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  const dirname = path.dirname(inputPath);
  
  // Original WebP conversion
  await sharp(inputPath)
    .webp({ quality })
    .toFile(path.join(dirname, `${basename}.webp`));
  
  console.log(`✓ Converted ${filename} to WebP`);
  
  // Generate responsive sizes for large images
  const metadata = await sharp(inputPath).metadata();
  
  if (metadata.width >= 1024) {
    for (const size of sizes) {
      if (size <= metadata.width) {
        // WebP version
        await sharp(inputPath)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality })
          .toFile(path.join(dirname, `${basename}-${size}w.webp`));
        
        // Original format version
        await sharp(inputPath)
          .resize(size, null, { withoutEnlargement: true })
          .toFile(path.join(dirname, `${basename}-${size}w${ext}`));
        
        console.log(`✓ Created ${size}w versions`);
      }
    }
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file) && !file.includes('-')) {
      await convertImage(fullPath, file);
    }
  }
}

// Start conversion
processDirectory(inputDir)
  .then(() => console.log('Image conversion complete!'))
  .catch(err => console.error('Error:', err));
```

Run the script:
```bash
node scripts/convert-images.js
```

#### Option 2: Using ImageMagick (Command Line)

Convert single image to WebP:
```bash
magick convert sifnos-hero.jpg -quality 85 sifnos-hero.webp
```

Generate responsive sizes:
```bash
# 640w
magick convert sifnos-hero.jpg -resize 640 -quality 85 sifnos-hero-640w.jpg
magick convert sifnos-hero.jpg -resize 640 -quality 85 sifnos-hero-640w.webp

# 768w
magick convert sifnos-hero.jpg -resize 768 -quality 85 sifnos-hero-768w.jpg
magick convert sifnos-hero.jpg -resize 768 -quality 85 sifnos-hero-768w.webp

# Continue for 1024w, 1280w, 1536w, 1920w
```

#### Option 3: Online Tools

For smaller batches, use:
- [Squoosh.app](https://squoosh.app/) - Google's image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [CloudConvert](https://cloudconvert.com/) - Batch conversion

### Batch Script for Windows PowerShell

```powershell
# Install ImageMagick first: https://imagemagick.org/script/download.php

$sizes = @(640, 768, 1024, 1280, 1536, 1920)
$quality = 85

Get-ChildItem -Path ".\public" -Filter "*.jpg" -Recurse | ForEach-Object {
    $basename = $_.BaseName
    $dir = $_.DirectoryName
    
    # Convert to WebP
    magick convert $_.FullName -quality $quality "$dir\$basename.webp"
    Write-Host "✓ Converted $($_.Name) to WebP"
    
    # Generate responsive sizes
    foreach ($size in $sizes) {
        magick convert $_.FullName -resize $size -quality $quality "$dir\$basename-${size}w.jpg"
        magick convert $_.FullName -resize $size -quality $quality "$dir\$basename-${size}w.webp"
        Write-Host "✓ Created ${size}w versions"
    }
}
```

## Expected Results

After converting all images:

### File Size Reductions
- Hero image: 2.5 MB → ~400 KB (84% reduction)
- Hotel images: ~3 MB total → ~800 KB (73% reduction)
- **Total savings: ~3,290 KiB**

### Performance Improvements
- **LCP (Largest Contentful Paint)**: 23.3s → < 2.5s
- **FCP (First Contentful Paint)**: 5.9s → < 1.8s
- **Performance Score**: 58 → 90+
- **Page Weight**: 13 MB → < 3 MB

## Deployment Checklist

- [ ] Convert hero image to WebP + responsive sizes
- [ ] Convert all hotel images in `/public/uploads/hotels/`
- [ ] Update image references if needed (component handles automatically)
- [ ] Test on staging environment
- [ ] Verify WebP support with browser DevTools
- [ ] Check LCP in PageSpeed Insights
- [ ] Deploy to production
- [ ] Monitor performance metrics

## Browser Support

WebP is supported by:
- Chrome 32+ (2014)
- Firefox 65+ (2019)
- Safari 14+ (2020)
- Edge 18+ (2018)

The `<picture>` element provides automatic fallback for older browsers.

## Additional Optimizations

1. **Implement Service Worker** for offline caching
2. **Use CDN** for image delivery (Cloudflare, Cloudinary, etc.)
3. **Enable HTTP/2** for parallel downloads
4. **Monitor** with Chrome DevTools Lighthouse regularly

## Maintenance

- Convert new images before upload
- Audit image sizes monthly
- Update responsive breakpoints if design changes
- Keep OptimizedImage component updated

