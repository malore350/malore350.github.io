export interface DockItem {
  id: string;
  label: string;
  icon: string;
  hideFromDock?: boolean;
}

export const dockItems: DockItem[] = [
  { id: 'gamehub', label: 'GameHub', icon: '👾' },
  { id: 'cryptopro', label: 'CryptoPro', icon: '💎' },
  { id: 'unigo', label: 'Unigo', icon: '🎓' },
  { id: 'ttyt', label: 'ttyt', icon: '🤖' },
  { id: 'resume-pdf', label: 'Resume.pdf', icon: '📄' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];
