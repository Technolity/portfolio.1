import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import UI components
import CinematicLoader from './components/UI/CinematicLoader';
import Navbar from './components/UI/Navbar';

// Import new cinematic components
import HeroCinematic from './components/sections/HeroCinematic';
import WhatIBuildCinematic from './components/sections/WhatIBuildCinematic';
import FeaturedProjectsCinematic from './components/sections/FeaturedProjectsCinematic';
import TechStackCinematic from './components/sections/TechStackCinematic';
import ExperienceCinematic from './components/sections/ExperienceCinematic';
import AboutCinematic from './components/sections/AboutCinematic';
import ContactCinematic from './components/sections/ContactCinematic';

// Import cinematic styles
import './styles/cinematic-theme.css';
import './styles/Navbar.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // Initialize Lenis smooth scrolling after loading complete
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove();
    };
  }, [isLoading]);

  return (
    <>
      {/* Cinematic Loading Screen */}
      {isLoading && <CinematicLoader onComplete={() => setIsLoading(false)} />}



      <div className="cinematic-app">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main>
          <HeroCinematic />
          <WhatIBuildCinematic />
          <FeaturedProjectsCinematic />
          <TechStackCinematic />
          <ExperienceCinematic />
          <AboutCinematic />
          <ContactCinematic />
        </main>
      </div>
    </>
  );
}

export default App;
