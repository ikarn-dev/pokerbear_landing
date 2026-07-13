"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE_SELECTOR = "button, a, [role='button'], [data-cursor='hover']";

/**
 * Global custom cursor.
 *
 * A small dot that trails the pointer with a smooth spring and expands into a
 * ring when hovering interactive elements (buttons, links). Uses
 * `mix-blend-difference` so it stays visible over any background. Only enabled
 * on fine pointers (mouse/trackpad); touch devices keep the native behavior.
 */
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const handleMove = (event: MouseEvent): void => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const handleOver = (event: MouseEvent): void => {
      const { target } = event;
      if (target instanceof Element) {
        setHovering(target.closest(INTERACTIVE_SELECTOR) !== null);
      }
    };

    const handleLeave = (): void => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{
          scale: hovering ? 1 : 0.35,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="size-10 rounded-full bg-white mix-blend-difference"
      />
    </motion.div>
  );
}
