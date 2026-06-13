import React, { useEffect, useRef, useState } from 'react';
import HeroBackdrop from './HeroBackdrop';
import '../../styles/HeroScene.css';

/* ============================================================
   HERO SCENE — cathedral backdrop wrapper.

   The 3D node-constellation (R3F / three.js) was removed: the
   hero now layers the cinematic crimson treatment (cursor-lit
   logo, spotlight wordmark, red bloom) on top of this
   server-cathedral atmosphere. This wrapper keeps the
   reduced-motion probe and an in-view gate so the backdrop's
   GSAP loops pause when the hero scrolls off screen.
   ============================================================ */

const HeroScene = ({ className = '' }) => {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [inView, setInView] = useState(true);
  const wrapRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`hero-scene ${className}`.trim()} aria-hidden="true">
      <HeroBackdrop reducedMotion={reducedMotion} inView={inView} />
    </div>
  );
};

export default HeroScene;
