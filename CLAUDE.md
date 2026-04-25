# Codebase overview

Single-file React portfolio app: `profile-motion.jsx`. Loaded via ESM from a CDN (no build step). Mounted at `#profile-motion-root`.

## Stack
- React 18 via `esm.sh` imports (no npm, no bundler)
- All CSS is a single `<style>` block inside `PortfolioApp` JSX
- Images: `macbook.png`, `iphone.png`, `iphone2.png`, `iphone3.png`, `ds4.svg` (logo)

## Structure

```
PortfolioApp          — root, tab state, all CSS
  WorkSection         — scroll-driven animation, two phases
  AboutSection        — static split-card grid
  ContactSection      — mailto form
  CvSection           — PDF embed
```

## Key design tokens (CSS vars)
| Var | Value | Purpose |
|-----|-------|---------|
| `--work-gap` | 56px | Standard vertical gap between cards/sections |
| `--pointer-size` | 14px | Triangle pointer protrusion |
| `--pointer-protrusion` | `pointer-size + 1px` | Used in spacing calculations to account for pointer extent |
| `--mobile-flow-gap` | `clamp(24px,6vw,34px)` | Mobile card-to-card gap |
| `--card-outline` | `#4f5c61` | Card border colour |
| `--radius-lg` | 24px | Card border-radius |

## WorkSection scroll phases (desktop ≥941px)
1. `hero_idle` — hero bio text visible, macbook image at right
2. `hero_to_card1_swap` — 220ms crossfade hero → card1
3. `card1_scroll` — card1 shown (half-left, pointer-right), macbook stays
4. `card2_cluster` — iphone cluster fades in (position:fixed, bottom:0, left:0), card2 shown (half-right, pointer-left)
5. `post_cluster` — cluster fades out, work-grid-post (cards 3+4) follows

Mobile (<941px): linear flow — hero → macbook → card1 (pointer-top) → card2 (pointer-bottom) → iphone cluster → cards 3+4.

## Triangle pointers (polished rotated-square technique)
All `pointer-*` directions use a **rotated square** (not CSS border trick) for antialiased edges:
- `::before` — rotated 45° square, `width/height: pointer-size * 1.42`, has `border: 1px solid card-outline` + `background: #171717`. Centered on the card edge, half protrudes outside.
- `::after` — rectangular cover (`background: #171717`, z-index above `::before`) hides the card-side half of the diamond. Extends 1px past the card edge and 1px wider on each side to eliminate sub-pixel wing-corner border artifacts.

Pointer-right/left are hidden on mobile (`display: none` for both `::before` and `::after`).

## Gap conventions
- Desktop card-to-card: `--work-gap` (56px)
- Mobile card-to-card: `--mobile-flow-gap`
- When a card has a pointer, add `--pointer-protrusion` to the adjacent element's margin to account for the protrusion (see `.mobile-macbook-wrap + .project-card.pointer-top`)
- For `pointer-bottom + iphone-cluster-mobile`: margin is `mobile-flow-gap + 54px` because the phones translate -40px upward into the gap (54 = pointer-size 14 + translateY 40)
- For `iphone-cluster-mobile + work-grid-post`: margin is `mobile-flow-gap - 40px` (negative) to compensate for the 40px dead space below iphone2's visual bottom inside the cluster box

## Assets
- `macbook.png` — right-aligned, `max-width: min(64vw,980px)`, `max-height: 60vh`
- `iphone.png` / `iphone3.png` — back-left/right in cluster, `scale(0.92) translateY(10px)` (slightly down vs iphone2)
- `iphone2.png` — front-center in cluster, `scale(1)`, overlaps siblings via negative margins
