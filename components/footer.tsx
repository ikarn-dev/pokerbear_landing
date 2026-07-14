"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import FooterSparkles from "./footer-sparkles";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();

  return (
    <footer
      id="pricing"
      className="relative overflow-hidden border-t border-border"
    >
      {/* Brand image shown as-is, top-aligned so its upper portion stays visible */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/assets/footer.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          className="object-cover object-top brightness-[0.75] saturate-[0.7]"
        />
      </div>

      {/* Subtle brand-tinted scrim (orange → pink) that keeps text legible */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,7,8,0.55)_0%,rgba(255,122,24,0.10)_38%,rgba(255,30,99,0.12)_66%,rgba(11,7,8,0.6)_100%)]" />

      {/* Shiny sparkles mapped to the mosaic grid, colored from the image */}
      <FooterSparkles />

      <div className="relative w-full px-6 py-24 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] sm:px-10 sm:py-36 lg:px-16">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="display-lg text-balance">
            Make your <span className="text-gradient-brand">call</span>.
          </h2>
          <button
            onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
            className="group relative mt-7 inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-medium text-white shadow-[0_10px_34px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md backdrop-saturate-150 transition-all duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent hover:scale-[1.03] hover:bg-white/[0.16] active:scale-95"
          >
            <span className="relative z-10">Start predicting</span>
          </button>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-24 flex flex-col items-center gap-6 border-t border-border pt-8 sm:mt-32 md:flex-row md:justify-between">
          {/* Brand */}
          <button
            onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
            className="flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-orange to-brand-pink text-background">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4c4 0 7 2.9 7 6.8 0 4.5-3.1 8.2-7 8.2s-7-3.7-7-8.2C5 6.9 8 4 12 4Z"
                  fill="currentColor"
                />
                <circle cx="9.3" cy="10.5" r="1" fill="#0b0708" />
                <circle cx="14.7" cy="10.5" r="1" fill="#0b0708" />
              </svg>
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              PokerBear
            </span>
          </button>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/PokerBearSol"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PokerBear on X"
              className="text-foreground/75 transition-colors hover:text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.3 8.3L23.3 22h-6.8l-5.3-6.9L5.1 22H2l7.8-8.9L1 2h6.9l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Fine print */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.95)] sm:flex-row">
          <p>© {year} PokerBear. All rights reserved.</p>
          <p>18+ · Please predict responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
