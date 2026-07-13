"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type FooterLink = {
  readonly label: string;
  readonly href: string;
  readonly anchor?: boolean;
};

const LINKS: readonly FooterLink[] = [
  { label: "How it works", href: "#faq", anchor: true },
  { label: "FAQ", href: "#faq", anchor: true },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();

  const goTo = (link: FooterLink): void => {
    if (link.anchor) {
      lenis?.scrollTo(link.href, { offset: -80, duration: 1.4 });
    }
  };

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
          className="object-cover object-top brightness-[0.4] saturate-[0.45]"
        />
      </div>

      {/* Readability scrim — keeps the artwork visible while lifting text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
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
          <p className="mt-3 max-w-md text-balance text-muted">
            Private, on-chain football prediction markets — powered by Arcium.
          </p>
          <button
            onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
            className="mt-7 rounded-full bg-foreground px-7 py-3.5 text-base font-medium text-background transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            Start predicting
          </button>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-6 border-t border-border pt-8 sm:mt-16 md:flex-row md:justify-between">
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
            <span className="font-display text-base font-semibold">
              PokerBear
            </span>
          </button>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => {
                  if (link.anchor) {
                    event.preventDefault();
                    goTo(link);
                  }
                }}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="X / Twitter"
              className="text-muted transition-colors hover:text-foreground"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.3 8.3L23.3 22h-6.8l-5.3-6.9L5.1 22H2l7.8-8.9L1 2h6.9l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="text-muted transition-colors hover:text-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.3 5.3A17 17 0 0 0 15 4l-.2.4a12.7 12.7 0 0 1 3.8 1.9 12 12 0 0 0-10.9 0A12.7 12.7 0 0 1 11.5 4.4L11.3 4A17 17 0 0 0 7 5.3 17.8 17.8 0 0 0 3.9 17a17.2 17.2 0 0 0 5.2 2.6l.6-1a11.2 11.2 0 0 1-1.8-.9l.4-.3a12.3 12.3 0 0 0 10.5 0l.4.3c-.6.4-1.2.6-1.8.9l.6 1a17.1 17.1 0 0 0 5.2-2.6 17.8 17.8 0 0 0-3-11.7ZM9.5 14.4c-1 0-1.9-.9-1.9-2.1 0-1.1.8-2 1.9-2s1.9.9 1.9 2-.9 2.1-1.9 2.1Zm5 0c-1 0-1.9-.9-1.9-2.1 0-1.1.9-2 1.9-2s1.9.9 1.9 2-.8 2.1-1.9 2.1Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Fine print */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
          <p>© {year} PokerBear. All rights reserved.</p>
          <p>18+ · Please predict responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
