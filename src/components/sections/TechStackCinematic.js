import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/TechStackCinematic.css';
import { learningNow, stackGroups } from '../../content/portfolioData';
import RepelText from '../UI/RepelText';
import TechDossier from '../UI/TechDossier';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   Simple Icons slug map. Skills without a reliable slug fall back to
   a styled 2-letter monogram chip (also used when the CDN 404s).
------------------------------------------------------------------- */
const ICON_SLUGS = {
  'Anthropic Claude API': 'anthropic',
  'OpenAI API': 'openai',
  FastAPI: 'fastapi',
  'Node.js': 'nodedotjs',
  Express: 'express',
  Prisma: 'prisma',
  n8n: 'n8n',
  'Make.com': 'make',
  Zapier: 'zapier',
  Python: 'python',
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  Go: 'go',
  PostgreSQL: 'postgresql',
  Supabase: 'supabase',
  MySQL: 'mysql',
  Redis: 'redis',
  SQLite: 'sqlite',
  React: 'react',
  'Next.js': 'nextdotjs',
  'React Native + Expo': 'expo',
  Tailwind: 'tailwindcss',
  Vercel: 'vercel',
  Docker: 'docker',
  'Git / GitHub Actions': 'githubactions',
  // No reliable Simple Icons slug — intentional monogram fallback:
  // 'AI agent workflows', 'RAG', 'Structured output parsing',
  // 'LLM orchestration', 'REST', 'OAuth 2.0', 'Webhooks',
  // 'Microservices', 'Async queues', 'GoHighLevel API', 'Pabbly',
  // 'SQL', 'PL/pgSQL', 'AWS' (removed from simple-icons).
};

const ICON_TINT = 'F2F0ED'; // warm white, no '#'

const monogram = (name) => {
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const SkillChip = ({ skill, onOpen }) => {
  const [failed, setFailed] = useState(false);
  const slug = ICON_SLUGS[skill];
  const showIcon = slug && !failed;

  return (
    <button
      type="button"
      className="skill-chip clickable"
      onClick={() => onOpen(skill)}
      aria-label={`Open production usage dossier for ${skill}`}
    >
      <span className="skill-chip-icon" aria-hidden="true">
        {showIcon ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/${ICON_TINT}`}
            alt=""
            width="20"
            height="20"
            loading="lazy"
            decoding="async"
            draggable="false"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="skill-chip-monogram">{monogram(skill)}</span>
        )}
      </span>
      <span className="skill-chip-name">{skill}</span>
      <span className="skill-chip-open" aria-hidden="true">+</span>
      <span className="skill-chip-dot" aria-hidden="true" />
    </button>
  );
};

const TechStackCinematic = () => {
  const sectionRef = useRef(null);
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    const listenerCleanups = [];

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      /* ---- Scroll reveals ---- */
      gsap.fromTo(
        section.querySelector('.section-header-cinematic'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.utils.toArray(section.querySelectorAll('.stack-group')).forEach((group) => {
        gsap.fromTo(
          group.querySelector('.stack-group-header'),
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          group.querySelectorAll('.skill-chip'),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.035,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      gsap.fromTo(
        section.querySelector('.learning-marquee'),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.learning-marquee'),
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* ---- Magnetic hover (fine pointers, desktop only) ---- */
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (finePointer && !reducedMotion && window.innerWidth >= 768) {
        section.querySelectorAll('.skill-chip').forEach((chip) => {
          const xTo = gsap.quickTo(chip, 'x', { duration: 0.4, ease: 'power3.out' });
          const yTo = gsap.quickTo(chip, 'y', { duration: 0.4, ease: 'power3.out' });

          const onMove = (e) => {
            const rect = chip.getBoundingClientRect();
            const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            xTo(relX * 5);
            yTo(relY * 4);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          chip.addEventListener('mousemove', onMove);
          chip.addEventListener('mouseleave', onLeave);
          listenerCleanups.push(() => {
            chip.removeEventListener('mousemove', onMove);
            chip.removeEventListener('mouseleave', onLeave);
          });
        });
      }
    }, sectionRef);

    return () => {
      listenerCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section id="tech-stack" className="tech-stack-cinematic section" ref={sectionRef}>
      <div className="container">
        <div className="section-header-cinematic">
          <span className="section-number">04</span>
          <RepelText as="h2" className="section-title-cinematic">Tech Stack</RepelText>
          <div className="section-line" />
        </div>

        <RepelText as="p" className="section-intro">
          The current working stack from recent SaaS, automation, and product builds.
        </RepelText>

        <div className="stack-groups">
          {stackGroups.map((group, index) => (
            <article key={group.title} className="stack-group">
              <div className="stack-group-header">
                <span className="stack-group-number">0{index + 1}</span>
                <RepelText as="h3" className="stack-group-title">{group.title}</RepelText>
                <RepelText as="p" className="stack-group-description">
                  {group.description}
                </RepelText>
              </div>
              <div className="stack-group-grid">
                {group.skills.map((skill) => (
                  <SkillChip key={skill} skill={skill} onOpen={setActiveSkill} />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div
          className="learning-marquee"
          aria-label={`Currently learning — ${learningNow.join(', ')}`}
        >
          <span className="learning-marquee-label">Currently learning</span>
          <div className="learning-marquee-viewport">
            <div className="learning-marquee-track">
              {[0, 1, 2, 3].map((copy) => (
                <span
                  key={copy}
                  className="learning-marquee-seq"
                  aria-hidden={copy > 0 ? 'true' : undefined}
                >
                  {learningNow.map((item) => (
                    <span key={item} className="learning-marquee-item">
                      {item}
                      <span className="learning-marquee-sep">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeSkill && (
        <TechDossier skill={activeSkill} onClose={() => setActiveSkill(null)} />
      )}
    </section>
  );
};

export default TechStackCinematic;
