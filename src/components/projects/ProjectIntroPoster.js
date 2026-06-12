import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/ProjectIntroPoster.css';

/* ============================================================
   PROJECT INTRO POSTER — Remotion-style 3-beat looping intro,
   rendered live (SVG + GSAP) so it stays crisp and interactive.

   Beat 1  eyebrow + display title + accent rule
   Beat 2  project motif draws itself (pipeline / network / moon
           / sync / blueprint / chart)
   Beat 3  metric punch-in → hold → crossfade → loop

   Plays only while in view (IntersectionObserver), restarts on
   hover, renders the final composed frame statically under
   prefers-reduced-motion.
   ============================================================ */

/* ---------------- Motif SVG content per project ---------------- */

/* TedOS — elaborate run-graph: intake → validate → router →
   3× Claude fan-out → parse → Supabase → GHL / n8n fallback
   (dashed retry loop back to parse) → deploy. The FIRST .pi-draw
   is the serpentine spine, so packets travel the whole system. */
const PIPE_NODES = [
  { x: 52, y: 120, label: 'Webhook', sub: 'intake', alt: false },
  { x: 152, y: 120, label: 'Validate', sub: '20 fields', alt: true },
  { x: 252, y: 120, label: 'Router', sub: '17+ jobs', alt: false },
  { x: 368, y: 48, label: 'Sales Copy', sub: 'Claude', alt: false },
  { x: 368, y: 120, label: 'Email Seq', sub: 'Claude', alt: false },
  { x: 368, y: 192, label: 'VSL Script', sub: 'Claude', alt: false },
  { x: 470, y: 120, label: 'Parse JSON', sub: 'schema guard', alt: true },
  { x: 575, y: 120, label: 'Supabase', sub: 'RLS', alt: true },
  { x: 564, y: 300, label: 'Fallback', sub: 'n8n · retry', alt: true },
  { x: 440, y: 300, label: 'GHL CRM', sub: 'OAuth 2.0', alt: true },
  { x: 310, y: 300, label: 'Deploy', sub: '60 min', alt: false },
];

const PIPE_TICKS = [
  [188, 104],
  [611, 104],
  [346, 284],
];

const MotifPipeline = () => (
  <g>
    {/* main spine — FIRST .pi-draw, packets ride it end to end */}
    <path d="M16 120 H598 C634 120 634 300 598 300 H312" className="pi-draw" fill="none" strokeWidth="1.4" />
    {/* router fan-out to the outer Claude jobs */}
    <path d="M288 110 C318 92 322 64 332 54" className="pi-draw" fill="none" strokeWidth="1.2" />
    <path d="M288 130 C318 148 322 176 332 186" className="pi-draw" fill="none" strokeWidth="1.2" />
    {/* merge back into Parse JSON */}
    <path d="M404 54 C418 64 426 92 434 110" className="pi-draw" fill="none" strokeWidth="1.2" />
    <path d="M404 186 C418 176 426 148 434 130" className="pi-draw" fill="none" strokeWidth="1.2" />
    {/* supabase → fallback branch */}
    <path d="M575 136 C575 205 568 245 564 284" className="pi-draw pi-faint" fill="none" strokeWidth="1.1" />
    {/* dashed retry loop: fallback → parse */}
    <path d="M548 284 C534 218 510 168 484 140" className="pi-draw pi-arrow-path" fill="none" strokeWidth="1.2" strokeDasharray="4 6" />
    <g className="pi-pop" style={{ transformOrigin: '484px 140px' }}>
      <path d="M493 144 L484 140 L487 149" className="pi-arrowhead" fill="none" strokeWidth="1.3" />
    </g>

    {PIPE_NODES.map((n) => (
      <g key={n.label} className="pi-pop" style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
        <rect x={n.x - 36} y={n.y - 16} width="72" height="32" rx="6" className="pi-node" />
        <rect x={n.x - 36} y={n.y - 16} width="3" height="32" rx="1.5" className={n.alt ? 'pi-node-edge-alt' : 'pi-node-edge'} />
        <text x={n.x + 1} y={n.y - 1} textAnchor="middle" className="pi-node-label" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>
          {n.label}
        </text>
        <text x={n.x + 1} y={n.y + 10} textAnchor="middle" className="pi-node-sub">{n.sub}</text>
      </g>
    ))}

    {/* success ticks on key nodes */}
    {PIPE_TICKS.map(([tx, ty]) => (
      <g key={`${tx}-${ty}`} className="pi-pop" style={{ transformOrigin: `${tx}px ${ty}px` }}>
        <circle cx={tx} cy={ty} r="6.5" className="pi-node" />
        <path d={`M${tx - 3} ${ty} l2.2 2.4 4 -5`} className="pi-tick" strokeWidth="1.5" fill="none" />
      </g>
    ))}

    {[0, 1, 2].map((i) => (
      <circle key={i} className="pi-packet" r="3" />
    ))}
  </g>
);

/* Review graph — force-directed look: 4 theme clusters (hub +
   satellites), curved intra-cluster edges, brighter inter-cluster
   bridges. FIRST .pi-draw is the long A→C→D bridge for packets. */
const qCurve = (a, b, bow) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const cx = (mx - (b[1] - a[1]) * bow).toFixed(1);
  const cy = (my + (b[0] - a[0]) * bow).toFixed(1);
  return `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`;
};

const NET_CLUSTERS = [
  {
    name: 'packaging',
    hub: [168, 152],
    hubR: 6,
    glowR: 48,
    label: [168, 254],
    sats: [
      [112, 108, 3], [215, 95, 2.5], [240, 160, 3.5], [205, 215, 3],
      [130, 212, 2.5], [96, 170, 3], [146, 72, 2], [252, 118, 2.5], [180, 232, 2],
    ],
    links: [[0, 5], [1, 7], [3, 8]],
  },
  {
    name: 'battery',
    hub: [438, 108],
    hubR: 5.5,
    glowR: 40,
    label: [438, 198],
    sats: [
      [382, 72, 2.5], [492, 70, 3], [515, 128, 2.5], [468, 168, 3],
      [398, 156, 2.5], [440, 40, 2], [350, 118, 3],
    ],
    links: [[0, 5], [2, 3]],
  },
  {
    name: 'shipping',
    hub: [352, 296],
    hubR: 5,
    glowR: 38,
    label: [352, 376],
    sats: [
      [295, 260, 3], [300, 330, 2.5], [368, 352, 3], [420, 322, 2.5],
      [412, 258, 3], [330, 240, 2], [262, 300, 2.5],
    ],
    links: [[1, 6], [2, 3]],
  },
  {
    name: 'value',
    hub: [564, 232],
    hubR: 4.5,
    glowR: 30,
    label: [566, 310],
    sats: [[602, 190, 2.5], [612, 262, 2], [548, 288, 2.5], [530, 182, 2]],
    links: [[0, 3]],
  },
];

const NET_BRIDGES = [
  'M168 152 Q252 252 352 296 Q474 294 564 232',
  'M168 152 Q300 92 438 108',
  'M438 108 Q524 142 564 232',
  'M438 108 Q372 196 352 296',
  'M252 118 Q300 100 350 118',
];

const NET_BARS = [
  { x: 96, h: 22, label: '+12%' },
  { x: 126, h: 34, label: '+21%' },
  { x: 156, h: 48, label: '+34%' },
  { x: 186, h: 18, label: '−8%', down: true },
  { x: 216, h: 60, label: '+47%' },
];

const NET_ACCENTS = new Set(['packaging-hub', 'battery-s3', 'shipping-s4']);

const MotifNetwork = () => (
  <g>
    <defs>
      <radialGradient id="piNetGlow">
        <stop offset="0%" stopColor="#FF9F45" stopOpacity="0.15" />
        <stop offset="70%" stopColor="#FF9F45" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#FF9F45" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* soft amber glow behind each hub */}
    {NET_CLUSTERS.map((c) => (
      <circle
        key={`${c.name}-glow`}
        className="pi-pop"
        cx={c.hub[0]}
        cy={c.hub[1]}
        r={c.glowR}
        fill="url(#piNetGlow)"
        style={{ transformOrigin: `${c.hub[0]}px ${c.hub[1]}px` }}
      />
    ))}

    {/* inter-cluster bridges — the first carries the packets */}
    {NET_BRIDGES.map((d, i) => (
      <path key={d} d={d} className="pi-draw pi-bridge" fill="none" strokeWidth={i === 0 ? 1.2 : 1} />
    ))}

    {/* dotted ring around the dominant cluster */}
    <circle cx="168" cy="152" r="88" className="pi-draw pi-arrow-path pi-ring" fill="none" strokeWidth="0.8" strokeDasharray="2 7" />

    {/* intra-cluster edges: hub spokes + satellite links */}
    {NET_CLUSTERS.map((c) => (
      <g key={`${c.name}-edges`}>
        {c.sats.map((s, i) => (
          <path
            key={`${c.name}-spoke-${i}`}
            d={qCurve(c.hub, s, i % 2 ? 0.14 : -0.14)}
            className="pi-draw pi-faint"
            fill="none"
            strokeWidth="1"
          />
        ))}
        {c.links.map(([a, b]) => (
          <path
            key={`${c.name}-link-${a}-${b}`}
            d={qCurve(c.sats[a], c.sats[b], 0.2)}
            className="pi-draw pi-faint"
            fill="none"
            strokeWidth="0.8"
          />
        ))}
      </g>
    ))}

    {/* sentiment baseline */}
    <path d="M84 352 H230" className="pi-draw pi-faint" fill="none" strokeWidth="1" />

    {/* nodes + cluster labels */}
    {NET_CLUSTERS.map((c) => (
      <g key={`${c.name}-nodes`}>
        <circle
          cx={c.hub[0]}
          cy={c.hub[1]}
          r={c.hubR}
          className={`pi-pop pi-dot${NET_ACCENTS.has(`${c.name}-hub`) ? ' pi-dot-accent' : ''}`}
          style={{ transformOrigin: `${c.hub[0]}px ${c.hub[1]}px` }}
        />
        {c.sats.map(([x, y, r], i) => (
          <circle
            key={`${c.name}-s${i}`}
            cx={x}
            cy={y}
            r={r}
            className={`pi-pop pi-dot${NET_ACCENTS.has(`${c.name}-s${i}`) ? ' pi-dot-accent' : ''}`}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
        <g className="pi-pop" style={{ transformOrigin: `${c.label[0]}px ${c.label[1]}px` }}>
          <text
            x={c.label[0]}
            y={c.label[1]}
            textAnchor="middle"
            className="pi-node-label"
            style={{ fontSize: '9px', letterSpacing: '0.24em', opacity: 0.55 }}
          >
            {c.name}
          </text>
        </g>
      </g>
    ))}

    {/* rising sentiment bars with per-bar deltas (one negative) */}
    {NET_BARS.map((b) => (
      <g key={`bar-${b.x}`}>
        <rect
          x={b.x - 7}
          y={b.down ? 355 : 352 - b.h}
          width="14"
          height={b.h}
          className={`pi-bar${b.down ? ' pi-bar-down' : ''}`}
          style={{ transformOrigin: `${b.x}px ${b.down ? 355 : 352}px` }}
        />
        <g className="pi-pop" style={{ transformOrigin: `${b.x}px ${b.down ? 355 + b.h + 12 : 352 - b.h - 7}px` }}>
          <text
            x={b.x}
            y={b.down ? 355 + b.h + 12 : 352 - b.h - 7}
            textAnchor="middle"
            className="pi-ticker"
            style={{ fontSize: '8.5px' }}
          >
            {b.label}
          </text>
        </g>
      </g>
    ))}

    {[0, 1].map((i) => (
      <circle key={i} className="pi-packet" r="2.6" />
    ))}
  </g>
);

const MotifMoon = () => (
  <g>
    <path
      d="M380 80 A120 120 0 1 0 380 320 A95 120 0 1 1 380 80"
      className="pi-draw"
      fill="none"
      strokeWidth="1.4"
    />
    <path d="M120 360 H520" className="pi-draw pi-faint" fill="none" strokeWidth="1" />
    <path d="M170 52 H470" className="pi-draw pi-faint" fill="none" strokeWidth="1" />
    {[150, 230, 310, 390, 470, 200, 280, 360, 440].map((x, i) => (
      <circle
        key={`${x}-${i}`}
        cx={x}
        cy={120 + ((i * 67) % 200)}
        r={i % 3 === 0 ? 2.2 : 1.4}
        className="pi-particle"
      />
    ))}
  </g>
);

const MotifSync = () => (
  <g>
    <path
      d="M320 90 C220 130 180 220 200 310 M320 90 C420 130 460 220 440 310 M320 90 V330 M260 170 C290 185 350 185 380 170 M240 240 C280 262 360 262 400 240"
      className="pi-draw"
      fill="none"
      strokeWidth="1.3"
    />
    <path
      d="M150 200 A170 170 0 0 1 320 60"
      className="pi-draw pi-arrow-path"
      fill="none"
      strokeWidth="1.6"
      strokeDasharray="6 7"
    />
    <path
      d="M490 200 A170 170 0 0 1 320 340"
      className="pi-draw pi-arrow-path"
      fill="none"
      strokeWidth="1.6"
      strokeDasharray="6 7"
    />
    <g className="pi-pop" style={{ transformOrigin: '152px 196px' }}>
      <path d="M140 210 L152 188 L164 210" className="pi-arrowhead" fill="none" strokeWidth="1.6" />
      <text x="118" y="240" className="pi-node-label">OFFLINE</text>
    </g>
    <g className="pi-pop" style={{ transformOrigin: '488px 204px' }}>
      <path d="M476 190 L488 212 L500 190" className="pi-arrowhead" fill="none" strokeWidth="1.6" />
      <text x="462" y="172" className="pi-node-label">ONLINE</text>
    </g>
    <circle className="pi-packet" r="3" />
  </g>
);

const MotifBlueprint = () => (
  <g>
    <path
      d="M140 340 V160 L240 110 V340 M240 160 H420 V340 M280 200 H320 V250 H280 Z M350 200 H390 V250 H350 Z M280 280 H320 V340 M460 340 V200 L520 170 V340"
      className="pi-draw"
      fill="none"
      strokeWidth="1.3"
    />
    <path d="M100 340 H560" className="pi-draw" fill="none" strokeWidth="1.6" />
    <path d="M140 360 H420 M140 354 V366 M420 354 V366" className="pi-draw pi-faint" fill="none" strokeWidth="1" />
    {[160, 200, 240, 280, 320, 360, 400, 440, 480, 520].map((x) => (
      <path key={x} d={`M${x} 88 V96`} className="pi-draw pi-faint" fill="none" strokeWidth="1" />
    ))}
    <path d="M100 92 H560" className="pi-draw pi-faint" fill="none" strokeWidth="0.8" />
  </g>
);

const MotifChart = () => {
  const candles = [
    [120, 250, 290, 235], [160, 230, 280, 245], [200, 240, 285, 222],
    [240, 205, 252, 230], [280, 215, 262, 200], [320, 180, 228, 208],
    [360, 190, 235, 172], [400, 155, 200, 178], [440, 162, 205, 148],
    [480, 130, 172, 152], [520, 138, 178, 122],
  ];
  return (
    <g>
      {candles.map(([x, bodyTop, wickBot, wickTop], i) => (
        <g key={x} className="pi-pop" style={{ transformOrigin: `${x}px ${(wickTop + wickBot) / 2}px` }}>
          <path d={`M${x} ${wickTop} V${wickBot}`} className={i % 4 === 3 ? 'pi-wick-down' : 'pi-wick'} strokeWidth="1.2" fill="none" />
          <rect x={x - 8} y={bodyTop} width="16" height={Math.max(14, (wickBot - wickTop) * 0.45)} className={i % 4 === 3 ? 'pi-candle-down' : 'pi-candle'} />
        </g>
      ))}
      <path
        d="M110 268 L200 252 L260 232 L330 212 L400 180 L470 168 L545 132"
        className="pi-draw"
        fill="none"
        strokeWidth="1.6"
      />
      <text x="120" y="340" className="pi-ticker">BTC 67,412.08 ▲</text>
      <text x="330" y="340" className="pi-ticker pi-ticker-b">ETH 3,581.44 ▲</text>
    </g>
  );
};

const MOTIFS = {
  pipeline: MotifPipeline,
  network: MotifNetwork,
  moon: MotifMoon,
  sync: MotifSync,
  blueprint: MotifBlueprint,
  chart: MotifChart,
};

/* ---------------- Component ---------------- */

const ProjectIntroPoster = ({ project, intro }) => {
  const rootRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pace = intro.pace || 1;
    let observer;
    let onEnter;
    let onLeave;

    const ctx = gsap.context(() => {
      const copy = root.querySelectorAll('.pi-eyebrow, .pi-title, .pi-tagline');
      const rule = root.querySelector('.pi-rule');
      const metric = root.querySelector('.pi-metric');
      const draws = svg.querySelectorAll('.pi-draw');
      const pops = svg.querySelectorAll('.pi-pop');
      const bars = svg.querySelectorAll('.pi-bar');
      const particles = svg.querySelectorAll('.pi-particle');
      const packets = svg.querySelectorAll('.pi-packet');
      const fadeTargets = root.querySelectorAll('.pi-copy, .pi-motif, .pi-metric');

      /* Prepare stroke-draw lengths */
      draws.forEach((p) => {
        const len = p.getTotalLength ? p.getTotalLength() : 0;
        p.style.strokeDasharray = p.classList.contains('pi-arrow-path') ? p.style.strokeDasharray : `${len}`;
        p.dataset.len = len;
      });

      if (reduced) {
        /* Final composed frame, no motion */
        gsap.set([...copy, rule, metric, ...pops, ...bars, ...particles], { opacity: 1, clearProps: 'transform' });
        draws.forEach((p) => { p.style.strokeDasharray = 'none'; });
        return;
      }

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });

      /* Beat 1 — copy */
      tl.fromTo(copy, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 * pace, stagger: 0.14 * pace, ease: 'power3.out' }, 0);
      if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7 * pace, ease: 'power3.inOut' }, 0.3 * pace);

      /* Beat 2 — motif draws (stagger capped so dense motifs
         still finish before the loop's crossfade) */
      const drawStep = Math.min(0.08, 2.0 / Math.max(draws.length, 1));
      draws.forEach((p, i) => {
        if (p.classList.contains('pi-arrow-path')) {
          tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.5 * pace, ease: 'none' }, (0.7 + i * drawStep) * pace);
        } else {
          tl.fromTo(
            p,
            { strokeDashoffset: () => Number(p.dataset.len) },
            { strokeDashoffset: 0, duration: 0.9 * pace, ease: 'power2.inOut' },
            (0.6 + i * drawStep) * pace
          );
        }
      });
      if (pops.length) {
        const popStagger = Math.min(0.07, 1.2 / pops.length);
        tl.fromTo(pops, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45 * pace, stagger: popStagger * pace, ease: 'back.out(2)' }, 1.0 * pace);
      }
      if (bars.length) {
        tl.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.5 * pace, stagger: 0.1 * pace, ease: 'power3.out' }, 1.6 * pace);
      }
      if (particles.length) {
        tl.fromTo(particles, { opacity: 0 }, { opacity: 0.8, duration: 0.8 * pace, stagger: 0.05 * pace, ease: 'none' }, 0.8 * pace);
      }

      /* Beat 3 — metric punch */
      if (metric) {
        tl.fromTo(metric, { opacity: 0, y: 16, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 * pace, ease: 'back.out(1.8)' }, 2.3 * pace);
      }

      /* Hold, then crossfade out for the loop */
      tl.to(fadeTargets, { opacity: 0, duration: 0.6, ease: 'power2.in' }, (2.3 + 2.6) * pace);
      tl.set([...copy, rule, metric, ...pops, ...bars, ...particles], { clearProps: 'all' });
      tl.set(fadeTargets, { opacity: 1 });

      /* Continuous packet travel along the first drawable path */
      const packetTweens = [];
      const firstPath = svg.querySelector('.pi-draw');
      if (firstPath && packets.length && firstPath.getTotalLength) {
        packets.forEach((dot, i) => {
          const state = { t: 0 };
          packetTweens.push(
            gsap.to(state, {
              t: 1,
              duration: 2.4 + i * 0.9,
              delay: 1.4 + i * 0.8,
              repeat: -1,
              ease: 'none',
              paused: true,
              onUpdate: () => {
                const p = firstPath.getPointAtLength(firstPath.getTotalLength() * state.t);
                dot.setAttribute('cx', p.x);
                dot.setAttribute('cy', p.y);
              },
            })
          );
        });
      }

      /* Drifting particles (moon) */
      particles.forEach((dot, i) => {
        packetTweens.push(
          gsap.to(dot, {
            y: -26 - (i % 3) * 10,
            duration: 5 + (i % 4),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            paused: true,
          })
        );
      });

      /* Play only in view */
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tl.play();
              packetTweens.forEach((t) => t.play());
            } else {
              tl.pause();
              packetTweens.forEach((t) => t.pause());
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(root);

      /* Hover: replay from the top */
      onEnter = () => {
        tl.restart();
        root.classList.add('is-hot');
      };
      onLeave = () => root.classList.remove('is-hot');
      root.addEventListener('mouseenter', onEnter);
      root.addEventListener('mouseleave', onLeave);
    }, root);

    return () => {
      if (observer) observer.disconnect();
      if (onEnter) root.removeEventListener('mouseenter', onEnter);
      if (onLeave) root.removeEventListener('mouseleave', onLeave);
      ctx.revert();
    };
  }, [intro]);

  const Motif = MOTIFS[intro.motif] || MotifPipeline;

  return (
    <div
      className={`project-intro-poster pi-motif-${intro.motif}`}
      ref={rootRef}
      style={{
        '--pi-bg': intro.bg,
        '--pi-accent': intro.accent,
        '--pi-accent-2': intro.accent2 || intro.accent,
        '--pi-soft': intro.accentSoft,
      }}
      aria-label={`${project.title} — animated intro`}
    >
      <svg className="pi-motif" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" ref={svgRef} aria-hidden="true">
        <Motif />
      </svg>

      <div className="pi-copy">
        <span className="pi-eyebrow">{intro.eyebrow}</span>
        <strong className="pi-title">{intro.displayTitle}</strong>
        <span className="pi-rule" aria-hidden="true" />
        <span className="pi-tagline">{intro.tagline}</span>
      </div>

      <div className="pi-metric">
        <strong className="pi-metric-value">{intro.metricValue}</strong>
        <span className="pi-metric-label">{intro.metricLabel}</span>
      </div>

      <div className="pi-vignette" aria-hidden="true" />
    </div>
  );
};

export default ProjectIntroPoster;
