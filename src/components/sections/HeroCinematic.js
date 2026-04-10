import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/HeroCinematic.css';
import { profile } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

/* ============================================================
   FLOWING INK PARTICLE SYSTEM
   Each blob spawns near center, drifts upward with organic
   wobble — creating the red-paint-on-dark-figure effect.
   ============================================================ */
class InkBlob {
  constructor(cx, cy, w, h) {
    const angle = Math.random() * Math.PI * 2;
    const spawnR = Math.min(w, h) * (0.06 + Math.random() * 0.12);
    this.x = cx + spawnR * Math.cos(angle);
    this.y = cy + spawnR * Math.sin(angle);
    // Upward-biased velocity — slower, more controlled
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = -(Math.random() * 0.75 + 0.18);
    this.size = Math.random() * 75 + 35;   // smaller blobs — less overwhelming
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.0012;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.022 + 0.007;
    // Deep crimson, kept subdued
    this.r = Math.floor(175 + Math.random() * 45);
    this.g = Math.floor(4 + Math.random() * 14);
    this.b = Math.floor(12 + Math.random() * 28);
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.vx += Math.sin(this.wobble) * 0.04;
    this.vy += (Math.random() - 0.5) * 0.025 - 0.004;
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.9978;
    this.life -= this.decay;
  }

  get alive() {
    return this.life > 0.01 && this.size > 3;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    // Reduced max alpha: 0.32 instead of 0.55 — dimmer glow
    g.addColorStop(0,    `rgba(${this.r},${this.g},${this.b},${this.life * 0.32})`);
    g.addColorStop(0.45, `rgba(${Math.floor(this.r * 0.65)},${this.g},${this.b},${this.life * 0.14})`);
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ============================================================
   COMPONENT
   ============================================================ */
const HeroCinematic = () => {
  const canvasRef   = useRef(null);
  const figureRef   = useRef(null);
  const textRef     = useRef(null);
  const ctaRef      = useRef(null);
  const locationRef = useRef(null);
  const animIdRef   = useRef(null);

  /* ---------- CANVAS INK ANIMATION ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let blobs = [];
    let frame = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnBlob = () => {
      const cx = canvas.width  * 0.5;
      const cy = canvas.height * 0.47;
      blobs.push(new InkBlob(cx, cy, canvas.width, canvas.height));
    };

    const tick = () => {
      frame++;

      // Dark fade trail — higher alpha = trails clear faster = less buildup
      ctx.fillStyle = 'rgba(8,8,8,0.10)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn rate: throttle to keep it organic, not overwhelming
      const spawnEvery = blobs.length < 60 ? 2 : blobs.length < 120 ? 4 : 8;
      if (frame % spawnEvery === 0) spawnBlob();

      // Update + draw
      blobs = blobs.filter(b => b.alive);
      for (const b of blobs) {
        b.update();
        b.draw(ctx);
      }

      animIdRef.current = requestAnimationFrame(tick);
    };

    // Short delay so page paints first
    const startTimer = setTimeout(() => tick(), 300);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animIdRef.current);
      ro.disconnect();
    };
  }, []);

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
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.55, ease: 'power3.out',
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
      {/* FLOWING INK CANVAS */}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

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
        <span className="hero-year">2024—Present</span>
      </div>

      {/* GET IN TOUCH — bottom left */}
      <a
        href={`mailto:${profile.email}`}
        className="hero-cta-touch"
        ref={ctaRef}
      >
        Get in touch →
      </a>

      {/* LOCATION TAG — bottom right */}
      <span className="hero-location-tag" ref={locationRef}>
        {profile.location}
      </span>
    </section>
  );
};

export default HeroCinematic;
