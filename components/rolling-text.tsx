/**
 * Per-character rolling text microinteraction for buttons.
 *
 * Each character is stacked as two copies inside a clipped cell. On hover of
 * the parent `.group`, every character rolls up individually with a small
 * staggered delay, so the label animates letter-by-letter rather than as one
 * block. Sits at `z-10` to stay above button sheen layers.
 */
export default function RollingText({
  children,
}: {
  readonly children: string;
}) {
  const characters = Array.from(children);

  return (
    <span aria-label={children} className="relative z-10 inline-flex">
      {characters.map((char, index) => {
        const display = char === " " ? "\u00A0" : char;
        const delay = `${index * 25}ms`;

        return (
          <span
            key={index}
            aria-hidden
            className="relative inline-block overflow-hidden"
          >
            <span
              className="inline-block transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
              style={{ transitionDelay: delay }}
            >
              {display}
            </span>
            <span
              className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
              style={{ transitionDelay: delay }}
            >
              {display}
            </span>
          </span>
        );
      })}
    </span>
  );
}
