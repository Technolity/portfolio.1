import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/UI/Navbar';
import SnakeCursor from './components/UI/SnakeCursor';
import HeroCinematic from './components/sections/HeroCinematic';
import WhatIBuildCinematic from './components/sections/WhatIBuildCinematic';
import FeaturedProjectsCinematic from './components/sections/FeaturedProjectsCinematic';
import TechStackCinematic from './components/sections/TechStackCinematic';
import ExperienceCinematic from './components/sections/ExperienceCinematic';
import AboutCinematic from './components/sections/AboutCinematic';
import ContactCinematic from './components/sections/ContactCinematic';
import FooterCinematic from './components/sections/FooterCinematic';

import './styles/cinematic-theme.css';
import './styles/Navbar.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <div className="cinematic-app">
      <SnakeCursor />
      <Navbar />

      <main>
        <HeroCinematic />
        <WhatIBuildCinematic />
        <FeaturedProjectsCinematic />
        <TechStackCinematic />
        <ExperienceCinematic />
        <AboutCinematic />
        <ContactCinematic />
        <FooterCinematic />
      </main>
    </div>
  );
}

export default App;
