"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const FAQS = [
  {
    q: "What is PokerBear?",
    a: "PokerBear is a privacy-first, fully collateralized football prediction market on Solana. The current World Cup devnet experience lets you browse fixtures, fund a private balance with Circle devnet USDC, place pre-kickoff Team A / Draw / Team B orders, and claim settled positions from one web app.",
  },
  {
    q: "What does PokerBear keep private — and what remains public?",
    a: "Your chosen outcome, limit price, quantity, minimum fill, exact internal balance and debit, position ownership, and claim witness are encrypted in your browser and evaluated by Arcium. Aggregate clearing prices, matched volume, market liability, outcomes, commitments, nullifiers, and proof receipts remain public for price discovery and solvency checks. Deposits, withdrawals, claim payouts, and the wallet accounts used to queue an order are still visible on Solana, so PokerBear does not claim full wallet unlinkability.",
  },
  {
    q: "How does a private order work?",
    a: "Your browser encrypts the order and your wallet signs a short-lived authorization that expires at market close or within five minutes. Arcium privately checks the outcome, price, size, minimum fill, and available balance across a complete matched set. Solana then commits the aggregate escrow funding and encrypted balance updates atomically; an unmatched set can be released after expiry.",
  },
  {
    q: "Who holds the collateral?",
    a: "Users pre-fund a Solana program-controlled aggregate pool; the matcher never takes custody. After a valid match, only the complete-set backing moves into that market's isolated escrow. This keeps every position fully collateralized, and a withdrawal authorization is bound to its owner, amount, and destination so an operator cannot redirect it.",
  },
  {
    q: "How is PokerBear different from a public or custodial prediction market?",
    a: "Public order books reveal a trader's side, size, and price before execution, while custodial platforms also require trust in an operator's internal ledger. PokerBear encrypts pre-trade strategy and owner-linked positions, keeps collateral and settlement rules on Solana, and publishes aggregate market data for price discovery and solvency checks. The practical benefit is less strategy leakage without giving up verifiable backing and resolution.",
  },
  {
    q: "How are football results settled?",
    a: "TxLINE supplies the football data and proof used by a separate no-custody settlement adapter. A result becomes final only after the adapter creates an immutable proof receipt and PokerBear's core program independently verifies it. If no valid proof arrives by the fixed deadline, anyone can void the market and each private note is refunded at its exact recorded cost. A separate Pyth adapter exists for compatible price markets, but it is not the World Cup settlement path.",
  },
  {
    q: "Which football markets can I trade?",
    a: "Managed football markets use Team A / Draw / Team B outcomes, and orders close before kickoff. Live scores and reference odds can continue updating after kickoff, but PokerBear does not offer in-play orders, lineup props, or leverage. TxLINE odds are reference data only: a fresh one-cent move invalidates the preview and asks you to confirm again instead of silently changing your encrypted limit.",
  },
  {
    q: "What market and portfolio tools are included?",
    a: "You can browse Live, Upcoming, and Past fixtures; filter by league, team, or local date; and inspect the provider favorite, compact trends, probability history, and derived OHLC candlestick views. The portfolio tracks private order status, positions, P/L, claims, deposits, and withdrawals, with optional Telegram alerts for fixture and settlement updates.",
  },
  {
    q: "Where is my private portfolio history stored?",
    a: "Private activity and recovery records are encrypted in your browser with keys derived from a wallet signature. Your portfolio can identify the opaque position notes that belong to you without publishing an owner-keyed position list. You can export an encrypted backup and restore it after clearing browser data or moving to another device.",
  },
  {
    q: "Is PokerBear live with real money, and what does it cost?",
    a: "The current release is a devnet test experience using valueless Circle Solana devnet USDC, not a production real-money market. Deposits must be at least 5 USDC and each order must cost at least 1 USDC. PokerBear charges no application withdrawal fee or product-level withdrawal minimum, although the transaction payer still pays Solana network fees.",
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
        <span className="mb-6 inline-flex items-center rounded-full border border-border bg-white/5 px-5 py-2 font-mono text-sm font-medium uppercase tracking-[0.22em] text-foreground/90">
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
