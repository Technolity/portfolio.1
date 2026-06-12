/* ============================================================
   PROJECT INTRO POSTERS — per-project animated intro data
   Keyed by featuredProjects id. Consumed by ProjectIntroPoster.
   All bases near-black to sit inside the dark editorial system;
   accents glow but stay restrained.
   pace > 1 slows the whole timeline (luxury pacing).
   ============================================================ */

export const projectIntros = {
  'ai-marketing-automation': {
    bg: '#07090B',
    accent: '#2DD4A7',
    accentSoft: 'rgba(45, 212, 167, 0.14)',
    eyebrow: 'AI Business Operator',
    displayTitle: 'TedOS',
    tagline: 'Answer 20 questions. Walk away with a deployed system.',
    metricValue: '$M+',
    metricLabel: 'Revenue powered',
    motif: 'pipeline',
    pace: 1,
  },

  'amazon-review-intelligence': {
    bg: '#0B0905',
    accent: '#FF9F45',
    accentSoft: 'rgba(255, 159, 69, 0.11)',
    eyebrow: 'Review Intelligence',
    displayTitle: 'Review Graph',
    tagline: 'Thousands of reviews, one navigable graph.',
    metricValue: '10+',
    metricLabel: 'Marketplaces analyzed',
    motif: 'network',
    pace: 1,
  },

  'moon-naturally-yours': {
    bg: '#0A0805',
    accent: '#C9A227',
    accent2: '#C8102E',
    accentSoft: 'rgba(201, 162, 39, 0.12)',
    eyebrow: 'Naturally Yours',
    displayTitle: 'MOON',
    tagline: 'Curated by origin, not by trend.',
    metricValue: '1,200+',
    metricLabel: 'Orders · 4.9★ rating',
    motif: 'moon',
    pace: 1.3,
  },

  'agriculture-advisory': {
    bg: '#060906',
    accent: '#4CAF7D',
    accentSoft: 'rgba(76, 175, 125, 0.12)',
    eyebrow: 'Field Advisory',
    displayTitle: 'Agri Advisory',
    tagline: 'Crop intelligence that works without a signal.',
    metricValue: 'Offline-first',
    metricLabel: 'Sync architecture',
    motif: 'sync',
    pace: 1,
  },

  'stellar-spaces': {
    bg: '#05080A',
    accent: '#6FB7C9',
    accentSoft: 'rgba(111, 183, 201, 0.12)',
    eyebrow: 'Web Experience',
    displayTitle: 'Stellar Spaces',
    tagline: 'Architecture, drawn in motion.',
    metricValue: 'Motion-driven',
    metricLabel: 'Interface design',
    motif: 'blueprint',
    pace: 1,
  },

  'crypto-tracker': {
    bg: '#060808',
    accent: '#16C784',
    accent2: '#EA3943',
    accentSoft: 'rgba(22, 199, 132, 0.11)',
    eyebrow: 'Real-Time Dashboard',
    displayTitle: 'Crypto Tracker',
    tagline: 'Every tick, charted live.',
    metricValue: 'Live',
    metricLabel: 'Market data',
    motif: 'chart',
    pace: 1,
  },
};

export default projectIntros;
