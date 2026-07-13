"use client";

import { useEffect, useRef } from "react";

/**
 * Encryption-style overlay.
 *
 * A sparse, flat field of grayscale cipher glyphs on a canvas. To stay cheap on
 * the main thread (so it never fights scrolling), the full field is drawn once,
 * then each tick only a small batch of random cells is re-scrambled instead of
 * repainting everything. The rAF loop is paused whenever the hero is off-screen.
 */
export default function EncryptionOverlay({
  className = "",
}: {
  readonly className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    const GLYPHS = "01ABCDEF#%&$@/<>[]{}=+*!?";
    const CELL = 22; // grid cell size in px (fewer, larger cells = cheaper)
    const DENSITY = 0.5; // fraction of cells that show a glyph
    const UPDATES_PER_TICK = 32; // cells re-scrambled per tick
    const STEP_MS = 1000 / 12;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cols = 0;
    let rows = 0;
    let alphas: number[] = [];
    let dpr = 1;

    const randomGlyph = (): string =>
      GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));

    const drawCell = (x: number, y: number): void => {
      const px = x * CELL;
      const py = y * CELL;
      ctx.clearRect(px, py, CELL, CELL);

      const alpha = alphas[y * cols + x];
      if (alpha <= 0) return;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillText(randomGlyph(), px + 2, py + 2);
    };

    const build = (): void => {
      const parent = canvas.parentElement ?? canvas;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      // Cap DPR: the effect is faint, so a smaller backing store is plenty.
      dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);

      alphas = new Array<number>(cols * rows);
      for (let i = 0; i < alphas.length; i += 1) {
        alphas[i] = Math.random() < DENSITY ? 0.06 + Math.random() * 0.12 : 0;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL - 6}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
      ctx.textBaseline = "top";

      // One-time full draw.
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          drawCell(x, y);
        }
      }
    };

    build();
    window.addEventListener("resize", build);

    let rafId = 0;
    let running = false;
    let last = 0;

    const loop = (time: number): void => {
      rafId = window.requestAnimationFrame(loop);
      if (time - last < STEP_MS) return;
      last = time;

      for (let n = 0; n < UPDATES_PER_TICK; n += 1) {
        drawCell(
          Math.floor(Math.random() * cols),
          Math.floor(Math.random() * rows)
        );
      }
    };

    const start = (): void => {
      if (running || reduceMotion) return;
      running = true;
      last = 0;
      rafId = window.requestAnimationFrame(loop);
    };

    const stop = (): void => {
      running = false;
      window.cancelAnimationFrame(rafId);
    };

    // Only animate while the hero is actually on-screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry !== undefined && entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      stop();
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
