
import { useState, useEffect, useCallback } from 'react';

interface UseImageLoadingProps {
  src: string;
  loadingDelay?: number;
}

interface UseImageLoadingResult {
  isLoading: boolean;
  hasError: boolean;
  imageSrc: string;
}

/**
 * Custom hook for optimized image loading with error handling
 */
export function useImageLoading({ src, loadingDelay = 0 }: UseImageLoadingProps): UseImageLoadingResult {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoadImage = useCallback(() => {
    // If no source provided, mark as error
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      setImageSrc('/placeholder.svg');
      return;
    }

    const img = new Image();
    
    // Add timestamp to prevent caching
    const cacheBustSrc = src.includes('?') 
      ? `${src}&_t=${Date.now()}` 
      : `${src}?_t=${Date.now()}`;
    
    img.onload = () => {
      if (loadingDelay > 0) {
        // Optional delay for smooth UI transitions
        setTimeout(() => {
          setIsLoading(false);
          setHasError(false);
        }, loadingDelay);
      } else {
        setIsLoading(false);
        setHasError(false);
      }
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setIsLoading(false);
      setHasError(true);
      setImageSrc('/placeholder.svg');
    };
    
    img.src = cacheBustSrc;
    setImageSrc(cacheBustSrc);
    
  }, [src, loadingDelay]);

  // Load the image when the component mounts or src changes
  useEffect(() => {
    setIsLoading(true);
    handleLoadImage();
  }, [src, handleLoadImage]);

  return { isLoading, hasError, imageSrc };
}
