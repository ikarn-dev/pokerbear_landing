"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import GlassButton from "./glass-button";

export default function Nav() {
  const lenis = useLenis();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8"
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
          className="group flex items-center gap-1"
          aria-label="PokerBear home"
        >
          <Image
            src="/assets/nav_logo.png"
            alt="PokerBear logo"
            width={36}
            height={36}
            priority
            draggable={false}
            className="size-9 rounded-xl"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            PokerBear
          </span>
        </button>

        {/* CTA */}
        <GlassButton
          label="Get started"
          onClick={() =>
            lenis?.scrollTo("#pricing", { offset: -40, duration: 1.4 })
          }
          className="px-5 py-2.5 text-sm"
        />
      </nav>
    </motion.header>
  );
}
