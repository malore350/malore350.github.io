import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'gamehub',
    title: 'GameHub',
    shortSummary: 'Gaming meets artistry. A curated selection of classic and new games with stunning visuals and elegant design.',
    description: 'GameHub is a client-heavy Next.js 15 application that aggregates classic puzzle and logic games. The architecture emphasizes fast iteration, UI responsiveness, and reusable game logic modules.\n\nCore Stack:\n• Framework: Next.js 15 (App Router) + React 18\n• Styling: Tailwind CSS + Radix UI Primitives\n• Animations: Framer Motion for fluid state transitions\n• Logic: Strict TypeScript with client-side puzzle generation\n\nKey Features:\n• 7+ self-contained logic and word games\n• Dynamic dark/light mode with game-specific themes\n• Mobile-first controls with specialized input pads\n• Zero-dependency internal state management',
    technologies: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI'] as const,
    screenshots: [
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_09_06_PM.png',
        alt: 'GameHub main page',
        caption: 'GameHub main page',
        orientation: 'landscape',
      },
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_06_17_PM.png',
        alt: '2048 game screen',
        caption: '2048 game screen',
        orientation: 'landscape',
      },
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_06_25_PM.png',
        alt: 'Honeycomb game screen',
        caption: 'Honeycomb game screen',
        orientation: 'landscape',
      },
      {
        src: '/projects/GameHub-Classic-Games-01-22-2025_09_01_PM.png',
        alt: 'Numble game screen',
        caption: 'Numble game screen',
        orientation: 'landscape',
      },
    ] as const,
    links: [
      {
        label: 'Visit Live Site',
        url: 'https://game-hub-one-brown.vercel.app/',
      },
    ] as const,
    dockLabel: 'GameHub',
    dockIcon: 'Gamepad2',
  },
  {
    id: 'cryptopro',
    title: 'CryptoPro Exchange',
    shortSummary: 'Privacy-focused crypto platform with Tor network support. Full-stack architecture with web, mobile, and backend services.',
    description: 'A multi-currency trading platform that supports wallets, swaps, liquidity pools, and user management across a centralized backend, a Next.js frontend, and a React Native mobile app.\n\nTechnical Architecture:\nBuilt as a high-security full-stack system. The backend handles blockchain integrations and data persistence, while the frontend provides a responsive trading UX.\n\nCore Stack:\n• Backend: Node.js + Express.js (JWT auth)\n• Database: Dual-support for MongoDB & MySQL\n• Web: Next.js 15 (App Router) + shadcn/ui\n• Mobile: React Native + Expo SDK 54\n\nSecurity & Operations:\n• Authentication: 2FA (Speakeasy) + Secondary PIN\n• Price Data: Binance API via secure proxy\n• Infrastructure: node-cron + Mailgun integration\n• Privacy: Tor network hosting & censorship resistance\n\nBlockchain Implementation:\n• Bitcoin: Direct RPC (JSON-RPC)\n• Ethereum: Web3.js via Alchemy\n• Privacy Coins: Monero/Zcash Daemon RPC\n• Alt-Chains: Tron/Dash wallet logic',
    technologies: ['Next.js 15', 'Node.js', 'Express.js', 'React Native', 'TypeScript', 'MongoDB', 'MySQL', 'Web3.js', 'Blockchain RPC', 'Expo', 'Tor'] as const,
    screenshots: [
      {
        src: '/projects/crypto-main-page.png',
        alt: 'CryptoPro landing page',
        caption: 'Marketing landing page with featured markets',
        orientation: 'landscape',
      },
      {
        src: '/projects/crypto-dashboard.png',
        alt: 'CryptoPro dashboard',
        caption: 'User dashboard with wallets and portfolio overview',
        orientation: 'landscape',
      },
      {
        src: '/projects/crypto-mobile-assets.jpg',
        alt: 'CryptoPro Mobile Assets',
        caption: 'Mobile wallet asset overview',
        orientation: 'portrait',
      },
      {
        src: '/projects/crypto-mobile-markets.jpg',
        alt: 'CryptoPro Mobile Markets',
        caption: 'Mobile market charts and trading',
        orientation: 'portrait',
      },
      {
        src: '/projects/crypto-mobile-swap.jpg',
        alt: 'CryptoPro Mobile Swap',
        caption: 'Mobile quick swap interface',
        orientation: 'portrait',
      },
    ] as const,
    links: [
      {
        label: 'Mirror link',
        url: 'https://crypto-exchange-k3omfqyaq-malore350s-projects.vercel.app/',
      },
    ] as const,
    dockLabel: 'CryptoPro',
    dockIcon: 'Bitcoin',
  },
  {
    id: 'unigo',
    title: 'Unigo.az',
    shortSummary: 'Comprehensive university consultancy platform for finding universities and managing applications.',
    description: 'A comprehensive university consultancy platform designed to help students find universities, manage applications, and schedule consultations via a modern monorepo architecture.\n\nTechnical Architecture:\nDesigned for high scalability and real-time interaction across web, mobile, and backend services.\n\nCore Stack:\n• Backend: Node.js + Express.js + Supabase (PostgreSQL)\n• Web: React (Vite) + Tailwind + Shadcn UI + Zustand\n• Mobile: React Native + Expo SDK 54\n• i18n: Multi-language (i18next)\n\nUser Roles & Workflows:\n• Student: Search universities via AI, manage applications with credits, upload documents.\n• Employee: Guide assigned students, manage application lifecycles.\n• Admin: Full operations control: user management, staff assignments, and financial oversight.\n\nFinancial Ecosystem:\nIntegration with Epoint (Azerbaijan) for secure transaction signing, RRN tracking, and automated invoicing. Tiered subscription plans (LITE, PRO, MAX) bundling application credits and AI suggestions.',
    technologies: ['React', 'Node.js', 'Supabase', 'React Native', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Expo', 'PostgreSQL'] as const,
    screenshots: [
      {
        src: '/projects/unigo-home.png',
        alt: 'Unigo Landing Page',
        caption: 'Unigo Landing Page - Gateway to Global Universities',
        orientation: 'landscape',
      },
      {
        src: '/projects/unigo-dashboard.png',
        alt: 'Unigo Dashboard',
        caption: 'Student Dashboard - AI-powered University Suggestions',
        orientation: 'landscape',
      },
    ] as const,
    links: [
      {
        label: 'Visit Live Site',
        url: 'https://unigo.az',
      },
    ] as const,
    dockLabel: 'Unigo',
    dockIcon: 'GraduationCap',
  },
  {
    id: 'ttyt',
    title: 'ttyt - Terminal Assistant',
    shortSummary: 'AI-powered terminal companion that translates natural language into safe, executable shell commands with smart safety controls.',
    description: 'ttyt is a Python-based CLI wrapper that uses advanced LLMs to bridge the gap between human intent and terminal commands. It features a three-tier safety classifier and autonomous task execution with intelligent error recovery.\n\nCore Stack:\n• Language: Python 3.8+ with type hints\n• AI Providers: Google Gemini, Z.ai (GLM-4), OpenRouter\n• CLI Framework: Rich for terminal UI and formatting\n• Platform: Cross-platform (Windows, Linux, macOS)\n\nKey Features:\n• Natural language to shell command translation\n• Three-tier safety system (Safe/Caution/Danger)\n• Autonomous agentic mode with auto-retry\n• Context-aware AI with command history\n\nSafety Architecture:\n• SAFE: Read-only commands (ls, git status) - Auto-executes\n• CAUTION: Modifications (npm install, git commit) - Requires confirmation\n• DANGER: Destructive operations (rm -rf) - Blocked by default',
    technologies: ['Python 3.8+', 'Google Gemini', 'Z.ai', 'OpenRouter', 'Rich', 'Cross-platform'] as const,
    screenshots: [
      {
        src: '/projects/ttyt-terminal.png',
        alt: 'Terminal interface showing natural language commands',
        caption: 'Natural language terminal interaction',
        orientation: 'landscape',
      },
      {
        src: '/projects/ttyt-models.png',
        alt: 'AI model selection menu',
        caption: 'Multi-provider AI model selection',
        orientation: 'landscape',
      },
      {
        src: '/projects/ttyt-agent.png',
        alt: 'Agent mode executing tasks autonomously',
        caption: 'Autonomous agentic mode with error recovery',
        orientation: 'landscape',
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
    dockIcon: 'Terminal',
  },
];