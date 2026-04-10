export const profile = {
  name: 'Waris Rawa',
  brand: 'Technolity',
  role: 'Full-stack engineer with a backend focus',
  summary:
    'Building production-grade SaaS platforms, API orchestration layers, and AI-integrated systems.',
  location: 'Sopore, Jammu & Kashmir, India',
  email: 'warisrawa145@gmail.com',
  linkedin: 'https://linkedin.com/in/waris-rawa-41959a216',
  github: 'https://github.com/technolity',
  resume: '/Waris_Rawa.pdf',
};

export const heroHighlights = [
  'Multi-tenant SaaS',
  'OAuth + webhooks',
  'AI automation pipelines',
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
    title: 'AI Marketing Automation',
    category: 'Production SaaS',
    description:
      'A multi-tenant marketing automation SaaS built end to end with agency onboarding, AI content generation, and resilient backend workflows.',
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
      'Agency-level OAuth onboarding with token refresh and value mapping.',
      '17+ AI asset-generation jobs with structured JSON parsing.',
      '690+ commits and production deployment on Vercel.',
    ],
    posterEyebrow: 'TedOS / Scalez Media',
    posterMetric: '690+ commits shipped',
    liveUrl: 'https://dev.tedos.ai',
    repoUrl: 'https://github.com/Technolity/ai-marketing-automation',
  },
  {
    id: 'agriculture-advisory',
    title: 'Agriculture Advisory',
    category: 'Hackathon Build',
    description:
      'An offline-capable crop disease detection system for smallholder farmers in Kashmir with backend, mobile, and sync architecture built together.',
    stack: [
      'Node.js',
      'Express',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Redis',
      'React Native + Expo',
      'SQLite',
    ],
    highlights: [
      'Built for Cursor Hackathon 2026.',
      'Offline-to-online sync queue for data consistency.',
      'REST API plus mobile and web architecture in one system.',
      'Multilingual support across English, Urdu, and Punjabi.',
    ],
    posterEyebrow: 'Cursor Hackathon 2026',
    posterMetric: 'Offline-first sync design',
    repoUrl: 'https://github.com/Technolity/agriculture-advisory',
  },
  {
    id: 'crypto-tracker',
    title: 'Crypto Tracker',
    category: 'Real-time Dashboard',
    description:
      'A responsive crypto market dashboard with live data polling, historical charts, and a persistent watchlist.',
    stack: ['React', 'JavaScript', 'CoinGecko API', 'Recharts'],
    highlights: [
      'Real-time market dashboard with clean dark UI.',
      'Historical chart views and watchlist persistence.',
      'Responsive layout for desktop and mobile browsing.',
    ],
    image: '/images/project2.png',
    posterEyebrow: 'Market Data UI',
    posterMetric: 'Live polling + charts',
    liveUrl: 'https://crypto-tracker-indol-alpha.vercel.app/',
    repoUrl: 'https://github.com/Technolity/Crypto-Tracker',
  },
  {
    id: 'amazon-review-intelligence',
    title: 'Amazon Review Intelligence',
    category: 'Analytics Platform',
    description:
      'An analytics workflow for turning Amazon reviews into sentiment signals, keyword clusters, and actionable product insights.',
    stack: ['Python', 'TypeScript', 'Apify'],
    highlights: [
      'Sentiment analysis, keyword extraction, and emotion detection.',
      'Real-time review insight generation with clear visual outputs.',
      'Focused on turning raw review volume into usable product feedback.',
    ],
    posterEyebrow: 'Review Analytics',
    posterMetric: 'Insight extraction at scale',
    liveUrl: 'https://amazon-review-intelligence.vercel.app/',
    repoUrl: 'https://github.com/Technolity/amazon-review-intelligence',
  },
];

export const stackGroups = [
  {
    title: 'Backend & API',
    description:
      'The systems work I spend most of my time in when products need durable integrations and clean service boundaries.',
    skills: [
      'Node.js',
      'Next.js API Routes',
      'Express.js',
      'REST API design',
      'OAuth 2.0',
      'Webhooks',
      'Microservice patterns',
      'Async queues',
      'Prisma ORM',
    ],
  },
  {
    title: 'Frontend & Product',
    description:
      'Delivery-focused UI work with modern React stacks and enough polish to ship public-facing product surfaces cleanly.',
    skills: [
      'React 18',
      'Next.js 14',
      'React Native + Expo',
      'Tailwind CSS',
      'Framer Motion',
      'Redux Toolkit',
      'Recharts',
      'TypeScript',
    ],
  },
  {
    title: 'Data & Storage',
    description:
      'Database-backed applications with practical schema design, caching, and persistence choices based on the product shape.',
    skills: [
      'PostgreSQL',
      'MySQL',
      'Supabase',
      'Redis',
      'SQLite',
      'Airtable',
      'PL/pgSQL',
      'NoSQL patterns',
    ],
  },
  {
    title: 'AI & Automation',
    description:
      'Production-minded AI integrations where outputs are structured, traceable, and useful inside a real workflow.',
    skills: [
      'Anthropic Claude API',
      'OpenAI API',
      'Prompt engineering',
      'Structured output parsing',
      'LLM orchestration',
      'n8n',
      'Make.com',
      'GoHighLevel API',
      'Pabbly',
    ],
  },
  {
    title: 'Testing & Delivery',
    description:
      'The supporting tooling that keeps integration-heavy projects stable enough to iterate on without guesswork.',
    skills: [
      'Vitest',
      'Jest',
      'Postman',
      'ESLint',
      'Git',
      'GitHub Actions',
      'Vercel',
      'Render',
      'Linux / Ubuntu',
      'Docker (basics)',
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
    company: 'TedOS · Scalez Media AI Marketing Automation SaaS',
    summary:
      'Owned the backend architecture and product delivery for a multi-tenant marketing automation SaaS, from schema design through deployment.',
    achievements: [
      'Architected the full backend in Next.js 14 and Node.js, including data model design, database schema decisions, API orchestration, and Vercel deployment.',
      'Implemented agency-level GoHighLevel OAuth 2.0 flows for sub-account provisioning, permission scoping, refresh cycles, and custom value mapping.',
      'Designed a microservice-style pipeline that ingests 20 structured intake fields and triggers 17+ AI generation jobs for sales, email, VSL, and funnel assets.',
      'Integrated Supabase with row-level security for multi-org tenancy and Clerk for session management, including PL/pgSQL migrations as requirements evolved.',
      'Added fallback automation flows, structured logging, retry logic, and Vitest coverage across critical backend modules.',
    ],
  },
  {
    period: '2024 - Present',
    title: 'Backend & Automation Developer',
    company: 'Scalez Media Growth & Automation Agency',
    summary:
      'Built automation-heavy backend flows connecting CRM, email, and ad systems across active client pipelines.',
    achievements: [
      'Developed server-side automation workflows across CRM platforms, email providers, and ad networks using REST APIs and webhook event handling.',
      'Integrated Anthropic Claude and OpenAI APIs into content pipelines with prompt templates and structured JSON parsers for downstream services.',
      'Built lead ingestion, deduplication, and enrichment modules that reduced pipeline errors across multiple client accounts.',
    ],
  },
  {
    period: '2023 - 2024',
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
  'I work best on products where the hard part is not the landing page, but the system underneath it: auth, orchestration, state, data models, and the edge cases that appear when real users start depending on it.',
  'Most of my recent work has been in SaaS backends, automation-heavy workflows, and AI-assisted product systems. I care about getting the core architecture right early so iteration later stays fast instead of fragile.',
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
