# Waris Rawa — Developer Portfolio

A dark, editorial single-page portfolio for **Waris Rawa** (brand: **Technolity**), a Full-Stack & AI Systems Engineer focused on backend, automation, and revenue-driving software. Built with React, GSAP-driven scroll motion, and Lenis smooth scrolling, with all content driven from a single data file.

**Live:** [portfoliowaris.vercel.app](https://portfoliowaris.vercel.app)

## 🎨 Visual Identity

A restrained, high-contrast editorial look — dark surfaces, a single crimson accent, and film grain for texture.

### Color Palette
- **Background:** `#080808` → `#141414` (layered dark surfaces)
- **Text:** `#F2F0ED` with stepped opacity tiers for hierarchy
- **Accent:** `#C8102E` / `#E01535` (crimson)
- **Borders:** low-opacity white hairlines

### Typography
- **Display:** [Syne](https://fonts.google.com/specimen/Syne) — headings, tight tracking
- **Body:** [DM Sans](https://fonts.google.com/specimen/DM+Sans) — copy and UI

### Texture & Motion
- Fixed SVG film-grain overlay (`overlay` blend, subtle)
- Custom `SnakeCursor` trailing cursor
- GSAP + ScrollTrigger reveals, Lenis smooth scroll

## 🚀 Technology Stack

- **React 18** — UI framework (Create React App / `react-scripts`)
- **Lenis** — smooth scrolling
- **GSAP + ScrollTrigger** — scroll-based animation
- **Three.js** (`@react-three/fiber`, `@react-three/drei`) — 3D/WebGL primitives
- **Vercel** — deployment

## 📁 Project Structure

```
src/
├── App.js                              # Lenis + GSAP setup, section composition
├── index.js
├── content/
│   └── portfolioData.js                # Single source of truth for all content
├── components/
│   ├── sections/
│   │   ├── HeroCinematic.js            # Hero with headline + metrics
│   │   ├── WhatIBuildCinematic.js      # Services / what I build
│   │   ├── FeaturedProjectsCinematic.js# Featured project posters
│   │   ├── TechStackCinematic.js       # Grouped tech stack
│   │   ├── ExperienceCinematic.js      # Experience timeline
│   │   ├── AboutCinematic.js           # About + principles + education
│   │   ├── ContactCinematic.js         # Contact section
│   │   └── FooterCinematic.js          # Footer
│   └── UI/
│       ├── Navbar.js                   # Top navigation
│       ├── SnakeCursor.js              # Custom trailing cursor
│       ├── RepelText.js                # Interactive repel text effect
│       ├── CinematicLoader.js
│       ├── BulletImpact.js
│       ├── SmokeEffect.js
│       └── GlobalClickEffect.js
├── styles/
│   ├── cinematic-theme.css             # Design tokens, reset, base typography
│   ├── *Cinematic.css                  # Per-section styles
│   ├── SharedCinematic.css             # Shared component styles
│   └── Navbar.css
└── utils/
    └── repelManager.js
```

## 🎯 Sections

1. **Hero** — headline, highlights, and key metrics
2. **What I Build** — service offerings (SaaS backend, AI pipelines, full-stack delivery)
3. **Featured Projects** — TedOS, Amazon Review Intelligence, MOON Naturally Yours, and more
4. **Tech Stack** — grouped by AI/LLMs, Backend & API, Automation & CRM, Languages & Data, Frontend & Infra
5. **Experience** — professional timeline
6. **About** — narrative, principles, and education
7. **Contact** — direct links (email, LinkedIn, GitHub, X)
8. **Footer**

## 📝 Editing Content

All copy — profile, metrics, services, projects, stack, experience, about, and education — lives in [`src/content/portfolioData.js`](src/content/portfolioData.js). Update that file to change site content without touching component code.

## 🛠 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lenis": "^1.3.16",
  "gsap": "^3.14.2",
  "three": "^0.159.0",
  "@react-three/fiber": "^8.18.0",
  "@react-three/drei": "^9.122.0"
}
```

## 🌐 Browser Support

- Chrome, Firefox, Safari, Edge (latest)

## 📱 Responsive Design

- **Desktop:** full editorial experience
- **Tablet / Mobile:** adapted layouts, touch-optimized

## 🚀 Deployment

Deployed on **Vercel** (see `vercel.json`). Pushes to the default branch publish automatically.

## 📝 License

This project is for personal portfolio purposes.
