import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import '../../styles/HeroCinematic.css';
import { profile, heroMetrics } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

// 3D "living automation graph" — lazy-loaded so three.js stays out
// of the initial bundle; Suspense fallback is null (dark bg shows).
const HeroScene = lazy(() => import('../three/HeroScene'));

/* ============================================================
   COMPONENT
   ============================================================ */
const HeroCinematic = () => {
  const figureRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const locationRef = useRef(null);

  /* ---------- GSAP ENTRANCE ---------- */
  useEffect(() => {
    // Figure: scale + fade in
    gsap.fromTo(
      figureRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.6, delay: 0.15, ease: 'power2.out' }
    );

    // Text block children: stagger up
    gsap.fromTo(
      textRef.current?.children ? Array.from(textRef.current.children) : [],
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.55, ease: 'power3.out',
        onStart: () => {
          if (textRef.current) textRef.current.style.opacity = '1';
        }
      }
    );

    // CTA + location pill
    const els = [ctaRef.current, locationRef.current].filter(Boolean);
    gsap.to(els, {
      opacity: 1,
      duration: 0.8,
      delay: 1.1,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section id="home" className="hero-cinematic">
      {/* 3D AUTOMATION GRAPH — background layer */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* CENTRAL FIGURE — Technolity logo as the "person" */}
      <div className="hero-figure" ref={figureRef} aria-hidden="true">
        <img
          src="/images/profile.png"
          alt=""
          className="hero-figure-logo"
          loading="eager"
          draggable="false"
        />
      </div>

      {/* TEXT OVERLAY */}
      <div className="hero-text-block" ref={textRef}>
        <RepelText as="h1" className="hero-name">{profile.name}.</RepelText>
        <RepelText as="p" className="hero-role">{profile.role}.</RepelText>
        <RepelText as="p" className="hero-headline">{profile.headline}</RepelText>
        <ul className="hero-metrics" aria-label="Key impact metrics">
          {heroMetrics.map((metric) => (
            <li className="hero-metric" key={metric.label}>
              <span className="hero-metric-value">{metric.value}</span>
              <RepelText as="span" className="hero-metric-label">{metric.label}</RepelText>
            </li>
          ))}
        </ul>
        <RepelText as="span" className="hero-year">2022—Present</RepelText>
      </div>

      {/* CTA GROUP — bottom left */}
      <div className="hero-cta-group" ref={ctaRef}>
        <a
          href={`mailto:${profile.email}`}
          className="hero-cta-touch"
        >
          Get in touch →
        </a>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta-touch hero-cta-resume"
        >
          Resume ↓
        </a>
      </div>

      {/* LOCATION TAG — bottom right */}
      <span className="hero-location-tag" ref={locationRef}>
        {profile.location}
      </span>
    </section>
  );
};

export default HeroCinematic;
