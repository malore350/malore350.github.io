import React, { useRef } from 'react';
import AppIcon from './AppIcon';
import './MusicWidget.css';

export interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

export interface MusicWidgetProps {
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  variant?: 'default' | 'lockscreen';
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  togglePlay: (e?: React.MouseEvent) => void;
  handleNext: (e?: React.MouseEvent) => void;
  handlePrev: (e?: React.MouseEvent) => void;
  handleProgressChange: (progress: number) => void;
}

export default function MusicWidget({ 
  className = '', 
  style, 
  onMouseDown, 
  onClick,
  variant = 'default',
  currentTrack,
  isPlaying,
  progress,
  duration,
  currentTime,
  togglePlay,
  handleNext,
  handlePrev,
  handleProgressChange
}: MusicWidgetProps) {
  const progressContainerRef = useRef<HTMLButtonElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleWidgetKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  const widgetInteractiveProps = onClick || onMouseDown
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: handleWidgetKeyDown,
      }
    : {};

  const updateProgressFromClientX = (clientX: number) => {
    if (!progressContainerRef.current) return;

    const rect = progressContainerRef.current.getBoundingClientRect();
    const nextProgress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    handleProgressChange(nextProgress);
  };

  const handleProgressMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    updateProgressFromClientX(event.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateProgressFromClientX(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleProgressButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (event.detail === 0) return;

    updateProgressFromClientX(event.clientX);
  };

  if (variant === 'lockscreen') {
    return (
      <div
        className={`music-widget music-widget-lockscreen ${className}`}
        style={style}
        {...(onClick ? { onClick } : {})}
        {...widgetInteractiveProps}
      >
        <img src={currentTrack.cover} alt={currentTrack.title} className="music-cover" draggable="false" />
        <div className="music-info">
          <div className="music-header">
            <div className="music-text">
              <div className="music-title">{currentTrack.title}</div>
              <div className="music-artist">{currentTrack.artist}</div>
            </div>
          </div>

          <div className="music-controls">
            <button type="button" className="music-progress-container" ref={progressContainerRef} onMouseDown={handleProgressMouseDown} onClick={handleProgressButtonClick} aria-label="Seek track position">
              <div className="music-progress-bg" />
              <div className="music-progress-bar" style={{ width: `${progress}%` }} />
            </button>
            <span className="music-time">{formatTime(currentTime)}</span>
          </div>

          <div className="music-play-controls">
            <button type="button" className="music-skip-btn" onClick={(e) => { e.stopPropagation(); handlePrev(e); }} aria-label="Previous">
              <AppIcon name="SkipBack" size={14} fill="currentColor" strokeWidth={0} />
            </button>
            <button type="button" className="music-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(e); }} aria-label={isPlaying ? 'Pause' : 'Play'}>
              <AppIcon name={isPlaying ? 'Pause' : 'Play'} size={16} fill="currentColor" strokeWidth={0} />
            </button>
            <button type="button" className="music-skip-btn" onClick={(e) => { e.stopPropagation(); handleNext(e); }} aria-label="Next">
              <AppIcon name="SkipForward" size={14} fill="currentColor" strokeWidth={0} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`music-widget ${className}`}
      style={style}
      {...(onMouseDown ? { onMouseDown } : {})}
      {...(onClick ? { onClick } : {})}
      {...widgetInteractiveProps}
    >
      <img src={currentTrack.cover} alt={currentTrack.title} className="music-cover" draggable="false" />
      <div className="music-info">
        <div className="music-header">
          <div className="music-text">
            <div className="music-title">{currentTrack.title}</div>
            <div className="music-artist">{currentTrack.artist}</div>
          </div>
        </div>
        
        <div className="music-controls">
          <span className="music-time">{formatTime(currentTime)}</span>
          <button type="button" className="music-progress-container" ref={progressContainerRef} onMouseDown={handleProgressMouseDown} onClick={handleProgressButtonClick} aria-label="Seek track position">
            <div className="music-progress-bg" />
            <div className="music-progress-bar" style={{ width: `${progress}%` }} />
          </button>
          <span className="music-time">-{formatTime(duration - currentTime)}</span>
        </div>

        <div className="music-play-controls">
          <button type="button" className="music-skip-btn" onClick={(e) => { e.stopPropagation(); handlePrev(e); }} aria-label="Previous">
            <AppIcon name="SkipBack" size={16} fill="currentColor" strokeWidth={0} />
          </button>
          <button type="button" className="music-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(e); }} aria-label={isPlaying ? "Pause" : "Play"}>
            <AppIcon name={isPlaying ? "Pause" : "Play"} size={20} fill="currentColor" strokeWidth={0} />
          </button>
          <button type="button" className="music-skip-btn" onClick={(e) => { e.stopPropagation(); handleNext(e); }} aria-label="Next">
            <AppIcon name="SkipForward" size={16} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </div>
    </div>
  );
}
