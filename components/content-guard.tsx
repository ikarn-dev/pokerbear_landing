"use client";

import { useEffect } from "react";

const BLOCKED_KEYS: readonly string[] = ["c", "x", "s", "u", "a", "p"];

/**
 * Best-effort content protection.
 *
 * Blocks the common copy/save/download entry points: context menu, copy/cut,
 * text selection, image/media dragging, and the matching keyboard shortcuts
 * (⌘/Ctrl + C/X/S/U/A/P). Note: client-side guards deter casual copying but
 * cannot fully prevent a determined user (e.g. via devtools).
 */
export default function ContentGuard() {
  useEffect(() => {
    const prevent = (event: Event): void => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.ctrlKey || event.metaKey) &&
        BLOCKED_KEYS.includes(event.key.toLowerCase())
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("selectstart", prevent);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
