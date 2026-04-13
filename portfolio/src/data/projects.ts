import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'gamehub',
    title: 'GameHub',
    shortSummary: 'Gaming meets artistry. A curated selection of classic and new games with stunning visuals and elegant design.',
    description: 'GameHub is a client-heavy Next.js 15 application that aggregates classic puzzle and logic games. The architecture emphasizes fast iteration, UI responsiveness, and reusable game logic modules.',
    technologies: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS'] as const,
    screenshots: [
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_06_17_PM.png',
        alt: '2048 game screen',
        caption: '2048 game screen',
      },
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_06_25_PM.png',
        alt: 'Honeycomb game screen',
        caption: 'Honeycomb game screen',
      },
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_09_01_PM.png',
        alt: 'Numble game screen',
        caption: 'Numble game screen',
      },
    ] as const,
    links: [
      {
        label: 'Visit Live Site',
        url: 'https://game-hub-one-brown.vercel.app/',
      },
    ] as const,
    dockLabel: 'GameHub',
    dockIcon: '🎮',
  },
  {
    id: 'cryptopro',
    title: 'CryptoPro Exchange',
    shortSummary: 'Privacy-focused crypto platform with Tor network support. Full-stack architecture with web, mobile, and backend services.',
    description: 'A multi-currency trading platform that supports wallets, swaps, liquidity pools, and user management across a centralized backend, a Next.js frontend, and a React Native mobile app.',
    technologies: ['Next.js 15', 'Node.js', 'React Native', 'TypeScript', 'Blockchain RPC'] as const,
    screenshots: [
      {
        src: '/projects/crypto-main-page.png',
        alt: 'CryptoPro landing page',
        caption: 'Marketing landing page with featured markets',
      },
      {
        src: '/projects/crypto-dashboard.png',
        alt: 'CryptoPro dashboard',
        caption: 'User dashboard with wallets and portfolio overview',
      },
    ] as const,
    links: [
      {
        label: 'Mirror link',
        url: 'https://crypto-exchange-k3omfqyaq-malore350s-projects.vercel.app/',
      },
    ] as const,
    dockLabel: 'CryptoPro',
    dockIcon: '💰',
  },
  {
    id: 'unigo',
    title: 'Unigo.az',
    shortSummary: 'Comprehensive university consultancy platform for finding universities and managing applications.',
    description: 'A comprehensive university consultancy platform designed to help students find universities, manage applications, and schedule consultations via a modern monorepo architecture.',
    technologies: ['React', 'Node.js', 'Supabase', 'React Native', 'TypeScript'] as const,
    screenshots: [
      {
        src: '/projects/unigo-home.png',
        alt: 'Unigo Landing Page',
        caption: 'Unigo Landing Page - Gateway to Global Universities',
      },
      {
        src: '/projects/unigo-dashboard.png',
        alt: 'Unigo Dashboard',
        caption: 'Student Dashboard - AI-powered University Suggestions',
      },
    ] as const,
    links: [
      {
        label: 'Visit Live Site',
        url: 'https://unigo.az',
      },
    ] as const,
    dockLabel: 'Unigo',
    dockIcon: '🎓',
  },
  {
    id: 'ttyt',
    title: 'ttyt - Terminal Assistant',
    shortSummary: 'AI-powered terminal companion that translates natural language into safe, executable shell commands with smart safety controls.',
    description: 'ttyt is a Python-based CLI wrapper that uses advanced LLMs to bridge the gap between human intent and terminal commands. It features a three-tier safety classifier and autonomous task execution with intelligent error recovery.',
    technologies: ['Python 3.8+', 'Google Gemini', 'Z.ai', 'OpenRouter', 'Cross-platform'] as const,
    screenshots: [
      {
        src: '/projects/ttyt-terminal.png',
        alt: 'Terminal interface showing natural language commands',
        caption: 'Natural language terminal interaction',
      },
      {
        src: '/projects/ttyt-models.png',
        alt: 'AI model selection menu',
        caption: 'Multi-provider AI model selection',
      },
      {
        src: '/projects/ttyt-agent.png',
        alt: 'Agent mode executing tasks autonomously',
        caption: 'Autonomous agentic mode with error recovery',
      },
    ] as const,
    links: [
      {
        label: 'Visit Live Site',
        url: 'https://ttyt-website.vercel.app/',
      },
      {
        label: 'View on GitHub',
        url: 'https://github.com/malore350/ttyt',
      },
    ] as const,
    dockLabel: 'ttyt',
    dockIcon: '🖥️',
  },
];