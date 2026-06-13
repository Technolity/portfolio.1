import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/* ============================================================
   SERVER CATHEDRAL — layered cinematic backdrop
   Sits UNDER the R3F constellation inside .hero-scene.

   L1  perspective blueprint floor grid (CSS 3D, slow drift)
   L2  monumental monolith silhouette, etched crimson circuit
       traces with travelling signal dots + breathing core
   L3  volumetric haze blobs + vignette (edges fall to black)

   All procedural — no external images. Optional drop-in slot:
   put an AI-generated /public/images/hero-backdrop.jpg and it
   is mounted automatically as the deepest layer.
   ============================================================ */

// Circuit traces etched into the monolith face (slab spans x 180-420)
const TRACES = [
  'M300 1000 V760 H250 V560 H320 V420',
  'M350 1000 V840 H388 V620 H336 V470',
  'M225 1000 V700 H280 V520 H252 V400',
  'M395 1000 V740 H348 V330 H300 V230',
];

// Terminal pads at each trace end
const PADS = [
  [320, 420],
  [336, 470],
  [252, 400],
  [300, 230],
];

/* AI-generated atmosphere plates (Gemini) — every plate that loads
   joins the cinematic film; missing files are skipped silently.
   Ordered as one continuous journey down the server cathedral:
   distant glow → walking in → passing slabs → macro seams →
   arrival → monolith climax, then a dip to black and the loop
   restarts at the far end of the hall. */
const PLATE_SRCS = [
  '/images/hero-backdrop-4.jpg', // establishing: foggy vanishing point
  '/images/hero-backdrop.jpg',   // corridor, slabs both sides
  '/images/hero-backdrop-5.jpg', // between the rows, seams brighter
  '/images/hero-backdrop-3.jpg', // diagonal pass along a row
  '/images/hero-backdrop-6.jpg', // close pass, slab fills half frame
  '/images/hero-backdrop-7.jpg', // macro: crimson seams in black metal
  '/images/hero-backdrop-8.jpg', // arrival: monolith, core glowing
  '/images/hero-backdrop-2.jpg', // climax: monolith face, red core
];

const HeroBackdrop = ({ reducedMotion, inView = true }) => {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const monolithRef = useRef(null);
  const tracesRef = useRef(null);
  const filmRef = useRef(null);
  const filmTlRef = useRef(null);
  const dotTweensRef = useRef([]);
  const [plates, setPlates] = useState([]);

  /* ---------- Probe the plates; keep the ones that exist ---------- */
  useEffect(() => {
    let alive = true;
    Promise.all(
      PLATE_SRCS.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (alive) setPlates(results.filter(Boolean));
    });
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- CINEMATIC FILM: slow crossfades + ken-burns drift ----------
     Each plate fades in (2.8s), drifts scale 1.03 → 1.10 while held (~9s),
     then dissolves into the next; the cycle dips to black between loops. */
  useEffect(() => {
    const film = filmRef.current;
    if (!film || plates.length === 0) return undefined;
    const imgs = Array.from(film.querySelectorAll('img'));

    if (reducedMotion || imgs.length === 1) {
      gsap.set(imgs[0], { opacity: 1, scale: 1.04 });
      return undefined;
    }

    const HOLD = 7.5;
    const XFADE = 2.8;
    const ctx = gsap.context(() => {
      gsap.set(imgs, { opacity: 0 });
      const tl = gsap.timeline({ repeat: -1 });
      filmTlRef.current = tl;
      imgs.forEach((img, i) => {
        const at = i * HOLD;
        tl.to(img, { opacity: 1, duration: XFADE, ease: 'power1.inOut' }, at);
        tl.fromTo(
          img,
          { scale: 1.03 },
          { scale: 1.1, duration: HOLD + XFADE, ease: 'none' },
          at
        );
        tl.to(img, { opacity: 0, duration: XFADE, ease: 'power1.inOut' }, at + HOLD);
      });
    }, film);

    return () => {
      filmTlRef.current = null;
      ctx.revert();
    };
  }, [plates, reducedMotion]);

  /* ---------- Pause the heavy film + dot loops while off-screen.
     The film layer (blend + filter + mask + ken-burns scale) is the
     most expensive composite on the page; freezing it once the hero
     leaves the viewport is invisible but keeps scrolling smooth. ---- */
  useEffect(() => {
    if (reducedMotion) return;
    if (filmTlRef.current) {
      if (inView) filmTlRef.current.play();
      else filmTlRef.current.pause();
    }
    dotTweensRef.current.forEach((t) => (inView ? t.play() : t.pause()));
  }, [inView, reducedMotion, plates]);

  /* ---------- SIGNAL DOTS travelling along the traces ---------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const paths = Array.from(svg.querySelectorAll('.monolith-trace'));
    const dots = Array.from(svg.querySelectorAll('.trace-dot'));

    const place = (dot, path, t) => {
      const p = path.getPointAtLength(path.getTotalLength() * t);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
    };

    if (reducedMotion) {
      // Single static state — dots parked along their traces
      dots.forEach((dot, i) => place(dot, paths[i % paths.length], 0.3 + i * 0.16));
      return undefined;
    }

    const ctx = gsap.context(() => {
      dotTweensRef.current = dots.map((dot, i) => {
        const path = paths[i % paths.length];
        const state = { t: 0 };
        return gsap.to(state, {
          t: 1,
          duration: 4.2 + i * 1.4,
          delay: i * 1.15,
          repeat: -1,
          repeatDelay: 0.8,
          ease: 'none',
          onUpdate: () => place(dot, path, state.t),
        });
      });
    }, svg);

    return () => {
      dotTweensRef.current = [];
      ctx.revert();
    };
  }, [reducedMotion]);

  /* ---------- COUNTER-PARALLAX + CLICK SURGE ---------- */
  useEffect(() => {
    if (reducedMotion) return undefined;
    const root = rootRef.current;
    const monolith = monolithRef.current;
    if (!root || !monolith) return undefined;
    const hero = root.closest('.hero-cinematic') || root;

    // Monolith drifts ~0.3x opposite the constellation's parallax
    const xTo = gsap.quickTo(monolith, 'x', { duration: 1.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(monolith, 'y', { duration: 1.2, ease: 'power3.out' });
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      xTo(-nx * 14);
      yTo(-ny * 8);
    };

    // Click anywhere in the hero: traces surge bright + dots sprint ~1.2s
    // (no preventDefault — global click effect stays intact)
    const onClick = () => {
      dotTweensRef.current.forEach((tween) => {
        tween.timeScale(2.6);
        gsap.to(tween, { timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: true });
      });
      if (tracesRef.current) {
        gsap.fromTo(
          tracesRef.current,
          { opacity: 1 },
          { opacity: 0.6, duration: 1.2, ease: 'power2.out', overwrite: true }
        );
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    hero.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      hero.removeEventListener('click', onClick);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`hero-backdrop${reducedMotion ? ' is-static' : ''}`}
      aria-hidden="true"
    >
      {/* L0: AI-generated atmosphere film — slow cinematic dissolves */}
      {plates.length > 0 && (
        <div className="hero-backdrop-film" ref={filmRef}>
          {plates.map((src) => (
            <img key={src} src={src} alt="" draggable="false" />
          ))}
        </div>
      )}

      {/* L1: blueprint floor grid, drifting toward the viewer */}
      <div className="hero-grid">
        <div className="hero-grid-plane" />
      </div>

      {/* L2: server-cathedral monolith, center-right */}
      <div className="hero-monolith" ref={monolithRef}>
        <svg
          ref={svgRef}
          viewBox="0 0 600 1000"
          preserveAspectRatio="xMidYMax meet"
          className="hero-monolith-svg"
        >
          <defs>
            <radialGradient id="monolith-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C8102E" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#C8102E" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="monolith-sweep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F2F0ED" stopOpacity="0" />
              <stop offset="50%" stopColor="#F2F0ED" stopOpacity="0.055" />
              <stop offset="100%" stopColor="#F2F0ED" stopOpacity="0" />
            </linearGradient>
            <clipPath id="monolith-clip">
              <rect x="180" y="80" width="240" height="940" rx="18" />
            </clipPath>
          </defs>

          {/* flanking slabs — darker mass behind the main monolith */}
          <rect x="118" y="320" width="66" height="700" fill="#0A0A0B" stroke="rgba(255,255,255,0.04)" strokeWidth="1" rx="8" />
          <rect x="428" y="440" width="52" height="580" fill="#0A0A0B" stroke="rgba(255,255,255,0.04)" strokeWidth="1" rx="8" />

          {/* main slab — barely lighter than bg, 1px edge highlight */}
          <rect x="180" y="80" width="240" height="940" rx="18" fill="#0C0C0D" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
          <path d="M187 116 V984" stroke="rgba(242,240,237,0.15)" strokeWidth="1" fill="none" />
          <path d="M180 312 H420 M180 648 H420" stroke="rgba(255,255,255,0.045)" strokeWidth="1" fill="none" />

          {/* breathing crimson core */}
          <ellipse
            className="monolith-core"
            cx="300"
            cy="430"
            rx="88"
            ry="195"
            fill="url(#monolith-core-glow)"
            clipPath="url(#monolith-clip)"
          />

          {/* etched circuit traces + travelling signal dots */}
          <g ref={tracesRef} className="monolith-traces" opacity="0.6" clipPath="url(#monolith-clip)">
            {TRACES.map((d) => (
              <path
                key={d}
                d={d}
                className="monolith-trace"
                fill="none"
                stroke="#C8102E"
                strokeWidth="1.2"
              />
            ))}
            {PADS.map(([x, y]) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="3"
                fill="#080808"
                stroke="#C8102E"
                strokeWidth="1.2"
              />
            ))}
            {TRACES.map((d) => (
              <circle key={`dot-${d}`} className="trace-dot" cx="0" cy="0" r="2.6" fill="#E01535" />
            ))}
          </g>

          {/* faint specular sweep gliding across the face every ~12s */}
          <rect
            className="monolith-sweep"
            x="60"
            y="80"
            width="110"
            height="940"
            fill="url(#monolith-sweep-grad)"
            clipPath="url(#monolith-clip)"
          />
        </svg>
      </div>

      {/* L3: volumetric haze + vignette */}
      <div className="hero-vignette" />
    </div>
  );
};

export default HeroBackdrop;
