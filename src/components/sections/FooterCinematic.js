import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/FooterCinematic.css';
import { profile } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

gsap.registerPlugin(ScrollTrigger);

/* ---- Inline SVG icons ---- */
const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconGitHub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconPDF = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v1.5H8V15zm0-3h8v1.5H8V12zm0-3h5v1.5H8V9z"/>
  </svg>
);

const FooterCinematic = () => {
  const wordmarkRef = useRef();
  const accentBarRef = useRef();
  const topRef = useRef();

  /* ----
     FIT-TEXT: measures Syne's actual rendered width and sets font-size
     to fill the full section width precisely.
     Runs: (1) on fonts ready, (2) after GSAP setup via timeout, (3) on resize.
  ---- */
  const fitWordmark = () => {
    const el = wordmarkRef.current;
    if (!el) return;
    const section = el.closest('.footer-wordmark-section');
    if (!section) return;

    el.style.fontSize = '100px';

    const inner = el.parentElement;
    const prevOv = inner.style.overflow;
    inner.style.overflow = 'visible';
    const naturalWidth = el.scrollWidth;
    inner.style.overflow = prevOv;

    if (!naturalWidth) return;
    el.style.fontSize = `${(section.clientWidth / naturalWidth) * 100 * 0.99}px`;
  };

  useEffect(() => {
    const run = () => {
      fitWordmark();
      // Re-run after GSAP scroll triggers are set up (they change page layout)
      setTimeout(() => {
        fitWordmark();
        ScrollTrigger.refresh();
      }, 400);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(run);
    } else {
      run();
    }

    window.addEventListener('resize', fitWordmark);
    return () => window.removeEventListener('resize', fitWordmark);
  }, []); 
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmarkRef.current,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            onEnter: () => fitWordmark(), // recheck size when trigger fires
          },
        }
      );

      if (accentBarRef.current) {
        ScrollTrigger.create({
          trigger: accentBarRef.current,
          start: 'top 90%',
          onEnter: () => accentBarRef.current.classList.add('animate-in'),
          onLeaveBack: () => accentBarRef.current.classList.remove('animate-in'),
        });
      }

      gsap.fromTo(
        topRef.current?.children,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: topRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []); 
  const year = new Date().getFullYear();

  return (
    <footer className="footer-cinematic">
      {/* TOP BAR */}
      <div className="footer-top" ref={topRef}>
        <div className="footer-info">
          <RepelText as="span" className="footer-label">Currently based in</RepelText>
          <RepelText as="span" className="footer-tagline">{profile.location}</RepelText>
          <RepelText as="span" className="footer-availability">Available for freelance &amp; contract work</RepelText>
        </div>

        <div className="footer-links">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <IconLinkedIn /> <RepelText>LinkedIn</RepelText>
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            <IconGitHub /> <RepelText>GitHub</RepelText>
          </a>
          <a href={profile.x} target="_blank" rel="noopener noreferrer">
            <IconX /> <RepelText>X</RepelText>
          </a>
          <a href={profile.resume} download>
            <IconPDF /> <RepelText>Resume</RepelText>
          </a>
        </div>

        <div className="footer-contact">
          <a href={`mailto:${profile.email}`} className="footer-contact-link">
            <RepelText>{profile.email}</RepelText><span>→</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <RepelText>linkedin.com/in/waris-rawa</RepelText><span>→</span>
          </a>
        </div>
      </div>

      {/* WORDMARK */}
      <div className="footer-wordmark-section">
        <div className="footer-wordmark-inner">
          <span className="footer-wordmark" ref={wordmarkRef}>
            Waris Rawa
          </span>
        </div>
        <span className="footer-accent-bar" ref={accentBarRef} />
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <RepelText as="span" className="footer-copyright">© {year} Waris Rawa — Technolity</RepelText>
      </div>
    </footer>
  );
};

export default FooterCinematic;
