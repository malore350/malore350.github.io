export interface KWordFile {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'kword_files';

export function getKWordFiles(): KWordFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveKWordFile(file: KWordFile) {
  const files = getKWordFiles();
  const idx = files.findIndex((f) => f.id === file.id);
  const updated = { ...file, updatedAt: Date.now() };
  if (idx >= 0) {
    files[idx] = updated;
  } else {
    files.push(updated);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  return updated;
}

export function deleteKWordFile(id: string) {
  const files = getKWordFiles().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export function createKWordFile(name: string): KWordFile {
  const cleanName = name.replace(/\.kword$/i, '').trim() || 'Untitled';
  const file: KWordFile = {
    id: `kword-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: `${cleanName}.kword`,
    content: `<h1>${cleanName}</h1>\n<p>Start writing your document here. Use the toolbar above to format your text.</p>`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveKWordFile(file);
  return file;
}

export function renameKWordFile(id: string, newName: string) {
  const files = getKWordFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx >= 0) {
    const cleanName = newName.replace(/\.kword$/i, '').trim();
    if (cleanName) {
      files[idx] = { ...files[idx], name: `${cleanName}.kword`, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    }
  }
}
