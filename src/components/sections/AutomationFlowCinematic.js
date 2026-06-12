import React, { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/AutomationFlowCinematic.css';
import { automationWorkflow } from '../../content/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/* ---- Canvas geometry (viewBox units) ----
   8 columns (0–7): PAD_X + 7*COL_STEP + NODE_W = 1393 ≤ VIEW_W */
const NODE_W = 150;
const NODE_H = 92;
const COL_STEP = 177;
const ROW_STEP = 150;
const PAD_X = 4;
const PAD_Y = 20;
const VIEW_W = 1400;
const VIEW_H = 440;

const TYPE_TINTS = {
  trigger: '#E01535',
  ai: '#C8102E',
  data: '#F2F0ED',
  integration: 'rgba(242, 240, 237, 0.45)',
  output: '#E01535',
};

/* ---- Hand-drawn 20x20 line icons, stroke: currentColor ---- */
const NodeIcon = ({ icon, size = 18 }) => {
  const shapes = {
    webhook: <path d="M11 1.8 4.4 11h4.4L8 18.2 14.8 9h-4.4L11 1.8z" />,
    filter: <path d="M3 4h14l-5.4 6.4v4.8l-3.2 1.6v-6.4L3 4z" />,
    sparkle: (
      <>
        <path d="M10 3.2l1.6 5.2 5.2 1.6-5.2 1.6L10 16.8l-1.6-5.2L3.2 10l5.2-1.6L10 3.2z" />
        <path d="M16.2 2.6v2.8M14.8 4h2.8" />
      </>
    ),
    mail: (
      <>
        <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
        <path d="M3.5 6l6.5 5 6.5-5" />
      </>
    ),
    film: (
      <>
        <rect x="2.5" y="4" width="15" height="12" rx="2" />
        <path d="M8.6 7.4v5.2L13 10l-4.4-2.6z" />
      </>
    ),
    database: (
      <>
        <ellipse cx="10" cy="4.8" rx="6.2" ry="2.4" />
        <path d="M3.8 4.8v10.4c0 1.3 2.8 2.4 6.2 2.4s6.2-1.1 6.2-2.4V4.8" />
        <path d="M3.8 10c0 1.3 2.8 2.4 6.2 2.4s6.2-1.1 6.2-2.4" />
      </>
    ),
    plug: (
      <>
        <path d="M7 2.5v4M13 2.5v4" />
        <path d="M5.5 6.5h9V10a4.5 4.5 0 0 1-9 0V6.5z" />
        <path d="M10 14.5v3" />
      </>
    ),
    route: (
      <>
        <path d="M2.5 10h5.5" />
        <path d="M8 10c3.4 0 3.2-4.6 6.6-4.6h2" />
        <path d="M8 10c3.4 0 3.2 4.6 6.6 4.6h2" />
        <path d="M14.4 3.2l2.2 2.2-2.2 2.2M14.4 12.4l2.2 2.2-2.2 2.2" />
      </>
    ),
    braces: (
      <>
        <path d="M7.5 3C5.5 3 6.5 8 4 10c2.5 2 1.5 7 3.5 7" />
        <path d="M12.5 3c2 0 1 5 3.5 7-2.5 2-1.5 7-3.5 7" />
      </>
    ),
    pulse: <path d="M2.5 10.5h3.4l2-5 3.4 9 2.2-6.5 1.2 2.5h3.8" />,
    repeat: (
      <>
        <path d="M15.5 8.5a6 6 0 0 0-11-1.6" />
        <path d="M4.5 3.4V7h3.6" />
        <path d="M4.5 11.5a6 6 0 0 0 11 1.6" />
        <path d="M15.5 16.6V13h-3.6" />
      </>
    ),
    send: (
      <>
        <path d="M2.8 9.8l14.4-6.6-4 13.6-4.2-5.2-6.2-1.8z" />
        <path d="M17.2 3.2L9 11.6" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[icon] || shapes.webhook}
    </svg>
  );
};

const nodePos = (node) => ({
  x: PAD_X + node.col * COL_STEP,
  y: PAD_Y + node.row * ROW_STEP,
});

const edgePath = (fromNode, toNode) => {
  const a = nodePos(fromNode);
  const b = nodePos(toNode);
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const dx = Math.max((x2 - x1) / 2, 24);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};

const AutomationFlowCinematic = () => {
  const sectionRef = useRef();

  const { nodes, edges } = automationWorkflow;

  const nodeById = useMemo(() => {
    const map = {};
    nodes.forEach((n) => { map[n.id] = n; });
    return map;
  }, [nodes]);

  /* Dependency order: left to right, top to bottom */
  const orderedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.col - b.col || a.row - b.row),
    [nodes]
  );

  useEffect(() => {
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ============================================================
         DESKTOP — pinned, scroll-scrubbed "run mode"
         ============================================================ */
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const head = section.querySelector('.afc-head');
        const wires = gsap.utils.toArray(section.querySelectorAll('.afc-wire'));
        const packets = gsap.utils.toArray(section.querySelectorAll('.afc-packet'));
        const chips = gsap.utils.toArray(section.querySelectorAll('.afc-stat-chip'));
        const caption = section.querySelector('.afc-caption');

        /* Prepare wire + tick draw states */
        const wireLengths = new Map();
        wires.forEach((wire) => {
          const len = wire.getTotalLength();
          wireLengths.set(wire, len);
          gsap.set(wire, { strokeDasharray: len, strokeDashoffset: len });
        });
        section.querySelectorAll('.afc-tick-path').forEach((tick) => {
          const len = tick.getTotalLength();
          gsap.set(tick, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(section.querySelectorAll('.afc-node-status'), { opacity: 0 });

        /* Data packets traveling along wires (time-based loops,
           gated by scrub progress — getPointAtLength, no plugins) */
        const wireDoneTime = new Map();
        let thresholds = [];
        const packetTweens = wires.map((wire, i) => {
          const dot = packets[i];
          const len = wireLengths.get(wire);
          const proxy = { t: 0 };
          return gsap.to(proxy, {
            t: 1,
            duration: Math.max(len / 220, 0.9),
            ease: 'none',
            repeat: -1,
            repeatDelay: 0.35 + (i % 4) * 0.22,
            paused: true,
            onUpdate() {
              const pt = wire.getPointAtLength(proxy.t * len);
              gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
            },
          });
        });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=180%',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            onUpdate(self) {
              if (!thresholds.length) return;
              packetTweens.forEach((tween, i) => {
                const live = self.progress >= thresholds[i];
                if (live && tween.paused()) {
                  gsap.set(packets[i], { opacity: 1 });
                  tween.play();
                } else if (!live && !tween.paused()) {
                  tween.pause();
                  gsap.set(packets[i], { opacity: 0 });
                }
              });
            },
          },
        });

        tl.fromTo(head, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 });

        /* Nodes materialize in dependency order; incoming wires
           draw first, then the node executes and ticks green-room style */
        orderedNodes.forEach((node) => {
          const group = section.querySelector(`[data-afc-node="${node.id}"] .afc-node`);
          if (!group) return;
          const glow = group.querySelector('.afc-node-glow');
          const status = group.querySelector('.afc-node-status');
          const tickPath = group.querySelector('.afc-tick-path');
          const inWires = wires.filter((w) => w.dataset.to === node.id);

          if (inWires.length) {
            tl.to(inWires, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, '>-0.1');
            const drawEnd = tl.recent().endTime();
            inWires.forEach((w) => wireDoneTime.set(w, drawEnd));
          }

          tl.fromTo(
            group,
            { opacity: 0, y: 14, scale: 0.96, transformOrigin: '50% 50%' },
            { opacity: 1, y: 0, scale: 1, duration: 0.45 },
            inWires.length ? '>-0.3' : '>'
          );

          /* executing pulse → success tick */
          tl.to(glow, { opacity: 0.9, duration: 0.2 }, '>-0.05')
            .to(glow, { opacity: 0, duration: 0.35 }, '>');
          tl.to(status, { opacity: 1, duration: 0.15 }, '<-0.1');
          tl.to(tickPath, { strokeDashoffset: 0, duration: 0.3 }, '<');
        });

        /* Outcome chips + caption */
        tl.fromTo(
          chips,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          '>-0.1'
        );
        tl.fromTo(caption, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '<0.2');
        tl.to({}, { duration: 0.7 }); /* breathing room at the end of the pin */

        /* Normalize wire-complete times into scrub progress thresholds */
        const total = tl.duration();
        thresholds = wires.map((w) => {
          const done = wireDoneTime.get(w);
          return done == null ? 1 : Math.min(done / total + 0.01, 0.99);
        });

        return () => {
          packetTweens.forEach((tween) => tween.kill());
        };
      });

      /* ============================================================
         MOBILE — no pin, simplified vertical flow, simple fades
         ============================================================ */
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          section.querySelector('.afc-head'),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );

        section.querySelectorAll('.afc-mobile-node, .afc-mobile-connector').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
            }
          );
        });

        gsap.fromTo(
          section.querySelector('.afc-meta'),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section.querySelector('.afc-meta'),
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      /* prefers-reduced-motion: reduce → no handlers run; the DOM's
         default state is the fully-drawn, fully-visible pipeline. */
    }, sectionRef);

    return () => ctx.revert();
  }, [orderedNodes]);

  return (
    <section id="pipeline" className="automation-flow-cinematic section" ref={sectionRef}>
      <div className="container">
        <div className="afc-head">
          <div className="afc-eyebrow">{automationWorkflow.eyebrow}</div>
          <div className="section-header-cinematic">
            <span className="section-number">02</span>
            <h2 className="section-title-cinematic">{automationWorkflow.title}</h2>
            <div className="section-line" />
          </div>
        </div>

        {/* ---- Desktop: n8n-style canvas ---- */}
        <div className="afc-canvas-wrap">
          <svg
            className="afc-canvas"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="TedOS automation pipeline: client intake webhook through validation, job routing, three Claude AI jobs, JSON parsing, Supabase, run ledger, GoHighLevel, and n8n fallback to delivered assets"
          >
            <defs>
              <pattern id="afc-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,0.045)" />
              </pattern>
              <filter id="afc-glow-filter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#afc-dot-grid)" />

            {/* wires */}
            <g className="afc-wires">
              {edges.map((edge) => (
                <path
                  key={`${edge.from}-${edge.to}`}
                  className="afc-wire"
                  data-from={edge.from}
                  data-to={edge.to}
                  d={edgePath(nodeById[edge.from], nodeById[edge.to])}
                />
              ))}
            </g>

            {/* data packets, one per wire */}
            <g className="afc-packets">
              {edges.map((edge) => (
                <circle
                  key={`packet-${edge.from}-${edge.to}`}
                  className="afc-packet"
                  r="3"
                  cx="-10"
                  cy="-10"
                  fill="#E01535"
                />
              ))}
            </g>

            {/* nodes */}
            {nodes.map((node) => {
              const { x, y } = nodePos(node);
              const tint = TYPE_TINTS[node.type] || TYPE_TINTS.data;
              return (
                <g key={node.id} data-afc-node={node.id} transform={`translate(${x}, ${y})`}>
                  <g className="afc-node">
                    <rect
                      className="afc-node-glow"
                      width={NODE_W}
                      height={NODE_H}
                      rx="10"
                      fill="none"
                      stroke="#E01535"
                      strokeWidth="1.4"
                      filter="url(#afc-glow-filter)"
                    />
                    <rect className="afc-node-card" width={NODE_W} height={NODE_H} rx="10" />
                    <rect
                      className="afc-node-edge"
                      x="1"
                      y="12"
                      width="3"
                      height={NODE_H - 24}
                      rx="1.5"
                      fill={tint}
                    />
                    <svg x="16" y="14" width="19" height="19" style={{ color: tint }} className="afc-node-icon" overflow="visible">
                      <NodeIcon icon={node.icon} size={19} />
                    </svg>
                    <text className="afc-node-label" x="16" y="58">{node.label}</text>
                    <text className="afc-node-sublabel" x="16" y="75">{node.sublabel}</text>
                    {/* success tick, n8n run-mode style */}
                    <g className="afc-node-status" transform={`translate(${NODE_W - 19}, 19)`}>
                      <circle r="7.5" className="afc-tick-ring" />
                      <path className="afc-tick-path" d="M-3 0.2l2.1 2.3 4-4.8" />
                    </g>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ---- Mobile: simplified vertical flow ---- */}
        <div className="afc-mobile-flow">
          {orderedNodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {index > 0 && <div className="afc-mobile-connector" />}
              <div className="afc-mobile-node" data-type={node.type}>
                <NodeIcon icon={node.icon} size={18} />
                <div className="afc-mobile-copy">
                  <span className="afc-mobile-label">{node.label}</span>
                  <span className="afc-mobile-sub">{node.sublabel}</span>
                </div>
                <span className="afc-mobile-type">{node.type}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ---- Outcomes + caption ---- */}
        <div className="afc-meta">
          <div className="afc-stats">
            {automationWorkflow.stats.map((stat) => (
              <span key={stat} className="afc-stat-chip">{stat}</span>
            ))}
          </div>
          <p className="afc-caption">{automationWorkflow.caption}</p>
        </div>
      </div>
    </section>
  );
};

export default AutomationFlowCinematic;
