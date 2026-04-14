import { useState, useEffect, useRef } from 'react';
import AppIcon from './AppIcon';
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
      <div className="menu-bar-right">
        <div className="status-icon battery-icon" aria-label="Battery 100%">
          <div className="battery-body">
            <div className="battery-level" style={{ width: '100%' }}></div>
          </div>
          <div className="battery-tip"></div>
        </div>
        <div className="status-icon wifi-icon" aria-label="WiFi Connected">
          <AppIcon name="Wifi" size={16} strokeWidth={2} />
        </div>
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
}

export default MenuBar;
