export interface DockItem {
  id: string;
  label: string;
  icon: string;
  hideFromDock?: boolean;
}

export const dockItems: DockItem[] = [
  { id: 'gamehub', label: 'GameHub', icon: 'Gamepad2' },
  { id: 'cryptopro', label: 'CryptoPro', icon: 'Bitcoin' },
  { id: 'unigo', label: 'Unigo', icon: 'GraduationCap' },
  { id: 'ttyt', label: 'ttyt', icon: 'Terminal' },
  { id: 'resume-pdf', label: 'Resume.pdf', icon: 'FileText' },
  { id: 'contact', label: 'Contact', icon: 'Mail' },
];
