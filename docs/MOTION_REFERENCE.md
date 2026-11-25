# Motion Reference

How the portfolio moves. **Layout, colours and content come from our 24 mockups**
(`images for portfolio/`); **motion comes from the reference sites below**.
We rebuild the *effects* with our own code. We do not copy their code, images,
text or fonts.

Scanned 2026-11-25 with Playwright (scroll every 300 px, element transform /
opacity / blur / position sampled at each step, hover checks).

| Site | What it is good for |
|---|---|
| neiden.framer.media | Most motion: smooth scroll, sticky columns, stacking cards, showreel zoom, word-by-word text reveal, blur-in, number roll, marquees |
| marketinglab.framer.ai | Section rise-in reveals (39), process cards fanning in, client logo marquee, pricing toggle, floating testimonial cards |
| toms.framer.media | Project grid, cards scale in (0.96 → 1) while rising, 3D flip of service cards, big uppercase headings |
| creatorcut.framer.website | Dark theme, avatar marquee, stat counters, FAQ accordion, booking calendar |
| framer.com/projects/Conicorn… | Not scanned: it is a Framer editor link and needs a login. Need the published `.framer.website` link |

Libraries (installed in `apps/web`):

- **motion** (Framer Motion): the same engine Framer sites use. `whileInView`, `useScroll`, `useTransform`, `useSpring`, `AnimatePresence`.
- **lenis**: smooth scroll (Neiden and MarketingLab both use it).
- Tailwind CSS 4 for styling, `next/font` for fonts.

## Effect catalogue

Values are measured from the sites; treat them as starting points.

| # | Effect | Seen on | How it behaves | Build with |
|---|---|---|---|---|
| 1 | Smooth scroll | Neiden, MarketingLab | Inertia scrolling, anchor links glide | `Lenis` provider in root layout, synced to Motion |
| 2 | Rise-in reveal | All | Element starts `y: 40–60px` (toms: 140px), `opacity: 0`, eases to 0 when it enters the viewport, once | `motion.div` + `whileInView`, `viewport={{ once: true, amount: 0.2 }}` |
| 3 | Scale-in card | toms | Card starts `scale: 0.96`, `y: 60` → `1`, `0` | same as 2, plus `scale` |
| 4 | Blur-in | Neiden | Headings / images start `filter: blur(10px)` + fade, sharpen in | `whileInView` with `filter` |
| 5 | Staggered letters / words | Neiden | Heading letters rise from `y: 20` one after another | split text into spans, `staggerChildren` |
| 6 | Scroll-linked text colour | Neiden ("We are an international studio…") | Words go from grey to full colour as you scroll through the paragraph | `useScroll({ target })` + per-word `useTransform(opacity)` |
| 7 | Hero parallax | Neiden | Hero content drifts up slower than the page, background scales 1 → 1.2 | `useScroll` + `useTransform(y, scale)` |
| 8 | Sticky side column | Neiden ("What We Build") | Left title stays pinned while the right column's cards scroll past | CSS `position: sticky` |
| 9 | Stacking cards | Neiden (projects), MarketingLab (case studies) | Full-width cards pin at the top one after another; the one below slides over the previous, which scales down slightly | sticky wrappers + `useTransform(scale)` |
| 10 | Showreel zoom | Neiden | Image grid; the centre tile scales up to full screen as you scroll, title on top | tall sticky section + `useTransform(scale / clip-path)` |
| 11 | Infinite marquee | Neiden (logos, "Behind Neiden."), MarketingLab (clients), CreatorCut (avatars) | Endless horizontal loop, edges fade out | duplicated row + CSS `@keyframes` translateX, mask gradient |
| 12 | Number roll / counter | Neiden ($2,500, 150+, 92%), CreatorCut (500+, 99%) | Digits roll / count up when visible | `useInView` + `animate()` on a motion value |
| 13 | Process cards fan-in | MarketingLab ("Our Process" 01–04) | Cards slide in one by one, last one offset | stagger + `whileInView` |
| 14 | 3D flip | toms (service cards) | Card rotates on Y (`matrix3d(-1…)` → none) as it appears | `rotateY: 180 → 0` with `perspective` |
| 15 | Hover lift / image zoom | MarketingLab, toms | Card image scales ~1.05, button arrow nudges | `whileHover` |
| 16 | Floating cards | MarketingLab (testimonials over dark image) | Cards at different depths move at different speeds | per-card `useTransform(y)` with different ranges |
| 17 | Pricing / tab toggle | Neiden, MarketingLab | Pill slides between options, prices roll | `layoutId` pill + number roll |
| 18 | Accordion | Neiden, MarketingLab, CreatorCut | FAQ rows expand smoothly, plus icon rotates | `AnimatePresence` + height auto |
| 19 | Timeline progress line | Neiden ("The Journey") | Vertical red line fills as you scroll; items fade in beside it | `useScroll` + `scaleY` |
| 20 | Big footer wordmark | Neiden | Huge brand word at the bottom, rises in | reveal (2) at large size |
| 21 | Fixed nav + floating CTA | All | Nav stays on top; small CTA pinned bottom-right | `position: fixed` |

## Rules

- Every animation respects `prefers-reduced-motion` (Motion's `useReducedMotion`): reveals become simple fades, scroll-linked effects switch off.
- Animate only `transform`, `opacity` and `filter`, so it stays smooth on phones.
- Reveals run once (`once: true`), so scrolling back up does not replay them.
- Heavy effects (showreel zoom, stacking cards) only from `md` up; phones get the simple reveal.
