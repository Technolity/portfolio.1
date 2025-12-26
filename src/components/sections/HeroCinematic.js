import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../../styles/HeroCinematic.css';

const HeroCinematic = () => {
  const heroRef = useRef();
  const bgRef = useRef();
  const contentRef = useRef();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation - slow, controlled
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        contentRef.current.children,
        {
          opacity: 0,
          y: 60,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.3,
          ease: 'power3.out'
        }
      );

      // Slow parallax background drift - camera-like movement (NO ZOOM)
      gsap.to(bgRef.current, {
        scale: 1.0, // Changed from 1.1 to 1.0 - no zoom, natural fit
        duration: 20,
        ease: 'none',
        yoyo: true,
        repeat: -1
      });

      // Mouse parallax - subtle, controlled
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(bgRef.current, {
          x: x,
          y: y,
          duration: 2,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-cinematic" ref={heroRef}>
      {/* Background Image with Dark Overlay */}
      <div className="hero-bg-wrapper">
        <div
          className="hero-bg-image"
          ref={bgRef}
          style={{
            backgroundImage: `url('/images/profile.png')`,
            backgroundPosition: 'right center', // Position to right so text doesn't overlap face
            backgroundSize: 'auto 100%' // Fit height, auto width - better for portrait images
          }}
        />
        <div className="hero-overlay" />
      </div>

      {/* Content - Minimal, Powerful */}
      <div className="hero-content-cinematic" ref={contentRef}>
        <h1 className="hero-title-cinematic">
          Full-Stack<br />
          <span className="title-accent">AI-Powered</span><br />
          Developer
        </h1>

        <p className="hero-subtitle-cinematic">
          I build intelligent systems — end to end.
        </p>

        <div className="hero-cta-cinematic">
          <button className="btn-primary" onClick={scrollToProjects}>
            View Projects
          </button>
          <button className="btn-secondary">
            Download Resume
          </button>
        </div>

        <div className="hero-social-minimal">
          <a href="https://github.com/Technolity" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
          {/* Cowboy Game Icon */}
          <button
            onClick={() => setShowGame(true)}
            className="game-icon-btn"
            aria-label="Play Cowboy Game"
            title="🤠 Play Cowboy Showdown!"
          >
            🔫
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Minimal */}
      <div className="scroll-hint">
        <div className="scroll-line-cinematic"></div>
        <span>Scroll</span>
      </div>

      {/* Cowboy Game Modal */}
      {showGame && <CowboyGame3D onClose={() => setShowGame(false)} />}
    </section>
  );
};

export default HeroCinematic;

