"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  const scrollTo = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      lenis?.scrollTo(href, { offset: -80, duration: 1.4 });
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-500 sm:px-4 ${
          scrolled
            ? "border-border bg-background/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand */}
        <button
          onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
          className="group flex items-center gap-2.5 pl-2"
          aria-label="PokerBear home"
        >
          <BearMark />
          <span className="font-display text-lg font-semibold tracking-tight">
            PokerBear
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="relative rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTo("#pricing")}
            className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:block"
          >
            Get started
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full border border-border md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Burger open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={
          open
            ? { opacity: 1, y: 0, pointerEvents: "auto" }
            : { opacity: 0, y: -12, pointerEvents: "none" }
        }
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-4 top-[76px] rounded-3xl border border-border bg-background/90 p-2 backdrop-blur-xl md:hidden"
      >
        {LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="block w-full rounded-2xl px-4 py-3 text-left text-base text-foreground/90 transition-colors hover:bg-white/5"
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => scrollTo("#pricing")}
          className="mt-1 block w-full rounded-2xl bg-foreground px-4 py-3 text-center text-base font-medium text-background"
        >
          Get started
        </button>
      </motion.div>
    </motion.header>
  );
}

function BearMark() {
  return (
    <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-strong text-background shadow-[0_4px_20px_-4px_var(--gold)] transition-transform duration-300 group-hover:rotate-6">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 6.5C6 5 5 4 3.6 4.4 2.6 4.7 2 5.8 2.3 6.9c.2.9 1 1.5 1.9 1.5M18 6.5C18 5 19 4 20.4 4.4c1 .3 1.6 1.4 1.3 2.5-.2.9-1 1.5-1.9 1.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M12 4c4 0 7 2.9 7 6.8 0 4.5-3.1 8.2-7 8.2s-7-3.7-7-8.2C5 6.9 8 4 12 4Z"
          fill="currentColor"
        />
        <circle cx="9.3" cy="10.5" r="1" fill="#07070a" />
        <circle cx="14.7" cy="10.5" r="1" fill="#07070a" />
        <path
          d="M12 13.2c.9 0 1.4.8 1 1.6-.2.4-.6.6-1 .6s-.8-.2-1-.6c-.4-.8.1-1.6 1-1.6Z"
          fill="#07070a"
        />
      </svg>
    </span>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <div className="relative h-3 w-4">
      <motion.span
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        className="absolute left-0 top-0 block h-0.5 w-4 rounded-full bg-foreground"
      />
      <motion.span
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        className="absolute left-0 top-1.5 block h-0.5 w-4 rounded-full bg-foreground"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        className="absolute bottom-0 left-0 block h-0.5 w-4 rounded-full bg-foreground"
      />
    </div>
  );
}
