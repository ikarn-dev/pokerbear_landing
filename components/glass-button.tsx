import RollingText from "./rolling-text";

type GlassButtonProps = {
  readonly label: string;
  /** When set, renders an anchor that opens the URL in a new tab. */
  readonly href?: string;
  readonly onClick?: () => void;
  /** Extra classes for sizing/spacing (e.g. padding, text size, margins). */
  readonly className?: string;
  readonly ariaLabel?: string;
};

// Shared liquid-glass style: frosted translucent pill with a rim highlight,
// top sheen, drop shadow, and an orange edge glow on hover. Sizing/spacing is
// left to the caller via `className`.
const BASE =
  "group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 font-display font-semibold text-white shadow-[0_10px_34px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[2px] backdrop-saturate-150 transition-[transform,border-color,box-shadow] duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent hover:border-brand-orange/40 hover:shadow-[0_10px_34px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.55),0_0_24px_-6px_var(--brand-orange),inset_0_0_14px_-6px_var(--brand-orange)] active:scale-95";

/**
 * Primary call-to-action in the app's liquid-glass style, with the
 * per-character rolling-text hover microinteraction. Renders an anchor when
 * `href` is provided (opens in a new tab), otherwise a button.
 */
export default function GlassButton({
  label,
  href,
  onClick,
  className = "",
  ariaLabel,
}: GlassButtonProps) {
  if (href !== undefined) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`${BASE} ${className}`}
      >
        <RollingText>{label}</RollingText>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${BASE} ${className}`}
    >
      <RollingText>{label}</RollingText>
    </button>
  );
}
