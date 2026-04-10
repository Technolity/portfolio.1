import React from 'react';
import '../../styles/SharedCinematic.css';
import '../../styles/AboutCinematic.css';
import { aboutParagraphs, education, principles, profile } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

/* ============================================================
   ABOUT SECTION
   Snake cursor is global (SnakeCursor in App.js).
   RepelText wraps paragraph content so characters physically
   move away from the snake head as it passes through the text.
   ============================================================ */
const AboutCinematic = () => {
  return (
    <section id="about" className="section cinematic-section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">05</span>
          <h2 className="section-title-cinematic">About</h2>
          <div className="section-line" />
        </div>

        <div className="about-content">
          {/* LEFT — text with character repulsion */}
          <div className="about-text">
            <RepelText as="p" className="about-lead">
              {profile.role}.
            </RepelText>

            {aboutParagraphs.map((para) => (
              <RepelText as="p" key={para}>
                {para}
              </RepelText>
            ))}

            <RepelText as="p">
              The problems I find most engaging live at the intersection of scale and
              reliability — where a poorly designed schema or a missing retry loop can
              quietly break user trust. I default to writing things I can actually
              reason about: clear data contracts, small well-named functions, and
              integration tests that run against real dependencies.
            </RepelText>

            <RepelText as="p">
              Outside of client and product work, I spend time studying distributed
              systems — Golang, ElasticSearch, Cassandra, and AWS&apos;s managed services
              are where my current learning is concentrated. The best backend engineers
              understand the whole stack well enough to make confident trade-offs, not
              just implement what&apos;s asked.
            </RepelText>

            <RepelText as="p">
              Based in Sopore, Kashmir — available globally for remote contracts,
              backend-heavy SaaS builds, and AI-integrated product work. If the
              architecture matters, I want to talk.
            </RepelText>

            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">690+</span>
                <span className="about-stat-label">commits on TedOS</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">17+</span>
                <span className="about-stat-label">AI generation jobs</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">2+</span>
                <span className="about-stat-label">years shipping products</span>
              </div>
            </div>
          </div>

          {/* RIGHT — principles + education */}
          <div className="about-principles">
            <h3>How I Work</h3>
            <ul>
              {principles.map((principle) => (
                <li key={principle.title}>
                  <strong>{principle.title}</strong>
                  <span>{principle.description}</span>
                </li>
              ))}
            </ul>

            <div className="about-education">
              <span className="about-education-label">Education</span>
              <h4>{education.title}</h4>
              <p>{education.institution}</p>
              <span>{education.period}</span>
              <p>{education.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCinematic;
