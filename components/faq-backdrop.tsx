/**
 * Static premium backdrop for the FAQ section.
 *
 * A neutral dark stage: a whisper of center lift, a soft vignette, film grain,
 * and top/bottom fades that blend the section into the hero above and footer
 * below. No color tint and no animation.
 */
export default function FaqBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {/* Faint neutral center lift for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_28%,rgba(255,255,255,0.025),transparent_70%)]" />

      {/* Soft vignette keeps focus centered */}
      <div className="absolute inset-0 bg-[radial-gradient(92%_72%_at_50%_42%,transparent,rgba(11,7,8,0.6))]" />

      {/* Film grain for premium texture */}
      <div className="faq-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      {/* Blend seamlessly with the hero above and footer below */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
