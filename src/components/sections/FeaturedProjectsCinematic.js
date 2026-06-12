import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/FeaturedProjectsCinematic.css';
import { featuredProjects } from '../../content/portfolioData';
import { projectIntros } from '../../content/projectIntros';
import ProjectIntroPoster from '../projects/ProjectIntroPoster';
import RepelText from '../UI/RepelText';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjectsCinematic = () => {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const hintRef = useRef(null);
  const panelsRef = useRef([]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return undefined;

    const ctx = gsap.context(() => {
      const header = sectionEl.querySelector('.section-header-cinematic');
      const intro = sectionEl.querySelector('.section-intro');
      const panels = panelsRef.current.filter(Boolean);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (mmCtx) => {
          const { desktop, mobile, reduced } = mmCtx.conditions;

          /* ---- Reduced motion: simple fades only, no pin, no parallax ---- */
          if (reduced) {
            [header, intro, ...panels].forEach((el) => {
              if (!el) return;
              gsap.fromTo(
                el,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.45,
                  ease: 'none',
                  scrollTrigger: { trigger: el, start: 'top 92%' },
                }
              );
            });
            return;
          }

          /* ---- Section header reveal (house idiom) ---- */
          gsap.fromTo(
            [header, intro],
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionEl,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          /* ---- Desktop: pinned horizontal gallery ---- */
          if (desktop) {
            const gallery = galleryRef.current;
            const track = trackRef.current;
            const getDistance = () =>
              Math.max(track.scrollWidth - gallery.clientWidth, 1);

            const scrollTween = gsap.to(track, {
              x: () => -getDistance(),
              ease: 'none',
              scrollTrigger: {
                trigger: gallery,
                start: 'top top',
                end: () => '+=' + getDistance(),
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (progressRef.current) {
                    gsap.set(progressRef.current, { scaleX: self.progress });
                  }
                  if (hintRef.current) {
                    gsap.set(hintRef.current, {
                      opacity: Math.max(0, 1 - self.progress * 10),
                    });
                  }
                },
              },
            });

            /* Per-panel choreography, driven by the horizontal scrub */
            panels.forEach((panel) => {
              const media = panel.querySelector('[data-parallax="media"]');
              const inner = panel.querySelector('[data-parallax="inner"]');
              const indexEl = panel.querySelector('.fp-index');
              const drift = {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              };

              if (media) {
                /* Screenshot drifts slower than its panel inside the mask */
                gsap.fromTo(
                  media,
                  { xPercent: -4, scale: 1.12 },
                  { xPercent: 4, scale: 1.12, ease: 'none', scrollTrigger: { ...drift } }
                );
              }
              if (inner) {
                /* Typographic poster content gets a gentler drift */
                gsap.fromTo(
                  inner,
                  { x: -18 },
                  { x: 18, ease: 'none', scrollTrigger: { ...drift } }
                );
              }
              if (indexEl) {
                gsap.fromTo(
                  indexEl,
                  { x: 90 },
                  { x: -90, ease: 'none', scrollTrigger: { ...drift } }
                );
              }
            });
          }

          /* ---- Mobile/tablet: vertical stack, staggered reveals ---- */
          if (mobile) {
            panels.forEach((panel) => {
              gsap.fromTo(
                panel,
                { opacity: 0, y: 24 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: panel,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                  },
                }
              );
            });
          }
        }
      );
    }, sectionRef);

    /* Recalculate pin distances once real screenshots finish loading */
    const handleImageLoad = () => ScrollTrigger.refresh();
    const pendingImages = Array.from(sectionEl.querySelectorAll('img')).filter(
      (img) => !img.complete
    );
    pendingImages.forEach((img) =>
      img.addEventListener('load', handleImageLoad)
    );

    return () => {
      pendingImages.forEach((img) =>
        img.removeEventListener('load', handleImageLoad)
      );
      ctx.revert();
    };
  }, []);

  return (
    <section id="projects" className="featured-projects-cinematic section" ref={sectionRef}>
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">03</span>
          <RepelText as="h2" className="section-title-cinematic">Featured Projects</RepelText>
          <div className="section-line" />
        </div>

        <RepelText as="p" className="section-intro">
          Production builds, hackathon systems, and shipped products with live demos and repos.
        </RepelText>
      </div>

      <div className="fp-gallery" ref={galleryRef}>
        <div className="fp-track" ref={trackRef}>
          {featuredProjects.map((project, index) => {
            const intro = projectIntros[project.id];

            return (
              <article
                key={project.id}
                className="fp-panel"
                ref={(el) => { panelsRef.current[index] = el; }}
              >
                <div className="fp-poster">
                  <div className="fp-poster-intro" data-parallax="inner">
                    {intro ? (
                      <ProjectIntroPoster project={project} intro={intro} />
                    ) : (
                      <div className="fp-poster-typo">
                        <div className="fp-poster-typo-inner">
                          <span className="fp-poster-eyebrow">{project.posterEyebrow}</span>
                          <strong className="fp-poster-headline">
                            {project.title.split('—')[0].trim()}
                          </strong>
                          <span className="fp-poster-metric">{project.posterMetric}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="fp-info">
                  <span className="fp-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="fp-info-body">
                    <RepelText as="span" className="fp-category">{project.category}</RepelText>
                    <RepelText as="h3" className="fp-title">{project.title}</RepelText>
                    <RepelText as="p" className="fp-description">{project.description}</RepelText>

                    <div className="fp-stack">
                      {project.stack.map((tech) => (
                        <span key={tech} className="fp-chip">{tech}</span>
                      ))}
                    </div>

                    <ul className="fp-highlights">
                      {project.highlights.map((item) => (
                        <RepelText as="li" key={item}>{item}</RepelText>
                      ))}
                    </ul>

                    <div className="fp-links">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fp-link"
                        >
                          Live <span className="fp-link-arrow">↗</span>
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fp-link"
                        >
                          Code <span className="fp-link-arrow">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="fp-chrome" aria-hidden="true">
          <div className="fp-progress">
            <span className="fp-progress-bar" ref={progressRef} />
          </div>
          <span className="fp-hint" ref={hintRef}>Keep scrolling — gallery moves sideways</span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsCinematic;
