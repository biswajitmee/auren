# AUREN NOIR

Production-style Next.js campaign site for the AUREN NOIR perfume concept, built around one fixed React Three Fiber canvas and ten editable DOM sections.

## Install

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Assets

Place the perfume bottle GLB at:

```text
public/models/auren-bottle.glb
```

Place reference images at:

```text
public/reference/images
```

The original root assets are preserved. Runtime browser assets are loaded only from `public`.

## Editing

Section data lives in:

```text
lib/auren-data.ts
```

The image and model mapping lives in:

```text
lib/auren-assets.ts
```

Each section is a separate component in `components/sections`, and the shared WebGL scene is in `components/three`.

## Theatre Studio

The 3D scene is wired for Theatre.js tuning in development only.

```bash
npm run dev
```

When the site opens locally, Theatre Studio initializes automatically. Use it to tune:

- `Hero Bottle`
- `Hero Camera`
- `Hero Spotlight`
- `Rim Light`
- `Reflective Floor`
- `Gold Particles`
- `Smoke Atmosphere`
- `God Ray Beam`
- `Hero Environment Controls`

Theatre project name: `AUREN_NOIR`
Theatre sheet name: `Main Scene`

To save tuned values, export the project state from Theatre Studio and replace:

```text
lib/theatre-state.json
```

The initial file is intentionally empty. Runtime defaults still come from the existing R3F components, and Theatre loads only when `NODE_ENV === "development"`.

## Leva Hero Tuning

Leva is also available in development for fast live tuning of the hero scene. It does not replace Theatre: Theatre remains for scene editing and keyframe/snapshot work, while Leva is for quick visual overrides and debugging.

```bash
npm run dev
```

Open the `AUREN NOIR` Leva panel and enable `enableLevaOverrides` under `Leva Overrides`. When that toggle is off, Theatre/default scene values dominate. When it is on, Leva can tune bottle, spotlight, rim light, god ray, particles, smoke, floor, post FX, and debug helpers. The hero camera is always driven by Theatre's `Hero Camera` object and the saved `lib/theatre-state.json` state, including position, target, fov, zoom, near/far clipping, and roll keyframes.

In development and production, page scroll drives the Theatre sheet sequence so the `Hero Camera` keyframes preview directly in Theatre Studio. When scroll is idle, you can still scrub the Studio timeline manually; the next page scroll hands control back to the scroll position.

Leva is development-only by default. To hide it locally:

```bash
NEXT_PUBLIC_AUREN_LEVA=false npm run dev
```

Preset defaults live in:

```text
lib/auren-hero-preset.ts
```

Use the `copyPreset` button in the Leva `Debug` folder to copy the current tuning values, then replace the object in `lib/auren-hero-preset.ts`. Particle count is fixed per performance tier for stability; use `particleDensity`, `particleOpacity`, and `particleSize` for live tuning without remounting the particle geometry.

## Performance

The site detects a rough performance tier and trims particles, reflections, and postprocessing on lower-powered/mobile devices. It also respects `prefers-reduced-motion`, disables Lenis smoothing in that mode, and falls back to lighter scene behavior.

The loading screen uses real fetch byte progress for critical public assets and skips failed optional assets without blocking the page.

## Deployment

Deploy on Vercel as a standard Next.js app. Keep the GLB and reference images in `public` so they are included in the deployment output. If the GLB is replaced, keep the browser URL as `/models/auren-bottle.glb` unless you also update `lib/auren-assets.ts`.
