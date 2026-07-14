"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const FAQS = [
  {
    q: "Is PokerBear legal to use while playing?",
    a: "PokerBear is a study and analytics companion. It's built for reviewing your own hand histories, training, and off-table analysis. Always check the terms of the specific room or venue you play in — we never automate play or interact with live tables.",
  },
  {
    q: "Which sites and formats are supported?",
    a: "We support the major online rooms plus manual entry for live sessions. Cash, MTTs, and Sit & Gos are all covered, with hand-history import for the most popular platforms and a clean flow for logging live hands on the go.",
  },
  {
    q: "How real-time is the odds engine?",
    a: "The solver runs on-device and renders at 60fps, so equity, ranges, and GTO suggestions update the instant you change a card. No spinners, no waiting — just smooth, immediate feedback.",
  },
  {
    q: "Do I need a powerful computer?",
    a: "No. PokerBear is engineered to feel instant on modern laptops and phones. The heavy lifting is optimized to stay buttery smooth, even during deep multi-street analysis.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are month-to-month with no lock-in. Start with a free trial, and if it's not for you, cancel in two taps — your data export is always available.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>(() => FAQS.map(() => 0));
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measure = useCallback((): void => {
    setHeights(answerRefs.current.map((el) => el?.scrollHeight ?? 0));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts) {
      void document.fonts.ready.then(measure);
    }
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // When everything is closed the section stays compact (no reserved gap).
  // Once an item is open, reserve the tallest answer and absorb the difference
  // in a bottom spacer, so switching between items never shifts the footer.
  const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;
  const openHeight = open === null ? 0 : heights[open];
  const spacer = open === null ? 0 : Math.max(0, maxHeight - openHeight);

  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-24 lg:px-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-12 text-center"
      >
        <span className="mb-6 inline-flex items-center rounded-full border border-border bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-foreground/90">
          FAQ
        </span>
        <h2 className="display-lg text-balance">Questions, answered</h2>
      </motion.div>

      <div className="flex flex-col gap-2.5">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          const number = String(i + 1).padStart(2, "0");

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
              className={`overflow-hidden rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 ${
                isOpen
                  ? "border-brand-orange/55 bg-white/[0.035] shadow-[0_0_0_1px_rgba(255,122,24,0.3),0_0_14px_0_rgba(255,122,24,0.32)]"
                  : "border-border bg-white/[0.015] hover:bg-white/[0.03]"
              }`}
            >
              {/* Header row: number · question · toggle */}
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-5 sm:px-6 sm:py-[18px]"
              >
                <span
                  className={`w-5 shrink-0 font-mono text-[11px] tabular-nums transition-colors duration-300 sm:w-6 sm:text-xs ${
                    isOpen ? "text-brand-orange" : "text-muted"
                  }`}
                >
                  {number}
                </span>

                <span className="flex-1 font-display text-[clamp(0.8rem,0.66rem+0.6vw,1.15rem)] font-medium leading-snug tracking-tight">
                  {item.q}
                </span>

                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-300 sm:size-8 ${
                    isOpen
                      ? "border-brand-orange/60 text-brand-orange"
                      : "border-border text-foreground/55"
                  }`}
                >
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </button>

              {/* Answer — aligned under the question via a matching spacer */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? heights[i] : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="overflow-hidden"
              >
                <div
                  ref={(el) => {
                    answerRefs.current[i] = el;
                  }}
                  className="flex gap-3 px-4 pb-4 sm:gap-5 sm:px-6 sm:pb-5"
                >
                  <span aria-hidden className="w-5 shrink-0 sm:w-6" />
                  <p className="flex-1 max-w-2xl text-[clamp(0.82rem,0.76rem+0.3vw,0.975rem)] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Height reserve — keeps the section a constant height (footer stays put). */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ height: spacer }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>
    </section>
  );
}
