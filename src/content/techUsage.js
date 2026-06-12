/* ------------------------------------------------------------------
   techUsage — production usage records per skill.
   Keyed by the exact skill names used in stackGroups (portfolioData).
   Each entry: { tagline, deployments: [{ project, role, live, proof }] }
   All facts sourced from delivered work — no invented numbers.
------------------------------------------------------------------- */

const TEDOS = 'https://dev.tedos.ai';
const ARI = 'https://amazon-review-intelligence.vercel.app/';
const MOON = 'https://moonnaturallyyours.com';
const AGRI = 'https://agriculture-advisory.vercel.app/';
const STELLAR = 'https://stellar-spaces.netlify.app/';
const CRYPTO = 'https://crypto-tracker-indol-alpha.vercel.app/';

const techUsage = {
  /* ---------------- AI & LLMs ---------------- */

  'Anthropic Claude API': {
    tagline: 'Structured Claude generation at the core of a production SaaS.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Built the Claude generation engine — a single 20-field intake fans out into 17+ AI jobs for sales, email, VSL and funnel assets, each returning schema-validated JSON.',
        live: TEDOS,
        proof: '17+ generation jobs per intake',
      },
      {
        project: 'Scalez Media',
        role: 'Claude-driven content pipelines with reusable prompt templates and structured JSON parsers feeding CRM and email systems.',
        live: null,
        proof: 'Agency content pipelines',
      },
    ],
  },

  'OpenAI API': {
    tagline: 'Multi-model content pipelines in agency production.',
    deployments: [
      {
        project: 'Scalez Media',
        role: 'OpenAI + Claude dual-model pipelines for sales, email and ad copy — prompt templates, structured parsers, CRM-ready output.',
        live: null,
        proof: 'Multi-model pipelines',
      },
    ],
  },

  'AI agent workflows': {
    tagline: 'Coordinated multi-step AI flows that ship business assets.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Designed the intake-to-asset agent flow: 20 structured fields trigger 17+ coordinated Claude jobs with queueing, retries and fallback automations.',
        live: TEDOS,
        proof: '17+ coordinated jobs per intake',
      },
      {
        project: 'Scalez Media',
        role: 'Lead ingestion, dedup and enrichment flows feeding CRM, email and ad-network automations.',
        live: null,
        proof: 'End-to-end lead automation',
      },
    ],
  },

  RAG: {
    tagline: 'Generation grounded in tenant data, not free-form prompts.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Every generation job is conditioned on retrieved tenant intake fields and stored brand context, keeping output specific to each organisation.',
        live: TEDOS,
        proof: 'Tenant-scoped context retrieval',
      },
    ],
  },

  'Structured output parsing': {
    tagline: 'Model output treated as data — parsed, validated, retried.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Schema-validated JSON across all 17+ generation jobs — parse, validate, and retry on malformed output before anything touches the database.',
        live: TEDOS,
        proof: '17+ schema-validated jobs',
      },
      {
        project: 'Scalez Media',
        role: 'Structured JSON parsers turning model output into CRM-ready records.',
        live: null,
        proof: 'CRM-ready structured records',
      },
    ],
  },

  'LLM orchestration': {
    tagline: 'Fan-out, retries and observability around LLM jobs.',
    deployments: [
      {
        project: 'TedOS',
        role: 'One intake fans out to 17+ Claude jobs with async queueing, retries, structured logging and n8n / Pabbly fail-safe fallbacks.',
        live: TEDOS,
        proof: 'Fan-out across 17+ jobs',
      },
    ],
  },

  /* ---------------- Backend & API ---------------- */

  FastAPI: {
    tagline: 'Python API serving NLP and graph data in production.',
    deployments: [
      {
        project: 'Amazon Review Intelligence',
        role: 'FastAPI backend serving Apify-scraped reviews, VADER/TextBlob sentiment scoring and Sigma.js graph data to the Next.js front end.',
        live: ARI,
        proof: '10+ marketplaces',
      },
    ],
  },

  'Node.js': {
    tagline: 'The default backend runtime across shipped systems.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Node.js services behind the SaaS — OAuth onboarding, webhook intake and the AI generation job pipeline.',
        live: TEDOS,
        proof: '690+ commits, sole developer',
      },
      {
        project: 'Agriculture Advisory',
        role: 'Node.js + Express API with Prisma over PostgreSQL, syncing the offline-first mobile client.',
        live: AGRI,
        proof: 'Offline-first sync backend',
      },
    ],
  },

  Express: {
    tagline: 'Lean REST services where the job calls for them.',
    deployments: [
      {
        project: 'Agriculture Advisory',
        role: 'Express REST API with Prisma and PostgreSQL powering the offline-first sync queue for field use.',
        live: AGRI,
        proof: 'Offline-first sync API',
      },
    ],
  },

  REST: {
    tagline: 'Clean HTTP surfaces between products and integrations.',
    deployments: [
      {
        project: 'TedOS',
        role: 'REST surface for intake, onboarding and generation status across the multi-tenant SaaS.',
        live: TEDOS,
        proof: 'Multi-tenant API surface',
      },
      {
        project: 'Scalez Media',
        role: 'CRM, email and ad-network integrations stitched together over REST and webhooks.',
        live: null,
        proof: 'Cross-system integrations',
      },
    ],
  },

  'OAuth 2.0': {
    tagline: 'Token flows that removed hours of manual onboarding.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Built agency-level GoHighLevel OAuth 2.0 onboarding — authorization, token exchange, refresh and per-organisation scoping.',
        live: TEDOS,
        proof: 'Cut 8–12h manual setup per client',
      },
    ],
  },

  Webhooks: {
    tagline: 'Event-driven intake with delivery guarantees.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Webhook intake triggers the generation pipeline; deliveries tracked with retries and structured logging.',
        live: TEDOS,
        proof: 'Retry-tracked delivery',
      },
      {
        project: 'Scalez Media',
        role: 'Webhook-driven lead ingestion and CRM / ad-network synchronisation.',
        live: null,
        proof: 'Lead ingestion pipelines',
      },
    ],
  },

  Microservices: {
    tagline: 'Service boundaries that keep a solo-built SaaS maintainable.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Split onboarding, AI generation and automation fallbacks into independently deployable units with clean service boundaries.',
        live: TEDOS,
        proof: 'Independently deployable units',
      },
    ],
  },

  'Async queues': {
    tagline: 'Work deferred, retried and replayed — never dropped.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Generation jobs fan out through async queues with retries and n8n / Pabbly fail-safe fallbacks.',
        live: TEDOS,
        proof: '17+ jobs per intake fan-out',
      },
      {
        project: 'Agriculture Advisory',
        role: 'SQLite-backed offline sync queue that replays field writes to the server when connectivity returns.',
        live: AGRI,
        proof: 'Offline write replay',
      },
    ],
  },

  Prisma: {
    tagline: 'Typed data access with disciplined migrations.',
    deployments: [
      {
        project: 'Agriculture Advisory',
        role: 'Prisma ORM over PostgreSQL for the advisory API — schema design, migrations and typed queries.',
        live: AGRI,
        proof: 'Typed PostgreSQL access',
      },
    ],
  },

  /* ---------------- Automation & CRM ---------------- */

  'GoHighLevel API': {
    tagline: 'Deep GHL integration at agency level.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Agency OAuth 2.0 onboarding plus contact, pipeline and campaign sync against the GoHighLevel API.',
        live: TEDOS,
        proof: 'Cut 8–12h manual setup per client',
      },
      {
        project: 'Scalez Media',
        role: 'GHL-centred CRM automation connecting lead sources, email and ad systems.',
        live: null,
        proof: 'CRM automation backbone',
      },
    ],
  },

  n8n: {
    tagline: 'Self-hosted automation as a reliability layer.',
    deployments: [
      {
        project: 'TedOS',
        role: 'n8n fallback automations watching the pipeline — retries, alerts and structured logging when a primary job fails.',
        live: TEDOS,
        proof: 'Fail-safe fallback layer',
      },
    ],
  },

  'Make.com': {
    tagline: 'Scenario automation in client delivery work.',
    deployments: [
      {
        project: 'Scalez Media',
        role: 'Working proficiency — scenario-based CRM and email automations built during client automation work.',
        live: null,
        proof: 'Client automation work',
      },
    ],
  },

  Pabbly: {
    tagline: 'Redundant automation paths for critical flows.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Pabbly fallback flows paired with n8n so critical automations have a second, independent execution path.',
        live: TEDOS,
        proof: 'Redundant execution path',
      },
    ],
  },

  Zapier: {
    tagline: 'Quick bridges between SaaS tools when speed matters.',
    deployments: [
      {
        project: 'Scalez Media',
        role: 'Working proficiency — Zaps bridging lead sources into CRM and email systems in client work.',
        live: null,
        proof: 'Client automation work',
      },
    ],
  },

  /* ---------------- Languages & Data ---------------- */

  Python: {
    tagline: 'NLP and data pipelines in production.',
    deployments: [
      {
        project: 'Amazon Review Intelligence',
        role: 'Python NLP pipeline — VADER/TextBlob sentiment analysis, Apify scraping orchestration and graph construction.',
        live: ARI,
        proof: '10+ marketplaces',
      },
    ],
  },

  TypeScript: {
    tagline: 'Typed end to end across web and mobile.',
    deployments: [
      {
        project: 'Amazon Review Intelligence',
        role: 'Typed Next.js 14 front end — Sigma.js + Graphology network graph and Recharts dashboards.',
        live: ARI,
        proof: 'Graph + analytics UI',
      },
      {
        project: 'Agriculture Advisory',
        role: 'TypeScript across the Expo client and Redux Toolkit store.',
        live: AGRI,
        proof: 'Typed mobile codebase',
      },
    ],
  },

  JavaScript: {
    tagline: 'The connective tissue of everything shipped.',
    deployments: [
      {
        project: 'TedOS',
        role: 'JavaScript/Node end to end across the SaaS — API, generation jobs and third-party integrations.',
        live: TEDOS,
        proof: '690+ commits, sole developer',
      },
      {
        project: 'Crypto Tracker',
        role: 'React dashboard over the CoinGecko API with Recharts visualisations.',
        live: CRYPTO,
        proof: 'Live CoinGecko data',
      },
    ],
  },

  Go: {
    tagline: 'Active track toward systems work.',
    deployments: [
      {
        project: 'Self-directed systems work',
        role: 'Working proficiency — CLI tooling and service experiments, deepened through an active distributed-systems study track.',
        live: null,
        proof: 'Active learning track',
      },
    ],
  },

  SQL: {
    tagline: 'Schema design as a product decision.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Designed the multi-org schema — row-level security policies, PL/pgSQL migrations and tenancy-safe queries on Postgres.',
        live: TEDOS,
        proof: 'Multi-org tenancy schema',
      },
      {
        project: 'Agriculture Advisory',
        role: 'Relational modelling for advisory data behind the Express/Prisma API.',
        live: AGRI,
        proof: 'PostgreSQL data layer',
      },
    ],
  },

  'PL/pgSQL': {
    tagline: 'Logic pushed into the database where it belongs.',
    deployments: [
      {
        project: 'TedOS',
        role: 'PL/pgSQL migrations and row-level-security functions enforcing multi-org tenancy at the database layer.',
        live: TEDOS,
        proof: 'RLS enforced in-database',
      },
    ],
  },

  PostgreSQL: {
    tagline: 'The system of record for shipped products.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Postgres with row-level security for multi-org tenancy, managed through Supabase with PL/pgSQL migrations.',
        live: TEDOS,
        proof: 'RLS multi-org tenancy',
      },
      {
        project: 'Agriculture Advisory',
        role: 'PostgreSQL behind the Express/Prisma API serving the offline-first client.',
        live: AGRI,
        proof: 'Production data store',
      },
    ],
  },

  Supabase: {
    tagline: 'Postgres backbone for a multi-tenant SaaS.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Supabase as the Postgres backbone — RLS multi-org tenancy, PL/pgSQL migrations and auth wiring with Clerk sessions.',
        live: TEDOS,
        proof: 'Multi-org RLS tenancy',
      },
    ],
  },

  MySQL: {
    tagline: 'Relational work beyond Postgres.',
    deployments: [
      {
        project: 'Scalez Media',
        role: 'Working proficiency — relational stores in client automation and reporting work.',
        live: null,
        proof: 'Client data work',
      },
    ],
  },

  Redis: {
    tagline: 'Caching and queue patterns in backend work.',
    deployments: [
      {
        project: 'Scalez Media',
        role: 'Working proficiency — caching and rate-limit patterns applied in automation backends.',
        live: null,
        proof: 'Backend caching patterns',
      },
    ],
  },

  SQLite: {
    tagline: 'Embedded persistence for offline-first mobile.',
    deployments: [
      {
        project: 'Agriculture Advisory',
        role: 'SQLite offline-first store with a sync queue that replays field writes to the server when connectivity returns.',
        live: AGRI,
        proof: 'Offline-first sync queue',
      },
    ],
  },

  /* ---------------- Frontend & Infra ---------------- */

  React: {
    tagline: 'Interfaces that ship and sell.',
    deployments: [
      {
        project: 'MOON Naturally Yours',
        role: 'React storefront with structured-data SEO and a WhatsApp commerce flow.',
        live: MOON,
        proof: '1,200+ orders · 4.9★',
      },
      {
        project: 'Stellar Spaces',
        role: 'React 19 + Framer Motion property showcase built on Vite with React Router.',
        live: STELLAR,
        proof: 'React 19 in production',
      },
      {
        project: 'Crypto Tracker',
        role: 'Live market dashboard over the CoinGecko API with Recharts.',
        live: CRYPTO,
        proof: 'Live CoinGecko data',
      },
    ],
  },

  'Next.js': {
    tagline: 'The app framework behind the flagship products.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Next.js 14 application — multi-tenant dashboard, intake flows and Clerk-gated sessions.',
        live: TEDOS,
        proof: '690+ commits, sole developer',
      },
      {
        project: 'Amazon Review Intelligence',
        role: 'Next.js 14 + TypeScript front end with the Sigma.js network graph view.',
        live: ARI,
        proof: '10+ marketplaces',
      },
      {
        project: 'MOON Naturally Yours',
        role: 'Next.js storefront with structured-data SEO and Vercel edge delivery.',
        live: MOON,
        proof: '8,000+ customers',
      },
    ],
  },

  'React Native + Expo': {
    tagline: 'Offline-first mobile for the field.',
    deployments: [
      {
        project: 'Agriculture Advisory',
        role: 'Expo app with Redux Toolkit state and a SQLite offline-first sync queue, built for unreliable connectivity.',
        live: AGRI,
        proof: 'Offline-first field app',
      },
    ],
  },

  Tailwind: {
    tagline: 'Design systems delivered fast, kept consistent.',
    deployments: [
      {
        project: 'MOON Naturally Yours',
        role: 'Tailwind CSS design system across the commerce storefront.',
        live: MOON,
        proof: '1,200+ orders served',
      },
      {
        project: 'Stellar Spaces',
        role: 'Tailwind v4 paired with Framer Motion micro-interactions.',
        live: STELLAR,
        proof: 'Tailwind v4 build',
      },
    ],
  },

  AWS: {
    tagline: 'Cloud fundamentals, advanced track in progress.',
    deployments: [
      {
        project: 'Scalez Media',
        role: 'Working proficiency — deployment and storage services in client work; advanced track (RDS, SQS, ECS) in progress.',
        live: null,
        proof: 'Advanced track in progress',
      },
    ],
  },

  Vercel: {
    tagline: 'Default production target for web work.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Production deployment with preview branches and environment-scoped configuration.',
        live: TEDOS,
        proof: 'Production SaaS hosting',
      },
      {
        project: 'MOON Naturally Yours',
        role: 'Storefront hosting and edge delivery for the commerce site.',
        live: MOON,
        proof: '1,200+ orders served',
      },
    ],
  },

  Docker: {
    tagline: 'Containerised services with automated delivery.',
    deployments: [
      {
        project: 'Amazon Review Intelligence',
        role: 'Dockerised FastAPI service with a CI/CD pipeline building and shipping on push.',
        live: ARI,
        proof: 'CI/CD container pipeline',
      },
    ],
  },

  'Git / GitHub Actions': {
    tagline: 'Disciplined history and automated checks, solo or not.',
    deployments: [
      {
        project: 'TedOS',
        role: 'Solo-maintained repository — disciplined commit history, CI checks and Vitest critical-path coverage.',
        live: TEDOS,
        proof: '690+ commits, sole developer',
      },
      {
        project: 'Amazon Review Intelligence',
        role: 'CI/CD with Docker builds running on every push.',
        live: ARI,
        proof: 'Automated build + deploy',
      },
    ],
  },
};

export default techUsage;
