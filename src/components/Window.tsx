import { type ReactNode, useState, useRef, useCallback, useEffect } from 'react';
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
  const isTouchDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = 0;
    isTouchDragging.current = true;
    setIsSheetDragging(true);
  }, []);

  const updateSheetDrag = useCallback((clientY: number) => {
    if (!isTouchDragging.current) return;

    const deltaY = Math.max(clientY - dragStartY.current, 0);
    dragCurrentY.current = deltaY;
    setDragY(deltaY);
  }, []);

  const finishSheetDrag = useCallback(() => {
    if (!isTouchDragging.current) return;

    isTouchDragging.current = false;
    setIsSheetDragging(false);

    if (dragCurrentY.current > 0) {
      onClose();
      return;
    }

    setDragY(0);
    dragCurrentY.current = 0;
  }, [onClose]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updateSheetDrag(e.touches[0].clientY);
  }, [updateSheetDrag]);

  const handleTouchEnd = useCallback(() => {
    finishSheetDrag();
  }, [finishSheetDrag]);

  useEffect(() => {
    if (!isSheetDragging) return;

    const handleWindowTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      updateSheetDrag(event.touches[0].clientY);
    };

    const handleWindowTouchEnd = () => {
      finishSheetDrag();
    };

    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
    window.addEventListener('touchend', handleWindowTouchEnd);
    window.addEventListener('touchcancel', handleWindowTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
    };
  }, [finishSheetDrag, isSheetDragging, updateSheetDrag]);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'window-close' || e.animationName === 'mobile-app-close') {
      onAnimationEnd(id);
    } else if (e.animationName === 'window-minimize') {
      onMinimizeEnd(id);
    }
  };

  if (isMinimized) return null;

  if (isMobile) {
    const sheetStyle: React.CSSProperties = {
      transform: `translateY(${dragY}px)`,
    };

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
