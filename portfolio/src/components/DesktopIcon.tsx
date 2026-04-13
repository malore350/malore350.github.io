import './DesktopIcon.css';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  style?: React.CSSProperties;
  onSelect: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

function DesktopIcon({ id, label, icon, isSelected, style, onSelect, onDoubleClick, onMouseDown }: DesktopIconProps) {
  return (
    <div 
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      id={`desktop-icon-${id}`}
      style={style}
    >
      <div className={`icon-wrapper icon-${id}`}>{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
}

export default DesktopIcon;
