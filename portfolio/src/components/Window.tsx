import { type ReactNode } from 'react';
import './Window.css';

interface WindowProps {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized: boolean;
  isClosing: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onAnimationEnd: (id: string) => void;
  children: ReactNode;
}

function Window({ 
  id, 
  title, 
  isActive, 
  isMinimized, 
  isClosing, 
  onClose, 
  onMinimize, 
  onFocus, 
  onAnimationEnd,
  children 
}: WindowProps) {
  
  if (isMinimized) return null;

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'window-close') {
      onAnimationEnd(id);
    }
  };

  return (
    <div 
      className={`mac-window ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''}`}
      onClick={onFocus}
      onAnimationEnd={handleAnimationEnd}
      style={{ zIndex: isActive ? 100 : 10 }}
      id={`window-${id}`}
    >
      <div className="window-header" onDoubleClick={() => {}}>
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
            onClick={(e) => { e.stopPropagation(); }} 
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
