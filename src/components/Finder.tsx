import { useState, useEffect } from 'react';
import AppIcon from './AppIcon';
import { dockItems } from '../data/dockItems';
import { getActiveKWordFiles, getTrashedKWordFiles, restoreKWordFile, permanentlyDeleteKWordFile, emptyTrash, type KWordFile } from '../hooks/useKWordFiles';
import './Finder.css';

interface FinderProps {
  onOpenApp: (id: string, fileId?: string) => void;
}

type FolderId = 'recents' | 'applications' | 'desktop' | 'documents' | 'downloads' | 'pictures' | 'trash';

interface FinderItem {
  id: string;
  label: string;
  icon: string;
  type: 'app' | 'file' | 'folder';
  thumbnail?: string;
}

const Finder = ({ onOpenApp }: FinderProps) => {
  const [activeFolder, setActiveFolder] = useState<FolderId>('desktop');
  const [kwordFiles, setKwordFiles] = useState<KWordFile[]>([]);
  const [trashFiles, setTrashFiles] = useState<KWordFile[]>([]);

  useEffect(() => {
    setKwordFiles(getActiveKWordFiles());
    const handler = () => setKwordFiles(getActiveKWordFiles());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    setTrashFiles(getTrashedKWordFiles());
    const handler = () => setTrashFiles(getTrashedKWordFiles());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const folder = (e as CustomEvent).detail as FolderId;
      if (folder) setActiveFolder(folder);
    };
    window.addEventListener('finder-open-folder', handler);
    return () => window.removeEventListener('finder-open-folder', handler);
  }, []);

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
      { id: 'resume-pdf', label: 'Resume.pdf', icon: 'FileText', type: 'file' },
      ...kwordFiles.map(file => ({
        id: file.id,
        label: file.name,
        icon: 'Type',
        type: 'file' as const
      }))
    ],
    downloads: [],
    pictures: [
      { id: 'me-png', label: 'me.png', icon: 'Image', type: 'file', thumbnail: '/me.png' }
    ],
    trash: trashFiles.map(file => ({
      id: file.id,
      label: file.name,
      icon: 'Type',
      type: 'file' as const
    })),
  };

  const sidebarItems = [
    { id: 'recents' as FolderId, label: 'Recents', icon: 'Clock' },
    { id: 'applications' as FolderId, label: 'Applications', icon: 'Layout' },
    { id: 'desktop' as FolderId, label: 'Desktop', icon: 'Monitor' },
    { id: 'documents' as FolderId, label: 'Documents', icon: 'Folder' },
    { id: 'downloads' as FolderId, label: 'Downloads', icon: 'Download' },
    { id: 'pictures' as FolderId, label: 'Pictures', icon: 'Image' },
    { id: 'trash' as FolderId, label: 'Trash', icon: 'Trash2' },
  ];

  const handleRestore = (id: string) => {
    restoreKWordFile(id);
    setTrashFiles(getTrashedKWordFiles());
    setKwordFiles(getActiveKWordFiles());
  };

  const handlePermanentDelete = (id: string) => {
    permanentlyDeleteKWordFile(id);
    setTrashFiles(getTrashedKWordFiles());
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    setTrashFiles([]);
  };

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
          {activeFolder === 'trash' ? (
            <div className="trash-view">
              <div className="trash-toolbar">
                <button 
                  className="empty-trash-btn"
                  disabled={trashFiles.length === 0}
                  onClick={handleEmptyTrash}
                >
                  <AppIcon name="Trash2" size={14} />
                  Empty Trash
                </button>
              </div>
              {trashFiles.length === 0 ? (
                <div className="empty-folder">No items in Trash</div>
              ) : (
                <div className="trash-list">
                  {trashFiles.map(file => (
                    <div key={file.id} className="trash-item">
                      <div className="trash-item-icon">
                        <AppIcon name="Type" size={24} />
                      </div>
                      <div className="trash-item-info">
                        <div className="trash-item-name">{file.name}</div>
                        <div className="trash-item-date">
                          Deleted {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <div className="trash-item-actions">
                        <button 
                          className="trash-action-btn restore-btn"
                          onClick={() => handleRestore(file.id)}
                        >
                          <AppIcon name="RotateCcw" size={14} />
                          Restore
                        </button>
                        <button 
                          className="trash-action-btn delete-btn"
                          onClick={() => handlePermanentDelete(file.id)}
                        >
                          <AppIcon name="Trash2" size={14} />
                          Delete Permanently
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>{folders[activeFolder].length === 0 ? (
              <div className="empty-folder">No items</div>
            ) : (
              <div className="finder-grid">
                {folders[activeFolder].map(item => (
                  <div 
                    key={item.id} 
                    className="finder-grid-item"
                    onDoubleClick={() => {
                      if (item.id.startsWith('kword-')) {
                        onOpenApp('kword', item.id);
                      } else {
                        onOpenApp(item.id);
                      }
                    }}
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
            )}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finder;
