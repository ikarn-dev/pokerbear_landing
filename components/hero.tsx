"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import GlassButton from "./glass-button";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const rise = {
  // Only opacity + transform (GPU-composited) — no filter/blur animation, which
  // would force per-frame repaints during the entrance.
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

// y-only variant (no opacity) for the glass button: an animating opacity
// ancestor would defer its backdrop-filter until the fade finished.
const riseNoFade = {
  hidden: { y: 28 },
  show: {
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const HEADLINE: readonly (readonly string[])[] = [
  ["Predict", "privately."],
  ["Win", "bigger."],
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Gentle parallax as you scroll past the hero.
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Background stage: looping video */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/hero.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload"
          draggable={false}
          aria-hidden
        />
        {/* Vignette + fade into page background for seamless blending */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_20%,transparent_20%,rgba(11,7,8,0.55)_65%,#0b0708_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </motion.div>

      {/* Title */}
      <motion.div
        style={{ y, opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <h1 className="display-xl text-balance">
          {HEADLINE.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block overflow-hidden pb-[0.12em]"
                >
                  <motion.span
                    variants={rise}
                    className={`inline-block ${
                      lineIndex === 1 ? "text-gradient-brand" : "text-foreground"
                    }`}
                  >
                    {word}
                    {wordIndex < line.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <motion.div variants={riseNoFade} className="mt-8">
          <GlassButton
            label="Start predicting"
            onClick={() =>
              lenis?.scrollTo("#faq", { offset: -80, duration: 1.4 })
            }
            className="px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
