import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/TechStackCinematic.css';

gsap.registerPlugin(ScrollTrigger);

const TechStackCinematic = () => {
  const categoriesRef = useRef([]);

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

  const techStack = [
    {
      category: 'Frontend',
      skills: [
        { name: 'React', icon: 'react' },
        { name: 'Next.js', icon: 'nextjs' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Tailwind CSS', icon: 'tailwind' },
        { name: 'GSAP', icon: 'gsap' },
        { name: 'Three.js', icon: 'threejs' }
      ]
    },
    {
      category: 'Backend',
      skills: [
        { name: 'Node.js', icon: 'nodejs' },
        { name: 'Express', icon: 'express' },
        { name: 'Python', icon: 'python' },
        { name: 'FastAPI', icon: 'fastapi' },
        { name: 'PostgreSQL', icon: 'postgresql' },
        { name: 'MongoDB', icon: 'mongodb' }
      ]
    },
    {
      category: 'AI & Data',
      skills: [
        { name: 'OpenAI API', icon: 'openai' },
        { name: 'LangChain', icon: 'langchain' },
        { name: 'TensorFlow', icon: 'tensorflow' },
        { name: 'Pandas', icon: 'pandas' },
        { name: 'NumPy', icon: 'numpy' },
        { name: 'Scikit-learn', icon: 'sklearn' }
      ]
    },
    {
      category: 'DevOps & Tools',
      skills: [
        { name: 'AWS', icon: 'aws' },
        { name: 'Docker', icon: 'docker' },
        { name: 'Git', icon: 'git' },
        { name: 'Redis', icon: 'redis' },
        { name: 'Nginx', icon: 'nginx' },
        { name: 'CI/CD', icon: 'cicd' }
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
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-icon-wrapper">
                      <img 
                        src={`https://cdn.simpleicons.org/${skill.icon}/d4a574`}
                        alt={skill.name}
                        className="skill-icon"
                        onError={(e) => {
                          // Fallback to text if icon fails to load
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
    </section>
  );
};

export default TechStackCinematic;

