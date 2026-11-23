# Meena IVF: Design System

Direction: **warm editorial clinic**. Calm ivory paper, deep aubergine ink, and Meena plum (from the logo) for actions. It should feel like a premium women's-health brand, not a hospital template. Light mode only.

## Color (role → token → value)
| Role | Token | Value |
|---|---|---|
| Page background | `paper` | #FBF7F2 |
| Calm surface (lavender mist) | `mist` | #F3EEF6 |
| Warm surface | `blush` | #F7E6E0 |
| Card surface | `card` | #FFFFFF |
| Primary text | `ink` | #24122B |
| Secondary text | `ink-2` | #4A3A50 |
| Muted text (≥5.9:1 on paper) | `muted` | #6B5A70 |
| Borders / dividers | `line` | #E7DDE6 |
| **Primary: buttons, links, focus** | `plum` | #80298F (7.4:1 on paper, 8:1 white-on) |
| Primary hover | `plum-700` | #6B1F78 |
| Dark sections | `plum-900` | #2E0D36 |
| Brand secondary (logo script), large text/decoration only | `lavender` | #7B6BB0 |
| Lavender text-safe | `lavender-700` | #5B4C94 |
| Light tint (chips, selected) | `lilac` | #EBE3F4 |
| Highlight (stars, tiny accents) | `honey` | #D9A441 |
| Success / error | `ok` / `err` | #2F7D5B / #B3261E |

No gradients on text. One soft radial "glow" (lilac→transparent) is allowed behind hero imagery.

## Typography
- Display: **Fraunces** (variable, opsz/SOFT). 400–500 weight, never bold. Tight tracking (-0.02em).
- UI/body: **Plus Jakarta Sans** 400/500/600.
- Bengali: **Hind Siliguri** 400/500/600 (blog, addresses).

Scale (px / line-height): display 72/1.02 (clamp 44→80) · h1 56/1.05 · h2 40/1.1 · h3 26/1.2 · h4 20/1.3 · body-lg 19/1.6 · body 16/1.65 · small 14/1.5 · eyebrow 12/1 uppercase 0.14em tracking.
Body measure 60–70ch.

## Spacing
4-based scale (Tailwind default). Section padding: 96px desktop / 64px mobile (`py-16 md:py-24`). Content width 1240px with 20px gutters (`container-x`).

## Shape and depth
Radius: 10 (inputs, chips), 18 (cards), 28 (large panels), full (buttons, pills). **Arch** mask (`rounded-t-full`) for portraits and hero images, drawn from the curve of the "M" mark.
Shadows: `soft` 0 1px 2px rgba(36,18,43,.06), 0 8px 24px -12px rgba(36,18,43,.12); `lift` 0 24px 48px -24px rgba(46,13,54,.28). Borders first, shadows second.

## Components
- **Button primary:** plum bg, white text, pill, 48px tall; hover plum-700; focus 2px plum ring with 2px paper offset; disabled 40% opacity.
- **Button secondary:** ink outline on transparent; hover mist bg.
- **Button quiet:** plum text + arrow, underline on hover.
- **Chips:** lilac bg, lavender-700 text, radius 999.
- **Cards:** white, `line` border, radius 18, padding 24–32; hover lifts 2px + `lift` shadow.
- **Inputs:** 48px, white, line border, radius 10, focus plum border + ring; error text below in `err`.
- **Nav:** sticky, paper with 80% opacity + blur on scroll, 6 items + Book button; mobile full-screen sheet.
- **Footer:** plum-900 background, ivory text.

## Imagery and icons
- Icons: **lucide-react**, 1.75 stroke, 20–24px.
- Photos: only the clinic's own (doctors, reception, families, events). No clip-art. Doctor cut-outs sit on lilac/blush arches.
- Motion: 600–900ms ease-out reveals (y 24px → 0), staggered 60ms; all disabled under `prefers-reduced-motion`.
