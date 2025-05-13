
import { useState, useRef, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number;
  preventDefault?: boolean;
}

/**
 * Custom hook for handling swipe gestures on mobile
 */
export function useSwipe(
  element: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const { threshold = 50, preventDefault = true } = options;
  
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0, time: 0 });
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    };
    touchEnd.current = { x: 0, y: 0, time: 0 };
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    };
    
    // Optionally prevent default scrolling behavior
    if (preventDefault) {
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    const distX = touchEnd.current.x - touchStart.current.x;
    const distY = touchEnd.current.y - touchStart.current.y;
    const elapsedTime = touchEnd.current.time - touchStart.current.time;
    
    // Require swipes to be reasonably fast
    if (elapsedTime > 300) return;
    
    if (Math.abs(distX) > threshold && Math.abs(distX) > Math.abs(distY)) {
      if (distX > 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      } else if (distX < 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      }
    } else if (Math.abs(distY) > threshold && Math.abs(distY) > Math.abs(distX)) {
      if (distY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      } else if (distY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      }
    }
  };
  
  useEffect(() => {
    const currentElement = element.current;
    if (!currentElement) return;
    
    currentElement.addEventListener('touchstart', handleTouchStart);
    currentElement.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    currentElement.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      currentElement.removeEventListener('touchstart', handleTouchStart);
      currentElement.removeEventListener('touchmove', handleTouchMove);
      currentElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element.current, handlers.onSwipeLeft, handlers.onSwipeRight, handlers.onSwipeUp, handlers.onSwipeDown]);
}
