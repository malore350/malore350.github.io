import { dockItems } from '../data/dockItems';
import './Dock.css';

interface DockProps {
  openApps: string[];
  activeApp: string;
  onAppClick: (id: string) => void;
}

function Dock({ openApps, activeApp, onAppClick }: DockProps) {
  return (
    <nav className="dock" aria-label="Desktop navigation">
      <ul className="dock-list">
        {dockItems.map((item) => {
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
                  {item.icon}
                </span>
                {isOpen && <span className="dock-indicator" />}
                <span className="dock-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Dock;
