import React from 'react';
import '../../styles/SharedCinematic.css';
import { experiences } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

const ExperienceCinematic = () => {
  return (
    <section id="experience" className="section cinematic-section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">05</span>
          <RepelText as="h2" className="section-title-cinematic">Experience</RepelText>
          <div className="section-line" />
        </div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <RepelText as="div" className="experience-period">{exp.period}</RepelText>
              <div className="experience-content">
                <RepelText as="h3" className="experience-title">{exp.title}</RepelText>
                <RepelText as="p" className="experience-company">{exp.company}</RepelText>
                <RepelText as="p" className="experience-description">{exp.summary}</RepelText>
                <ul className="experience-achievements">
                  {exp.achievements.map((achievement, i) => (
                    <RepelText as="li" key={i}>{achievement}</RepelText>
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
