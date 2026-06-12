import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/HeroLinkTree.css';
import { profile } from '../../content/portfolioData';

/* ============================================================
   HERO LINK TREE — left-side counterpart to the monolith.
   An organic tree grows from its base: a curved trunk rises,
   branches sweep out like real limbs, leaves sprout and keep
   fluttering, and each branch tip is a live link node
   (GitHub / LinkedIn / X / Email). Sap packets climb the
   curves; canopy sways; click anywhere surges the sap.
   ============================================================ */

/* Trunk built from stacked cubic segments so every branch fork
   sits exactly on a segment joint (packets ride these curves). */
const TRUNK_SEGS = [
  'M70 700 C 64 660, 76 630, 71 600',
  'C 67 575, 73 555, 70 530',
  'C 66 505, 74 478, 70 450',
  'C 67 425, 75 400, 72 370',
];
const TRUNK = TRUNK_SEGS.join(' ');

const BRANCHES = [
  {
    key: 'email', label: 'Email', tip: [162, 545],
    stub: 'M71 600 C 100 596, 138 572, 162 545',
    route: `${TRUNK_SEGS[0]} C 100 596, 138 572, 162 545`,
    leaves: [
      { x: 118, y: 580, r: -30 }, { x: 140, y: 562, r: -12 }, { x: 152, y: 532, r: -55 },
    ],
  },
  {
    key: 'x', label: 'X', tip: [172, 470],
    stub: 'M70 530 C 102 520, 140 492, 172 470',
    route: `${TRUNK_SEGS[0]} ${TRUNK_SEGS[1]} C 102 520, 140 492, 172 470`,
    leaves: [
      { x: 124, y: 505, r: -25 }, { x: 148, y: 484, r: -8 }, { x: 160, y: 456, r: -60 },
    ],
  },
  {
    key: 'linkedin', label: 'LinkedIn', tip: [200, 378],
    stub: 'M70 450 C 108 440, 158 408, 200 378',
    route: `${TRUNK_SEGS[0]} ${TRUNK_SEGS[1]} ${TRUNK_SEGS[2]} C 108 440, 158 408, 200 378`,
    leaves: [
      { x: 130, y: 432, r: -20 }, { x: 158, y: 412, r: -42 }, { x: 178, y: 392, r: -10 }, { x: 190, y: 362, r: -65 },
    ],
  },
  {
    key: 'github', label: 'GitHub', tip: [122, 228],
    stub: 'M72 370 C 74 318, 96 266, 122 228',
    route: `${TRUNK} C 74 318, 96 266, 122 228`,
    leaves: [
      { x: 70, y: 330, r: -95 }, { x: 86, y: 290, r: -50 }, { x: 104, y: 256, r: -30 },
      { x: 96, y: 312, r: 140 }, { x: 116, y: 240, r: -70 }, { x: 132, y: 252, r: 20 },
    ],
  },
];

/* Bare decorative twigs on the shaded side, with a few leaves */
const TWIGS = [
  { d: 'M70 490 C 52 482, 40 470, 34 452', leaves: [{ x: 40, y: 462, r: 200 }, { x: 36, y: 444, r: 230 }] },
  { d: 'M71 580 C 56 574, 46 564, 40 548', leaves: [{ x: 44, y: 556, r: 210 }] },
  { d: 'M70 648 C 84 644, 92 636, 96 624', leaves: [{ x: 92, y: 630, r: -40 }] },
];

/* Slender leaf shape; stem at local (0,0) so it flutters from the stem */
const LEAF_D = 'M0 0 Q5 -4.5 11 -1.5 Q5.5 2.5 0 0';

const HeroLinkTree = () => {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const packetTweensRef = useRef([]);

  const links = {
    github: { href: profile.github, external: true },
    linkedin: { href: profile.linkedin, external: true },
    x: { href: profile.x, external: true },
    email: { href: `mailto:${profile.email}`, external: false },
  };

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = root.closest('.hero-cinematic') || root;

    const ctx = gsap.context(() => {
      const trunk = svg.querySelector('.hlt-trunk');
      const stubs = Array.from(svg.querySelectorAll('.hlt-stub'));
      const twigs = Array.from(svg.querySelectorAll('.hlt-twig'));
      const leaves = Array.from(svg.querySelectorAll('.hlt-leaf'));
      const nodes = svg.querySelectorAll('.hlt-node');
      const labels = svg.querySelectorAll('.hlt-label');
      const routes = Array.from(svg.querySelectorAll('.hlt-route'));
      const packets = Array.from(svg.querySelectorAll('.hlt-packet'));
      const canopy = svg.querySelector('.hlt-canopy');

      const drawables = [trunk, ...stubs, ...twigs];
      drawables.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.dataset.len = len;
      });

      if (reduced) {
        /* Fully grown, still frame */
        drawables.forEach((p) => { p.style.strokeDasharray = 'none'; });
        gsap.set([...nodes, ...labels, ...leaves], { opacity: 1, scale: 1 });
        return;
      }

      /* ---- GROWTH ---- */
      const tl = gsap.timeline({ delay: 0.9 });
      tl.fromTo(trunk, { strokeDashoffset: () => Number(trunk.dataset.len) },
        { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut' }, 0);
      /* branches fork as the trunk passes them (email lowest → github crown) */
      stubs.forEach((stub, i) => {
        tl.fromTo(stub, { strokeDashoffset: () => Number(stub.dataset.len) },
          { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, 0.5 + i * 0.28);
      });
      twigs.forEach((twig, i) => {
        tl.fromTo(twig, { strokeDashoffset: () => Number(twig.dataset.len) },
          { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 0.7 + i * 0.2);
      });
      /* leaves sprout in loose order, like buds opening */
      tl.fromTo(leaves, { opacity: 0, scale: 0 },
        {
          opacity: 1, scale: 1, duration: 0.5,
          stagger: { each: 0.06, from: 'random' },
          ease: 'back.out(2.6)',
          transformOrigin: '0% 50%',
        }, 1.15);
      tl.fromTo(nodes, { opacity: 0, scale: 0, transformOrigin: 'center' },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.14, ease: 'back.out(2.4)' }, 1.35);
      tl.fromTo(labels, { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.14, ease: 'power3.out' }, 1.45);

      /* ---- LIFE: canopy sway + leaf flutter ---- */
      gsap.to(canopy, {
        rotation: 0.9,
        transformOrigin: '70px 700px',
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.6,
      });
      leaves.forEach((leaf, i) => {
        gsap.to(leaf, {
          rotation: `+=${6 + (i % 3) * 3}`,
          transformOrigin: '0% 50%',
          duration: 1.8 + (i % 5) * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2.2 + (i % 7) * 0.3,
        });
      });

      /* ---- SAP packets climbing root → tips ---- */
      packetTweensRef.current = packets.map((dot, i) => {
        const route = routes[i % routes.length];
        const state = { t: 0 };
        return gsap.to(state, {
          t: 1,
          duration: 3.8 + (i % 3) * 1.1,
          delay: 2.6 + i * 1.0,
          repeat: -1,
          repeatDelay: 1.6,
          ease: 'none',
          onUpdate: () => {
            const pt = route.getPointAtLength(route.getTotalLength() * state.t);
            dot.setAttribute('cx', pt.x);
            dot.setAttribute('cy', pt.y);
            dot.setAttribute('opacity', state.t < 0.04 || state.t > 0.97 ? 0 : 0.9);
          },
        });
      });
    }, root);

    /* ---- Counter-parallax + click surge (mirrors the monolith) ---- */
    let onMove;
    let onClick;
    if (!reduced) {
      const xTo = gsap.quickTo(root, 'x', { duration: 1.2, ease: 'power3.out' });
      const yTo = gsap.quickTo(root, 'y', { duration: 1.2, ease: 'power3.out' });
      onMove = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        xTo(nx * 10);
        yTo(ny * 6);
      };
      onClick = () => {
        packetTweensRef.current.forEach((tween) => {
          tween.timeScale(2.6);
          gsap.to(tween, { timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: true });
        });
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      hero.addEventListener('click', onClick);
    }

    return () => {
      if (onMove) window.removeEventListener('mousemove', onMove);
      if (onClick) hero.removeEventListener('click', onClick);
      packetTweensRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <div className="hero-link-tree" ref={rootRef}>
      <svg
        ref={svgRef}
        viewBox="0 0 380 760"
        preserveAspectRatio="xMinYMax meet"
        aria-label="Profile links"
      >
        <g className="hlt-canopy">
          {/* ground hairline */}
          <path d="M28 700 H132" className="hlt-ground" fill="none" />

          {/* trunk */}
          <path d={TRUNK} className="hlt-trunk" fill="none" />

          {/* bare twigs + their leaves */}
          {TWIGS.map((t) => (
            <g key={t.d}>
              <path d={t.d} className="hlt-twig" fill="none" />
              {t.leaves.map((lf) => (
                <path
                  key={`${lf.x}-${lf.y}`}
                  d={LEAF_D}
                  className="hlt-leaf hlt-leaf-dim"
                  transform={`translate(${lf.x} ${lf.y}) rotate(${lf.r})`}
                />
              ))}
            </g>
          ))}

          {/* invisible packet rails */}
          {BRANCHES.map((b) => (
            <path key={`route-${b.key}`} d={b.route} className="hlt-route" fill="none" />
          ))}

          {/* limbs: branch + leaves + live link tip */}
          {BRANCHES.map((b, bi) => {
            const link = links[b.key];
            const [tx, ty] = b.tip;
            return (
              <g key={b.key} className="hlt-branch">
                <path d={b.stub} className="hlt-stub" fill="none" />
                {b.leaves.map((lf, li) => (
                  <path
                    key={`${lf.x}-${lf.y}`}
                    d={LEAF_D}
                    className={`hlt-leaf${(bi + li) % 4 === 0 ? ' hlt-leaf-bright' : ''}`}
                    transform={`translate(${lf.x} ${lf.y}) rotate(${lf.r})`}
                  />
                ))}
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="hlt-link clickable"
                  aria-label={b.label}
                >
                  {/* generous invisible hit area */}
                  <rect x={tx - 14} y={ty - 22} width={b.label.length * 11 + 48} height="44" fill="transparent" />
                  <circle cx={tx} cy={ty} r="4.5" className="hlt-node" />
                  <circle cx={tx} cy={ty} r="9" className="hlt-node-ring" />
                  <text x={tx + 18} y={ty + 4} className="hlt-label">{b.label}</text>
                </a>
              </g>
            );
          })}

          {/* sap packets */}
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} className="hlt-packet" r="2.4" opacity="0" />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default HeroLinkTree;
