import React from 'react';
import '../../styles/SharedCinematic.css';

const ExperienceCinematic = () => {
  const experiences = [
    {
      period: '2023 - Present',
      title: 'Full-Stack Developer',
      company: 'Freelance',
      description: 'Building intelligent web applications for clients worldwide. Specializing in AI integration and scalable architecture.',
      achievements: [
        'Developed 10+ production applications',
        'Integrated AI capabilities in 5 major projects',
        'Maintained 99.9% uptime across deployments'
      ]
    },
    {
      period: '2021 - 2023',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      description: 'Led development of enterprise applications using modern JavaScript frameworks and cloud infrastructure.',
      achievements: [
        'Reduced load times by 60%',
        'Implemented microservices architecture',
        'Mentored 3 junior developers'
      ]
    }
  ];

  return (
    <section id="experience" className="section cinematic-section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">04</span>
          <h2 className="section-title-cinematic">Experience</h2>
          <div className="section-line"></div>
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-period">{exp.period}</div>
              <div className="experience-content">
                <h3 className="experience-title">{exp.title}</h3>
                <p className="experience-company">{exp.company}</p>
                <p className="experience-description">{exp.description}</p>
                <ul className="experience-achievements">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceCinematic;

