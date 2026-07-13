"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import EncryptionOverlay from "./encryption-overlay";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const HEADLINE = ["Play", "sharper.", "Win", "smarter."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

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
          aria-hidden
        />
        {/* Encryption-style cipher glyphs, monochrome and faint over the video */}
        <EncryptionOverlay className="opacity-50" />
        {/* Vignette + fade into page background for seamless blending */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_20%,transparent_20%,rgba(7,7,10,0.55)_65%,#07070a_100%)]" />
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
          {HEADLINE.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
              <motion.span
                variants={rise}
                className={`inline-block ${
                  i >= 2 ? "text-gradient-gold" : "text-foreground"
                }`}
              >
                {word}
                {i < HEADLINE.length - 1 ? "\u00A0" : ""}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>
    </section>
  );
}
