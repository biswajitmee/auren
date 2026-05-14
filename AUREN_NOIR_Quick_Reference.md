# AUREN NOIR — Quick Reference Card
### Creative Director Cheat Sheet

---

## BRAND AT A GLANCE

| Element | Value |
|---------|-------|
| **Brand Name** | AUREN NOIR |
| **Tagline** | "Structure is the new seduction." |
| **Concept** | LIQUID ARCHITECTURE |
| **Metaphor** | Dark museum at midnight |
| **Tone** | Sparse · Deliberate · Cinematic |

---

## COLOR PALETTE

| Name | Hex | Use |
|------|-----|-----|
| Obsidian Black | `#0A0806` | All backgrounds |
| Champagne Gold | `#C9A84C` | Accents, CTAs, borders |
| Deep Amber | `#8B4513` | 3D lighting, liquid |
| Rose Wine | `#7B3F5E` | Rim light, hover states |
| Soft Ivory | `#F5F0E8` | All body text |
| Smoke White | `#E8E4DC` | Mist, fog effects |
| Dark Charcoal | `#1A1612` | Secondary backgrounds |
| Burnished Bronze | `#A0522D` | Metallic mid-tones |

---

## TYPOGRAPHY

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display | Cormorant Garamond Italic | clamp(48px, 8vw, 120px) | Light |
| Title | Neue Haas Grotesk Display | clamp(24px, 4vw, 56px) | 25 Light |
| Body | Freight Display Pro | clamp(14px, 1.5vw, 18px) | Book |
| Mono/Caption | IBM Plex Mono | 10-12px | Regular |

---

## FRAGRANCE NOTES

| Layer | Notes |
|-------|-------|
| **Top** | Black Saffron · Smoked Oud · Bergamot Noir |
| **Heart** | Midnight Rose · Amber Resin · Dark Jasmine |
| **Base** | Vetiver · Sandalwood · Musk Absolute · Benzoin |

---

## 10 SECTIONS AT A GLANCE

```
00  Loading Screen    → Amber liquid rise + letter-by-letter reveal
01  Hero              → 3D bottle, god ray, gold particles, tagline
02  Product Reveal    → Close-up orbit, material callouts, specs
03  The Ritual        → Smoke bg, SplitText reveal, brand story
04  Fragrance Notes   → 3 interactive 3D cards, botanical models
05  Campaign Gallery  → Horizontal scroll, 5 campaign images
06  The Film          → Full-screen cinematic ad, 60 seconds
07  Social Cuts       → Device mockups, 3 format previews
08  Editions          → 3 product cards, 3D bottles, pricing
09  Ritual Guide      → Editorial layout, 3 ritual steps
10  Footer            → Minimal, particle field, newsletter
```

---

## THREE.JS LIGHTING RIG

```
Key Light    → Spot  | #C9A84C | (2, 8, 3)   | Intensity 2.5
Rim Light    → Dir   | #7B3F5E | (-3, 2, -2) | Intensity 0.8
Ambient      → Hemi  | #1A1612 | Sky          | Intensity 0.3
Accent       → Point | #8B4513 | (0, -2, 1)  | Intensity 1.2
```

---

## POST-PROCESSING STACK

```
1. Bloom              → Intensity 0.4, Threshold 0.85
2. Chromatic Aberration → Offset [0.001, 0.001]
3. Depth of Field     → Focus 0.0, Bokeh Scale 3
4. Vignette           → Darkness 0.8, Offset 0.1
5. Film Grain/Noise   → Opacity 0.03
```

---

## SCROLL MAP (GSAP + LENIS)

```
0%  → 10%   Hero arrival, bottle floats in
10% → 25%   Camera moves forward, product reveal begins
25% → 40%   360° bottle orbit, material callouts
40% → 55%   Brand story, smoke intensifies, SplitText
55% → 70%   Fragrance notes, 3D cards float in
70% → 85%   Campaign gallery, horizontal scroll
85% → 95%   Editions, staggered bottle entrance
95% → 100%  Footer, particles settle
```

---

## TECH STACK

```
React 18 + Next.js 14
Three.js r160 + React Three Fiber v8
@react-three/drei + @react-three/postprocessing
GSAP 3 + ScrollTrigger + Lenis
Theatre.js (cinematic sequences)
Custom GLSL shaders
CSS Modules + Custom Properties
Vercel deployment
```

---

## 12 VISUAL EFFECTS

```
01  Golden Particle Mist      → 3,000 pts, Brownian motion, additive blend
02  Volumetric God Ray        → GLSL radial blur from spot light
03  Glass Refraction          → Screen-space refraction, fresnel, chromatic ab.
04  Amber Liquid SSS          → Fake subsurface scattering, back-face lighting
05  Dark Smoke / Mist         → 200 sprites, slow upward drift
06  Reflective Obsidian Floor → MeshReflectorMaterial, blur [400,100]
07  Film Grain Overlay        → 3-5% opacity, 2-frame animation
08  Bloom / Glow              → Threshold 0.85, gold elements only
09  Depth of Field            → Bokeh scale 3, bottle always sharp
10  Rose Petal Physics        → 100 petals, Rapier physics, mouse wind
11  Liquid Pour               → Video texture or particle sim, additive blend
12  SplitText Reveal          → GSAP, 0.03s stagger, scroll trigger
```

---

## IMAGE PROMPT QUICK COPY

**Hero Product Shot:**
> Ultra-luxury perfume bottle, dark studio, single spotlight from above, smoky transparent glass, brushed gold cap, amber liquid, floating in darkness, gold dust particles, volumetric light, caustic patterns, #0A0806 background, 8K photorealistic, Hasselblad aesthetic, 1:1 format

**Campaign Poster:**
> High fashion perfume campaign, androgynous model in shadow, hands holding dark glass bottle with gold cap, chiaroscuro lighting, Caravaggio-inspired, black and amber palette, Vogue editorial quality, 2:3 vertical, no text

**Instagram Story:**
> Luxury perfume story format, bottle centered, dark background, gold particle bokeh, minimal composition, champagne gold accents, 9:16 vertical, space for text overlay, no text in image

---

## EMOTIONAL JOURNEY

```
ARRIVAL     → Awe
DISCOVERY   → Curiosity  
INTIMACY    → Desire
UNDERSTANDING → Connection
CONVERSION  → Inevitability
```

**CTA Language:** Never "Buy Now" — always **"Claim Yours"** or **"Add to Collection"**

---

## PRODUCT LINE

| Edition | Size | Notes |
|---------|------|-------|
| AUREN NOIR Original | 50ml | Core product |
| AUREN NOIR Intense | 100ml | Signature edition |
| AUREN NOIR Absolu | 30ml | Limited, ultra-rare |

---

*AUREN NOIR — Creative Direction v1.0*
