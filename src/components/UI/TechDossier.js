import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import '../../styles/TechDossier.css';
import techUsage from '../../content/techUsage';

/* ============================================================
   TECH DOSSIER — full-screen HUD overlay opened from a tech
   chip. Proves shipped usage of one technology: typed system
   labels, deployment records, and a live preview of the first
   deployment running in production.
   ============================================================ */

const typeText = (el, text, tl, position) => {
  const state = { n: 0 };
  tl.to(
    state,
    {
      n: text.length,
      duration: Math.min(0.9, 0.028 * text.length),
      ease: 'none',
      onUpdate: () => {
        el.textContent = text.slice(0, Math.round(state.n));
      },
    },
    position
  );
};

const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch (e) {
    return url;
  }
};

const TechDossier = ({ skill, onClose }) => {
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const sysLabelRef = useRef(null);
  const statusLabelRef = useRef(null);
  const [frameSrc, setFrameSrc] = useState(null);

  const data = techUsage[skill] || {
    tagline: 'Part of the active working stack.',
    deployments: [],
  };
  const preview = data.deployments.find((d) => d.live) || null;

  /* Scroll lock + focus + ESC */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  /* Open choreography */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        if (sysLabelRef.current) sysLabelRef.current.textContent = `SYSTEM // ${skill.toUpperCase()}`;
        if (statusLabelRef.current) statusLabelRef.current.textContent = 'STATUS // SHIPPED TO PRODUCTION';
        gsap.set(root.querySelectorAll('.td-anim'), { opacity: 1, y: 0 });
        gsap.set(root.querySelector('.td-scanline'), { display: 'none' });
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      tl.fromTo(
        root.querySelectorAll('.td-bracket'),
        { '--draw': 0 },
        { '--draw': 1, duration: 0.5, ease: 'power3.out', stagger: 0.06 },
        0.1
      );
      tl.fromTo(
        root.querySelector('.td-scanline'),
        { yPercent: 0, opacity: 1 },
        { yPercent: 100, opacity: 0, duration: 0.9, ease: 'power2.inOut' },
        0.15
      );
      typeText(sysLabelRef.current, `SYSTEM // ${skill.toUpperCase()}`, tl, 0.3);
      typeText(statusLabelRef.current, 'STATUS // SHIPPED TO PRODUCTION', tl, 0.8);
      tl.fromTo(
        root.querySelectorAll('.td-anim'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.55
      );
    }, root);

    /* Lazy-mount the live preview only once the overlay is open */
    const frameTimer = setTimeout(() => {
      if (preview) setFrameSrc(preview.live);
    }, 350);

    return () => {
      clearTimeout(frameTimer);
      ctx.revert();
    };
  }, [skill]); // preview derives from skill; effect intentionally keyed on skill only

  const overlay = (
    <div
      className="tech-dossier"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${skill} — production usage`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <span className="td-bracket td-bracket-tl" aria-hidden="true" />
      <span className="td-bracket td-bracket-tr" aria-hidden="true" />
      <span className="td-bracket td-bracket-bl" aria-hidden="true" />
      <span className="td-bracket td-bracket-br" aria-hidden="true" />
      <span className="td-scanline" aria-hidden="true" />

      <div className="td-panel">
        <header className="td-header">
          <div className="td-labels">
            <span className="td-label" ref={sysLabelRef} />
            <span className="td-label td-label-status" ref={statusLabelRef} />
          </div>
          <button
            type="button"
            className="td-close clickable"
            onClick={onClose}
            ref={closeRef}
            aria-label="Close dossier"
          >
            ×
          </button>
        </header>

        <div className="td-body">
          <div className="td-list">
            <p className="td-tagline td-anim">{data.tagline}</p>

            {data.deployments.map((dep) => (
              <article key={`${dep.project}-${dep.proof}`} className="td-deployment td-anim">
                <h3 className="td-project">{dep.project}</h3>
                <p className="td-role">{dep.role}</p>
                <div className="td-meta">
                  <span className="td-proof">{dep.proof}</span>
                  {dep.live && (
                    <a
                      className="td-live clickable"
                      href={dep.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live ↗
                    </a>
                  )}
                </div>
              </article>
            ))}

            <span className="td-hint td-anim">ESC to close</span>
          </div>

          <div className="td-preview td-anim">
            {preview ? (
              <figure className="td-browser">
                <figcaption className="td-browser-bar">
                  <span className="td-browser-dot" />
                  <span className="td-browser-dot" />
                  <span className="td-browser-dot" />
                  <span className="td-browser-url">{hostOf(preview.live)}</span>
                  <a
                    className="td-browser-open clickable"
                    href={preview.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗
                  </a>
                </figcaption>
                <div className="td-browser-viewport">
                  {frameSrc && (
                    <iframe
                      src={frameSrc}
                      title={`${preview.project} — live`}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )}
                </div>
                <span className="td-callout td-callout-run" aria-hidden="true">
                  RUNNING → {hostOf(preview.live)}
                </span>
              </figure>
            ) : (
              <div className="td-terminal" aria-hidden="true">
                <div className="td-terminal-bar">
                  <span className="td-browser-dot" />
                  <span className="td-browser-dot" />
                  <span className="td-browser-dot" />
                  <span className="td-browser-url">internal systems</span>
                </div>
                <div className="td-terminal-body">
                  {data.deployments.map((dep) => (
                    <p key={dep.project}>
                      <span className="td-terminal-prompt">$</span> {dep.project.toLowerCase().replace(/\s+/g, '-')} — {dep.proof}
                    </p>
                  ))}
                  <p>
                    <span className="td-terminal-prompt">$</span>
                    <span className="td-terminal-cursor" />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default TechDossier;
