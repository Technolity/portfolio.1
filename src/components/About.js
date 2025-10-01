import React, { useRef, useEffect } from 'react';
import '../styles/About.css';

const About = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="cyber-about section" ref={aboutRef}>
      <div className="galaxy-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      <div className="container">
        <h2 className="section-title">About Me</h2>
        
        <div className="about-content">
          <div className="about-text">
            <div className="glass-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <h3 className="card-title">PROFILE.SYS</h3>
              </div>
              
              <div className="card-content">
                <p className="about-description">
                  I'm <span className="text-highlight">Waris Rawa</span>, a passionate B.Tech Computer Science Engineering student 
                  with a strong foundation in full-stack web development and a growing interest in 
                  <span className="text-highlight"> Artificial Intelligence and Machine Learning</span>. 
                </p>
                
                <p className="about-description">
                  My journey in technology began with problem-solving using C programming, evolved through 
                  Java application development, and now focuses on creating innovative web solutions using 
                  modern technologies like React.js, Node.js, and Python.
                </p>
                
                <p className="about-description">
                  I'm constantly exploring the intersection of web development and AI/ML, working on projects 
                  that leverage data-driven insights to create smarter, more intuitive user experiences.
                </p>

                <div className="education-section">
                  <h4 className="sub-title">🎓 Education & Focus</h4>
                  <ul className="education-list">
                    <li>B.Tech in Computer Science & Engineering</li>
                    <li>Specializing in Web Development & AI/ML</li>
                    <li>Strong foundation in Data Structures & Algorithms</li>
                    <li>Experience with C, Java, Python, and modern web technologies</li>
                  </ul>
                </div>

                <div className="stats-grid">
                  <div className="cyber-stat">
                    <div className="stat-number" data-count="3">0</div>
                    <div className="stat-label">Years Coding</div>
                  </div>
                  <div className="cyber-stat">
                    <div className="stat-number" data-count="15">0</div>
                    <div className="stat-label">Projects Built</div>
                  </div>
                  <div className="cyber-stat">
                    <div className="stat-number" data-count="5">0</div>
                    <div className="stat-label">Technologies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-visual">
            <div className="tech-cube-container">
              <div className="tech-cube">
                <div className="cube-face front">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
                  <span>REACT</span>
                </div>
                <div className="cube-face back">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />
                  <span>PYTHON</span>
                </div>
                <div className="cube-face right">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
                  <span>JS</span>
                </div>
                <div className="cube-face left">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />
                  <span>NODE.JS</span>
                </div>
                <div className="cube-face top">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />
                  <span>JAVA</span>
                </div>
                <div className="cube-face bottom">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" />
                  <span>AI/ML</span>
                </div>
              </div>
              <div className="cube-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
