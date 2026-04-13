import './DesktopIcon.css';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  isMobile?: boolean;
  style?: React.CSSProperties;
  onSelect: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

function DesktopIcon({ id, label, icon, isSelected, isMobile, style, onSelect, onDoubleClick, onMouseDown }: DesktopIconProps) {
  return (
    <div 
      className={`desktop-icon ${isSelected ? 'selected' : ''} ${isMobile ? 'mobile' : ''}`}
      onClick={isMobile ? onDoubleClick : onSelect}
      onDoubleClick={isMobile ? undefined : onDoubleClick}
      onMouseDown={isMobile ? undefined : onMouseDown}
      id={`desktop-icon-${id}`}
      style={style}
    >
      <div className={`icon-wrapper icon-${id}`}>{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
}

export default DesktopIcon;
