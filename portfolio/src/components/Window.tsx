import { type ReactNode } from 'react';
import './Window.css';

interface WindowProps {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isMinimizing: boolean;
  isClosing: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMinimizeEnd: (id: string) => void;
  onMaximize: () => void;
  onFocus: () => void;
  onAnimationEnd: (id: string) => void;
  onHeaderMouseDown: (e: React.MouseEvent) => void;
  children: ReactNode;
  style?: React.CSSProperties;
}

function Window({ 
  id, 
  title, 
  isActive, 
  isMinimized, 
  isMaximized,
  isMinimizing,
  isClosing, 
  onClose, 
  onMinimize, 
  onMinimizeEnd,
  onMaximize,
  onFocus, 
  onAnimationEnd,
  onHeaderMouseDown,
  children,
  style
}: WindowProps) {

  if (isMinimized) return null;

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'window-close') {
      onAnimationEnd(id);
    } else if (e.animationName === 'window-minimize') {
      onMinimizeEnd(id);
    }
  };

  return (
    <div 
      className={`mac-window ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''} ${isMaximized ? 'maximized' : ''} ${isMinimizing ? 'minimizing' : ''}`}
      onClick={onFocus}
      onAnimationEnd={handleAnimationEnd}
      style={style}
      id={`window-${id}`}
    >
      {isMaximized && <div className="header-hover-trigger" />}
      <div className="window-header" onMouseDown={isMaximized ? undefined : onHeaderMouseDown}>
        <div className="window-controls">
          <button 
            className="control close" 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            aria-label="Close"
          ></button>
          <button 
            className="control minimize" 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
            aria-label="Minimize"
          ></button>
          <button 
            className="control maximize" 
            onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
            aria-label="Maximize"
          ></button>
        </div>
        <div className="window-title">{title}</div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}

export default Window;
