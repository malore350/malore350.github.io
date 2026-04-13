import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import { projects } from './data/projects';
import Dock from './components/Dock';
import { dockItems } from './data/dockItems';
import MenuBar from './components/MenuBar';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import ProjectSection from './components/ProjectSection';

interface OpenApp {
  id: string;
  isClosing: boolean;
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
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Project icons in 2x2 grid on the right
  const projectIcons = dockItems.filter(item => item.id !== 'contact');
  projectIcons.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    positions[item.id] = {
      x: windowWidth - margin - iconWidth - (1 - col) * (iconWidth + 10),
      y: 40 + row * iconHeight
    };
  });

  // Contact icon at bottom right
  const contactIcon = dockItems.find(item => item.id === 'contact');
  if (contactIcon) {
    positions[contactIcon.id] = {
      x: windowWidth - margin - iconWidth,
      y: windowHeight - 100 - iconHeight - margin // Above dock
    };
  }

  return positions;
};

const calculateInitialWidgetPositions = () => {
  return {
    intro: { x: 40, y: 60 },
    profile: { x: 40, y: 340 }
  };
};

function App() {
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [activeApp, setActiveApp] = useState<string>('Finder');
  const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
  
  // Selection & Dragging state
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [iconPositions, setIconPositions] = useState<Record<string, Position>>(calculateInitialIconPositions);
  const [widgetPositions, setWidgetPositions] = useState<Record<string, Position>>(calculateInitialWidgetPositions);
  const [windowPositions, setWindowPositions] = useState<Record<string, Position>>({});
  
  const [selectionBox, setSelectionBox] = useState<{ start: Point, current: Point } | null>(null);
  const [draggingItem, setDraggingItem] = useState<{ type: 'icon' | 'widget' | 'window', id: string, offset: Point } | null>(null);
  
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
        if (existing.isClosing) {
          return prev.map(app => app.id === id ? { ...app, isClosing: false } : app);
        }
        return prev;
      }
      return [...prev, { id, isClosing: false }];
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
    // Optionally remove position, but keeping it might be better if user reopens
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setMinimizedApps((prev) => [...prev, id]);
    if (activeApp === id) {
      const remaining = openApps.filter((app) => app.id !== id && !minimizedApps.includes(app.id) && !app.isClosing);
      setActiveApp(remaining.length > 0 ? remaining[remaining.length - 1].id : 'Finder');
    }
  }, [activeApp, openApps, minimizedApps]);

  const focusApp = useCallback((id: string) => {
    if (minimizedApps.includes(id)) {
      setMinimizedApps((prev) => prev.filter((appId) => appId !== id));
    }
    setActiveApp(id);
  }, [minimizedApps]);

  const handleDockClick = (id: string) => {
    const app = openApps.find(a => a.id === id);
    if (app && !app.isClosing) {
      if (activeApp === id && !minimizedApps.includes(id)) {
        minimizeApp(id);
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
          const iconBounds = { left: pos.x, top: pos.y, right: pos.x + 80, bottom: pos.y + 100 };
          if (!(iconBounds.left > x2 || iconBounds.right < x1 || iconBounds.top > y2 || iconBounds.bottom < y1)) {
            newlySelectedIcons.push(item.id);
          }
        }
      });
      setSelectedIcons(newlySelectedIcons);

      // Widgets
      const newlySelectedWidgets: string[] = [];
      const widgetBoundsMap: Record<string, { w: number, h: number }> = {
        intro: { w: 400, h: 200 },
        profile: { w: 220, h: 220 }
      };
      Object.keys(widgetPositions).forEach(id => {
        const pos = widgetPositions[id];
        const dim = widgetBoundsMap[id];
        const bounds = { left: pos.x, top: pos.y, right: pos.x + dim.w, bottom: pos.y + dim.h };
        if (!(bounds.left > x2 || bounds.right < x1 || bounds.top > y2 || bounds.bottom < y1)) {
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
    focusApp(id);
    const pos = windowPositions[id] || { x: 40, y: 40 };
    setDraggingItem({
      type: 'window',
      id,
      offset: { x: e.clientX - pos.x, y: e.clientY - pos.y }
    });
  };

  const openAppIds = openApps.map(app => app.id);

  return (
    <div className="desktop-environment" onClick={() => { setSelectedIcons([]); setSelectedWidgets([]); }}>
      <MenuBar activeAppName={getAppName(activeApp)} />
      
      <main 
        className="desktop-surface" 
        ref={desktopRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {selectionBox && (
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

        <div 
          className={`intro-widget ${selectedWidgets.includes('intro') ? 'selected' : ''}`}
          style={{
            left: widgetPositions.intro.x,
            top: widgetPositions.intro.y
          }}
          onMouseDown={(e) => handleWidgetMouseDown(e, 'intro')}
        >
          <div className="intro-content">
            <h1 className="intro-name">Kamran Gasimov</h1>
            <p className="intro-tagline">Full-stack developer crafting elegant solutions</p>
            <p className="intro-subtagline">Building beautiful web experiences with modern technologies</p>
          </div>
        </div>

        <div 
          className={`profile-widget ${selectedWidgets.includes('profile') ? 'selected' : ''}`}
          style={{
            left: widgetPositions.profile.x,
            top: widgetPositions.profile.y
          }}
          onMouseDown={(e) => handleWidgetMouseDown(e, 'profile')}
        >
          <img src="/me.png" alt="Kamran Gasimov" className="profile-image" draggable="false" />
        </div>

        <div className="desktop-icons">
          {dockItems.map((item) => (
            <DesktopIcon 
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              isSelected={selectedIcons.includes(item.id)}
              style={iconPositions[item.id] ? {
                left: iconPositions[item.id].x,
                top: iconPositions[item.id].y
              } : { display: 'none' }}
              onSelect={(e) => {
                e.stopPropagation();
                setSelectedIcons([item.id]);
                setSelectedWidgets([]);
              }}
              onDoubleClick={() => openApp(item.id)}
              onMouseDown={(e) => handleIconMouseDown(e, item.id)}
            />
          ))}
        </div>

        {openApps.map((appState) => {
          const appId = appState.id;
          const isMinimized = minimizedApps.includes(appId);
          const app = dockItems.find(item => item.id === appId);
          const pos = windowPositions[appId] || { x: 40, y: 40 };
          
          return (
            <Window
              key={appId}
              id={appId}
              title={app?.label || ''}
              isActive={activeApp === appId}
              isMinimized={isMinimized}
              isClosing={appState.isClosing}
              onClose={() => triggerCloseApp(appId)}
              onMinimize={() => minimizeApp(appId)}
              onFocus={() => focusApp(appId)}
              onAnimationEnd={() => finalizeCloseApp(appId)}
              onHeaderMouseDown={(e) => handleWindowHeaderMouseDown(e, appId)}
              style={{
                left: pos.x,
                top: pos.y
              }}
            >
              {appId === 'gamehub' && <ProjectSection project={projects[0]} sectionId="gamehub" />}
              {appId === 'cryptopro' && <ProjectSection project={projects[1]} sectionId="cryptopro" />}
              {appId === 'unigo' && <ProjectSection project={projects[2]} sectionId="unigo" />}
              {appId === 'ttyt' && <ProjectSection project={projects[3]} sectionId="ttyt" />}
              {appId === 'contact' && (
                <div className="section-content contact-section">
                  <div className="contact-content">
                    <h2 className="contact-heading">Let's Connect</h2>
                    <p className="contact-text">Interested in working together? I'd love to hear from you.</p>
                    <a href="mailto:kamran@example.com" className="contact-email">kamran@example.com</a>
                  </div>
                </div>
              )}
            </Window>
          );
        })}
      </main>

      <Dock openApps={openAppIds} activeApp={activeApp} onAppClick={handleDockClick} />
    </div>
  );
}

export default App;
