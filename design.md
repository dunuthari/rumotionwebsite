# Ru Motion website — design system

Status: Home, Meet the maker, FAQ and Download pages are built and tested.
Scope: Landing, FAQ and Download pages for the Ru Motion After Effects plugin (free, Windows + macOS, After Effects 2019+).
Reference: a dark/light "product" SaaS site (inspiration only — structure and feel, no copied content or branding).

---

## 1. Principles
1. **Quiet canvas, loud accent.** Near-black and off-white surfaces; lime `#DCFA37` is reserved for primary actions and highlights.
2. **Product first.** The real Ru Motion panel is the hero visual. Interactive, never a flat screenshot.
3. **Motion is purposeful.** Scroll-driven and pointer-driven, tied to what the plugin does. No decorative looping.
4. **Tight, confident type.** Big headings with tight tracking, muted grey body, tiny monospace labels.
5. **Honest content.** No invented logos, quotes or numbers. Empty proof slots stay hidden until real content exists.

## 2. Brand
- **Name:** Ru Motion (රූ — "form, image").
- **Headline (approved):** "Animation in one click." Sub-line: "Polished motion for your edits, ready in seconds."
- **Logo:** the traced "R" mark (two near-black shapes) on a lime rounded square. Nav size 28px, favicon 32/180/512. Corner radius 31% of the square. Clear space = 25% of the mark.
  Never: recolor the mark, place it on a non-lime tile, add effects.
- **Voice:** short, direct, confident. Verbs first ("Pick a layer. Click an effect."). No hype words, no jargon.

## 3. Color tokens

### Core
| Token | Hex | Use |
|---|---|---|
| `--lime` | `#DCFA37` | Primary buttons, highlighted word, active states, focus accent (on dark) |
| `--lime-press` | `#BFDA2E` | Button pressed |
| `--lime-hover` | `#E6FF5C` | Button hover |
| `--lime-tint-dark` | `#333A12` | Selected chip / tag on dark |
| `--lime-tint-light` | `#F4FBC9` | Soft highlight on light (backgrounds only, never text) |
| `--ink` | `#101010` | Dark section background, text on lime, text on light |
| `--ink-2` | `#1C1D20` | Panel page background (matches plugin) |
| `--ink-3` | `#232428` | Raised dark surface |
| `--ink-4` | `#2B2D31` | Dark card |
| `--ink-line` | `#3C3E43` | Hairlines on dark |
| `--paper` | `#FAFAFA` | Light section background |
| `--paper-2` | `#FFFFFF` | Light card |
| `--paper-line` | `#E6E7EA` | Hairlines on light |

### Text
| Token | Hex | Use |
|---|---|---|
| `--text-on-dark` | `#F1F2F4` | Headings/body on dark |
| `--text-on-dark-muted` | `#BEC0C4` | Secondary on dark |
| `--text-on-dark-hint` | `#90939A` | Labels, captions on dark |
| `--text-on-light` | `#101010` | Headings on light |
| `--text-on-light-muted` | `#5F6368` | Body on light |
| `--text-on-light-hint` | `#8A8D93` | Labels on light |
| `--text-on-lime` | `#101010` | Always near-black on lime |

### Status (FAQ/troubleshooting callouts only)
`--ok #2FBF71` · `--warn #F5A524` · `--error #EF5350`.

### Contrast rules (measured)
- `#101010` on `#DCFA37` ≈ 16:1 → always allowed.
- `#DCFA37` on `#101010` ≈ 16:1 → lime text/icons/borders allowed **on dark only**.
- `#DCFA37` on `#FAFAFA`/white ≈ 1.1:1 → **never** use lime for text, icons or borders on light. On light, lime appears only as a filled button/tag with near-black text.
- White text on lime is forbidden.
- Body text must keep ≥ 4.5:1; large text ≥ 3:1.

### Gradients and glow
- **Hero glow (dark):** radial, `rgba(220,250,55,0.22)` → transparent, 60% radius, blurred 80px, positioned behind the product panel. One glow per section max.
- **Slider/easing gradient (panel demo):** periwinkle `#8A7DFF` → `#DCFA37` → orange `#FF8A3D`, only inside the product mock-up.

## 4. Typography
- **Headings:** Inter Tight, weight 500–600, tracking −0.035em (display) to −0.02em (h3), line-height 0.98–1.1.
- **Body:** Inter, weight 400/500, line-height 1.55.
- **Labels/meta:** JetBrains Mono (or `ui-monospace`), 11–12px, uppercase off, tracking 0.02em, color hint.
- Load with `font-display: swap`; self-host or Google Fonts (subset latin).

| Style | Desktop | Mobile | Weight | Tracking |
|---|---|---|---|---|
| Display (hero, FAQ title) | 96px / 0.98 | 48px / 1.0 | 600 | −0.04em |
| H1 section | 64px / 1.02 | 36px | 600 | −0.035em |
| H2 | 44px / 1.06 | 30px | 600 | −0.03em |
| H3 (card title) | 22px / 1.2 | 20px | 500 | −0.015em |
| Lead | 20px / 1.5 | 17px | 400 | 0 |
| Body | 16px / 1.55 | 16px | 400 | 0 |
| Small | 14px / 1.5 | 14px | 400 | 0 |
| Label (mono) | 12px / 1.4 | 11px | 400 | 0.02em |

- **Highlighted word:** the key headline word gets a "selection box" — 1.5px `--lime` outline, 4px radius, small square corner handles (6px, lime fill, ink 1px border), padding 0.08em 0.2em. Text color unchanged (white on dark). On light sections the box is `--ink` outline with lime fill behind the word.
- Greyed-out leading text (benchmark testimonial style) uses `--text-on-*-hint`, with the emphasis in full color.

## 5. Layout
- **Max content width:** 1200px; text columns 640–720px; FAQ column 720px.
- **Grid:** 12 columns, 24px gutter (desktop), 4 columns/16px (mobile). Page gutter 24px (≥ 640px), 16px below.
- **Section padding:** 120px vertical (desktop), 72px (mobile).
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 120.
- **Breakpoints:** 480 / 768 / 1024 / 1280.

## 6. Shape, depth
- **Radii:** pill `999px` (buttons, nav CTA, chips) · card 20px · panel mock-up 24px · small 8–12px · closing CTA card 32px.
- **Borders:** 1px hairline (`--paper-line` / `--ink-line`).
- **Shadows (light):** `0 1px 0 rgba(16,16,16,.04), 0 24px 48px -24px rgba(16,16,16,.18)`.
- **Shadows (dark):** `0 0 0 1px rgba(255,255,255,.06), 0 40px 80px -30px rgba(0,0,0,.7)`.
- No heavy drop shadows. Depth comes from borders, contrast and glow.

## 7. Components

### Buttons
| Variant | Fill | Text | Notes |
|---|---|---|---|
| Primary | `--lime` | `--ink` | 700 weight 14–15px, height 44px (nav 36px), padding 0 22px, pill. Hover `--lime-hover`, press `--lime-press` + translateY(1px). Trailing chevron `›` optional. |
| Secondary on dark | transparent, 1px `--ink-line` | `--text-on-dark` | Hover: border lighter, bg `rgba(255,255,255,.04)`. |
| Secondary on light | `--paper-2`, 1px `--paper-line` | `--ink` | Hover: bg `#F2F3F5`. |
| Ghost link | none | text color | Underline on hover. |
- Focus ring: 2px `--lime` + 2px offset on dark; 2px `--ink` + 2px offset on light.
- Only **one** primary button per viewport region.

### Nav
- Slim sticky bar, 64px. Logo left; center links: Features · FAQ · Download; right: primary **Download** pill (appears after the hero CTA scrolls out of view).
- Transparent over dark hero; switches to light/blurred (`backdrop-filter: blur(16px)`) with a hairline over light sections. Active link = full text color, others muted.
- Mobile: logo + menu button → full-screen sheet.

### Chips / tags
Mono label, 12px, pill, 1px hairline. Selected: `--lime-tint-dark` bg + lime text (dark) or lime bg + ink text (light).

### Cards
- **Bento card (light):** `--paper-2`, 1px `--paper-line`, radius 20px; top = pale illustration area (`#F3F4F6`) with a small mock-up, bottom = H3 + 2-line muted description. Hover: lift 4px, shadow strengthens.
- **Dark card:** `--ink-4`, 1px `--ink-line`, radius 20px.
- **Closing CTA card:** dark `--ink`, radius 32px, faint diagonal facets in `#17181B`, headline left, lime button, live panel on the right overlapping the card's top edge by ~15%.

### Accordion (FAQ)
- Row: 56px tall, 1px hairline divider, question 17px/500, **+** icon right (1.5px stroke, 16px). Open: **+** rotates 45° to **×**, answer (15px muted, max-width 520px) expands with a 220ms ease-out height transition. One open at a time. Group labels in mono above each group.
- Keyboard: `Enter`/`Space` toggles; arrow keys move between rows; `aria-expanded`/`aria-controls` set.

### Stats strip
3–4 items, each: mono label above, 28px heading below. Items: `FREE` · `WINDOWS + MAC` · `AFTER EFFECTS 2019+` · `28 EASING CURVES` (counted from the plugin's `FLOW_PRESETS`). Hairline separators.

### Product panel mock-up (the hero component)
- Source: the working browser mock-up of the real panel (`preview/index.html` of the plugin), restyled for the new lime tokens. Dark theme only.
- Frame: radius 24px, 1px `--ink-line`, shadow dark. Optional phone-style tall frame on the pinned-scroll section (matches benchmark proportion).
- Interactions:
  - **Pointer:** tabs, chips and buttons are clickable; the easing/bounce control follows the pointer (thumb tracks X inside the control).
  - **Scroll hand-off:** the panel's list scrolls with the wheel while the pointer is over it; at its end the page continues to scroll.
  - **Hover:** chips and buttons use lime states from §7 Buttons/Chips; a small cursor graphic follows in demo mode.
  - **Idle/touch:** auto-plays a looped sequence (tab changes, a typewriter demo) — respects reduced motion.
- Floating avatar-style "cursor chips" are not used (no people). Use small lime cursor arrows with a mono label, e.g. "Pop", "Swipe".

## 8. Page templates

### Landing
1. Nav (transparent)
2. **Hero — dark.** Display headline "Animation in one click." with "one click" highlighted; lead "Polished motion for your edits, ready in seconds."; primary **Download** + secondary **See how it works**; lime glow; live panel emerging from the bottom edge.
3. **Stats strip — dark.**
4. **Stacking feature cards — light.** Six sticky cards that stack as you scroll (see section 15): Animate · Text · Transitions · Build · Camera · Flow.
5. **How it works band — dark.** Three steps (select → click → retime), plus a timeline mock-up showing two keyframes.
6. **Bento — light.** Text presets · Layer & cut tools · Easing curves · UI kit builders.
7. **Testimonials — light.** Hidden until real quotes exist; layout: large quote with leading text greyed, mono role line.
8. **Closing CTA card — dark.** Headline "Animation in one click." (repeat) or "Download Ru Motion"; lime button; interactive panel.
9. Footer (light): logo, Features · FAQ · Download, contact `tlakshan10106@gmail.com`, © year, Privacy · Terms placeholders hidden until written.

### FAQ (light)
Display title "Common questions"; narrow column; groups (mono labels): **Getting started** · **Using Ru Motion** · **Text and presets** · **Troubleshooting**; closing CTA card; footer.

### Download (dark hero → light steps)
- Hero: "Download Ru Motion", version + date (mono), lime **Download for Windows** / **Download for macOS** (detect OS, show both), file size, "Free for personal and commercial use."
- Steps (light): 1 Download · 2 Install (run `RuMotion-Setup`: `.bat` on Windows, `.command` on macOS) · 3 Open in After Effects: Window › Extensions › Ru Motion.
- Callout (warn): CEP panels are unsigned — debug mode must be on (`PlayerDebugMode = 1`). Provide the manual steps from the plugin's README, per OS.
- License note: free for personal and commercial use; redistributing the file is not allowed.

## 9. Motion
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for entrances; `cubic-bezier(0.4, 0, 0.2, 1)` for state changes.
- **Durations:** hover/press 120–160ms · accordion 220ms · reveal 600–700ms · pinned-step swap 450ms.
- **Reveal on scroll:** translateY 24px + opacity 0→1, stagger 60ms; run once.
- **Pinned scroll:** CSS `position: sticky` + IntersectionObserver/scroll progress; no scroll-jacking. Native scroll always works.
- **Pointer tracking:** requestAnimationFrame, lerp 0.18; disabled on touch.
- **Reduced motion:** `prefers-reduced-motion` → no parallax/pinned animations, instant state swaps, auto-play off.

## 10. Accessibility
- Semantic landmarks (`header`, `nav`, `main`, `footer`); one `h1` per page.
- All interactive controls keyboard-reachable with visible focus (see Buttons).
- Contrast rules in §3 are binding.
- Panel mock-up has `role="img"` summary plus real, focusable controls; skip link to bypass it.
- Alt text for every non-decorative image; decorative glow/facets are CSS only.
- Targets ≥ 44×44px on touch.

## 11. Performance and technical
- **Static HTML/CSS/vanilla JS**, no build step required. Optional tiny helpers only.
- Fonts: 2 families max (Inter Tight, Inter) + mono; subset, `swap`.
- Images/video: WebP/AVIF/WebM; lazy-load below the fold; panel mock-up is DOM/CSS (no video).
- Budget: LCP < 2.5s on mid mobile, total JS < 80KB gzip, CLS < 0.05.
- Meta: title/description per page, Open Graph image (lime tile + headline), `theme-color` `#101010`.

## 12. File structure (proposed)
```
/index.html        landing
/faq.html
/download.html
/assets/css/tokens.css   (variables from §3–§6)
/assets/css/base.css
/assets/css/components.css
/assets/js/main.js       (nav, reveal, accordion)
/assets/js/panel.js      (interactive panel mock-up)
/assets/img/logo.svg, favicon, og-image
/design.md
```

## 13. Content to supply or confirm
- Real testimonials/quotes (user will send); until then the section stays hidden.
- Stats strip: "28 easing curves" and "16 text presets" are verified against the plugin source.
- Download file(s): CEP panel zip only (decision), version + release date.
- License wording: free for personal and commercial use; no redistribution.
- Contact: `tlakshan10106@gmail.com`.
- Privacy/Terms pages: not planned; footer links hidden for now.

## 14. Open items
- Confirm Inter Tight / Inter + JetBrains Mono as the final fonts.
- Confirm lime hover `#E6FF5C` and press `#BFDA2E`.
- Confirm "Download" is the nav's primary label.

---

## 15. Interactions as built (home page)

### Smooth scrolling
- **Library:** Lenis 1.3.27 from unpkg (`autoRaf: true`, `lerp: 0.1`, `smoothWheel: true`, `allowNestedScroll: true`). Required Lenis CSS is inlined in `base.css`.
- **Anchor links:** eased scroll (cubic in-out), duration 0.6 to 1.3 s by distance, lands exactly on the section, then updates the URL hash.
- **Fallback:** if Lenis does not load, a custom eased wheel scroll and eased anchors run instead. Native scrolling stays for touch devices and `prefers-reduced-motion`.
- **Nav:** the Features link is underlined while the Features, How it works or Highlights section is under the nav. Nav tone (dark or light) follows the section beneath it.
- **Mobile menu:** pauses Lenis while open.

### Hero cursor trail (`assets/js/trail.js`)
- **Trigger:** pointer movement over the hero, one tile each time the pointer travels 84 px. Mouse and pen only.
- **Tiles:** the plugin's eight main tabs, in order: Layers, Animate, Text, Transitions, Build, Camera, Flow, Style. 104 px dark tile (`#1C1D20`), 16 px radius, 1px inner hairline, 42 px lime (`#DCFA37`) line icon (1.6 stroke, round caps), label 12 px Inter in `--t-dark`.
- **Life cycle (1.5 s):** blur 14px and scale 0.7 to sharp at 20%, hold until 68%, then blur and fade out. Random tilt of plus or minus 6 degrees. Newest on top. At most 16 alive.
- **Off:** touch devices, reduced motion, viewports under 900 px.

### Hero rotating word (`assets/js/rotate.js`)
- **Where:** only the highlighted part of the headline, inside the lime selection box. The outline and four corner handles never change.
- **Words:** "one click." then "seconds." then "a flash." then "real time.", every 2.3 s. Words must read after "Animation in" and have no descenders.
- **Motion:** per-character slide. Exit: up and out (translateY -120%, 380 ms). Enter: up from below (translateY 100%, 640 ms, slight overshoot). Both staggered from the last letter, 26 ms apart. The old word finishes leaving before the new one arrives. The box width eases to the new word (600 ms).
- **Accessibility:** screen readers get one static, updating phrase. The animated copy is `aria-hidden`.
- **Off:** reduced motion keeps "one click.".

### Other built interactions
- **Reveal on scroll:** rise 24px and fade, 700 ms, 60 ms stagger, once.
- **Features, stacking cards (`assets/css/stack.css`, `assets/js/stack.js`):** six full-width cards (Animate, Text, Transitions, Build, Camera, Flow). Each card is sticky below the nav and stacks 14px lower than the one before. As the next card slides up, the cards beneath scale down by 4.5% per card and dim by 16% (transform-origin top). Card colors: lime, ink, lilac `#BDB2FF`, white, slate `#26282D`, lime. Each card has an `NN / 06` tag, a headline, copy, feature pills and a looping demo.
  - **Pointer tilt:** the demo tilts up to 9 degrees toward the pointer (mouse and pen only).
  - **Pills:** hovering or focusing a pill names it in the demo caption. Clicking a pill (or Enter or Space) replays the demo.
  - **Off:** reduced motion keeps flat sticky cards with no scaling or tilt. Phones use the same stacking with smaller offsets.
- **Product panel:** tabs, chips, buttons with an "Applied" toast, 28 easing tiles, and a bounce slider that follows the pointer.
- **Timeline:** draggable keyframe diamonds that change the speed readout.

### Files
```
/index.html
/assets/css/tokens.css  base.css  components.css
/assets/js/main.js  panel.js  trail.js  rotate.js
/assets/img/logo.svg  favicon.svg
```

### Download page (built)
- **Layout:** breadcrumb strip under the nav ("DOWNLOAD" left, "Need install help?" link right), a dark centered hero ("Download Ru Motion", one lead line), then a light "Get started" section, notes, a checksum block and a help card.
- **One button for both systems:** a single large lime pill, "Download for Windows and Mac", which downloads `assets/downloads/RuMotion-CEP.zip` (v1.0, 219 KB). The same zip holds `RuMotion-Setup.bat` (Windows) and `RuMotion-Setup.command` (Mac), shown to visitors simply as "RuMotion-Setup". A line under it shows version, size and "After Effects 2019+", plus "DETECTED: WINDOWS" or "MAC" when the visitor's system is recognised.
- **Get started:** heading on the left, two install cards on the right (Windows, Mac), each with numbered steps in lime circles and a link to the matching FAQ answer. The visitor's own system card gets a dark outline and a "YOUR SYSTEM" tag.
- **Good to know:** three notes (license, requirements, why debug mode is set) and a SHA-256 checksum with a Copy button.
- **Help:** dark card with "Email for help" and "Read the FAQ".
