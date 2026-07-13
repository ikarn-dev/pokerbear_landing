# Agent Rules — PokerBear Landing

Guidance for any AI agent or contributor working in this repository. Follow these rules on every change.

## TypeScript: strict, no loose types

- `strict` mode is **always on** (`tsconfig.json`). Never disable or weaken compiler flags to make code pass.
- **No `any`.** Not explicit, not implicit. If a type is genuinely unknown, use `unknown` and narrow it before use.
- **No loose escapes:** avoid `as any`, `@ts-ignore`, `@ts-expect-error`, and non-null assertions (`!`) except at a proven-safe boundary with a short comment explaining why.
- Prefer precise types: `readonly` arrays/props where data is immutable, `as const` for literal tuples/objects, discriminated unions over boolean flags, and exhaustive `switch` handling.
- Type all public function signatures (params + return). Let inference handle obvious locals.
- Model domain data with explicit `type`/`interface` definitions rather than inline anonymous shapes that get repeated.
- Type check must pass with **zero errors** before a change is considered done: `pnpm exec tsc --noEmit`.

## React / Next.js best practices

- Server Components by default. Add `"use client"` only when a component needs state, effects, refs, browser APIs, or event handlers.
- Keep client components small and push them to the leaves of the tree. Do not mark a whole page client just to use one interactive widget.
- One component per file; name files in `kebab-case`, components in `PascalCase`.
- Derive state, don't duplicate it. Avoid redundant `useState` that mirrors props or other state.
- Every effect must have a correct, complete dependency array. No unstable inline objects/functions as deps without `useMemo`/`useCallback`.
- Reference static assets from `/public` by absolute path (e.g. `/assets/hero.webm`). Use `next/image` for images; use native `<video>` for video with `muted playsInline` for autoplay.
- Provide accessible markup: real `alt` text (empty `alt=""` + `aria-hidden` for purely decorative media), `aria-*` on interactive controls, keyboard-usable buttons.

## Design patterns & structure

- **Separation of concerns:** data/config (constant arrays, copy) declared at module top, presentation in the component body, side effects isolated in hooks.
- **Composition over configuration:** build small focused components and compose them; avoid god-components with many boolean mode props.
- **Single source of truth** for design tokens — colors, fonts, spacing live in `app/globals.css` (`@theme`) and Tailwind classes, not hard-coded hex values scattered across components.
- **DRY:** extract repeated markup/logic into a shared component or helper once it appears a third time.
- Keep functions small and pure where possible; name things by intent, not implementation.
- Prefer early returns over deep nesting.

## Performance & motion

- Target a smooth 60fps. Animate only `transform` and `opacity`; avoid animating layout properties (width/height/top/left) on scroll.
- Respect `prefers-reduced-motion` (already handled globally in `globals.css`).
- Be deliberate with GPU-heavy effects (shaders, multiple videos). Prefer one live shader/video per viewport section.
- Smooth scroll is centralized via Lenis (`components/smooth-scroll.tsx`) — use `useLenis().scrollTo(...)` for anchor navigation instead of native anchor jumps.

## Definition of done

1. Code follows the rules above.
2. `pnpm exec tsc --noEmit` passes with zero errors.
3. No new ESLint warnings.
4. No unused code, imports, or dead props left behind.
