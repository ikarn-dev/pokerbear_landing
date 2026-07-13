"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Odds engine", "Hand history", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Responsible play", "Security"],
  },
];

export default function Footer() {
  const lenis = useLenis();

  return (
    <footer id="pricing" className="relative overflow-hidden border-t border-border">
      {/* Brand image shown as-is, top-aligned so its upper portion stays visible */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/assets/footer.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          className="object-cover object-top"
        />
      </div>

      {/*
        Readability scrim: a translucent vertical gradient that lifts text
        contrast without hiding the artwork. Darker at the very top/bottom
        edges (behind the headline and link rows) and lightest through the
        middle so the image stays clearly visible.
      */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background/85" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 flex flex-col items-center text-center sm:mb-16"
        >
          <h2 className="display-lg text-balance">
            Ready to <span className="text-gradient-gold">raise</span> your game?
          </h2>
          <p className="mt-4 max-w-md text-balance text-muted">
            Start free for 14 days. No card required. Cancel anytime.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button className="w-full rounded-full bg-foreground px-7 py-3.5 text-base font-medium text-background transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:w-auto">
              Start free trial
            </button>
            <button className="w-full rounded-full border border-border bg-white/5 px-7 py-3.5 text-base font-medium backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto">
              Talk to us
            </button>
          </div>
        </motion.div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <button
              onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
              className="flex items-center gap-2.5"
              aria-label="Back to top"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-strong text-background">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4c4 0 7 2.9 7 6.8 0 4.5-3.1 8.2-7 8.2s-7-3.7-7-8.2C5 6.9 8 4 12 4Z"
                    fill="currentColor"
                  />
                  <circle cx="9.3" cy="10.5" r="1" fill="#07070a" />
                  <circle cx="14.7" cy="10.5" r="1" fill="#07070a" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold">PokerBear</span>
            </button>
            <p className="mt-4 max-w-xs text-sm text-muted">
              The modern poker companion. Built for players who take the game
              seriously.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-medium text-foreground">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} PokerBear. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="X / Twitter" className="transition-colors hover:text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.3 8.3L23.3 22h-6.8l-5.3-6.9L5.1 22H2l7.8-8.9L1 2h6.9l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
              </svg>
            </a>
            <a href="#" aria-label="Discord" className="transition-colors hover:text-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.3 5.3A17 17 0 0 0 15 4l-.2.4a12.7 12.7 0 0 1 3.8 1.9 12 12 0 0 0-10.9 0A12.7 12.7 0 0 1 11.5 4.4L11.3 4A17 17 0 0 0 7 5.3 17.8 17.8 0 0 0 3.9 17a17.2 17.2 0 0 0 5.2 2.6l.6-1a11.2 11.2 0 0 1-1.8-.9l.4-.3a12.3 12.3 0 0 0 10.5 0l.4.3c-.6.4-1.2.6-1.8.9l.6 1a17.1 17.1 0 0 0 5.2-2.6 17.8 17.8 0 0 0-3-11.7ZM9.5 14.4c-1 0-1.9-.9-1.9-2.1 0-1.1.8-2 1.9-2s1.9.9 1.9 2-.9 2.1-1.9 2.1Zm5 0c-1 0-1.9-.9-1.9-2.1 0-1.1.9-2 1.9-2s1.9.9 1.9 2-.8 2.1-1.9 2.1Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
