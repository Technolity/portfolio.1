import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/WhatIBuildCinematic.css';
import { services } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

gsap.registerPlugin(ScrollTrigger);

const WhatIBuildCinematic = () => {
  const sectionRef = useRef();
  const panelsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelector('.section-header-cinematic'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      panelsRef.current.forEach((panel, index) => {
        if (!panel) return;
        gsap.fromTo(
          panel,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="what-i-build" className="what-i-build-cinematic section" ref={sectionRef}>
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">01</span>
          <h2 className="section-title-cinematic">What I Build</h2>
          <div className="section-line" />
        </div>

        <div className="service-panels">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="service-panel"
              ref={(el) => { panelsRef.current[index] = el; }}
            >
              <div className="panel-number">0{index + 1}</div>
              <div className="panel-content">
                <RepelText as="h3" className="panel-title">{service.title}</RepelText>
                <RepelText as="p" className="panel-description">{service.description}</RepelText>
                <ul className="panel-points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="panel-tech">
                  {service.tech.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIBuildCinematic;
