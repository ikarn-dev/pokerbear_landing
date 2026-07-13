"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Global smooth-scroll provider powered by Lenis.
 *
 * Runs on the browser's rAF loop so scrolling stays synced to the display
 * refresh rate (60fps+). Tuned for a light, responsive feel rather than a
 * heavy, laggy glide.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        // Interpolation factor — higher = snappier, more responsive
        lerp: 0.16,
        // Wheel smoothing on, touch left native for correct mobile feel
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1.25,
        touchMultiplier: 1.5,
        // Gentle easing curve (applies to programmatic scrollTo)
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}
