"use client";

import { useEffect, useRef, useState } from "react";

type Logo = { readonly src: string; readonly alt: string };

// Brand-orange pills; logos are shown in their native colors (no inversion).
const LOGOS: readonly Logo[] = [
  { src: "/assets/arcium.svg", alt: "Arcium" },
  { src: "/assets/solanaLogo.svg", alt: "Solana" },
  { src: "/assets/pyth-logo-dark.svg", alt: "Pyth Network" },
  { src: "/assets/MagicBlock-Logo-White.svg", alt: "MagicBlock" },
  { src: "/assets/txline-logo.svg", alt: "txline" },
];

// Matter's Mouse stores its bound DOM handlers on these props; we detach the
// wheel/touch ones so the page keeps scrolling over the physics area.
type MouseHandlers = {
  readonly mousemove: EventListener;
  readonly mousedown: EventListener;
  readonly mouseup: EventListener;
  readonly mousewheel: EventListener;
};

/**
 * "Powered by" brand pills that drop with gravity and pile up at the bottom of
 * the footer (matter.js physics, DOM-synced). Draggable on desktop, paused
 * while off-screen, and falls back to a static row when reduced motion is on.
 */
export default function PoweredBy() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [physics, setPhysics] = useState(true);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene === null) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhysics(false);
      return;
    }

    let cancelled = false;
    let dispose = (): void => {};

    void (async () => {
      const Matter = (await import("matter-js")).default;
      const el = sceneRef.current;
      if (cancelled || el === null) return;

      const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;
      const pills = pillRefs.current.filter(
        (p): p is HTMLDivElement => p !== null
      );

      // Wait for the SVG logos to load so pill sizes measure correctly.
      const images = pills
        .map((p) => p.querySelector<HTMLImageElement>("img"))
        .filter((img): img is HTMLImageElement => img !== null);
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              })
        )
      );
      if (cancelled) return;

      let width = el.clientWidth;
      let height = el.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;

      const wall = { isStatic: true };
      const ground = Bodies.rectangle(width / 2, height + 40, width + 400, 80, wall);
      const leftWall = Bodies.rectangle(-40, height / 2, 80, height * 4, wall);
      const rightWall = Bodies.rectangle(width + 40, height / 2, 80, height * 4, wall);
      Composite.add(engine.world, [ground, leftWall, rightWall]);

      const bodies = pills.map((pill, i) => {
        const w = pill.offsetWidth || 130;
        const h = pill.offsetHeight || 42;
        const x = 60 + Math.random() * Math.max(1, width - 120);
        const y = -120 - i * 90 - Math.random() * 120;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: h / 2 },
          restitution: 0.2,
          friction: 0.7,
          frictionAir: 0.02,
          // Random slight tilt so the fall looks varied, but no spin — they
          // never tumble upside down.
          angle: (Math.random() - 0.5) * 0.5,
        });
        return body;
      });
      Composite.add(engine.world, bodies);

      const sync = (): void => {
        for (let i = 0; i < pills.length; i += 1) {
          const b = bodies[i];
          const p = pills[i];
          p.style.transform = `translate(${b.position.x - p.offsetWidth / 2}px, ${b.position.y - p.offsetHeight / 2}px) rotate(${b.angle}rad)`;
          p.style.opacity = "1";
        }
      };
      sync(); // place above the viewport and reveal (clipped by overflow)

      // Drag support (desktop). Detach wheel/touch listeners Matter binds so
      // the page still scrolls / mobile touch isn't hijacked.
      const mouse = Mouse.create(el);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2 },
      });
      Composite.add(engine.world, mouseConstraint);

      const handlers = mouse as unknown as MouseHandlers;
      el.removeEventListener("mousewheel", handlers.mousewheel);
      el.removeEventListener("DOMMouseScroll", handlers.mousewheel);
      el.removeEventListener("touchstart", handlers.mousedown);
      el.removeEventListener("touchmove", handlers.mousemove);
      el.removeEventListener("touchend", handlers.mouseup);

      let rafId = 0;
      let running = false;

      // Fixed 60fps timestep — matter.js recommends delta <= 16.667ms.
      const STEP = 1000 / 60;

      const loop = (): void => {
        rafId = window.requestAnimationFrame(loop);
        Engine.update(engine, STEP);
        sync();
      };

      const start = (): void => {
        if (running) return;
        running = true;
        rafId = window.requestAnimationFrame(loop);
      };
      const stop = (): void => {
        running = false;
        window.cancelAnimationFrame(rafId);
      };

      const onResize = (): void => {
        width = el.clientWidth;
        height = el.clientHeight;
        Body.setPosition(ground, { x: width / 2, y: height + 40 });
        Body.setPosition(rightWall, { x: width + 40, y: height / 2 });
      };
      window.addEventListener("resize", onResize);

      // Drop them in only once the footer is on screen.
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry !== undefined && entry.isIntersecting) start();
          else stop();
        },
        { threshold: 0.1 }
      );
      observer.observe(el);

      dispose = () => {
        observer.disconnect();
        stop();
        window.removeEventListener("resize", onResize);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <div className="mt-12 flex flex-1 flex-col">
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center rounded-full border border-brand-orange/30 bg-brand-orange/[0.1] px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
          Powered by
        </span>
      </div>
      <div
        ref={sceneRef}
        className={
          physics
            ? "relative min-h-[150px] w-full flex-1 overflow-hidden sm:min-h-[190px]"
            : "flex flex-1 flex-wrap items-center justify-center gap-3"
        }
      >
        {LOGOS.map((logo, i) => (
          <div
            key={logo.alt}
            ref={(node) => {
              pillRefs.current[i] = node;
            }}
            className={`inline-flex items-center rounded-full border border-white/20 bg-gradient-to-b from-brand-orange to-brand-pink px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-6px_14px_-8px_rgba(0,0,0,0.4),0_6px_18px_-8px_rgba(0,0,0,0.75)] sm:px-3 sm:py-1.5 ${
              physics
                ? "absolute left-0 top-0 opacity-0 will-change-transform cursor-grab active:cursor-grabbing"
                : "relative"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              draggable={false}
              className="pointer-events-none h-3.5 w-auto select-none sm:h-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
