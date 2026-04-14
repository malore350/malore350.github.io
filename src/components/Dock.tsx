import { dockItems } from '../data/dockItems';
import AppIcon from './AppIcon';
import './Dock.css';

interface DockProps {
  openApps: string[];
  activeApp: string;
  isMobile?: boolean;
  onAppClick: (id: string) => void;
}

function Dock({ openApps, activeApp, isMobile, onAppClick }: DockProps) {
  return (
    <nav className={`dock ${isMobile ? 'mobile' : ''}`} aria-label="Desktop navigation">
      <ul className="dock-list">
        {dockItems.filter(item => !item.hideFromDock).map((item) => {
          const isOpen = openApps.includes(item.id);
          const isActive = activeApp === item.id;
          
          return (
            <li key={item.id} className="dock-item">
              <button
                type="button"
                className={`dock-button ${isActive ? 'active' : ''}`}
                onClick={() => onAppClick(item.id)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Open ${item.label}`}
              >
                <span className={`dock-icon icon-${item.id}`} aria-hidden="true">
                  <AppIcon name={item.icon} size={isMobile ? 24 : 34} strokeWidth={1.5} />
                </span>
                {isOpen && !isMobile && <span className="dock-indicator" />}
                {!isMobile && <span className="dock-label">{item.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Dock;
