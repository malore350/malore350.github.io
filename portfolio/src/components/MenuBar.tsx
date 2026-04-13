import { useState, useEffect } from 'react';
import './MenuBar.css';

interface MenuBarProps {
  activeAppName: string;
}

function MenuBar({ activeAppName }: MenuBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        <span className="apple-logo"></span>
        <span className="active-app-name">{activeAppName}</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Go</span>
        <span className="menu-item">Window</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="menu-bar-right">
        <span className="status-icon">🔋</span>
        <span className="status-icon">📶</span>
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
}

export default MenuBar;
