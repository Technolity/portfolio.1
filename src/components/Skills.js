import React, { useRef, useEffect, useState } from 'react';
import '../styles/Skills.css';

const Skills = () => {
  const skillsRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  const skills = [
    { name: 'REACT.JS', level: 85, category: 'frontend', icon: '⚛️' },
    { name: 'JAVASCRIPT', level: 88, category: 'frontend', icon: '🟨' },
    { name: 'HTML5', level: 92, category: 'frontend', icon: '🔶' },
    { name: 'CSS3', level: 90, category: 'frontend', icon: '💎' },
    { name: 'NODE.JS', level: 75, category: 'backend', icon: '🟢' },
    { name: 'PYTHON', level: 80, category: 'backend', icon: '🐍' },
    { name: 'JAVA', level: 78, category: 'programming', icon: '☕' },
    { name: 'C PROGRAMMING', level: 85, category: 'programming', icon: '🔷' },
    { name: 'GIT', level: 82, category: 'tools', icon: '📚' },
    { name: 'AI/ML', level: 70, category: 'emerging', icon: '🤖' }
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
                <div className="skill-icon">{skill.icon}</div>
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