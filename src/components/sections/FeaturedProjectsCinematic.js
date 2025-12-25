import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/FeaturedProjectsCinematic.css';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjectsCinematic = () => {
  const projectsRef = useRef([]);

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

  const projects = [
    {
      id: 1,
      title: 'Amazon Review Intelligence',
      category: 'AI & Automation',
      description: 'Built an intelligent system to analyze Amazon product reviews using AI. Extracts insights, sentiment analysis, and key themes from thousands of reviews in seconds.',
      technologies: ['OpenAI API', 'Python', 'FastAPI', 'React', 'PostgreSQL'],
      image: '/images/project1.jpg',
      link: '#'
    },
    {
      id: 2,
      title: 'TedOS SaaS Platform',
      category: 'Full-Stack Development',
      description: 'Developed a comprehensive SaaS platform for business operations management. Features include team collaboration, project tracking, and automated workflows.',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Stripe'],
      image: '/images/project2.png',
      link: '#'
    },
    {
      id: 3,
      title: 'Crypto Tracker',
      category: 'Real-Time Data',
      description: 'Real-time cryptocurrency tracking application with live price updates, portfolio management, and market analysis tools. Clean, performant interface.',
      technologies: ['React', 'WebSockets', 'Node.js', 'Redis', 'Chart.js'],
      image: '/images/project3.png',
      link: '#'
    }
  ];

  return (
    <section id="projects" className="featured-projects-cinematic section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-cinematic">
          <span className="section-number">02</span>
          <h2 className="section-title-cinematic">Featured Projects</h2>
          <div className="section-line"></div>
        </div>

        {/* Projects List */}
        <div className="projects-list">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`project-dossier ${index % 2 === 0 ? 'image-left' : 'image-right'}`}
              ref={el => projectsRef.current[index] = el}
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

                <a href={project.link} className="project-link">
                  <span>View Project</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsCinematic;

