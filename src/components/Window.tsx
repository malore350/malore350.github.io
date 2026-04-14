import { type ReactNode, useState, useRef, useCallback } from 'react';
import './Window.css';

interface WindowProps {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isMinimizing: boolean;
  isClosing: boolean;
  isDragging: boolean;
  isMobile?: boolean;
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
  isDragging,
  isMobile,
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

  const [dragY, setDragY] = useState(0);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = 0;
    setIsSheetDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSheetDragging) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (deltaY > 0) {
      dragCurrentY.current = deltaY;
      setDragY(deltaY);
    }
  }, [isSheetDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsSheetDragging(false);
    const dismissThreshold = 120;
    if (dragCurrentY.current > dismissThreshold) {
      onClose();
    } else {
      setDragY(0);
    }
    dragCurrentY.current = 0;
  }, [onClose]);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'window-close' || e.animationName === 'mobile-app-close') {
      onAnimationEnd(id);
    } else if (e.animationName === 'window-minimize') {
      onMinimizeEnd(id);
    }
  };

  if (isMinimized) return null;

  if (isMobile) {
    const sheetStyle: React.CSSProperties = isSheetDragging ? {
      transform: `translateY(${dragY}px)`,
    } : undefined;

    return (
      <div className="mobile-backdrop-wrapper" onClick={onClose}>
        <div
          className={`mac-window mobile ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''} ${isSheetDragging ? 'dragging' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onFocus();
          }}
          onAnimationEnd={handleAnimationEnd}
          style={sheetStyle}
          id={`window-${id}`}
        >
          <div
            className={`mobile-sheet-handle ${isSheetDragging ? 'dragging' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="mobile-sheet-handle-bar"></div>
          </div>
          <div className="mobile-sheet-header">
            <div className="window-title">{title}</div>
          </div>
          <div className="mobile-sheet-content">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mac-window ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''} ${isMaximized ? 'maximized' : ''} ${isMinimizing ? 'minimizing' : ''} ${isDragging ? 'dragging' : ''}`}
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
