import React from 'react';
import '../../styles/SharedCinematic.css';

const AboutCinematic = () => {
  return (
    <section id="about" className="section cinematic-section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">05</span>
          <h2 className="section-title-cinematic">About</h2>
          <div className="section-line"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-lead">
              I'm a full-stack developer who builds intelligent systems from the ground up.
            </p>
            <p>
              With expertise spanning modern web frameworks, backend architecture, and AI integration, 
              I create applications that are both powerful and elegant. Every project is an opportunity 
              to push boundaries and deliver exceptional results.
            </p>
            <p>
              My approach combines technical precision with strategic thinking. I don't just write code—I 
              architect solutions that scale, perform, and stand the test of time.
            </p>
          </div>
          
          <div className="about-principles">
            <h3>Core Principles</h3>
            <ul>
              <li>
                <strong>Precision</strong>
                <span>Every line of code serves a purpose</span>
              </li>
              <li>
                <strong>Performance</strong>
                <span>Speed and efficiency are non-negotiable</span>
              </li>
              <li>
                <strong>Intelligence</strong>
                <span>Leveraging AI to solve complex problems</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCinematic;

