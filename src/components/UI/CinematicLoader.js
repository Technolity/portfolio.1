import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/CinematicLoader.css';

const CinematicLoader = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef();
  const logoRef = useRef();
  const bulletsRef = useRef([]);
  const bulletHolesRef = useRef([]);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsLoading(false);
          if (onComplete) onComplete();
        }, 500);
      }
    });

    // Logo stamp effect - drops in as target
    timeline.fromTo(
      logoRef.current,
      {
        scale: 0.3,
        opacity: 0,
        rotation: -15,
        y: -200
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        y: 0,
        duration: 0.8,
        ease: 'bounce.out'
      }
    );

    // Shake on impact
    timeline.to(logoRef.current, {
      x: -5,
      yoyo: true,
      repeat: 3,
      duration: 0.05,
      ease: 'power1.inOut'
    });

    // Create bullet impact with hole
    const createBulletImpact = (delay, angle, distance) => {
      timeline.call(() => {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bulletsRef.current.push(bullet);
        loaderRef.current.appendChild(bullet);

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const startX = centerX + Math.cos(angle) * distance;
        const startY = centerY + Math.sin(angle) * distance;

        gsap.set(bullet, { x: startX, y: startY, opacity: 1 });
        
        // Bullet tracer line
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
            
            // Random position near center but varied
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

            // Impact debris
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

            // Logo shake on bullet impact
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

    // Fire 6 bullets from different angles
    const bulletTiming = [1.2, 1.4, 1.6, 1.8, 2.0, 2.2];
    const angles = [0, Math.PI/3, (2*Math.PI)/3, Math.PI, (4*Math.PI)/3, (5*Math.PI)/3];
    
    bulletTiming.forEach((time, index) => {
      createBulletImpact(time, angles[index], 600);
    });

    // Fade out loader
    timeline.to(loaderRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: 'power2.inOut'
    }, '+=0.5');

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <div className="cinematic-loader" ref={loaderRef}>
      {/* Background effects */}
      <div className="loader-vignette"></div>
      
      {/* Target board background */}
      <div className="target-board">
        <div className="target-ring"></div>
        <div className="target-ring"></div>
        <div className="target-ring"></div>
      </div>
      
      {/* Logo as target */}
      <div className="logo-container target-logo" ref={logoRef}>
        <img 
          src="/logo512.png" 
          alt="Logo" 
          className="loader-logo"
        />
        <div className="logo-glow"></div>
        {/* Bullet holes will be added here dynamically */}
      </div>

      {/* Loading text */}
      <div className="loading-text">
        <span className="loading-bracket">{'['}</span>
        <span className="loading-label">LOADING</span>
        <span className="loading-bracket">{']'}</span>
      </div>

      {/* Progress bar */}
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default CinematicLoader;

