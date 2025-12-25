import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/WhatIBuildCinematic.css';

gsap.registerPlugin(ScrollTrigger);

const WhatIBuildCinematic = () => {
  const sectionRef = useRef();
  const panelsRef = useRef([]);

  useEffect(() => {
    const panels = panelsRef.current;

    // Section header animation
    gsap.fromTo(
      sectionRef.current.querySelector('.section-header-cinematic'),
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    panels.forEach((panel, index) => {
      gsap.fromTo(
        panel,
        {
          opacity: 0,
          x: index % 2 === 0 ? -60 : 60,
          rotationY: index % 2 === 0 ? -5 : 5,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Parallax effect on scroll
      gsap.to(panel, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const services = [
    {
      title: 'Full-Stack Applications',
      description: 'Building complete web applications from concept to deployment. Modern architecture, scalable infrastructure, seamless user experiences.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS']
    },
    {
      title: 'AI-Driven Systems',
      description: 'Integrating intelligent capabilities into applications. Machine learning models, natural language processing, predictive analytics.',
      technologies: ['OpenAI API', 'LangChain', 'Python', 'TensorFlow']
    },
    {
      title: 'Automation & APIs',
      description: 'Creating robust backend systems that power modern applications. RESTful APIs, microservices, automated workflows, data pipelines.',
      technologies: ['Express', 'FastAPI', 'Redis', 'Docker']
    }
  ];

  return (
    <section id="what-i-build" className="what-i-build-cinematic section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header-cinematic">
          <span className="section-number">01</span>
          <h2 className="section-title-cinematic">What I Build</h2>
          <div className="section-line"></div>
        </div>

        {/* Service Panels */}
        <div className="service-panels">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-panel"
              ref={el => panelsRef.current[index] = el}
            >
              <div className="panel-number">0{index + 1}</div>
              <div className="panel-content">
                <h3 className="panel-title">{service.title}</h3>
                <p className="panel-description">{service.description}</p>
                <div className="panel-tech">
                  {service.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="panel-indicator">
                <div className="indicator-line"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIBuildCinematic;

