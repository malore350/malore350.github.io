import React, { useState, useRef, useEffect } from 'react';
import AppIcon from './AppIcon';
import './MusicWidget.css';

interface MusicWidgetProps {
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const TRACKS = [
  {
    title: 'Ocean City',
    artist: 'Pacific Coliseum',
    cover: '/music/ocean_city.jpg',
    src: '/music/Ocean_City.mp3'
  },
  {
    title: 'Emagination (B-Side)',
    artist: 'Pacific Coliseum',
    cover: '/music/Emagination-B-Side.jpg',
    src: '/music/Emagination-B-Side.mp3'
  }
];

export default function MusicWidget({ className = '', style, onMouseDown, onClick }: MusicWidgetProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
      audioRef.current.currentTime = newProgress * duration;
      setProgress(newProgress * 100);
      setCurrentTime(newProgress * duration);
    }
  };

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
      <img src={track.cover} alt={track.title} className="music-cover" draggable="false" />
      <div className="music-info">
        <div className="music-header">
          <div className="music-text">
            <div className="music-title">{track.title}</div>
            <div className="music-artist">{track.artist}</div>
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
          <button className="music-skip-btn" onClick={handlePrev} aria-label="Previous">
            <AppIcon name="SkipBack" size={16} fill="currentColor" strokeWidth={0} />
          </button>
          <button className="music-play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            <AppIcon name={isPlaying ? "Pause" : "Play"} size={20} fill="currentColor" strokeWidth={0} />
          </button>
          <button className="music-skip-btn" onClick={handleNext} aria-label="Next">
            <AppIcon name="SkipForward" size={16} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}
