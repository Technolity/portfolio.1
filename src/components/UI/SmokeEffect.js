import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/SmokeEffect.css';

const SmokeEffect = () => {
  const smokeContainerRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      // Only trigger on buttons and clickable elements
      const target = e.target.closest('button, .clickable, a[href], .btn-primary, .btn-secondary');
      if (!target) return;

      const x = e.clientX;
      const y = e.clientY;

      // Create muzzle flash
      const flash = document.createElement('div');
      flash.className = 'muzzle-flash';
      flash.style.left = `${x}px`;
      flash.style.top = `${y}px`;
      smokeContainerRef.current.appendChild(flash);

      gsap.to(flash, {
        scale: 2,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => flash.remove()
      });

      // Create gunsmoke - fewer, larger, slower particles
      const smokeCount = 5;
      
      for (let i = 0; i < smokeCount; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'gunsmoke-particle';
        
        // Gunsmoke rises and spreads
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8; // Mostly upward
        const distance = 80 + Math.random() * 100;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance - 50; // Extra upward bias

        smoke.style.left = `${x}px`;
        smoke.style.top = `${y}px`;
        
        // Random initial rotation for variety
        const startRotation = Math.random() * 360;
        
        smokeContainerRef.current.appendChild(smoke);

        // Animate gunsmoke particle
        gsap.to(smoke, {
          x: endX - x,
          y: endY - y,
          opacity: 0,
          scale: 3 + Math.random() * 2,
          rotation: startRotation + (Math.random() * 180),
          duration: 1.5 + Math.random() * 0.8,
          ease: 'power1.out',
          delay: i * 0.05,
          onComplete: () => smoke.remove()
        });
      }

      // Create gunpowder sparks
      const sparkCount = 8;
      
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'gunpowder-spark';
        
        const sparkAngle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const sparkDistance = 20 + Math.random() * 40;
        const sparkEndX = x + Math.cos(sparkAngle) * sparkDistance;
        const sparkEndY = y + Math.sin(sparkAngle) * sparkDistance;

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        
        smokeContainerRef.current.appendChild(spark);

        gsap.to(spark, {
          x: sparkEndX - x,
          y: sparkEndY - y,
          opacity: 0,
          scale: 0,
          duration: 0.4 + Math.random() * 0.3,
          ease: 'power2.out',
          onComplete: () => spark.remove()
        });
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <div className="smoke-container" ref={smokeContainerRef}></div>;
};

export default SmokeEffect;

