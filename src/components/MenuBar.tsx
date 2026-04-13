import { useState, useEffect, useRef } from 'react';
import './MenuBar.css';

interface MenuBarProps {
  activeAppName: string;
  isMobile?: boolean;
  onPowerAction?: (action: 'shutdown' | 'restart') => void;
  onLock?: () => void;
  onAboutClick?: () => void;
}

function MenuBar({ activeAppName, isMobile, onPowerAction, onLock, onAboutClick }: MenuBarProps) {
  const [time, setTime] = useState(new Date());
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const appleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appleMenuRef.current && !appleMenuRef.current.contains(event.target as Node)) {
        setIsAppleMenuOpen(false);
      }
    };

    if (isAppleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAppleMenuOpen]);

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
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 21l-12-11.657c1.581-1.39 3.42-2.123 5.333-2.123s3.752.733 5.333 2.123l-1.333 1.293c-1.054-.927-2.28-1.416-3.553-1.416s-2.499.489-3.553 1.416l9.106 8.834 9.106-8.834c-1.054-.927-2.28-1.416-3.553-1.416s-2.499.489-3.553 1.416l-1.333-1.293c1.581-1.39 3.42-2.123 5.333-2.123s3.752.733 5.333 2.123l-12 11.657z"/>
            </svg>
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
                <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                About this Website
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onPowerAction?.('restart'); }}>
                <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                Restart...
              </div>
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onPowerAction?.('shutdown'); }}>
                <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                Shut Down...
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => { setIsAppleMenuOpen(false); onLock?.(); }}>
                <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
      <div className="menu-bar-right">
        <div className="status-icon battery-icon" aria-label="Battery 100%">
          <div className="battery-body">
            <div className="battery-level" style={{ width: '100%' }}></div>
          </div>
          <div className="battery-tip"></div>
        </div>
        <div className="status-icon wifi-icon" aria-label="WiFi Connected">
          <div className="wifi-bar wifi-1"></div>
          <div className="wifi-bar wifi-2"></div>
          <div className="wifi-bar wifi-3"></div>
        </div>
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
}

export default MenuBar;
