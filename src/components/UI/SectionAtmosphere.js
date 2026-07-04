import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from '../../utils/deviceCapabilities';
import '../../styles/SectionAtmosphere.css';

/* ============================================================
   SECTION ATMOSPHERE — carries the hero's generated film
   language down the page. A muted looping clip sits behind a
   section at low opacity/saturation with a letterbox frame,
   so scrolling reads like moving between film scenes.

   Same contract as the hero backdrop video:
   - HEAD-probe with video/* content-type (no false 200s)
   - desktop + motion-allowed only; mobile gets the poster jpg
   - pauses via IntersectionObserver when off-screen
   - missing/erroring file → poster (or nothing) — never breaks
   ============================================================ */

const SectionAtmosphere = ({ src, poster, opacity = 0.2 }) => {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(false);
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wantVideo = !reduced && !isMobile();

  useEffect(() => {
    if (!wantVideo) return undefined;
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || '';
        if (alive && res.ok && type.startsWith('video')) setVideoOk(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [src, wantVideo]);

  /* play only while the section is on screen */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !videoOk || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: '80px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoOk]);

  return (
    <div
      ref={wrapRef}
      className="section-atmosphere"
      style={{ '--atmos-opacity': opacity }}
      aria-hidden="true"
    >
      {videoOk ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoOk(false)}
        />
      ) : (
        poster && <img src={poster} alt="" draggable="false" />
      )}
      <span className="section-atmosphere-frame" />
    </div>
  );
};

export default SectionAtmosphere;
