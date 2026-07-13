"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative mx-auto w-full max-w-3xl px-6 py-28 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-14 text-center"
      >
        <span className="mb-4 inline-block rounded-full border border-border bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted">
          FAQ
        </span>
        <h2 className="display-lg text-balance">Questions, answered</h2>
        <p className="mx-auto mt-4 max-w-md text-balance text-muted">
          Everything you need to know before you go all in.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
              className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                isOpen
                  ? "border-white/15 bg-white/[0.04]"
                  : "border-border bg-white/[0.015] hover:bg-white/[0.03]"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                aria-expanded={isOpen}
              >
                <span className="font-display text-lg font-medium sm:text-xl">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-6 text-muted sm:px-6">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
