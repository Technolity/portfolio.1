export const profile = {
  name: 'Waris Rawa',
  brand: 'Technolity',
  role: 'Full-Stack & AI Systems Engineer — Backend & Automation',
  headline: 'I build production software that moves real revenue.',
  summary:
    'Backend & AI engineer building production SaaS, AI-agent pipelines, CRM automation, and revenue-driving web apps.',
  location: 'Sopore, Jammu & Kashmir, India',
  email: 'warisrawa145@gmail.com',
  phone: '+91-8493064813',
  linkedin: 'https://linkedin.com/in/waris-rawa',
  github: 'https://github.com/technolity',
  x: 'https://x.com/technolity_',
  website: 'https://portfoliowaris.vercel.app',
  resume: '/Waris_Rawa_Resume.pdf',
};

export const heroHighlights = [
  'Multi-tenant SaaS',
  'OAuth + webhooks',
  'AI automation pipelines',
];

export const heroMetrics = [
  { value: '$M+', label: 'revenue powered' },
  { value: '17+', label: 'AI jobs/session' },
  { value: '8–12h', label: 'onboarding cut' },
  { value: '8,000+', label: 'customers' },
  { value: '690+', label: 'commits' },
];

export const services = [
  {
    title: 'SaaS Backend Architecture',
    description:
      'Multi-tenant services, auth flows, clean data models, and API orchestration for products that need to ship fast without turning brittle.',
    points: [
      'Next.js 14 and Node.js service layers',
      'PostgreSQL schemas, RLS, and PL/pgSQL migrations',
      'OAuth 2.0, webhooks, and third-party integration design',
    ],
    tech: ['Node.js', 'Next.js 14', 'PostgreSQL', 'Supabase', 'Clerk'],
  },
  {
    title: 'Automation & AI Pipelines',
    description:
      'Workflow systems that turn structured inputs into usable outputs with guardrails, retries, and clear failure handling.',
    points: [
      'Structured generation flows with Anthropic and OpenAI',
      'n8n and Pabbly fallback automations',
      'Prompt templates, parsers, and logging for production use',
    ],
    tech: ['Anthropic', 'OpenAI', 'n8n', 'Pabbly', 'Vitest'],
  },
  {
    title: 'Full-stack Product Delivery',
    description:
      'Backend-heavy products with responsive interfaces, practical performance work, and deployment ownership from day one.',
    points: [
      'React and Next.js frontends with clean data boundaries',
      'Caching and async data strategies for critical routes',
      'Deployment on Vercel and Render with operational follow-through',
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Render'],
  },
];

export const featuredProjects = [
  {
    id: 'ai-marketing-automation',
    title: 'TedOS — AI Marketing Automation',
    category: 'Flagship · Production SaaS',
    description:
      'Multi-tenant AI marketing SaaS I architected and built end to end — agency OAuth onboarding, a 20-field intake pipeline that fires 17+ Claude AI generation jobs, and resilient backend workflows powering millions in revenue for its founder.',
    stack: [
      'Next.js 14',
      'Node.js',
      'Supabase',
      'PL/pgSQL',
      'Clerk',
      'Anthropic API',
      'GoHighLevel API',
      'n8n',
      'Vitest',
    ],
    highlights: [
      'Sole developer on the TedOS backend and delivery pipeline.',
      'Agency-level GoHighLevel OAuth 2.0 onboarding with token refresh.',
      '20 intake fields → 17+ Claude AI jobs with structured JSON parsing.',
      '690+ commits, Postgres RLS multi-tenancy, deployed on Vercel.',
    ],
    posterEyebrow: 'TedOS / Scalez Media',
    posterMetric: '$M+ revenue · 690+ commits',
    liveUrl: 'https://dev.tedos.ai',
    repoUrl: 'https://github.com/Technolity/ai-marketing-automation',
  },
  {
    id: 'amazon-review-intelligence',
    title: 'Amazon Review Intelligence',
    category: 'Production AI SaaS',
    description:
      'Production AI SaaS that turns thousands of Amazon reviews into an interactive network graph of themes, keywords, and sentiment — with NLP sentiment analysis, bot detection, and multi-format export across 10+ marketplaces.',
    stack: [
      'FastAPI',
      'Python',
      'Next.js 14',
      'TypeScript',
      'Sigma.js',
      'Graphology',
      'Recharts',
      'VADER/TextBlob',
      'Apify',
      'Docker',
    ],
    highlights: [
      'NLP sentiment analysis across 10+ Amazon marketplaces.',
      'Bot/fake-review detection with real-time analysis.',
      'Multi-format export — CSV, PDF, Excel.',
      'Dockerized with CI/CD.',
    ],
    posterEyebrow: 'Review Intelligence',
    posterMetric: 'Reviews → network graph',
    liveUrl: 'https://amazon-review-intelligence.vercel.app/',
    repoUrl: 'https://github.com/Technolity/Amazon_V1',
  },
  {
    id: 'moon-naturally-yours',
    title: 'MOON Naturally Yours',
    category: 'D2C E-commerce',
    description:
      'Premium, mobile-first Next.js storefront for a Kashmiri D2C brand — full structured-data SEO and WhatsApp commerce that scaled the brand to 1,200+ orders and 8,000+ customers at a 4.9★ rating.',
    stack: [
      'Next.js',
      'React',
      'Structured-data SEO',
      'WhatsApp Commerce',
      'Tailwind CSS',
      'Vercel',
    ],
    highlights: [
      'Premium mobile-first storefront with full structured-data SEO.',
      'WhatsApp commerce as the primary checkout path.',
      '1,200+ orders, 8,000+ customers, 4.9★ rating.',
    ],
    posterEyebrow: 'D2C Storefront',
    posterMetric: '1,200+ orders · 8,000+ customers',
    liveUrl: 'https://moonnaturallyyours.com',
    repoUrl: 'https://github.com/technolity/moon',
  },
  {
    id: 'agriculture-advisory',
    title: 'Agricultural Advisory App',
    category: 'Mobile / Offline-First',
    description:
      'Offline-first mobile app for smallholder farmers: camera-based crop-disease detection, planting guides, live market prices, and a sync queue that works without internet. Multilingual (English / Urdu / Punjabi).',
    stack: [
      'React Native',
      'Expo',
      'TypeScript',
      'Redux Toolkit',
      'SQLite',
      'Node.js',
      'Express',
      'Prisma',
      'PostgreSQL',
    ],
    highlights: [
      'Camera-based crop-disease detection.',
      'Offline-first with a background sync queue.',
      'Live market prices and planting guides.',
      'Built for Cursor Hackathon 2026.',
    ],
    posterEyebrow: 'Cursor Hackathon 2026',
    posterMetric: 'Offline-first sync',
    liveUrl: 'https://agriculture-advisory.vercel.app/',
    repoUrl: 'https://github.com/Technolity/agriculture-advisory',
  },
  {
    id: 'stellar-spaces',
    title: 'Stellar Spaces',
    category: 'Web Experience',
    description:
      'Design-forward, animation-rich multi-page web experience with motion-driven interactions, smooth route transitions, and a fully responsive layout that showcases polished front-end craft.',
    stack: ['React 19', 'Framer Motion', 'Tailwind CSS v4', 'Vite', 'React Router'],
    highlights: [
      'Motion-driven interactions throughout.',
      'Smooth multi-page route transitions.',
      'Fully responsive, mobile-first layout.',
    ],
    posterEyebrow: 'Motion-Driven UI',
    posterMetric: 'Animation-rich experience',
    liveUrl: 'https://stellar-spaces.netlify.app/',
    repoUrl: 'https://github.com/Technolity/stellar_spaces',
  },
  {
    id: 'crypto-tracker',
    title: 'Crypto Tracker',
    category: 'Real-time Dashboard',
    description:
      'Real-time cryptocurrency dashboard with live prices, interactive 7-day charts, multi-currency support (USD/EUR/GBP/INR), search, a persistent watchlist, and dark mode.',
    stack: ['React', 'CoinGecko API', 'Recharts'],
    highlights: [
      'Live prices with interactive 7-day charts.',
      'Multi-currency: USD / EUR / GBP / INR.',
      'Persistent watchlist + search + dark mode.',
    ],
    posterEyebrow: 'Market Data UI',
    posterMetric: 'Live prices + charts',
    liveUrl: 'https://crypto-tracker-indol-alpha.vercel.app/',
    repoUrl: 'https://github.com/Technolity/Crypto-Tracker',
  },
];

export const stackGroups = [
  {
    title: 'AI & LLMs',
    description:
      'Production AI integrations where outputs are structured, traceable, and useful inside a real workflow.',
    skills: [
      'Anthropic Claude API',
      'OpenAI API',
      'AI agent workflows',
      'RAG',
      'Structured output parsing',
      'LLM orchestration',
    ],
  },
  {
    title: 'Backend & API',
    description:
      'The systems work I spend most of my time in when products need durable integrations and clean service boundaries.',
    skills: [
      'FastAPI',
      'Node.js',
      'Express',
      'REST',
      'OAuth 2.0',
      'Webhooks',
      'Microservices',
      'Async queues',
      'Prisma',
    ],
  },
  {
    title: 'Automation & CRM',
    description:
      'Workflow tooling that connects CRM, email, and ad systems into reliable end-to-end pipelines.',
    skills: ['GoHighLevel API', 'n8n', 'Make.com', 'Pabbly', 'Zapier'],
  },
  {
    title: 'Languages & Data',
    description:
      'The languages and data layers behind the products, with practical schema and persistence choices.',
    skills: [
      'Python',
      'TypeScript',
      'JavaScript',
      'Go',
      'SQL',
      'PL/pgSQL',
      'PostgreSQL',
      'Supabase',
      'MySQL',
      'Redis',
      'SQLite',
    ],
  },
  {
    title: 'Frontend & Infra',
    description:
      'Delivery-focused UI work and the deployment tooling that keeps it shipping cleanly to production.',
    skills: [
      'React',
      'Next.js',
      'React Native + Expo',
      'Tailwind',
      'AWS',
      'Vercel',
      'Docker',
      'Git / GitHub Actions',
    ],
  },
];

export const learningNow = [
  'Golang',
  'ElasticSearch',
  'Cassandra',
  'Distributed systems',
  'AWS advanced (RDS, SQS, ECS)',
];

export const experiences = [
  {
    period: '2024 - Present',
    title: 'Lead Backend Developer',
    company: 'TedOS · Scalez Media',
    summary:
      'Sole developer on a multi-tenant AI marketing SaaS, from schema design through production deployment.',
    achievements: [
      'Built agency-level GoHighLevel OAuth 2.0 onboarding that cut 8–12 hours of manual setup per client.',
      'Designed a pipeline that turns 20 structured intake fields into 17+ Claude AI generation jobs for sales, email, VSL, and funnel assets.',
      'Implemented Postgres row-level security for multi-org tenancy with n8n / Pabbly fallback automations.',
      'Shipped 690+ commits with structured logging, retries, and test coverage across critical backend modules.',
    ],
  },
  {
    period: '2025 - Present',
    title: 'Full-Stack & SEO',
    company: 'MOON Naturally Yours',
    summary:
      'Premium, mobile-first Next.js storefront for a Kashmiri D2C brand with full structured-data SEO and WhatsApp commerce.',
    achievements: [
      'Built a premium mobile-first Next.js storefront with full structured-data SEO.',
      'Integrated WhatsApp commerce as the primary checkout path.',
      'Scaled the brand to 1,200+ orders, 8,000+ customers, and a 4.9★ rating.',
    ],
  },
  {
    period: '2024 - Present',
    title: 'Backend & Automation Developer',
    company: 'Scalez Media Growth & Automation Agency',
    summary:
      'Automation-heavy backend flows connecting CRM, email, and ad systems across active client pipelines.',
    achievements: [
      'Built Claude + OpenAI content pipelines with prompt templates and structured JSON parsers.',
      'Developed lead ingestion, deduplication, and enrichment modules across client accounts.',
      'Automated CRM, email, and ad-network workflows via REST APIs and webhooks.',
    ],
  },
  {
    period: '2022 - 2024',
    title: 'Full-Stack Developer (Freelance)',
    company: 'Independent Web & SaaS Projects',
    summary:
      'Delivered client-facing applications with clear separation between data and UI layers, leaning on practical performance and maintainability.',
    achievements: [
      'Shipped client web applications in Next.js, TypeScript, and Tailwind CSS with maintainable frontends and clean backend boundaries.',
      'Integrated external REST APIs, implemented async data-fetching patterns, and applied server-side caching strategies for performance-critical routes.',
    ],
  },
];

export const aboutParagraphs = [
  'Backend & AI engineer. Sole architect of TedOS, a multi-tenant AI marketing SaaS powering millions in revenue for its founder, and builder of MOON, an SEO-led D2C storefront that scaled a Kashmiri brand to 1,200+ orders and 8,000+ customers.',
  'I turn a non-technical founder\'s "I wish my business just ran itself" into working systems — FastAPI / Node backends, OAuth integrations, LLM agent pipelines, CRM automation, and revenue-ready frontends.',
  'Alongside shipping products, I am pursuing a B.Sc. in Computer Science at the University of Kashmir, strengthening the fundamentals behind the production work.',
];

export const principles = [
  {
    title: 'Backend-first thinking',
    description: 'Start from the data model, the integration boundaries, and the failure paths before dressing the UI.',
  },
  {
    title: 'Automation with guardrails',
    description: 'AI and workflow tooling should remove repetitive work without hiding system behavior.',
  },
  {
    title: 'Operational clarity',
    description: 'Logging, retries, sensible schemas, and test coverage matter more than clever abstractions.',
  },
  {
    title: 'Ship end to end',
    description: 'I prefer owning the whole product path from architecture through deployment and iteration.',
  },
];

export const education = {
  title: 'B.Sc. Computer Science',
  institution: 'University of Kashmir',
  period: '08/2024 - 11/2028',
  description:
    'Formal CS fundamentals in algorithms, data structures, operating systems, DBMS, and networking alongside active product development.',
};

export const automationWorkflow = {
  eyebrow: 'Automation, visualized',
  title: 'The Pipeline',
  caption: 'Modeled on TedOS — the production system, not a mockup.',
  stats: [
    '17+ AI jobs per intake',
    '8–12h onboarding → minutes',
    '690+ commits in production',
  ],
  nodes: [
    {
      id: 'intake',
      label: 'Client Intake',
      sublabel: 'Webhook · 20 fields',
      icon: 'webhook',
      col: 0,
      row: 1,
      type: 'trigger',
    },
    {
      id: 'validate',
      label: 'Validate',
      sublabel: 'Schema · type guards',
      icon: 'filter',
      col: 1,
      row: 1,
      type: 'data',
    },
    {
      id: 'router',
      label: 'Job Router',
      sublabel: '17+ jobs fan-out',
      icon: 'route',
      col: 2,
      row: 1,
      type: 'data',
    },
    {
      id: 'ai-copy',
      label: 'Sales Copy',
      sublabel: 'Claude · sales pages',
      icon: 'sparkle',
      col: 3,
      row: 0,
      type: 'ai',
    },
    {
      id: 'ai-email',
      label: 'Email Sequences',
      sublabel: 'Claude · sequences',
      icon: 'mail',
      col: 3,
      row: 1,
      type: 'ai',
    },
    {
      id: 'ai-vsl',
      label: 'VSL & Funnels',
      sublabel: 'Claude · VSL scripts',
      icon: 'film',
      col: 3,
      row: 2,
      type: 'ai',
    },
    {
      id: 'parse',
      label: 'Parse JSON',
      sublabel: 'JSON contract · retry',
      icon: 'braces',
      col: 4,
      row: 1,
      type: 'data',
    },
    {
      id: 'store',
      label: 'Supabase',
      sublabel: 'Postgres · RLS',
      icon: 'database',
      col: 5,
      row: 1,
      type: 'data',
    },
    {
      id: 'logs',
      label: 'Run Ledger',
      sublabel: 'Job status · audit',
      icon: 'pulse',
      col: 5,
      row: 2,
      type: 'data',
    },
    {
      id: 'ghl',
      label: 'GoHighLevel',
      sublabel: 'CRM sync · OAuth 2.0',
      icon: 'plug',
      col: 6,
      row: 0,
      type: 'integration',
    },
    {
      id: 'fallback',
      label: 'n8n / Pabbly',
      sublabel: 'Fallback · retries',
      icon: 'repeat',
      col: 6,
      row: 2,
      type: 'integration',
    },
    {
      id: 'deliver',
      label: 'Assets Delivered',
      sublabel: 'Client live · 60 min',
      icon: 'send',
      col: 7,
      row: 1,
      type: 'output',
    },
  ],
  edges: [
    { from: 'intake', to: 'validate' },
    { from: 'validate', to: 'router' },
    { from: 'router', to: 'ai-copy' },
    { from: 'router', to: 'ai-email' },
    { from: 'router', to: 'ai-vsl' },
    { from: 'ai-copy', to: 'parse' },
    { from: 'ai-email', to: 'parse' },
    { from: 'ai-vsl', to: 'parse' },
    { from: 'parse', to: 'store' },
    { from: 'parse', to: 'logs' },
    { from: 'store', to: 'ghl' },
    { from: 'logs', to: 'fallback' },
    { from: 'ghl', to: 'deliver' },
    { from: 'fallback', to: 'deliver' },
  ],
};
