import React, { useRef, useEffect } from 'react';
import '../styles/Experience.css';

const Experience = () => {
  const experienceRef = useRef(null);

  const experiences = [
    {
      id: 1,
      title: 'Problem Solving with C Programming',
      period: '2022 - Present',
      description: 'Developed strong foundation in algorithms and data structures through extensive problem-solving. Solved 100+ programming challenges focusing on efficiency and optimization.',
      achievements: [
        'Implemented various sorting and searching algorithms',
        'Solved complex data structure problems',
        'Developed efficient algorithms for optimization',
        'Built console-based applications and utilities'
      ],
      technologies: ['C Programming', 'Data Structures', 'Algorithms', 'Problem Solving'],
      type: 'academic'
    },
    {
      id: 2,
      title: 'Java Application Development',
      period: '2022 - 2023',
      description: 'Created multiple desktop applications using Java and Swing framework. Focused on object-oriented programming principles and GUI development.',
      achievements: [
        'Built calculator and text editor applications',
        'Implemented file management systems',
        'Developed user-friendly GUI interfaces',
        'Applied OOP concepts in practical projects'
      ],
      technologies: ['Java', 'Swing', 'OOP', 'GUI Development'],
      type: 'academic'
    },
    {
      id: 3,
      title: 'Web Development Projects',
      period: '2023 - Present',
      description: 'Designed and developed responsive web applications using modern technologies. Focused on creating user-friendly interfaces and implementing full-stack solutions.',
      achievements: [
        'Built portfolio website with React.js',
        'Created crypto-tracker application',
        'Developed client websites with modern UI/UX',
        'Implemented responsive designs for all devices'
      ],
      technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js'],
      type: 'projects'
    },
    {
      id: 4,
      title: 'AI/ML Learning Journey',
      period: 'Starting Soon',
      description: 'Started exploring Artificial Intelligence and Machine Learning concepts. Working on foundational projects to understand data analysis and predictive modeling.',
      achievements: [
        'Learning Python for data science',
        'Exploring TensorFlow and neural networks',
        'Working on basic prediction models',
        'Studying data analysis techniques'
      ],
      technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Machine Learning'],
      type: 'learning'
    }
  ];

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

    if (experienceRef.current) {
      const experienceItems = experienceRef.current.querySelectorAll('.experience-item');
      experienceItems.forEach(item => observer.observe(item));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="cyber-experience section" ref={experienceRef}>
      <div className="circuit-background"></div>
      
      <div className="container">
        <h2 className="section-title">My Journey</h2>
        
        <div className="experience-intro">
          <p className="intro-text">
            My journey in technology has been a continuous learning process, 
            starting from fundamental programming concepts to modern web development 
            and now exploring the exciting field of Artificial Intelligence.
          </p>
        </div>

        <div className="experience-timeline">
          {experiences.map((experience, index) => (
            <div 
              key={experience.id} 
              className="experience-item" 
              data-type={experience.type}
            >
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                <div className="marker-line"></div>
              </div>
              
              <div className="experience-content">
                <div className="experience-header">
                  <h3 className="experience-title">{experience.title}</h3>
                  <span className="experience-period">{experience.period}</span>
                </div>
                
                <p className="experience-description">{experience.description}</p>
                
                <div className="experience-achievements">
                  <h4>Key Achievements:</h4>
                  <ul>
                    {experience.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="experience-tech">
                  {experience.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="journey-stats">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Problems Solved</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Projects Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">Technologies</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3+</div>
            <div className="stat-label">Years Learning</div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Experience;
