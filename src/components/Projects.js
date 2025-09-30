import React, { useState, useRef, useEffect } from 'react';
import '../styles/Projects.css';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const projectsRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'Modern responsive portfolio website built with React.js, featuring dark gradient theme and smooth animations. Includes project showcase, skills section, and contact form.',
      category: 'web',
      technologies: ['React.js', 'CSS3', 'JavaScript', 'HTML5'],
      status: 'Completed',
      image: 'images/project1.jpg',
      liveLink: 'https://portfoliowaris.vercel.app/',
      githubLink: 'https://github.com/Technolity/portfolio.1',
      features: ['Responsive Design', 'Dark Theme', 'Smooth Animations', 'Contact Form']
    },
    {
      id: 2,
      title: 'Crypto-Tracker App',
      description: 'Real-time cryptocurrency tracking application with price alerts, portfolio management, and market analysis features. Fetches live data from multiple APIs.',
      category: 'web',
      technologies: ['React.js', 'API Integration', 'Chart.js', 'Firebase'],
      status: 'In Progress',
      image: 'images/project2.png',
      liveLink: 'https://crypto-tracker-indol-alpha.vercel.app',
      githubLink: 'https://github.com/Technolity/crypto-tracker',
      features: ['Real-time Data', 'Price Alerts', 'Portfolio Tracking', 'Market Analysis']
    },
    {
      id: 3,
      title: 'Architectural Client Website',
      description: 'Professional website for architectural firm featuring project galleries, client testimonials, and service descriptions. Built with modern UI/UX principles.',
      category: 'web',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP'],
      status: 'Completed',
      image: 'images/project3.png',
      liveLink: 'https://crypto-tracker-aupb.vercel.app/',
      githubLink: 'https://github.com/Technolity/stellar_spaces',
      features: ['Project Gallery', 'Client Testimonials', 'Service Pages', 'Contact System']
    },
    {
      id: 4,
      title: 'Java Desktop Applications',
      description: 'Collection of desktop applications built with Java including calculator, text editor, and file management tools. Demonstrates OOP principles and GUI development.',
      category: 'desktop',
      technologies: ['Java', 'Swing', 'OOP', 'File I/O'],
      status: 'Completed',
      image: 'images/project4.png',
      liveLink: '#',
      githubLink: 'https://github.com/Technolity/java-projects',
      features: ['GUI Development', 'File Management', 'OOP Principles', 'User Interface']
    },
    {
      id: 5,
      title: 'C Programming Projects',
      description: 'Various problem-solving applications and algorithms implemented in C programming. Includes data structures, sorting algorithms, and system programming concepts.',
      category: 'desktop',
      technologies: ['C Programming', 'Data Structures', 'Algorithms', 'System Programming'],
      status: 'Completed',
      image: 'images/project5.png',
      liveLink: '#',
      githubLink: 'https://github.com/Technolity/c-projects',
      features: ['Data Structures', 'Sorting Algorithms', 'Problem Solving', 'System Programming']
    },
    {
      id: 6,
      title: 'AI/ML Learning Projects',
      description: 'Beginner to intermediate machine learning projects including data analysis, prediction models, and neural network implementations using Python and TensorFlow.',
      category: 'ai-ml',
      technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy'],
      status: 'Learning',
      image: 'images/project6.png',
      liveLink: '#',
      githubLink: 'https://github.com/Technolity/ai-ml-projects',
      features: ['Data Analysis', 'Prediction Models', 'Neural Networks', 'Machine Learning']
    }
  ];

  const filters = [
    { name: 'All Projects', value: 'all' },
    { name: 'Web Development', value: 'web' },
    { name: 'Desktop Apps', value: 'desktop' },
    { name: 'AI/ML', value: 'ai-ml' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Fixed function to handle link clicks
  const handleLinkClick = (url, event) => {
    // Only prevent default if the URL is '#' or empty
    if (url === '#' || !url) {
      event.preventDefault();
      alert('This project is not yet deployed. Check the GitHub repository for code.');
    }
    // Otherwise, let the link work normally (it will open in new tab)
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (projectsRef.current) {
      const projectCards = projectsRef.current.querySelectorAll('.cyber-project-card');
      projectCards.forEach(card => observer.observe(card));
    }

    return () => observer.disconnect();
  }, [filteredProjects]);

  return (
    <section id="projects" className="cyber-projects section" ref={projectsRef}>
      <div className="hologram-grid"></div>
      
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        
        <div className="projects-intro">
          <p className="intro-text">
            Here are some of my recent projects that showcase my skills in web development, 
            desktop applications, and my journey into AI/ML. Each project represents a 
            learning milestone and demonstrates my passion for creating innovative solutions.
          </p>
        </div>
        
        <div className="cyber-filters">
          {filters.map(filter => (
            <button
              key={filter.value}
              className={`cyber-filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              <span className="filter-text">{filter.name}</span>
              <span className="filter-indicator"></span>
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="cyber-project-card" data-category={project.category}>
              <div className="project-status" data-status={project.status.toLowerCase()}>
                {project.status}
              </div>
              
              <div className="project-visual">
                <div className="project-image">
                  <div className="image-container">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="project-screenshot"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'image-fallback-project';
                        fallback.innerHTML = `<span>${project.title}<br/>Screenshot</span>`;
                        e.target.parentNode.appendChild(fallback);
                      }}
                    />
                    <div className="project-overlay">
                      <div className="project-links">
                        <a 
                          href={project.liveLink} 
                          className={`project-link primary ${project.liveLink === '#' ? 'disabled' : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleLinkClick(project.liveLink, e)}
                        >
                          <span>{project.liveLink === '#' ? 'Coming Soon' : 'Live Demo'}</span>
                          <div className="link-arrow">
                            {project.liveLink === '#' ? '⏳' : '➜'}
                          </div>
                        </a>
                        <a 
                          href={project.githubLink} 
                          className="project-link secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleLinkClick(project.githubLink, e)}
                        >
                          <span>View Code</span>
                          <div className="link-arrow">{"</>"}</div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="project-glow"></div>
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
                <div className="project-features">
                  <h4>Key Features:</h4>
                  <ul>
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="projects-cta">
          <p className="cta-text">Interested in collaborating or seeing more projects?</p>
          <a href="#contact" className="cyber-btn primary large">
            <span>Let's Work Together</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;


