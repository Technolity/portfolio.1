import React, { useEffect, useRef, useCallback } from 'react';
import '../../styles/ContactCard.css';
import { profile } from '../../content/portfolioData';

/* ============================================================
   CONTACT CARD — a premium identity card in credit-card FORMAT.
   Layered dark-metal surface, brushed-metal brand wordmark,
   silver/crimson EMV chip, embossed cardholder line, and real
   link pills (GitHub / LinkedIn / X / Email). It reacts to the
   cursor: perspective tilt (RAF-eased lerp) + a moving glare
   highlight + a faint crimson PCB trace that brightens on hover.
   No invented data — every value comes from `profile`.
   ============================================================ */

const MAX_TILT = 10; // degrees
const LERP = 0.12;   // easing factor toward the target tilt

const ContactCard = ({ visible = false }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  // Current + target tilt/glare state, mutated outside React render.
  const state = useRef({
    rx: 0, ry: 0, trx: 0, try: 0,
    gx: 50, gy: 50, tgx: 50, tgy: 50,
    active: false,
  });

  const prefersReduced = useRef(false);

  const tick = useCallback(() => {
    const s = state.current;
    const card = cardRef.current;
    if (!card) return;

    s.rx += (s.trx - s.rx) * LERP;
    s.ry += (s.try - s.ry) * LERP;
    s.gx += (s.tgx - s.gx) * LERP;
    s.gy += (s.tgy - s.gy) * LERP;

    card.style.setProperty('--rx', `${s.rx.toFixed(3)}deg`);
    card.style.setProperty('--ry', `${s.ry.toFixed(3)}deg`);
    card.style.setProperty('--gx', `${s.gx.toFixed(2)}%`);
    card.style.setProperty('--gy', `${s.gy.toFixed(2)}%`);

    const settled =
      Math.abs(s.trx - s.rx) < 0.01 &&
      Math.abs(s.try - s.ry) < 0.01 &&
      Math.abs(s.tgx - s.gx) < 0.05 &&
      Math.abs(s.tgy - s.gy) < 0.05;

    if (settled && !s.active) {
      rafRef.current = null; // park until next interaction
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const ensureRAF = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const handlePointerMove = useCallback(
    (e) => {
      if (prefersReduced.current) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const s = state.current;
      s.active = true;
      // Cursor left/right -> rotateY; up/down -> rotateX (inverted).
      s.try = (px - 0.5) * 2 * MAX_TILT;
      s.trx = -(py - 0.5) * 2 * MAX_TILT;
      s.tgx = px * 100;
      s.tgy = py * 100;
      ensureRAF();
    },
    [ensureRAF]
  );

  const handlePointerLeave = useCallback(() => {
    const s = state.current;
    s.active = false;
    s.trx = 0;
    s.try = 0;
    s.tgx = 50;
    s.tgy = 50;
    ensureRAF();
  }, [ensureRAF]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = mq.matches;
    const onChange = (ev) => {
      prefersReduced.current = ev.matches;
    };
    mq.addEventListener?.('change', onChange);
    return () => {
      mq.removeEventListener?.('change', onChange);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const links = [
    { key: 'github', label: 'GitHub', href: profile.github, text: 'GitHub' },
    { key: 'linkedin', label: 'LinkedIn', href: profile.linkedin, text: 'LinkedIn' },
    { key: 'x', label: 'X (Twitter)', href: profile.x, text: 'X' },
  ];

  return (
    <div className={`contact-card-wrap${visible ? ' is-visible' : ''}`}>
      <div
        ref={cardRef}
        className="contact-card"
        role="group"
        aria-label="Contact card"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Crimson PCB / circuit-trace motif — echoes the Technolity emblem */}
        <svg
          className="cc-traces"
          viewBox="0 0 420 265"
          aria-hidden="true"
          preserveAspectRatio="xMaxYMax slice"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M300 -10 V40 H352 V96 H300 M352 40 H404" />
            <path d="M340 96 V150 H392" />
            <path d="M300 96 V138 H268 V182" />
            <path d="M404 120 H360 V172 H410" />
            <path d="M380 200 H330 V250" />
          </g>
          <g fill="currentColor">
            <circle cx="352" cy="40" r="3.2" />
            <circle cx="300" cy="96" r="3.2" />
            <circle cx="392" cy="150" r="3.2" />
            <circle cx="268" cy="182" r="3.2" />
            <circle cx="330" cy="250" r="3.2" />
            <circle cx="410" cy="172" r="3.2" />
          </g>
        </svg>

        {/* Moving specular glare, positioned at the cursor via CSS vars */}
        <div className="cc-glare" aria-hidden="true" />

        {/* Top row: brand wordmark + est chip */}
        <div className="cc-top">
          <span className="cc-brand">{profile.brand.toUpperCase()}</span>
          <span className="cc-est">EST 2022</span>
        </div>

        {/* EMV-style chip in silver/crimson */}
        <div className="cc-chip" aria-hidden="true">
          <svg viewBox="0 0 44 34" className="cc-chip-svg">
            <defs>
              <linearGradient id="ccChipMetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e9e7e4" />
                <stop offset="0.5" stopColor="#9a9896" />
                <stop offset="1" stopColor="#5c5b5a" />
              </linearGradient>
            </defs>
            <rect
              x="1"
              y="1"
              width="42"
              height="32"
              rx="6"
              fill="url(#ccChipMetal)"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="0.75"
            />
            <g stroke="rgba(20,20,20,0.55)" strokeWidth="1.1" fill="none">
              <path d="M22 1 V11 M1 12 H14 M43 12 H30 M14 12 V22 H30 V12 M1 22 H14 M43 22 H30 M22 22 V33" />
            </g>
            <path
              d="M14 12 H30 V22 H14 Z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.55"
            />
          </svg>
        </div>

        {/* Embossed cardholder line */}
        <div className="cc-holder">
          <span className="cc-name">{profile.name.toUpperCase()}</span>
          <span className="cc-role">{profile.role}</span>
        </div>

        {/* Contact details */}
        <div className="cc-details">
          <div className="cc-detail">
            <span className="cc-detail-label">CONTACT</span>
            <span className="cc-detail-value">{profile.email}</span>
          </div>
          <div className="cc-detail">
            <span className="cc-detail-label">LOCATION</span>
            <span className="cc-detail-value">{profile.location}</span>
          </div>
        </div>

        {/* Real link pills */}
        <div className="cc-links">
          <a
            className="cc-pill"
            href={`mailto:${profile.email}`}
            aria-label={`Email ${profile.name}`}
          >
            Email
          </a>
          {links.map((l) => (
            <a
              key={l.key}
              className="cc-pill"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${profile.name} on ${l.label}`}
            >
              {l.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
