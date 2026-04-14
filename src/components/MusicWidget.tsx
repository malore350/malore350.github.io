import React from 'react';
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
  onClick?: (e: React.MouseEvent) => void;
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  togglePlay: (e?: React.MouseEvent) => void;
  handleNext: (e?: React.MouseEvent) => void;
  handlePrev: (e?: React.MouseEvent) => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MusicWidget({ 
  className = '', 
  style, 
  onMouseDown, 
  onClick,
  currentTrack,
  isPlaying,
  progress,
  duration,
  currentTime,
  togglePlay,
  handleNext,
  handlePrev,
  handleProgressClick
}: MusicWidgetProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      className={`music-widget ${className}`}
      style={style}
      onMouseDown={onMouseDown}
      onClick={onClick}
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
          <div className="music-progress-container" onClick={handleProgressClick}>
            <div className="music-progress-bg" />
            <div className="music-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span className="music-time">-{formatTime(duration - currentTime)}</span>
        </div>

        <div className="music-play-controls">
          <button className="music-skip-btn" onClick={(e) => { e.stopPropagation(); handlePrev(e); }} aria-label="Previous">
            <AppIcon name="SkipBack" size={16} fill="currentColor" strokeWidth={0} />
          </button>
          <button className="music-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(e); }} aria-label={isPlaying ? "Pause" : "Play"}>
            <AppIcon name={isPlaying ? "Pause" : "Play"} size={20} fill="currentColor" strokeWidth={0} />
          </button>
          <button className="music-skip-btn" onClick={(e) => { e.stopPropagation(); handleNext(e); }} aria-label="Next">
            <AppIcon name="SkipForward" size={16} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </div>
    </div>
  );
}
