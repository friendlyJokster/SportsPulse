import React, { useRef, useState, useCallback } from 'react';
import { ActiveTab } from '../components/Navbar';
import { triggerHaptic } from '../utils/nativeMobileServices';

interface SwipeNavigationOptions {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  swipeTabs?: ActiveTab[];
  minSwipeDistance?: number;
  maxSwipeTimeMs?: number;
  enabled?: boolean;
}

export function useSwipeNavigation({
  activeTab,
  onNavigate,
  swipeTabs = ['home', 'matches', 'scoring'],
  minSwipeDistance = 45,
  maxSwipeTimeMs = 650,
  enabled = true
}: SwipeNavigationOptions) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isIgnoredTarget = useRef<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Mouse drag fallback for desktop emulation
  const mouseStartX = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const mouseStartTime = useRef<number>(0);
  const isMouseIgnored = useRef<boolean>(false);

  const currentTabIdx = swipeTabs.indexOf(activeTab);
  const isSwipeableTab = currentTabIdx !== -1;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || !isSwipeableTab || e.touches.length !== 1) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    // Check if touch originated on an element that shouldn't trigger full-page horizontal swipe
    const target = e.target as HTMLElement | null;
    if (target) {
      // Ignore input sliders, horizontally scrolling carousels, or interactive canvases
      const isSlider = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'range';
      const hasHorizontalScroll = target.closest('[data-no-swipe], .overflow-x-auto, input, select, textarea');
      if (isSlider || hasHorizontalScroll) {
        isIgnoredTarget.current = true;
        touchStartX.current = null;
        touchStartY.current = null;
        return;
      }
    }

    isIgnoredTarget.current = false;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  }, [enabled, isSwipeableTab]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enabled || isIgnoredTarget.current || touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;
    const elapsed = Date.now() - touchStartTime.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Must be a reasonably swift swipe
    if (elapsed > maxSwipeTimeMs) return;

    // Check for dominant horizontal gesture (avoid accidental triggers on vertical scroll)
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX < minSwipeDistance || absX < absY * 1.35) {
      return;
    }

    // Swipe Left (finger moved right-to-left) -> Next Tab
    if (diffX < 0) {
      if (currentTabIdx < swipeTabs.length - 1) {
        const nextTab = swipeTabs[currentTabIdx + 1];
        setSlideDirection('left');
        triggerHaptic('light');
        onNavigate(nextTab);
      }
    } 
    // Swipe Right (finger moved left-to-right) -> Previous Tab
    else if (diffX > 0) {
      if (currentTabIdx > 0) {
        const prevTab = swipeTabs[currentTabIdx - 1];
        setSlideDirection('right');
        triggerHaptic('light');
        onNavigate(prevTab);
      }
    }
  }, [enabled, isSwipeableTab, currentTabIdx, swipeTabs, minSwipeDistance, maxSwipeTimeMs, onNavigate]);

  // Desktop mouse drag navigation support
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled || !isSwipeableTab || e.button !== 0) {
      mouseStartX.current = null;
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target) {
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [data-no-swipe], .overflow-x-auto');
      if (isInteractive) {
        isMouseIgnored.current = true;
        mouseStartX.current = null;
        return;
      }
    }
    isMouseIgnored.current = false;
    mouseStartX.current = e.clientX;
    mouseStartY.current = e.clientY;
    mouseStartTime.current = Date.now();
  }, [enabled, isSwipeableTab]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (!enabled || isMouseIgnored.current || mouseStartX.current === null || mouseStartY.current === null) {
      return;
    }
    const endX = e.clientX;
    const endY = e.clientY;
    const diffX = endX - mouseStartX.current;
    const diffY = endY - mouseStartY.current;
    const elapsed = Date.now() - mouseStartTime.current;

    mouseStartX.current = null;
    mouseStartY.current = null;

    if (elapsed > maxSwipeTimeMs) return;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX < minSwipeDistance + 15 || absX < absY * 1.35) {
      return;
    }

    if (diffX < 0 && currentTabIdx < swipeTabs.length - 1) {
      const nextTab = swipeTabs[currentTabIdx + 1];
      setSlideDirection('left');
      triggerHaptic('light');
      onNavigate(nextTab);
    } else if (diffX > 0 && currentTabIdx > 0) {
      const prevTab = swipeTabs[currentTabIdx - 1];
      setSlideDirection('right');
      triggerHaptic('light');
      onNavigate(prevTab);
    }
  }, [enabled, isSwipeableTab, currentTabIdx, swipeTabs, minSwipeDistance, maxSwipeTimeMs, onNavigate]);

  return {
    touchHandlers: {
      onTouchStart,
      onTouchEnd,
      onMouseDown,
      onMouseUp
    },
    slideDirection,
    currentTabIdx,
    totalSwipeTabs: swipeTabs.length,
    isSwipeableTab,
    canSwipeLeft: currentTabIdx !== -1 && currentTabIdx < swipeTabs.length - 1,
    canSwipeRight: currentTabIdx > 0
  };
}
