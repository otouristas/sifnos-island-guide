import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * OptimizedImage Component
 * 
 * Provides automatic image optimization with:
 * - WebP format support with fallback
 * - Responsive srcset for different screen sizes
 * - Lazy loading (unless priority is set)
 * - Loading states
 * - Error handling
 * 
 * @example
 * <OptimizedImage
 *   src="/hero-image.jpg"
 *   alt="Beautiful Sifnos Beach"
 *   width={1920}
 *   height={1080}
 *   priority={true}
 *   sizes="100vw"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = '100vw',
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate WebP source if original is JPG/PNG
  const getWebPSrc = (originalSrc: string): string => {
    if (originalSrc.match(/\.(jpg|jpeg|png)$/i)) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return originalSrc;
  };

  // Generate responsive srcset for different screen sizes
  const generateSrcSet = (originalSrc: string, format: 'webp' | 'original' = 'original'): string => {
    const baseUrl = format === 'webp' ? getWebPSrc(originalSrc) : originalSrc;
    const sizes = [640, 768, 1024, 1280, 1536, 1920];
    
    // If it's a hero or large image, generate multiple sizes
    if (width && width >= 1024) {
      return sizes
        .filter(size => size <= (width || 1920))
        .map(size => {
          const scaledUrl = baseUrl.replace(/\.(webp|jpg|jpeg|png)$/i, `-${size}w.$1`);
          return `${scaledUrl} ${size}w`;
        })
        .join(', ');
    }
    
    return baseUrl;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Fallback to placeholder if error
  const displaySrc = hasError ? '/placeholder.svg' : src;

  return (
    <picture>
      {/* WebP source with srcset for modern browsers */}
      {!hasError && (
        <source
          type="image/webp"
          srcSet={generateSrcSet(src, 'webp')}
          sizes={sizes}
        />
      )}
      
      {/* Original format as fallback */}
      <img
        src={displaySrc}
        srcSet={!hasError ? generateSrcSet(src, 'original') : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100',
          className
        )}
        {...props}
      />
    </picture>
  );
}

/**
 * Hero Image Component
 * Pre-configured for hero sections with priority loading
 */
export function HeroImage(props: Omit<OptimizedImageProps, 'priority' | 'sizes'>) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      sizes="100vw"
      fetchPriority="high"
    />
  );
}

/**
 * Card Image Component
 * Pre-configured for card images in grids
 */
export function CardImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}

