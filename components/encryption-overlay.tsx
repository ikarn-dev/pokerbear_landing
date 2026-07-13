"use client";

import { useEffect, useRef } from "react";

/**
 * Encryption-style shader overlay.
 *
 * Renders a full-bleed field of scrambling cipher glyphs on a canvas, in pure
 * grayscale (no color), with a soft vertical "scan" of brighter characters —
 * evoking data being encrypted/decrypted. Composited normally (not with a
 * color-mixing blend mode) so it never tints from the video underneath; keep
 * it faint via the `className` opacity so the footage stays fully visible.
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
    const FONT_SIZE = 16;
    const MUTATION_RATE = 0.08; // chance a glyph changes each update
    const STEP_MS = 1000 / 14; // scramble refresh rate (kept low on purpose)

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cols = 0;
    let rows = 0;
    let glyphs: string[] = [];
    let seeds: number[] = [];
    let dpr = 1;

    const randomGlyph = (): string =>
      GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));

    const resize = (): void => {
      const parent = canvas.parentElement ?? canvas;
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / FONT_SIZE);
      rows = Math.ceil(height / FONT_SIZE);

      glyphs = new Array<string>(cols * rows);
      seeds = new Array<number>(cols * rows);
      for (let i = 0; i < glyphs.length; i += 1) {
        glyphs[i] = randomGlyph();
        seeds[i] = Math.random();
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px ui-monospace, "SFMono-Regular", Menlo, monospace`;
      ctx.textBaseline = "top";
    };

    const drawFrame = (): void => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const idx = y * cols + x;

          if (Math.random() < MUTATION_RATE) {
            glyphs[idx] = randomGlyph();
          }

          // Flat, uniform faintness per cell — no sweeping wave.
          const alpha = 0.06 + seeds[idx] * 0.12;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillText(glyphs[idx], x * FONT_SIZE, y * FONT_SIZE);
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;

    if (reduceMotion) {
      // Static, faint single frame — no animation.
      drawFrame();
    } else {
      let last = 0;
      const loop = (time: number): void => {
        rafId = window.requestAnimationFrame(loop);
        if (time - last < STEP_MS) return;
        last = time;
        drawFrame();
      };
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
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
