import React from 'react';
import '../../styles/SharedCinematic.css';
import { experiences } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

const ExperienceCinematic = () => {
  return (
    <section id="experience" className="section cinematic-section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">04</span>
          <h2 className="section-title-cinematic">Experience</h2>
          <div className="section-line" />
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-period">{exp.period}</div>
              <div className="experience-content">
                <RepelText as="h3" className="experience-title">{exp.title}</RepelText>
                <p className="experience-company">{exp.company}</p>
                <RepelText as="p" className="experience-description">{exp.summary}</RepelText>
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
