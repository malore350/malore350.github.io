import { 
  Gamepad2, 
  Bitcoin, 
  GraduationCap, 
  Terminal, 
  FileText, 
  Mail, 
  Wifi, 
  Info, 
  RefreshCcw, 
  Power, 
  Lock,
  User,
  Search,
  Settings,
  X,
  Maximize2,
  Minimize2,
  Minus
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

const iconRegistry: Record<string, React.FC<LucideProps>> = {
  Gamepad2,
  Bitcoin,
  GraduationCap,
  Terminal,
  FileText,
  Mail,
  Wifi,
  Info,
  RefreshCcw,
  Power,
  Lock,
  User,
  Search,
  Settings,
  X,
  Maximize2,
  Minimize2,
  Minus
};

interface AppIconProps extends LucideProps {
  name: string;
}

const AppIcon = ({ name, ...props }: AppIconProps) => {
  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    // Fallback to the string itself if it's an emoji or unknown
    return <span {...(props as any)}>{name}</span>;
  }

  return <IconComponent {...props} />;
};

export default AppIcon;
