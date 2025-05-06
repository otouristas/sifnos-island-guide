
import { useEffect } from 'react';

/**
 * CacheBuster component
 * Forces the browser to reload fresh content by clearing caches
 * and implementing various cache-busting techniques
 */
const CacheBuster = () => {
  useEffect(() => {
    // Generate a unique timestamp
    const timestamp = new Date().getTime();
    const randomVal = Math.floor(Math.random() * 10000);
    
    // Add version meta tag
    const versionMeta = document.createElement('meta');
    versionMeta.name = 'app-version';
    versionMeta.content = `${timestamp}-${randomVal}`;
    document.head.appendChild(versionMeta);
    
    // Clear browser caches if supported
    if ('caches' in window) {
      console.log('Clearing browser caches...');
      caches.keys().then((names) => {
        names.forEach(name => {
          console.log(`Deleting cache: ${name}`);
          caches.delete(name);
        });
      }).catch(err => {
        console.error('Error clearing caches:', err);
      });
    }
    
    // Force reload without cache
    const forceReload = () => {
      console.log('Forcing reload without cache...');
      window.location.reload();
    };
    
    // Apply cache-busting to all images
    const applyCacheBustingToImages = () => {
      console.log('Applying cache-busting to images...');
      document.querySelectorAll('img').forEach(img => {
        if (!img.src) return;
        
        const newSrc = img.src.includes('?') 
          ? img.src.split('?')[0] + `?v=${timestamp}-${randomVal}` 
          : img.src + `?v=${timestamp}-${randomVal}`;
        
        img.setAttribute('src', newSrc);
      });
    };
    
    // Execute after DOM is fully loaded
    if (document.readyState === 'complete') {
      applyCacheBustingToImages();
    } else {
      window.addEventListener('load', () => {
        setTimeout(applyCacheBustingToImages, 300);
      });
    }
    
    return () => {
      // Clean up if needed
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default CacheBuster;
