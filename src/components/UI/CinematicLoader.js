import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/CinematicLoader.css';

const CinematicLoader = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const loaderRef = useRef();
  const logoRef = useRef();
  const bulletsRef = useRef([]);
  const bulletHolesRef = useRef([]);
  const reloadAudioRef = useRef(null);
  const gunshotAudioRef = useRef(null);

  // Preload audio on mount
  useEffect(() => {
    reloadAudioRef.current = new Audio('/effects/reload.mp3');
    gunshotAudioRef.current = new Audio('/effects/gunshot.mp3');
    reloadAudioRef.current.volume = 0.6;
    gunshotAudioRef.current.volume = 0.5;
    reloadAudioRef.current.load();
    gunshotAudioRef.current.load();
  }, []);

  // Start the loader animation after user clicks "New Start"
  const handleStart = () => {
    setHasStarted(true);
  };

  useEffect(() => {
    if (!hasStarted) return;

    const playReloadSound = () => {
      try {
        reloadAudioRef.current.currentTime = 0;
        reloadAudioRef.current.play().catch((e) => {
          console.log('Reload sound error:', e);
        });
      } catch (e) {
        console.log('Reload audio error:', e);
      }
    };

    const playGunshotSound = () => {
      try {
        const sound = gunshotAudioRef.current.cloneNode();
        sound.volume = 0.5;
        sound.play().catch(() => { });
      } catch (e) { }
    };

    // Play reload sound immediately when animation starts
    playReloadSound();

    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsLoading(false);
          if (onComplete) onComplete();
        }, 500);
      }
    });

    // Phase 1: Logo SPINS for 2.5 seconds (reload sound already playing)
    timeline.fromTo(
      logoRef.current,
      {
        scale: 0.3,
        opacity: 0,
        rotation: -720,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 2.5,
        ease: 'power2.out'
      }
    );

    // Small bounce after spin stops
    timeline.to(logoRef.current, {
      scale: 1.1,
      duration: 0.15,
      ease: 'power2.out'
    });

    timeline.to(logoRef.current, {
      scale: 1,
      duration: 0.15,
      ease: 'power2.in'
    });

    // Phase 2: Fire bullets with gunshot sounds
    const createBulletImpact = (delay, angle, distance) => {
      timeline.call(() => {
        playGunshotSound();

        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bulletsRef.current.push(bullet);
        loaderRef.current.appendChild(bullet);

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const startX = centerX + Math.cos(angle) * distance;
        const startY = centerY + Math.sin(angle) * distance;

        gsap.set(bullet, { x: startX, y: startY, opacity: 1 });

        const tracer = document.createElement('div');
        tracer.className = 'bullet-tracer';
        loaderRef.current.appendChild(tracer);

        const tracerAngle = Math.atan2(centerY - startY, centerX - startX) * 180 / Math.PI;
        gsap.set(tracer, {
          x: startX,
          y: startY,
          rotation: tracerAngle,
          scaleX: 0,
          transformOrigin: 'left center'
        });

        gsap.to(tracer, {
          scaleX: distance / 100,
          duration: 0.15,
          ease: 'none',
          onComplete: () => tracer.remove()
        });

        gsap.to(bullet, {
          x: centerX,
          y: centerY,
          duration: 0.3,
          ease: 'power3.in',
          onComplete: () => {
            bullet.remove();

            // Create bullet hole
            const hole = document.createElement('div');
            hole.className = 'bullet-hole';
            bulletHolesRef.current.push(hole);
            logoRef.current.appendChild(hole);

            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;

            gsap.set(hole, {
              left: `calc(50% + ${offsetX}px)`,
              top: `calc(50% + ${offsetY}px)`,
              scale: 0,
              opacity: 1
            });

            gsap.to(hole, {
              scale: 1,
              duration: 0.2,
              ease: 'back.out(4)'
            });

            // Impact flash
            const flash = document.createElement('div');
            flash.className = 'impact-flash';
            loaderRef.current.appendChild(flash);

            gsap.set(flash, {
              x: centerX,
              y: centerY,
              scale: 0,
              opacity: 1
            });

            gsap.to(flash, {
              scale: 4,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => flash.remove()
            });

            // Debris
            for (let i = 0; i < 6; i++) {
              const debris = document.createElement('div');
              debris.className = 'impact-debris';
              loaderRef.current.appendChild(debris);

              const debrisAngle = (Math.PI * 2 * i) / 6;
              const debrisDistance = 40 + Math.random() * 30;

              gsap.set(debris, { x: centerX, y: centerY });
              gsap.to(debris, {
                x: centerX + Math.cos(debrisAngle) * debrisDistance,
                y: centerY + Math.sin(debrisAngle) * debrisDistance,
                opacity: 0,
                scale: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => debris.remove()
              });
            }

            // Logo shake
            gsap.to(logoRef.current, {
              x: (Math.random() - 0.5) * 15,
              y: (Math.random() - 0.5) * 15,
              rotation: (Math.random() - 0.5) * 8,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'power2.out'
            });
          }
        });
      }, null, delay);
    };

    // Fire 6 bullets
    const bulletTiming = [3.0, 3.25, 3.5, 3.75, 4.0, 4.25];
    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

    bulletTiming.forEach((time, index) => {
      createBulletImpact(time, angles[index], 600);
    });

    // Fade out
    timeline.to(loaderRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: 'power2.inOut'
    }, '+=0.5');

    return () => {
      timeline.kill();
    };
  }, [hasStarted, onComplete]);

  if (!isLoading) return null;

  // Show "New Start" button before the animation
  if (!hasStarted) {
    return (
      <div className="cinematic-loader start-screen" ref={loaderRef}>
        <div className="loader-vignette"></div>
        <div className="start-content">
          <img src="/logo512.png" alt="Logo" className="start-logo" />
          <button className="start-button" onClick={handleStart}>
            <span className="start-button-text">New Start</span>
            <span className="start-button-icon">▶</span>
          </button>
          <p className="start-hint">Click to begin the experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cinematic-loader" ref={loaderRef}>
      <div className="loader-vignette"></div>

      <div className="target-board">
        <div className="target-ring"></div>
        <div className="target-ring"></div>
        <div className="target-ring"></div>
      </div>

      <div className="logo-container target-logo" ref={logoRef}>
        <img src="/logo512.png" alt="Logo" className="loader-logo" />
        <div className="logo-glow"></div>
      </div>

      <div className="loading-text">
        <span className="loading-bracket">{'['}</span>
        <span className="loading-label">LOADING</span>
        <span className="loading-bracket">{']'}</span>
      </div>

      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default CinematicLoader;
