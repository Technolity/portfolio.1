import React from 'react';
import '../../styles/TechStackCinematic.css';
import { learningNow, stackGroups } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

const TechStackCinematic = () => {
  return (
    <section id="tech-stack" className="tech-stack-cinematic section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">03</span>
          <h2 className="section-title-cinematic">Tech Stack</h2>
          <div className="section-line" />
        </div>

        <p className="section-intro">
          The current working stack from recent SaaS, automation, and product builds.
        </p>

        <div className="tech-categories">
          {stackGroups.map((item, index) => (
            <article key={item.title} className="tech-category">
              <div className="category-header">
                <span className="category-number">0{index + 1}</span>
                <div>
                  <h3 className="category-title">{item.title}</h3>
                  <RepelText as="p" className="category-description">{item.description}</RepelText>
                </div>
              </div>
              <div className="skills-grid">
                {item.skills.map((skill) => (
                  <div key={skill} className="skill-item">
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="learning-strip">
          <span>Currently learning</span>
          <p>{learningNow.join(' · ')}</p>
        </div>
      </div>
    </section>
  );
};

export default TechStackCinematic;
