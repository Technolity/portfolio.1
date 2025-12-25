# Cinematic Developer Portfolio

A powerful, cinematic portfolio website inspired by Red Dead Redemption 2 and Peaky Blinders aesthetics. Built with React and featuring smooth scroll animations, this portfolio communicates control, intelligence, and quiet confidence.

## 🎬 Theme

**From:** Futuristic sci-fi galaxy theme  
**To:** Dark, grounded, atmospheric cinematic experience

### Design Philosophy
- **Power & Control** - Commanding presence without flashiness
- **Intelligence** - Professional, serious systems builder
- **Quiet Confidence** - RDR2 & Peaky Blinders inspired aesthetic

## 🎨 Visual Identity

### Color Palette
- **Deep Blacks & Charcoal** - Primary backgrounds
- **Warm Sepia/Amber** - Accent highlights (#d4a574, #d4a373)
- **Off-White Typography** - Readable, elegant text (#e8e6e3)
- **Subtle Gold/Copper** - Minimal accent touches

### Typography
- **Headings:** Playfair Display (Serif) - Cinematic, powerful
- **Body:** Inter (Sans-serif) - Clean, readable
- **Mono:** Consolas - Technical elements

## 🚀 Technology Stack

### Core
- **React 18** - UI framework
- **Lenis** - Smooth cinematic scrolling
- **GSAP** - High-performance animations
- **ScrollTrigger** - Scroll-based animations

### Features
- ✅ Smooth cinematic scrolling with Lenis
- ✅ Film grain texture overlay
- ✅ Vignette effect
- ✅ Slow parallax background movement
- ✅ GSAP-powered section transitions
- ✅ Responsive design (mobile-optimized)
- ✅ Performance optimized (60+ FPS)

## 📁 Project Structure

```
src/
├── components/
│   ├── sections/
│   │   ├── HeroCinematic.js          # Full-page hero with parallax
│   │   ├── WhatIBuildCinematic.js    # Command panel style
│   │   ├── FeaturedProjectsCinematic.js  # Case files aesthetic
│   │   ├── TechStackCinematic.js     # Tactical display
│   │   ├── ExperienceCinematic.js    # Timeline layout
│   │   ├── AboutCinematic.js         # Principles showcase
│   │   └── ContactCinematic.js       # Minimal contact section
│   └── UI/
│       └── Navbar.js                 # Clean, minimal navigation
├── styles/
│   ├── cinematic-theme.css           # Core theme & variables
│   ├── HeroCinematic.css
│   ├── WhatIBuildCinematic.css
│   ├── FeaturedProjectsCinematic.css
│   ├── TechStackCinematic.css
│   ├── SharedCinematic.css           # Shared component styles
│   └── Navbar.css
└── App.js                            # Main app with Lenis setup
```

## 🎯 Sections

1. **Hero** - Full-page cinematic with slow parallax background
2. **What I Build** - Horizontal command panels showcasing services
3. **Featured Projects** - Case file dossiers with large images
4. **Tech Stack** - Tactical briefing screen aesthetic
5. **Experience** - Professional timeline
6. **About** - Core principles and philosophy
7. **Contact** - Minimal, professional contact section

## 🛠 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📦 Dependencies

```json
{
  "lenis": "^1.x.x",           // Smooth scrolling
  "gsap": "^3.14.2",           // Animations
  "react": "^18.2.0",          // UI framework
  "react-dom": "^18.2.0"
}
```

## 🎭 Animation Philosophy

**NOT:**
- ❌ Fast, playful motion
- ❌ Over-reactive cursor effects
- ❌ Spinning/warping transitions
- ❌ Neon colors

**YES:**
- ✅ Slow, intentional movement
- ✅ Cross-fades and depth-based parallax
- ✅ Camera-like drift
- ✅ Controlled, cinematic transitions

## 🎨 Design Principles

### Motion
- **Duration:** Slow, controlled (0.8-1.2s)
- **Easing:** power3.out, power2.out
- **Style:** Camera-like, cinematic
- **Performance:** Always 60+ FPS

### Typography
- **Always readable** - No sacrificing legibility
- **Hierarchy matters** - Clear visual structure
- **Spacing** - Generous, intentional whitespace

### Interactions
- **Subtle** - No chaos on hover
- **Predictable** - Users know what will happen
- **Rewarding** - Smooth, satisfying feedback

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

- **Desktop:** Full cinematic experience
- **Tablet:** Simplified layouts, maintained aesthetics
- **Mobile:** Optimized for touch, reduced motion

## 🚀 Performance

- **FPS:** 60+ maintained
- **Load time:** Optimized assets
- **Accessibility:** Respects `prefers-reduced-motion`

## 📝 License

This project is for portfolio purposes.

## 🎬 Final Identity

**This portfolio communicates:**
> "A developer who builds serious systems with control, depth, and intelligence."

**Inspired by:** Red Dead Redemption 2, Peaky Blinders  
**Feel:** Dark, atmospheric, powerful, grounded  
**Not:** Flashy, experimental, playful
