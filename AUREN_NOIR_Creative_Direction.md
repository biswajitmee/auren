# AUREN NOIR — Complete Creative Direction & Landing Page Design Plan
### Senior Creative Director Brief | Luxury Perfume Campaign | Interactive 3D Web Experience

---

> *"Not a fragrance. A ritual."*

---

## TABLE OF CONTENTS

1. [Brand Identity Foundation](#brand-identity)
2. [Three Creative Concepts](#three-concepts)
3. [Recommended Concept Deep Dive](#recommended-concept)
4. [Section-by-Section Layout](#section-layout)
5. [Hero Section Composition](#hero-composition)
6. [Three.js / R3F Scene Ideas](#threejs-scenes)
7. [Scroll Animation Direction](#scroll-animation)
8. [Typography & Color System](#typography-color)
9. [Visual Effects Library](#visual-effects)
10. [Figma Design Instructions](#figma-instructions)
11. [Image Generation Prompts](#image-prompts)
12. [Final Design Checklist](#design-checklist)

---

## 1. BRAND IDENTITY FOUNDATION {#brand-identity}

### Brand Essence
**AUREN NOIR** exists at the intersection of shadow and gold. It is not worn — it is inhabited. The brand speaks to those who understand that true luxury is felt before it is seen.

### Brand Pillars
| Pillar | Expression |
|--------|-----------|
| **Mystery** | Darkness that invites, not repels |
| **Opulence** | Gold that whispers, not shouts |
| **Ritual** | Every application is ceremony |
| **Provenance** | Ingredients with stories, origins with weight |
| **Silence** | The luxury of restraint |

### Tone of Voice
- Sparse. Deliberate. Never over-explained.
- Sentences that breathe.
- No exclamation marks. Ever.
- Lowercase preferred for body copy — intimacy over announcement.

### Color Palette (Exact Values)
```
OBSIDIAN BLACK    #0A0806   — Primary background, depth
CHAMPAGNE GOLD    #C9A84C   — Primary accent, UI elements
DEEP AMBER        #8B4513   — Warm mid-tone, liquid color
ROSE WINE         #7B3F5E   — Secondary accent, feminine depth
SOFT IVORY        #F5F0E8   — Text on dark, highlight
SMOKE WHITE       #E8E4DC   — Mist, fog, translucency
DARK CHARCOAL     #1A1612   — Secondary background
BURNISHED BRONZE  #A0522D   — Metallic mid-tone
```

### Fragrance Notes (Fictional)
- **Top:** Black Saffron, Smoked Oud, Bergamot Noir
- **Heart:** Midnight Rose, Amber Resin, Dark Jasmine
- **Base:** Vetiver, Sandalwood, Musk Absolute, Benzoin

---

## 2. THREE CREATIVE CONCEPTS {#three-concepts}

---

### CONCEPT A — "THE VOID RITUAL"
**Tagline:** *"Born from darkness. Worn by few."*

**Visual Language:**
A near-total black canvas. The perfume bottle emerges from absolute darkness — not placed, but *revealed*. Inspired by Caravaggio's chiaroscuro technique applied to digital space. The bottle is the only light source in the scene.

**Mood Reference:** Dior Sauvage campaign × Stanley Kubrick cinematography × Maison Margiela Replica

**Key Visual Moments:**
- Hero: Bottle floating in void, single volumetric light beam from above
- Particles: Gold dust falls upward (defying gravity — luxury defies rules)
- Scroll trigger: Bottle rotates 360° as user scrolls, revealing every facet
- Transition: Sections separated by black ink dissolve animations
- Climax: Full-screen amber liquid pour in slow motion (video texture on 3D plane)

**Three.js Signature Effect:**
Raymarched volumetric fog with a single point light. The bottle casts a caustic light pattern on an invisible floor — pure light physics as art.

**Typography Concept:**
- Headline: Thin serif (Cormorant Garamond) — letters spaced 0.3em, uppercase
- Body: Mono-spaced micro text (IBM Plex Mono) — feels like a classified document
- Accent: Hand-lettered script for fragrance notes only

**Weakness:** May feel too minimal for international markets that expect visual richness.

---

### CONCEPT B — "GOLDEN HOUR NEVER ENDS"
**Tagline:** *"The last light. Bottled."*

**Visual Language:**
Perpetual golden hour. The world is always at that exact moment before sunset — amber light, long shadows, warmth that feels like it's about to disappear. The bottle sits on a reflective obsidian surface, surrounded by floating rose petals and golden mist.

**Mood Reference:** Tom Ford Black Orchid × Guerlain Shalimar × Bottega Veneta campaign

**Key Visual Moments:**
- Hero: Bottle on reflective black marble, golden atmospheric haze
- Particles: Rose petals and gold leaf fragments orbit the bottle
- Scroll trigger: Camera slowly pulls back to reveal the full scene — bottle is on a cliff edge at golden hour
- Transition: Horizontal wipe with liquid gold effect
- Climax: Fragrance notes appear as floating botanical illustrations in 3D space

**Three.js Signature Effect:**
PBR (Physically Based Rendering) bottle with environment map of golden hour sky. Screen-space reflections on the marble floor. Particle system with 50,000 gold leaf fragments using instanced mesh.

**Typography Concept:**
- Headline: High-contrast serif (Playfair Display) — dramatic thick/thin strokes
- Body: Elegant sans (Optima or Canela) — humanist, warm
- Accent: Gold foil texture applied via CSS mix-blend-mode

**Weakness:** More expected for luxury perfume — beautiful but less surprising.

---

### CONCEPT C — "LIQUID ARCHITECTURE" ⭐ RECOMMENDED
**Tagline:** *"Structure is the new seduction."*

**Visual Language:**
The perfume bottle is not just a product — it is a *monument*. The website is built like an architectural walkthrough of a dark luxury space. Imagine walking through a brutalist black marble gallery at midnight, where the only illumination comes from the amber liquid inside the bottle. Space, geometry, and light are the design language.

**Mood Reference:** Byredo × Rick Owens × Zaha Hadid × Nuit de Feu by Louis Vuitton

**Key Visual Moments:**
- Hero: Extreme close-up of bottle cap — brushed gold texture fills the screen, then camera pulls back to reveal the full bottle in an infinite dark space
- Particles: Microscopic gold dust suspended in air — Brownian motion simulation
- Scroll trigger: Camera moves through architectural dark space, bottle is always the focal point but the environment changes
- Transition: Geometric black panels slide and reveal next sections
- Climax: The bottle shatters in slow motion, releasing a cloud of amber particles that reform into the brand name

**Three.js Signature Effect:**
Custom GLSL shader for the bottle glass — real-time refraction, chromatic aberration, and subsurface scattering for the amber liquid. The bottle is the most technically impressive 3D object on the web.

**Typography Concept:**
- Headline: Ultra-thin geometric sans (Neue Haas Grotesk or Aktiv Grotesk) — architectural precision
- Body: Refined serif (Freight Display) — contrast between cold structure and warm humanity
- Accent: Letterpress-style gold text with subtle emboss effect

**Why This Wins:** It's unexpected. Luxury perfume sites are usually soft and romantic. AUREN NOIR is architectural and precise. The contrast creates intrigue. It's Awwwards-worthy.

---

## 3. RECOMMENDED CONCEPT DEEP DIVE — "LIQUID ARCHITECTURE" {#recommended-concept}

### Creative Philosophy
AUREN NOIR is not about softness. It is about *precision*. The bottle is engineered. The scent is constructed. The website reflects this — every pixel is intentional, every animation has purpose, every transition earns its existence.

### The Central Metaphor
The website is a **dark museum at midnight**. The visitor is alone. The only exhibit is the bottle. As they move through the space (scroll), they discover new rooms, new perspectives, new truths about the fragrance. By the end, they don't just want to buy it — they feel they *need* to possess it.

### Emotional Journey Map
```
ARRIVAL          → Awe (the void, the bottle, the silence)
DISCOVERY        → Curiosity (what is this? who made this?)
INTIMACY         → Desire (close-ups, textures, ingredients)
UNDERSTANDING    → Connection (the story, the craft, the ritual)
CONVERSION       → Inevitability (not "buy now" — "claim yours")
```

### Technical Ambition Level
- **WebGL:** Custom GLSL shaders for glass, liquid, and atmospheric effects
- **Performance:** 60fps on desktop, 30fps on mobile with LOD switching
- **Loading:** Cinematic loading screen — amber liquid fills a progress bar
- **Audio:** Optional ambient soundscape (dark ambient, low frequency hum)
- **Cursor:** Custom cursor — small gold circle that reacts to hover states

---

## 4. SECTION-BY-SECTION LANDING PAGE LAYOUT {#section-layout}

### SECTION 0 — LOADING SCREEN
```
Duration: 2-3 seconds
Background: Pure obsidian #0A0806
Animation: Amber liquid rises from bottom of screen (GLSL shader)
Text: "AUREN NOIR" — letters appear one by one, 50ms delay each
Progress: Thin gold line at bottom, fills left to right
Exit: Liquid reaches top, screen "drowns" in amber, then cuts to black
```

### SECTION 1 — HERO (Full Viewport)
```
Layout: Full-screen Three.js canvas
Content:
  - 3D perfume bottle, center stage, floating
  - Volumetric light from above (god ray effect)
  - Micro gold particles in Brownian motion
  - Brand name: top-left, ultra-thin, 14px tracking 0.5em
  - Tagline: center-bottom, "Structure is the new seduction"
  - Scroll indicator: thin vertical line with animated dot, bottom-center

Interaction:
  - Mouse parallax: bottle tilts 5° following cursor
  - Hover on bottle: subtle glow intensifies
  - Scroll begins: bottle rises and camera follows
```

### SECTION 2 — THE BOTTLE (Product Reveal)
```
Layout: Split — 60% Three.js canvas left, 40% text right
Content:
  - Extreme close-up of bottle — brushed gold cap texture
  - Camera slowly orbits as user scrolls
  - Right side: Product name, edition, volume
  - Material callouts: animated lines pointing to cap, glass, liquid

Three.js: 
  - PBR material with roughness map for brushed gold
  - Glass shader with refraction index 1.5
  - Amber liquid with subsurface scattering

Text:
  AUREN NOIR
  Eau de Parfum Intense
  50ml | 100ml
  
  "Crafted from 47 rare ingredients.
   Aged in obsidian vessels.
   Released in limited edition."
```

### SECTION 3 — THE RITUAL (Brand Story)
```
Layout: Full-width cinematic — text over dark video/canvas
Content:
  - Background: Slow-motion smoke/mist Three.js particle system
  - Large centered text, one line at a time (GSAP SplitText)
  - Each line fades in as user scrolls

Text Sequence:
  "Some fragrances are worn."
  [pause]
  "AUREN NOIR is inhabited."
  [pause]
  "It does not announce your arrival."
  [pause]
  "It announces your departure."

Visual: Gold particles slowly drift upward behind text
```

### SECTION 4 — FRAGRANCE NOTES (Interactive)
```
Layout: Dark background, three floating 3D cards
Content:
  - Three columns: TOP / HEART / BASE
  - Each column has a 3D botanical illustration (R3F)
  - Hover: card rotates, ingredient name appears
  - Scroll: cards float in from sides

TOP NOTES:
  Black Saffron · Smoked Oud · Bergamot Noir
  [3D model: saffron threads, smoke wisps]

HEART NOTES:
  Midnight Rose · Amber Resin · Dark Jasmine
  [3D model: dark rose, amber droplet]

BASE NOTES:
  Vetiver · Sandalwood · Musk Absolute · Benzoin
  [3D model: wood grain, root system]

Effect: Each card has a unique particle color — gold, rose, amber
```

### SECTION 5 — THE CAMPAIGN (Visual Gallery)
```
Layout: Horizontal scroll gallery (Locomotive Scroll or custom)
Content:
  - 5 campaign poster images (AI-generated, see prompts below)
  - Each image: full-height, 40vw wide
  - Hover: subtle zoom + color grade shift
  - Between images: thin gold vertical lines

Images:
  1. Hero product shot — bottle on black marble
  2. Model campaign — figure in shadow, bottle in light
  3. Ingredient story — saffron threads on dark surface
  4. Architecture shot — bottle in brutalist space
  5. Night campaign — bottle under moonlight
```

### SECTION 6 — THE FILM (Cinematic Ad)
```
Layout: Full-screen video section
Content:
  - Autoplay muted video (or Three.js animated scene)
  - 60-second cinematic ad concept
  - Play button: thin gold circle with triangle
  - Caption: "The Campaign Film — 2026"

Video Concept:
  Open: Black screen. Sound of a match striking.
  A single flame illuminates the bottle.
  Camera slowly orbits.
  Smoke rises.
  A hand reaches in — brushed gold ring, dark sleeve.
  Lifts the bottle.
  Applies to wrist.
  Camera follows to wrist — close up of skin.
  Cut to black.
  "AUREN NOIR" appears.
  "Wear the dark."
```

### SECTION 7 — SOCIAL CUTS (Format Showcase)
```
Layout: Three floating device mockups
Content:
  - Vertical reel (9:16) — phone mockup
  - Square post (1:1) — tablet mockup  
  - Story format (4:5) — phone mockup
  
Each mockup shows animated content playing
Background: Dark with subtle grid lines (architectural)
Text: "Available across all formats. Built for every screen."
```

### SECTION 8 — EDITIONS (Product Line)
```
Layout: Three product cards, horizontal
Content:
  - AUREN NOIR Original — 50ml
  - AUREN NOIR Intense — 100ml  
  - AUREN NOIR Absolu — 30ml (limited)

Each card:
  - 3D bottle render (different sizes)
  - Price in champagne gold
  - "Add to Collection" button (not "Add to Cart")
  - Hover: bottle rotates, subtle glow

Background: Each card has slightly different dark gradient
```

### SECTION 9 — THE RITUAL GUIDE (Content)
```
Layout: Full-width, editorial magazine style
Content:
  - Large pull quote: "Apply to pulse points. Wait. Become."
  - Three ritual steps with gold numbered icons
  - Step 1: "Warm the bottle between your palms"
  - Step 2: "Apply to wrist, neck, behind the ear"
  - Step 3: "Allow 30 minutes for the full composition to emerge"

Visual: Subtle animated gold line connects the three steps
```

### SECTION 10 — FOOTER
```
Layout: Minimal, dark
Content:
  - AUREN NOIR logo (large, centered, faded)
  - Navigation links in micro text
  - Social icons: minimal line icons
  - "© 2026 AUREN NOIR. All rights reserved."
  - Newsletter: single input field, gold border, "Enter the circle"

Three.js: Subtle particle field in footer background
```

---

## 5. HERO SECTION COMPOSITION {#hero-composition}

### Camera Setup
```
Camera Type: Perspective, FOV 45°
Position: (0, 0, 5) — straight on, slightly elevated
Target: (0, 0, 0) — bottle center
Near: 0.1 | Far: 100
```

### Lighting Setup
```
Light 1 — Key Light (Spot)
  Color: #C9A84C (Champagne Gold)
  Intensity: 2.5
  Position: (2, 8, 3)
  Angle: 0.3 radians
  Penumbra: 0.8 (soft edge)
  Cast shadows: true

Light 2 — Rim Light (Directional)
  Color: #7B3F5E (Rose Wine)
  Intensity: 0.8
  Position: (-3, 2, -2)
  Purpose: Separate bottle from background

Light 3 — Ambient (Hemisphere)
  Sky Color: #1A1612 (Dark Charcoal)
  Ground Color: #0A0806 (Obsidian)
  Intensity: 0.3
  Purpose: Prevent pure black shadows

Light 4 — Accent (Point)
  Color: #8B4513 (Deep Amber)
  Intensity: 1.2
  Position: (0, -2, 1)
  Purpose: Amber glow from liquid inside bottle
```

### Bottle Positioning
```
Position: (0, 0, 0) — dead center
Rotation: (0, 0.3, 0) — slight angle, more dynamic than straight-on
Scale: (1, 1, 1) — fills approximately 40% of viewport height
Animation: 
  - Idle: gentle float (sin wave, amplitude 0.05, period 4s)
  - Idle: slow rotation (0.001 rad/frame on Y axis)
  - Mouse: tilt follows cursor (max ±5°, lerp 0.05)
```

### Particle System (Hero)
```
Count: 2,000 particles
Type: Points geometry with custom shader
Size: 0.5-2px (random)
Color: #C9A84C with 30% opacity variation
Movement: Brownian motion (random walk, very slow)
Distribution: Sphere radius 3 around bottle
Depth: Particles behind and in front of bottle
Blend: AdditiveBlending for glow effect
```

### Text Composition
```
Brand Name: 
  Font: Neue Haas Grotesk Display 25 (Ultra Light)
  Size: 14px
  Tracking: 0.5em
  Color: #F5F0E8
  Position: Top-left, 48px from edges
  Animation: Fade in after loading, 1s delay

Tagline:
  Font: Cormorant Garamond Italic
  Size: 18px
  Tracking: 0.15em
  Color: #C9A84C (gold)
  Position: Bottom-center, 80px from bottom
  Animation: Slide up from bottom, 1.5s delay

Scroll Indicator:
  Type: Thin vertical line (1px, 60px tall)
  Color: #C9A84C at 60% opacity
  Dot: 4px circle, animated bounce
  Position: Bottom-center, 24px from bottom
  Text: "scroll" in 10px mono, below line
```

### Background Treatment
```
Base: Pure #0A0806
Gradient: Radial gradient from center — slightly lighter (#1A1612) at center
Vignette: CSS vignette overlay, 40% opacity black at edges
Noise: Subtle film grain texture overlay, 3% opacity
```

---

## 6. THREE.JS / R3F SCENE IDEAS {#threejs-scenes}

### Scene 1 — Hero Bottle Scene
```javascript
// R3F Component Concept
<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
  <color attach="background" args={['#0A0806']} />
  
  {/* Atmospheric fog */}
  <fog attach="fog" args={['#0A0806', 8, 20]} />
  
  {/* Lighting */}
  <spotLight 
    position={[2, 8, 3]} 
    color="#C9A84C" 
    intensity={2.5}
    angle={0.3}
    penumbra={0.8}
    castShadow 
  />
  <directionalLight position={[-3, 2, -2]} color="#7B3F5E" intensity={0.8} />
  <hemisphereLight skyColor="#1A1612" groundColor="#0A0806" intensity={0.3} />
  <pointLight position={[0, -2, 1]} color="#8B4513" intensity={1.2} />
  
  {/* Bottle */}
  <Suspense fallback={null}>
    <PerfumeBottle />
  </Suspense>
  
  {/* Particles */}
  <GoldParticles count={2000} />
  
  {/* Reflective floor (invisible) */}
  <ReflectivePlane position={[0, -2, 0]} />
  
  {/* Post processing */}
  <EffectComposer>
    <Bloom intensity={0.5} luminanceThreshold={0.8} />
    <ChromaticAberration offset={[0.001, 0.001]} />
    <Vignette eskil={false} offset={0.1} darkness={0.8} />
    <Noise opacity={0.03} />
  </EffectComposer>
</Canvas>
```

### Scene 2 — Glass Bottle GLSL Shader
```glsl
// Fragment Shader — Perfume Bottle Glass
uniform float uTime;
uniform vec3 uLightPos;
uniform sampler2D uEnvMap;
uniform float uRefractionRatio; // 1.5 for glass

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  // Fresnel effect — more transparent at center, reflective at edges
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
  
  // Refraction
  vec3 refractDir = refract(-viewDir, vNormal, 1.0 / uRefractionRatio);
  vec4 refractColor = texture2D(uEnvMap, refractDir.xy * 0.5 + 0.5);
  
  // Reflection
  vec3 reflectDir = reflect(-viewDir, vNormal);
  vec4 reflectColor = texture2D(uEnvMap, reflectDir.xy * 0.5 + 0.5);
  
  // Amber liquid tint
  vec3 amberTint = vec3(0.545, 0.271, 0.075); // #8B4513
  
  // Mix refraction and reflection based on fresnel
  vec4 glassColor = mix(refractColor, reflectColor, fresnel);
  
  // Add amber tint to refracted areas
  glassColor.rgb = mix(glassColor.rgb, amberTint, 0.3 * (1.0 - fresnel));
  
  // Chromatic aberration on edges
  float aberration = fresnel * 0.02;
  
  // Final output
  gl_FragColor = vec4(glassColor.rgb, 0.85 + fresnel * 0.15);
}
```

### Scene 3 — Volumetric Mist / Smoke
```javascript
// Volumetric Smoke Particle System
const SmokeSystem = () => {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 3 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    // Animate smoke rising
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.001; // Rise
      if (positions[i * 3 + 1] > 3) positions[i * 3 + 1] = -1; // Reset
    }
  });
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          array={positions} 
          count={count} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        color="#E8E4DC" 
        transparent 
        opacity={0.15}
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
```

### Scene 4 — Reflective Floor
```javascript
// Infinite Reflective Obsidian Floor
import { MeshReflectorMaterial } from '@react-three/drei';

const ReflectiveFloor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
    <planeGeometry args={[50, 50]} />
    <MeshReflectorMaterial
      blur={[300, 100]}
      resolution={2048}
      mixBlur={1}
      mixStrength={80}
      roughness={1}
      depthScale={1.2}
      minDepthThreshold={0.4}
      maxDepthThreshold={1.4}
      color="#0A0806"
      metalness={0.8}
    />
  </mesh>
);
```

### Scene 5 — Gold Particle Explosion (Bottle Shatter)
```javascript
// Bottle Shatter → Particle Reform Animation
const BottleShatter = ({ trigger }) => {
  const particleCount = 5000;
  const { positions, velocities } = useMemo(() => {
    // Initialize particles at bottle surface positions
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Start at bottle surface (cylinder approximation)
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 2;
      pos[i * 3] = Math.cos(angle) * 0.3;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * 0.3;
      
      // Explosion velocity
      vel[i * 3] = (Math.random() - 0.5) * 0.1;
      vel[i * 3 + 1] = Math.random() * 0.1;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return { positions: pos, velocities: vel };
  }, []);
  
  // GSAP timeline for explosion → reform
  useEffect(() => {
    if (trigger) {
      gsap.to(/* particle positions */, {
        duration: 2,
        ease: "power2.out",
        // Explode outward
        onComplete: () => {
          gsap.to(/* particle positions */, {
            duration: 1.5,
            ease: "power3.in",
            // Reform into brand name shape
          });
        }
      });
    }
  }, [trigger]);
};
```

### Scene 6 — Fragrance Notes 3D Cards
```javascript
// Interactive 3D Fragrance Note Cards
const FragranceCard = ({ note, ingredients, color, position }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  useFrame(() => {
    if (hovered) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group position={position}>
      {/* Card backing */}
      <mesh 
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 2.5, 0.05]} />
        <meshStandardMaterial 
          color="#1A1612"
          metalness={0.3}
          roughness={0.7}
          emissive={color}
          emissiveIntensity={hovered ? 0.2 : 0.05}
        />
      </mesh>
      
      {/* Botanical 3D element */}
      <Suspense fallback={null}>
        <BotanicalModel type={note} scale={0.3} position={[0, 0.5, 0.1]} />
      </Suspense>
      
      {/* Particle halo */}
      {hovered && <CardParticles color={color} count={200} />}
    </group>
  );
};
```

---

## 7. SCROLL ANIMATION DIRECTION {#scroll-animation}

### Scroll Philosophy
**Principle:** The user does not scroll a webpage. They *descend* into the world of AUREN NOIR. Each scroll unit is a step deeper into the experience.

### Scroll Library Recommendation
**Primary:** GSAP ScrollTrigger + Lenis (smooth scroll)
**Alternative:** Theatre.js for cinematic timeline control
**3D Scroll:** R3F useScroll hook from @react-three/drei

### Scroll Animation Map

```
SCROLL POSITION 0% — 10%
  Action: Loading complete, hero appears
  Camera: Static at (0, 0, 5)
  Bottle: Floats in from below, settles at center
  Text: Brand name fades in
  Particles: Begin Brownian motion

SCROLL POSITION 10% — 25%
  Action: Hero to Product Reveal
  Camera: Slowly moves forward (0, 0, 5) → (0, 0, 3)
  Bottle: Begins slow rotation
  Text: Tagline fades out, product details fade in
  Effect: Vignette intensifies

SCROLL POSITION 25% — 40%
  Action: Product Reveal — close-up orbit
  Camera: Orbits around bottle, elevation rises
  Bottle: Full 360° rotation over this scroll range
  Text: Material callout lines animate in
  Effect: Chromatic aberration increases on glass edges

SCROLL POSITION 40% — 55%
  Action: Brand Story — The Ritual
  Camera: Pulls back to wide shot
  Background: Smoke particles intensify
  Text: Lines appear one by one (SplitText)
  Effect: Gold particles slow down, become more visible

SCROLL POSITION 55% — 70%
  Action: Fragrance Notes
  Camera: Cuts to new scene (three cards)
  Cards: Float in from left, center, right
  Hover: Available for interaction
  Effect: Each card has colored particle halo

SCROLL POSITION 70% — 85%
  Action: Campaign Gallery
  Camera: Horizontal scroll trigger
  Images: Slide in from right
  Effect: Parallax on each image (different speeds)

SCROLL POSITION 85% — 95%
  Action: Editions / Product Line
  Camera: Three bottles appear
  Animation: Staggered entrance, 200ms delay each
  Effect: Price reveals with gold counter animation

SCROLL POSITION 95% — 100%
  Action: Footer
  Camera: Fade to footer scene
  Effect: Particle field settles
  Text: Newsletter input slides up
```

### GSAP ScrollTrigger Implementation Pattern
```javascript
// Master scroll timeline
const masterTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5, // Smooth scrub
    pin: true,
  }
});

// Camera animation
masterTimeline
  .to(camera.position, { z: 3, duration: 1, ease: "power2.inOut" }, "product")
  .to(bottle.rotation, { y: Math.PI * 2, duration: 2 }, "product")
  .to(camera.position, { z: 6, y: 1, duration: 1 }, "story")
  .to(smokeOpacity, { value: 0.8, duration: 0.5 }, "story");

// Text animations
gsap.utils.toArray('.ritual-line').forEach((line, i) => {
  gsap.from(line, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    scrollTrigger: {
      trigger: line,
      start: "top 80%",
      end: "top 50%",
      scrub: false,
      toggleActions: "play none none reverse"
    },
    delay: i * 0.2
  });
});
```

### Lenis Smooth Scroll Setup
```javascript
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.8,           // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,      // Disable on touch (performance)
  touchMultiplier: 2,
  infinite: false,
});

// Connect to GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

---

## 8. TYPOGRAPHY & COLOR SYSTEM {#typography-color}

### Type Scale
```
Display (Hero Headline):
  Font: Cormorant Garamond — Light Italic
  Size: clamp(48px, 8vw, 120px)
  Line Height: 0.9
  Letter Spacing: -0.02em
  Color: #F5F0E8
  Usage: Hero tagline, section titles

Title (Section Headers):
  Font: Neue Haas Grotesk Display — 25 Light
  Size: clamp(24px, 4vw, 56px)
  Line Height: 1.1
  Letter Spacing: 0.3em (uppercase)
  Color: #C9A84C (gold)
  Usage: Section names, product names

Body (Editorial):
  Font: Freight Display Pro — Book
  Size: clamp(14px, 1.5vw, 18px)
  Line Height: 1.8
  Letter Spacing: 0.02em
  Color: #F5F0E8 at 80% opacity
  Usage: Descriptions, brand story

Caption (Micro):
  Font: IBM Plex Mono — Regular
  Size: 10-12px
  Line Height: 1.6
  Letter Spacing: 0.15em (uppercase)
  Color: #C9A84C at 60% opacity
  Usage: Labels, callouts, footnotes

Accent (Fragrance Notes):
  Font: Cormorant Garamond — Italic
  Size: 16px
  Line Height: 2
  Letter Spacing: 0.05em
  Color: #F5F0E8 at 70% opacity
  Usage: Ingredient names, ritual steps
```

### Color Usage Rules
```
OBSIDIAN BLACK #0A0806
  → All backgrounds
  → Never use as text color
  → Minimum 95% of any screen should be this

CHAMPAGNE GOLD #C9A84C
  → Primary accent only
  → CTAs, borders, highlights
  → Maximum 5% of any screen
  → Never use as background

DEEP AMBER #8B4513
  → 3D scene lighting only
  → Liquid color in bottle
  → Warm gradient accents
  → Never use as text

ROSE WINE #7B3F5E
  → Rim lighting in 3D
  → Subtle gradient in backgrounds
  → Hover states on secondary elements
  → Never dominant

SOFT IVORY #F5F0E8
  → All body text
  → Headlines on dark backgrounds
  → Never pure white (#FFFFFF)

SMOKE WHITE #E8E4DC
  → Mist and fog effects
  → Disabled states
  → Subtle dividers
```

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-obsidian: #0A0806;
  --color-gold: #C9A84C;
  --color-amber: #8B4513;
  --color-rose: #7B3F5E;
  --color-ivory: #F5F0E8;
  --color-smoke: #E8E4DC;
  --color-charcoal: #1A1612;
  --color-bronze: #A0522D;
  
  /* Typography */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-title: 'Neue Haas Grotesk Display', 'Helvetica Neue', sans-serif;
  --font-body: 'Freight Display Pro', Georgia, serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
  
  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 32px;
  --space-lg: 64px;
  --space-xl: 128px;
  --space-2xl: 256px;
  
  /* Transitions */
  --ease-luxury: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-dramatic: cubic-bezier(0.76, 0, 0.24, 1);
  --duration-fast: 300ms;
  --duration-medium: 600ms;
  --duration-slow: 1200ms;
  --duration-cinematic: 2400ms;
}
```

### Button Design
```css
/* Primary CTA — "Claim Yours" */
.btn-primary {
  background: transparent;
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 16px 40px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color var(--duration-medium) var(--ease-luxury);
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-gold);
  transform: translateX(-101%);
  transition: transform var(--duration-medium) var(--ease-dramatic);
}

.btn-primary:hover {
  color: var(--color-obsidian);
}

.btn-primary:hover::before {
  transform: translateX(0);
}
```

---

## 9. VISUAL EFFECTS LIBRARY {#visual-effects}

### Effect 1 — Golden Particle Mist
```
Type: Three.js Points with custom shader
Count: 3,000 particles
Behavior: Slow Brownian motion (random walk)
Color: #C9A84C with opacity 0.1-0.4 (random per particle)
Size: 0.5-3px (random, size attenuation enabled)
Blend Mode: AdditiveBlending
Distribution: Sphere radius 4 around bottle
Animation: Each particle has unique phase offset for organic feel
Special: Particles near bottle glow brighter (distance-based intensity)
```

### Effect 2 — Volumetric God Ray
```
Type: Custom GLSL post-processing pass
Source: Spot light above bottle
Color: #C9A84C at 20% opacity
Rays: 8-12 visible rays
Falloff: Exponential with distance
Interaction: Rays shift slightly with mouse movement
Implementation: Radial blur from light source position in screen space
```

### Effect 3 — Glass Refraction
```
Type: Custom GLSL fragment shader on bottle mesh
Technique: Screen-space refraction
Refraction Index: 1.5 (glass)
Chromatic Aberration: 0.5% offset on RGB channels
Fresnel: pow(1 - dot(viewDir, normal), 3)
Caustics: Projected light pattern on floor beneath bottle
Dispersion: Slight rainbow effect at extreme angles
```

### Effect 4 — Amber Liquid Subsurface Scattering
```
Type: Custom material on liquid mesh inside bottle
Technique: Fake SSS using back-face lighting
Color: #8B4513 base, #C9A84C highlight
Translucency: 0.7 (light passes through)
Thickness Map: Gradient from center to edges
Animation: Subtle liquid movement (sin wave displacement)
Glow: Point light inside bottle, amber color, low intensity
```

### Effect 5 — Dark Smoke / Mist
```
Type: Sprite-based particle system
Texture: Soft circular gradient (white center, transparent edge)
Count: 200 sprites
Size: 0.5-2 units (large, soft)
Opacity: 0.05-0.15 (very subtle)
Color: #E8E4DC (smoke white)
Movement: Slow upward drift + gentle horizontal sway
Blend: NormalBlending with low opacity
Spawn: From bottle base, rises and fades
```

### Effect 6 — Reflective Obsidian Floor
```
Type: MeshReflectorMaterial (@react-three/drei)
Color: #0A0806
Roughness: 0.1 (very reflective)
Metalness: 0.9
Blur: [400, 100] (horizontal blur for realism)
Resolution: 1024 (performance balance)
Mirror Strength: 0.6 (not perfect mirror — luxury, not clinical)
Depth Fade: Reflection fades with distance
```

### Effect 7 — Film Grain Overlay
```
Type: CSS + GLSL post-processing
Grain Size: 0.5px
Opacity: 3-5%
Animation: New random grain every 2 frames (cinematic feel)
Color: Monochrome grain
Blend: Overlay blend mode
Purpose: Adds analog warmth to digital perfection
```

### Effect 8 — Bloom / Glow
```
Type: @react-three/postprocessing Bloom
Intensity: 0.4
Luminance Threshold: 0.85 (only brightest areas bloom)
Luminance Smoothing: 0.9
Radius: 0.8
Purpose: Gold elements glow, bottle edges shimmer
```

### Effect 9 — Depth of Field
```
Type: @react-three/postprocessing DepthOfField
Focus Distance: 0.0 (focused on bottle)
Focal Length: 0.02
Bokeh Scale: 3
Purpose: Background elements blur, bottle is razor sharp
Scroll Behavior: Focus distance changes as camera moves
```

### Effect 10 — Rose Petal Physics (Optional Section)
```
Type: Instanced mesh with physics
Count: 100 petals
Geometry: Custom petal shape (bezier curve extrusion)
Material: Translucent, dark rose color #7B3F5E
Physics: Cannon.js or Rapier — gentle gravity, air resistance
Interaction: Mouse creates wind force, petals react
Spawn: From above viewport, fall slowly
```

### Effect 11 — Liquid Pour (Video Section)
```
Type: Video texture on 3D plane OR Houdini-style particle sim
Technique: Pre-rendered video of amber liquid pour
Blend: AdditiveBlending for glow
Loop: Seamless 4-second loop
Trigger: Plays when section enters viewport
Sound: Optional — liquid pour sound effect
```

### Effect 12 — Text Reveal (SplitText)
```
Type: GSAP SplitText plugin
Split By: Characters
Animation: Each character fades in + slight Y offset
Stagger: 0.03s per character
Ease: power2.out
Trigger: ScrollTrigger, starts when text enters viewport
Special: Gold characters appear first, then ivory
```

---

## 10. FIGMA DESIGN INSTRUCTIONS {#figma-instructions}

### File Structure
```
AUREN NOIR — Design System
├── 🎨 Foundations
│   ├── Colors (all swatches with hex values)
│   ├── Typography (all type styles)
│   ├── Spacing (8px grid system)
│   ├── Effects (shadows, blurs, overlays)
│   └── Icons (custom line icons)
│
├── 🧩 Components
│   ├── Buttons (primary, secondary, ghost)
│   ├── Navigation (desktop, mobile)
│   ├── Product Cards (3 variants)
│   ├── Fragrance Note Cards
│   ├── Campaign Image Frames
│   ├── Video Player UI
│   └── Footer
│
├── 📱 Frames
│   ├── Desktop (1440px wide)
│   │   ├── 00 — Loading Screen
│   │   ├── 01 — Hero
│   │   ├── 02 — Product Reveal
│   │   ├── 03 — The Ritual
│   │   ├── 04 — Fragrance Notes
│   │   ├── 05 — Campaign Gallery
│   │   ├── 06 — The Film
│   │   ├── 07 — Social Cuts
│   │   ├── 08 — Editions
│   │   ├── 09 — Ritual Guide
│   │   └── 10 — Footer
│   │
│   ├── Mobile (390px wide)
│   │   └── [All sections, mobile-adapted]
│   │
│   └── Tablet (768px wide)
│       └── [All sections, tablet-adapted]
│
├── 🎬 Prototypes
│   ├── Scroll Flow (desktop)
│   ├── Hover States
│   └── Loading Animation
│
└── 📐 Annotations
    ├── Developer Handoff Notes
    ├── Animation Specs
    └── Three.js Scene Diagrams
```

### Figma Setup Instructions

**Step 1 — Canvas Setup**
```
Frame: 1440 × 900px (desktop hero)
Background: #0A0806
Grid: 12-column, 120px margins, 24px gutter
Baseline Grid: 8px
```

**Step 2 — Color Styles**
Create the following Figma color styles:
```
Brand/Obsidian Black    → #0A0806
Brand/Champagne Gold    → #C9A84C
Brand/Deep Amber        → #8B4513
Brand/Rose Wine         → #7B3F5E
Brand/Soft Ivory        → #F5F0E8
Brand/Smoke White       → #E8E4DC
Brand/Dark Charcoal     → #1A1612
Brand/Burnished Bronze  → #A0522D
```

**Step 3 — Text Styles**
```
Display/Hero            → Cormorant Garamond Light Italic, 96px
Display/Section         → Cormorant Garamond Light, 64px
Title/Large             → Neue Haas Grotesk 25, 48px, tracking 0.3em
Title/Medium            → Neue Haas Grotesk 25, 32px, tracking 0.3em
Body/Large              → Freight Display Pro Book, 18px
Body/Regular            → Freight Display Pro Book, 16px
Caption/Mono            → IBM Plex Mono Regular, 11px, tracking 0.15em
```

**Step 4 — Effect Styles**
```
Shadow/Bottle Glow      → Drop shadow, #C9A84C, 0px 0px 60px, 40% opacity
Shadow/Card             → Drop shadow, #000000, 0px 20px 60px, 60% opacity
Blur/Background         → Background blur, 20px
Overlay/Dark Vignette   → Radial gradient, black 0% center → 60% edges
```

**Step 5 — Hero Frame Design**
```
1. Create 1440×900 frame, fill #0A0806
2. Add radial gradient overlay: center #1A1612 → edges #0A0806
3. Add noise texture (import grain PNG, set to Overlay, 3% opacity)
4. Place bottle mockup image (center, 40% viewport height)
5. Add gold glow effect behind bottle (ellipse, #C9A84C, blur 80px, 20% opacity)
6. Add brand name: top-left, 14px, Neue Haas Grotesk, #F5F0E8, tracking 0.5em
7. Add tagline: bottom-center, 18px, Cormorant Garamond Italic, #C9A84C
8. Add scroll indicator: bottom-center, 1px line + 4px dot, #C9A84C
9. Add particle dots: scatter 30-40 small dots, #C9A84C, 10-30% opacity
10. Add vignette overlay: radial gradient frame, black edges
```

**Step 6 — Component Library**
```
Product Card Component:
  - Auto layout: vertical, 24px gap
  - Background: #1A1612
  - Border: 1px solid #C9A84C at 20% opacity
  - Padding: 32px
  - Bottle image: centered, 60% card width
  - Product name: Title/Medium style
  - Price: Caption/Mono style, #C9A84C
  - CTA button: full width, ghost style

Fragrance Note Card:
  - Size: 280 × 400px
  - Background: #1A1612
  - Top section: 200px, botanical illustration placeholder
  - Bottom section: note name + ingredients list
  - Hover state: gold border glow
  - Variant property: TOP / HEART / BASE
```

**Step 7 — Prototype Connections**
```
Loading Screen → Hero: Smart animate, 2s, ease out
Hero → Product Reveal: Scroll trigger, 0% → 25%
Each section: Scroll-based reveal
Hover states: Instant, no delay
CTA buttons: Overlay → Product detail page
```

---

## 11. IMAGE GENERATION PROMPTS {#image-prompts}

### PROMPT SET 1 — Hero Banner (Product Shot)

**Primary Hero:**
```
Ultra-luxury perfume bottle photography, dark studio, single dramatic spotlight from above, 
smoky transparent glass bottle with brushed gold cap, amber liquid inside, 
bottle floating in absolute darkness, microscopic gold dust particles suspended in air, 
volumetric light beam, caustic light patterns on invisible floor, 
deep black background #0A0806, champagne gold highlights, 
cinematic product photography, 8K, photorealistic, 
Hasselblad medium format aesthetic, luxury fragrance campaign, 
inspired by Dior Sauvage and Tom Ford campaigns, 
no text, no watermarks, square format 1:1
```

**Hero Variant — Atmospheric:**
```
Luxury perfume bottle in dark architectural space, brutalist black marble interior, 
single amber light source from within the bottle, 
smoke and mist rising from bottle base, 
reflective obsidian floor showing perfect bottle reflection, 
deep shadows, champagne gold rim lighting, 
cinematic wide shot, 16:9 format, 
inspired by Rick Owens aesthetic and Zaha Hadid architecture, 
photorealistic CGI render, Octane render quality, 
dark luxury mood, mysterious, elegant, international
```

---

### PROMPT SET 2 — Campaign Poster (Model + Product)

**Campaign Poster 1 — The Figure:**
```
High fashion luxury perfume campaign poster, 
androgynous model in deep shadow, only hands and wrist visible, 
holding dark glass perfume bottle with gold cap, 
dramatic chiaroscuro lighting, Caravaggio-inspired, 
black and deep amber color palette, 
champagne gold jewelry on wrist, 
cinematic film grain, analog photography aesthetic, 
Vogue editorial quality, luxury fashion photography, 
dark background, mysterious mood, 
vertical format 2:3, no text
```

**Campaign Poster 2 — The Ritual:**
```
Luxury perfume ritual photography, 
close-up of elegant hands applying perfume to wrist, 
dark background, single gold spotlight, 
amber liquid droplet on skin, 
bokeh background with gold particles, 
skin texture detail, intimate and sensual, 
luxury beauty photography, 
inspired by Chanel No.5 and Guerlain campaigns, 
warm amber and gold tones on dark background, 
vertical format 4:5
```

---

### PROMPT SET 3 — Fragrance Notes Visual

**Top Notes — Black Saffron:**
```
Macro photography of saffron threads on black obsidian surface, 
deep red-orange saffron against pure black background, 
single dramatic spotlight, 
gold dust scattered around saffron, 
extreme close-up, shallow depth of field, 
luxury ingredient photography, 
dark moody aesthetic, 
square format 1:1, no text
```

**Heart Notes — Midnight Rose:**
```
Dark rose photography, deep burgundy-black rose petals, 
single rose on black marble surface, 
dramatic side lighting, gold rim light, 
water droplets on petals, 
dark romantic mood, 
luxury perfume ingredient photography, 
inspired by Maison Margiela Replica aesthetic, 
square format 1:1, no text
```

**Base Notes — Oud Wood:**
```
Macro photography of dark oud wood chips and resin, 
rich brown and amber tones on black background, 
dramatic lighting revealing wood grain texture, 
amber resin droplets catching light, 
luxury ingredient photography, 
warm and mysterious mood, 
square format 1:1, no text
```

---

### PROMPT SET 4 — Social Ad Visuals

**Instagram Story (9:16 Vertical):**
```
Luxury perfume social media story format, 
perfume bottle centered in frame, 
dark background with subtle gold particle bokeh, 
minimal composition, lots of negative space, 
champagne gold color accents, 
premium lifestyle aesthetic, 
9:16 vertical format, 
space for text overlay at top and bottom, 
no text in image, clean and minimal
```

**Instagram Post (1:1 Square):**
```
Luxury perfume square social media post, 
perfume bottle on dark reflective surface, 
overhead shot (flat lay), 
surrounded by dark rose petals and gold leaf, 
obsidian black background, 
champagne gold accents, 
editorial luxury aesthetic, 
1:1 square format, 
premium product photography
```

**Instagram Reel Cover (4:5):**
```
Luxury perfume reel cover image, 
dramatic close-up of perfume bottle cap, 
brushed gold texture filling frame, 
extreme macro photography, 
single light source creating dramatic shadows, 
gold and black color palette, 
4:5 format, 
cinematic quality, 
luxury brand aesthetic
```

---

### PROMPT SET 5 — Architectural / Lifestyle

**Lifestyle Shot:**
```
Luxury lifestyle photography, 
perfume bottle on dark marble vanity, 
moody bathroom or dressing room setting, 
candlelight and gold accents, 
dark wood and black marble surfaces, 
champagne glass nearby, 
intimate luxury atmosphere, 
editorial photography, 
warm amber and gold tones, 
horizontal format 16:9
```

**Architectural Product:**
```
Perfume bottle in brutalist luxury interior, 
black concrete walls, 
single dramatic spotlight from ceiling, 
bottle on black marble plinth, 
architectural photography meets product photography, 
deep shadows, precise geometry, 
inspired by Rick Owens store aesthetic, 
cinematic quality, 
horizontal format 16:9
```

---

### PROMPT SET 6 — 3D Render Prompts (for Blender/Cinema4D/Midjourney)

**3D Bottle Render:**
```
3D render of luxury perfume bottle, 
smoky transparent glass with subtle smoke texture inside, 
brushed gold metal cap with fine texture detail, 
amber liquid filling 70% of bottle, 
subsurface scattering on liquid, 
caustic light patterns, 
HDRI studio lighting, 
black background, 
Octane render or Redshift quality, 
photorealistic materials, 
product visualization, 
no text, no labels
```

**3D Scene Render:**
```
3D rendered luxury perfume scene, 
bottle on infinite black reflective floor, 
volumetric light from above, 
gold particle system surrounding bottle, 
atmospheric fog and mist, 
cinematic camera angle (slightly low, looking up), 
Octane render quality, 
dark luxury aesthetic, 
photorealistic, 
16:9 format
```

---

## 12. FINAL DESIGN CHECKLIST {#design-checklist}

### ✅ BRAND FOUNDATION
- [ ] Color palette defined with exact hex values
- [ ] Typography system complete (4 font roles)
- [ ] Brand voice guidelines written
- [ ] Fragrance notes defined (fictional but believable)
- [ ] Tagline confirmed: "Structure is the new seduction"
- [ ] Logo treatment defined (ultra-thin, tracked, uppercase)

### ✅ CREATIVE CONCEPT
- [ ] Three concepts developed and documented
- [ ] Recommended concept selected: "LIQUID ARCHITECTURE"
- [ ] Emotional journey map created
- [ ] Central metaphor defined: "Dark museum at midnight"
- [ ] Technical ambition level set

### ✅ LAYOUT & SECTIONS
- [ ] 10 sections defined with content
- [ ] Loading screen designed
- [ ] Hero section fully specified
- [ ] Product reveal section designed
- [ ] Brand story section written
- [ ] Fragrance notes section designed
- [ ] Campaign gallery section planned
- [ ] Film section storyboarded
- [ ] Social cuts section designed
- [ ] Editions/product line section designed
- [ ] Ritual guide section written
- [ ] Footer designed

### ✅ THREE.JS / R3F TECHNICAL
- [ ] Camera setup documented (FOV, position, target)
- [ ] Lighting rig specified (4 lights with exact values)
- [ ] Bottle material shader planned (glass + liquid)
- [ ] Particle systems designed (hero + smoke + petals)
- [ ] Reflective floor specified
- [ ] Post-processing stack defined (Bloom, DoF, Grain, Vignette)
- [ ] Performance strategy noted (LOD, mobile fallback)
- [ ] R3F component architecture sketched

### ✅ SCROLL ANIMATION
- [ ] Scroll library selected (GSAP + Lenis)
- [ ] Full scroll map created (0% to 100%)
- [ ] Camera animation path defined
- [ ] Text reveal animations specified
- [ ] Section transition effects designed
- [ ] Mobile scroll behavior considered

### ✅ VISUAL EFFECTS
- [ ] 12 effects documented with implementation notes
- [ ] Gold particle mist specified
- [ ] Volumetric god ray specified
- [ ] Glass refraction shader planned
- [ ] Amber liquid SSS planned
- [ ] Dark smoke/mist system designed
- [ ] Reflective floor specified
- [ ] Film grain overlay designed
- [ ] Bloom/glow settings defined
- [ ] Depth of field settings defined
- [ ] Rose petal physics planned
- [ ] Liquid pour effect planned
- [ ] Text reveal animation specified

### ✅ FIGMA DESIGN
- [ ] File structure defined
- [ ] Color styles created
- [ ] Text styles created
- [ ] Effect styles created
- [ ] Hero frame designed
- [ ] Component library built
- [ ] All 10 sections designed (desktop)
- [ ] Mobile versions designed
- [ ] Prototype connections made
- [ ] Developer handoff annotations added

### ✅ IMAGE ASSETS
- [ ] Hero banner prompts written (2 variants)
- [ ] Campaign poster prompts written (2 variants)
- [ ] Fragrance notes prompts written (3 ingredients)
- [ ] Social ad prompts written (3 formats)
- [ ] Lifestyle/architectural prompts written
- [ ] 3D render prompts written

### ✅ PRE-CODING VERIFICATION
- [ ] All fonts licensed or Google Fonts alternatives identified
- [ ] 3D bottle model source identified (custom or purchased)
- [ ] Video assets planned (pre-rendered or real-time)
- [ ] Performance budget set (target: <3s load, 60fps)
- [ ] Browser support defined (Chrome, Safari, Firefox — latest 2 versions)
- [ ] Mobile strategy defined (simplified 3D or 2D fallback)
- [ ] Accessibility considerations noted (reduced motion media query)
- [ ] SEO strategy for JS-heavy site (SSR with Next.js)
- [ ] Analytics integration planned
- [ ] Hosting platform selected (Vercel recommended)

### ✅ TECH STACK CONFIRMATION
```
Framework:        React 18 + Next.js 14
3D Engine:        Three.js r160 + React Three Fiber v8
3D Helpers:       @react-three/drei (latest)
Post Processing:  @react-three/postprocessing
Scroll:           GSAP ScrollTrigger + Lenis
Animation:        GSAP 3 + Theatre.js (for cinematic sequences)
Shaders:          Custom GLSL (inline in R3F)
Styling:          CSS Modules + CSS Custom Properties
Fonts:            Self-hosted (WOFF2)
3D Models:        GLTF/GLB (Draco compressed)
Textures:         KTX2 compressed (basis universal)
Build:            Vite or Next.js
Deploy:           Vercel
```

---

## APPENDIX A — STORYBOARD NOTES

### Loading → Hero Transition
```
Frame 1: Pure black
Frame 2: Single pixel of amber light appears at center
Frame 3: Amber light expands into thin horizontal line
Frame 4: Line becomes the bottle silhouette
Frame 5: Bottle materializes from light
Frame 6: Particles begin to appear
Frame 7: Brand name fades in
Frame 8: Full hero state
Duration: 3 seconds total
```

### The Ritual Section Storyboard
```
Frame 1: Black screen, smoke begins
Frame 2: First line appears: "Some fragrances are worn."
Frame 3: Line fades to 30% opacity
Frame 4: Second line: "AUREN NOIR is inhabited."
Frame 5: This line stays bright — it's the key message
Frame 6: Third line: "It does not announce your arrival."
Frame 7: Fourth line: "It announces your departure."
Frame 8: All lines visible, gold particles intensify
Frame 9: Transition to next section
```

---

## APPENDIX B — MOBILE STRATEGY

### Performance Tiers
```
Tier 1 — High-end mobile (iPhone 15 Pro, Samsung S24):
  Full 3D experience, reduced particle count (50%)
  30fps target, all effects enabled
  
Tier 2 — Mid-range mobile:
  Simplified 3D (bottle only, no particles)
  Static background, CSS animations only
  
Tier 3 — Low-end / older devices:
  2D fallback — high-quality images
  CSS animations only
  No WebGL
```

### Detection Strategy
```javascript
// Detect GPU capability
const gl = document.createElement('canvas').getContext('webgl');
const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Set experience tier
const tier = detectGPUTier(); // using detect-gpu library
```

---

## APPENDIX C — SOUND DESIGN (OPTIONAL)

### Ambient Soundscape
```
Track 1 — Ambient Base:
  Type: Dark ambient drone
  Frequency: 40-80Hz sub-bass hum
  Duration: Looping, 4 minutes
  Volume: Very low (user must opt in)

Track 2 — Interaction Sounds:
  Bottle hover: Subtle crystal resonance (200ms)
  Button click: Soft gold chime (100ms)
  Section transition: Low whoosh (500ms)
  
Track 3 — Video Section:
  Liquid pour sound effect
  Synchronized with visual
  
Implementation:
  Howler.js for audio management
  Web Audio API for spatial audio
  User must click to enable (browser autoplay policy)
  Mute button: always visible, top-right
```

---

*Document Version: 1.0*
*Created: AUREN NOIR Creative Direction*
*Classification: Creative Brief — Pre-Production*
*Next Step: Figma design execution → Three.js prototype*

---

> *"The bottle is not the product. The experience is the product."*
> — AUREN NOIR Creative Direction


