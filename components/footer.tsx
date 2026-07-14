"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import GlassButton from "./glass-button";

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
          draggable={false}
          className="object-cover object-top brightness-[0.75] saturate-[0.7]"
        />
      </div>

      {/* Subtle brand-tinted scrim (orange → pink) that keeps text legible */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,7,8,0.55)_0%,rgba(255,122,24,0.10)_38%,rgba(255,30,99,0.12)_66%,rgba(11,7,8,0.6)_100%)]" />

      {/* Faded backdrop behind the bottom bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/45 to-transparent" />

      {/* min-h is sized to preserve the current footer height while mt-auto
          pins the bottom bar to the bottom edge. */}
      <div className="relative flex min-h-[512px] w-full flex-col px-6 pt-24 pb-10 [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] sm:min-h-[640px] sm:px-10 sm:pb-12 sm:pt-36 lg:px-16">
        {/* CTA — the glass button is kept OUT of any opacity/filter-animated
            wrapper so its backdrop-filter renders on first paint (an animating
            opacity ancestor otherwise defers the blur until the fade ends). */}
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="display-lg text-balance"
          >
            Make your <span className="text-gradient-brand">call</span>.
          </motion.h2>
          <GlassButton
            label="Start predicting"
            onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
            className="mt-6 px-6 py-3 text-sm sm:mt-7 sm:px-8 sm:py-3.5 sm:text-base"
          />
        </div>

        {/* Pinned to the bottom edge */}
        <div className="mt-auto">
        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-6 border-t border-border pt-8 md:flex-row md:justify-between">
          {/* Brand */}
          <button
            onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
            className="flex items-center gap-1"
            aria-label="Back to top"
          >
            <Image
              src="/assets/nav_logo.png"
              alt="PokerBear logo"
              width={32}
              height={32}
              draggable={false}
              className="size-8 rounded-lg"
            />
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
      </div>
    </footer>
  );
}
