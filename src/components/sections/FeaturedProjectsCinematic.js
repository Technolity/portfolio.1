import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createBulletImpact } from '../UI/BulletImpact';
import '../../styles/FeaturedProjectsCinematic.css';
import '../../styles/BulletImpact.css';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjectsCinematic = () => {
  const projectsRef = useRef([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Section header animation
    const sectionHeader = document.querySelector('#projects .section-header-cinematic');
    if (sectionHeader) {
      gsap.fromTo(
        sectionHeader,
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
            trigger: sectionHeader,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    projectsRef.current.forEach((project, index) => {
      if (!project) return;

      const image = project.querySelector('.project-image');
      const content = project.querySelector('.project-content');

      // Enhanced entrance animation with depth
      gsap.fromTo(
        [image, content],
        {
          opacity: 0,
          y: 100,
          scale: 0.95,
          rotationX: 10
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: project,
            start: 'top 75%',
            end: 'top 40%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Image zoom and parallax on scroll
      gsap.to(image, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: project,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Content parallax
      gsap.to(content, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: project,
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

  // Handle card click with bullet effect
  const handleProjectClick = (e, project) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Create bullet impact effect
    createBulletImpact({
      x,
      y,
      container: document.body,
      targetElement: e.currentTarget,
      onComplete: () => {
        setExpandedProject(project);
      }
    });
  };

  // Close expanded card
  const closeExpandedCard = () => {
    setExpandedProject(null);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedProject) {
        closeExpandedCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedProject]);

  const projects = [
    {
      id: 1,
      title: 'Amazon Review Intelligence',
      category: 'AI & Automation',
      description: 'Built an intelligent system to analyze Amazon product reviews using AI. Extracts insights, sentiment analysis, and key themes from thousands of reviews in seconds.',
      fullDescription: 'A comprehensive AI-powered platform that transforms raw Amazon product reviews into actionable business intelligence. The system processes thousands of reviews in real-time, extracting sentiment patterns, identifying common pain points, and highlighting product strengths.',
      technologies: ['OpenAI API', 'Python', 'FastAPI', 'React', 'PostgreSQL'],
      features: [
        'Real-time sentiment analysis with 94% accuracy',
        'Automatic theme extraction and categorization',
        'Competitor comparison dashboard',
        'Weekly trend reports with actionable insights',
        'API integration for e-commerce platforms'
      ],
      image: '/images/project1.jpg',
      link: '#',
      github: '#'
    },
    {
      id: 2,
      title: 'TedOS SaaS Platform',
      category: 'Full-Stack Development',
      description: 'Developed a comprehensive SaaS platform for business operations management. Features include team collaboration, project tracking, and automated workflows.',
      fullDescription: 'An enterprise-grade SaaS solution designed to streamline business operations. Built with scalability in mind, TedOS handles everything from team management to automated invoicing, serving over 500 active businesses.',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Stripe'],
      features: [
        'Real-time team collaboration with live cursors',
        'Kanban-style project management boards',
        'Automated recurring billing with Stripe',
        'Custom workflow automation builder',
        'White-label options for enterprises'
      ],
      image: '/images/project2.png',
      link: '#',
      github: '#'
    },
    {
      id: 3,
      title: 'Crypto Tracker',
      category: 'Real-Time Data',
      description: 'Real-time cryptocurrency tracking application with live price updates, portfolio management, and market analysis tools. Clean, performant interface.',
      fullDescription: 'A high-performance cryptocurrency tracking platform that delivers real-time market data with sub-second latency. Features advanced charting, portfolio analytics, and price alerts across 1000+ cryptocurrencies.',
      technologies: ['React', 'WebSockets', 'Node.js', 'Redis', 'Chart.js'],
      features: [
        'Live price updates via WebSocket connections',
        'Portfolio tracking with profit/loss analytics',
        'Custom price alerts via email and push',
        'Advanced candlestick charting with indicators',
        'Historical data analysis and backtesting'
      ],
      image: '/images/project3.png',
      link: '#',
      github: '#'
    }
  ];

  return (
    <section id="projects" className="featured-projects-cinematic section" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header-cinematic">
          <span className="section-number">02</span>
          <h2 className="section-title-cinematic">Featured Projects</h2>
          <div className="section-line"></div>
        </div>

        {/* Click hint */}
        <p className="click-hint">
          <span className="hint-icon">◎</span>
          Click on a project to explore details
        </p>

        {/* Projects List */}
        <div className="projects-list">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`project-dossier ${index % 2 === 0 ? 'image-left' : 'image-right'}`}
              ref={el => projectsRef.current[index] = el}
              onClick={(e) => handleProjectClick(e, project)}
              style={{ cursor: 'pointer' }}
            >
              {/* Project Image */}
              <div className="project-image-wrapper">
                <div className="project-image-container">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="project-number">0{project.id}</div>
              </div>

              {/* Project Content */}
              <div className="project-content">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-tech">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-link">
                  <span>View Details</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Expanded Card Overlay */}
      <div
        className={`card-expand-overlay ${expandedProject ? 'active' : ''}`}
        onClick={closeExpandedCard}
      />

      {/* Expanded Project Card */}
      {expandedProject && (
        <div className={`expanded-card ${expandedProject ? 'active' : ''}`}>
          <button className="expanded-card-close" onClick={closeExpandedCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="expanded-card-header">
            <span className="expanded-card-category">{expandedProject.category}</span>
            <h3 className="expanded-card-title">{expandedProject.title}</h3>
          </div>

          <p className="expanded-card-description">{expandedProject.fullDescription}</p>

          <div className="expanded-card-section">
            <h4 className="expanded-card-section-title">Technologies Used</h4>
            <div className="expanded-card-tags">
              {expandedProject.technologies.map((tech, i) => (
                <span key={i} className="expanded-card-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="expanded-card-section">
            <h4 className="expanded-card-section-title">Key Features</h4>
            <ul className="expanded-card-features">
              {expandedProject.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="expanded-card-actions">
            <a href={expandedProject.link} className="expanded-card-btn expanded-card-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Live Demo
            </a>
            <a href={expandedProject.github} className="expanded-card-btn expanded-card-btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              View Code
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProjectsCinematic;
