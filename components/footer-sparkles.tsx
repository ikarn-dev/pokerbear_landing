"use client";

import { useEffect, useRef } from "react";

type Sparkle = {
  readonly cx: number;
  readonly cy: number;
  readonly start: number;
  readonly duration: number;
  readonly size: number;
  readonly core: string;
  readonly glow: string;
};

// Warm fallback tints (used until the image sample is ready).
const FALLBACK: readonly (readonly [number, number, number])[] = [
  [255, 122, 24],
  [255, 61, 79],
  [255, 30, 99],
  [255, 210, 160],
];

/**
 * Footer sparkles.
 *
 * Maps the same square grid as the footer's mosaic artwork and randomly pops
 * short-lived, shiny star glints on individual cells. Sparkle colors are
 * sampled from the actual background image (brightened for shine) so they feel
 * native to it. Screen-blended and paused when the footer is off-screen.
 */
export default function FooterSparkles({
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

    const CELL = 22; // grid cell size — matches the mosaic tiles
    const MAX_SPARKLES = 26;
    const SPAWN_MS = 110;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

    // --- Image color sampling ---------------------------------------------
    let sampleData: Uint8ClampedArray | null = null;
    let sampleW = 0;
    let sampleH = 0;
    let imgAspect = 1;

    const image = new window.Image();
    image.decoding = "async";
    image.src = "/assets/footer.png";
    image.onload = (): void => {
      imgAspect = image.naturalHeight / image.naturalWidth;
      sampleW = 220;
      sampleH = Math.max(1, Math.round(imgAspect * sampleW));
      const off = document.createElement("canvas");
      off.width = sampleW;
      off.height = sampleH;
      const octx = off.getContext("2d");
      if (octx === null) return;
      octx.drawImage(image, 0, 0, sampleW, sampleH);
      try {
        sampleData = octx.getImageData(0, 0, sampleW, sampleH).data;
      } catch {
        sampleData = null; // sampling blocked — fall back to palette
      }
    };

    const brighten = (c: number, amount: number): number =>
      Math.round(c + (255 - c) * amount);

    const pickColor = (
      cx: number,
      cy: number
    ): { core: string; glow: string } => {
      let r: number;
      let g: number;
      let b: number;

      if (sampleData !== null && width > 0 && height > 0) {
        // Mirror the image's object-cover / object-top placement.
        const displayedH = width * imgAspect;
        const vExtent = Math.min(1, height / displayedH);
        const u = Math.min(0.999, Math.max(0, cx / width));
        const v = Math.min(0.999, Math.max(0, (cy / height) * vExtent));
        const sx = Math.floor(u * sampleW);
        const sy = Math.floor(v * sampleH);
        const i = (sy * sampleW + sx) * 4;
        r = sampleData[i];
        g = sampleData[i + 1];
        b = sampleData[i + 2];
      } else {
        const fallback = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
        [r, g, b] = fallback;
      }

      return {
        glow: `rgb(${r}, ${g}, ${b})`,
        core: `rgb(${brighten(r, 0.7)}, ${brighten(g, 0.7)}, ${brighten(b, 0.7)})`,
      };
    };

    // --- Geometry ----------------------------------------------------------
    const resize = (): void => {
      const parent = canvas.parentElement ?? canvas;
      width = parent.clientWidth;
      height = parent.clientHeight;

      dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // --- Sparkles ----------------------------------------------------------
    const sparkles: Sparkle[] = [];

    const spawn = (now: number): void => {
      const gx = Math.floor(Math.random() * cols);
      const gy = Math.floor(Math.random() * rows);
      const cx = gx * CELL + CELL / 2;
      const cy = gy * CELL + CELL / 2;
      const { core, glow } = pickColor(cx, cy);

      sparkles.push({
        cx,
        cy,
        start: now,
        duration: 700 + Math.random() * 900,
        size: CELL * (0.5 + Math.random() * 0.4),
        core,
        glow,
      });
    };

    const drawStar = (cx: number, cy: number, r: number): void => {
      const inner = r * 0.28;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + inner, cy - inner);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx + inner, cy + inner);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - inner, cy + inner);
      ctx.lineTo(cx - r, cy);
      ctx.lineTo(cx - inner, cy - inner);
      ctx.closePath();
      ctx.fill();
    };

    let rafId = 0;
    let running = false;
    let lastSpawn = 0;

    const loop = (now: number): void => {
      rafId = window.requestAnimationFrame(loop);
      ctx.clearRect(0, 0, width, height);

      if (now - lastSpawn > SPAWN_MS && sparkles.length < MAX_SPARKLES) {
        spawn(now);
        lastSpawn = now;
      }

      for (let i = sparkles.length - 1; i >= 0; i -= 1) {
        const s = sparkles[i];
        const progress = (now - s.start) / s.duration;
        if (progress >= 1) {
          sparkles.splice(i, 1);
          continue;
        }

        const alpha = Math.sin(progress * Math.PI);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = s.glow;
        ctx.shadowBlur = s.size * 1.6;
        ctx.fillStyle = s.core;
        drawStar(s.cx, s.cy, s.size * (0.5 + 0.5 * alpha));
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const start = (): void => {
      if (running || reduceMotion) return;
      running = true;
      lastSpawn = 0;
      rafId = window.requestAnimationFrame(loop);
    };

    const stop = (): void => {
      running = false;
      window.cancelAnimationFrame(rafId);
    };

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
      window.removeEventListener("resize", resize);
      image.onload = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    />
  );
}
