import { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import AppIcon from './AppIcon';
import {
  getKWordFiles,
  saveKWordFile,
  deleteKWordFile,
  createKWordFile,
  type KWordFile,
} from '../hooks/useKWordFiles';
import './KWord.css';

export interface KWordHandle {
  requestClose: () => boolean;
}

interface KWordProps {
  fileId?: string;
  onOpenFile?: (fileId: string) => void;
  onClose?: () => void;
  onTitleChange?: (title: string) => void;
}

const KWord = forwardRef<KWordHandle, KWordProps>(function KWord(
  { fileId, onOpenFile, onClose, onTitleChange },
  ref
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'menu' | 'editor'>(fileId ? 'editor' : 'menu');
  const [files, setFiles] = useState<KWordFile[]>([]);
  const [currentFile, setCurrentFile] = useState<KWordFile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadFiles = useCallback(() => {
    setFiles(getKWordFiles());
  }, []);

  useEffect(() => {
    loadFiles();
    const handleStorage = () => loadFiles();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadFiles]);

  useEffect(() => {
    if (fileId) {
      const all = getKWordFiles();
      const f = all.find((x) => x.id === fileId);
      if (f) {
        setCurrentFile(f);
        setMode('editor');
        setHasChanges(false);
        onTitleChange?.(f.name);
      } else {
        setMode('menu');
        onTitleChange?.('KWord');
      }
    } else {
      setMode('menu');
      setCurrentFile(null);
      setHasChanges(false);
      onTitleChange?.('KWord');
    }
  }, [fileId, onTitleChange]);

  useEffect(() => {
    if (mode === 'editor' && editorRef.current && currentFile) {
      editorRef.current.innerHTML = currentFile.content;
      setHasChanges(false);
    }
  }, [mode, currentFile?.id]);

  const execCommand = useCallback((command: string, value: string = '') => {
    document.execCommand(command, false, value);
  }, []);

  const handleInput = useCallback(() => {
    if (mode === 'editor') {
      setHasChanges(true);
    }
  }, [mode]);

  const handleSave = useCallback(() => {
    if (!currentFile || !editorRef.current) return;
    const updated = saveKWordFile({
      ...currentFile,
      content: editorRef.current.innerHTML,
    });
    setCurrentFile(updated);
    setHasChanges(false);
    loadFiles();
  }, [currentFile, loadFiles]);

  const handleCreateNew = useCallback(() => {
    const file = createKWordFile('Untitled');
    loadFiles();
    onOpenFile?.(file.id);
  }, [loadFiles, onOpenFile]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteKWordFile(id);
      loadFiles();
      if (currentFile?.id === id) {
        setMode('menu');
        setCurrentFile(null);
        setHasChanges(false);
        onTitleChange?.('KWord');
      }
      setDeleteConfirmId(null);
    },
    [currentFile, loadFiles, onTitleChange]
  );

  const performClose = useCallback(() => {
    setShowUnsavedDialog(false);
    onClose?.();
  }, [onClose]);

  const handleSaveAndClose = useCallback(() => {
    handleSave();
    performClose();
  }, [handleSave, performClose]);

  const handleDiscardAndClose = useCallback(() => {
    performClose();
  }, [performClose]);

  const handleCancelClose = useCallback(() => {
    setShowUnsavedDialog(false);
  }, []);

  useImperativeHandle(ref, () => ({
    requestClose: () => {
      if (mode === 'editor' && hasChanges) {
        setShowUnsavedDialog(true);
        return false;
      }
      return true;
    },
  }));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (mode === 'editor') {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode, handleSave]);

  if (mode === 'menu') {
    return (
      <div className="kword-container kword-menu">
        <div className="kword-menu-header">
          <div className="kword-menu-title">
            <AppIcon name="Type" size={28} strokeWidth={1.5} />
            <span>KWord</span>
          </div>
          <button className="kword-new-doc-btn" onClick={handleCreateNew}>
            <AppIcon name="FileText" size={14} />
            New Document
          </button>
        </div>
        <div className="kword-menu-content">
          {files.length === 0 ? (
            <div className="kword-empty">
              <AppIcon name="FileText" size={48} strokeWidth={1} />
              <p>No documents yet</p>
              <span>Create a new document to get started</span>
            </div>
          ) : (
            <div className="kword-file-list">
              {files.map((file) => (
                <div key={file.id} className="kword-file-item">
                  <div
                    className="kword-file-info"
                    onClick={() => onOpenFile?.(file.id)}
                  >
                    <div className="kword-file-icon">
                      <AppIcon name="Type" size={22} strokeWidth={1.5} />
                    </div>
                    <div className="kword-file-meta">
                      <div className="kword-file-name">{file.name}</div>
                      <div className="kword-file-date">
                        {new Date(file.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    className="kword-file-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(file.id);
                    }}
                    title="Delete"
                  >
                    <AppIcon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {deleteConfirmId && (
          <div className="kword-dialog-overlay">
            <div className="kword-dialog">
              <div className="kword-dialog-title">Delete Document?</div>
              <div className="kword-dialog-body">
                Are you sure you want to delete &quot;
                {files.find((f) => f.id === deleteConfirmId)?.name}&quot;? This action cannot be undone.
              </div>
              <div className="kword-dialog-actions">
                <button
                  className="kword-dialog-btn secondary"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  className="kword-dialog-btn danger"
                  onClick={() => handleDelete(deleteConfirmId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="kword-container">
      <div className="kword-toolbar">
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => execCommand('bold')}
            title="Bold"
          >
            <AppIcon name="Bold" size={14} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => execCommand('italic')}
            title="Italic"
          >
            <AppIcon name="Italic" size={14} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => execCommand('underline')}
            title="Underline"
          >
            <AppIcon name="Underline" size={14} />
          </button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
          >
            <AppIcon name="AlignLeft" size={14} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
          >
            <AppIcon name="AlignCenter" size={14} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
          >
            <AppIcon name="AlignRight" size={14} />
          </button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <AppIcon name="List" size={14} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          >
            <AppIcon name="ListOrdered" size={14} />
          </button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button
            className={`toolbar-btn save-btn ${hasChanges ? 'unsaved' : ''}`}
            onClick={handleSave}
            title="Save (Cmd+S)"
          >
            <AppIcon name="FileText" size={14} />
            <span>Save</span>
          </button>
        </div>
        {hasChanges && (
          <div className="kword-unsaved-indicator">Unsaved changes</div>
        )}
      </div>
      <div className="kword-document-area">
        <div className="kword-page">
          <div
            ref={editorRef}
            className="kword-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
          />
        </div>
      </div>

      {showUnsavedDialog && (
        <div className="kword-dialog-overlay">
          <div className="kword-dialog">
            <div className="kword-dialog-title">Save changes?</div>
            <div className="kword-dialog-body">
              Do you want to save the changes to &quot;{currentFile?.name}&quot;?
            </div>
            <div className="kword-dialog-actions">
              <button
                className="kword-dialog-btn secondary"
                onClick={handleCancelClose}
              >
                Cancel
              </button>
              <button
                className="kword-dialog-btn danger"
                onClick={handleDiscardAndClose}
              >
                Don&apos;t Save
              </button>
              <button
                className="kword-dialog-btn primary"
                onClick={handleSaveAndClose}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default KWord;
