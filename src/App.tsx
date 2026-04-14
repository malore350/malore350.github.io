import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import { projects } from './data/projects';
import Dock from './components/Dock';
import { dockItems } from './data/dockItems';
import MenuBar from './components/MenuBar';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import ProjectSection from './components/ProjectSection';
import ResumeSection from './components/ResumeSection';
import AppIcon from './components/AppIcon';
import MusicWidget from './components/MusicWidget';

interface OpenApp {
  id: string;
  isClosing: boolean;
  isMinimizing: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

const calculateInitialIconPositions = () => {
  const positions: Record<string, Position> = {};
  const margin = 20;
  const iconWidth = 90;
  const iconHeight = 110;
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  // All icons in 2-column grid on the right
  dockItems.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    positions[item.id] = {
      x: windowWidth - margin - iconWidth - (1 - col) * (iconWidth + 10),
      y: 40 + iconHeight + row * iconHeight
    };
  });

  return positions;
};

const calculateInitialWidgetPositions = () => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  return {
    intro: { x: 40, y: 60 },
    profile: { x: 40, y: 340 },
    calendar: { x: 280, y: 340 },
    music: { x: 40, y: 580 },
    notepad: { 
      x: (windowWidth / 2) + 20, 
      y: 60
    }
  };
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const INITIAL_NOTEPAD_TEXT = `Hey there! 👋

Feel free to explore my portfolio. You can double-click the icons on the right to open projects, drag any widget or window around, and even lasso-select items on the desktop!

Pro tip: You can even Shut Down or Restart this "OS" from the Apple menu in the top left. Give it a try to see the full boot sequence! 

(You can also edit this text!)

Have fun! ✨`;

function App() {
  const isMobile = useIsMobile();
  const [systemStatus, setSystemStatus] = useState<'running' | 'shutting-down' | 'off' | 'booting'>('running');
  const [bootProgress, setBootProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [activeApp, setActiveApp] = useState<string>('Finder');
  const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
  const [maximizedApps, setMaximizedApps] = useState<string[]>([]);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Selection & Dragging state
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [iconPositions, setIconPositions] = useState<Record<string, Position>>(calculateInitialIconPositions);
  const [widgetPositions, setWidgetPositions] = useState<Record<string, Position>>(calculateInitialWidgetPositions);
  const [windowPositions, setWindowPositions] = useState<Record<string, Position>>({});
  
  const [selectionBox, setSelectionBox] = useState<{ start: Point, current: Point } | null>(null);
  const [draggingItem, setDraggingItem] = useState<{ type: 'icon' | 'widget' | 'window', id: string, offset: Point } | null>(null);
  const [notepadText, setNotepadText] = useState(INITIAL_NOTEPAD_TEXT);
  
  const desktopRef = useRef<HTMLElement>(null);

  // Re-calculate positions on window resize
  useEffect(() => {
    const handleResize = () => {
      setIconPositions(calculateInitialIconPositions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openApp = useCallback((id: string) => {
    setOpenApps((prev) => {
      const existing = prev.find(app => app.id === id);
      if (existing) {
        if (existing.isClosing || existing.isMinimizing) {
          return prev.map(app => app.id === id ? { ...app, isClosing: false, isMinimizing: false } : app);
        }
        return prev;
      }
      return [...prev, { id, isClosing: false, isMinimizing: false }];
    });

    // Initialize window position if not exists
    setWindowPositions(prev => {
      if (prev[id]) return prev;
      return { ...prev, [id]: { x: 40, y: 40 } };
    });

    setMinimizedApps((prev) => prev.filter((appId) => appId !== id));
    setActiveApp(id);
  }, []);

  const triggerCloseApp = useCallback((id: string) => {
    setOpenApps((prev) => prev.map(app => app.id === id ? { ...app, isClosing: true } : app));
    if (activeApp === id) {
      const remaining = openApps.filter((app) => app.id !== id && !app.isClosing);
      setActiveApp(remaining.length > 0 ? remaining[remaining.length - 1].id : 'Finder');
    }
  }, [activeApp, openApps]);

  const finalizeCloseApp = useCallback((id: string) => {
    setOpenApps((prev) => prev.filter((app) => app.id !== id));
    setMinimizedApps((prev) => prev.filter((appId) => appId !== id));
    setMaximizedApps((prev) => prev.filter((appId) => appId !== id));
  }, []);

  const triggerMinimizeApp = useCallback((id: string) => {
    setOpenApps((prev) => prev.map(app => app.id === id ? { ...app, isMinimizing: true } : app));
    if (activeApp === id) {
      const remaining = openApps.filter((app) => app.id !== id && !minimizedApps.includes(app.id) && !app.isClosing && !app.isMinimizing);
      setActiveApp(remaining.length > 0 ? remaining[remaining.length - 1].id : 'Finder');
    }
  }, [activeApp, openApps, minimizedApps]);

  const finalizeMinimizeApp = useCallback((id: string) => {
    setMinimizedApps((prev) => [...prev, id]);
    setOpenApps((prev) => prev.map(app => app.id === id ? { ...app, isMinimizing: false } : app));
  }, []);

  const focusApp = useCallback((id: string) => {
    if (minimizedApps.includes(id)) {
      setMinimizedApps((prev) => prev.filter((appId) => appId !== id));
    }
    setActiveApp(id);
  }, [minimizedApps]);

  const toggleMaximizeApp = useCallback((id: string) => {
    setMaximizedApps((prev) => 
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
    focusApp(id);
  }, [focusApp]);

  const handleDockClick = (id: string) => {
    const app = openApps.find(a => a.id === id);
    if (app && !app.isClosing) {
      if (activeApp === id && !minimizedApps.includes(id)) {
        triggerMinimizeApp(id);
      } else {
        focusApp(id);
      }
    } else {
      openApp(id);
    }
  };

  const getAppName = (id: string) => {
    return dockItems.find(item => item.id === id)?.label || 'Finder';
  };

  const runBootSequence = useCallback(() => {
    setSystemStatus('booting');
    setBootProgress(0);
    
    // Phase 1: Just logo (2s)
    setTimeout(() => {
      // Phase 2: Logo + Progress (3s)
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      setTimeout(() => {
        setSystemStatus('running');
        setIsLocked(true);
        setBootProgress(0);
      }, 3500);
    }, 2000);
  }, []);

  const handlePowerAction = useCallback((action: 'shutdown' | 'restart') => {
    setSystemStatus('shutting-down');
    setTimeout(() => {
      if (action === 'restart') {
        runBootSequence();
      } else {
        setSystemStatus('off');
      }
    }, 3000);
  }, [runBootSequence]);

  const handleTurnOn = () => {
    runBootSequence();
  };

  const handleLock = useCallback(() => {
    setIsLocked(true);
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const toggleAbout = useCallback(() => {
    setIsAboutOpen(prev => !prev);
  }, []);

  // Close active window with Cmd+W (or Ctrl+W)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        if (activeApp !== 'Finder') {
          triggerCloseApp(activeApp);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp, triggerCloseApp]);

  // Mouse Handlers for Desktop
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      e.preventDefault(); // Prevent text selection
      setSelectedIcons([]);
      setSelectedWidgets([]);
      setSelectionBox({
        start: { x: e.clientX, y: e.clientY },
        current: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (selectionBox) {
      const current = { x: e.clientX, y: e.clientY };
      setSelectionBox({ ...selectionBox, current });

      // Update selection
      const x1 = Math.min(selectionBox.start.x, current.x);
      const y1 = Math.min(selectionBox.start.y, current.y);
      const x2 = Math.max(selectionBox.start.x, current.x);
      const y2 = Math.max(selectionBox.start.y, current.y);

      // Icons
      const newlySelectedIcons: string[] = [];
      dockItems.forEach(item => {
        const pos = iconPositions[item.id];
        if (pos) {
          const iconBounds = { left: pos.x, top: pos.y, right: pos.x + 80, bottom: pos.y + 110 };
          const isIntersecting = !(iconBounds.left > x2 || iconBounds.right < x1 || iconBounds.top > y2 || iconBounds.bottom < y1);
          if (isIntersecting) {
            newlySelectedIcons.push(item.id);
          }
        }
      });
      setSelectedIcons(newlySelectedIcons);

      // Widgets
      const newlySelectedWidgets: string[] = [];
      const widgetBoundsMap: Record<string, { w: number, h: number }> = {
        intro: { w: 400, h: 200 },
        profile: { w: 220, h: 220 },
        calendar: { w: 220, h: 220 },
        music: { w: 340, h: 140 },
        notepad: { w: 280, h: 340 }
      };
      Object.keys(widgetPositions).forEach(id => {
        const pos = widgetPositions[id];
        const dim = widgetBoundsMap[id];
        const bounds = { left: pos.x, top: pos.y, right: pos.x + dim.w, bottom: pos.y + dim.h };
        const isIntersecting = !(bounds.left > x2 || bounds.right < x1 || bounds.top > y2 || bounds.bottom < y1);
        if (isIntersecting) {
          newlySelectedWidgets.push(id);
        }
      });
      setSelectedWidgets(newlySelectedWidgets);

    } else if (draggingItem) {
      if (draggingItem.type === 'icon') {
        setIconPositions(prev => ({
          ...prev,
          [draggingItem.id]: {
            x: e.clientX - draggingItem.offset.x,
            y: e.clientY - draggingItem.offset.y
          }
        }));
      } else if (draggingItem.type === 'widget') {
        setWidgetPositions(prev => ({
          ...prev,
          [draggingItem.id]: {
            x: e.clientX - draggingItem.offset.x,
            y: e.clientY - draggingItem.offset.y
          }
        }));
      } else if (draggingItem.type === 'window') {
        setWindowPositions(prev => ({
          ...prev,
          [draggingItem.id]: {
            x: e.clientX - draggingItem.offset.x,
            y: e.clientY - draggingItem.offset.y
          }
        }));
      }
    }
  };

  const onMouseUp = () => {
    setSelectionBox(null);
    setDraggingItem(null);
  };

  const handleIconMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    setSelectedIcons([id]);
    setSelectedWidgets([]);
    const pos = iconPositions[id];
    if (pos) {
      setDraggingItem({
        type: 'icon',
        id,
        offset: { x: e.clientX - pos.x, y: e.clientY - pos.y }
      });
    }
  };

  const handleWidgetMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    setSelectedWidgets([id]);
    setSelectedIcons([]);
    const pos = widgetPositions[id];
    if (pos) {
      setDraggingItem({
        type: 'widget',
        id,
        offset: { x: e.clientX - pos.x, y: e.clientY - pos.y }
      });
    }
  };

  const handleWindowHeaderMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection
    focusApp(id);
    const pos = windowPositions[id] || { x: 40, y: 40 };
    setDraggingItem({
      type: 'window',
      id,
      offset: { x: e.clientX - pos.x, y: e.clientY - pos.y }
    });
  };

  const openAppIds = openApps.map(app => app.id);

  if (systemStatus !== 'running') {
    return (
      <div className={`boot-screen ${systemStatus}`}>
        <div className="boot-content">
          {(systemStatus === 'booting' || systemStatus === 'shutting-down') && (
            <div className="boot-logo"></div>
          )}
          
          {systemStatus === 'booting' && bootProgress > 0 && (
            <div className="boot-progress-container">
              <div className="boot-progress-bar" style={{ width: `${bootProgress}%` }} />
            </div>
          )}

          {systemStatus === 'off' && (
            <div className="off-content">
              <p className="off-message">System is currently powered off.</p>
              <button className="turn-on-button" onClick={handleTurnOn}>
                <AppIcon name="Power" size={20} style={{ marginRight: '8px' }} /> Turn On
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLocked) {
    const time = new Date();
    return (
      <div className={`lock-screen ${isMobile ? 'mobile' : ''}`}>
        <div className="wallpaper" style={{ filter: 'blur(100px) saturate(1.8)', opacity: 1 }} />
        
        {isMobile && (
          <div className="lock-time-container">
            <div className="lock-date">
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="lock-time">
              {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
            </div>
          </div>
        )}

        <div className="lock-content">
          {!isMobile && (
            <div className="lock-user-info">
              <img src="/me.png" alt="Kamran Gasimov" className="lock-profile-image" />
              <h2 className="lock-user-name">Kamran Gasimov</h2>
            </div>
          )}
          <div className="lock-input-container">
            <input 
              type="password" 
              className="lock-password-input" 
              placeholder={isMobile ? "Swipe up to unlock" : "Enter Password"}
              autoFocus 
              readOnly={isMobile}
              onClick={isMobile ? handleUnlock : undefined}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            {!isMobile && <button className="lock-unlock-button" onClick={handleUnlock}>→</button>}
          </div>
          {!isMobile && <p className="lock-hint">Press Enter to unlock</p>}
          {isMobile && <p className="lock-hint">Click input to unlock</p>}
        </div>
        {!isMobile && (
          <div className="lock-bottom-controls">
            <button className="lock-control-btn" onClick={() => handlePowerAction('shutdown')}>
              <span className="lock-control-icon">
                <AppIcon name="Power" size={22} strokeWidth={2} />
              </span>
              <span>Shut Down</span>
            </button>
            <button className="lock-control-btn" onClick={() => handlePowerAction('restart')}>
              <span className="lock-control-icon">
                <AppIcon name="RefreshCcw" size={20} strokeWidth={2.5} />
              </span>
              <span>Restart</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`desktop-environment ${isMobile ? 'mobile' : ''}`} onClick={() => { setSelectedIcons([]); setSelectedWidgets([]); }}>
      <div className="wallpaper" />
      {!isMobile && (
        <MenuBar 
          activeAppName={getAppName(activeApp)} 
          isMobile={isMobile}
          onPowerAction={handlePowerAction} 
          onLock={handleLock} 
          onAboutClick={toggleAbout}
        />
      )}
      
      {isAboutOpen && (
        <div className="about-dialog-overlay" onClick={toggleAbout}>
          <div className="about-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="about-close" onClick={toggleAbout}>×</div>
            <div className="about-content">
              <div className="about-logo"></div>
              <h1 className="about-title">Portfolio OS</h1>
              <p className="about-version">Version 2026.04 (Beta)</p>
              <div className="about-details">
                <div className="about-row">
                  <span className="about-label">Built by</span>
                  <span className="about-value">Kamran Gasimov</span>
                </div>
                <div className="about-row">
                  <span className="about-label">Location</span>
                  <span className="about-value">South Korea</span>
                </div>
                <div className="about-row">
                  <span className="about-label">Tech Stack</span>
                  <span className="about-value">React, TypeScript, CSS</span>
                </div>
              </div>
              <div className="about-footer">
                <p>© 2026 Kamran Gasimov. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main 
        className={`desktop-surface ${isMobile ? 'mobile' : ''}`}
        ref={desktopRef}
        onMouseDown={isMobile ? undefined : onMouseDown}
        onMouseMove={isMobile ? undefined : onMouseMove}
        onMouseUp={isMobile ? undefined : onMouseUp}
      >
        {!isMobile && selectionBox && (
          <div 
            className="selection-box"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.current.x),
              top: Math.min(selectionBox.start.y, selectionBox.current.y),
              width: Math.abs(selectionBox.start.x - selectionBox.current.x),
              height: Math.abs(selectionBox.start.y - selectionBox.current.y),
            }}
          />
        )}

        {isMobile ? (
          <div className="widgets-container">
            <div 
              className={`intro-widget ${selectedWidgets.includes('intro') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'intro' ? 'dragging' : ''}`}
              onClick={() => openApp('resume')}
            >
              <div className="intro-content">
                <h1 className="intro-name">Kamran Gasimov</h1>
                <p className="intro-tagline">Full-stack developer crafting elegant solutions</p>
                <p className="intro-subtagline">Building beautiful web experiences with modern technologies</p>
              </div>
            </div>

            <div className="widgets-row">
              <div 
                className={`profile-widget ${selectedWidgets.includes('profile') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'profile' ? 'dragging' : ''}`}
                onClick={() => openApp('resume')}
              >
                <img src="/me.png" alt="Kamran Gasimov" className="profile-image" draggable="false" />
              </div>

              <div 
                className={`calendar-widget ${selectedWidgets.includes('calendar') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'calendar' ? 'dragging' : ''}`}
                onMouseDown={undefined}
                onClick={undefined}
              >
                <div className="calendar-content">
                  <div className="calendar-month">{new Date().toLocaleString('default', { month: 'long' })}</div>
                  <div className="calendar-day">{new Date().getDate()}</div>
                  <div className="calendar-weekday">{new Date().toLocaleString('default', { weekday: 'long' })}</div>
                </div>
              </div>
            </div>

            <MusicWidget 
              className={`${selectedWidgets.includes('music') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'music' ? 'dragging' : ''}`}
            />
          </div>
        ) : (
          <>
            <div 
              className={`intro-widget ${selectedWidgets.includes('intro') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'intro' ? 'dragging' : ''}`}
              style={{
                left: widgetPositions.intro.x,
                top: widgetPositions.intro.y
              }}
              onMouseDown={(e) => handleWidgetMouseDown(e, 'intro')}
              onClick={() => openApp('resume')}
            >
              <div className="intro-content">
                <h1 className="intro-name">Kamran Gasimov</h1>
                <p className="intro-tagline">Full-stack developer crafting elegant solutions</p>
                <p className="intro-subtagline">Building beautiful web experiences with modern technologies</p>
              </div>
            </div>

            <div 
              className={`profile-widget ${selectedWidgets.includes('profile') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'profile' ? 'dragging' : ''}`}
              style={{
                left: widgetPositions.profile.x,
                top: widgetPositions.profile.y
              }}
              onMouseDown={(e) => handleWidgetMouseDown(e, 'profile')}
              onClick={() => openApp('resume')}
            >
              <img src="/me.png" alt="Kamran Gasimov" className="profile-image" draggable="false" />
            </div>

            <div 
              className={`calendar-widget ${selectedWidgets.includes('calendar') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'calendar' ? 'dragging' : ''}`}
              style={{
                left: widgetPositions.calendar.x,
                top: widgetPositions.calendar.y
              }}
              onMouseDown={(e) => handleWidgetMouseDown(e, 'calendar')}
            >
              <div className="calendar-content">
                <div className="calendar-month">{new Date().toLocaleString('default', { month: 'long' })}</div>
                <div className="calendar-day">{new Date().getDate()}</div>
                <div className="calendar-weekday">{new Date().toLocaleString('default', { weekday: 'long' })}</div>
              </div>
            </div>

            <div 
              className={`notepad-widget ${selectedWidgets.includes('notepad') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'notepad' ? 'dragging' : ''}`}
              style={{
                left: widgetPositions.notepad.x,
                top: widgetPositions.notepad.y
              }}
              onMouseDown={(e) => handleWidgetMouseDown(e, 'notepad')}
            >
              <div className="notepad-header">README.txt</div>
              <textarea 
                className="notepad-content"
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()} // Allow clicking textarea for editing
                spellCheck={false}
              />
            </div>

            <MusicWidget 
              className={`${selectedWidgets.includes('music') ? 'selected' : ''} ${draggingItem?.type === 'widget' && draggingItem?.id === 'music' ? 'dragging' : ''}`}
              style={{
                left: widgetPositions.music?.x || 40,
                top: widgetPositions.music?.y || 580
              }}
              onMouseDown={(e) => handleWidgetMouseDown(e, 'music')}
            />
          </>
        )}

        <div className="desktop-icons">
          {dockItems.map((item) => (
            <DesktopIcon 
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              isMobile={isMobile}
              isSelected={selectedIcons.includes(item.id)}
              style={isMobile ? {} : (iconPositions[item.id] ? {
                left: iconPositions[item.id].x,
                top: iconPositions[item.id].y
              } : { display: 'none' })}
              onSelect={(e) => {
                e.stopPropagation();
                setSelectedIcons([item.id]);
                setSelectedWidgets([]);
              }}
              onDoubleClick={() => openApp(item.id)}
              onMouseDown={isMobile ? undefined : (e) => handleIconMouseDown(e, item.id)}
            />
          ))}
        </div>

        {openApps.map((appState) => {
          const appId = appState.id;
          const isMinimized = minimizedApps.includes(appId);
          const isMaximized = maximizedApps.includes(appId);
          const isMinimizing = appState.isMinimizing;
          const app = dockItems.find(item => item.id === appId);
          const project = projects.find(p => p.id === appId);
          const pos = windowPositions[appId] || { x: 40, y: 40 };
          
          return (
            <Window
              key={appId}
              id={appId}
              title={app?.label || ''}
              isActive={activeApp === appId}
              isMinimized={isMinimized}
              isMaximized={isMaximized}
              isMinimizing={isMinimizing}
              isClosing={appState.isClosing}
              isDragging={draggingItem?.type === 'window' && draggingItem?.id === appId}
              isMobile={isMobile}
              onClose={() => triggerCloseApp(appId)}
              onMinimize={() => triggerMinimizeApp(appId)}
              onMinimizeEnd={() => finalizeMinimizeApp(appId)}
              onMaximize={() => toggleMaximizeApp(appId)}
              onFocus={() => focusApp(appId)}
              onAnimationEnd={() => finalizeCloseApp(appId)}
              onHeaderMouseDown={(e) => handleWindowHeaderMouseDown(e, appId)}
              style={isMobile || isMaximized ? {} : {
                left: pos.x,
                top: pos.y
              }}
            >
              {project && <ProjectSection project={project} sectionId={appId} />}
              {appId === 'resume' && <ResumeSection />}
              {appId === 'resume-pdf' && (
                <div className="section-content pdf-viewer-section">
                  <iframe 
                    src="/resume.pdf#view=FitH&toolbar=0" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 'none' }}
                    title="Resume PDF"
                  />
                </div>
              )}
              {appId === 'contact' && (
                <div className="section-content contact-section">
                  <div className="contact-content">
                    <h2 className="contact-heading">Let's Connect</h2>
                    <p className="contact-text">Interested in working together? I'd love to hear from you.</p>
                    <div className="contact-links">
                      <a href="mailto:kamran.qasimoff@gmail.com" className="contact-link-button">
                        <AppIcon name="Mail" size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                        kamran.qasimoff@gmail.com
                      </a>
                      <div className="contact-social-grid">
                        <a href="https://x.com/kamrangas" target="_blank" rel="noopener noreferrer" className="contact-social-link">𝕏 x.com/kamrangas</a>
                        <a href="https://github.com/malore350" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                          </svg>
                          github.com/malore350
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Window>
          );
        })}
      </main>

      {!isMobile && <Dock openApps={openAppIds} activeApp={activeApp} isMobile={isMobile} onAppClick={handleDockClick} />}
    </div>
  );
}

export default App;
