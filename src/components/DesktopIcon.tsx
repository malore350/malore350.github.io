import { useState, useRef, useEffect } from 'react';
import AppIcon from './AppIcon';
import './DesktopIcon.css';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  isMobile?: boolean;
  isRenaming?: boolean;
  style?: React.CSSProperties;
  onSelect: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onRename?: (newName: string) => void;
}

function DesktopIcon({ id, label, icon, isSelected, isMobile, isRenaming, style, onSelect, onDoubleClick, onMouseDown, onContextMenu, onRename }: DesktopIconProps) {
  const [renameValue, setRenameValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename?.(renameValue);
    } else if (e.key === 'Escape') {
      setRenameValue(label);
      onRename?.(label);
    }
  };

  const handleRenameBlur = () => {
    onRename?.(renameValue);
  };

  return (
    <div
      className={`desktop-icon ${isSelected ? 'selected' : ''} ${isMobile ? 'mobile' : ''}`}
      onClick={isMobile ? onDoubleClick : onSelect}
      onDoubleClick={isMobile ? undefined : onDoubleClick}
      onMouseDown={isMobile ? undefined : onMouseDown}
      onContextMenu={onContextMenu}
      id={`desktop-icon-${id}`}
      style={style}
    >
      <div className={`icon-wrapper ${id.startsWith('kword-') ? 'icon-kword' : `icon-${id}`}`}>
        <AppIcon name={icon} size={isMobile ? 32 : 34} strokeWidth={1.5} />
      </div>
      {isRenaming ? (
        <input
          ref={inputRef}
          className="icon-rename-input"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={handleRenameBlur}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="icon-label">{label}</div>
      )}
    </div>
  );
}

export default DesktopIcon;
