import React, { useRef, useEffect, useState } from 'react';
import '../styles/Skills.css';

const Skills = () => {
  const skillsRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  const skills = [
    { 
      name: 'REACT.JS', 
      level: 85, 
      category: 'frontend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' 
    },
    { 
      name: 'JAVASCRIPT', 
      level: 88, 
      category: 'frontend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' 
    },
    { 
      name: 'HTML5', 
      level: 92, 
      category: 'frontend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' 
    },
    { 
      name: 'CSS3', 
      level: 90, 
      category: 'frontend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' 
    },
    { 
      name: 'NODE.JS', 
      level: 75, 
      category: 'backend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' 
    },
    { 
      name: 'PYTHON', 
      level: 80, 
      category: 'backend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' 
    },
    { 
      name: 'JAVA', 
      level: 78, 
      category: 'programming', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' 
    },
    { 
      name: 'C PROGRAMMING', 
      level: 85, 
      category: 'programming', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' 
    },
    { 
      name: 'GIT', 
      level: 82, 
      category: 'tools', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' 
    },
    { 
      name: 'TENSORFLOW', 
      level: 70, 
      category: 'emerging', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' 
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <section id="skills" className="cyber-skills section" ref={skillsRef}>
      <div className="binary-background">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="binary-digit"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>
      
      <div className="container">
        <h2 className="section-title">Tech Arsenal</h2>
        
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="cyber-skill-card" 
              data-category={skill.category}
            >
              <div className="skill-header">
                <div className="skill-logo-container">
                  <img 
                    src={skill.logo} 
                    alt={skill.name}
                    className="skill-logo"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'skill-fallback';
                      fallback.textContent = skill.name.charAt(0);
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                </div>
                <h3 className="skill-name">{skill.name}</h3>
                <div className="skill-percent">{skill.level}%</div>
              </div>
              
              <div className="skill-bar-container">
                <div 
                  className="skill-bar"
                  style={{
                    '--skill-level': animated ? `${skill.level}%` : '0%'
                  }}
                >
                  <div className="skill-progress"></div>
                  <div className="skill-glow"></div>
                </div>
              </div>
              
              <div className="skill-level-bars">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`level-bar ${i < Math.floor(skill.level / 10) ? 'active' : ''}`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="tech-categories">
          <div className="cyber-category">
            <h3 className="category-title">FRONTEND</h3>
            <div className="tech-tags">
              <span className="tech-tag">React</span>
              <span className="tech-tag">JavaScript</span>
              <span className="tech-tag">HTML5</span>
              <span className="tech-tag">CSS3</span>
              <span className="tech-tag">Bootstrap</span>
            </div>
          </div>
          
          <div className="cyber-category">
            <h3 className="category-title">BACKEND</h3>
            <div className="tech-tags">
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Python</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">MongoDB</span>
            </div>
          </div>
          
          <div className="cyber-category">
            <h3 className="category-title">PROGRAMMING</h3>
            <div className="tech-tags">
              <span className="tech-tag">Java</span>
              <span className="tech-tag">C Programming</span>
              <span className="tech-tag">Data Structures</span>
              <span className="tech-tag">Algorithms</span>
            </div>
          </div>

          <div className="cyber-category">
            <h3 className="category-title">EMERGING TECH</h3>
            <div className="tech-tags">
              <span className="tech-tag">AI/ML</span>
              <span className="tech-tag">TensorFlow</span>
              <span className="tech-tag">Data Science</span>
              <span className="tech-tag">Cloud Computing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
