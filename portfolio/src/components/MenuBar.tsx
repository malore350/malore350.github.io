import { useState, useEffect, useRef } from 'react';
import './MenuBar.css';

interface MenuBarProps {
  activeAppName: string;
}

function MenuBar({ activeAppName }: MenuBarProps) {
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
    return date.toLocaleTimeString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

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
              <div className="dropdown-item">About this Website</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">Restart...</div>
              <div className="dropdown-item">Shut Down...</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">Lock Screen</div>
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
