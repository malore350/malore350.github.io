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
  Minus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Monitor,
  Download,
  Image,
  Folder,
  Layout,
  ArrowUpDown,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Edit2,
  Trash2,
  RotateCcw
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
  Minus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  Monitor,
  Download,
  Image,
  Folder,
  Layout,
  ArrowUpDown,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Edit2,
  Trash2,
  RotateCcw
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
