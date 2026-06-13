import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/HeroCinematic.css';
import { profile, heroMetrics } from '../../content/portfolioData';
import HeroScene from '../three/HeroScene';
import HeroLinkTree from '../UI/HeroLinkTree';
import RepelText from '../UI/RepelText';
import LiquidName from '../UI/LiquidName';
import { useBoot } from '../../context/BootContext';

/* ============================================================
   HERO — CINEMATIC CRIMSON
   Layout: wordmark (left) ↔ link-tree (middle slot) ↔ the
   Technolity emblem (right, dark at rest, light rakes across
   it under the cursor; click bursts light centre→edge).
   The film boot sequence (BootContext) drives the reveal.
   ============================================================ */

const HeroCinematic = () => {
  const { phase, replay } = useBoot();
  const stageRef = useRef(null);
  const logoRef = useRef(null);
  const rafRef = useRef(0);
  const [settled, setSettled] = useState(false);

  /* Failsafe: once live, guarantee the visible end-state even if the
     animation engine is throttled (off-screen tab, etc.). */
  useEffect(() => {
    if (phase !== 'live') return undefined;
    const id = setTimeout(() => setSettled(true), 2600);
    return () => clearTimeout(id);
  }, [phase]);

  /* ---- cursor → stage vars (red bloom parallax) ---- */
  const onMove = useCallback((e) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', nx.toFixed(3));
      el.style.setProperty('--my', ny.toFixed(3));
    });
  }, []);

  const onLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  }, []);

  /* ---- logo: dark at rest, light rakes on hover, burst on click ---- */
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return undefined;
    let r = null;
    const enter = () => {
      r = el.getBoundingClientRect();
      el.classList.add('lit');
    };
    const leave = () => {
      el.classList.remove('lit');
      el.style.setProperty('--lx', '0');
      el.style.setProperty('--ly', '0');
    };
    const move = (e) => {
      if (!r) r = el.getBoundingClientRect();
      const lx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ly = ((e.clientY - r.top) / r.height) * 2 - 1;
      el.style.setProperty('--lx', lx.toFixed(3));
      el.style.setProperty('--ly', ly.toFixed(3));
    };
    const burst = () => {
      el.classList.remove('burst');
      void el.offsetWidth; // restart the animation
      el.classList.add('burst');
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousemove', move);
    el.addEventListener('click', burst);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousemove', move);
      el.removeEventListener('click', burst);
    };
  }, []);

  return (
    <section
      id="home"
      className={`hero-cinematic${settled ? ' settled' : ''}`}
      data-phase={phase}
      ref={stageRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* server-cathedral backdrop (constellation removed) */}
      <HeroScene />

      {/* cinematic atmosphere */}
      <div className="hero-bloom" aria-hidden="true" />
      <div className="hero-glitch" aria-hidden="true" />
      <div className="hero-ticks" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="hero-row">
        {/* TEXT — wordmark + role + headline + CTA + metrics */}
        <div className="hero-textcol">
          <div className="hero-wm-wrap">
            <LiquidName name="WARIS RAWA" role="DEVELOPER" active={phase === 'live'} />
          </div>
          <RepelText as="p" className="hero-role">{`${profile.role}.`}</RepelText>
          <RepelText as="p" className="hero-micro">{profile.headline}</RepelText>
          <div className="hero-cta">
            <a className="hero-btn primary" href={`mailto:${profile.email}`}>
              Get in touch <span aria-hidden="true">→</span>
            </a>
            <a
              className="hero-btn"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <span aria-hidden="true">↓</span>
            </a>
          </div>
          <ul className="hero-metrics" aria-label="Key impact metrics">
            {heroMetrics.map((m) => (
              <li className="hero-metric" key={m.label}>
                <span className="hero-metric-value">{m.value}</span>
                <RepelText as="span" className="hero-metric-label">{m.label}</RepelText>
              </li>
            ))}
          </ul>
        </div>

        {/* SLOT — the organic link-tree, rooted at the hero floor */}
        <div className="hero-slot">
          <HeroLinkTree active={phase === 'live'} />
        </div>

        {/* LOGO — dark at rest, cursor light-rake, click burst */}
        <div className="hero-logowrap">
          <div className="hero-logostage" ref={logoRef}>
            <div className="hero-logo3d">
              <img
                className="hero-logo-img"
                src="/images/profile.png"
                alt={`${profile.brand} emblem`}
                draggable="false"
              />
              <img
                className="hero-logo-spec"
                src="/images/profile.png"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <img
                className="hero-logo-burst"
                src="/images/profile.png"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>

      {/* bottom chrome */}
      <span className="hero-loc">{profile.location}</span>
      <span className="hero-period">2022—PRESENT</span>
      <div className="hero-scrollcue" aria-hidden="true">
        <span className="ln" />
      </div>

      <button className="hero-replay" onClick={replay} type="button">
        ↻ replay intro
      </button>
    </section>
  );
};

export default HeroCinematic;
