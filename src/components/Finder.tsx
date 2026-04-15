import { useState } from 'react';
import AppIcon from './AppIcon';
import { dockItems } from '../data/dockItems';
import './Finder.css';

interface FinderProps {
  onOpenApp: (id: string) => void;
}

type FolderId = 'recents' | 'applications' | 'desktop' | 'documents' | 'downloads' | 'pictures';

interface FinderItem {
  id: string;
  label: string;
  icon: string;
  type: 'app' | 'file' | 'folder';
  thumbnail?: string;
}

const Finder = ({ onOpenApp }: FinderProps) => {
  const [activeFolder, setActiveFolder] = useState<FolderId>('desktop');

  const folders: Record<FolderId, FinderItem[]> = {
    recents: [
       ...dockItems.filter(item => item.id !== 'finder' && !item.hideFromDock).map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        type: 'app' as const
      })),
      { id: 'me-png', label: 'me.png', icon: 'Image', type: 'file', thumbnail: '/me.png' }
    ],
    applications: [
      ...dockItems.filter(item => item.id !== 'finder' && !item.hideFromDock).map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        type: 'app' as const
      }))
    ],
    desktop: [
      ...dockItems.filter(item => item.id !== 'finder' && !item.hideFromDesktop).map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        type: 'app' as const
      }))
    ],
    documents: [
      { id: 'resume-pdf', label: 'Resume.pdf', icon: 'FileText', type: 'file' }
    ],
    downloads: [],
    pictures: [
      { id: 'me-png', label: 'me.png', icon: 'Image', type: 'file', thumbnail: '/me.png' }
    ]
  };

  const sidebarItems = [
    { id: 'recents' as FolderId, label: 'Recents', icon: 'Clock' },
    { id: 'applications' as FolderId, label: 'Applications', icon: 'Layout' },
    { id: 'desktop' as FolderId, label: 'Desktop', icon: 'Monitor' },
    { id: 'documents' as FolderId, label: 'Documents', icon: 'Folder' },
    { id: 'downloads' as FolderId, label: 'Downloads', icon: 'Download' },
    { id: 'pictures' as FolderId, label: 'Pictures', icon: 'Image' },
  ];

  return (
    <div className="finder-container">
      <div className="finder-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-title">Favorites</div>
          {sidebarItems.map(item => (
            <div 
              key={item.id} 
              className={`sidebar-item ${activeFolder === item.id ? 'active' : ''}`}
              onClick={() => setActiveFolder(item.id)}
            >
              <AppIcon name={item.icon} size={16} className="sidebar-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="finder-main">
        <div className="finder-toolbar">
          <div className="toolbar-nav">
             <button className="nav-btn"><AppIcon name="SkipBack" size={14} /></button>
             <button className="nav-btn"><AppIcon name="SkipForward" size={14} /></button>
          </div>
          <div className="toolbar-title">{sidebarItems.find(i => i.id === activeFolder)?.label}</div>
          <div className="toolbar-actions">
            <AppIcon name="Search" size={14} />
          </div>
        </div>
        <div className="finder-content">
          {folders[activeFolder].length === 0 ? (
            <div className="empty-folder">No items</div>
          ) : (
            <div className="finder-grid">
              {folders[activeFolder].map(item => (
                <div 
                  key={item.id} 
                  className="finder-grid-item"
                  onDoubleClick={() => onOpenApp(item.id)}
                >
                  <div className={`finder-icon-wrapper icon-${item.id}`}>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.label} className="finder-thumbnail" />
                    ) : (
                      <AppIcon name={item.icon} size={40} strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="finder-item-label">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finder;
