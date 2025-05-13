
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageLoading } from "@/hooks/use-image-loading";
import { getWebpVersionUrl, generateResponsiveSrcSet } from "@/utils/image-utils";

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lowQualitySrc?: string;
  aspectRatio?: string;
  containerClassName?: string;
  fadeInDuration?: number;
}

export function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  aspectRatio = "aspect-[4/3]",
  className,
  containerClassName,
  fadeInDuration = 500,
  ...props
}: ProgressiveImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageRef, setImageRef] = useState<HTMLDivElement | null>(null);
  const { isLoading, hasError, imageSrc } = useImageLoading({ 
    src: getWebpVersionUrl(src)
  });

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    );
    
    observer.observe(imageRef);
    
    return () => {
      if (imageRef) observer.disconnect();
    };
  }, [imageRef]);

  return (
    <div 
      ref={setImageRef}
      className={cn(
        "overflow-hidden bg-muted relative", 
        aspectRatio,
        containerClassName
      )}
    >
      {/* Show skeleton while loading */}
      {(isLoading || !isVisible) && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {/* Show low quality placeholder during loading */}
      {isVisible && lowQualitySrc && (
        <img
          src={lowQualitySrc}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity",
            !isLoading ? "opacity-0" : "opacity-100"
          )}
          style={{ transitionDuration: `${fadeInDuration}ms` }}
        />
      )}
      
      {/* Main image with srcset for responsive loading */}
      {isVisible && (
        <img
          src={imageSrc}
          srcSet={generateResponsiveSrcSet(imageSrc)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          style={{ transitionDuration: `${fadeInDuration}ms` }}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}
