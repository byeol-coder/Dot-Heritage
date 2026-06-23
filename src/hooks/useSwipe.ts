import { useRef } from 'react';

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const startX = useRef(0);
  const startY = useRef(0);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const dx = startX.current - e.changedTouches[0].clientX;
      const dy = startY.current - e.changedTouches[0].clientY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx > 0) onSwipeLeft();
      else onSwipeRight();
    },
  };
}
