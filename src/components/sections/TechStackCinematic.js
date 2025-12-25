import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createBulletImpact } from '../UI/BulletImpact';
import '../../styles/TechStackCinematic.css';
import '../../styles/BulletImpact.css';

gsap.registerPlugin(ScrollTrigger);

const TechStackCinematic = () => {
  const categoriesRef = useRef([]);
  const [expandedSkill, setExpandedSkill] = useState(null);

  useEffect(() => {
    // Section header animation
    const sectionHeader = document.querySelector('#tech-stack .section-header-cinematic');
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

    categoriesRef.current.forEach((category, index) => {
      if (!category) return;

      // Category entrance with stagger
      gsap.fromTo(
        category,
        {
          opacity: 0,
          y: 60,
          rotationX: 5
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.9,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: category,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Individual skill items animation
      const skillItems = category.querySelectorAll('.skill-item');
      gsap.fromTo(
        skillItems,
        {
          opacity: 0,
          x: -20
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: category,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Handle skill click with bullet effect
  const handleSkillClick = (e, skill, categoryName) => {
    const x = e.clientX;
    const y = e.clientY;

    // Create bullet impact effect
    createBulletImpact({
      x,
      y,
      container: document.body,
      targetElement: e.currentTarget,
      onComplete: () => {
        setExpandedSkill({ ...skill, category: categoryName });
      }
    });
  };

  // Close expanded skill
  const closeExpandedSkill = () => {
    setExpandedSkill(null);
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedSkill) {
        closeExpandedSkill();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedSkill]);

  const techStack = [
    {
      category: 'Frontend',
      skills: [
        {
          name: 'React',
          icon: 'react',
          level: 'Expert',
          years: '4+ years',
          description: 'Building complex SPAs, custom hooks, state management with Redux/Zustand, and performance optimization.',
          projects: ['TedOS Platform', 'Crypto Tracker', 'This Portfolio']
        },
        {
          name: 'Next.js',
          icon: 'nextjs',
          level: 'Advanced',
          years: '3+ years',
          description: 'Server-side rendering, static site generation, API routes, and full-stack React applications.',
          projects: ['E-commerce Platform', 'Blog CMS']
        },
        {
          name: 'TypeScript',
          icon: 'typescript',
          level: 'Advanced',
          years: '3+ years',
          description: 'Type-safe JavaScript development with interfaces, generics, and advanced type patterns.',
          projects: ['All recent projects']
        },
        {
          name: 'Tailwind CSS',
          icon: 'tailwind',
          level: 'Expert',
          years: '3+ years',
          description: 'Utility-first CSS framework for rapid UI development and consistent design systems.',
          projects: ['Multiple client projects']
        },
        {
          name: 'GSAP',
          icon: 'gsap',
          level: 'Advanced',
          years: '2+ years',
          description: 'Professional-grade animations, scroll effects, and complex motion design.',
          projects: ['This Portfolio', 'Agency Websites']
        },
        {
          name: 'Three.js',
          icon: 'threejs',
          level: 'Intermediate',
          years: '1+ year',
          description: '3D graphics for the web, WebGL rendering, and interactive 3D experiences.',
          projects: ['Product Configurators', '3D Portfolios']
        }
      ]
    },
    {
      category: 'Backend',
      skills: [
        {
          name: 'Node.js',
          icon: 'nodejs',
          level: 'Expert',
          years: '4+ years',
          description: 'Building scalable REST APIs, WebSocket servers, and microservices architecture.',
          projects: ['TedOS Backend', 'Real-time Chat Apps']
        },
        {
          name: 'Express',
          icon: 'express',
          level: 'Expert',
          years: '4+ years',
          description: 'API development, middleware patterns, authentication, and routing.',
          projects: ['Most Node.js projects']
        },
        {
          name: 'Python',
          icon: 'python',
          level: 'Advanced',
          years: '3+ years',
          description: 'Data processing, automation scripts, and AI/ML integration.',
          projects: ['AI Review System', 'Data Pipelines']
        },
        {
          name: 'FastAPI',
          icon: 'fastapi',
          level: 'Advanced',
          years: '2+ years',
          description: 'High-performance Python APIs with automatic documentation and type validation.',
          projects: ['Amazon Review Intelligence']
        },
        {
          name: 'PostgreSQL',
          icon: 'postgresql',
          level: 'Advanced',
          years: '3+ years',
          description: 'Relational database design, complex queries, indexing, and optimization.',
          projects: ['SaaS Platforms', 'Analytics Systems']
        },
        {
          name: 'MongoDB',
          icon: 'mongodb',
          level: 'Advanced',
          years: '3+ years',
          description: 'NoSQL database design, aggregation pipelines, and schema modeling.',
          projects: ['TedOS Platform', 'Content Systems']
        }
      ]
    },
    {
      category: 'AI & Data',
      skills: [
        {
          name: 'OpenAI API',
          icon: 'openai',
          level: 'Expert',
          years: '2+ years',
          description: 'GPT integration, prompt engineering, embeddings, and AI-powered features.',
          projects: ['Review Intelligence', 'Chatbots']
        },
        {
          name: 'LangChain',
          icon: 'langchain',
          level: 'Advanced',
          years: '1+ year',
          description: 'Building complex AI chains, RAG systems, and LLM-powered applications.',
          projects: ['Document Q&A Systems']
        },
        {
          name: 'TensorFlow',
          icon: 'tensorflow',
          level: 'Intermediate',
          years: '2+ years',
          description: 'Machine learning model development and deployment.',
          projects: ['Image Classification', 'Sentiment Analysis']
        },
        {
          name: 'Pandas',
          icon: 'pandas',
          level: 'Advanced',
          years: '3+ years',
          description: 'Data manipulation, analysis, and preprocessing for ML pipelines.',
          projects: ['Data Analysis Tools']
        },
        {
          name: 'NumPy',
          icon: 'numpy',
          level: 'Advanced',
          years: '3+ years',
          description: 'Numerical computing and array operations for data science.',
          projects: ['ML Projects', 'Data Processing']
        },
        {
          name: 'Scikit-learn',
          icon: 'sklearn',
          level: 'Intermediate',
          years: '2+ years',
          description: 'Classical ML algorithms, preprocessing, and model evaluation.',
          projects: ['Prediction Models']
        }
      ]
    },
    {
      category: 'DevOps & Tools',
      skills: [
        {
          name: 'AWS',
          icon: 'aws',
          level: 'Advanced',
          years: '3+ years',
          description: 'EC2, S3, Lambda, RDS, CloudFront - cloud infrastructure and deployment.',
          projects: ['Production Deployments']
        },
        {
          name: 'Docker',
          icon: 'docker',
          level: 'Advanced',
          years: '3+ years',
          description: 'Containerization, Docker Compose, and container orchestration.',
          projects: ['All deployment pipelines']
        },
        {
          name: 'Git',
          icon: 'git',
          level: 'Expert',
          years: '5+ years',
          description: 'Version control, branching strategies, and collaborative workflows.',
          projects: ['Every project']
        },
        {
          name: 'Redis',
          icon: 'redis',
          level: 'Advanced',
          years: '2+ years',
          description: 'Caching, session storage, real-time pub/sub, and rate limiting.',
          projects: ['Crypto Tracker', 'Chat Systems']
        },
        {
          name: 'Nginx',
          icon: 'nginx',
          level: 'Intermediate',
          years: '3+ years',
          description: 'Reverse proxy, load balancing, SSL termination, and static serving.',
          projects: ['Production Servers']
        },
        {
          name: 'CI/CD',
          icon: 'cicd',
          level: 'Advanced',
          years: '3+ years',
          description: 'GitHub Actions, automated testing, and deployment pipelines.',
          projects: ['All production projects']
        }
      ]
    }
  ];

  return (
    <section id="tech-stack" className="tech-stack-cinematic section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-cinematic">
          <span className="section-number">03</span>
          <h2 className="section-title-cinematic">Tech Stack</h2>
          <div className="section-line"></div>
        </div>

        {/* Click hint */}
        <p className="click-hint">
          <span className="hint-icon">◎</span>
          Click on a skill to see details
        </p>

        {/* Tech Categories */}
        <div className="tech-categories">
          {techStack.map((item, index) => (
            <div
              key={index}
              className="tech-category"
              ref={el => categoriesRef.current[index] = el}
            >
              <div className="category-header">
                <span className="category-number">0{index + 1}</span>
                <h3 className="category-title">{item.category}</h3>
              </div>
              <div className="skills-grid">
                {item.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="skill-item"
                    onClick={(e) => handleSkillClick(e, skill, item.category)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="skill-icon-wrapper">
                      <img
                        src={`https://cdn.simpleicons.org/${skill.icon}/d4a574`}
                        alt={skill.name}
                        className="skill-icon"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className="skill-icon-fallback">{skill.name[0]}</span>
                    </div>
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-indicator"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Skill Overlay */}
      <div
        className={`card-expand-overlay ${expandedSkill ? 'active' : ''}`}
        onClick={closeExpandedSkill}
      />

      {/* Expanded Skill Card */}
      {expandedSkill && (
        <div className={`expanded-card expanded-skill-card ${expandedSkill ? 'active' : ''}`}>
          <button className="expanded-card-close" onClick={closeExpandedSkill}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="expanded-card-header">
            <div className="expanded-skill-icon">
              <img
                src={`https://cdn.simpleicons.org/${expandedSkill.icon}/d4a574`}
                alt={expandedSkill.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="expanded-card-category">{expandedSkill.category}</span>
              <h3 className="expanded-card-title">{expandedSkill.name}</h3>
            </div>
          </div>

          <div className="expanded-skill-meta">
            <div className="skill-meta-item">
              <span className="meta-label">Proficiency</span>
              <span className="meta-value">{expandedSkill.level}</span>
            </div>
            <div className="skill-meta-item">
              <span className="meta-label">Experience</span>
              <span className="meta-value">{expandedSkill.years}</span>
            </div>
          </div>

          <p className="expanded-card-description">{expandedSkill.description}</p>

          <div className="expanded-card-section">
            <h4 className="expanded-card-section-title">Used In Projects</h4>
            <div className="expanded-card-tags">
              {expandedSkill.projects.map((project, i) => (
                <span key={i} className="expanded-card-tag">{project}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TechStackCinematic;
