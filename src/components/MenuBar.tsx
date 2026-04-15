import { useState, useEffect, useRef } from 'react';
import AppIcon from './AppIcon';
import type { Track } from './MusicWidget';
import './MenuBar.css';

interface MenuBarProps {
  activeAppName: string;
  isMobile?: boolean;
  onPowerAction?: (action: 'shutdown' | 'restart') => void;
  onLock?: () => void;
  onAboutClick?: () => void;
  musicState?: {
    isPlaying: boolean;
    hasStartedPlaying: boolean;
    currentTrack: Track;
    progress: number;
    duration: number;
    currentTime: number;
    handleProgressChange: (progress: number) => void;
    togglePlay: (e?: React.MouseEvent) => void;
    handleNext: (e?: React.MouseEvent) => void;
    handlePrev: (e?: React.MouseEvent) => void;
  };
}

function MenuBar({ activeAppName, isMobile, onPowerAction, onLock, onAboutClick, musicState }: MenuBarProps) {
  const [time, setTime] = useState(new Date());
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);
  
  const appleMenuRef = useRef<HTMLDivElement>(null);
  const wifiRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const notchProgressRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appleMenuRef.current && !appleMenuRef.current.contains(event.target as Node)) {
        setIsAppleMenuOpen(false);
      }
      if (wifiRef.current && !wifiRef.current.contains(event.target as Node)) {
        setIsWifiOpen(false);
      }
      if (batteryRef.current && !batteryRef.current.contains(event.target as Node)) {
        setIsBatteryOpen(false);
      }
    };

    if (isAppleMenuOpen || isWifiOpen || isBatteryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAppleMenuOpen, isWifiOpen, isBatteryOpen]);

  const formatTime = (date: Date) => {
    if (isMobile) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).replace(' AM', '').replace(' PM', '');
    }
    return date.toLocaleTimeString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTrackTime = (timeInSeconds: number) => {
    const safeTime = Math.max(0, Math.floor(timeInSeconds));
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updateNotchProgressFromClientX = (clientX: number) => {
    if (!musicState || !notchProgressRef.current) return;

    const rect = notchProgressRef.current.getBoundingClientRect();
    const nextProgress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    musicState.handleProgressChange(nextProgress);
  };

  const handleNotchProgressMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    updateNotchProgressFromClientX(event.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateNotchProgressFromClientX(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleNotchProgressClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (event.detail === 0) return;

    updateNotchProgressFromClientX(event.clientX);
  };

  if (isMobile) {
    return (
      <div className="menu-bar mobile">
        <div className="menu-bar-left">
          <span className="time">{formatTime(time)}</span>
        </div>
        <div className="menu-bar-right">
          <div className="status-icon signal-icon">
            <div className="signal-bar bar-1"></div>
            <div className="signal-bar bar-2"></div>
            <div className="signal-bar bar-3"></div>
            <div className="signal-bar bar-4"></div>
          </div>
          <div className="status-icon wifi-icon">
            <AppIcon name="Wifi" size={16} strokeWidth={2} />
          </div>
          <div className="status-icon battery-icon">
            <div className="battery-body">
              <div className="battery-level" style={{ width: '100%' }}></div>
            </div>
            <div className="battery-tip"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-bar">
      <div className="menu-bar-left">
        <div className="apple-menu-container" ref={appleMenuRef}>
          <span 
            className={`apple-logo ${isAppleMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsAppleMenuOpen(!isAppleMenuOpen)}
          >
            
          </span>
          {isAppleMenuOpen && (
            <div className="apple-dropdown">
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onAboutClick?.(); }}>
                <AppIcon name="Info" size={14} strokeWidth={2} className="menu-icon" />
                About this Website
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onPowerAction?.('restart'); }}>
                <AppIcon name="RefreshCcw" size={14} strokeWidth={2} className="menu-icon" />
                Restart...
              </div>
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onPowerAction?.('shutdown'); }}>
                <AppIcon name="Power" size={14} strokeWidth={2} className="menu-icon" />
                Shut Down...
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onLock?.(); }}>
                <AppIcon name="Lock" size={14} strokeWidth={2} className="menu-icon" />
                Lock Screen
              </div>
            </div>
          )}
        </div>
        <span className="active-app-name">{activeAppName}</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Go</span>
        <span className="menu-item">Window</span>
        <span className="menu-item">Help</span>
      </div>

      {musicState && (
        <div className={`menu-notch ${musicState.isPlaying ? 'playing' : ''}`}>
          <div className="notch-content">
             <div className="notch-collapsed">
               <img src={musicState.currentTrack.cover} alt="cover" className="notch-cover" />
               <div className="notch-eq">
                 <div className="eq-bar" />
                 <div className="eq-bar" />
                 <div className="eq-bar" />
               </div>
             </div>
             <div className="notch-expanded">
               <div className="notch-top-row">
                 <img src={musicState.currentTrack.cover} alt="cover" className="notch-cover-large" />
                 <div className="notch-info">
                   <div className="notch-title">{musicState.currentTrack.title}</div>
                   <div className="notch-artist">{musicState.currentTrack.artist}</div>
                 </div>
                 <div className="notch-eq notch-eq-expanded">
                   <div className="eq-bar" />
                   <div className="eq-bar" />
                   <div className="eq-bar" />
                 </div>
               </div>
               <div className="notch-progress-row">
                 <span className="notch-time">{formatTrackTime(musicState.currentTime)}</span>
                 <button
                   type="button"
                   className="notch-progress-track"
                   ref={notchProgressRef}
                   onMouseDown={handleNotchProgressMouseDown}
                   onClick={handleNotchProgressClick}
                   aria-label="Seek track position"
                 >
                   <div className="notch-progress-bar" style={{ width: `${musicState.progress}%` }} />
                 </button>
                 <span className="notch-time">-{formatTrackTime(musicState.duration - musicState.currentTime)}</span>
               </div>
               <div className="notch-controls">
                 <button type="button" className="notch-btn" onClick={(e) => { e.stopPropagation(); musicState.handlePrev(e); }}>
                   <AppIcon name="SkipBack" size={16} fill="currentColor" strokeWidth={0} />
                 </button>
                 <button type="button" className="notch-btn notch-btn-play" onClick={(e) => { e.stopPropagation(); musicState.togglePlay(e); }}>
                   <AppIcon name={musicState.isPlaying ? "Pause" : "Play"} size={18} fill="currentColor" strokeWidth={0} />
                 </button>
                 <button type="button" className="notch-btn" onClick={(e) => { e.stopPropagation(); musicState.handleNext(e); }}>
                   <AppIcon name="SkipForward" size={16} fill="currentColor" strokeWidth={0} />
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

      <div className="menu-bar-right">
        <div className="status-dropdown-container" ref={batteryRef}>
          <div 
            className={`status-icon-wrapper ${isBatteryOpen ? 'active' : ''}`}
            onClick={() => setIsBatteryOpen(!isBatteryOpen)}
            aria-label="Battery 100%"
          >
            <div className="status-icon battery-icon">
              <div className="battery-body">
                <div className="battery-level" style={{ width: '100%' }}></div>
              </div>
              <div className="battery-tip"></div>
            </div>
          </div>
          
          {isBatteryOpen && (
            <div className="status-dropdown">
              <div className="status-dropdown-header">
                <span className="status-dropdown-title">Battery</span>
                <span className="status-dropdown-subtitle">100%</span>
              </div>
              <div className="status-dropdown-body">
                <div className="status-dropdown-item">
                  <span className="status-dropdown-label">Power Source</span>
                  <span className="status-dropdown-value">Power Adapter</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="status-dropdown-container" ref={wifiRef}>
          <div 
            className={`status-icon-wrapper ${isWifiOpen ? 'active' : ''}`}
            onClick={() => setIsWifiOpen(!isWifiOpen)}
            aria-label="WiFi Connected"
          >
            <div className="status-icon wifi-icon">
              <AppIcon name="Wifi" size={16} strokeWidth={2} />
            </div>
          </div>
          
          {isWifiOpen && (
            <div className="status-dropdown">
              <div className="status-dropdown-header">
                <span className="status-dropdown-title">Wi-Fi</span>
                <div className="toggle-switch active"></div>
              </div>
              <div className="status-dropdown-body">
                <div className="status-dropdown-item active">
                  <AppIcon name="Check" size={14} strokeWidth={3} className="check-icon" />
                  <span className="status-dropdown-label">Home_Network_5G</span>
                  <AppIcon name="Lock" size={12} strokeWidth={2} className="lock-icon" />
                </div>
                <div className="dropdown-divider"></div>
                <div className="status-dropdown-item">
                  <span className="status-dropdown-label empty-icon">Guest_Network</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
}

export default MenuBar;