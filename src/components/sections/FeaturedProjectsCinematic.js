import React from 'react';
import '../../styles/FeaturedProjectsCinematic.css';
import { featuredProjects } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';

const FeaturedProjectsCinematic = () => {
  return (
    <section id="projects" className="featured-projects-cinematic section">
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">02</span>
          <h2 className="section-title-cinematic">Featured Projects</h2>
          <div className="section-line" />
        </div>

        <p className="section-intro">
          Production builds, hackathon systems, and shipped products with live demos and repos.
        </p>

        <div className="projects-list">
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              className={`project-dossier ${index % 2 === 0 ? 'image-left' : 'image-right'}`}
            >
              <div className="project-image-wrapper">
                {project.image ? (
                  <div className="project-image-container">
                    <img src={project.image} alt={project.title} className="project-image" />
                    <div className="image-overlay" />
                  </div>
                ) : (
                  <div className="project-poster">
                    <span className="project-poster-eyebrow">{project.posterEyebrow}</span>
                    <strong className="project-poster-title">{project.title}</strong>
                    <span className="project-poster-metric">{project.posterMetric}</span>
                  </div>
                )}
                <div className="project-number">0{index + 1}</div>
              </div>

              <div className="project-content">
                <span className="project-category">{project.category}</span>
                <RepelText as="h3" className="project-title">{project.title}</RepelText>
                <RepelText as="p" className="project-description">{project.description}</RepelText>

                <div className="project-tech">
                  {project.stack.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <ul className="project-highlights">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="project-actions">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action project-action-primary"
                    >
                      Live Demo →
                    </a>
                  ) : (
                    <span className="project-status">Live link pending</span>
                  )}
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action project-action-secondary"
                    >
                      View Code →
                    </a>
                  ) : (
                    <span className="project-status">Repo pending</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsCinematic;
