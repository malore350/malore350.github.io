export interface DockItem {
  id: string;
  label: string;
  icon: string;
}

export const dockItems: DockItem[] = [
  { id: 'gamehub', label: 'GameHub', icon: '🎮' },
  { id: 'cryptopro', label: 'CryptoPro', icon: '💰' },
  { id: 'unigo', label: 'Unigo', icon: '🎓' },
  { id: 'ttyt', label: 'ttyt', icon: '🖥️' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
];
